// Tests the seven-day retention sweep.
//
// It destroys data on live claims and runs unattended on a cron, so what
// matters is every way it must REFUSE. None of this is reachable by clicking,
// and a bug here is not recoverable: a paid client's bank details cleared off
// a claim we still have to lodge cannot be got back.
//
// Run: node tests/claims-sweep.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Module = require('node:module');

let n = 0, failed = 0;
const eq = (name, got, want) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++; console.log(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
  } else console.log(`PASS  ${name}`);
};
const ok = (name, cond) => eq(name, !!cond, true);

process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';

let rows = [];
let queries = [];
let patches = [];
let audits = [];
let patchReply = null;   // null -> echo the row back (the write succeeded)
let selectThrows = null;

const dbFake = {
  selectClaims: async (q) => {
    queries.push(q);
    if (selectThrows) throw selectThrows;
    return rows;
  },
  patchClaims: async (q, patch) => {
    patches.push({ q, patch });
    return patchReply === null ? [{ id: 'x' }] : patchReply;
  },
  insertAudit: async (id, ev, detail) => { audits.push({ id, ev, detail }); },
};

const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  return origLoad.apply(this, arguments);
};
global.fetch = async (u) => { throw new Error(`unexpected network call to ${u}`); };

function load() {
  delete require.cache[require.resolve('../api/claims-sweep.js')];
  return require('../api/claims-sweep.js');
}
async function call({ method = 'GET', auth, query = {} } = {}) {
  queries = []; patches = []; audits = [];
  const handler = load();
  let code = null, payload = null;
  const res = {
    status(c) { code = c; return this; },
    json(p) { payload = p; return this; },
    end() { return this; }, setHeader() {},
  };
  const headers = auth === undefined ? {} : { authorization: auth };
  await handler({ method, headers, query }, res);
  return { code, payload };
}

const SECRET = 'cron-secret-value';
const GOOD = `Bearer ${SECRET}`;
const unpaid = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: 'DASP00020140',
  created_at: '2026-08-20T00:00:00Z',
  payment_status: 'unpaid',
  paid_at: null,
  ...over,
});

/* ---------- it must be closed unless deliberately opened ---------- */

{
  delete process.env.CRON_SECRET;
  rows = [unpaid()];
  const r = await call({ auth: GOOD });
  eq('no CRON_SECRET refuses outright', r.code, 503);
  eq('an unconfigured sweep changes nothing', patches.length, 0);
  eq('and does not even look', queries.length, 0);
}
{
  /* The specific trap this avoids. api/cron-nudge.js guards with
     `if (cronSecret && ...)`, so clearing the variable there REMOVES the lock.
     On an endpoint that wipes fields off live claims that must be impossible. */
  delete process.env.CRON_SECRET;
  rows = [unpaid()];
  const r = await call({ auth: undefined });
  eq('an unset secret does not open the endpoint', r.code, 503);
  eq('an unset secret with no auth header still writes nothing', patches.length, 0);
}

process.env.CRON_SECRET = SECRET;

{
  rows = [unpaid()];
  const r = await call({ auth: undefined });
  eq('no auth header is unauthorized', r.code, 401);
  eq('unauthorized writes nothing', patches.length, 0);
}
{
  rows = [unpaid()];
  const r = await call({ auth: 'Bearer wrong' });
  eq('a wrong secret is unauthorized', r.code, 401);
  eq('a wrong secret writes nothing', patches.length, 0);
}
{
  rows = [unpaid()];
  const r = await call({ auth: SECRET });
  eq('the bare secret without Bearer is refused', r.code, 401);
}
{
  rows = [unpaid()];
  const r = await call({ method: 'POST', auth: GOOD });
  eq('POST is refused', r.code, 405);
  eq('a refused method writes nothing', patches.length, 0);
}
{
  // A trailing newline pasted into the Vercel variable must not lock the cron
  // out of its own endpoint. The value is trimmed; the header is not padded.
  process.env.CRON_SECRET = `${SECRET}\n`;
  rows = [unpaid()];
  const r = await call({ auth: GOOD });
  eq('a trailing newline in the variable still lets cron in', r.code, 200);
  process.env.CRON_SECRET = SECRET;
}

/* ---------- the filter is the safety, not the JavaScript ---------- */

{
  rows = [];
  await call({ auth: GOOD });
  const q = queries[0] || '';
  ok('only unpaid claims are selected', q.includes('payment_status=eq.unpaid'));
  ok('paid_at must be null as well', q.includes('paid_at=is.null'));
  ok('already-redacted rows are skipped', q.includes('redacted_at=is.null'));
  ok('and only rows past the cutoff', q.includes('created_at=lt.'));
  ok('the run is capped', q.includes('limit=200'));
  ok('oldest first', q.includes('order=created_at.asc'));
}
{
  rows = [];
  const r = await call({ auth: GOOD });
  const cutoff = new Date(r.payload.cutoff).getTime();
  const days = (Date.now() - cutoff) / 86400000;
  eq('the window is seven days', Math.round(days), 7);
  eq('and is reported', r.payload.retain_days, 7);
}

/* ---------- what it actually clears ---------- */

