// Tests the two claimants checkout refuses before Stripe is called.
//
//   - a passport from a country Stripe will neither verify nor take payment
//     from (Cuba, Iran, North Korea, Syria). claim.html blocks these too, but
//     the claim row is written straight to Supabase from the browser, so the
//     form is not the control.
//   - anyone under 18, decided 4 November 2026 (see MIN_AGE in the handler).
//
// And the two that must NOT be refused: China and Russia are manual-only
// identity checks, not blocked, and Taiwan is neither.
//
// Run: node tests/checkout-refusals.mjs
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
process.env.PAYMENTS_LIVE = 'true';

let stripeCalls = 0;
global.fetch = async () => {
  stripeCalls++;
  return { ok: true, status: 200, json: async () => ({ id: 'cs_test', url: 'https://checkout.stripe.test/x' }) };
};

let claim = {};
const dbFake = {
  getClaim: async () => claim,
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
const handler = require('../api/create-checkout.js');
const { manualOnly, sanctioned } = require('../api/_lib/manual-only.js');

const yearsAgo = (y, dayOffset = 0) => {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - y);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  return d.toISOString().slice(0, 10);
};

async function checkout(fields) {
  claim = { id: 'c1', email: 't@e.com', full_name: 'T', payment_status: 'unpaid', stripe_session_id: null,
    passport_country: 'France', date_of_birth: '1990-01-01', ...fields };
  stripeCalls = 0;
  let code = 200, payload = null;
  const res = { status(c) { code = c; return this; }, json(p) { payload = p; return this; }, setHeader() {} };
  await handler({ method: 'POST', body: { claimId: '11111111-1111-1111-1111-111111111111' }, headers: {} }, res);
  return { code, payload };
}

for (const c of ['Iran', 'North Korea', 'Syria', 'Cuba', 'IRAN', "Democratic People's Republic of Korea"]) {
  const r = await checkout({ passport_country: c });
  eq(`${c} passport is refused`, r.code, 403);
  eq(`${c} refusal names the reason`, r.payload && r.payload.reason, 'country_not_supported');
  eq(`${c} never reaches Stripe`, stripeCalls, 0);
}

for (const c of ['China', 'Russia', 'Hong Kong SAR China', 'Macao SAR China', 'Taiwan', 'South Korea', 'France']) {
  const r = await checkout({ passport_country: c });
  eq(`${c} passport goes through to payment`, r.code, 200);
}

{
  const r = await checkout({ passport_country: 'Germany', address_country: 'Iran' });
  eq('a German passport living in Iran is refused', r.code, 403);
  eq('and never reaches Stripe', stripeCalls, 0);
}
eq('a German passport living in China goes through (manual, not blocked)',
  (await checkout({ passport_country: 'Germany', address_country: 'China' })).code, 200);
{
  const r = await checkout({ date_of_birth: yearsAgo(17) });
  eq('a 17 year old is refused', r.code, 403);
  eq('the refusal says under age', r.payload && r.payload.reason, 'under_age');
  eq('and Stripe is not called', stripeCalls, 0);
}
eq('the day before the 18th birthday is refused', (await checkout({ date_of_birth: yearsAgo(18, 1) })).code, 403);
eq('the 18th birthday itself goes through', (await checkout({ date_of_birth: yearsAgo(18) })).code, 200);
eq('a missing date of birth is not blocked here', (await checkout({ date_of_birth: null })).code, 200);

// the form's country names (Intl region names) land on the right side of both rules
eq('Hong Kong SAR China is manual-only', manualOnly('Hong Kong SAR China'), true);
eq('Macao SAR China is manual-only', manualOnly('Macao SAR China'), true);
eq('South Korea is not sanctioned', sanctioned('South Korea'), false);
eq('Montserrat is neither', manualOnly('Montserrat') || sanctioned('Montserrat'), false);
eq('Russia is manual-only, not sanctioned', [manualOnly('Russia'), sanctioned('Russia')].join(), 'true,false');

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
