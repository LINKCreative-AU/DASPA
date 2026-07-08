// POST { claimId } → creates a Didit verification session (v3 Sessions API,
// per docs.didit.me) and returns { url } for a full-page redirect — the most
// reliable route to the phone camera for a mobile-first audience.
// Env: DIDIT_API_KEY, DIDIT_WORKFLOW_ID.

const config = require('./_lib/config');
const db = require('./_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { claimId } = req.body || {};
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(400).json({ error: 'invalid claim id' });
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(404).json({ error: 'claim not found' });
    if (claim.payment_status !== 'paid') return res.status(402).json({ error: 'payment required' });
    if (claim.verification_status === 'verified') return res.status(409).json({ error: 'already verified' });

    const r = await fetch('https://verification.didit.me/v3/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.DIDIT_API_KEY,
      },
      body: JSON.stringify({
        workflow_id: process.env.DIDIT_WORKFLOW_ID,
        // vendor_data ties the Didit session back to our Supabase record —
        // the webhook uses it to find the claim.
        vendor_data: claim.id,
        callback: `${config.SITE_URL}/confirmation?cid=${claim.id}`,
      }),
    });
    const session = await r.json();
    if (!r.ok || !session.url) {
      console.error('didit session create failed:', r.status, JSON.stringify(session).slice(0, 500));
      return res.status(502).json({ error: 'verification provider unavailable' });
    }

    await db.updateClaim(claim.id, {
      didit_session_id: session.session_id || session.id || null,
      verification_status: 'pending',
    });
    await db.insertAudit(claim.id, 'didit_session_created', session.session_id || session.id);

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
