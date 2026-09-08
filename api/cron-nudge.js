// Email dispatcher. NOT SCHEDULED ANY MORE, and nothing calls it.
//
// The crons block was removed from vercel.json on 8 September 2026. Two
// reasons. Immediately, four clients had paid without being recorded as paid,
// and the moment the recovery ran they would have become eligible for an
// automated nudge before a person had apologised to them. Longer term, both of
// these messages are moving to ActiveCampaign, so the schedule was going away
// regardless.
//
// The endpoint is kept rather than deleted because it still requires
// "Authorization: Bearer <CRON_SECRET>", so it is inert but available: adding
// the crons block back, or `vercel crons run /api/cron-nudge`, restores it
// exactly as it was. Delete it once ActiveCampaign owns both messages.
//
// DO NOT try to disable this by clearing CRON_SECRET. The guard below is
// `if (cronSecret && ...)`, so an unset secret does not lock the endpoint, it
// removes the lock and makes it callable by anyone.
//
// What it does when it runs:
//   1. Verification abandoned >24h after payment → one nudge email.
//   2. claim_status moved to 'lodged' in the Supabase dashboard → "lodged with
//      the ATO" email. Worth knowing while this is parked: moving a claim to
//      'lodged' in Supabase no longer emails anyone, because nothing is calling
//      this. The client will not be told until ActiveCampaign takes over.

const db = require('./_lib/supabase');
const email = require('./_lib/email');

module.exports = async (req, res) => {
  // Trimmed: a trailing newline in the variable would lock Vercel's own cron
  // out of its own endpoint, and the only symptom would be nudges quietly
  // never sending. See the note in api/stripe-webhook.js.
  const cronSecret = String(process.env.CRON_SECRET || '').trim();
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const results = { nudged: 0, lodged_emails: 0 };
  try {
    // --- 1. abandoned verification nudges (paid, still unverified after 24h, not yet nudged)
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const stale = await db.selectClaims(
      `payment_status=eq.paid&verification_status=neq.verified&nudge_email_sent_at=is.null&paid_at=lt.${cutoff}&select=*`
    );
    for (const claim of stale) {
      if (await email.verificationNudge(claim)) {
        await db.updateClaim(claim.id, { nudge_email_sent_at: new Date().toISOString() });
        await db.insertAudit(claim.id, 'email_verification_nudge', claim.email);
        results.nudged++;
      }
    }

    // --- 2. lodged emails
    const lodged = await db.selectClaims(
      `claim_status=eq.lodged&lodged_email_sent_at=is.null&select=*`
    );
    for (const claim of lodged) {
      if (await email.lodged(claim)) {
        await db.updateClaim(claim.id, { lodged_email_sent_at: new Date().toISOString() });
        await db.insertAudit(claim.id, 'email_lodged', claim.email);
        results.lodged_emails++;
      }
    }

    return res.status(200).json(results);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error', ...results });
  }
};
