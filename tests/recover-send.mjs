// Tests the one-off recovery send for the September incident claims.
//
// It emails real clients about real money, and an email cannot be recalled.
// So what matters here is every way it must REFUSE, and the fact that it
// cannot send twice. A duplicate "your payment is confirmed" to someone who
// has been waiting three weeks is worse than silence.
//
// Run: node tests/recover-send.mjs
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
let audits = [];
let sent = [];
let existingAudits = new Set();
let sendThrows = null;
let selectThrows = null;

const dbFake = {
  selectClaims: async (q) => {
    queries.push(q);
    if (selectThrows) throw selectThrows;
    return rows;
  },
  hasAudit: async (id, ev) => existingAudits.has(`${id}:${ev}`),
  insertAudit: async (id, ev, detail) => { audits.push({ id, ev, detail }); },
};
const emailFake = {
  paymentConfirmed: async (c) => {
    if (sendThrows) throw sendThrows;
    sent.push(c.order_number);
  },
};

const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/email') return emailFake;
  return origLoad.apply(this, arguments);
};
global.fetch = async (u) => { throw new Error(`unexpected network call to ${u}`); };

function load() {
  delete require.cache[require.resolve('../api/admin-recover-send.js')];
  return require('../api/admin-recover-send.js');
}
async function call({ method = 'GET', query = {} } = {}) {
  queries = []; audits = []; sent = [];
  const handler = load();
  let code = null, payload = null;
  const res = {
    status(c) { code = c; return this; },
    json(p) { payload = p; return this; },
    end() { return this; }, setHeader() {},
  };
  await handler({ method, headers: {}, query }, res);
  return { code, payload };
}

const KEY = 'health-key-value';
const paid = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: 'DASP00020151',
  email: 'client@example.com',
  payment_status: 'paid',
  paid_at: '2026-08-27T00:00:00Z',
  stripe_customer_id: 'cus_ABC123',
  ...over,
});

/* ---------- it must be shut unless deliberately opened ---------- */

{
  delete process.env.HEALTH_KEY;
  rows = [paid()];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('no HEALTH_KEY set 404s', r.code, 404);
  eq('and sends nothing', sent.length, 0);
  eq('and does not even look', queries.length, 0);
}

process.env.HEALTH_KEY = KEY;

{
  rows = [paid()];
  const r = await call({ query: { apply: '1' } });
  eq('no key on the request 404s', r.code, 404);
  eq('no key sends nothing', sent.length, 0);
}
{
  rows = [paid()];
  const r = await call({ query: { key: 'wrong', apply: '1' } });
  eq('wrong key 404s rather than 401', r.code, 404);
  eq('wrong key sends nothing', sent.length, 0);
}
{
  const r = await call({ method: 'POST', query: { key: KEY } });
  eq('POST is refused', r.code, 405);
}

/* ---------- dry run is the default ---------- */

{
  rows = [paid()];
  const r = await call({ query: { key: KEY } });
  eq('no apply flag is a dry run', r.payload.dry_run, true);
  eq('a dry run sends nothing', sent.length, 0);
  eq('a dry run writes no marker', audits.length, 0);
  eq('but it reports what it would do', r.payload.results[0].action, 'would send');
}
{
  rows = [paid()];
  const r = await call({ query: { key: KEY, apply: '0' } });
  eq('apply=0 is still a dry run', r.payload.dry_run, true);
  eq('apply=0 sends nothing', sent.length, 0);
}

/* ---------- what it asks the database for ---------- */

{
  rows = [];
  await call({ query: { key: KEY } });
  ok('it filters on paid in the query, not after', queries[0].includes('payment_status=eq.paid'));
  ok('and on paid_at as belt and braces', queries[0].includes('paid_at=not.is.null'));
  ok('and caps what it will consider', /limit=\d+/.test(queries[0]));
}
{
  rows = [];
  await call({ query: { key: KEY, order: 'DASP00020151' } });
  ok('an order number narrows the query', queries[0].includes('order_number=eq.DASP00020151'));
}
{
  const r = await call({ query: { key: KEY, order: 'not-an-order' } });
  eq('a malformed order is refused', r.code, 400);
  eq('a malformed order looks at nothing', queries.length, 0);
}
{
  rows = [];
  await call({ query: { key: KEY, order: "DASP00020151'; drop table claims--" } });
  eq('an injection attempt is refused by the shape check', queries.length, 0);
}

/* ---------- who it will not email ---------- */

{
  rows = [paid({ stripe_customer_id: null })];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('no stripe customer means no link, so no send', sent.length, 0);
  eq('and it says why', r.payload.results[0].reason, 'no stripe customer, so no verification link');
  eq('and writes no marker', audits.length, 0);
}
{
  rows = [paid({ email: null })];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('no email address means no send', sent.length, 0);
  eq('and it says why', r.payload.results[0].reason, 'no email address on the claim');
}
{
  existingAudits = new Set(['11111111-1111-1111-1111-111111111111:payment_confirmation_recovered']);
  rows = [paid()];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('a claim already sent to is skipped', sent.length, 0);
  eq('and it says why', r.payload.results[0].reason, 'already sent by this endpoint');
  existingAudits = new Set();
}

/* ---------- the send itself ---------- */

{
  rows = [paid()];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('apply=1 sends', sent, ['DASP00020151']);
  eq('and reports it', r.payload.results[0].action, 'sent');
  eq('and marks it once only', audits.length, 1);
  eq('under the event the skip check reads', audits[0].ev, 'payment_confirmation_recovered');
}
{
  sendThrows = new Error('resend is down');
  rows = [paid()];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('a failed send is reported', r.payload.results[0].action, 'failed');
  eq('a failed send writes NO marker, so it can be retried', audits.length, 0);
  sendThrows = null;
}
{
  rows = [paid(), paid({ id: '2', order_number: 'DASP00020159', email: 'b@example.com' })];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('it handles several claims in one call', sent.length, 2);
  eq('and reports each', r.payload.results.length, 2);
}
{
  sendThrows = null;
  rows = [paid({ id: 'a', order_number: 'DASP00020151' }), paid({ id: 'b', order_number: 'DASP00020159' })];
  let first = true;
  emailFake.paymentConfirmed = async (c) => {
    if (first) { first = false; throw new Error('first one failed'); }
    sent.push(c.order_number);
  };
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('one failure does not stop the rest', sent, ['DASP00020159']);
  eq('the failure is reported', r.payload.results[0].action, 'failed');
  eq('and the good one still sent', r.payload.results[1].action, 'sent');
  eq('only the successful one is marked', audits.length, 1);
  emailFake.paymentConfirmed = async (c) => {
    if (sendThrows) throw sendThrows;
    sent.push(c.order_number);
  };
}

/* ---------- failures ---------- */

{
  selectThrows = new Error('supabase is down');
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('a broken lookup is a 502, not a silent success', r.code, 502);
  eq('and sends nothing', sent.length, 0);
  selectThrows = null;
}
{
  rows = [];
  const r = await call({ query: { key: KEY, apply: '1' } });
  eq('nothing to do is a clean 200', r.code, 200);
  eq('with nothing considered', r.payload.considered, 0);
}

/* ---------- it must never leak ---------- */

{
  rows = [paid({ tfn: '123456789', passport_number: 'PA1234567', bank_account_number: '12345678' })];
  const r = await call({ query: { key: KEY, apply: '1' } });
  const body = JSON.stringify(r.payload);
  ok('the response carries no TFN', !body.includes('123456789'));
  ok('no passport number', !body.includes('PA1234567'));
  ok('no bank account number', !body.includes('12345678'));
  ok('and no health key', !body.includes(KEY));
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
