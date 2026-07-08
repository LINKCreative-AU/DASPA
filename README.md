# daspa.com.au

DASP (Departing Australia Superannuation Payment) lodgement service under the ARO group —
same entity as abnassist.com.au: **Australian Registration Office Pty Ltd, ABN 58 645 964 156,
Registered Tax Agent 26076969**. Flat fee $149 + GST, all funds included.

Static HTML + Vercel serverless functions (zero npm dependencies), Supabase for claims,
Stripe Checkout for payment, Didit for identity verification. Brand tokens were extracted
from the live abnassist.com.au stylesheet (navy `#1e2250`, blue `#2a53a2`, yellow CTA
gradient `#ffff5f → #fae541`, Fira Sans) so the two sites read as siblings.

## Deploy

1. **Supabase** — run `supabase/schema.sql` in the SQL editor. RLS: the anon key can
   **insert** claims and nothing else; the audit log is service-role only.
2. **Placeholders in pages** (search for `PLACEHOLDER`):
   - `assets/site.js` → `WHATSAPP_NUMBER` (digits with country code)
   - `claim.html` → `SUPABASE_URL`, `SUPABASE_ANON_KEY`
3. **Vercel env vars** (never in pages):

   | Var | Purpose |
   |---|---|
   | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | server-side DB access |
   | `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | checkout + webhook (endpoint: `/api/stripe-webhook`, event `checkout.session.completed`) |
   | `DIDIT_API_KEY` / `DIDIT_WORKFLOW_ID` / `DIDIT_WEBHOOK_SECRET` | Didit v3 sessions + webhook (endpoint: `/api/didit-webhook`) |
   | `RESEND_API_KEY` / `EMAIL_FROM` | transactional email (skipped gracefully if unset) |
   | `WHATSAPP_NUMBER` | used in status emails |
   | `SITE_URL` | defaults to `https://daspa.com.au` |
   | `CRON_SECRET` | protects `/api/cron-nudge` (Vercel sends it automatically) |
   | `LODGEMENT_LIVE` | **keep unset/false until the ATO DASP Agreement is executed** — holds all confirmations and emails at "in review" wording; set `true` to go live |

4. **Stripe webhook**: add endpoint `https://daspa.com.au/api/stripe-webhook`.
   **Didit webhook**: `https://daspa.com.au/api/didit-webhook` (X-Signature-V2 HMAC verified,
   5-minute timestamp window; decision payload uses plural arrays: `id_verifications`,
   `liveness_checks`, `face_matches`).

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
- GST treatment of non-resident sales — see comment in `api/_lib/config.js`
- Lodgement cannot commence until the ATO DASP Agreement is executed (`LODGEMENT_LIVE` flag)

Content pages were generated from a scratchpad script; edit the HTML directly (the pages are
plain static files, same pattern as abnassist-site).
