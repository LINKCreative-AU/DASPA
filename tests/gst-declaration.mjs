// Tests the GST corroboration written server-side by api/create-checkout.js.
//
// What is worth testing here is not the happy path, it is that a browser can
// never influence these two values and that a junk header cannot end up on a
// tax record. The declaration itself comes from the form; these are the facts
// we gather about it.
//
// Run: node tests/gst-declaration.mjs
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

process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';
process.env.STRIPE_SECRET_KEY = 'rk_test_x';
process.env.SITE_URL = 'https://daspa.com.au';
process.env.PAYMENTS_LIVE = 'true';

let writes = [];
const dbFake = {
  getClaim: async () => ({ id: 'c1', email: 't@e.com', full_name: 'T', payment_status: 'unpaid', stripe_session_id: null }),
  updateClaim: async (id, patch) => { writes.push(patch); return {}; },
  insertAudit: async () => ({}),
};
const emailFake = new Proxy({}, { get: () => async () => true });
const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/email') return emailFake;
  return origLoad.apply(this, arguments);
};

global.fetch = async () => ({
  ok: true, status: 200,
  json: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/x' }),
});

function load() {
  for (const m of ['../api/create-checkout.js', '../api/_lib/config.js']) delete require.cache[require.resolve(m)];
  return require('../api/create-checkout.js');
}

async function checkout(headers) {
  writes = [];
  const handler = load();
  const res = { status() { return this; }, json() { return this; }, setHeader() {} };
  await handler({ method: 'POST', body: { claimId: '11111111-1111-1111-1111-111111111111' }, headers: headers || {} }, res);
  return writes[0] || {};
}

// --- the header is read and normalised ----------------------------------
eq('AU passes through',        (await checkout({ 'x-vercel-ip-country': 'AU' })).edge_country, 'AU');
eq('lowercase is upcased',     (await checkout({ 'x-vercel-ip-country': 'ie' })).edge_country, 'IE');
eq('whitespace is trimmed',    (await checkout({ 'x-vercel-ip-country': '  gb \n' })).edge_country, 'GB');

// --- junk must not reach a tax record -----------------------------------
// A country column feeding a GST position should hold a country or nothing.
eq('missing header -> null',   (await checkout({})).edge_country, null);
eq('empty string -> null',     (await checkout({ 'x-vercel-ip-country': '' })).edge_country, null);
eq('three letters -> null',    (await checkout({ 'x-vercel-ip-country': 'AUS' })).edge_country, null);
eq('one letter -> null',       (await checkout({ 'x-vercel-ip-country': 'A' })).edge_country, null);
eq('digits -> null',           (await checkout({ 'x-vercel-ip-country': '61' })).edge_country, null);
eq('SQL-ish junk -> null',     (await checkout({ 'x-vercel-ip-country': "AU'; drop table claims;--" })).edge_country, null);
eq('XX unknown is still 2 letters and kept', (await checkout({ 'x-vercel-ip-country': 'XX' })).edge_country, 'XX');

// --- the browser must never be the source --------------------------------
// A crafted request naming these in its BODY must not reach the write. The
// database revokes them from anon too; this is the second lock.
{
  writes = [];
  const handler = load();
  const res = { status() { return this; }, json() { return this; }, setHeader() {} };
  await handler({
    method: 'POST',
    body: {
      claimId: '11111111-1111-1111-1111-111111111111',
      edge_country: 'IE', client_ip: '1.2.3.4', gst_treatment: 'gst_free',
      in_australia_declared: false,
    },
    headers: { 'x-vercel-ip-country': 'AU' },
  }, res);
  const w = writes[0] || {};
  eq('body cannot spoof edge_country', w.edge_country, 'AU');
  eq('body cannot set gst_treatment', 'gst_treatment' in w, false);
  eq('body cannot set in_australia_declared', 'in_australia_declared' in w, false);
}

// --- the IP is recorded for dispute evidence ----------------------------
eq('x-forwarded-for is recorded',
  (await checkout({ 'x-forwarded-for': '203.0.113.7, 70.41.3.18' })).client_ip, '203.0.113.7');

// --- and none of it happens when checkout is closed ---------------------
process.env.PAYMENTS_LIVE = 'false';
eq('closed -> no write at all', await checkout({ 'x-vercel-ip-country': 'AU' }), {});

console.log(`\n${n} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
