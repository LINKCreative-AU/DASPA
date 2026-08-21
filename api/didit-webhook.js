// Didit webhook, updates the claim as verification decisions arrive.
// Verifies the X-Signature-V2 HMAC (SHA-256 of the raw body with
// DIDIT_WEBHOOK_SECRET) with a constant-time compare, and rejects events
// whose timestamp is older than five minutes (replay protection).
//
// Status mapping:
//   Approved            → verification_status verified, claim_status ready_for_lodgement
//   Declined / In Review→ verification_status needs_review, claim_status needs_review
//   Abandoned           → verification_status pending, claim_status verification_pending,
//                         reminder email sent
//
// NOTE: the decision payload uses PLURAL arrays, id_verifications,
// liveness_checks, face_matches, one entry per attempt. Read the latest.
// Env: DIDIT_WEBHOOK_SECRET.

const crypto = require('crypto');
const db = require('./_lib/supabase');
const email = require('./_lib/email');

module.exports.config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = await rawBody(req);

  // --- signature: constant-time compare of the hex HMAC
  const given = String(req.headers['x-signature-v2'] || req.headers['x-signature'] || '');
  const expected = crypto
    .createHmac('sha256', process.env.DIDIT_WEBHOOK_SECRET || '')
    .update(payload)
    .digest('hex');
  const a = Buffer.from(given, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'invalid signature' });
  }

  // --- replay protection: reject events older than five minutes
  let event;
  try {
    event = JSON.parse(payload.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'invalid payload' });
  }
  const tsRaw = Number(req.headers['x-timestamp'] || event.created_at || event.timestamp || 0);
  const tsSec = tsRaw > 1e12 ? tsRaw / 1000 : tsRaw; // tolerate ms or s
  if (!tsSec || Math.abs(Date.now() / 1000 - tsSec) > 300) {
    return res.status(401).json({ error: 'stale timestamp' });
  }

  try {
    const claimId = event.vendor_data;
    const status = event.status || (event.decision && event.decision.status);
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(200).json({ received: true }); // not ours, ack so Didit stops retrying
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(200).json({ received: true });

    // Latest attempt from the plural decision arrays (id_verifications,
    // liveness_checks, face_matches), stored for the team's review queue.
    const d = event.decision || {};
    const last = (arr) => (Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null);
    const summary = {
      id_verification: (last(d.id_verifications) || {}).status || null,
      liveness: (last(d.liveness_checks) || {}).status || null,
      face_match: (last(d.face_matches) || {}).status || null,
    };

    if (status === 'Approved') {
      await db.updateClaim(claimId, {
        verification_status: 'verified',
        claim_status: 'ready_for_lodgement',
        didit_session_id: event.session_id || claim.didit_session_id,
      });
      await db.insertAudit(claimId, 'didit_approved', JSON.stringify(summary));
      await email.verified(claim);
      await db.insertAudit(claimId, 'email_verified', claim.email);
      await email.opsVerified(claim);
    } else if (status === 'Declined' || status === 'In Review') {
      await db.updateClaim(claimId, {
        verification_status: 'needs_review',
        claim_status: 'needs_review',
      });
      await db.insertAudit(claimId, `didit_${status.toLowerCase().replace(' ', '_')}`, JSON.stringify(summary));
      await email.opsNeedsReview(claim, status);
    } else if (status === 'Abandoned') {
      await db.updateClaim(claimId, {
        verification_status: 'pending',
        claim_status: 'verification_pending',
      });
      await db.insertAudit(claimId, 'didit_abandoned', event.session_id || null);
      await email.verificationNudge(claim);
      await db.insertAudit(claimId, 'email_verification_nudge', claim.email);
    } else {
      await db.insertAudit(claimId, 'didit_event', String(status));
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
