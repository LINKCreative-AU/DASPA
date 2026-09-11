# daspa.com.au

DASP (Departing Australia Superannuation Payment) lodgement service under the ARO group, same entity as abnassist.com.au: **Australian Registration Office Pty Ltd, ABN 58 645 964 156,
Registered Tax Agent 26076969**. Flat fee $150, all funds included.

Static HTML + Vercel serverless functions (zero npm dependencies), Supabase for claims,
Stripe Checkout for payment, Stripe Identity for identity verification. Brand tokens were extracted
from the live abnassist.com.au stylesheet (navy `#1e2250`, blue `#2a53a2`, yellow CTA
gradient `#ffff5f → #fae541`, Fira Sans) so the two sites read as siblings.

## Deploy

1. **Supabase**, run `supabase/schema.sql` in the SQL editor. RLS: the anon key can
   **insert** claims and nothing else; the audit log is service-role only.

   **Check which project you are in first.** The account has two with similar
   names and DASPA is not the obvious one:

   | Project | Ref | What is in it |
   |---|---|---|
   | **Online Services Combined** | `ufsnmrqenedpyqyviwne` | **DASPA.** `claims`, the audit log, rate limits. Hardcoded in `claim.html`, and what `SUPABASE_URL` points at |
   | Online Services Platform | `makuifpcxwrwdhwaettc` | Not DASPA. The portal and marketing-reporting tables (`portal_*`, `mr_*`) |

   Running a DASPA migration against Platform fails with a bare
   `42P01 relation "public.claims" does not exist` and changes nothing.
   Migrations from 11 September 2026 open with a guard that says so in words
   instead; older ones do not.

   On the **existing** database, the Stripe Identity move is two files and the order
   matters, because the live `claim.html` inserts `didit_consent_at` and PostgREST
   400s an insert naming a column that is not there:

   1. `supabase/2026-09-07-stripe-identity.sql` **before** deploying. Additive only:
      adds `identity_consent_at` / `identity_session_id` and copies the old values
      across, leaving the `didit_*` pair in place so the currently deployed form
      keeps working.
   2. Deploy, then submit one real claim through the live form and confirm the row
      has `identity_consent_at` set.
   3. `supabase/2026-09-07-stripe-identity-step2-drop-didit.sql` to drop the old
      pair. Not before step 2, or the live form starts failing silently for clients.

   Also apply `supabase/2026-09-07-rate-limits.sql` whenever convenient. It is an
   upgrade rather than a prerequisite: without it `api/_lib/guard.js` logs one
   warning and rate limits per warm instance only.
2. **Placeholders in pages** (search for `PLACEHOLDER`):
   - `claim.html` → `SUPABASE_URL`, `SUPABASE_ANON_KEY`

   The WhatsApp number is no longer one of these. It resolves server-side in
   `api/wa.js` from the `WHATSAPP_NUMBER` env var, and every call to action on the
   site is a plain link to `/wa`. If the var is unset the redirect falls back to
   `/faq` and logs a warning, so a missing number can never ship as a dead link
   again. `scripts/check.py` fails if a placeholder reappears in shipped code.
