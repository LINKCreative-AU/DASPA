// POST { claimId } -> starts a Stripe Identity check for a paid claim and
// returns { clientSecret, url, pk }.
//
// Modelled on abnassist-site/api/identity.js, which is the working reference.
// The status half of that endpoint lives in /api/claim-status here, because
// /verify and /confirmation were already reading it.
//
// BOTH HALVES ARE RETURNED ON PURPOSE. clientSecret drives the embedded Stripe
// modal, url is Stripe's hosted page. /verify tries the modal and falls back to
// the redirect if Stripe.js is blocked or the modal errors. ABN Assist needs
// only the modal: its customers are Australian and mostly on desktop. DASPA's
// arrive from overseas on phones, often inside the Instagram or WhatsApp in-app
// browser, where an embedded modal can lose getUserMedia permission and a
// full-page redirect still works.
//
// KNOWN LIMIT, DELIBERATELY ACCEPTED. The Stripe Identity Agreement prohibits
// verifying anyone "linked directly or indirectly" with China or the Russian
// Federation. That is a policy restriction, not a coverage gap: both countries
// appear in Stripe's supported-document list. The agreement sits on the same
// Stripe account that processes every payment, so manualOnly() below refuses
// those claims with a 403 before any session is created, and /verify explains
// the manual route rather than showing an error. Confirmed with Juan,
// 7 September 2026. ABN Assist has no equivalent because its claimants are
// Australian.
//
// Env: STRIPE_SECRET_KEY (Identity write), STRIPE_PUBLISHABLE_KEY (browser).

'use strict';

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const email = require('./_lib/email');
const identity = require('./_lib/identity');
const verified = require('./_lib/identity-verified');
const { guard } = require('./_lib/guard');

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

  /* Off means off, and it answers rather than 404s so /verify can render its
     "nothing to do here" state instead of looking broken. */
  if (!identity.ENABLED) return res.status(200).json({ enabled: false, verified: false });

  /* Rate limited: this creates a Stripe object, so it should not be free to
     hammer. form:false because this is not a form post, there is no honeypot
     and no elapsed_ms, and demanding them would break a link opened from an
     email. Everything in the guard fails open, so a broken guard cannot stop a
     paying client verifying. */
  if (await guard(req, res, { bucket: 'identity-create', limit: 10, windowMs: 60000 })) return;

  try {
    const { claimId } = req.body || {};
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(400).json({ error: 'invalid claim id' });
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(404).json({ error: 'claim not found' });

    // These codes are what /verify reads to decide what to show, so keep them
    // stable if you touch them.
    if (claim.payment_status !== 'paid') return res.status(402).json({ error: 'payment required' });

    /* Already done, so creating a second session would work and be pointless,
       and would ask someone to photograph their passport again for nothing.
       Stripe is asked as well as our row, because a missed webhook must not
       send a verified client round the loop again, and the repair is recorded
       here rather than only on the status read. */
    if (claim.verification_status === 'verified') return res.status(409).json({ error: 'already verified' });
    if (claim.stripe_customer_id && await identity.isVerified(claim.stripe_customer_id)) {
      const r = await verified.markVerified({
        claimId: claim.id, customerId: claim.stripe_customer_id,
      });
      if (r.claimed) {
        console.warn(`identity: repaired ${claim.id} from the verification page; ` +
          'the webhook for it never arrived');
      }
      return res.status(409).json({ error: 'already verified' });
    }

    /* A claimant Stripe will not verify must never be sent into a flow that
       refuses them. That is the same failure the August 2026 incident produced,
       paid and then stuck, so it is caught here rather than at Stripe's error
       page. 403 is distinct from every other code /verify handles. */
    if (manualOnly(claim.passport_country)) {
      await db.insertAudit(claim.id, 'identity_manual_required', String(claim.passport_country || ''))
        .catch(() => {});
      await email.opsNeedsReview(claim, 'manual identity verification required: passport issued by '
        + (claim.passport_country || 'an unstated country') + ', which Stripe Identity cannot verify')
        .catch(() => {});
      return res.status(403).json({ error: 'manual verification required' });
    }

    const s = await identity.createSession({
      customerId: claim.stripe_customer_id || null,
      claimId: claim.id,
      email: claim.email || '',
      returnUrl: `${config.SITE_URL}/confirmation?cid=${encodeURIComponent(claim.id)}`,
    });

    /* Record the session id so a verification can be reconciled by hand later.
       verification_status goes to pending, which is what /verify and the cron
       nudge read. */
    await db.updateClaim(claim.id, {
      identity_session_id: s.id,
      verification_status: 'pending',
    });
    await db.insertAudit(claim.id, 'identity_session_created', s.id);

    /* The hosted URL is single-use and expires after 48 hours, and Stripe's
       guidance is explicit: do not store it, log it or embed it anywhere. So it
       is handed straight to the one browser that asked for it and nowhere else.
       The session id above is the durable reference. */
    return res.status(200).json({
      enabled: true,
      verified: false,
      clientSecret: s.clientSecret || '',
      url: s.url || '',
      pk: identity.publishableKey(),
    });
  } catch (e) {
    if (e.permissions) {
      console.error('identity: the restricted key is missing Identity write. ' +
        'Stripe, Developers, API keys: set Identity Verification Results to Write.');
    } else {
      console.error('identity failed:', e.message);
    }
    return res.status(502).json({ error: 'verification is unavailable right now' });
  }
};
