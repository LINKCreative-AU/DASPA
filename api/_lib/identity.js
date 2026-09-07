/* Stripe Identity, in one place.
   Ported from abnassist-site/lib/identity.js, which is the working reference.

   The only module that talks to Identity, the same way _lib/stripe.js is the
   only place a Stripe auth header gets built. Everything else in the codebase
   deals in "is this claim's customer verified", never in VerificationSessions,
   which is what makes swapping provider later a small job. DASPA has already
   paid for the alternative once: Didit was wired through a page, an endpoint
   and a webhook, and unpicking it touched 47 files.

   WHAT IS VERIFIED. Sessions are created with
   options[document][allowed_types][0]=passport and
   options[document][require_matching_selfie]=true.

   Passport only, unlike ABN Assist, which accepts a licence or ID card too.
   DASPA's claimants are former temporary visa holders who have left Australia:
   the claim form collects a passport number and issuing country, the ATO's
   DASP application is built around the passport, and an expired Australian
   licence proves nothing about the person now living in Lyon. Confirmed with
   Juan, 7 September 2026.

   The selfie is not a default, it is what makes the client-facing copy true.
   The pages promise "your passport and a quick selfie", and without a matching
   selfie there is no biometric matching and the sentence is a lie. Copy and
   configuration have to move together.

   require_live_capture is deliberately NOT set, matching ABN Assist. It
   disables image uploads entirely, which locks out anyone on a computer with
   no working camera, and the selfie match already covers the attack it would
   prevent. Decided with Juan, 7 September 2026.

   WHAT WE DELIBERATELY CANNOT READ. The restricted key should carry Identity
   Verification Results = Write with both "Detailed Verification Results" rows
   at None, so this module can create a session and read its status and nothing
   else. It cannot see the name, date of birth, document number or address
   Stripe reads off the document. That is the point: the reason using Stripe
   Identity is defensible under APP 11 is that Stripe holds the document and
   the biometrics rather than us. If a future change needs the extracted
   details, that is a privacy decision and a policy update, not a permission
   tweak.

   Env: STRIPE_SECRET_KEY (Identity write), STRIPE_PUBLISHABLE_KEY (browser).
*/

'use strict';

const { stripeHeaders } = require('./stripe');

/* The switch. Everything checks this, so the whole feature is one line away
   from off, which is what makes it safe to deploy before the Stripe Identity
   application is approved. A deploy is a minute; an env var would also need a
   redeploy on Vercel to take effect, so a constant is no slower and is visible
   in the diff. */
const ENABLED = true;

const API = 'https://api.stripe.com/v1/identity/verification_sessions';

const form = (o) => new URLSearchParams(o).toString();

async function call(path, opts) {
  const r = await fetch(`${API}${path}`, {
    ...opts,
    headers: stripeHeaders(
      opts && opts.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : undefined
    ),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (j.error && j.error.message) || `stripe identity ${r.status}`;
    /* Worth naming, because it is the failure this integration is most likely
       to hit first and the message alone does not say what to do. The
       restricted key needs Identity Verification Results = Write; a key scoped
       to Checkout only fails here and nowhere else. */
    const e = new Error(msg);
    e.permissions = r.status === 403 || /permission|scope/i.test(msg);
    throw e;
  }
  return j;
}

/* Creates a session for one claim.

   Returns both halves on purpose. clientSecret drives the embedded modal, url
   is the hosted page. /verify tries the modal and falls back to the redirect,
   because DASPA's clients arrive from overseas on phones, often inside the
   Instagram or WhatsApp in-app browser where an embedded modal can lose
   getUserMedia permission. ABN Assist only needs the modal: its customers are
   Australian and mostly on desktop.

   related_customer is what makes isVerified() below possible, and therefore
   what makes a missed webhook recoverable. client_reference_id and metadata
   both carry the claim id because client_reference_id is not shown everywhere
   in the dashboard. */
async function createSession({ customerId, claimId, email, returnUrl }) {
  const s = await call('', {
    method: 'POST',
    body: form({
      type: 'document',
      'options[document][allowed_types][0]': 'passport',
      'options[document][require_matching_selfie]': 'true',
      client_reference_id: claimId,
      'metadata[claim_id]': claimId,
      ...(customerId ? { related_customer: customerId } : {}),
      ...(email ? { 'provided_details[email]': email } : {}),
      ...(returnUrl ? { return_url: returnUrl } : {}),
    }),
  });
  return { id: s.id, clientSecret: s.client_secret, url: s.url, status: s.status };
}

/* Has this customer verified?

   Asked of Stripe rather than of our own row, so the answer is right even if a
   webhook was missed, and so an emailed link still tells the truth weeks
   later. This is the single most valuable thing in the ABN Assist design and
   the thing DASPA most obviously lacked: three clients paid in August and
   September 2026 and nothing was ever marked, because the only writer was a
   webhook that did not exist.

   related_customer and status are both server-side filters, so this is one
   request that either returns a row or does not; nothing is fetched and sifted
   here. */
async function isVerified(customerId) {
  if (!customerId) return false;
  const q = form({ related_customer: customerId, status: 'verified', limit: '1' });
  const list = await call(`?${q}`, { method: 'GET' });
  return Array.isArray(list.data) && list.data.length > 0;
}

module.exports = {
  ENABLED,
  createSession,
  isVerified,
  publishableKey: () => process.env.STRIPE_PUBLISHABLE_KEY || '',
};
