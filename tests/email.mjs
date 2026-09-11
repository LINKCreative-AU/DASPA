// Tests the email layer.
//
// These messages are the only thing the client ever sees from us after paying,
// and two of the bugs below were real: the webhook handed paymentConfirmed the
// row as it was BEFORE the payment patch, so every confirmation would have gone
// out with no invoice and no verification link. Neither failure is visible from
// the code, and both are invisible in a successful send.
//
// Run: node tests/email.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

let n = 0, failed = 0;
const eq = (name, got, want) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++; console.log(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
  } else console.log(`PASS  ${name}`);
};
const ok = (name, cond) => eq(name, !!cond, true);
const no = (name, cond) => eq(name, !!cond, false);

process.env.SITE_URL = 'https://daspa.com.au';
process.env.EMAIL_FROM = 'DASPA <claims@daspa.com.au>';
process.env.RESEND_API_KEY = 're_test';
process.env.OPS_EMAIL = 'claims@daspa.com.au';
delete process.env.LODGEMENT_LIVE;

let sent = [];
global.fetch = async (url, opts) => {
  sent.push(JSON.parse(opts.body));
  return { ok: true, status: 200, text: async () => '' };
};

function load() {
  for (const m of ['../api/_lib/email.js', '../api/_lib/email-html.js', '../api/_lib/config.js',
                   '../api/_lib/invoice.js', '../api/_lib/invoice-pdf.js']) {
    delete require.cache[require.resolve(m)];
  }
  return require('../api/_lib/email.js');
}
const call = async (fn, ...args) => { sent = []; await fn(...args); return sent[0]; };

const paidClaim = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: 'DASP00020155',
  full_name: 'Alessia Di Marco',
  email: 'alessia@example.com',
  phone: '+39 320 111 2222',
  date_of_birth: '1998-04-02',
  tfn: '123456789',
  passport_number: 'YA1234567',
  passport_country: 'Italy',
  visa_subclass: '417',
  visa_status: 'expired',
  date_departed: '2026-07-01',
  fund_unknown: false,
  fund_name: 'AustralianSuper',
  fund_member_number: 'M-99',
  payment_status: 'paid',
  paid_at: '2026-09-11T04:12:00Z',
  amount_paid_cents: 15000,
  gst_treatment: 'gst_free',
  stripe_customer_id: 'cus_VEksGXRGOW5FES',
  ...over,
});

const email = load();

/* ---------- the confirmation carries all four things ---------- */

{
  const m = await call(email.paymentConfirmed, paidClaim());
  eq('subject is plain and true', m.subject, 'Your payment is confirmed');
  ok('there is an html part', typeof m.html === 'string' && m.html.length > 2000);
  ok('AND a hand-written text part', typeof m.text === 'string' && m.text.length > 400);
  ok('the text part is not markup', !m.text.includes('<table') && !m.text.includes('style='));
  eq('replies reach a person', m.reply_to, 'claims@daspa.com.au');

  ok('it shows the order number', m.html.includes('DASP00020155'));
  ok('the text does too', m.text.includes('DASP00020155'));

  const link = 'https://daspa.com.au/verify-id?c=cus_VEksGXRGOW5FES&amp;o=DASP00020155';
  ok('the verification link is the durable two-id form', m.html.includes(link));
  ok('and unescaped in the text part',
     m.text.includes('https://daspa.com.au/verify-id?c=cus_VEksGXRGOW5FES&o=DASP00020155'));
  ok('with a button to press', m.html.includes('Verify my identity'));

  ok('the invoice is rendered in the body', m.html.includes('DASP claim, flat service fee'));
  eq('and attached exactly once', (m.attachments || []).length, 1);
  eq('as a pdf named for the order', m.attachments[0].filename,
     'DASPA - Order DASP00020155 invoice.pdf');
  eq('with the right content type', m.attachments[0].content_type, 'application/pdf');
  ok('base64, not raw bytes', /^[A-Za-z0-9+/=]+$/.test(m.attachments[0].content.slice(0, 80)));
  ok('and it really is a pdf', Buffer.from(m.attachments[0].content, 'base64')
     .toString('latin1').startsWith('%PDF-'));

  ok('there is a preheader', m.html.includes('Payment received. Reference DASP00020155.'));
  ok('it is hidden from the body', m.html.includes('display:none;max-height:0'));
}

