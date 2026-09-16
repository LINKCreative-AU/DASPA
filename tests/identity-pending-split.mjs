// "pending" means two different things, and they need opposite messages.
//
// verification_status goes to 'pending' when a session is CREATED, before the
// claimant has photographed anything. So one value covers:
//
//   submitted, Stripe is working   -> wait; asking them to redo it is wrong
//   started and abandoned          -> start again; "check back shortly" is a
//                                     promise we cannot keep
//
// Stephane Dartois sat in the second case for three weeks while /verify-id
// told him Stripe was still checking documents he had never submitted. The
// server now asks Stripe which case it is, so the page never guesses.
//
// Run: node tests/identity-pending-split.mjs
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
process.env.STRIPE_SECRET_KEY = 'sk_test_x';
process.env.SITE_URL = 'https://daspa.com.au';

/* ---------- sessionStatus itself ---------- */
{
  let fetched = [];
  global.fetch = async (u) => {
    fetched.push(String(u));
    return { ok: true, status: 200, json: async () => ({ id: 'vs_1', status: 'processing' }), text: async () => '' };
  };
  const identity = require('../api/_lib/identity.js');

  eq('reads the status off the session', await identity.sessionStatus('vs_1'), 'processing');
  ok('and asks for that exact session', fetched[0].endsWith('/vs_1'));

  fetched = [];
  eq('no session id means no call', await identity.sessionStatus(null), null);
  eq('and nothing is fetched', fetched.length, 0);
  eq('an empty id is the same', await identity.sessionStatus(''), null);

  global.fetch = async () => { throw new Error('stripe is down'); };
  eq('an unreadable session is null, never a guess', await identity.sessionStatus('vs_1'), null);
}

/* ---------- the endpoint resolves it ---------- */

let claim = null;
let sessionStatusReturns = null;
let statusAskedFor = [];

const dbFake = {
  selectClaims: async () => (claim ? [claim] : []),
  getClaim: async () => claim,
  updateClaim: async () => ({}),
  insertAudit: async () => {},
  hasAudit: async () => true,
  patchClaims: async () => [],
};
const identityFake = {
  ENABLED: true,
  isVerified: async () => false,
  /* Mirrors the real contract: no id means no call and a null answer. Without
     that the fake reports a status for a session that does not exist, which is
     the one thing sessionStatus is written never to do. */
  sessionStatus: async (id) => { statusAskedFor.push(id); return id ? sessionStatusReturns : null; },
  publishableKey: () => 'pk_test',
};
const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/identity') return identityFake;
  if (req === './_lib/guard') return { guard: async () => null };
  if (req === './_lib/email') return { opsNeedsReview: async () => {} };
  return origLoad.apply(this, arguments);
};

async function get(over = {}) {
  statusAskedFor = [];
  claim = {
    id: '11111111-1111-1111-1111-111111111111',
    order_number: 'DASP00020151',
    full_name: 'Stephane Dartois',
    email: 'a@b.c',
    payment_status: 'paid',
    passport_country: 'France',
    stripe_customer_id: 'cus_VEksUmahfqAsfw',
    identity_session_id: 'vs_1',
    verification_status: 'pending',
    ...over,
  };
  delete require.cache[require.resolve('../api/identity.js')];
  const handler = require('../api/identity.js');
  let payload = null;
  const res = { status() { return this; }, json(p) { payload = p; return this; }, setHeader() {} };
  await handler(
    { method: 'GET', headers: { origin: 'https://daspa.com.au' },
      query: { c: 'cus_VEksUmahfqAsfw', o: 'DASP00020151' } },
    res,
  );
  return payload;
}

{
  sessionStatusReturns = 'processing';
  const r = await get();
  eq('a submitted session stays pending, so the page says wait', r.verification_status, 'pending');
  eq('and Stripe was asked about the right session', statusAskedFor, ['vs_1']);
}
{
  sessionStatusReturns = 'requires_input';
  const r = await get();
  eq('an ABANDONED session becomes incomplete, so the page asks them to verify',
     r.verification_status, 'incomplete');
}
{
  sessionStatusReturns = 'canceled';
  const r = await get();
  eq('a cancelled session is incomplete too', r.verification_status, 'incomplete');
}
{
  sessionStatusReturns = null;
  const r = await get();
  eq('an UNREADABLE session is incomplete, never "still checking"',
     r.verification_status, 'incomplete');
}
{
  sessionStatusReturns = 'processing';
  const r = await get({ identity_session_id: null });
  eq('pending with no session id resolves to incomplete', r.verification_status, 'incomplete');
  eq('and Stripe is asked with nothing rather than skipped', statusAskedFor, [null]);
}

/* ---------- every other state is untouched ---------- */

{
  sessionStatusReturns = 'processing';
  const r = await get({ verification_status: 'not_started' });
  eq('not_started is left alone', r.verification_status, 'not_started');
  eq('and costs no Stripe call', statusAskedFor.length, 0);
}
{
  const r = await get({ verification_status: 'needs_review' });
  eq('needs_review is left alone', r.verification_status, 'needs_review');
  eq('and costs no Stripe call', statusAskedFor.length, 0);
}
{
  identityFake.isVerified = async () => false;
  const r = await get({ verification_status: 'verified' });
  eq('verified is left alone', r.verification_status, 'verified');
  eq('and costs no Stripe call', statusAskedFor.length, 0);
}

Module._load = origLoad;

/* ---------- the page copy ---------- */

const page = require('node:fs').readFileSync('assets/identity.js', 'utf8');
{
  ok('the page routes the new state', /verification_status === 'incomplete'/.test(page));
  ok('and shows the verify card for it', /showTodo\(true\)/.test(page));
  ok('showTodo takes the resumed flag', /function showTodo\(resumed\)/.test(page));
  ok('the pending card no longer offers a button',
     !/title: 'Your documents are being checked'[\s\S]{0,400}?button:/.test(page));
  ok('"Try again" is gone from every label', !/verifyButton\('Try again'\)/.test(page));
  ok('the mailto line names the address and the order reference',
     page.includes('Email claims@daspa.com.au with your order reference and we will assist you.'));
  ok('the old vague mailto wording is gone',
     !page.includes('Email us and we will sort it out.'));
  ok('the pending card polls so its own promise is true', /checkingTries\+\+/.test(page));
  ok('and the polling is bounded', /checkingTries\+\+ < \d+/.test(page));
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
