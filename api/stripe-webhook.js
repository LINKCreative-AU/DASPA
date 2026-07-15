// Stripe webhook — marks the claim paid on checkout.session.completed.
// Signature is verified against the raw body (HMAC SHA-256, Stripe-Signature
// header, v1 scheme) with a constant-time compare; no Stripe SDK needed.
// Env: STRIPE_WEBHOOK_SECRET.

const crypto = require('crypto');
const db = require('./_lib/supabase');
const email = require('./_lib/email');

// Raw body is required for signature verification — disable the body parser.
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
            claim_status: 'paid',
          });
          await db.insertAudit(claimId, 'stripe_payment_completed', session.id);
          await email.paymentConfirmed(claim);
          await db.insertAudit(claimId, 'email_payment_confirmed', claim.email);
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
    // Always 200 for verified events we don't act on, so Stripe stops retrying.
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' }); // Stripe retries on 5xx
  }
};
