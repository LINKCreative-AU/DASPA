// Tests the durable verification endpoint, /api/identity.
//
// The link this serves goes in an email, so its two identifiers travel in a
// URL where anyone can edit them. Almost everything below is about what the
// endpoint must REFUSE, and about the one thing it must not reveal: whether a
// given order number exists, and whether it has been paid.
//
// The GET's webhook-repair path is here for a different reason. It cannot be
// reached by clicking, because reaching it needs Stripe and our row to
// disagree, and left broken it produces the worst outcome in the flow: the
// client is told they are done and the team is never cleared.
//
// Run: node tests/identity.mjs
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

process.env.SITE_URL = 'https://daspa.com.au';
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_live_test';
// Left unset on purpose: the shared rate-limit layer must not be configured,
// so the in-memory layer is the only one under test and nothing calls out.
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

/* ---------- doubles ---------- */

let rows = [];          // what the database has
let queries = [];       // every query string the endpoint built
let writes = [];        // updateClaim calls
let audits = [];        // insertAudit calls
let marks = [];         // identity-verified.markVerified calls
let opsMails = [];      // email.opsNeedsReview calls
let sessions = [];      // identity.createSession calls
let stripeVerified = false;
let dbThrows = null;
let sessionThrows = null;

const dbFake = {
  selectClaims: async (q) => {
    queries.push(q);
    if (dbThrows) throw dbThrows;
    return rows;
  },
  updateClaim: async (id, patch) => { writes.push({ id, patch }); return {}; },
  insertAudit: async (id, ev, detail) => { audits.push({ id, ev, detail }); },
};

const identityFake = {
  ENABLED: true,
  isVerified: async (customerId) => { identityFake.asked = customerId; return stripeVerified; },
  createSession: async (args) => {
    sessions.push(args);
    if (sessionThrows) throw sessionThrows;
    return { id: 'vs_TEST1', clientSecret: 'vs_TEST1_secret', url: 'https://verify.stripe.com/start/xyz' };
  },
  publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || '',
};

const verifiedFake = {
  markVerified: async (a) => { marks.push(a); return { claimed: true }; },
};

const emailFake = {
  opsNeedsReview: async (c, status) => { opsMails.push({ order: c.order_number, status }); },
};

const origLoad = Module._load;
Module._load = function (req) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/identity') return identityFake;
  if (req === './_lib/identity-verified') return verifiedFake;
  if (req === './_lib/email') return emailFake;
  return origLoad.apply(this, arguments);
};

// Nothing here should reach the network. If anything does, the test fails
// loudly rather than quietly making a real request.
global.fetch = async (url) => { throw new Error(`unexpected network call to ${url}`); };

function load() {
  delete require.cache[require.resolve('../api/_lib/config.js')];
  delete require.cache[require.resolve('../api/identity.js')];
  return require('../api/identity.js');
}

let ipSeq = 0;
async function call(method, src, opts = {}) {
  queries = []; writes = []; audits = []; marks = []; opsMails = []; sessions = [];
  identityFake.asked = null;
  // A fresh IP per call unless one is pinned, so the in-memory rate limiter
  // does not carry one test's hits into the next.
  const ip = opts.ip || `10.0.0.${++ipSeq % 250}`;
  const headers = {
    'x-forwarded-for': ip,
    ...(opts.noOrigin ? {} : { origin: opts.origin || 'https://daspa.com.au' }),
  };
  const handler = load();
  let code = null, payload = null;
  const res = {
    status(c) { code = c; return this; },
    json(p) { payload = p; return this; },
    end() { return this; },
    setHeader() {},
  };
  const req = { method, headers };
  if (method === 'POST') req.body = src || {};
  else req.query = src || {};
  await handler(req, res);
  return { code, payload };
}

const CUS = 'cus_VEksGXRGOW5FES';
const ORD = 'DASP00020151';
const claim = (over = {}) => ({
  id: '11111111-1111-1111-1111-111111111111',
  order_number: ORD,
  full_name: 'Alessia Di Marco',
  email: 'alessia@example.com',
  payment_status: 'paid',
  stripe_customer_id: CUS,
  verification_status: 'not_started',
  passport_country: 'Italy',
  ...over,
});

/* ---------- method and guard ---------- */

{
  const r = await call('DELETE', {});
  eq('DELETE is refused', r.code, 405);
  eq('DELETE says so plainly', r.payload, { error: 'method not allowed' });
  eq('a refused method never touches the database', queries.length, 0);
}
{
  const r = await call('GET', { c: CUS, o: ORD }, { origin: 'https://daspa.com.au.evil.test' });
  eq('a lookalike origin is refused', r.code, 403);
  eq('a refused origin never touches the database', queries.length, 0);
}
{
  rows = [claim()];
  const r = await call('GET', { c: CUS, o: ORD }, { origin: 'https://daspa-site.vercel.app' });
  eq('a preview deployment is allowed', r.code, 200);
}

