// One-off: give the pre-fix paid claims a Stripe Customer.
//
// WHY THIS EXISTS
//
// The four clients who paid between 27 August and 8 September have no
// stripe_customer_id, because the old checkout did not send
// customer_creation:'always' and Stripe therefore never created a Customer for
// them. Two things need one:
//
//   1. The durable verification link. /verify-id?c=cus_...&o=DASP... is keyed on
//      the customer id, and the endpoint's whole security model is proving that
//      customer and that order belong together on a paid claim. No Customer, no
//      link.
//   2. The safety net. The self-repair in /api/claim-status asks Stripe "is this
//      customer verified" and needs a customer to ask about. Without one, a
//      verification whose webhook goes missing leaves the client silently
//      unverified and nobody looking.
//
// WHY AN ENDPOINT AND NOT A SCRIPT
//
// A script is the better shape and was the first plan. It needs a terminal with
// the live Stripe key and the Supabase service role key in it, and the person
// who has to run this works from the Stripe, Supabase and Vercel dashboards.
// An endpoint is what he can actually use.
//
// THIS IS TEMPORARY. Delete the file once the backfill is done. Every claim from
// now on gets a Customer at checkout, so it has no ongoing purpose, and an
// endpoint that writes to production is not something to leave lying around.
//
// SAFETY
//
//   - HEALTH_KEY required, and 404 without it, same as /api/health.
//   - Dry run by default. Nothing is written unless &apply=1 is passed.
//   - Only ever touches claims that are paid AND have no customer. It cannot
//     overwrite an existing one.
//   - Capped at 25 claims per call.
//   - Idempotency-Key is derived from the claim id, so a second run returns the
//     SAME Stripe Customer rather than creating a duplicate. This is the part
//     that makes a re-run safe rather than merely tolerable.
//   - Never returns a key, and reports per claim so a partial failure is visible.

'use strict';

const db = require('./_lib/supabase');
const { stripeHeaders } = require('./_lib/stripe');

const CAP = 25;

async function createCustomer(claim) {
  const body = new URLSearchParams({
    email: claim.email || '',
    name: claim.full_name || '',
    'metadata[claim_id]': claim.id,
    'metadata[order_number]': claim.order_number || '',
    'metadata[backfilled]': 'pre-customer_creation payment, see api/admin-backfill-customers.js',
    description: `DASP claim ${claim.order_number || claim.id}`,
  });

  const r = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: stripeHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      /* Derived from the claim, not random. Stripe replays the original
         response for 24 hours, so a re-run inside that window cannot mint a
         second Customer for the same person. Beyond 24 hours the payment_status
         and null-customer filter is what stops it, since the first run will
         have filled the column. */
      'Idempotency-Key': `daspa-customer-${claim.id}`,
    }),
    body: body.toString(),
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error((j.error && j.error.message) || `stripe ${r.status}`);
    err.status = r.status;
    /* 403 on a valid key means the restricted key is missing the permission,
       which is a dashboard fix rather than a code one. Say so. */
    if (r.status === 403) {
      err.fix = 'The restricted key cannot write Customers. Stripe, Developers, '
        + 'API keys, daspa-site live: set Customers to Write.';
    }
    throw err;
  }
  return j.id;
}

module.exports = async (req, res) => {
  const expected = String(process.env.HEALTH_KEY || '').trim();
  const key = (req.query && (req.query.key || req.query.k)) || '';
  if (!expected || String(key).trim() !== expected) return res.status(404).end();

  const apply = !!(req.query && req.query.apply);
  res.setHeader('Cache-Control', 'no-store');

  try {
    /* Paid, no customer. Ordered by paid_at so the output reads in the same
       order as the Stripe payments list, which is what a human checking this
       will have open next to it. */
    const claims = await db.selectClaims(
      'payment_status=eq.paid&stripe_customer_id=is.null&select=*&order=paid_at.asc'
    );

    const todo = claims.slice(0, CAP);
    const out = {
      mode: apply ? 'APPLIED' : 'dry run, nothing written',
      found: claims.length,
      processing: todo.length,
      capped: claims.length > CAP ? `only the first ${CAP} of this call` : false,
      results: [],
    };

    for (const c of todo) {
      const row = {
        order_number: c.order_number || null,
        name: c.full_name || null,
        email: c.email || null,
        paid_at: c.paid_at || null,
      };
      if (!apply) {
        row.would = 'create a Stripe Customer and record it against this claim';
        out.results.push(row);
        continue;
      }
      try {
        const customerId = await createCustomer(c);
        await db.updateClaim(c.id, { stripe_customer_id: customerId });
        await db.insertAudit(c.id, 'stripe_customer_backfilled', customerId).catch(() => {});
        row.stripe_customer_id = customerId;
        row.ok = true;
      } catch (e) {
        /* One failure must not abandon the rest. The filter means a re-run picks
           up exactly the ones still missing a customer. */
        row.ok = false;
        row.error = e.message;
        if (e.fix) row.fix = e.fix;
      }
      out.results.push(row);
    }

    if (!apply && claims.length) {
      out.next = 'Add &apply=1 to the same URL to create them.';
    }
    if (apply) {
      out.then = 'Delete api/admin-backfill-customers.js once every claim above '
        + 'reports ok. Checkout creates a Customer for every new claim, so this '
        + 'endpoint has no further purpose.';
    }
    return res.status(200).json(out);
  } catch (e) {
    console.error('backfill-customers failed:', e.message);
    return res.status(500).json({ error: 'internal error', detail: e.message });
  }
};