3. **Vercel env vars** (never in pages):

   | Var | Purpose |
   |---|---|
   | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | server-side DB access |
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | checkout, identity verification, and the one webhook that serves both (endpoint: `/api/stripe-webhook`, three events, see step 4) |
   | `STRIPE_PUBLISHABLE_KEY` | the embedded verification modal on `/verify`. Unset is not a fault: `/verify` falls back to Stripe's hosted page, which is also the fallback whenever the modal cannot run |
   | `RESEND_API_KEY` / `EMAIL_FROM` | transactional email (skipped gracefully if unset) |
   | `WHATSAPP_NUMBER` | digits with country code. Resolves `/wa`, used by every WhatsApp CTA and the status emails. Unset → `/wa` redirects to `/faq` |
   | `OPS_EMAIL` | where new claims, payments, verifications and paper forms are announced. One address or a comma-separated list. Unset → alerts go to the function log only |
   | `SITE_URL` | defaults to `https://daspa.com.au` |
   | `CRON_SECRET` | protects `/api/cron-nudge` (Vercel sends it automatically) |
   | `INVOICE_SECRET` | tax invoices. The Stripe webhook asks `registrationoffice.com.au/api/invoice` for an ATO-compliant invoice when a claim is paid. **Unset = paid clients get no tax invoice and nothing complains.** (Note: abnassist-site generates its own invoice now and keeps this OFF; DASPA still uses the portal, so here it must be ON) |
   | `HEALTH_KEY` | unlocks `/api/health` on the production domain. Unset → production 404s the endpoint, which is the intended default; preview and development answer without it |
   | `LODGEMENT_LIVE` | **keep unset/false until the ATO accepts the DASP intermediary agreement in writing**, holds all confirmations and emails at "in review" wording; set `true` to go live. See "The launch gate" below |

   Not wired into the site yet, set ahead of the ActiveCampaign work so the
   credentials can be verified before the integration depends on them.

   **Which environment each variable belongs to.** Vercel lets one entry cover
   several environments, which is right for some of these and actively dangerous
   for others. Learned the hard way on 8 September 2026.

   | Variable | Scope | Why |
   |---|---|---|
   | `SITE_URL` | **separate entry per environment** | see the warning below |
   | `STRIPE_SECRET_KEY` | **separate entry per environment** | live key on Production, `rk_test_` on Preview, or branch testing takes real money |
   | `STRIPE_PUBLISHABLE_KEY` | separate per environment | `pk_live_` / `pk_test_` |
   | `STRIPE_WEBHOOK_SECRET` | separate per environment | test and live destinations have different signing secrets |
   | `OPS_EMAIL` | separate per environment | Preview to one person, Production to the team, so test claims do not raise real alerts |
   | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | one entry, both | DASPA has one Supabase project across both environments (`ufsnmrqenedpyqyviwne`, and see the table above: the account has another that is not DASPA). **Preview therefore reads and writes the production `claims` table**, so a test claim is a real row: note its id and delete it |
   | `RESEND_API_KEY`, `EMAIL_FROM`, `WHATSAPP_NUMBER` | one entry, both | Resend has no test mode, so **email sent from Preview is real email**. Use your own address as the claimant when testing |
   | `CRON_SECRET`, `HEALTH_KEY` | Production only | the cron only runs on Production; `/api/health` only needs a key there |
   | `INVOICE_SECRET` | Production only | otherwise a test order asks the registrationoffice portal for a real tax invoice |
   | `LODGEMENT_LIVE` | unset everywhere | until the ATO agreement is confirmed |

   **`SITE_URL` MUST NOT BE SHARED BETWEEN PRODUCTION AND PREVIEW.** It is the
   site's own address, and the server stitches it onto the front of every link it
   hands Stripe: the checkout success and cancel URLs, the Identity return URL,
   and the WhatsApp link in emails. Production and a preview deployment are at two
   different addresses, so one value cannot be right for both:

   - shared, holding `https://daspa.com.au` → a branch test payment redirects to
     **production**, which is running different code, and the test silently proves
     nothing;
   - shared, holding the preview URL → **production sends real paying customers to
     an SSO-protected deployment**, so they hit a Vercel login screen straight
     after paying. This is the bad one.

   Two entries, scoped so they do not overlap. Production `https://daspa.com.au`,
   Preview the branch alias (`daspa-site-git-<branch>-online-services.vercel.app`,
   no trailing slash, since the code appends paths directly). Unset is safe on
   Production: `api/_lib/config.js` falls back to `https://daspa.com.au`. Unset on
   Preview is the first trap above.

   `/api/health` reports `site_url_in_use`, which is the quickest way to tell
   whether a deployment picked the right one up.

   **Vercel resolves env vars when a deployment is created.** Setting a variable
   changes nothing until the next deployment, and redeploying *production* does not
   redeploy a branch. To pick up new Preview values, redeploy the branch's own
   deployment (Deployments → the row for that branch → ⋯ → Redeploy) or push a
   commit to it.
   `abnassist-site` accepts either spelling per credential and `/api/health`
   watches both, because Vercel carries the long ones:

   | Var | Purpose |
   |---|---|
   | `AC_API_URL` / `ACTIVECAMPAIGN_API_URL` | `https://<account>.api-us1.com` |
   | `AC_API_KEY` / `ACTIVECAMPAIGN_API_KEY` | ActiveCampaign API token |
   | `AC_FIELD_MAP` | JSON, `{"<field key>": <AC custom field id>}`. Absent → custom fields skipped |
   | `AC_LIST_MAP` | JSON, which AC list a paid claim joins. Automations in this account trigger on **list membership**, not tags |