{
  rows = [unpaid()];
  const r = await call({ auth: GOOD });
  eq('one due claim is redacted', [r.code, r.payload.redacted], [200, 1]);
  const p = patches[0].patch;

  for (const f of ['tfn', 'passport_number', 'date_of_birth', 'client_ip',
    'bank_type', 'bank_account_name', 'bank_name', 'bank_swift', 'bank_bsb',
    'bank_account_number', 'address_line', 'address_city', 'address_region',
    'address_postcode', 'address_country']) {
    eq(`clears ${f}`, p[f], null);
  }
  ok('stamps redacted_at', typeof p.redacted_at === 'string' && p.redacted_at.length > 10);

  /* The kept set. Clearing any of these would cost the conversion numbers or
     the ability to follow an abandoned cart up, for no privacy gain: none of
     them is a government identifier, a bank account or a home address. */
  for (const f of ['full_name', 'email', 'phone', 'passport_country',
    'visa_subclass', 'visa_status', 'date_departed', 'order_number',
    'created_at', 'payment_status', 'fund_name', 'fund_member_number']) {
    eq(`keeps ${f}`, Object.prototype.hasOwnProperty.call(p, f), false);
  }
}
{
  rows = [unpaid()];
  await call({ auth: GOOD });
  const q = patches[0].q;
  ok('the write re-states unpaid', q.includes('payment_status=eq.unpaid'));
  ok('the write re-states paid_at is null', q.includes('paid_at=is.null'));
  ok('the write is once-only', q.includes('redacted_at=is.null'));
  ok('and targets one id', q.includes('id=eq.11111111-1111-1111-1111-111111111111'));
}
{
  rows = [unpaid()];
  await call({ auth: GOOD });
  eq('a redaction is audited', audits.map((a) => a.ev), ['redacted_unpaid']);
  ok('the audit says why', /unpaid for 7 days/.test(audits[0].detail));
}

/* ---------- it must never touch a paid claim ---------- */

{
  // The filter should make this unreachable. Asserted anyway, because the
  // thing it prevents cannot be undone.
  rows = [unpaid({ payment_status: 'paid', paid_at: '2026-08-21T00:00:00Z' })];
  const r = await call({ auth: GOOD });
  eq('a paid row that slips through is refused', r.payload.redacted, 0);
  eq('and nothing is written for it', patches.length, 0);
}
{
  rows = [unpaid({ payment_status: 'refunded' })];
  const r = await call({ auth: GOOD });
  eq('a refunded row is refused too', r.payload.redacted, 0);
  eq('nothing written for a refunded row', patches.length, 0);
}
{
  rows = [unpaid({ paid_at: '2026-08-21T00:00:00Z' })];
  const r = await call({ auth: GOOD });
  eq('unpaid with a paid_at is refused', r.payload.redacted, 0);
}
{
  // A payment that lands between the select and the write. The conditional
  // PATCH loses the race, returns no rows, and the data stays.
  rows = [unpaid()];
  patchReply = [];
  const r = await call({ auth: GOOD });
  patchReply = null;
  eq('losing the race redacts nothing', r.payload.redacted, 0);
  eq('and does not audit a redaction that did not happen', audits.length, 0);
  eq('but the attempt was made', patches.length, 1);
}

/* ---------- dry run ---------- */

{
  rows = [unpaid(), unpaid({ id: '2', order_number: 'DASP00020141' })];
  const r = await call({ auth: GOOD, query: { dry: '1' } });
  eq('a dry run reports', [r.code, r.payload.dry_run, r.payload.found], [200, true, 2]);
  eq('a dry run writes nothing', patches.length, 0);
  eq('a dry run audits nothing', audits.length, 0);
  eq('it lists what it would clear', r.payload.would_clear.length, 15);
  eq('and which claims', r.payload.claims.map((c) => c.order_number),
     ['DASP00020140', 'DASP00020141']);
  /* The report names fields and order numbers, never values. would_clear is a
     list of column names by design; what must not appear is anybody's data,
     and the per-claim entries carry two keys and no more. */
  eq('each claim is reported by reference and date only',
     [...new Set(r.payload.claims.flatMap((c) => Object.keys(c)))].sort(),
     ['created_at', 'order_number']);
  ok('no claim id is exposed either', !JSON.stringify(r.payload.claims).includes('1111'));
}
{
  rows = [unpaid()];
  const r = await call({ auth: GOOD, query: { dry: 'yes' } });
  eq('only dry=1 is a dry run, not any truthy value', r.payload.dry_run, undefined);
  eq('so dry=yes actually redacts', r.payload.redacted, 1);
}

/* ---------- nothing to do, and failure ---------- */

{
  rows = [];
  const r = await call({ auth: GOOD });
  eq('an empty sweep is a success', [r.code, r.payload.found, r.payload.redacted], [200, 0, 0]);
  eq('an empty sweep writes nothing', patches.length, 0);
}
{
  rows = Array.from({ length: 200 }, (_, i) => unpaid({ id: String(i), order_number: `DASP0002${1000 + i}` }));
  const r = await call({ auth: GOOD });
  eq('a full batch reports that it was capped', r.payload.capped, true);
  eq('and still redacts the batch', r.payload.redacted, 200);
}
{
  rows = [unpaid()];
  selectThrows = new Error('connect ETIMEDOUT');
  const r = await call({ auth: GOOD });
  selectThrows = null;
  eq('a database failure is a 500', r.code, 500);
  ok('and says nothing useful', !JSON.stringify(r.payload).includes('ETIMEDOUT'));
  eq('a failed sweep writes nothing', patches.length, 0);
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
