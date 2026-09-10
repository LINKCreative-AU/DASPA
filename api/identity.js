// The durable verification endpoint, keyed on the Stripe customer id.
//
//   GET  /api/identity?c=cus_...&o=DASP00020151   what state is this in
//   POST /api/identity {c, o}                     start a verification
//
// WHY THE CUSTOMER ID AND NOT THE CLAIM ID
//
// A claim id works and /verify?cid=... uses one. A customer id is what the
// other Online Services products use, and the point of the migration onto
// Vercel is one pipeline rather than four bespoke ones. It also survives being
// emailed and revisited weeks later, which a Checkout Session id does not.
//
// THE PAIRING CHECK IS THE WHOLE POINT
//
// Putting a customer id in a URL is what makes the link durable, and the cost
// is an id somebody can substitute. So both values are shape-checked, then
// proven to belong TOGETHER on a real, PAID claim before anything happens. The
// earlier CGT Clearance implementation skipped this, which let anyone open a
// verification against any customer on the account. Do not copy that.
//
// SAME 404 FOR THREE DIFFERENT FAILURES
//
// No such order, wrong customer for this order, and not paid all answer 404
// with the same body. The caller learns the link is unusable and nothing about
// which part was wrong, so the endpoint cannot be used to discover whether an
// order number exists or whether it has been paid.
//
// Env: STRIPE_SECRET_KEY (Identity write), STRIPE_PUBLISHABLE_KEY (browser).

'use strict';

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const email = require('./_lib/email');
const identity = require('./_lib/identity');
const verified = require('./_lib/identity-verified');
const { guard } = require('./_lib/guard');
const { manualOnly } = require('./_lib/manual-only');

/* Shape first, database second. A malformed value is rejected before it can
   reach a query, and the patterns are narrow: Stripe customer ids are
   cus_ plus base62, and a DASPA order number is DASP plus exactly 8 digits. */
const CUSTOMER_RE = /^cus_[A-Za-z0-9]{6,40}$/;
const ORDER_RE = /^DASP[0-9]{8}$/;

// One body for all three, so they are indistinguishable from outside.
const UNUSABLE = { error: 'not found' };

async function findClaim(c, o) {
  if (!CUSTOMER_RE.test(c || '') || !ORDER_RE.test(o || '')) return null;

  /* Filtered in the query rather than in JavaScript, so a mismatch never loads
     a row belonging to somebody else in the first place. payment_status is part
     of the filter for the same reason the 404s are identical: an unpaid order
     must not be distinguishable from one that does not exist. */
  const rows = await db.selectClaims(
    `stripe_customer_id=eq.${encodeURIComponent(c)}`
    + `&order_number=eq.${encodeURIComponent(o)}`
    + '&payment_status=eq.paid&select=*&limit=1'
  );
  return (Array.isArray(rows) && rows[0]) || null;
}

module.exports = async (req, res) => {
  const isPost = req.method === 'POST';
  if (!isPost && req.method !== 'GET') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  /* Different limits because they cost different things. The GET is a database
     read plus a Stripe call; the POST creates a Stripe object. Neither is free
     to hammer. No honeypot or elapsed-time check: this is a link opened from an
     email, not a form post. */
  if (await guard(req, res, isPost
    ? { bucket: 'identity-create', limit: 10, windowMs: 60000 }
    : { bucket: 'identity-read', limit: 30, windowMs: 60000 })) return;

  const src = isPost ? (req.body || {}) : (req.query || {});
  const c = String(src.c || '').trim();
  const o = String(src.o || '').trim().toUpperCase();

  /* Feature off answers 200 rather than 404, so the page can render a "nothing
     to do here" state instead of looking broken. */
  if (!identity.ENABLED) {
    return res.status(200).json({ enabled: false });
  }

  try {
    const claim = await findClaim(c, o);
    if (!claim) return res.status(404).json(UNUSABLE);

    // ---------------------------------------------------------------- GET
    if (!isPost) {
      /* Our row is a fast path, not the authority. If Stripe says verified and
         we do not, the webhook never landed, and left alone that is the worst
         failure in the flow: the client is told they are done, the team is
         never cleared, and the claim sits with nobody looking for it. So the
         page visit does the work the webhook missed. */
      let status = claim.verification_status;
      if (status !== 'verified' && await identity.isVerified(claim.stripe_customer_id)) {
        const r = await verified.markVerified({
          claimId: claim.id, customerId: claim.stripe_customer_id,
        });
        if (r.claimed) {
          console.warn(`identity: repaired ${claim.order_number} from a page visit; `
            + 'the webhook for it never arrived');
        }
        status = 'verified';
      }
      return res.status(200).json({
        enabled: true,
        verification_status: status,
        first_name: String(claim.full_name || '').trim().split(/\s+/)[0] || '',
        order_number: claim.order_number,
        email: claim.email || '',
        manual_only: manualOnly(claim.passport_country),
        lodgement_live: config.LODGEMENT_LIVE,
      });
    }

    // --------------------------------------------------------------- POST
    if (claim.verification_status === 'verified') {
      return res.status(409).json({ error: 'already verified' });
    }
    if (await identity.isVerified(claim.stripe_customer_id)) {
      await verified.markVerified({ claimId: claim.id, customerId: claim.stripe_customer_id });
      return res.status(409).json({ error: 'already verified' });
    }

    /* A claimant Stripe will not verify must never be sent into a flow that
       refuses them. Caught here rather than at Stripe's error page. */
    if (manualOnly(claim.passport_country)) {
      await db.insertAudit(claim.id, 'identity_manual_required', String(claim.passport_country || ''))
        .catch(() => {});
      await email.opsNeedsReview(claim, 'manual identity verification required: passport issued by '
        + (claim.passport_country || 'an unstated country') + ', which Stripe Identity cannot verify')
        .catch(() => {});
      return res.status(403).json({ error: 'manual verification required' });
    }

    const s = await identity.createSession({
      customerId: claim.stripe_customer_id,
      claimId: claim.id,
      email: claim.email || '',
      returnUrl: `${config.SITE_URL}/verify-id`
        + `?c=${encodeURIComponent(claim.stripe_customer_id)}`
        + `&o=${encodeURIComponent(claim.order_number)}`,
    });

    await db.updateClaim(claim.id, {
      identity_session_id: s.id,
      verification_status: 'pending',
    });
    await db.insertAudit(claim.id, 'identity_session_created', s.id);

    /* The hosted URL is single-use and expires after 48 hours, and Stripe is
       explicit that it must not be stored, logged or embedded. It goes to the
       one browser that asked and nowhere else; the session id above is the
       durable reference. */
    return res.status(200).json({
      enabled: true,
      verified: false,
      clientSecret: s.clientSecret || '',
      url: s.url || '',
      pk: identity.publishableKey(),
    });
  } catch (e) {
    if (e.permissions) {
      console.error('identity: the restricted key is missing Identity write. '
        + 'Stripe, Developers, API keys: set Identity Verification Results to Write.');
    } else {
      console.error('identity failed:', e.message);
    }
    return res.status(502).json({ error: 'verification is unavailable right now' });
  }
};
