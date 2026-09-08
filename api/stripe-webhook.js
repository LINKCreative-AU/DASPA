// Stripe webhook. Marks the claim paid on checkout.session.completed.
// Signature is verified against the raw body (HMAC SHA-256, Stripe-Signature
// header, v1 scheme) with a constant-time compare; no Stripe SDK needed.
// Env: STRIPE_WEBHOOK_SECRET.

const crypto = require('crypto');
const db = require('./_lib/supabase');
const email = require('./_lib/email');
const verified = require('./_lib/identity-verified');

// Raw body is required for signature verification, disable the body parser.
module.exports.config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verifyStripeSignature(payload, header, secret, toleranceSec = 300) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i), kv.slice(i + 1)];
    })
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  const given = Buffer.from(parts.v1 || '', 'utf8');
  const want = Buffer.from(expected, 'utf8');
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = (await rawBody(req)).toString('utf8');
  if (!verifyStripeSignature(payload, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return res.status(400).json({ error: 'invalid payload' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const claimId = (session.metadata && session.metadata.claim_id) || session.client_reference_id;
      if (claimId) {
        const claim = await db.getClaim(claimId);
        if (claim && claim.payment_status !== 'paid') {
          await db.updateClaim(claimId, {
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_session_id: session.id,
            /* From customer_creation: 'always' in api/create-checkout.js.
               Recorded here because it is the handle Stripe Identity verifies
               against, and therefore what lets a missed identity webhook be
               repaired later from a page visit or the cron. A guest checkout
               leaves this null and the repair simply does not run. */
            stripe_customer_id: typeof session.customer === 'string'
              ? session.customer
              : (session.customer && session.customer.id) || null,
            /* The handle for refunds and disputes. Those events carry a charge,
               whose only link back to us is its payment_intent, so without
               this a refund cannot be matched to a claim at all. */
            stripe_payment_intent_id: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : (session.payment_intent && session.payment_intent.id) || null,
            claim_status: 'paid',
          });
          await db.insertAudit(claimId, 'stripe_payment_completed', session.id);
          await email.paymentConfirmed(claim);
          await db.insertAudit(claimId, 'email_payment_confirmed', claim.email);
          await email.opsPaid(claim, session.amount_total);
          // tax invoice via the portal (idempotent there; never fails the webhook)
          if (process.env.INVOICE_SECRET) {
            await fetch('https://registrationoffice.com.au/api/invoice', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                secret: process.env.INVOICE_SECRET, site: 'daspa', orderId: claimId,
                email: claim.email, name: claim.full_name,
                amountCents: session.amount_total, description: 'DASP claim lodgement service',
              }),
            }).catch((e) => console.error('invoice call failed', e.message));
            await db.insertAudit(claimId, 'tax_invoice_requested', claim.email).catch(() => {});
          }
        }
      }
    }
    /* ---------- Stripe Identity ----------
       Verification runs through Stripe Identity, so its events arrive on this
       same endpoint under this same signing secret. That is the main reason for
       the switch away from Didit: no extra credential to leave unset.

       Stripe sends exactly two events worth acting on. `processing` is not one
       of them, because a document check usually resolves before the client is
       even redirected back.

         identity.verification_session.verified        every check passed
         identity.verification_session.requires_input  at least one check failed

       Both branches are deliberately thin. `verified` hands off to
       _lib/identity-verified.js, which is the same code /api/claim-status runs
       when it finds a missed webhook, so there is one definition of what
       "verified" does rather than two that drift. Ported from
       abnassist-site/api/stripe-webhook.js.

       related_customer is read as a fallback for finding the claim, because a
       session created by hand from the Stripe dashboard carries neither
       metadata nor client_reference_id, and related_customer still resolves it. */
    if (event.type === 'identity.verification_session.verified') {
      const vs = event.data.object;
      const claimId = (vs.metadata && vs.metadata.claim_id) || vs.client_reference_id || null;
      const customerId = vs.related_customer || null;
      if (!claimId && !customerId) {
        console.warn('identity verified with no claim id and no related_customer:', vs.id);
      } else {
        const r = await verified.markVerified({
          claimId, customerId, sessionId: vs.id, at: new Date(event.created * 1000),
        });
        if (!r.claimed) {
          console.log(`identity: ${claimId || customerId} was already recorded, nothing sent`);
        }
      }
      return res.status(200).json({ received: true });
    }

    /* requires_input covers both "blurry photo, would pass on a retry" and
       "genuinely declined", and the API does not distinguish them. ABN Assist
       only logs it, because its customer can simply retry from the same link
       and its team is not waiting on anything.

       DASPA alerts a human as well, and that difference is deliberate: a DASP
       claim is money already taken for a lodgement that cannot proceed, the
       client is overseas and in a different timezone, and the 6-hourly nudge
       cron would otherwise be the only thing that ever notices. last_error is
       attached so whoever reads it can tell "ask them to retake it" from "this
       one needs a real look".

       The claim is NOT moved to needs_review. The client can retry from the
       same link, and marking it stops the retry path and would need a human to
       undo. The alert is the signal; the status stays as it was. */
    if (event.type === 'identity.verification_session.requires_input') {
      const vs = event.data.object;
      const claimId = (vs.metadata && vs.metadata.claim_id) || vs.client_reference_id || null;
      const why = (vs.last_error && (vs.last_error.code || vs.last_error.reason)) || 'unknown';
      console.warn(`identity needs input again for ${claimId || vs.id}: ${why}`);
      if (claimId) {
        const claim = await db.getClaim(claimId).catch(() => null);
        if (claim) {
          await db.insertAudit(claimId, 'identity_requires_input', why).catch(() => {});
          await email.opsNeedsReview(claim, 'identity check came back requires_input: ' + why)
            .catch((e) => console.error('identity: ops alert failed for', claimId, e.message));
        }
      }
      return res.status(200).json({ received: true });
    }

    /* ---------- refunds ----------
       Nothing here used to exist, and the gap was not cosmetic. A refunded
       claim read 'paid', so it stayed in the lodgement queue, kept collecting
       verification nudges, and could reach ready_for_lodgement. A registered
       agent could then have lodged a DASP application for somebody who had
       been refunded, which is the sort of thing the TPB takes an interest in.

       charge.refunded rather than refund.created: its object is the charge, so
       it carries both `amount` and `amount_refunded` and can therefore tell a
       full refund from a partial one, which is the distinction that decides
       what happens to the claim. Stripe fires it for partial refunds too.

       Matched on payment_intent, not metadata. A charge inheriting the
       PaymentIntent's metadata is not something worth betting a client's
       lodgement on. */
    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const pi = typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : (charge.payment_intent && charge.payment_intent.id) || null;
      const claim = await db.getClaimByPaymentIntent(pi);

      if (!claim) {
        // A charge on this account that is not one of our claims. Normal.
        console.warn('charge.refunded for a payment intent with no claim:', pi || charge.id);
        return res.status(200).json({ received: true });
      }

      const refunded = Number(charge.amount_refunded || 0);
      const total = Number(charge.amount || 0);
      const full = total > 0 && refunded >= total;

      /* Idempotent, and it also settles the partial-then-full case: a claim
         already marked refunded is not marked again, so no second email. */
      if (full && claim.payment_status !== 'refunded') {
        await db.patchClaims(
          `id=eq.${encodeURIComponent(claim.id)}&payment_status=neq.refunded`,
          {
            payment_status: 'refunded',
            refunded_at: new Date(event.created * 1000).toISOString(),
            /* on_hold, not back to 'new'. The work already done on this claim
               happened, and the team needs to see it as stopped rather than as
               never started. The cron nudge filters on payment_status=paid, so
               this also silences it without a second flag. */
            claim_status: 'on_hold',
          }
        );
        await db.insertAudit(claim.id, 'stripe_refund_full', charge.id);
      } else if (!full) {
        await db.updateClaim(claim.id, { claim_status: 'on_hold' });
        await db.insertAudit(claim.id, 'stripe_refund_partial', `${refunded} of ${total}`);
      }

      await email.opsRefunded(claim, {
        amountCents: refunded,
        full,
        reason: (charge.refunds && charge.refunds.data && charge.refunds.data[0]
          && charge.refunds.data[0].reason) || null,
      }).catch((e) => console.error('refund ops alert failed for', claim.id, e.message));

      return res.status(200).json({ received: true });
    }

    /* ---------- disputes ----------
       Not a refund: the money has not moved back yet and there is a deadline
       to respond, so nothing is marked refunded. The claim goes on hold
       because lodging for someone who is disputing the charge would be a poor
       decision, and a human is told immediately. Online Services already has
       a documented dispute-counter process; this is what starts it. */
    if (event.type === 'charge.dispute.created') {
      const dispute = event.data.object;
      const pi = typeof dispute.payment_intent === 'string'
        ? dispute.payment_intent
        : (dispute.payment_intent && dispute.payment_intent.id) || null;
      const claim = await db.getClaimByPaymentIntent(pi);

      if (!claim) {
        console.warn('charge.dispute.created for a payment intent with no claim:', pi || dispute.id);
        return res.status(200).json({ received: true });
      }

      await db.updateClaim(claim.id, { claim_status: 'on_hold' });
      await db.insertAudit(claim.id, 'stripe_dispute_created', `${dispute.id} ${dispute.reason || ''}`.trim());
      await email.opsDispute(claim, {
        amountCents: Number(dispute.amount || 0),
        reason: dispute.reason || null,
        dueBy: dispute.evidence_details && dispute.evidence_details.due_by
          ? new Date(dispute.evidence_details.due_by * 1000).toISOString().slice(0, 10)
          : null,
      }).catch((e) => console.error('dispute ops alert failed for', claim.id, e.message));

      return res.status(200).json({ received: true });
    }

    // Always 200 for verified events we don't act on, so Stripe stops retrying.
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' }); // Stripe retries on 5xx
  }
};