/* ---------- THE BUG. The webhook used to pass the pre-payment row ---------- */

{
  /* payment_status unpaid, no paid_at, no customer: exactly what
     db.getClaim returned before the patch. The invoice cannot be built from it
     and there is no link to send. The message must still go, because a
     confirmation with no invoice beats no confirmation at all. */
  const stale = paidClaim({
    payment_status: 'unpaid', paid_at: null, amount_paid_cents: null, stripe_customer_id: null,
  });
  const m = await call(email.paymentConfirmed, stale);
  ok('a pre-payment row still sends something', !!m);
  eq('but carries no invoice', (m.attachments || []).length, 0);
  no('and no verification link', m.html.includes('/verify-id'));
  ok('which is why the webhook must pass the updated row', true);
}
{
  // Same claim, paid: proves the difference is the row and not the sender.
  const m = await call(email.paymentConfirmed, paidClaim());
  eq('the paid row gets its invoice', (m.attachments || []).length, 1);
  ok('and its link', m.html.includes('/verify-id'));
}
{
  // A guest checkout leaves no customer, so there is no durable link to build.
  const m = await call(email.paymentConfirmed, paidClaim({ stripe_customer_id: null }));
  no('no customer means no half-built link', m.html.includes('/verify-id'));
  ok('the invoice still goes', (m.attachments || []).length === 1);
  ok('and the text explains the steps without one', m.text.includes('WHAT HAPPENS NEXT'));
}
{
  /* THE ORDER NUMBER IS LOAD-BEARING TWICE. Without it there is no invoice
     number to issue a document under, and no durable link either, because the
     link is keyed on it. So a claim with no order number produces a
     confirmation that is just a thank-you.

     It cannot happen today: the column has a database default from
     2026-09-09-order-numbers.sql, and the retention sweep does not clear it.
     Asserted so that if either of those ever changes, this says what breaks. */
  const m = await call(email.paymentConfirmed, paidClaim({ order_number: null }));
  eq('no order number means no invoice', (m.attachments || []).length, 0);
  no('and no link either, because the link is keyed on it', m.html.includes('/verify-id'));
  ok('the message still goes, as a plain confirmation', m.html.includes('Your payment is confirmed'));
}

/* ---------- escaping ---------- */

{
  const m = await call(email.paymentConfirmed,
    paidClaim({ full_name: 'Ann (Annie) O\'Brien & Co', email: 'a<b>@e.com' }));
  ok('an apostrophe is escaped', m.html.includes('O&#39;Brien'));
  ok('an ampersand is escaped', m.html.includes('&amp; Co'));
  no('no raw name survives', m.html.includes("O'Brien & Co"));
  no('and no injected tag', m.html.includes('<b>@e.com'));
}
{
  const m = await call(email.paymentConfirmed,
    paidClaim({ full_name: '<script>alert(1)</script>' }));
  no('a script tag cannot reach the markup', m.html.includes('<script>alert'));
  ok('it is escaped instead', m.html.includes('&lt;script&gt;'));
}

/* ---------- lodgement wording follows the flag ---------- */

{
  const m = await call(email.paymentConfirmed, paidClaim());
  ok('lodgement off says held in review', m.html.includes('held at "in review"'));
  no('and does not promise a lodgement', m.html.includes('We lodge directly with the ATO through'));
}
{
  process.env.LODGEMENT_LIVE = 'true';
  const e2 = load();
  const m = await call(e2.paymentConfirmed, paidClaim());
  ok('lodgement on promises it', m.html.includes('We lodge directly with the ATO'));
  delete process.env.LODGEMENT_LIVE;
}

/* ---------- the other client emails ---------- */

