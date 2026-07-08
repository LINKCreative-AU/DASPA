// POST { claimId } → creates a Stripe Checkout session for the flat fee and
// returns { url }. Also sends the "form received" email on the first call for
// a claim (this endpoint runs immediately after the form insert, and it's the
// first moment a server sees the record).
// Env: STRIPE_SECRET_KEY.

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const email = require('./_lib/email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { claimId } = req.body || {};
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(400).json({ error: 'invalid claim id' });
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(404).json({ error: 'claim not found' });
    if (claim.payment_status === 'paid') return res.status(409).json({ error: 'already paid' });

    const firstAttempt = !claim.stripe_session_id;

    // Stripe REST API, form-encoded — no SDK dependency needed.
    const params = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': config.CURRENCY,
      'line_items[0][price_data][unit_amount]': String(config.FEE_CENTS),
      'line_items[0][price_data][product_data][name]': config.PRODUCT_NAME,
      'line_items[0][price_data][product_data][description]': config.FEE_DESCRIPTION,
      customer_email: claim.email,
      client_reference_id: claim.id,
      'metadata[claim_id]': claim.id,
      success_url: `${config.SITE_URL}/verify?cid=${claim.id}`,
      cancel_url: `${config.SITE_URL}/claim?cancelled=1`,
    });

    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const session = await r.json();
    if (!r.ok) {
      console.error('stripe session create failed:', session.error && session.error.message);
      return res.status(502).json({ error: 'payment provider unavailable' });
    }

    await db.updateClaim(claim.id, { stripe_session_id: session.id });

    if (firstAttempt) {
      await email.formReceived(claim);
      await db.insertAudit(claim.id, 'email_form_received', claim.email);
    }

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
