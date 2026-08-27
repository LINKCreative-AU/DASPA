# daspa.com.au

DASP (Departing Australia Superannuation Payment) lodgement service under the ARO group, same entity as abnassist.com.au: **Australian Registration Office Pty Ltd, ABN 58 645 964 156,
Registered Tax Agent 26076969**. Flat fee $149 + GST, all funds included.

Static HTML + Vercel serverless functions (zero npm dependencies), Supabase for claims,
Stripe Checkout for payment, Didit for identity verification. Brand tokens were extracted
from the live abnassist.com.au stylesheet (navy `#1e2250`, blue `#2a53a2`, yellow CTA
gradient `#ffff5f → #fae541`, Fira Sans) so the two sites read as siblings.

## Deploy

1. **Supabase**, run `supabase/schema.sql` in the SQL editor. RLS: the anon key can
   **insert** claims and nothing else; the audit log is service-role only.
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
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | checkout + webhook (endpoint: `/api/stripe-webhook`, event `checkout.session.completed`) |
   | `DIDIT_API_KEY` / `DIDIT_WORKFLOW_ID` / `DIDIT_WEBHOOK_SECRET` | Didit v3 sessions + webhook (endpoint: `/api/didit-webhook`) |
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
   `abnassist-site` accepts either spelling per credential and `/api/health`
   watches both, because Vercel carries the long ones:

   | Var | Purpose |
   |---|---|
   | `AC_API_URL` / `ACTIVECAMPAIGN_API_URL` | `https://<account>.api-us1.com` |
   | `AC_API_KEY` / `ACTIVECAMPAIGN_API_KEY` | ActiveCampaign API token |
   | `AC_FIELD_MAP` | JSON, `{"<field key>": <AC custom field id>}`. Absent → custom fields skipped |
   | `AC_LIST_MAP` | JSON, which AC list a paid claim joins. Automations in this account trigger on **list membership**, not tags |

## Readiness check

`/api/health` reports which variables are set in the scope serving that URL,
never their values. `?deep=1` also calls Resend, Stripe and Supabase to prove
the keys work rather than merely exist: whether the `EMAIL_FROM` domain is
verified for sending, whether the Stripe key is **live or test** and has charges
enabled, and whether the service-role key can reach the `claims` table.

Preview and development answer openly (they sit behind Vercel Authentication).
Production answers only with `?key=<HEALTH_KEY>` and 404s otherwise.

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
   **Didit webhook**: `https://daspa.com.au/api/didit-webhook` (X-Signature-V2 HMAC verified,
   5-minute timestamp window; decision payload uses plural arrays: `id_verifications`,
   `liveness_checks`, `face_matches`).

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

`/claim` (Supabase anon insert, client-generated UUID) → `/api/create-checkout` (Stripe, sends
"form received" email) → Stripe webhook marks paid → `/verify` → `/api/didit-session` (full-page
redirect; mobile camera reliability) → Didit webhook maps Approved→`ready_for_lodgement`,
Declined/In&nbsp;Review→`needs_review`, Abandoned→`verification_pending`+nudge → `/confirmation`
(sequence-aware via `/api/claim-status`). Cron (`/api/cron-nudge`, 6-hourly): 24h abandoned-
verification nudges + "lodged" emails when the team sets `claim_status=lodged` in the dashboard.

## FOR LEGAL REVIEW (before launch)

- Authority declaration wording in `claim.html`
- `terms.html`, `privacy.html`, `tpb.html` draft copy (banner on each)
- GST treatment of non-resident sales, see comment in `api/_lib/config.js`
- Lodgement cannot commence until the ATO DASP Agreement is executed (`LODGEMENT_LIVE` flag)

Content pages were generated from a scratchpad script; edit the HTML directly (the pages are
plain static files, same pattern as abnassist-site).