## Taking payments on and off

`PAYMENTS_LIVE` is the checkout kill switch, and **absent means closed**. Only
the exact string `true` (whitespace trimmed) opens it.

That default is deliberate and it is the opposite of convenient. Closed by
mistake loses a sale you can see and fix in a minute. Open by mistake takes
money for work that cannot be delivered, which is what happened here between
27 August and 8 September 2026: four clients paid $150 each into a flow with
no webhook destination behind it, so nothing recorded the payment, verification
refused them as unpaid, no email went out, and no alert fired anywhere. The
price of the safe default is that a deployment created without the variable
shuts the shop silently, so `/api/health` reports `checkout` in plain words and
it is the first thing to check if orders stop.

It closes in two places, and they do different jobs:

| Where | What it stops |
|---|---|
| `api/create-checkout.js` | The payment. Refuses with 503 before the claim lookup and before Stripe, so no session can exist. This is the half that holds. |
| `claim.html`, via `/api/site-status` | The wasted effort. Hides the submit button on load, so nobody types passport, TFN and bank details before finding out. Fails **open** if the fetch errors, so a blip on the status endpoint cannot close a shop that is open. |

What it does not stop is the claim row: `claim.html` inserts directly into
Supabase under the anon key, which never passes through this API, so a tab left
open from before the flip can still write a claim. That is the accepted failure.
The row is indistinguishable from any abandoned checkout, and no money moves.

`LODGEMENT_LIVE` is a separate switch and answers a different question: not
whether we take orders, but what clients already in the flow are told. While it
is false, emails and `/verify` say the claim is prepared and held at "in review"
pending the ATO channel. It governs the four recovered claims regardless of
whether checkout is open, so settle it before sending anyone a verification link.

## Scheduled jobs

`vercel.json` carries one cron: **`/api/claims-sweep` daily at 16:00 UTC**
(2am Brisbane, a quiet hour). It is the seven-day retention sweep on unpaid
claims, described in `supabase/2026-09-11-unpaid-retention.sql`.

The account is on **Pro**, so the job fires within the specified minute. On
Hobby, Vercel spreads invocations across the whole hour and allows only one
run a day, which would still be fine for a seven-day window but is worth
knowing if the plan ever changes.

**Rotating `CRON_SECRET`.** Any random string of 16 characters or more; Vercel
sends it as the `Authorization` header itself, so nothing has to construct it
and the format is ours to choose. Generate it locally with
`openssl rand -hex 32`, paste the value into the existing variable in Vercel,
then **redeploy**, because an env var change does not reach the running
functions until a new deployment. The handler trims the value, so a trailing
newline picked up from a terminal will not lock Vercel's own cron out of its
own endpoint, which is the failure this trap usually produces.

It needs `CRON_SECRET` set on Production. Unlike every other guard on this
site, this one **fails closed**: an absent secret refuses the request rather
than opening the endpoint, because it destroys data. Preview a run with
`?dry=1` and the right Authorization header before trusting it.

`/api/cron-nudge` is NOT in the crons block and therefore still inert, even
though a block now exists. A cron only fires the paths it names.

## Scheduled email

