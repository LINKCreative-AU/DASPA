// GET ?cid=<uuid> → minimal status flags for the sequence-aware confirmation
// page. The claim id is a client-side generated UUID acting as a bearer
// reference, so we expose status flags only — never personal details.

const config = require('./_lib/config');
const db = require('./_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  const cid = (req.query && req.query.cid) || '';
  if (!/^[0-9a-f-]{36}$/i.test(cid)) return res.status(400).json({ error: 'invalid claim id' });

  try {
    const claim = await db.getClaim(cid);
    if (!claim) return res.status(404).json({ error: 'not found' });

    return res.status(200).json({
      payment_status: claim.payment_status,
      verification_status: claim.verification_status,
      claim_status: claim.claim_status,
      lodgement_live: config.LODGEMENT_LIVE,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
