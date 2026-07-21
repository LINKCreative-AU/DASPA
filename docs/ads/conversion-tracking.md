# DASPA — conversion tracking plan (Google Ads)

Two conversion actions, so the account can optimise on real value, not clicks.

| Conversion action | Fires when | Counts as | Why |
|---|---|---|---|
| **Claim submitted** | The claim form's thanks panel shows (form stored in Supabase, pre-payment) | Primary — bidding | The moment we've captured a real applicant |
| **Payment completed** | Visitor lands on `/verify?cid=…` (Stripe success redirect) | Secondary — value $163.90 | True revenue signal; used to sanity-check CPA |

## Setup (Rod/Juan — 10 minutes in the Ads UI)

1. Google Ads → Goals → Conversions → **New conversion action → Website**.
2. Create the two actions above ("Claim submitted": category *Submit lead form*,
   count *One*; "Payment completed": category *Purchase*, value 163.90 AUD, count *One*).
3. Choose "set up with code" — note the **AW-XXXXXXXXX** tag ID and the two
   **conversion labels**.
4. Hand the three values to Claude Code — the snippets below get wired into
   `claim.html` and `verify.html` on a branch, previewed, then released.
   (Don't paste them by hand; the claim flow has a specific JS structure.)

## The snippets Claude will wire (for reference)

Global site tag (head of every page — one line change in the shared chassis):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','AW-XXXXXXXXX');</script>
```

Claim submitted — inside the existing success handler in `claim.html`
(where the thanks panel is shown):

```js
gtag('event','conversion',{send_to:'AW-XXXXXXXXX/CLAIM_LABEL'});
```

Payment completed — on `verify.html` load when `cid` param present:

```js
gtag('event','conversion',{send_to:'AW-XXXXXXXXX/PAY_LABEL',value:163.90,currency:'AUD',
  transaction_id:new URLSearchParams(location.search).get('cid')||''});
```

`transaction_id` = the claim UUID, so Ads deduplicates if the page reloads.

## Rules

- Conversion tags fire only on genuine success states — never on page views of
  the form itself.
- The site has no other analytics today; if GA4 is wanted later, the same tag
  loads it (`gtag('config','G-…')`) — decide then, don't block the trial on it.
- Test with Google Tag Assistant on the preview URL **before** the campaign
  goes live: submit a TEST-flagged claim and confirm both actions register.
