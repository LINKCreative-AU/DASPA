/* The Stripe API version this site is written against, in one place.
   Ported from abnassist-site/lib/stripe.js, same reasoning and same version.

   Stripe resolves an unversioned request against the ACCOUNT default, and
   until now every DASPA call has been unversioned. That is a quiet risk rather
   than a loud one: api/stripe-webhook.js reads session.amount_total to build
   the tax invoice, and any version older than 2020-08-27 has no amount_total
   at all. The webhook would still return 200, the claim would still be marked
   paid, and the client would be emailed an invoice with no amount on it.

   2026-05-27.dahlia is the version abnassist-site already runs in live
   production on the ARO account, so it is the one choice with evidence behind
   it rather than inference. Not "latest": there is no reason for DASPA to be
   the first traffic on a version either.

   THIS MUST MATCH the API version pinned on the webhook destination in Stripe.
   A destination's version is fixed when it is created and cannot be edited
   afterwards, so changing this means creating a new destination and moving
   STRIPE_WEBHOOK_SECRET with it. DASPA has no destination yet, which is why
   pinning now is free and pinning later would not be.
*/

'use strict';

const API_VERSION = '2026-05-27.dahlia';

// Every call to api.stripe.com goes through this, so the version can never be
// pinned in two places and drift.
function stripeHeaders(extra) {
  return {
    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    'Stripe-Version': API_VERSION,
    ...extra,
  };
}

module.exports = { API_VERSION, stripeHeaders };