{
  const m = await call(email.verified, paidClaim());
  eq('verified has its own subject', m.subject, 'Identity verified, your claim is in review');
  ok('it is html', m.html.includes('<table'));
  ok('with a text part', m.text.includes('Your identity check is done'));
  no('and no invoice attached twice', (m.attachments || []).length > 0);
}
{
  const m = await call(email.lodged, paidClaim());
  ok('lodged says so', m.subject.includes('lodged with the ATO'));
  ok('and mentions 28 days', m.text.includes('28 days'));
}
{
  const m = await call(email.verificationNudge, paidClaim());
  ok('the nudge carries the durable link', m.text.includes('/verify-id?c=cus_'));
  ok('and says there is no deadline', m.text.includes('no deadline'));
}
{
  const m = await call(email.verificationNudge, paidClaim({ stripe_customer_id: null }));
  no('with no link it does not invent one', m.text.includes('/verify-id'));
  ok('it offers a person instead', m.text.includes('fresh link'));
}

/* ---------- the team alert ---------- */

{
  const m = await call(email.opsPaid, paidClaim(), 15000);
  eq('it goes to the ops list', m.to, ['claims@daspa.com.au']);
  ok('the subject says do not lodge yet', m.subject.includes('ID NOT VERIFIED'));
  ok('and names the client and amount', m.subject.includes('Alessia Di Marco') && m.subject.includes('150.00'));
  ok('the body leads with it', m.text.includes('DO NOT LODGE'));
  ok('and says a second alert is the go-ahead', m.text.includes('go-ahead'));
  ok('it carries the link so the team can resend it', m.text.includes('/verify-id?c=cus_'));

  /* Juan, 10 September 2026: the team needs the TFN to lodge. It is in full,
     which makes the do-not-forward line load-bearing rather than decorative. */
  ok('the TFN is there in full', m.text.includes('123456789'));
  ok('spelled out, not abbreviated', m.text.includes('Tax file number: 123456789'));
  ok('with a do-not-forward warning', m.text.includes('DO NOT FORWARD'));
  ok('that says why', m.text.includes('contains a tax file number'));

  ok('passport too, since lodgement needs it', m.text.includes('YA1234567'));
  ok('and the fund', m.text.includes('AustralianSuper'));
  ok('and the order number', m.text.includes('DASP00020155'));

  /* Bank details are the deliberate exclusion: not needed to lodge, and
     readable off the claim when they are. */
  no('no bank account number', m.text.includes('bank_account_number'));
  ok('and it says where they are', m.text.includes('Bank details are on the claim in Supabase'));
}
{
  const m = await call(email.opsPaid, paidClaim({ tfn: null }), 15000);
  ok('a missing TFN is called out, not left blank', m.text.includes('NOT PROVIDED'));
  ok('with the consequence', m.text.includes('manually'));
}
{
  const m = await call(email.opsVerified, paidClaim());
  ok('the go-ahead is a different subject', m.subject.includes('READY TO LODGE'));
  ok('and warns that lodgement is still off', m.text.includes('LODGEMENT_LIVE is off'));
  ok('it carries the TFN too, since this is the lodge-now email', m.text.includes('123456789'));
}
{
  process.env.LODGEMENT_LIVE = 'true';
  const e2 = load();
  const m = await call(e2.opsVerified, paidClaim());
  no('with lodgement live the warning goes', m.text.includes('LODGEMENT_LIVE is off'));
  delete process.env.LODGEMENT_LIVE;
}

/* ---------- nothing before payment ---------- */

{
  const e = load();
  eq('formReceived no longer exists', typeof e.formReceived, 'undefined');
}
{
  const src = require('node:fs').readFileSync('api/create-checkout.js', 'utf8');
  no('and create-checkout does not mail the client', /email\.(formReceived|paymentConfirmed)/.test(src));
  ok('it still alerts the team', src.includes('email.opsNewClaim'));
}
{
  const src = require('node:fs').readFileSync('api/stripe-webhook.js', 'utf8');
  no('the old portal invoice call is gone', src.includes('registrationoffice.com.au/api/invoice'));
  ok('and the webhook passes the UPDATED row', /const paid = await db\.updateClaim/.test(src));
}

/* ---------- no key, no send ---------- */

{
  delete process.env.RESEND_API_KEY;
  const e2 = load();
  sent = [];
  const r = await e2.paymentConfirmed(paidClaim());
  eq('no api key means no send', sent.length, 0);
  eq('and it reports false rather than throwing', r, false);
  process.env.RESEND_API_KEY = 're_test';
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
