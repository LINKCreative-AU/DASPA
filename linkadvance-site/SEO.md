# wealth.link.com.au - SEO documentation

For the team. Three parts: the audit of the old site (what was OK, what
wasn't), the competitive analysis, and what's implemented + what to do next.
Keyword and SERP data from Ahrefs, 8 Aug 2026. Baseline that day: the site
ranked for only 4 keywords ("link financial services" #3, the children's
bonds post #6-8, "link advice" #11), so almost everything below is new
ground - and the cluster difficulty is remarkably low (KD 0-10 for most
money terms). The domain rides link.com.au's DR 59 via the kit's subdomain
strategy, against SERPs held by DR 0-36 firms.

## Part 0 - Audit of the old site

**What was OK (kept):**
- The SMSF page: the best page on the site - real conversion copy, 14
  substantive FAQs, honest eligibility criteria ($200k super, established
  business). Carried verbatim.
- The workshop pages: clear offers with a real price ($660) and a Value
  Guarantee - exactly the "publish the number" standard. Carried verbatim.
- The calculator page's title tag ("Home Equity Calculator Australia |
  Estimate Property Equity (AUD)") - the one well-optimised head on the
  site. Kept.
- Insights posts: real topical content (debt recycling, negative gearing,
  children's bonds - the bonds post was the only thing ranking). Migrated
  1:1 with exact old meta.
- The crafted homepage copy and "Profit to wealth transition" section.

**What was broken (fixed):**
1. One title tag doing the work of five: `/`, `/retirement-planning`,
   `/family-wealth-management`, `/high-net-worth-wealth-advisors`, all date
   archives and both author pages served the SAME homepage title and
   description, and three of those URLs were near-byte homepage clones.
   → each page now owns one intent with dedicated content.
2. Indexable WP cruft: date archives (9 URLs), author pages (2), category
   archives, pagination, an `/uncategorized/` duplicate of the calculator.
   → all 301'd (redirects.mjs).
3. Schema = Yoast defaults only: no business entity, no rating, no FAQPage,
   no Service/Offer, despite 14 FAQs sitting on the SMSF page.
   → FinancialService + AggregateRating (5.0/36, kit place ID) sitewide;
   FAQPage/Service/Offer/Article/WebApplication/Breadcrumb per page.
4. robots.txt crawl-delay 10 throttled Googlebot. → gone.
5. The equity calculator rendered from Elementor JS with almost no crawlable
   copy on a KD-0, 1,077/mo term. → server-rendered with answer-first copy.
6. The property page's "Essentials" accordion linked four anchors that did
   not exist on the page (dead links). → real sections now.
7. The review widget mixed LINK Advisors' accounting reviews (a different
   Google listing) into the Wealth pages. → Wealth-only testimonials.
8. Duplicate H1s on the workshop pages; heading levels jumped around.
   → one H1 per page.
9. Old meta description said 35 reviews; the kit brand register says 36.

## Part 1 - Competitive analysis (SERPs pulled 8 Aug 2026)

**"financial advisor brisbane" (1,400/mo, KD 0).** Map pack, then a
People-Also-Ask block made ENTIRELY of cost questions ("How much does a
financial advisor cost in Brisbane?", "Is it worth paying?", "What is a
normal fee?", "Is $500,000 enough?"), then weak organic: a DR 36 directory,
firms at DR 0-24 with a few hundred visits each. Nobody at advice quality
answers the cost questions with numbers.
→ **Implemented:** `/how-much-does-a-financial-advisor-cost` - published fee
ranges including our own $0/\$660 pricing, answering all four PAA questions
with FAQPage schema (the Advisors `/how-much-does-an-accountant-cost` play).
Homepage owns the head term; GBP review volume (36 @ 5.0) is the map-pack
lever - see Part 2.

**"smsf commercial property" (175/mo KD 0; cluster with "smsf property
investment" 627/mo KD 2; "smsf commercial property loan" 450/mo).** An AI
Overview cites ~10 sources; organic is Liston Newton (DR 28, ONE referring
domain), Moneysmart (DR 85), Reddit threads, then DR 16-55 lender pages. PAA:
"Can SMSF invest in commercial property?", "What is the 5% SMSF rule?",
"deposit needed?", "best property type?".
→ Our /smsf page already answers deposit/type/eligibility verbatim in 14
FAQs now carried in schema; the page publishes the real numbers (15%/10%/0%
tax, 25-35% deposit, $200k threshold) the AI Overview wants to cite. Gap to
close next: a "5% in-house asset rule" explainer (belongs in the
buying-commercial-property insights post, NOT the protected page).

**"debt recycling" (4,627/mo KD 0 + australia 1,145 + calculator 518).**
NAB (DR 81) #2, Reddit #3, AMP #5 - but rispin.au ranks #6 with DR 3 and
ZERO referring domains, proving content quality alone competes. Nobody in
the top 10 ships a calculator. PAA: "Does it actually work?", "Is it
legal?", "example?", "same as negative gearing?".
→ **Implemented:** the post upgraded to a pillar at its exact URL:
answer-first definition box, original copy verbatim, an interactive debt
recycling calculator (unique in the SERP), all four PAA questions answered
honestly (including "you don't need an adviser to do this"), Article + FAQ
schema, cross-links to the equity calculator and workshop.

**Structural edge no competitor has:** DR 59 domain via the subdomain
strategy, a group of five division sites cross-linking with consistent NAP
and parentOrganization schema, and interactive tools ("Tools as SEO
weapons" - kit standard) on a SERP-proven-thin field.

## Part 2 - Keyword → page map (AU vol/mo · KD)

| Cluster | Head terms | Page that owns it |
|---|---|---|
| Advisor head terms | financial advisor brisbane 1,400·KD0 · financial planner brisbane 745·KD61 · wealth advisor 312·KD0 | **/** |
| Advice cost (PAA cluster) | how much does a financial advisor cost + variants | **/how-much-does-a-financial-advisor-cost** (NEW) |
| Equity calculator | equity calculator 5,918·KD38 · home equity calculator 1,077·KD0 (TP ~11k) | **/home-equity-estimator-calculator** |
| Debt recycling | debt recycling 4,627·KD0 · australia 1,145·KD0 · calculator 518·KD0 | **/insights/wealth-creation-using-debt-recycling** (pillar + calculator) |
| Negative gearing | negative gearing 7,090·KD27 | **/insights/is-negative-gearing-actually-dead-not-even-close** |
| Retirement | retirement planning australia 500·KD15 (TP 17k) · retirement financial advisor 657·KD24 · brisbane 164 | **/retirement-planning** |
| SMSF property | smsf property investment 627·KD2 · smsf commercial property 175·KD0 | **/smsf** (verbatim, protected) |
| Home equity strategy | using equity to buy investment property 322·KD28 · how to use home equity 100·KD36 | **/home-equity-long-term-wealth-strategy** |
| Property advice | property investment advice 336·KD8 · advisor australia 150 | **/property-investment-advice** |
| Family wealth | family wealth management 200·KD9 | **/family-wealth-management** |
| HNW / wealth mgmt | wealth management brisbane 357·KD10 · high net worth financial advisor 98·KD0 | **/high-net-worth-wealth-advisors** |
| Business owners | financial planning for business owners 150·KD0 | **/business-owner-wealth-extraction-workshop-link-wealth** (verbatim, protected) |
| Investment bonds | investment bonds australia 869·KD2 · for children 150 | **/insights/how-to-use-childrens-bonds-in-australia** (already ranks - exact old meta kept) |

**Territory split vs LINK Advisors** (kit rule, the way Books was split):
Wealth owns financial advisor/planner, wealth management, retirement
planning, SMSF *strategy and property* terms, investment, debt recycling and
personal insurance advice. Advisors owns accountant/tax terms and SMSF
*administration/accounting* terms (smsf accountant, smsf setup, smsf audit).
Neither site builds pages on the other's side of that line.

## Part 3 - Technical implementation

- One page per head term; homepage funnels and never competes.
- Every content URL kept 1:1; WP cruft 301s; old post metas verbatim in
  content/posts.json.
- Schema: FinancialService + AggregateRating (5.0/36, Place ID
  ChIJNQYvAVudk2sRwFeU_s7KnRY from the kit brand register) sitewide; FAQPage
  wherever visible Q&As exist (visible text and schema kept in sync - never
  let them drift); Service+Offer ($660) on workshops; Article on posts;
  WebApplication on calculators; BreadcrumbList + visible breadcrumbs.
- robots.ts with NO crawl-delay; sitemap.ts = 14 core pages + 11 posts only.
- AI-discoverability standard (linkhq/AI-DISCOVERABILITY.md): real numbers
  published ($660, 25-35% deposits, 15/10/0% SMSF tax rates, advice fee
  ranges), honest limits stated (calculator model assumptions, "recycling
  loses if returns trail your loan rate"), free path named (Moneysmart, ATO,
  "your bank can set up a split loan").
- Compliance: AFSL footer verbatim sitewide; Privacy + FSG PDFs mirrored at
  their old URLs.
- Brand per the kit register: accent #1f9e84, mint #95e5cb on dark, dark
  #26494d. Leads default to the Wealth #leads channel address.

## Part 3.5 - Second competitor pass (8 Aug, PM) and what it built

The retirement field is the biggest soft territory on the map, far larger
than the first pass sized it: "retirement calculator (australia)" 6,400/mo
combined at KD 7-11 (18k TP), "how much super should i have (+at 40)"
11,400/mo combined at KD 3-12, "how much (super) do i need to retire"
2,280/mo at KD 7-9, "preservation age" 3,179/mo at KD 0, "asfa retirement
standard" 2,386 at KD 22, "transition to retirement" 2,264 at KD 6. And the
map-pack leader (mywealthsolutions.com.au) earns its whole ~800-visit organic
footprint from its brand name, one financial-plan guide, a fees page and
adviser profile pages - validating the cost page and the team page.

Built from the pass (all live in this repo):
- **/how-much-do-i-need-to-retire** - answer-first guide (ASFA budgets +
  rule of 25, hedged and sourced), super-balance-by-age table, preservation
  age, and the **retirement readiness check** (projected balance vs target,
  gap, and the extra-per-year to close it). Article + WebApplication +
  FAQPage schema. Feeds /retirement-planning and the workshop.
- **SMSF guide delivery wired**: the /smsf form now emails the SMSF Property
  Purchase Guide (self-hosted at /downloads/) and shows a direct download -
  the page's promise finally has a pipe. Guide-variant form also closes the
  buying-commercial-property post.
- **/insights/buying-commercial-property** upgraded in place: original post
  verbatim + the rules section (business real property, 5% in-house asset
  rule, NALI/NALE, LRBA limits) answering the SMSF SERP's PAA gaps.
- **/team** (Richard Leal Person schema, AR 327265, FSG link) and
  **/reviews** (all 20 verbatim Google reviews + the review-ask CTA).
- **Chip qualifying form** (reason + timeframe) across all variants.
- **Cross-division handoffs**: business-owner workshop and HNW page link the
  group's /selling-your-business exits practice; the equity calculator hands
  lending to LINK Advance.
- Fidelity fixes: the "Innovative solutions. Unmatched service. Delivered as
  promised." tagline restored, all 20 reviews carried, adviser card on the
  discovery landers, per-post OG images, "Reviewed by Richard Leal" bylines.

## Part 4 - What to do next (team actions)

**Launch week**
1. GSC: verify wealth.link.com.au (DNS method), submit /sitemap.xml, request
   indexing on /, /smsf, /home-equity-estimator-calculator,
   /insights/wealth-creation-using-debt-recycling,
   /how-much-does-a-financial-advisor-cost.
2. Bing Webmaster Tools: import from GSC (feeds ChatGPT and AI search).
3. Google Business Profile: point website at the homepage, keep NAP
   identical to the footer. The map pack owns position 1 for "financial
   advisor brisbane" - review velocity on the Wealth listing (36 today) is
   the highest-leverage local action. Ask every workshop attendee.

**This quarter**
1. "5% SMSF rule" + NALI/NALE explainer content into
   /insights/buying-commercial-property (PAA gaps on the SMSF SERP).
2. "How much do I need to retire" article feeding /retirement-planning
   (retirement calculator parent topic, 17k traffic potential) - candidate
   for a retirement drawdown calculator, same pattern as debt recycling.
3. One case study per quarter (Scott's is the conversion pattern).
4. Point the legacy YouTube embeds' descriptions at the new pillar URLs.

**Watch**
- Debt recycling pillar rankings (expect movement inside 6-8 weeks given
  KD 0 and DR 59; re-pull Ahrefs then, per the kit's /selling-your-business
  precedent).
- "equity calculator" (KD 38 head; the KD 0 "home equity calculator"
  variant should move first).
- Review count drift: SITE.reviews hardcodes 5.0/36 - swap to the Places
  engine when the group API key lands.
