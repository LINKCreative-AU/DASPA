/* Drives api/stripe-webhook.js with real-shaped Stripe events against fakes for
   Supabase and email, and asserts what it writes.

   Run with:  node tests/stripe-webhook.mjs

   Worth having because the refund path is the one branch of this webhook that
   cannot be exercised by clicking through the site: it needs a real refund on a
   real charge. The distinctions it encodes are easy to get wrong by reading and
   expensive to get wrong in production, in particular that a PARTIAL refund
   must not mark a claim refunded, and that a DISPUTE must not either, because
   in a dispute the money has not moved back yet.

   The forged-signature case is here too, so the verification cannot be
   accidentally loosened without something failing. */
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Module = require('node:module');

const SECRET = 'whsec_test';
const writes = [];
const mails = [];

const dbFake = {
  getClaim: async () => null,
  getClaimByPaymentIntent: async (pi) =>
    pi === 'pi_match' ? { id: 'claim-1', full_name: 'Test Person', email: 't@e.com', payment_status: 'paid', claim_status: 'ready_for_lodgement' } : null,
  updateClaim: async (id, patch) => { writes.push({ kind: 'update', id, patch }); return {}; },
  patchClaims: async (q, patch) => { writes.push({ kind: 'patch', q, patch }); return [{ id: 'claim-1' }]; },
  selectClaims: async () => [],
  insertAudit: async (id, ev, detail) => { writes.push({ kind: 'audit', ev, detail }); },
};
const emailFake = new Proxy({}, { get: (_t, name) => async (...a) => { mails.push({ name, a }); return true; } });

// Intercept the two requires the handler makes.
const origLoad = Module._load;
Module._load = function (req, parent, isMain) {
  if (req === './_lib/supabase') return dbFake;
  if (req === './_lib/email') return emailFake;
  if (req === './_lib/identity-verified') return { markVerified: async () => ({ claimed: true }) };
  return origLoad.apply(this, arguments);
};
// Relative, resolved against this file by createRequire above. An absolute
// path works on one machine and fails on every CI runner.
const handler = require('../api/stripe-webhook.js');

function post(event, signWith) {
  const body = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac('sha256', signWith || SECRET).update(`${t}.${body}`).digest('hex');
  const req = { method: 'POST', headers: { 'stripe-signature': `t=${t},v1=${sig}` },
    on: (ev, cb) => { if (ev === 'data') cb(Buffer.from(body)); if (ev === 'end') cb(); } };
  let code, payload;
  const res = { status(c) { code = c; return this; }, json(p) { payload = p; return this; } };
  return handler(req, res).then(() => ({ code, payload }));
}

process.env.STRIPE_WEBHOOK_SECRET = SECRET;
let fails = 0;
const check = (label, cond) => { console.log((cond ? 'PASS  ' : 'FAIL  ') + label); if (!cond) fails++; };

// --- full refund
writes.length = 0; mails.length = 0;
let r = await post({ type: 'charge.refunded', created: 1788000000,
  data: { object: { id: 'ch_1', payment_intent: 'pi_match', amount: 16390, amount_refunded: 16390,
    refunds: { data: [{ reason: 'requested_by_customer' }] } } } });
check('full refund -> 200', r.code === 200);
const fullPatch = writes.find(w => w.kind === 'patch');
check('full refund -> payment_status refunded', fullPatch?.patch.payment_status === 'refunded');
check('full refund -> claim_status on_hold', fullPatch?.patch.claim_status === 'on_hold');
check('full refund -> conditional on neq.refunded', /payment_status=neq\.refunded/.test(fullPatch?.q || ''));
check('full refund -> refunded_at set', !!fullPatch?.patch.refunded_at);
check('full refund -> ops alerted as full', mails.some(m => m.name === 'opsRefunded' && m.a[1].full === true));

// --- partial refund
writes.length = 0; mails.length = 0;
r = await post({ type: 'charge.refunded', created: 1788000000,
  data: { object: { id: 'ch_2', payment_intent: 'pi_match', amount: 16390, amount_refunded: 5000, refunds: { data: [] } } } });
check('partial refund -> 200', r.code === 200);
check('partial refund -> does NOT mark refunded', !writes.some(w => w.patch?.payment_status === 'refunded'));
check('partial refund -> on_hold only', writes.some(w => w.kind === 'update' && w.patch.claim_status === 'on_hold'));
check('partial refund -> ops alerted as partial', mails.some(m => m.name === 'opsRefunded' && m.a[1].full === false));

// --- refund for a charge that is not ours
writes.length = 0; mails.length = 0;
r = await post({ type: 'charge.refunded', created: 1788000000,
  data: { object: { id: 'ch_3', payment_intent: 'pi_other', amount: 500, amount_refunded: 500 } } });
check('unknown charge -> 200 and no writes', r.code === 200 && writes.length === 0 && mails.length === 0);

// --- dispute
writes.length = 0; mails.length = 0;
r = await post({ type: 'charge.dispute.created', created: 1788000000,
  data: { object: { id: 'dp_1', payment_intent: 'pi_match', amount: 16390, reason: 'fraudulent',
    evidence_details: { due_by: 1789000000 } } } });
check('dispute -> 200', r.code === 200);
check('dispute -> on_hold', writes.some(w => w.kind === 'update' && w.patch.claim_status === 'on_hold'));
check('dispute -> NOT marked refunded', !writes.some(w => w.patch?.payment_status === 'refunded'));
check('dispute -> ops alerted with reason and due date',
  mails.some(m => m.name === 'opsDispute' && m.a[1].reason === 'fraudulent' && m.a[1].dueBy === '2026-09-10'));

// --- bad signature still rejected
const body = JSON.stringify({ type: 'charge.refunded' });
const bad = await (async () => {
  const req = { method: 'POST', headers: { 'stripe-signature': 't=1,v1=deadbeef' },
    on: (ev, cb) => { if (ev === 'data') cb(Buffer.from(body)); if (ev === 'end') cb(); } };
  let code; const res = { status(c) { code = c; return this; }, json() { return this; } };
  await handler(req, res); return code;
})();
check('forged signature -> 400', bad === 400);

/* ---- a pasted secret with whitespace must still verify ----
   Juan's STRIPE_WEBHOOK_SECRET arrived with a trailing line break from Vercel's
   multi-line value box. Untrimmed, that makes every HMAC wrong and every
   delivery a 400: no claim paid, no email, no alert. The same silence as having
   no webhook at all, which is the fault this endpoint exists to fix. */
const CLEAN = 'whsec_test';
async function postWith(envValue, signWith) {
  process.env.STRIPE_WEBHOOK_SECRET = envValue;
  const r = await post({ type: 'ping', created: 1, data: { object: {} } }, signWith);
  process.env.STRIPE_WEBHOOK_SECRET = SECRET;
  return r.code;
}
check('trailing newline in env -> still accepted', await postWith(CLEAN + '\n', CLEAN) === 200);
check('padding and CRLF in env -> still accepted', await postWith('  ' + CLEAN + ' \r\n', CLEAN) === 200);
check('genuinely wrong secret -> still rejected', await postWith(CLEAN, 'whsec_wrong') === 400);

console.log(fails ? `\n${fails} FAILED` : '\nall assertions passed');
process.exit(fails ? 1 : 0);