There is no cron. The `crons` block was removed from `vercel.json` on
8 September 2026, and `api/cron-nudge.js` is inert but intact: it still requires
`Authorization: Bearer <CRON_SECRET>`, so restoring the block or running
`vercel crons run /api/cron-nudge` brings it back unchanged.

**Do not try to disable it by clearing `CRON_SECRET`.** The guard is
`if (cronSecret && ...)`, so an unset secret does not lock the endpoint, it
unlocks it.

One consequence to know while it is parked: moving a claim to `lodged` in the
Supabase dashboard no longer emails the client, because the second half of that
cron is what sent it. Both messages are moving to ActiveCampaign.

## Readiness check

`/api/health` reports which variables are set in the scope serving that URL,
never their values. `?deep=1` also calls Resend, Stripe and Supabase to prove
the keys work rather than merely exist: whether the `EMAIL_FROM` domain is
verified for sending, whether the Stripe key is **live or test** and has charges
enabled, and whether the service-role key can reach the `claims` table.

`?deep=1&send=1` goes one step further and **sends one real email** to
`OPS_EMAIL`. It is the only conclusive proof that mail leaves this site, and it
is opt-in because it is the one check with an effect in the world.

The reason it has to exist: a Resend key carries a permission, and a
**Sending-access** key -- the correct, narrow scope for this site, which only
ever sends -- is refused by `/domains` and by every other read endpoint. A
*wrong* key is refused identically. So `resend 401` on a plain `?deep=1` is not
evidence of anything, in either direction. Posting a message is the only call a
sending key is allowed to make, so it is the only call that can answer the
question. Under `&send=1`, 401 **is** conclusive (fix the key) and 403 means the
`EMAIL_FROM` domain is not verified (a different dashboard screen, hence a
different message).

Acceptance is not delivery. A `202` with a message id proves the key can send
and the domain is verified; if the message then never arrives, check Resend's
Emails log for a bounce before assuming the endpoint lied.

Preview and development answer openly (they sit behind Vercel Authentication).
Production answers only with `?key=<HEALTH_KEY>` and 404s otherwise. `HEALTH_KEY`
is any long random string; it exists so the live domain never serves a
configuration listing to the public, and without one set there is no way to
verify a production deployment short of making a payment.

Vercel resolves env vars when a deployment is **created**, so set the variable,
redeploy, then read this. A variable set for Production only reads as missing on
a preview URL, which is exactly the mistake this exists to catch.

## The launch gate

`LODGEMENT_LIVE` is not gated on ARO's tax agent registration. It is gated on a
separate instrument: the **DASP online application, Agreement for intermediaries**
(ATO form NAT 15478). Holding tax agent registration 26076969 makes ARO
*eligible* to enter that agreement (clause 2.1, which requires a full or
DASP-conditional TPB registration); it is not the agreement itself.

Under clause 5.1 the agreement is made on the date the ATO accepts the
application, and the ATO notifies the applicant **in writing** whether it has
been accepted. That written acceptance is the artefact to sight before this flag
is flipped.

Two obligations from the same agreement land on the order process, not on the
site, and neither exists in the build today:

- **clause 2.3**, the client must be notified to the ATO as ARO's client before
  a DASP application is submitted for them;
- **clause 2.4**, signed client authority must be retained for a set period.
  The site records `authority_accepted_at` against a ticked declaration. Whether
  a timestamped tick satisfies "signed authority", and for how long it must be
  kept, is a question for the legal review below.

Clauses cited from NAT 15478 (07.2026). The ATO blocks automated retrieval of
its site, so these were read from the published form, not from the guidance
pages, and should be confirmed against ARO's executed copy.

