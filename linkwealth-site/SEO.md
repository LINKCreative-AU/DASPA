# wealth.link.com.au - SEO documentation

For the team. Two parts: what's implemented (and why), and what to do next.
Keyword targets come from Ahrefs research of 8 Aug 2026. Baseline that day:
the site ranked for only 4 keywords ("link financial services" #3, the
children's bonds post #6-8, "link advice" #11) - so almost everything below
is new ground, and the cluster difficulty is remarkably low (KD 0-10 for most
money terms).

## Part 1 - What's implemented

### The problem the rebuild fixes

The old WordPress site had one title tag doing the work of five: `/`,
`/retirement-planning`, `/family-wealth-management`,
`/high-net-worth-wealth-advisors`, all date archives and both author pages
served the SAME homepage title and meta description ("LINK Wealth Advisors |
Leading Financial Planners in Brisbane"), and three of those pages were
near-byte duplicates of the homepage body. Add Yoast-default schema (no
business entity, no rating, no FAQPage), a robots.txt crawl-delay of 10, and
an Elementor calculator invisible to crawlers - the site could not rank and
didn't.

### Keyword → page map (AU vol/mo · KD)

| Cluster | Head terms | Page that owns it |
|---|---|---|
| Advisor head terms | financial advisor brisbane 1,400·KD0 · financial planner brisbane 745·KD61 · wealth advisor 312·KD0 · financial advice brisbane 490 | **/** - title "Financial Advisor Brisbane \| LINK Wealth Advisors"; FAQs carry the variants |
| Equity calculator | equity calculator 5,918·KD38 · home equity calculator 1,077·KD0 (TP ~11k) | **/home-equity-estimator-calculator** - old title kept, tool rebuilt server-renderable, answer-first formula copy, 4 FAQs, WebApplication schema |
| Debt recycling | debt recycling 4,627·KD0 · debt recycling australia 1,145·KD0 · debt recycling calculator 518·KD0 | **/insights/wealth-creation-using-debt-recycling** (migrated 1:1; see Part 2 - upgrade to pillar + calculator) |
| Negative gearing | negative gearing 7,090·KD27 | **/insights/is-negative-gearing-actually-dead-not-even-close** |
| Retirement | retirement planning australia 500·KD15 (TP 17k) · retirement financial advisor 657·KD24 · retirement planning brisbane 164 · superannuation advice brisbane 173 | **/retirement-planning** - dedicated content (was homepage clone) |
| SMSF property | smsf property investment 627·KD2 · smsf commercial property 175·KD0 · using super to buy commercial property | **/smsf** - 14 live FAQs now in FAQPage schema |
| Home equity strategy | using equity to buy investment property 322·KD28 · how to use home equity 100·KD36 | **/home-equity-long-term-wealth-strategy** + insights post |
| Property advice | property investment advice 336·KD8 · property investment advisor australia 150 | **/property-investment-advice** - the four dead-anchor "Essentials" topics now have real content |
| Family wealth | family wealth management 200·KD9 | **/family-wealth-management** - dedicated content (was homepage clone) |
| HNW / wealth mgmt | wealth management brisbane 357·KD10 · high net worth financial advisor 98·KD0 | **/high-net-worth-wealth-advisors** - dedicated content (was homepage clone) |
| Business owners | financial planning for business owners 150·KD0 | **/business-owner-wealth-extraction-workshop-link-wealth** (PROTECTED copy) |
| Investment bonds | investment bonds australia 869·KD2 · investment bonds for children 150 | **/insights/how-to-use-childrens-bonds-in-australia** (already ranks #6-8 - exact old meta kept) |

### Technical implementation

- **One page per head term** - the homepage never competes with its own
  service pages (the old site's core failure).
- **Every content URL kept 1:1**; WordPress cruft (date/author/category
  archives, `/insights/page/2`, `/uncategorized/...`, feeds) 301s via
  `redirects.mjs`. Old post title tags/meta carried verbatim into
  `content/posts.json` (`metaTitle`/`metaDescription`).
- **Schema (JSON-LD)**: FinancialService + AggregateRating (5.0/35) sitewide;
  Service on service pages; Service+Offer ($660) on workshop pages; FAQPage
  wherever visible Q&As exist (visible text and schema kept in sync - never
  let them drift); Article on posts; WebApplication on the calculator;
  BreadcrumbList + visible breadcrumbs on inner pages.
- **robots.ts with NO crawl-delay** (old site throttled Google 10s/request);
  sitemap.ts lists the 13 core pages + 11 posts and nothing else.
- **Answer-first copy** on the calculator and FAQ blocks - written for
  featured snippets and AI overviews as much as for blue links. `llms.txt`
  ships the whole business summary.
- **Compliance**: AFSL footer verbatim sitewide; Privacy and FSG PDFs
  mirrored at their old `/wp-content/uploads/...` URLs.
- **Internal linking**: calculator → workshop → SMSF → case study →
  contact; every service page cross-links its cluster (posts link services,
  services link posts).
- Images mirrored 1:1 under `public/wp-content` so existing image URLs (and
  any external links to them) survive cutover.

### Protected copy

The Business Owner Wealth Extraction Workshop page and the homepage crafted
sections (incl. "Profit to wealth transition") are VERBATIM by James's
instruction - the SEO work there is structural only (single H1, schema, kept
meta). Two live-site defects were fixed without rewording: the duplicate H1
pair on the workshop page, and a sentence on the retirement workshop page that
was truncated mid-word on the live site ("...and most forward with
confidence" → "move forward"; "...confidence that" → "confidence.").

## Part 2 - What to do next (team actions)

**Immediate (launch week)**
1. **GSC**: verify wealth.link.com.au (no token existed on the old site -
   use the DNS method via the domain), submit `/sitemap.xml`, request
   indexing on `/`, `/smsf`, `/home-equity-estimator-calculator`,
   `/retirement-planning`.
2. **Bing Webmaster Tools**: import from GSC - Bing feeds ChatGPT and other
   AI search.
3. Point the Google Business Profile website link at the homepage and keep
   NAP identical to the footer.

**High-leverage content (this quarter)**
1. **Debt recycling pillar**: ~6,300/mo cluster at KD 0 sitting on a 5k-char
   blog post. Upgrade `/insights/wealth-creation-using-debt-recycling` to a
   full guide and add a debt recycling calculator (the "debt recycling
   calculator" term alone is 518/mo·KD0; the equity calculator component is
   the template).
2. **"How much do I need to retire" article** feeding
   /retirement-planning - retirement calculator parent topic has 17k traffic
   potential.
3. Case studies: publish one per quarter - "Scott bought his premises with
   super" is the conversion pattern to repeat.

**Watch**
- The equity calculator's rankings for "equity calculator" (KD 38 head term;
  the KD 0 "home equity calculator" variant should move first).
- Review count drift: footer/schema hardcode 5.0/35 - update `SITE.reviews`
  when the live count moves, or wire the Places API like the other LINK
  sites plan to.
