// POST { claimId } → creates a Stripe Identity VerificationSession and returns
// { url } for a full-page redirect. Replaces the Didit integration.
//
// WHY STRIPE IDENTITY. DASPA already runs payments through Stripe, and this
// incident was caused by credentials spread across vendors where three of the
// eleven were never set. Identity rides the same secret key, the same webhook
// endpoint and the same signing secret as the payment flow, so it adds no new
// credential that can silently be missing. One optional variable instead of
// three mandatory ones.
//
// KNOWN LIMIT, DELIBERATELY ACCEPTED. The Stripe Identity Agreement prohibits
// verifying anyone "linked directly or indirectly" with China or the Russian
// Federation. That is a policy restriction, not a coverage gap: both countries
// appear in Stripe's supported-document list. Claimants holding those passports
// must go through /upload-form and be verified by hand instead. Confirmed with
// Juan, 7 September 2026. The agreement sits on the same Stripe account that
// processes every payment, so this is not something to leave to chance: the
// manualOnly() gate below refuses those claims with a 403 before any session is
// created, and /verify explains the manual route rather than showing an error.
//
// Env: STRIPE_SECRET_KEY (already required for checkout),
//      STRIPE_VERIFICATION_FLOW_ID (optional, see below).

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const email = require('./_lib/email');

// Which checks to run. A verification flow is configured in the Stripe
// dashboard and referenced by id, so the team can change what is collected
// without a deploy. That is the same shape as the DIDIT_WORKFLOW_ID it
// replaces. With no flow id set we fall back to explicit options so the
// endpoint still works out of the box.
function checkParams() {
  const flow = String(process.env.STRIPE_VERIFICATION_FLOW_ID || '').trim();
  if (flow) return { verification_flow: flow };

  return {
    type: 'document',
    // The page promises "your passport and a quick selfie", and the claim form
    // collects a passport number and issuing country, so passport is the only
    // document we should be asking for.
    'options[document][allowed_types][0]': 'passport',
    // The selfie check is the one that actually defeats the fraud this service
    // attracts: somebody claiming a stranger's super with a stolen passport.
    'options[document][require_matching_selfie]': 'true',
    // require_live_capture is deliberately NOT set. It disables image upload
    // entirely, which locks out anyone on a laptop without a webcam, and the
    // selfie match already covers the attack it would prevent.
  };
}

// Countries the Stripe Identity Agreement puts out of reach (see the header).
// The claim form takes country of issue as free text, so this has to absorb
// spellings, abbreviations and scripts rather than match a code. Hong Kong and
// Macau are included because they are Chinese SARs travelling on Chinese SAR
// passports, and the agreement says "linked directly or indirectly".
//
// Taiwan is deliberately NOT here. Stripe lists Taiwan separately in its own
// supported-document tables, so blocking it would refuse claimants Stripe is
// willing to verify. Worth a written answer from Stripe before launch, because
// Taiwanese claimants are a real share of this market.
const MANUAL_ONLY = [
  /\bchina\b/, /\bchinese\b/, /\bprc\b/, /\bp\.?r\.?c\b/, /\bcn\b/, /\bchn\b/,
  /中国/, /中國/,
  /\bhong\s*kong\b/, /\bhksar\b/, /\bhk\b/, /香港/,
  /\bmaca[uo]\b/, /\bmo\b/, /澳門/, /澳门/,
  /\brussia\b/, /\brussian\b/, /\bru\b/, /\brus\b/, /росси/i,
];

// Explicitly naming Taiwan wins over the China patterns, so "Republic of China
// (Taiwan)" is read as Taiwan. "Republic of China" on its own is not exempted:
// it is ambiguous, and a needless manual check costs us nothing while a wrongly
// permitted one breaches the agreement.
const TAIWAN = [/\btaiwan\b/, /\btwn?\b/, /台湾/, /台灣/];

function manualOnly(country) {
  const c = String(country || '').toLowerCase().trim();
  if (!c) return false;
  if (TAIWAN.some((re) => re.test(c))) return false;
  return MANUAL_ONLY.some((re) => re.test(c));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { claimId } = req.body || {};
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(400).json({ error: 'invalid claim id' });
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(404).json({ error: 'claim not found' });

    // These two statuses are what /verify reads to decide what to show before
    // it offers the button, so keep the codes stable if you touch them.
    if (claim.payment_status !== 'paid') return res.status(402).json({ error: 'payment required' });
    if (claim.verification_status === 'verified') return res.status(409).json({ error: 'already verified' });

    /* A claimant Stripe will not verify must never be sent into a flow that
       refuses them. This is the same failure the August 2026 incident produced,
       paid and then stuck, so it is caught here rather than at Stripe's error
       page. 403 is distinct from every other code /verify already handles. */
    if (manualOnly(claim.passport_country)) {
      await db.insertAudit(claim.id, 'identity_manual_required', String(claim.passport_country || ''))
        .catch(() => {});
      await email.opsNeedsReview(claim, 'manual identity verification required: passport issued by '
        + (claim.passport_country || 'an unstated country') + ', which Stripe Identity cannot verify')
        .catch(() => {});
      return res.status(403).json({ error: 'manual verification required' });
    }

    const params = new URLSearchParams({
      ...checkParams(),
      // Both, so the webhook can find the claim from either field. Mirrors how
      // api/create-checkout.js stamps the checkout session.
      'metadata[claim_id]': claim.id,
      client_reference_id: claim.id,
      // Shown to the person mid-flow so they can see whose verification this is.
      'provided_details[email]': claim.email || '',
      return_url: `${config.SITE_URL}/confirmation?cid=${claim.id}`,
    });

    const r = await fetch('https://api.stripe.com/v1/identity/verification_sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!r.ok) {
      // Stripe's message names the actual problem (an ineligible account, a
      // missing Identity application, a bad flow id), so keep it in the log.
      // It is never returned to the client.
      console.error('identity session create failed:', r.status, await r.text());
      return res.status(502).json({ error: 'could not start verification' });
    }

    const session = await r.json();
    if (!session.url) {
      console.error('identity session had no url:', session.id, session.status);
      return res.status(502).json({ error: 'could not start verification' });
    }

    // Record the session id so a webhook can be reconciled by hand later, and
    // so a second click does not silently open an unrelated session.
    await db.updateClaim(claim.id, {
      identity_session_id: session.id,
      verification_status: 'pending',
    });
    await db.insertAudit(claim.id, 'identity_session_created', session.id);

    // The session URL is single-use and expires after 48 hours. Stripe's
    // guidance is explicit: do not store it, log it, or embed it anywhere. So
    // it is handed straight to the one browser that asked for it and nowhere
    // else. The session ID above is the durable reference.
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
