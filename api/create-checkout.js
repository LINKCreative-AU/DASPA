// POST { claimId } → creates a Stripe Checkout session for the flat fee and
// returns { url }. Also sends the "form received" email on the first call for
// a claim (this endpoint runs immediately after the form insert, and it's the
// first moment a server sees the record).
// Env: STRIPE_SECRET_KEY.

const config = require('./_lib/config');
const db = require('./_lib/supabase');
const email = require('./_lib/email');
const { stripeHeaders } = require('./_lib/stripe');
const { clientIp } = require('./_lib/guard');

/* Where Vercel's edge thinks this request came from, as a two-letter ISO 3166-1
   code. https://vercel.com/docs/headers/request-headers

   It no longer decides anything. It was the corroboration for the client's own
   "am I in Australia" answer while that answer set the GST treatment; from
   11 September 2026 every sale is GST-free, the form question is gone, and
   this is kept purely as a recorded fact about the order.

   Evidence, never an override, and it was never reliable enough to be one: a
   VPN, a carrier routing through another country, or an Australian SIM roaming
   overseas all produce a wrong answer. Nothing here changes what anyone is
   charged. */
function edgeCountry(req) {
  const h = (req && req.headers) || {};
  const raw = h['x-vercel-ip-country'] || h['X-Vercel-IP-Country'] || '';
  const c = String(raw).trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  /* Checkout closed. Checked first, before the claim lookup and before Stripe,
     because the point is that no session can be created at all.

     This is the half of the kill switch that actually holds. claim.html hides
     the submit button when it loads, which covers everybody who opens the page,
     but a tab left open from before the flip, a back-button return or a
     prerender still has a live button. Those requests land here.

     What it does NOT stop is the claim row. claim.html inserts straight into
     Supabase under the anon key, which never passes through this API, so a
     stale tab can still write a claim. That is the acceptable failure: a row
     with no payment against it, which is the same state as any abandoned
     checkout. No money changes hands, and money is the thing that cannot be
     undone without a refund and an apology. */
  if (!config.PAYMENTS_LIVE) {
    return res.status(503).json({
      error: 'Payments are temporarily closed while we finish setting up. Nothing has been charged.',
      reason: 'payments_closed',
    });
  }

  try {
    const { claimId } = req.body || {};
    if (!claimId || !/^[0-9a-f-]{36}$/i.test(claimId)) {
      return res.status(400).json({ error: 'invalid claim id' });
    }

    const claim = await db.getClaim(claimId);
    if (!claim) return res.status(404).json({ error: 'claim not found' });
    if (claim.payment_status === 'paid') return res.status(409).json({ error: 'already paid' });

    const firstAttempt = !claim.stripe_session_id;

    // Stripe REST API, form-encoded, no SDK dependency needed.
    const params = new URLSearchParams({
      mode: 'payment',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': config.CURRENCY,
      'line_items[0][price_data][unit_amount]': String(config.FEE_CENTS),
      'line_items[0][price_data][product_data][name]': config.PRODUCT_NAME,
      'line_items[0][price_data][product_data][description]': config.FEE_DESCRIPTION,
      customer_email: claim.email,
      /* WITHOUT THIS THERE IS NO CUSTOMER TO VERIFY AGAINST.
         customer_creation defaults to 'if_required', and a one-off payment
         requires nothing, so Checkout records a "guest customer" with no
         Customer object behind it. customer_email does not change that: per the
         API reference it only prefills the email field.

         It matters because Stripe Identity attaches a verification to a
         customer via related_customer, and that is what lets _lib/identity.js
         ask Stripe "is this person verified?" weeks later instead of trusting a
         webhook that may never have arrived. No Customer object, no repair, and
         DASPA has already shipped one flow whose only writer was a webhook that
         did not exist. Same reasoning and same flag as
         abnassist-site/api/order-checkout.js.
         https://docs.stripe.com/payments/checkout/guest-customers */
      customer_creation: 'always',
      client_reference_id: claim.id,
      'metadata[claim_id]': claim.id,
      /* The same id again, on the PaymentIntent. Session metadata does not
         reach the PaymentIntent or the Charge on its own, and refund and
         dispute events carry a charge rather than a session. The webhook
         matches those on stripe_payment_intent_id rather than on metadata, so
         this is not load-bearing: it is here so a human opening the payment in
         the Stripe dashboard, most likely while answering a dispute, can see
         which claim it belongs to without going via our database. */
      'payment_intent_data[metadata][claim_id]': claim.id,
      success_url: `${config.SITE_URL}/verify?cid=${claim.id}`,
      cancel_url: `${config.SITE_URL}/claim?cancelled=1`,
    });

    const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: stripeHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      body: params.toString(),
    });
    const session = await r.json();
    if (!r.ok) {
      console.error('stripe session create failed:', session.error && session.error.message);
      return res.status(502).json({ error: 'payment provider unavailable' });
    }

    /* Written here rather than at form insert because these two are the only
       facts on the claim that must NOT come from the browser, and this is the
       first server-side touch. anon is revoked from both columns. */
    await db.updateClaim(claim.id, {
      stripe_session_id: session.id,
      edge_country: edgeCountry(req),
      client_ip: clientIp(req),
    });

    if (firstAttempt) {
      await email.formReceived(claim);
      await db.insertAudit(claim.id, 'email_form_received', claim.email);
      // tell our side too, so a claim never sits in the table unseen
      await email.opsNewClaim(claim);
    }

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
