/* The Stripe API version this site is written against, in one place.
   Ported from abnassist-site/lib/stripe.js, same reasoning and same version.

   Stripe resolves an unversioned request against the ACCOUNT default, and
   until now every DASPA call has been unversioned. That is a quiet risk rather
   than a loud one: api/stripe-webhook.js reads session.amount_total to build
   the tax invoice, and any version older than 2020-08-27 has no amount_total
   at all. The webhook would still return 200, the claim would still be marked
   paid, and the client would be emailed an invoice with no amount on it.

   WHY 2026-06-24.dahlia. Read from Workbench on the DASPA account,
   8 September 2026:

     2026-08-26.dahlia   Latest    no traffic
     2026-06-24.dahlia   Default   traffic
     2025-06-30.basil              traffic

   This pin was briefly 2026-05-27.dahlia, carried over from abnassist-site.
   That was wrong twice over: DASPA is a separate Stripe account, so
   abnassist-site's account evidence never applied here, and 2026-05-27.dahlia
   does not appear on this account at all.

   2026-06-24.dahlia is the choice with the strongest evidence available. Every
   Stripe call this codebase has ever made went out with no version header, so
   it resolved against the account default, which is this version. The three
   real Checkout Sessions in August and September were created at it, and
   api/stripe-webhook.js reads `amount_total` and `customer_details` off exactly
   that shape. So this is not inference: it is the version this code is already
   proven against on this account.

   Not "Latest": 2026-08-26.dahlia has no traffic anywhere, and there is no
   reason for DASPA to be the first thing on it. `related_customer` on Identity
   sessions is safe here, since abnassist-site uses it at 2026-05-27.dahlia and
   API versions only add fields going forward.

   Do NOT press Workbench's "Upgrade" button to clear the "Upgrade available"
   badge. It moves the ACCOUNT default, not this pin, and affects everything
   else on the account. Once this pin is deployed the account default stops
   reaching us at all, so the badge is cosmetic.

   THIS MUST MATCH the API version pinned on the webhook destination in Stripe.
   A destination's version is fixed when it is created and cannot be edited
   afterwards, so changing this means creating a new destination and moving
   STRIPE_WEBHOOK_SECRET with it. DASPA has no destination yet, which is why
   pinning now is free and pinning later would not be.
*/

'use strict';

const API_VERSION = '2026-06-24.dahlia';

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