4. **Stripe webhook**: add endpoint `https://daspa.com.au/api/stripe-webhook`.
   Payment and identity both run on Stripe, so they share that endpoint and the one
   signing secret. Tick exactly these **three** events, not "receive all events":

   | Event | What the handler does |
   |---|---|
   | `checkout.session.completed` | marks the claim paid, records the customer and payment intent, sends the payment confirmation, asks the portal for the tax invoice |
   | `identity.verification_session.verified` | `verification_status=verified`, `claim_status=ready_for_lodgement`, sends the verified email |
   | `identity.verification_session.requires_input` | ops alert carrying `last_error`, because Stripe does not distinguish "blurry photo, would pass on a retry" from "genuinely declined". The claim is deliberately NOT moved, so the client can retry from the same link |
   | `charge.refunded` | full refund → `payment_status=refunded`, `claim_status=on_hold`; partial → `on_hold` only, still paid. Ops alerted either way |
   | `charge.dispute.created` | `claim_status=on_hold` and a loud ops alert with the reason and evidence deadline. Nothing is marked refunded: in a dispute the money has not moved back |

   **Why refunds needed handling at all.** Nothing used to set
   `payment_status='refunded'`, so a refunded claim still read `paid`. It stayed in
   the lodgement queue, kept collecting verification nudges, and could reach
   `ready_for_lodgement`, so a registered agent could have lodged a DASP
   application for someone who had been refunded.

   Refund and dispute events carry a **charge**, not a Checkout Session, so
   `stripe_session_id` cannot match them. `claims.stripe_payment_intent_id` is what
   makes the join possible, recorded from `session.payment_intent` when the payment
   lands. `payment_intent_data[metadata][claim_id]` is also stamped at checkout, but
   only so a human answering a dispute in the Stripe dashboard can see which claim
   a payment belongs to; the matching does not depend on it, because a charge
   inheriting its PaymentIntent's metadata is not worth betting a lodgement on.

   `node tests/stripe-webhook.mjs` covers these branches against fakes, including
   the partial-refund and dispute distinctions and a forged signature. They cannot
   be reached by clicking through the site, so that test is the only coverage.

   Signature: HMAC SHA-256 over the raw body, `Stripe-Signature` v1 scheme,
   300-second tolerance, constant-time compare. No SDK.

   **Checks that run** (`options[document][...]`, names verified against Stripe's API
   reference): `allowed_types=passport` and `require_matching_selfie=true`.

   Passport only, unlike ABN Assist, which also accepts a licence or ID card: DASPA's
   claimants have left Australia, the claim form and the ATO's DASP application are
   both built around the passport, and an expired Australian licence proves nothing
   about the person now living in Lyon. `require_live_capture` is deliberately NOT
   set, matching ABN Assist; it disables image uploads entirely and the selfie match
   already covers the attack it would prevent.

   **The key needs Identity permission.** `STRIPE_SECRET_KEY` must carry
   *Identity Verification Results = Write*. A key scoped to Checkout works for every
   payment and fails only when a verification session is created, so the symptom is
   a 502 from `/api/identity-session` and nothing else. Set both **Detailed
   Verification Results** rows to **None**: `api/_lib/identity.js` never reads the
   name, date of birth, document number or address Stripe extracts, and that is what
   makes the arrangement defensible under APP 11 — Stripe holds the document and the
   biometrics, we hold the outcome. Widening it later is a privacy decision and a
   policy update, not a permission tweak.

   **The API version is pinned** in `api/_lib/stripe.js` at `2026-06-24.dahlia`,
   which is the DASPA account's own default and the version the three real Checkout
   Sessions were created at, since every call so far went out unversioned. A webhook
   destination's version is fixed when it is created and cannot be edited afterwards,
   so **create the destination on that version**. Changing it later means a new
   destination and moving `STRIPE_WEBHOOK_SECRET` with it. Do not press Workbench's
   "Upgrade" button to clear the version badge: that moves the account default, not
   this pin.

   **Adaptive Pricing is on** for Checkout on this account, and nearly every DASPA
   client is overseas so most will see a local currency. That is safe for the tax
   invoice: Stripe's Adaptive Pricing documentation states the Checkout Session and
   PaymentIntent "reflect what your customer paid in your integration currency and
   amount", with the local figures carried separately in a `presentment_details`
   hash. So `session.amount_total` stays `15000` and `session.currency` stays `aud`
   whatever the client sees, and the invoice is built in AUD with AUD GST either way.
   To see what an overseas client sees, create a Checkout Session with a
   `+location_XX` email suffix (e.g. `test+location_FR@example.com`), which is
   Stripe's documented way to force a presentment currency for testing.

   **Identity is not available to every claimant.** The Stripe Identity Agreement
   prohibits verifying anyone linked directly or indirectly with China or the
   Russian Federation. That is policy, not coverage: both countries appear in
   Stripe's supported-document list. Because the agreement sits on the same Stripe
   account that processes every payment, `/api/identity-session` enforces it:
   `manualOnly()` matches the claim's free-text `passport_country` (China, PRC, the
   two SARs, Russia, in several spellings and scripts), returns **403** without
   creating a session, and alerts ops. `/verify` reads that 403 and points the
   client at `/upload-form` for a manual check at no extra cost, so nobody pays and
   then hits a Stripe refusal. Taiwan is deliberately allowed through; **get a
   written answer from Stripe on Taiwanese passports before launch**, since Stripe
   lists Taiwan separately in its own supported-document tables.

