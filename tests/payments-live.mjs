// Tests the checkout kill switch.
//
// The branches that matter here are the ones a click-through cannot reach:
//   - an ABSENT PAYMENTS_LIVE closes the shop rather than opening it, which is
//     the entire safety property. A regression to a convenience default would
//     look fine in every manual test and take money in production.
//   - the refusal happens before Stripe is called at all, not after
//   - only the exact string 'true' opens it, so 'True', '1', 'yes' stay closed
//   - /api/site-status leaks nothing but the boolean, and never caches
//
// Run: node tests/payments-live.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Module = require('node:module');

let n = 0, failed = 0;
const eq = (name, got, want) => {
  n++;
  if (got !== want) { failed++; console.log(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`); }
  else console.log(`PASS  ${name}`);
};

process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';
process.env.STRIPE_SECRET_KEY = 'rk_test_x';
process.env.SITE_URL = 'https://daspa.com.au';

// Any Stripe call at all is a failure when closed, so record every fetch.
let fetchCalls = [];
global.fetch = async (url) => {
  fetchCalls.push(String(url));
  return { ok: true, status: 200, json: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/x' }) };
};

const dbFake = {
  getClaim: async () => ({ id: 'c1', email: 't@e.com', full_name: 'T', payment_status: 'unpaid', stripe_session_id: null }),
  updateClaim: async () => ({}),
  insertAudit: async () => ({}),
};
const emailFake = new Proxy({}, { get: () => async () => true });

const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/email') return emailFake;
  return origLoad.apply(this, arguments);
};

// Fresh module each time, because config reads process.env at require time.
function load(path) {
  const resolved = require.resolve(path);
  delete require.cache[resolved];
  delete require.cache[require.resolve('../api/_lib/config.js')];
  return require(path);
}

async function checkout() {
  fetchCalls = [];
  const handler = load('../api/create-checkout.js');
  let payload = null, code = null;
  const res = { status(c) { code = c; return this; }, json(p) { payload = p; return this; }, setHeader() {} };
  await handler({ method: 'POST', body: { claimId: '11111111-1111-1111-1111-111111111111' }, headers: {} }, res);
  return { code, payload };
}

async function status(method = 'GET') {
  const handler = load('../api/site-status.js');
  let payload = null, code = null; const headers = {};
  const res = {
    status(c) { code = c; return this; }, json(p) { payload = p; return this; },
    setHeader(k, v) { headers[k] = v; },
  };
  await handler({ method, headers: {} }, res);
  return { code, payload, headers };
}

// --- the safety property -------------------------------------------------
delete process.env.PAYMENTS_LIVE;
let r = await checkout();
eq('absent PAYMENTS_LIVE -> 503, closed by default', r.code, 503);
eq('absent -> reason payments_closed', r.payload.reason, 'payments_closed');
eq('absent -> Stripe never called', fetchCalls.length, 0);
eq('absent -> tells the client nothing was charged', /[Nn]othing has been charged/.test(r.payload.error), true);

// --- explicitly closed ---------------------------------------------------
process.env.PAYMENTS_LIVE = 'false';
r = await checkout();
eq("'false' -> 503", r.code, 503);
eq("'false' -> Stripe never called", fetchCalls.length, 0);

// --- near-miss values must NOT open it -----------------------------------
// 'True', '1' and friends stay closed: someone guessing at the syntax should not
// accidentally open a shop. /api/health flags these as malformed rather than
// leaving the mismatch invisible.
for (const v of ['True', 'TRUE', '1', 'yes', 'on', '']) {
  process.env.PAYMENTS_LIVE = v;
  r = await checkout();
  eq(`'${v}' -> still closed`, r.code, 503);
}

// --- but whitespace is a paste artifact, not a decision -------------------
// A pasted " true" must OPEN, because the alternative is a shop that is shut
// with no symptom. Two variables in this project have already arrived with a
// trailing newline.
for (const v of [' true', 'true ', 'true\n', '\ttrue\t', '  true  ']) {
  process.env.PAYMENTS_LIVE = v;
  r = await checkout();
  eq(`${JSON.stringify(v)} -> OPEN, whitespace trimmed`, r.code, 200);
}

// --- open ----------------------------------------------------------------
process.env.PAYMENTS_LIVE = 'true';
r = await checkout();
eq("'true' -> 200", r.code, 200);
eq("'true' -> returns a checkout url", r.payload.url, 'https://checkout.stripe.test/x');
eq("'true' -> Stripe WAS called", fetchCalls.some((u) => u.includes('api.stripe.com')), true);

// --- method guard still first -------------------------------------------
process.env.PAYMENTS_LIVE = 'false';
{
  const handler = load('../api/create-checkout.js');
  let code = null;
  await handler({ method: 'GET', headers: {} }, { status(c) { code = c; return this; }, json() { return this; } });
  eq('GET -> 405, not 503', code, 405);
}

// --- site-status ---------------------------------------------------------
delete process.env.PAYMENTS_LIVE;
let st = await status();
eq('status: absent -> payments_live false', st.payload.payments_live, false);
eq('status: no-store', st.headers['Cache-Control'], 'no-store');
eq('status: returns ONLY the boolean', Object.keys(st.payload).join(','), 'payments_live');

process.env.PAYMENTS_LIVE = 'true';
st = await status();
eq('status: true -> payments_live true', st.payload.payments_live, true);

st = await status('POST');
eq('status: POST -> 405', st.code, 405);

// --- no credential can ever appear in the public response ----------------
process.env.PAYMENTS_LIVE = 'true';
st = await status();
const body = JSON.stringify(st.payload);
eq('status: no Stripe key', body.includes('rk_test_x'), false);
eq('status: no Supabase key', body.includes('supabase'), false);

console.log(`\n${n} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
