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
   | `LEADS_INGEST_KEY` | the `daspa` half of LINK Leads' `LEADS_INGEST_KEYS`. Unset -> the lead-desk push is skipped with a log line and nothing else changes |
   | `LEADS_INGEST_URL` | optional, defaults to `https://leads.link.com.au/api/ingest`. **That host was NXDOMAIN as at 25 August 2026** and the LINK Leads Vercel project has deployment protection on, so nothing is reachable yet. The push fails closed with a log line until one of those is fixed. See the portal repo's `docs/lead-flow.md` |
   | `LODGEMENT_LIVE` | **keep unset/false until the ATO DASP Agreement is executed**, holds all confirmations and emails at "in review" wording; set `true` to go live |

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

## Where a claim is visible, and to whom

Three places, and they answer different questions. None of them replaces another.
The whole map, across all four systems, is in the Online Services portal repo at
`docs/lead-flow.md`.

| Where | What it is | How it gets there |
|---|---|---|
| Supabase `claims` | the application itself, identity documents included | the browser inserts it (RLS: insert only) |
| **Online Services portal**, registrationoffice.com.au | where the team *works* the claim: pipeline, assignment, notes, revenue | the portal reads this project's `claims` table directly with a service-role key (`DASPA_SUPABASE_URL` / `DASPA_SUPABASE_KEY` set over there). Nothing is pushed; nothing here writes to it |
| **LINK Leads**, leads.link.com.au | where the group sees what marketing is producing, across every LINK site at once | pushed by `api/_lib/leads.js` at submission and again at payment |

The lead desk gets the enquiry and the shape of the claim. It does **not** get
the tax file number, the passport number, the bank account, the date of birth or
the street address. Those exist so a claim can be lodged, and lodgement happens
in the portal by the people cleared to see them. The reasoning is in the header
of `api/_lib/leads.js`, and it is the same call `lib/activecampaign.js` makes on
the ABN Assist site.

Both pushes carry `external_id: claim.id`, so the payment updates the lead the
submission created rather than adding a second one, and a replayed Stripe
webhook changes nothing. Attribution (page, referrer, utm, tracker session) is
read by `claim.html` at the moment of submit and forwarded through
`/api/create-checkout`: the query string and the referrer are both gone by the
time any later request runs, so it cannot be recovered afterwards.

## Claim flow

`/claim` (Supabase anon insert, client-generated UUID) → `/api/create-checkout` (Stripe, sends
"form received" email, pushes the lead to LINK Leads) → Stripe webhook marks paid (and updates
the lead) → `/verify` → `/api/didit-session` (full-page
redirect; mobile camera reliability) → Didit webhook maps Approved→`ready_for_lodgement`,
Declined/In&nbsp;Review→`needs_review`, Abandoned→`verification_pending`+nudge → `/confirmation`
(sequence-aware via `/api/claim-status`). Cron (`/api/cron-nudge`, 6-hourly): 24h abandoned-
verification nudges + "lodged" emails when the team sets `claim_status=lodged` in the dashboard.

## FOR LEGAL REVIEW (before launch)

- Authority declaration wording in `claim.html`
- `terms.html`, `privacy.html`, `tpb.html` draft copy (banner on each)
- GST treatment of non-resident sales, see comment in `api/_lib/config.js`
- Lodgement cannot commence until the ATO DASP Agreement is executed (`LODGEMENT_LIVE` flag).
  **James reported the licence executed on 24 August 2026.** The code needs no change for
  that: `LODGEMENT_LIVE` is a Vercel environment variable, and setting it to `true` in the
  Production scope is the whole switch. Until somebody does, every confirmation page, status
  email and lodgement line still reads "prepared and held at in review", which is now the
  wrong thing to be telling a paying client. It is one variable and a redeploy, and it is the
  only thing on this list that a deploy from here cannot do.

Content pages were generated from a scratchpad script; edit the HTML directly (the pages are
plain static files, same pattern as abnassist-site).