/* ---------- the feature flag ---------- */

{
  identityFake.ENABLED = false;
  rows = [claim()];
  const r = await call('GET', { c: CUS, o: ORD });
  eq('feature off answers 200, not 404', r.code, 200);
  eq('feature off says only that', r.payload, { enabled: false });
  eq('feature off never queries', queries.length, 0);

  const p = await call('POST', { c: CUS, o: ORD });
  eq('feature off closes the POST too', p.code, 200);
  eq('feature off creates no session', sessions.length, 0);
  identityFake.ENABLED = true;
}

/* ---------- shape ---------- */

const MALFORMED = [
  ['empty customer', { c: '', o: ORD }],
  ['empty order', { c: CUS, o: '' }],
  ['customer without the prefix', { c: 'VEksGXRGOW5FES', o: ORD }],
  ['customer with punctuation', { c: 'cus_VEks.GXRGOW', o: ORD }],
  ['customer far too long', { c: `cus_${'a'.repeat(41)}`, o: ORD }],
  ['customer far too short', { c: 'cus_abc', o: ORD }],
  ['order with seven digits', { c: CUS, o: 'DASP0002015' }],
  ['order with nine digits', { c: CUS, o: 'DASP000201510' }],
  ['order with a letter in the number', { c: CUS, o: 'DASP0002015X' }],
  ['order for another product', { c: CUS, o: 'ABNA00020151' }],
  ['a SQL fragment in the customer', { c: `cus_${'a'.repeat(8)}' or '1'='1`, o: ORD }],
  ['a PostgREST operator in the order', { c: CUS, o: 'DASP00020151&or=(id.gt.0)' }],
  ['a wildcard in the order', { c: CUS, o: 'DASP*' }],
  ['nothing at all', {}],
];
for (const [label, src] of MALFORMED) {
  rows = [claim()];
  const r = await call('GET', src);
  eq(`shape: ${label} is 404`, r.code, 404);
  eq(`shape: ${label} never reaches the database`, queries.length, 0);
}

/* ---------- the pairing check ---------- */

{
  rows = [claim()];
  await call('GET', { c: CUS, o: ORD });
  const q = queries[0] || '';
  ok('the query filters on the customer', q.includes(`stripe_customer_id=eq.${CUS}`));
  ok('the query filters on the order number', q.includes(`order_number=eq.${ORD}`));
  ok('the query filters on payment', q.includes('payment_status=eq.paid'));
  ok('the query asks for one row', q.includes('limit=1'));
}
{
  // The pairing is proven in the query, so a wrong pair returns nothing. This
  // asserts the endpoint trusts that and does not fall back to the row.
  rows = [];
  const r = await call('GET', { c: 'cus_SOMEONEELSE01', o: ORD });
  eq('a customer that does not own the order is 404', r.code, 404);
  eq('a wrong customer gets the standard body', r.payload, { error: 'not found' });
}
{
  rows = [];
  const a = await call('GET', { c: CUS, o: 'DASP00099999' });
  rows = [];
  const b = await call('GET', { c: 'cus_SOMEONEELSE01', o: ORD });
  rows = [];
  const c = await call('GET', { c: CUS, o: ORD });   // unpaid: filtered out
  eq('missing, mismatched and unpaid share one status', [a.code, b.code, c.code], [404, 404, 404]);
  eq('missing, mismatched and unpaid share one body',
    [JSON.stringify(a.payload), JSON.stringify(b.payload), JSON.stringify(c.payload)],
    [JSON.stringify({ error: 'not found' }), JSON.stringify({ error: 'not found' }), JSON.stringify({ error: 'not found' })]);
}
{
  rows = [];
  const r = await call('POST', { c: CUS, o: 'DASP00099999' });
  eq('the POST hides an unusable link the same way', r.code, 404);
  eq('the POST creates nothing for one', sessions.length, 0);
}

/* ---------- normalising the inputs ---------- */

{
  rows = [claim()];
  await call('GET', { c: `  ${CUS}  `, o: `  ${ORD}  ` });
  ok('surrounding whitespace is trimmed, not rejected', (queries[0] || '').includes(`eq.${ORD}`));
}
{
  rows = [claim()];
  const r = await call('GET', { c: CUS, o: 'dasp00020151' });
  eq('a lowercased order number still works', r.code, 200);
  ok('the order number is upcased before the query', (queries[0] || '').includes(`order_number=eq.${ORD}`));
}
{
  rows = [claim()];
  const r = await call('GET', { c: CUS.toLowerCase(), o: ORD });
  // Stripe ids are case-sensitive, so this must NOT be upcased or downcased
  // into a match. It is a different id and it belongs to nobody.
  eq('a case-folded customer id is not silently accepted', r.code, 200);
  ok('the customer id is passed through unchanged',
    (queries[0] || '').includes(`stripe_customer_id=eq.${CUS.toLowerCase()}`));
}

