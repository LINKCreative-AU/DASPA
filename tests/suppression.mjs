// Tests that the four September incident claims receive nothing automatic.
//
// The team contacts and invoices those four by hand. One of the paths this
// blocks is live right now: DASP00020151 is mid-verification, so the moment
// that client finishes, identity-verified.js calls email.verified() and an
// automated message lands in the middle of a conversation a person is having
// with them.
//
// Two properties matter and they pull in opposite directions:
//   - no CLIENT email may leave for a suppressed claim, on any path;
//   - every OPS alert must still fire, because the team needs to know a client
//     verified precisely when the client is being handled by hand.
//
// Run: node tests/suppression.mjs
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

process.env.RESEND_API_KEY = 'test-key';
process.env.EMAIL_FROM = 'DASPA <hello@daspa.com.au>';
process.env.OPS_EMAIL = 'ops@example.com';
process.env.SITE_URL = 'https://daspa.com.au';

let posted = [];
global.fetch = async (u, init) => {
  posted.push({ url: String(u), body: JSON.parse(init.body) });
  return { ok: true, status: 200, json: async () => ({ id: 'e_1' }), text: async () => '' };
};

function load() {
  for (const k of Object.keys(require.cache)) {
    if (k.includes('/api/_lib/')) delete require.cache[k];
  }
  return require('../api/_lib/email.js');
}
const email = load();

const claim = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: 'DASP00020151',
  full_name: 'A Client',
  email: 'client@example.com',
  payment_status: 'paid',
  paid_at: '2026-08-27T00:00:00Z',
  amount_paid_cents: 16390,
  gst_treatment: 'gst_free',
  stripe_customer_id: 'cus_ABC123',
  suppress_automated_email: true,
  ...over,
});

const CLIENT_SENDERS = ['paymentConfirmed', 'verified', 'lodged', 'verificationNudge'];

/* ---------- a suppressed claim gets nothing, on any path ---------- */

for (const s of CLIENT_SENDERS) {
  posted = [];
  const r = await email[s](claim());
  eq(`${s} sends nothing when suppressed`, posted.length, 0);
  eq(`${s} reports false, so no caller marks it as sent`, r, false);
}

/* ---------- and the callers can handle what comes back ---------- */

for (const s of CLIENT_SENDERS) {
  const r = email[s](claim());
  ok(`${s} still returns a thenable, which identity-verified.js requires`,
     r && typeof r.then === 'function');
  await r;
}

/* ---------- an ordinary claim is untouched ---------- */

for (const s of CLIENT_SENDERS) {
  posted = [];
  await email[s](claim({ suppress_automated_email: false }));
  ok(`${s} still sends for a normal claim`, posted.length === 1);
}
{
  posted = [];
  await email.verified(claim({ suppress_automated_email: undefined }));
  eq('an absent flag is not suppression, so old rows still send', posted.length, 1);
}
{
  posted = [];
  await email.verified(claim({ suppress_automated_email: 'true' }));
  eq('only a real boolean true suppresses, not the string', posted.length, 1);
}
{
  posted = [];
  await email.verified(claim({ suppress_automated_email: 1 }));
  eq('and not a truthy number', posted.length, 1);
}

/* ---------- ops alerts must NOT be suppressed ---------- */

{
  posted = [];
  await email.opsVerified(claim());
  eq('the team is still told a suppressed client verified', posted.length, 1);
  ok('and it goes to ops, not the client',
     posted[0].body.to.includes('ops@example.com') && !posted[0].body.to.includes('client@example.com'));
}
{
  posted = [];
  await email.opsPaid(claim(), 16390);
  eq('the paid alert still fires', posted.length, 1);
}
{
  posted = [];
  await email.opsNeedsReview(claim(), 'requires_input');
  eq('the needs-review alert still fires', posted.length, 1);
}
{
  posted = [];
  await email.opsRefunded(claim(), { amountCents: 16390, full: true, reason: 'incident' });
  eq('the refund alert still fires', posted.length, 1);
}
{
  posted = [];
  await email.opsDispute(claim(), { amountCents: 16390, reason: 'fraudulent', dueBy: '2026-10-01' });
  eq('the dispute alert still fires', posted.length, 1);
}

/* ---------- the helper itself ---------- */

{
  ok('suppressed() is false for a null claim', email.suppressed(null, 'x') === false);
  ok('suppressed() is false when the flag is absent', email.suppressed({ id: '1' }, 'x') === false);
  ok('suppressed() is true when the flag is set', email.suppressed({ id: '1', suppress_automated_email: true }, 'x') === true);
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