## Checks and generators

`python scripts/check.py` before you push. It is the only thing standing in for a
build step: SERP budgets (title 60, description 158), descriptions that give the
answer away, em dashes, missing canonical / og:image / sitemap entries, JSON-LD
that does not parse, placeholders in shipped code, and `node --check` over the
functions. It also lists, in its own docstring, what it CANNOT see. The same
script runs on every push via `.github/workflows/check.yml`.

Generators, rerun when their inputs change:

| Script | What it produces |
|---|---|
| `scripts/build-og.py` | the 1200x630 social cards in `assets/og/` and the og/twitter tags |
| `scripts/build-fonts.py` | the self-hosted Plus Jakarta Sans subsets and their `@font-face` rules |
| `scripts/build-calculator-matrix.py` | the crawlable payout matrix on `/dasp-calculator` (asserts itself against the page's published worked examples) |
| `scripts/build-language-pages.py` | `/ko` and `/zh-tw`, both **noindex until a native speaker signs off the copy** |

## Claim flow

`/claim` (Supabase anon insert, client-generated UUID) → `/api/create-checkout` (Stripe,
`customer_creation:'always'`, sends "form received" email) → Stripe webhook marks paid and records
`stripe_customer_id` → `/verify` (reads `/api/claim-status` and answers each status separately
**before** offering the button; a not-paid answer is retried twice to absorb the
redirect-beats-webhook race) → `/api/identity-session` → the embedded Stripe modal, or the hosted
page if the modal cannot run → the same Stripe webhook maps `verified`→`ready_for_lodgement` →
`/confirmation` (sequence-aware via `/api/claim-status`, and it stops on a claim with no payment
against it). Abandoned verifications are picked up by the cron nudge below.

### Three writers, not one

This is the part ported from `abnassist-site` and the reason to bother. "Verified" is defined once,
in `api/_lib/identity-verified.js`, and three things can call it:

1. the **Stripe webhook**, the normal path;
2. **`/api/claim-status`**, which on every read of an unverified paid claim asks Stripe directly
   (`related_customer` + `status=verified`) and records the answer if Stripe knows something we
   do not, so any visit to `/verify` or `/confirmation` repairs a missed webhook;
3. **`/api/identity-session`**, which does the same check before creating a second session, so a
   verified client is never asked to photograph their passport twice.

The write is a conditional PATCH (`verification_status=neq.verified`) that returns the rows it
changed, so whichever of the three arrives first does the work and the other two send no email.
DASPA's previous design had exactly one writer, a webhook that had never been created in Stripe,
and three clients paid in August and September 2026 without a single record being written.

`stripe_customer_id` is load-bearing for all of that: Stripe Identity attaches a verification to a
customer, so without a Customer object there is nothing to ask about. Checkout only creates one
because `customer_creation:'always'` is set; the default (`if_required`) records a guest customer
with no Customer object, and `customer_email` does not change that. The three claims already paid
have no customer id, so the repair path skips them and they are reconciled by hand.

### Rate limiting

`api/_lib/guard.js` is ported from `abnassist-site/lib/guard.js` (only the host allowlist differs,
so keep fixes in step). `/api/identity-session` runs it at 10 requests per minute per IP. Every
layer fails open, so a broken guard can never stop a paying client verifying. The shared counter
needs `supabase/2026-09-07-rate-limits.sql`; until that is applied it logs one warning and the
in-memory layer carries it alone. Cron (`/api/cron-nudge`, 6-hourly): 24h abandoned-
verification nudges + "lodged" emails when the team sets `claim_status=lodged` in the dashboard.

## WhatsApp is switched off, and half the job is still open

`WHATSAPP_NUMBER` has never been set in Vercel, so `/wa` redirects to `/faq` and
every WhatsApp call to action on the site leads somewhere that is not WhatsApp.
Switched off 8 September 2026 rather than left promising a channel that does not
answer.

**Done.** The header button is hidden by one rule at the bottom of
`assets/site.css`, and the four transactional pages (`/claim`, `/verify`,
`/confirmation`, `/upload-form`) were changed properly to point at
`claims@daspa.com.au`, because a client stuck mid-payment needs a route that
works rather than one that is merely hidden. Client emails now say "reply to this
email", with the address derived from `EMAIL_FROM` so there is one variable to
keep right instead of two that can disagree.

**Not done, and it needs a decision rather than a patch.** WhatsApp is also a
*marketing claim* in body copy across the country and FAQ pages, including inside
FAQPage JSON-LD and the `ja`, `ko` and `zh-tw` pages. Examples:

- "Human support on WhatsApp from form to payout"
- "real people answer on WhatsApp, in your timezone, until it lands"
- "answers on WhatsApp, all for a flat $150"
- "a human answers on WhatsApp" (FAQ, and its JSON-LD copy)

Around 160 mentions over 43 pages. Those sentences are currently **untrue**, and
on a service sold by a registered tax agent an untrue support claim is an
Australian Consumer Law s18 exposure, not just stale copy. Two ways out:

1. **Configure WhatsApp Business and set `WHATSAPP_NUMBER`.** Every claim becomes
   true again, delete the CSS rule, revert the four pages. Cheapest by far if the
   channel is genuinely coming.
2. **Rewrite the claims.** They are load-bearing positioning ("human support" is
   one of the site's three selling points against the ATO's free service), so the
   replacement has to say something equally true, e.g. email support within
   business hours, Monday to Friday 9am to 5pm AEST. That is a copy decision for
   Juan, Chris and James, not a find-and-replace.

Until one of those happens the site is quieter about WhatsApp but not honest
about it. Worth resolving before any Ads spend, since the claim appears in ad
landing copy.

## Backlog (agreed, not scheduled)

- **Abandoned cart.** Partly settled on 11 September 2026. The form keeps
  writing to Supabase at submit, and the seven-day sweep in
  `api/claims-sweep.js` clears the sensitive fields off anything still unpaid.
  That leaves a seven-day window in which a follow-up is possible, against a
  row holding name, email, phone and visa but no TFN, passport number or bank
  details. Whether to actually follow those visitors up is still a decision for
  James and Chris, and it touches the privacy policy, so it stays parked rather
  than half-built. Raised by Juan.

## FOR LEGAL REVIEW (before launch)

- Authority declaration wording in `claim.html`
- `terms.html`, `privacy.html`, `tpb.html` draft copy (banner on each)
- ~~GST treatment of non-resident sales~~ confirmed by James and Chris on 11 September 2026, GST-free, $150. See `docs/gst-position.md`. The GST on the three historical claims is still an open decision
- Lodgement cannot commence until the ATO DASP Agreement is executed (`LODGEMENT_LIVE` flag)

Content pages were generated from a scratchpad script; edit the HTML directly (the pages are
plain static files, same pattern as abnassist-site).