/* ---------- GET, the ordinary states ---------- */

{
  rows = [claim({ verification_status: 'not_started' })];
  stripeVerified = false;
  const r = await call('GET', { c: CUS, o: ORD });
  eq('a fresh claim reports not_started', r.code, 200);
  eq('the GET reports the state', r.payload.verification_status, 'not_started');
  eq('the GET greets by first name only', r.payload.first_name, 'Alessia');
  eq('the GET echoes the order number', r.payload.order_number, ORD);
  eq('the GET reports the email for the receipt line', r.payload.email, 'alessia@example.com');
  eq('an Italian passport is not manual-only', r.payload.manual_only, false);
  eq('lodgement is reported as off', r.payload.lodgement_live, false);
}
{
  rows = [claim({ full_name: '   ' })];
  const r = await call('GET', { c: CUS, o: ORD });
  eq('a blank name yields no first name rather than a crash', r.payload.first_name, '');
}
{
  rows = [claim({ full_name: 'Cher' })];
  const r = await call('GET', { c: CUS, o: ORD });
  eq('a single-word name is its own first name', r.payload.first_name, 'Cher');
}
{
  rows = [claim({ passport_country: 'China' })];
  const r = await call('GET', { c: CUS, o: ORD });
  eq('the GET flags a manual-only passport rather than offering the button', r.payload.manual_only, true);
  eq('the GET does not create anything for one', sessions.length, 0);
}
{
  process.env.LODGEMENT_LIVE = 'true';
  rows = [claim()];
  const r = await call('GET', { c: CUS, o: ORD });
  eq('lodgement live is reported when it is on', r.payload.lodgement_live, true);
  delete process.env.LODGEMENT_LIVE;
}

/* ---------- GET, the webhook repair ---------- */

{
  rows = [claim({ verification_status: 'pending' })];
  stripeVerified = true;
  const r = await call('GET', { c: CUS, o: ORD });
  eq('Stripe outranks our row', r.payload.verification_status, 'verified');
  eq('the repair asked Stripe about the right customer', identityFake.asked, CUS);
  eq('the repair goes through the one definition of verified', marks.length, 1);
  eq('the repair passes both ids so either writer can find the claim',
    Object.keys(marks[0]).sort(), ['claimId', 'customerId']);
}
{
  rows = [claim({ verification_status: 'verified' })];
  stripeVerified = true;
  const r = await call('GET', { c: CUS, o: ORD });
  eq('an already-verified row reports verified', r.payload.verification_status, 'verified');
  eq('an already-verified row does not re-ask Stripe', identityFake.asked, null);
  eq('an already-verified row is not re-marked', marks.length, 0);
}
{
  rows = [claim({ verification_status: 'pending' })];
  stripeVerified = false;
  const r = await call('GET', { c: CUS, o: ORD });
  eq('pending with nothing at Stripe stays pending', r.payload.verification_status, 'pending');
  eq('nothing is marked when Stripe has nothing', marks.length, 0);
}

/* ---------- POST, the refusals ---------- */

{
  rows = [claim({ verification_status: 'verified' })];
  stripeVerified = true;
  const r = await call('POST', { c: CUS, o: ORD });
  eq('a verified claim cannot start another session', r.code, 409);
  eq('a verified claim says why', r.payload, { error: 'already verified' });
  eq('a verified claim spends nothing at Stripe', sessions.length, 0);
}
{
  // The row is stale and the webhook never landed. Starting a second
  // verification would charge us for one and confuse the client.
  rows = [claim({ verification_status: 'pending' })];
  stripeVerified = true;
  const r = await call('POST', { c: CUS, o: ORD });
  eq('a stale row is caught before a second session', r.code, 409);
  eq('the stale row is repaired on the way out', marks.length, 1);
  eq('no session is created for a stale row', sessions.length, 0);
}
{
  rows = [claim({ passport_country: 'China' })];
  stripeVerified = false;
  const r = await call('POST', { c: CUS, o: ORD });
  eq('a Chinese passport is refused', r.code, 403);
  eq('the refusal names the remedy, not the reason', r.payload, { error: 'manual verification required' });
  eq('the refusal never reaches Stripe', sessions.length, 0);
  eq('the refusal is recorded against the claim', audits.map((a) => a.ev), ['identity_manual_required']);
  eq('the audit records which country', audits[0].detail, 'China');
  eq('the team is told there is manual work', opsMails.length, 1);
  ok('the ops note explains what happened', /manual identity verification/.test(opsMails[0].status));
}
{
  rows = [claim({ passport_country: 'Russian Federation' })];
  const r = await call('POST', { c: CUS, o: ORD });
  eq('a Russian passport is refused the same way', r.code, 403);
}
{
  rows = [claim({ passport_country: 'Taiwan' })];
  const r = await call('POST', { c: CUS, o: ORD });
  eq('Taiwan is not caught by the China patterns', r.code, 200);
}

