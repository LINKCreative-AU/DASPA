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
const idDocs = require('./id-documents');

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

  /* After the announcements, because a purge failure must not cost the client
     their email. */
  const purged = await purgeIdDocuments(claim);

  console.log(`identity: ${claim.id} verified, client email=${sent}, ops alert=${alerted}`);
  return { claimed: true, claimId: claim.id, sent, alerted, purged };
}

/* Destroys any ID documents the client uploaded through /id-verification, now
   that the check they were for has passed.

   Only reaches anything for the few claims that came through the manual
   upload. The team downloads those images and runs the check by hand in Stripe
   against the client's Stripe customer; Stripe then sends the same
   identity.verification_session.verified event as for a check the client did
   themselves, the webhook resolves the claim through related_customer, and
   markVerified above lands here. Juan's point, 5 November 2026: the
   verification is through Stripe even when we do it, so this fires either way.

   What is kept is the record that a check was done (submission.json in the
   bucket and the two timestamp columns), not the photographs. Ported from
   abnassist-site/lib/identity-verified.js.

   The path is cleared only after the delete succeeds. A failed purge leaves the
   pointer in place, so the 30-day sweep can finish the job rather than leaving
   images nothing knows about. Every failure is a logged no-op: the verification
   is already recorded and must not be undone by a storage problem. */
async function purgeIdDocuments(claim) {
  const prefix = claim && claim.id_documents_path;
  if (!prefix) return { skipped: 'none held' };

  let result;
  try {
    result = await idDocs.purge(prefix);
  } catch (e) {
    console.error(`identity: ID documents for ${claim.id} at ${prefix} were NOT deleted:`, e.message);
    return { error: e.message, prefix };
  }

  try {
    await db.updateClaim(claim.id, {
      id_documents_path: null,
      id_documents_deleted_at: result.at || new Date().toISOString(),
    });
    await db.insertAudit(claim.id, 'id_documents_deleted', `${result.deleted} file(s), claim verified`)
      .catch(() => {});
  } catch (e) {
    /* The images are already gone, so this is bookkeeping rather than
       retention. Loud, because the row now points at an empty folder. */
    console.error(`identity: deleted ${result.deleted} ID document(s) for ${claim.id} but could not clear the path:`, e.message);
  }

  console.log(`identity: ${claim.id} verified, ${result.deleted} uploaded ID document(s) destroyed`);
  return result;
}

module.exports = { markVerified, purgeIdDocuments };
