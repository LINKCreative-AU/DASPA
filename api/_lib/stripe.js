/* The Stripe API version this site is written against, in one place.
   Ported from abnassist-site/lib/stripe.js, same reasoning and same version.

   Stripe resolves an unversioned request against the ACCOUNT default, and
   until now every DASPA call has been unversioned. That is a quiet risk rather
   than a loud one: api/stripe-webhook.js reads session.amount_total to build
   the tax invoice, and any version older than 2020-08-27 has no amount_total
   at all. The webhook would still return 200, the claim would still be marked
   paid, and the client would be emailed an invoice with no amount on it.

   WHY 2026-05-27.dahlia, AND WHAT THAT REASONING DOES NOT COVER. DASPA has its
   own Stripe account, separate from the one abnassist-site runs on (confirmed
   with Juan, 8 September 2026), so "the version this account already uses" is
   NOT the argument here. What does transfer is version behaviour rather than
   account state: abnassist-site runs this exact version in live production and
   creates Identity sessions with `related_customer` and Checkout Sessions it
   reads `amount_total` and `customer_details` off, which is direct evidence
   that every field this codebase depends on exists at this version. That is
   worth more than "latest", where DASPA would be the first traffic.

   What is NOT settled by that: the DASPA account's own default version, which
   nothing here reads once this pin is in place, and which should be left alone.
   Do not press Workbench's "Upgrade" button to resolve a version warning; it
   moves the account default and affects every other integration on the
   account.

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
