// Tests the one-off customer backfill.
//
// It writes to production, so what matters is the ways it must REFUSE and the
// guarantees on a re-run. None of this is reachable by clicking.
//
// Run: node tests/backfill-customers.mjs
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

process.env.HEALTH_KEY = 'secret-health-key';
process.env.STRIPE_SECRET_KEY = 'rk_live_x';
process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';

let claims = [];
let writes = [];
let audits = [];
const dbFake = {
  selectClaims: async (q) => { dbFake.lastQuery = q; return claims; },
  updateClaim: async (id, patch) => { writes.push({ id, patch }); return {}; },
  insertAudit: async (id, ev, detail) => { audits.push({ id, ev, detail }); },
};
const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  return origLoad.apply(this, arguments);
};

let posts = [];
let stripeReply = () => ({ ok: true, status: 200, json: async () => ({ id: 'cus_NEW1' }) });
global.fetch = async (url, opts) => { posts.push({ url: String(url), headers: opts.headers, body: opts.body }); return stripeReply(); };

function load() {
  delete require.cache[require.resolve('../api/admin-backfill-customers.js')];
  return require('../api/admin-backfill-customers.js');
}
async function call(query) {
  writes = []; audits = []; posts = [];
  const handler = load();
  let code = null, payload = null;
  const res = { status(c) { code = c; return this; }, json(p) { payload = p; return this; }, end() { return this; }, setHeader() {} };
  await handler({ method: 'GET', query: query || {}, headers: {} }, res);
  return { code, payload };
}

const claim = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: 'DASP00020151', full_name: 'Taylor McDonough', email: 'tay@e.com',
  payment_status: 'paid', paid_at: '2026-08-27T14:41:00Z', stripe_customer_id: null,
  ...over,
});

// --- it is 404 without the key, like /api/health -------------------------
claims = [claim()];
eq('no key -> 404', (await call({})).code, 404);
eq('wrong key -> 404', (await call({ key: 'nope' })).code, 404);
eq('no key -> nothing written', writes.length, 0);
{
  process.env.HEALTH_KEY = '';
  eq('HEALTH_KEY unset -> 404 even with a key', (await call({ key: 'anything' })).code, 404);
  process.env.HEALTH_KEY = 'secret-health-key';
}
eq('trailing whitespace on the query key still works',
   (await call({ key: ' secret-health-key ' })).code, 200);

// --- dry run is the default ----------------------------------------------
{
  const r = await call({ key: 'secret-health-key' });
  eq('default is a dry run', r.payload.mode, 'dry run, nothing written');
  eq('dry run calls Stripe zero times', posts.length, 0);
  eq('dry run writes nothing', writes.length, 0);
  eq('dry run still reports what it would do', r.payload.results[0].would.length > 0, true);
  eq('dry run tells you how to apply', /apply=1/.test(r.payload.next), true);
}

// --- it only ever selects paid claims with no customer -------------------
{
  await call({ key: 'secret-health-key' });
  eq('query filters on paid', /payment_status=eq\.paid/.test(dbFake.lastQuery), true);
  eq('query filters on a null customer', /stripe_customer_id=is\.null/.test(dbFake.lastQuery), true);
}

// --- apply -----------------------------------------------------------------
{
  const r = await call({ key: 'secret-health-key', apply: '1' });
  eq('apply -> mode says so', r.payload.mode, 'APPLIED');
  eq('apply -> one Stripe customer created', posts.length, 1);
  eq('apply -> posted to the customers endpoint', posts[0].url, 'https://api.stripe.com/v1/customers');
  eq('apply -> the claim id is on the customer metadata',
     /metadata%5Bclaim_id%5D=11111111/.test(posts[0].body), true);
  eq('apply -> the order number too',
     /metadata%5Border_number%5D=DASP00020151/.test(posts[0].body), true);
  eq('apply -> the claim is updated with the customer',
     writes, [{ id: '11111111-1111-1111-1111-111111111111', patch: { stripe_customer_id: 'cus_NEW1' } }]);
  eq('apply -> it is audited', audits[0].ev, 'stripe_customer_backfilled');
  eq('apply -> tells you to delete the endpoint', /Delete api\/admin-backfill-customers\.js/.test(r.payload.then), true);
}

// --- the re-run guarantee -------------------------------------------------
// An idempotency key derived from the claim, so a second call inside Stripe's
// 24 hour window returns the SAME customer instead of a duplicate.
{
  await call({ key: 'secret-health-key', apply: '1' });
  eq('idempotency key is derived from the claim id',
     posts[0].headers['Idempotency-Key'], 'daspa-customer-11111111-1111-1111-1111-111111111111');
  const again = await call({ key: 'secret-health-key', apply: '1' });
  eq('and it is stable across calls, not random',
     posts[0].headers['Idempotency-Key'], 'daspa-customer-11111111-1111-1111-1111-111111111111');
  eq('a second run is still reported ok', again.payload.results[0].ok, true);
}

// --- a missing permission is explained, not just failed ------------------
{
  stripeReply = () => ({ ok: false, status: 403, json: async () => ({ error: { message: 'not permitted' } }) });
  const r = await call({ key: 'secret-health-key', apply: '1' });
  eq('403 -> this claim reports not ok', r.payload.results[0].ok, false);
  eq('403 -> names the dashboard fix', /Customers to Write/.test(r.payload.results[0].fix), true);
  eq('403 -> nothing written to the claim', writes.length, 0);
  stripeReply = () => ({ ok: true, status: 200, json: async () => ({ id: 'cus_NEW1' }) });
}

// --- one failure must not abandon the rest -------------------------------
{
  claims = [claim(), claim({ id: '22222222-2222-2222-2222-222222222222', order_number: 'DASP00020152', email: 'b@e.com' })];
  let call_n = 0;
  stripeReply = () => {
    call_n++;
    return call_n === 1
      ? { ok: false, status: 500, json: async () => ({ error: { message: 'stripe is having a day' } }) }
      : { ok: true, status: 200, json: async () => ({ id: 'cus_SECOND' }) };
  };
  const r = await call({ key: 'secret-health-key', apply: '1' });
  eq('first fails, second still processed', [r.payload.results[0].ok, r.payload.results[1].ok], [false, true]);
  eq('and only the successful one is written', writes.length, 1);
  eq('the written one is the second claim', writes[0].id, '22222222-2222-2222-2222-222222222222');
  stripeReply = () => ({ ok: true, status: 200, json: async () => ({ id: 'cus_NEW1' }) });
}

// --- the cap --------------------------------------------------------------
{
  claims = Array.from({ length: 40 }, (_, i) => claim({ id: `3333333${i}-3333-3333-3333-333333333333`, email: `c${i}@e.com` }));
  const r = await call({ key: 'secret-health-key' });
  eq('found reports everything', r.payload.found, 40);
  eq('but only 25 are processed', r.payload.processing, 25);
  eq('and it says it capped', /only the first 25/.test(r.payload.capped), true);
}

// --- nothing to do --------------------------------------------------------
{
  claims = [];
  const r = await call({ key: 'secret-health-key' });
  eq('no claims -> found 0', r.payload.found, 0);
  eq('no claims -> no "next" nag', r.payload.next, undefined);
}

// --- it never leaks the keys ---------------------------------------------
{
  claims = [claim()];
  const r = await call({ key: 'secret-health-key', apply: '1' });
  const blob = JSON.stringify(r.payload);
  eq('no Stripe key in the response', blob.includes('rk_live_x'), false);
  eq('no HEALTH_KEY in the response', blob.includes('secret-health-key'), false);
}

console.log(`\n${n} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
