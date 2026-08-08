# wealth.link.com.au

LINK Wealth - the LINK group's financial advisory division. Full rebuild of the
old WordPress/Elementor site (WPStaq), following the linkadvisors/linkliving
build pattern: Next.js 15 + Tailwind, static pages, LINK V1.5 brand system
with the Wealth mint (`#95e5cb`) accent and the live site's deep teal
(`#204347`) for text-weight moments.

**Compliance:** every page must show the AFSL footer (see `SITE.legal` in
`lib/site.ts`, rendered by `components/Footer.tsx`). Richard Leal (AR 327265)
and Link Wealth Pty Ltd (CAR 1312767) are authorised representatives of
Millennium 3 Financial Services Pty Ltd (ABN 61 094 529 987), AFSL 244252.
Do not trim or reword that text without the licensee's sign-off.

**Protected copy:** the Business Owner Wealth Extraction Workshop page and the
homepage sections (hero, intro, OUR SERVICES, "Why work with us", WHAT'S
INCLUDED - especially "Profit to wealth transition") are carried VERBATIM from
the old site by James's instruction (2026-08-08). Optimise around them; never
reword them.

## Stack

- Next.js (app router) + Tailwind. `npm run dev` / `npm run build`.
- No CMS: posts live in `content/posts.json` (pipeline: `scripts/fetch-wp.mjs`
  pulls the live WP REST API + scrapes each page's exact Yoast title/meta).
- Images: `scripts/fetch-images.mjs` mirrored every `wp-content/uploads` asset
  into `public/wp-content/...` so image and PDF URLs survive cutover 1:1
  (includes the Privacy Policy and FSG PDFs the footer links).
- Leads: `/api/contact` → Resend (`lib/email.ts`) → #leads Slack channel.
  Env: `RESEND_API_KEY`, optional `LEADS_TO` (set this to the Wealth-specific
  channel address so sources stay distinguishable - the default is the shared
  leads channel), optional `SLACK_LEADS_WEBHOOK`.
- Redirects: `redirects.mjs` 301s the WordPress cruft (date/author/category
  archives, pagination, `/uncategorized/...`). All real content URLs are kept
  1:1 - see SEO.md.

## URL map (all old URLs preserved)

| URL | Role |
|---|---|
| `/` | Homepage - financial advisor brisbane |
| `/retirement-planning` | Retirement planning (was a homepage clone) |
| `/property-investment-advice` | Property investment advice |
| `/family-wealth-management` | Family wealth (was a homepage clone) |
| `/high-net-worth-wealth-advisors` | HNW advisory (was a homepage clone) |
| `/smsf` | SMSF commercial property |
| `/home-equity-estimator-calculator` | Interactive equity calculator |
| `/business-owner-wealth-extraction-workshop-link-wealth` | PROTECTED workshop page |
| `/retirement-funding-workshop-link-wealth` | Retirement workshop |
| `/home-equity-long-term-wealth-strategy` | Equity strategy workshop |
| `/case-studies` + `/case-studies/{slug}` | 2 case studies |
| `/insights` + `/insights/{slug}` | 9 posts, exact old title tags |
| `/contact` | NEW - stable destination for every CTA |
| `/thank-you` | Form destination, noindex |

## Before launch (humans)

- [ ] Set `RESEND_API_KEY` + `LEADS_TO` in Vercel and send a test lead.
- [ ] Confirm live Google review count (hardcoded 5.0/35 from the old footer,
      2026-08-08) - `SITE.reviews` in `lib/site.ts`.
- [ ] Compliance sign-off on the rebuilt pages (copy is carried from the old
      site, but the licensee should see the new FAQ answers).
- [ ] Google Search Console: verify the property (no verification token found
      on the old site), submit `/sitemap.xml`.
- [ ] Domain cutover from WPStaq WordPress happens LAST.

Two machines push - `git pull --rebase origin main` before committing. Never
`next build` while the dev server runs.
