/* What happens when a claim's identity is confirmed. One implementation, three
   callers. Ported from abnassist-site/lib/identity-verified.js.

   The Stripe webhook is the normal path. /api/claim-status calls the same thing
   when it finds Stripe saying verified while our row does not, which repairs a
   missed webhook on any visit to /verify or /confirmation. The 6-hourly cron is
   the third, so a claim nobody revisits is still picked up.

   THREE CALLERS IS THE WHOLE POINT HERE. DASPA had exactly one writer, a
   webhook that had never been created in Stripe, and three clients paid in
   August and September 2026 and were never marked as anything. A single path
   from Stripe to our database is a single point of failure, and this is the
   file that stops there being one.

   IDEMPOTENT, BECAUSE ALL THREE CAN FIRE FOR ONE CLAIM. Stripe retries webhooks
   for three days, the client may open the link repeatedly, and the cron sweeps
   regardless. So the write is conditional in the database rather than
   checked-then-written here: the PATCH carries `verification_status=neq.verified`
   and PostgREST reports the rows it changed. Zero rows means somebody else got
   there first, and the emails are skipped. Checking first and writing second
   would race with itself.
*/

'use strict';

const db = require('./supabase');
const email = require('./email');

/* Marks a claim verified and does what follows from it.
   Returns { claimed } so a caller can log whether this call was the one that
   did the work, which is the only interesting part when three things race. */
async function markVerified({ claimId, customerId, sessionId, at }) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('identity: claim store not configured, cannot record verification for',
      claimId || customerId);
    return { claimed: false, error: 'no claim store' };
  }
  if (!claimId && !customerId) return { claimed: false, error: 'nothing to identify the claim by' };

  const when = (at instanceof Date ? at : new Date()).toISOString();

  /* Only a paid claim can be marked verified. An unpaid one should never reach
     here, and requiring paid means a stray session cannot advance a claim that
     has not been through checkout. */
  const filter = (claimId
    ? `id=eq.${encodeURIComponent(claimId)}`
    : `stripe_customer_id=eq.${encodeURIComponent(customerId)}`)
    + '&verification_status=neq.verified&payment_status=eq.paid';

  let rows;
  try {
    rows = await db.patchClaims(filter, {
      verification_status: 'verified',
      claim_status: 'ready_for_lodgement',
      identity_verified_at: when,
      ...(sessionId ? { identity_session_id: sessionId } : {}),
    });
  } catch (e) {
    console.error('identity: could not record verification for', claimId || customerId, e.message);
    return { claimed: false, error: e.message };
  }

  const claim = Array.isArray(rows) && rows[0];
  if (!claim) {
    /* Not an error, and the common case on a retry or a revisit. Also covers an
       unpaid claim, which should never reach here, and a claim id that is not
       ours, which the endpoints have already refused. */
    return { claimed: false };
  }

  await db.insertAudit(claim.id, 'identity_verified', sessionId || customerId || '');

  /* The client is told, and so are we, because the two audiences are different
     and neither substitutes for the other. Both are best-effort by design: a
     verification recorded but not announced is recoverable, one announced but
     not recorded is not. Which is why the row is written first.

     ActiveCampaign is deliberately absent. ABN Assist tags the contact here to
     release the order inside AC, and DASPA will need the same, but DASPA has no
     AC integration yet and inventing one blind would be worse than a gap that
     is written down. See README, "ActiveCampaign". */
  const [sent, alerted] = await Promise.all([
    email.verified(claim).then(() => true).catch((e) => {
      console.error('identity: verified email failed for', claim.id, e.message); return false;
    }),
    email.opsVerified(claim).then(() => true).catch((e) => {
      console.error('identity: ops alert failed for', claim.id, e.message); return false;
    }),
  ]);
  if (sent) await db.insertAudit(claim.id, 'email_verified', claim.email);

  console.log(`identity: ${claim.id} verified, client email=${sent}, ops alert=${alerted}`);
  return { claimed: true, claimId: claim.id, sent, alerted };
}

module.exports = { markVerified };
