// Shared server-side config. Files under api/_lib are not deployed as functions.

// ---------------------------------------------------------------------------
// FEE, charged via Stripe Checkout, in cents.
// $149 + GST = $163.90 advertised across the site (keep assets/site.js in sync).
//
// GST NOTE / FOR ACCOUNTING REVIEW: sales to non-residents who are outside
// Australia when the service is performed may qualify as GST-free exports
// (GST Act s38-190). If/when that treatment is confirmed, switch the charged
// amount to FEE_EX_GST_CENTS for those clients (or point Stripe at a tax-aware
// price). The invoice line description is built here so it can flex with the
// treatment. Do not hardcode amounts elsewhere.
// ---------------------------------------------------------------------------
const FEE_INC_GST_CENTS = 16390;
const FEE_EX_GST_CENTS = 14900;

module.exports = {
  FEE_CENTS: FEE_INC_GST_CENTS,
  FEE_EX_GST_CENTS,
  CURRENCY: 'aud',
  FEE_DESCRIPTION: 'DASP claim · flat service fee (incl. GST)',
  PRODUCT_NAME: 'DASPA · Departing Australia super claim',

  SITE_URL: process.env.SITE_URL || 'https://daspa.com.au',

  // Holds all client-facing confirmations at "in review" wording until the
  // ATO DASP Agreement is executed. Set LODGEMENT_LIVE=true in Vercel env
  // to flip the site and emails to live-lodgement copy.
  LODGEMENT_LIVE: process.env.LODGEMENT_LIVE === 'true',

  // Client emails link to our own /wa endpoint rather than building a wa.me URL
  // here, so there is exactly one place the number is resolved and an unset
  // number degrades to the FAQ instead of a dead link in someone's inbox.
  whatsappLink() {
    return `${this.SITE_URL}/wa`;
  },
};
