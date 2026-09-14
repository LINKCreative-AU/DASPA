// One-off: send the payment confirmation to the clients caught in the
// September incident.
//
// WHY THIS EXISTS
//
// Between 27 August and 8 September 2026 four clients paid with no webhook
// destination configured, so `checkout.session.completed` was never delivered
// and `email.paymentConfirmed` never ran. Their rows were repaired afterwards
// by hand and by api/admin-backfill-customers.js, so they read `paid` today.
//
// That repair is exactly what makes them unreachable. The webhook is the only
// caller of paymentConfirmed, and it is guarded by
//
//     if (claim && claim.payment_status !== 'paid')
//
// which is correct: it is what stops Stripe's own retries sending a client
// four confirmations. But it also means REPLAYING THE STRIPE EVENTS SENDS
// NOTHING. The guard sees `paid` and returns. There is no path in the site
// that can email these people, and that is the only reason they have still
// heard nothing.
//
// So this is not a resend. It is the first send, late.
//
// WHY AN ENDPOINT AND NOT A SCRIPT
//
// Same reasoning as api/admin-backfill-customers.js: a script needs a terminal
// holding the live Resend and Supabase service-role keys, and the person who
// runs this works from the Vercel, Stripe and Supabase dashboards.
//
// THIS IS TEMPORARY. Delete it once the four incident claims are contacted.
// Every claim from now on is emailed by the webhook at the moment it pays, so
// this has no ongoing purpose, and an endpoint that emails clients is not
// something to leave lying around.
//
// SAFETY
//
//   - HEALTH_KEY required, and 404 without it, same as /api/health.
//   - Dry run by default. Nothing is sent unless &apply=1 is passed.
//   - Once only per claim, marked in the audit log, and the marker is written
//     only after the send resolves. A failed send is retried on the next call
//     rather than silently recorded as done.
//   - Only claims that are `paid`. Never a refunded one: DASP00020158 was
//     refunded on 27 August and telling that client their payment is confirmed
//     would be false.
//   - Only claims that already carry a Stripe Customer, because the email's
//     whole point is the verification link and verifyUrl() returns null
//     without one. A claim with no customer is reported, not sent to.
//   - Accepts an explicit `order` so it can be run one client at a time.
//   - Never returns a key, a TFN, or any claim field beyond the order number
//     and the outcome.

'use strict';

const db = require('./_lib/supabase');
const email = require('./_lib/email');
const config = require('./_lib/config');

const AUDIT_EVENT = 'payment_confirmation_recovered';
const CAP = 10;
const ORDER_RE = /^DASP[0-9]{8}$/;

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  /* 404 rather than 401, so daspa.com.au does not admit the endpoint exists. */
  const key = String(process.env.HEALTH_KEY || '').trim();
  if (!key || String((req.query && req.query.key) || '') !== key) {
    return res.status(404).json({ error: 'not found' });
  }

  const apply = String((req.query && req.query.apply) || '') === '1';
  const order = String((req.query && req.query.order) || '').trim();
  if (order && !ORDER_RE.test(order)) {
    return res.status(400).json({ error: 'order must look like DASP00000000' });
  }

  /* paid only, and paid_at as belt and braces on the same thing. A refunded
     claim carries payment_status='refunded' and is excluded by the filter
     rather than by a later check, so it cannot be reached by a query string. */
  let filter = 'payment_status=eq.paid&paid_at=not.is.null';
  if (order) filter += `&order_number=eq.${encodeURIComponent(order)}`;

  let claims;
  try {
    claims = await db.selectClaims(`${filter}&order=created_at.asc&limit=${CAP}`);
  } catch (e) {
    console.error('recover-send: claim lookup failed:', e.message);
    return res.status(502).json({ error: 'lookup failed' });
  }

  const results = [];
  for (const c of claims || []) {
    const ref = c.order_number || c.id;

    if (await db.hasAudit(c.id, AUDIT_EVENT)) {
      results.push({ order: ref, action: 'skipped', reason: 'already sent by this endpoint' });
      continue;
    }
    if (!c.stripe_customer_id) {
      results.push({ order: ref, action: 'skipped', reason: 'no stripe customer, so no verification link' });
      continue;
    }
    if (!c.email) {
      results.push({ order: ref, action: 'skipped', reason: 'no email address on the claim' });
      continue;
    }
    if (!apply) {
      results.push({ order: ref, action: 'would send', to: c.email });
      continue;
    }

    try {
      await email.paymentConfirmed(c);
    } catch (e) {
      console.error(`recover-send: ${ref} failed:`, e.message);
      results.push({ order: ref, action: 'failed', reason: e.message });
      continue;
    }
    /* Only after the send resolved. */
    await db.insertAudit(c.id, AUDIT_EVENT, 'September 2026 incident, no webhook at time of payment');
    results.push({ order: ref, action: 'sent', to: c.email });
  }

  return res.status(200).json({
    dry_run: !apply,
    lodgement_live: config.LODGEMENT_LIVE,
    considered: results.length,
    results,
  });
};
