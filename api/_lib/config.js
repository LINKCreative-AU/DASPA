// Shared server-side config. Files under api/_lib are not deployed as functions.

// ---------------------------------------------------------------------------
// FEE, charged via Stripe Checkout, in cents. $150 flat, no GST.
//
// GST-free export under item 2 of s38-190(1): a DASP cannot be claimed until
// the client has left Australia and their visa has ceased, so the supply is
// always made to somebody outside Australia. Confirmed by James and Chris on
// 11 September 2026. Reasoning and sources in docs/gst-position.md.
//
// This is the price for NEW orders only. An invoice is built from
// claims.amount_paid_cents, which is what Stripe actually charged, so moving
// this number cannot restate a document that has already gone out. Keep
// assets/site.js in step and do not hardcode amounts anywhere else.
// ---------------------------------------------------------------------------
const FEE_CENTS = 15000;

module.exports = {
  FEE_CENTS,
  CURRENCY: 'aud',
  FEE_DESCRIPTION: 'DASP claim · flat service fee (GST-free)',
  PRODUCT_NAME: 'DASPA · Departing Australia super claim',

  SITE_URL: process.env.SITE_URL || 'https://daspa.com.au',

  // Holds all client-facing confirmations at "in review" wording until the
  // ATO DASP Agreement is executed. Set LODGEMENT_LIVE=true in Vercel env
  // to flip the site and emails to live-lodgement copy.
  LODGEMENT_LIVE: String(process.env.LODGEMENT_LIVE || '').trim() === 'true',

  // The checkout kill switch. Closed unless PAYMENTS_LIVE=true.
  //
  // ABSENT MEANS CLOSED, deliberately, and it is the opposite of a convenience
  // default. Getting this wrong in the safe direction loses a sale we can see
  // and fix; getting it wrong in the other direction takes money for work we
  // cannot deliver, which is exactly what happened here between 27 August and
  // 8 September: four clients paid $150 each into a flow that could not
  // verify them, and nothing anywhere raised a flag.
  //
  // The cost of that choice is that a deployment created without the variable
  // closes the shop silently. /api/health reports it for that reason, and it is
  // the first thing to check if orders stop arriving.
  // Trimmed. A pasted " true" would leave the shop shut with no other symptom,
  // and this project has already lost time to a trailing newline in
  // STRIPE_WEBHOOK_SECRET and another in HEALTH_KEY. Case is left alone on
  // purpose: whitespace is an accident, "True" is someone guessing, and
  // /api/health reports that as a malformed value instead of quietly obeying it.
  PAYMENTS_LIVE: String(process.env.PAYMENTS_LIVE || '').trim() === 'true',

  // Client emails link to our own /wa endpoint rather than building a wa.me URL
  // here, so there is exactly one place the number is resolved and an unset
  // number degrades to the FAQ instead of a dead link in someone's inbox.
  whatsappLink() {
    return `${this.SITE_URL}/wa`;
  },
};
