// Scheduled email dispatcher (vercel.json crons — every 6 hours).
//   1. Verification abandoned >24h after payment → one nudge email.
//   2. claim_status moved to 'lodged' in the Supabase dashboard → "lodged with
//      the ATO" email (the team works the queue in the dashboard; this is how
//      a manual status change still triggers the client email).
// Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically when the
// CRON_SECRET env var is set.

const db = require('./_lib/supabase');
const email = require('./_lib/email');

module.exports = async (req, res) => {
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
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