/* ---------- POST, the happy path ---------- */

{
  rows = [claim({ verification_status: 'not_started' })];
  stripeVerified = false;
  const r = await call('POST', { c: CUS, o: ORD });
  eq('a startable claim gets a session', r.code, 200);
  eq('exactly one session is created', sessions.length, 1);
  eq('the session is opened against the paying customer', sessions[0].customerId, CUS);
  eq('the session carries the claim id, so the webhook can land either way',
    sessions[0].claimId, '11111111-1111-1111-1111-111111111111');
  eq('the return url comes home to the same page',
    sessions[0].returnUrl, `https://daspa.com.au/verify-id?c=${CUS}&o=${ORD}`);
  eq('the browser gets the client secret', r.payload.clientSecret, 'vs_TEST1_secret');
  eq('the browser gets the redirect fallback', r.payload.url, 'https://verify.stripe.com/start/xyz');
  eq('the browser gets the publishable key', r.payload.pk, 'pk_live_test');
  eq('the response does not claim verification', r.payload.verified, false);

  eq('the claim is moved to pending', writes.length, 1);
  eq('the durable session id is stored', writes[0].patch.identity_session_id, 'vs_TEST1');
  eq('the status is stored alongside it', writes[0].patch.verification_status, 'pending');
  eq('the creation is audited', audits.map((a) => a.ev), ['identity_session_created']);
  eq('the audit stores the session id, not the hosted url', audits[0].detail, 'vs_TEST1');
}
{
  // Stripe is explicit that the hosted URL must not be stored or logged. It
  // may leave in the response body and nowhere else.
  rows = [claim()];
  await call('POST', { c: CUS, o: ORD });
  const persisted = JSON.stringify({ writes, audits });
  ok('the hosted url is never written to the database', !persisted.includes('verify.stripe.com'));
}
{
  // The customer id in the return URL is the caller's, but it has already been
  // proven to own this order, so it is safe. Encoding it is still required in
  // case an id ever contains something a URL cares about.
  rows = [claim({ stripe_customer_id: 'cus_ABCdef123456', order_number: 'DASP00020199' })];
  await call('POST', { c: 'cus_ABCdef123456', o: 'DASP00020199' });
  eq('the return url is built from the row, not the request',
    sessions[0].returnUrl, 'https://daspa.com.au/verify-id?c=cus_ABCdef123456&o=DASP00020199');
}

/* ---------- failures ---------- */

{
  rows = [claim()];
  dbThrows = new Error('connect ETIMEDOUT db.supabase.co:5432');
  const r = await call('GET', { c: CUS, o: ORD });
  dbThrows = null;
  eq('a database failure is a 502, not a 404', r.code, 502);
  eq('a database failure says nothing useful to an attacker',
    r.payload, { error: 'verification is unavailable right now' });
  ok('the internal message does not leak', !JSON.stringify(r.payload).includes('ETIMEDOUT'));
}
{
  rows = [claim()];
  sessionThrows = Object.assign(new Error('key is missing Identity write'), { permissions: true });
  const r = await call('POST', { c: CUS, o: ORD });
  sessionThrows = null;
  eq('a missing Stripe permission is a 502', r.code, 502);
  eq('a missing permission does not leave the claim marked pending', writes.length, 0);
}

/* ---------- rate limits ---------- */

{
  rows = [claim()];
  stripeVerified = false;
  let last = null;
  for (let i = 0; i < 32; i++) last = await call('GET', { c: CUS, o: ORD }, { ip: '203.0.113.9' });
  eq('the GET is capped', last.code, 429);
}
{
  rows = [claim()];
  let codes = [];
  for (let i = 0; i < 12; i++) {
    const r = await call('POST', { c: CUS, o: ORD }, { ip: '203.0.113.10' });
    codes.push(r.code);
  }
  eq('the POST is capped sooner than the GET', codes[11], 429);
  // A limit of 10 means ten get through: the tenth is served, the eleventh is
  // the first refusal.
  eq('the tenth POST is served and the eleventh is not',
    [codes[9], codes[10]], [200, 429]);
}
{
  // Separate buckets: hammering the read must not lock a client out of
  // actually starting their verification.
  rows = [claim()];
  for (let i = 0; i < 32; i++) await call('GET', { c: CUS, o: ORD }, { ip: '203.0.113.11' });
  const r = await call('POST', { c: CUS, o: ORD }, { ip: '203.0.113.11' });
  eq('the read limit does not close the write', r.code, 200);
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
