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

    // Always 200 for verified events we don't act on, so Stripe stops retrying.
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' }); // Stripe retries on 5xx
  }
};
