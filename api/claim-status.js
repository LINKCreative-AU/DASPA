// GET ?cid=<uuid> → minimal status flags for the sequence-aware confirmation
// page. The claim id is a client-side generated UUID acting as a bearer
// reference, so we expose status flags only. Never personal details.

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const identity = require('./_lib/identity');
const verified = require('./_lib/identity-verified');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  const cid = (req.query && req.query.cid) || '';
  if (!/^[0-9a-f-]{36}$/i.test(cid)) return res.status(400).json({ error: 'invalid claim id' });

  try {
    const claim = await db.getClaim(cid);
    if (!claim) return res.status(404).json({ error: 'not found' });

    /* ---------- repair a missed webhook, on any visit ----------
       Our row is the fast path; Stripe is the authority. Ported from
       abnassist-site/api/identity.js, and it is the single most valuable thing
       in that design.

       Stripe saying verified while our row does not means the webhook never
       landed, and left alone that is the worst failure in the whole flow: the
       client is told they are done, the team is never cleared, and the claim
       sits with nobody looking for it. That is not hypothetical here. Three
       clients paid in August and September 2026 and nothing was ever recorded,
       because the only writer was a webhook that had never been created in
       Stripe. So this visit does the work the webhook missed.

       markVerified is idempotent and claims the row conditionally, so it is
       safe even if the webhook arrives at the same moment. Guarded on
       stripe_customer_id because related_customer is what makes the lookup
       possible, and claims taken before customer_creation was set to 'always'
       do not have one. Best-effort: a failed repair must never stop the page
       reading a status. */
    let verificationStatus = claim.verification_status;
    if (identity.ENABLED
        && verificationStatus !== 'verified'
        && claim.payment_status === 'paid'
        && claim.stripe_customer_id) {
      try {
        if (await identity.isVerified(claim.stripe_customer_id)) {
          verificationStatus = 'verified';
          const r = await verified.markVerified({
            claimId: claim.id, customerId: claim.stripe_customer_id,
          });
          if (r.claimed) {
            console.warn(`identity: repaired ${claim.id} from a status read; ` +
              'the webhook for it never arrived');
          }
        }
      } catch (e) {
        console.error('claim-status: verification repair check failed for', claim.id, e.message);
      }
    }

    return res.status(200).json({
      payment_status: claim.payment_status,
      verification_status: verificationStatus,
      claim_status: verificationStatus === 'verified' && claim.claim_status !== 'ready_for_lodgement'
        ? 'ready_for_lodgement'   // repaired above, so do not report the stale value
        : claim.claim_status,
      lodgement_live: config.LODGEMENT_LIVE,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
