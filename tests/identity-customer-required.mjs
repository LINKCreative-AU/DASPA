// A verification session must never be created without a Stripe customer.
//
// This is the September 2026 defect. Between the manual payment recovery on
// 9 September and the customer backfill on 10 September, four paid claims had
// no stripe_customer_id, and createSession quietly omitted related_customer
// rather than refusing. isVerified() filters on exactly that field, so those
// sessions are invisible to it:
//
//   - Alessia Cittadini verified for real, and her verification does not
//     appear on her customer in the dashboard;
//   - Stephane Dartois abandoned his, and "has he verified?" could not be
//     answered from Stripe at all.
//
// The cost of the old behaviour was silent and only visible weeks later, which
// is the kind of thing a test has to hold rather than a comment.
//
// Run: node tests/identity-customer-required.mjs
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

process.env.STRIPE_SECRET_KEY = 'sk_test_x';
process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';

let posted = [];
global.fetch = async (u, init) => {
  posted.push({ url: String(u), body: String((init && init.body) || '') });
  return {
    ok: true, status: 200,
    json: async () => ({ id: 'vs_test', client_secret: 'cs', url: 'https://verify', status: 'requires_input', data: [] }),
    text: async () => '',
  };
};

const identity = require('../api/_lib/identity.js');

/* ---------- the library refuses ---------- */

{
  posted = [];
  let threw = null;
  try {
    await identity.createSession({ customerId: null, claimId: 'c1', email: 'a@b.c' });
  } catch (e) { threw = e; }
  ok('a null customer throws', threw !== null);
  ok('and it is flagged as the no-customer case', threw && threw.noCustomer === true);
  eq('and nothing is sent to Stripe', posted.length, 0);
}
{
  posted = [];
  let threw = null;
  try { await identity.createSession({ customerId: '', claimId: 'c1' }); } catch (e) { threw = e; }
  ok('an empty string customer throws too', threw !== null);
  eq('and creates nothing', posted.length, 0);
}
{
  posted = [];
  let threw = null;
  try { await identity.createSession({ claimId: 'c1' }); } catch (e) { threw = e; }
  ok('an absent customer throws', threw !== null);
  eq('and creates nothing', posted.length, 0);
}

/* ---------- with a customer it works, and always attaches it ---------- */

{
  posted = [];
  const s = await identity.createSession({
    customerId: 'cus_ABC', claimId: 'c1', email: 'a@b.c', returnUrl: 'https://x/verify-id',
  });
  eq('a real customer creates a session', s.id, 'vs_test');
  eq('one call to Stripe', posted.length, 1);
  ok('related_customer is always sent', posted[0].body.includes('related_customer=cus_ABC'));
  ok('the claim id rides along as metadata', posted[0].body.includes('metadata%5Bclaim_id%5D=c1'));
  ok('and as client_reference_id', posted[0].body.includes('client_reference_id=c1'));
  /* Decoded, because the brackets are percent-encoded on the wire and an
     assertion against the raw form tests the encoder rather than the option. */
  const sent = decodeURIComponent(posted[0].body);
  ok('passport only', sent.includes('options[document][allowed_types][0]=passport'));
  ok('selfie match on', sent.includes('options[document][require_matching_selfie]=true'));
}

/* ---------- the endpoint refuses before it reaches the library ---------- */

let audits = [], opsAlerts = [];
const dbFake = {
  getClaim: async () => ({
    id: '11111111-1111-1111-1111-111111111111',
    order_number: 'DASP00020158',
    email: 'a@b.c',
    payment_status: 'paid',
    verification_status: 'not_started',
    passport_country: 'France',
    stripe_customer_id: null,
  }),
  insertAudit: async (id, ev, d) => { audits.push({ id, ev, d }); },
  updateClaim: async () => ({}),
};
const emailFake = {
  opsNeedsReview: async (c, why) => { opsAlerts.push(why); },
};
const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/email') return emailFake;
  if (req === './_lib/guard') return { guard: async () => null };
  return origLoad.apply(this, arguments);
};

{
  delete require.cache[require.resolve('../api/identity-session.js')];
  const handler = require('../api/identity-session.js');
  posted = []; audits = []; opsAlerts = [];
  let code = null, payload = null;
  const res = {
    status(c) { code = c; return this; },
    json(p) { payload = p; return this; },
    setHeader() {},
  };
  await handler(
    { method: 'POST', headers: {}, body: { claimId: '11111111-1111-1111-1111-111111111111' } },
    res,
  );
  eq('a paid claim with no customer is refused', code, 409);
  eq('with a distinct message, not a generic 502', payload.error, 'verification unavailable for this claim');
  eq('nothing reaches Stripe', posted.length, 0);
  eq('the refusal is recorded', audits.length, 1);
  eq('under a findable event', audits[0].ev, 'identity_blocked_no_customer');
  eq('and a human is told', opsAlerts.length, 1);
  ok('and told what to do about it', opsAlerts[0].includes('backfill'));
}

Module._load = origLoad;
console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
