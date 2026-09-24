# The Online Services SEO Kit

**For daspa.com.au · abnassist.com.au · gstregister.com.au · cgtclearance.com.au**

Version 1.0 · 24 September 2026 · every figure in this document was pulled or
tested on that date and is stamped where it matters.

This is the standard the four sites are built and audited against. It exists
because the same four mistakes were about to be made four times. It borrows its
shape from the LINK Websites Kit, and almost none of its content: those are
nine service businesses selling expertise, these are four transactional services
competing with a free government alternative, and the second job is harder.

**How to use it.** Part 1 is the rules — short, arguable, and the thing to cite
when someone wants to do something else. Parts 2–4 are the facts as at today.
Part 5 is the per-site plan. Part 6 is internal linking and how articles get
commissioned — the only ranking lever you fully control, and the one that cost
DASPA ten weeks. Part 7 is the checklist you actually work through. Part 8 is
the cutover procedure for the two sites still on WordPress. Part 9 is what to
stop doing.

---

## Part 1 — The standards

Eleven rules. Each was earned by something going wrong, here or on the LINK
estate, and each is written so you can check work against it.

### 1. The government page wins the official query. Stop fighting it.

Google's own Quality Rater Guidelines say it outright: *"the official government
page for getting a passport is the unique, official, and authoritative source"*
and *"Government tax websites are an authoritative source for tax forms."* The
ATO holds #1 on `dasp`, #1 with sitelinks on `register for gst`, and positions
1, 3, 4, 6 and 11 on `ato clearance certificate`.

You will not take those. You do not need them — they are the lowest-intent
queries in each cluster. **Win what the ATO answers badly:** edge cases,
timelines, what-happens-if, offshore logistics, rejections, and the questions
their own community forum is fielding. When ATO Community threads rank for
`how to get an abn`, that is a map of where their documentation fails.

### 2. Not the ATO. Above the fold. On every page that takes money.

This is the single highest-risk item across all four sites and it is a
compliance rule before it is an SEO one.

Google's spam policy names *"impersonating an official business or service
through imposter sites"*. The ACCC has pursued business registers impersonating
government and fined JustAnswer $10m in 2025 over misleading affiliation. The
NSW Small Business Commissioner publishes "Beware of fake ABN, TFN websites".

Domain names like `gstregister.com.au` and `abnassist.com.au` sit close to that
line by construction. The QRG's actual test is **deception**, not price: a
"complete lack of information about who is responsible" is a Lowest-quality
signal on YMYL pages, and there is *no rule against charging for something the
government does free*. So say all of it, plainly, where it cannot be missed:

> Not the ATO. Not affiliated with any government agency.
> You can do this yourself free at [ato.gov.au/...].
> Our fee: $X. Government fee: $0.

The ABR writes your own disclosure for you — *"If you consult a tax agent to
complete an application for you they may charge a fee for their services.
Otherwise, there is no cost."* Quote it and link it.

**Footer is not good enough.** Above the fold, on the page where the money is
asked for.

### 3. Every fact ships in the initial HTML.

Googlebot renders JavaScript after a delay. **AI crawlers never do** — Vercel
measured 500 million GPTBot fetches with zero JavaScript execution, and
ClaudeBot behaves the same. So the old rule that a client-rendered calculator is
invisible now holds *harder* than it did, because it is invisible to the systems
that are increasingly answering the question instead of ranking the answer.

Calculators may be JavaScript. Their inputs, their explanation, and at least one
**worked example with real numbers** must be server-rendered. DASPA already does
this with a pre-computed payout matrix built by `scripts/build-calculator-matrix.py`,
which asserts itself against the worked examples on the page so the two cannot
drift. That is the pattern; copy it.

### 4. Answer first, in the first 30% of the page.

Between 44% and 55% of passages cited in AI Overviews come from the first third
of a page (Indig/AirOps, correlational). Google's own AI-features guidance says
there is no special markup and no "AI file" — the page must simply be indexed,
snippet-eligible, and worth quoting.

So: under every H2, a **40–80 word self-contained paragraph** that states the
number, the rule or the date without needing the sentence before it. Bold the
direct answer. Attribute it to the ATO with the figure quoted and the URL.

And check you have not blocked yourself: `nosnippet`, `max-snippet` and
`data-nosnippet` all remove a page from AI Overviews and AI Mode as well as from
featured snippets.

### 5. One page per sub-question, because the fan-out is the SERP now.

Only **37.9%** of URLs cited in AI Overviews rank in the top 10 for the query
that produced them — down from 76% in July 2025 (Ahrefs, 863k SERPs, 4M URLs).
The cause is query fan-out: Google decomposes the question into sub-queries and
cites whatever wins each one.

That is good news for a small site. You do not have to beat the ATO on `dasp`.
You have to own *"how long does DASP take"*, *"why was my DASP rejected"*,
*"who can certify my documents in Germany"*, *"can I claim ATO-held super"* —
one page each, each answering completely.

### 6. Authority is the constraint, not content.

**daspa.com.au has four referring domains.** Four. It has been live since July,
has 102 commits of genuinely good work, sits on a cluster where the head term is
KD 1 — and has **zero organic keywords and zero organic traffic**.

Compare cgtclearance.com.au: 23 referring domains, 826 visits a month. Same
group, same standards, older domain.

No amount of on-page work fixes four referring domains. This is the only item on
the list that cannot be solved by editing a file, and it is the one that decides
whether any of the rest matters.

### 7. Reviews are the gap every competitor has closed and you have not.

Lawpath says 650,000 Australians. Honcho has 2,239 Google reviews. EasyCompanies
had 27,000. Alitax has 106 at 4.9.

All four of your sites have none on the page. In a niche where the competing
proposition is *"or do it free yourself"*, third-party proof that a stranger's
money came back is worth more than another paragraph. Twenty named Google
reviews separates you from the lookalike operators — and they are your real
reputational risk, not the ATO.

### 8. The credential is the moat. Put the number on the page.

Charging to lodge an ABN, GST registration, DASP claim or clearance certificate
is a tax agent service under the TASA: **TPB registration is required.** Several
competitors do not show one. `abnregistrar.com.au` has no TA number on the page.
`expresstaxback.com.au` has none and a contingency fee.

And on CGT specifically: the ATO's own form instructions say conveyancers and
agents charging a fee **cannot** complete the clearance certificate form for a
vendor unless they are also a legal practitioner or tax agent. Your natural
referrers are legally barred from selling the thing you sell. Say so on the page
and build the referral programme on it.

Use the TPB Registered Tax Practitioner symbol properly — it must show the
number and registration type — and link to the live TPB register entry.

### 9. Never build country clone pages.

The offshore traffic is real: DASP has UK volume around 250/mo, Ireland 60,
Germany and the Philippines around 90. The obvious move is `/uk`, `/ireland`,
`/germany` — and it is a trap.

Google's definition of a doorway is *"multiple pages targeted at specific
regions that funnel users to one page"*. Same-language regional duplicates get
collapsed anyway. Build **one canonical page per topic** with sections that
genuinely differ by situation — certified ID from abroad, overseas bank
transfer and currency, the tax treatment of the payment in that country,
contact hours in their timezone. Country names in H2s where natural.

A German-language translation is the only case that earns hreflang, and only if
a human reviews it.

### 10. Verify the demand before you build for it.

Ahrefs shows Korea (700/mo) and Taiwan (450/mo) as the top offshore markets for
`dasp`. They are not. The Korean SERP for that string returns a **data
architecture certification** — an entirely different acronym. Real Korean demand
uses 호주 연금 환급.

Three country pages were nearly justified on a number that measured the wrong
thing. Check the SERP, not the volume column. The same discipline caught
`xero dashboard` (400/mo, parent topic "xero login" — navigational) on the LINK
estate.

### 11. A robots rule is a prefix, and a half-fix leaves the trap.

`Disallow: /claim` blocked `/claim-super-from` — the index for the entire
offshore country cluster — while it sat in the sitemap. Someone had already hit
this, added `Allow: /claim-super-leaving-australia` for the page they knew
about, and left the sibling blocked.

Anchor exact paths with `$`. Keep the trailing slash only on directory rules
like `/api/`. And test with a longest-match checker against the live sitemap,
not by reading the file — that is how this one was found, and reading it is how
it was missed the first time.

**Related:** do not use robots.txt to de-index. A page Google may not crawl is a
page whose noindex Google never reads. All four of DASPA's transactional paths
currently carry both, which is harmless only while nothing links to them.

---

## Part 2 — What changed, and what is now dead

The research behind this section was done 24 September 2026 against primary
sources. Anything marked *correlational* is a vendor study, not a Google
statement.

### AI Overviews have taken the informational click

| Measure | Finding |
|---|---|
| Any link clicked, AIO present | **8%** vs 15% without (Pew, 68,879 queries) |
| Link inside the AIO clicked | **1%** |
| #1 organic CTR with AIO | **−34.5%**, re-measured at **−58%** Dec 2025 (Ahrefs, 300k keywords) |
| Cited vs uncited brand, same query | **+35% organic CTR** (Seer, 5.47M queries) |
| AI referrals as share of visits | **0.28%** — but convert 4.4× to 23× organic |

AI Mode became the default experience worldwide in May 2026. **Plan for
informational pages to lose 35–60% of their 2024 clicks**, treat the citation
itself as the visibility, and make the service pages catch the high-intent
remainder. The traffic that does arrive from AI is small and unusually
qualified — which is exactly your buyer.

### Dead for rich results, as of now

- **FAQPage — 7 May 2026.** Search Console support removed June, API August.
- **HowTo** — 2023.
- **`WebSite` + `SearchAction` sitelinks searchbox** — November 2024.
- Course Info, ClaimReview and five others — June 2025.

**Both gstregister and cgtclearance currently emit `SearchAction`.** It does
nothing. Keep `FAQPage` only where the Q&As are visible and real — it has no
display value now, but Bing and Copilot still use it for extraction.

### What to emit instead

`Organization` with **`taxID` set to the ABN** — Google explicitly calls tax IDs
a trust signal — plus legalName, address, telephone, email, logo, sameAs.
`Person` via `ProfilePage` on the author page. `BreadcrumbList`. `Article` or
`WebPage` with author, datePublished, dateModified. `Service` + `Offer` with the
real price.

Schema does not rank. It clarifies the entity and feeds Bing and Copilot.

### llms.txt is cargo cult

Ahrefs studied 137,210 domains: 28% have one, and **97% of those received zero
requests in a month**. Google's June 2026 documentation says it has no effect on
Search or AI Overviews; Illyes compared it to the keywords meta tag.

DASPA and ABN Assist both serve one. Harmless, already built, leave them. Do not
build any more, and do not let anyone sell you "GEO" as a separate discipline —
Google's position is *"optimising for generative AI is still SEO"*, and since
15 May 2026 the spam policy explicitly covers attempts to manipulate generative
responses.

### Core Web Vitals

LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75. All stable. Claims that LCP tightened
to 2.0s in March 2026, or that a "Visual Stability Index" exists, are not on
web.dev — ignore them. A static build passes and you move on; it is a tiebreaker,
not a lever.

### Where Google has been heading

The December 2025 core update hit finance YMYL hardest, and the losers were
generic finance affiliates running AI-drafted, non-expert-edited text. The March
and May 2026 cores rewarded government, brand and destination sites and punished
aggregators and intermediaries — plus recycled summaries and fake date bumps.

**Four small sites with one real, named, credentialed author each is the shape
being rewarded** — provided the author is real and the credential is checkable.

---

## Part 3 — Where the four sites actually stand

Pulled 24 September 2026.

| Site | Build | Org keywords | Top-3 | Traffic/mo | Traffic value | Ref domains |
|---|---|---|---|---|---|---|
| **daspa.com.au** | New, static, live since July | **0** | 0 | **0** | $0 | **4** |
| **abnassist.com.au** | New, static, live | 197 | 39 | 558 | $417 | — |
| **gstregister.com.au** | **WordPress**, pre-cutover | 259 | 46 | 481 | $834 | — |
| **cgtclearance.com.au** | **WordPress**, pre-cutover | 64 | 13 | **826** | **$903** | 23 |

Two things fall out of that table.

**CGT Clearance earns the most from the fewest keywords** — 64 keywords
producing $903/month of traffic value, the best ratio of the four — and it is
one of the two still on WordPress. It is simultaneously the most valuable
cutover and the most dangerous one.

**DASPA is the anomaly.** Ten weeks live, 102 commits, genuinely good content, a
head term at KD 1, and nothing. Four referring domains is the reason.

### Live faults found today

1. **DASPA** — `/claim-super-from` in the sitemap *and* blocked by robots.txt.
   Fixed 24 Sept; see 6.1 and Part 7. The prefix trap had been half-fixed once already.
2. **GST Register and CGT Clearance** — `Crawl-delay: 10` (throttles Bing to
   ~8,640 pages/day), `Disallow: /*?*` blocking every query-string URL, and
   **Yoast-default schema only**: WebPage, WebSite, BreadcrumbList,
   SearchAction. No Organization. No Service. No FAQPage.
3. **Host convention split** — daspa and cgtclearance serve the apex;
   abnassist and gstregister redirect to `www`. Settle it before cutover.
4. **ABN Assist emits no `Organization` schema.** DASPA does. Same group, same
   standard, one of them missed it.
5. **No reviews on any of the four.**

---

## Part 4 — The demand

AU volumes, Ahrefs, 24 September 2026.

| Cluster | Head terms | Vol/mo | KD | CPC |
|---|---|---|---|---|
| **ABN** | abn registration | 21,000 | 43 | $2.50 |
| | **apply for abn** | **10,000** | **13** | $2.00 |
| | **how to get an abn** | **3,100** | **0** | $1.60 |
| **GST** | register for gst | 4,800 | 30 | **$3.50** |
| | **gst registration** | **3,900** | **12** | $2.50 |
| **CGT** | ato clearance certificate | 4,300 | 26 | $0.80 |
| | **foreign resident capital gains withholding** | **2,200** | **1** | $1.20 |
| **DASP** | **dasp** | **1,300** | **1** | $1.30 |
| | departing australia superannuation payment | 600 | 11 | $1.30 |

Roughly **50,000 searches a month**, with the largest cluster (ABN) also the
most contested and the easiest terms sitting at KD 0–13.

`register for gst` carries the highest CPC of anything across the four niches at
$3.50 — the market's own estimate of which click is worth most.

---

## Part 5 — Per-site strategy

### DASPA — fix authority, then content

**Do not chase `dasp`.** The ATO holds #1 and the AI Overview; positions 5–10
are super funds. First non-fund commercial result is at #11 on DR 1.

The winnable ground is the long tail no one covers: **DASP rejections** (visa
not ceased, departure not recorded, identity mismatch, wrong fund, certifier not
accepted — only one competitor covers this at all), **who can certify documents
in each country**, **claiming ATO-held super after the six-month transfer**,
**cancelling a still-active visa (Form 1194) before applying**, and **DASP
taxation in the UK, Ireland and Germany** — only the US is currently served.

Several fund PDFs sit at positions 6–10. A real HTML page beats a factsheet PDF.

**But none of it ranks on four referring domains.** Link acquisition is the
first job, not the last: working-holiday communities, expat forums, university
international student offices, migration agents, the funds themselves.

### ABN Assist — take the KD-0 funnels

`abn registration` at KD 43 is a slog. The winnable set is
**`apply for abn` (10,000/mo, KD 13)** and **`how to get an abn` (3,100/mo,
KD 0)** — where a DR 6 thin relief-teacher guide currently sits at #2 and ATO
Community threads rank at #4. That is a documentation failure you can fill.

Then the zero-difficulty funnels that competitors use for authority:
**how long does it take to get an ABN** (700), **cancel ABN** (2,800),
**reactivate ABN** (1,300), **do I need an ABN** (350). These are free-riders,
and they are the only KD-0 traffic in the niche.

Nobody has written *"why the ABR refused my ABN or put it under 28-day review,
and what to do"*. Write it.

### GST Register — the softest niche of the four

Almost no dedicated paid competitor. Honcho shows no price; Sleek upsells
$1,800/yr accounting; Lawpath's GST page 404s. gstregister already outranks
every non-government result.

Its weaknesses are all fixable this week: **no price on the page, no free-ATO
statement, no reviews**.

Content gaps: backdating registration and the 21-day rule penalties, rideshare
from dollar one, **cancel GST registration** (250/mo, KD 0), and the questions
the actual form asks that nobody explains — cash vs accruals, monthly vs
quarterly.

### CGT Clearance — highest value, most urgent

No dedicated paid competitor at all. **`foreign resident capital gains
withholding` is 2,200/mo at KD 1.** The buyer is a time-pressured seller at
exchange, and the referrer — conveyancers and agents — is legally barred from
doing the work.

Fix the contradiction on the page first: *"usually a few hours"* against
*"14 to 28 days"*. One of those is wrong and both are visible.

Then the uncovered ground: co-owners each needing their own certificate, trusts,
deceased estates and SMSF applicants, name mismatch with the title, expired
certificates, **variation applications** (50/mo, KD 0), **purchaser payment
notification** (40/mo, KD 0), and state pages (`ato clearance certificate qld`,
60/mo, KD 6).

---

## Part 6 — Internal linking, and how articles get commissioned

This part exists because internal linking is the only ranking lever you fully
control. You cannot make anyone link to you. You can decide, today, what every
page on your own site points at — and on a site with four referring domains,
that is the entire budget.

It is also where DASPA lost ten weeks. The evidence is below, measured from the
repository on 24 September 2026, not asserted.

### 6.1 What the DASPA link graph actually looks like

Counting only **in-body** links — header, footer and nav stripped out, because a
link that appears on all 46 pages tells Google nothing about which page matters:

| Destination | In-body inbound links |
|---|---|
| `/` | 42 |
| **`/claim`** | **38** |
| `/dasp-calculator` | 15 |
| `/claim-super-from` | 12 |
| `/can-i-claim-my-super-myself-for-free` | 8 |
| `/claim-super-leaving-australia` | 6 |
| `/dasp-online-application` | **2** |
| every country page (`/uk`, `/ireland`, `/germany`, …) | **2** |
| `/brazil` | **1** |
| `/faq`, `/terms` | **0** |

Three things are wrong here, and they are the three failures to look for on
every site in the group.

**The most-linked page on the site is one Google is forbidden to fetch.**
`/claim` carries `noindex` *and* a `Disallow`. Thirty-eight in-body links — more
than any page except the homepage — point into it. That is correct for
conversion and it is the right CTA, so leave it. But recognise what it means:
the strongest internal signal the site emits goes somewhere that does not exist
for a crawler. The page that *should* be collecting that signal,
`/dasp-online-application`, owns a 250/mo head term and receives **two** in-body
links. Every page's editorial link budget is being spent on the checkout.

**The country cluster had exactly one crawl path, and it was blocked.**
`/uk`, `/ireland`, `/germany`, `/france`, `/italy`, `/spain`, `/philippines`,
`/india`, `/indonesia`, `/malaysia`, `/thailand` are reachable in-body from
`/claim-super-from` and the main guide. `/brazil` is reachable from the index
alone. Until PR #31 merged today, **`/claim-super-from` was disallowed in
robots.txt** — so eleven pages hung off a single blocked hub and one hung off
nothing else at all. `/visa-462` and `/visa-500` are not linked from the index
at all, though `/visa-417` and `/visa-482` are.

Twelve country pages, roughly 15,000 words, covering real offshore demand
(UK 250/mo, Philippines 90, Ireland 60), with no crawlable route in. A site with
zero organic keywords does not have a content problem.

**`/faq` and `/terms` exist only in the footer.** Nothing in any page body ever
refers to them. A footer-only page is not orphaned, but it is unranked by
construction: it has no context, no anchor variation and no topical neighbours.

### 6.2 The rules

**1. Nothing indexable gets fewer than three in-body inbound links.**
From three *different* pages, in prose, not from a list of links at the bottom.
Header and footer links do not count toward the three — they carry no topical
signal because they are identical everywhere. Run the check in 6.5 and fix
whatever it names before writing anything new.

**2. A hub page is a liability until you prove it is crawlable.**
Any cluster that hangs off one index page is one robots.txt rule, one typo or
one `noindex` from disappearing entirely — which is precisely what happened. If
a hub is the only path to a cluster, the cluster is not published, it is
staged. Give every spoke at least one inbound link from outside its own hub,
and link spokes to their two or three nearest siblings.

**3. Spend the body-link budget on the page that ranks, not the page that converts.**
The CTA can and should point at `/claim`. The *editorial* links — the ones inside
sentences, with descriptive anchors — belong to the indexable pages that are
trying to earn the query. On a page about DASP tax, the in-prose link goes to
`/dasp-calculator` and `/how-much-is-super-taxed-when-leaving-australia`; the
button goes to `/claim`.

**4. Anchor text describes the destination, and varies.**
"Read more" and "click here" transmit nothing. Nor does using the identical
exact-match anchor 40 times — that is the pattern the link spam policy names,
and it looks no better internally than externally. Write the anchor as the
phrase a person would use: *"what the ATO actually charges"*, *"how long a DASP
takes to land"*, *"claiming from the UK"*.

**5. Link down, up, and sideways.**
Hub → spoke (the index lists every country). Spoke → hub (every country page
links back). Spoke → sibling (the UK page links Ireland and Germany, because a
reader on one is plausibly on the wrong one). This is the shape that makes a
cluster legible as a cluster.

**6. Three clicks from the homepage, maximum.**
Anything deeper is telling Google it is unimportant, and you will be believed.

**7. Every link is a link from a page, not from a site.**
A link out of `/dasp-calculator` — which has 15 inbound links — is worth more
than one out of `/brazil`, which has 1. When you have a page that has earned
something, that is where the new page gets linked from. This is the only
mechanism you have for moving authority onto a new article, and on four
referring domains it is the *whole* mechanism.

**8. Retrofit, on a schedule.**
Publishing an article is half the job. The other half is going back to the five
existing pages that should reference it and adding the sentence. If that pass
does not happen, the article launches with zero inbound links and stays there.
Nothing ships without it.

### 6.3 Cross-site linking between the four

The four sites share an owner, a footer, a legal entity and a TPB registration.
That makes cross-linking both legitimate and easy to do badly.

**Do this:**
- **Follow the real journey.** ABN → GST is a genuine sequence: a sole trader who
  just got an ABN and crosses $75,000 must register for GST. Link it, in prose,
  at the moment it is true. CGT clearance → nothing. DASP → nothing. A departing
  backpacker does not need an ABN, and pretending otherwise is the beginning of
  a link scheme.
- **Disclose common ownership** wherever you cross-link. One clause: *"GST
  Register is run by the same registered tax agent practice as ABN Assist."*
  That single sentence is the difference between a group of related services and
  an undisclosed network.
- **Declare the relationship in schema.** Identical `Organization` on all four —
  same `legalName`, same `taxID` (the ABN), same address, same `sameAs` array
  listing all four domains and the TPB register entry. Entity consolidation is
  the legitimate version of what a link network fakes, and it is the thing that
  actually feeds Bing and Copilot.

**Do not do this:**
- **A reciprocal footer block on all four sites.** Four sites each linking the
  other three sitewide is a mesh, it appears on every page, and it carries no
  topical signal — the definition of a footprint. If you want a shared footer
  element, make it one link to a single group page that lists the services, and
  link that page from each site.
- **Keyword-stuffed cross-domain anchors.** "Register for GST" as the anchor from
  1,400 ABN Assist pages is not internal linking, it is a link campaign against
  yourself.
- **Duplicating the same article across two of the sites.** If the GST guide is
  useful to ABN Assist readers, link it. Do not copy it. There is no duplicate
  content penalty, but there is consolidation: Google picks one, and you lose
  control of which.

### 6.4 How articles get commissioned

The internal link map is what tells you *what to write next*, which is why it
comes before the content calendar rather than after it.

**Start from the fan-out, not the keyword list.** One page per distinct question
a user has, not one page per phrase they might type. `dasp tax rate`,
`how much tax on dasp` and `dasp tax percentage` are the same question and the
same page. "Why was my DASP rejected" and "how long does a DASP take" are
different questions and different pages. If two candidate topics share a SERP,
they share a page.

**The brief.** Every commissioned article carries all of this before a word is
written, or it does not get written:

1. **The question**, in the user's words, and the monthly volume and KD behind it.
2. **The parent topic** — confirm Google does not already cluster it with a page
   you own. If it does, you are about to compete with yourself.
3. **The answer**, in 40–80 words, self-contained, decided in advance. If it
   cannot be written before the research, the page has no reason to exist.
4. **Three inbound links**, named: which existing pages will link to it, with the
   anchor text and the sentence each one gets. Prefer pages that already rank.
5. **Three to five outbound internal links** the new page will carry.
6. **The primary source** for every figure — an ATO, ABR or legislation URL.
7. **Author and reviewer**, by name, both real.
8. **What it does not cover**, and which page covers that instead.

**Where the topics come from, in priority order:**
1. **Questions your own support inbox is answering repeatedly.** Highest-intent,
   zero-competition, and evidenced.
2. **Rejection and failure modes.** Nobody writes these and everybody searches
   them. "Why was my ABN application put under review", "why was my DASP
   rejected", "my clearance certificate name doesn't match the title".
3. **Government forum threads that rank.** When ATO Community sits at #4 on
   `how to get an abn`, that is the ATO telling you their own documentation
   failed. Those threads are a published list of content gaps.
4. **Process questions the official form raises but does not answer.** Cash vs
   accruals. Monthly vs quarterly. Which visa subclass qualifies.
5. **Timelines.** "How long does X take" is a query on every one of these four
   services and it is the one the government page answers worst, because they
   will not commit to a number.

**What does not get commissioned:** country and city clone pages (see 6.6),
pages that exist to hold a keyword variant, anything whose answer is "it
depends" with no worked example, and refreshes of pages that have not changed.

### 6.5 The checks, and what they should return

Run all four before any launch or cutover. They are cheap and each one has
already caught something real.

| Check | Passing result |
|---|---|
| Longest-match robots check against every sitemap URL | **0 blocked** |
| In-body inbound links per indexable page (nav/footer stripped) | **≥ 3, none at 0** |
| Click depth from `/` | **≤ 3 for everything indexable** |
| Pairwise near-duplicate overlap within a cluster | **< 30%** |

`scripts/link-audit.py` in this repository runs the middle two and the fourth.
It exits non-zero on a failure, so it belongs in CI, not in someone's memory.

### 6.6 On country pages — revising the rule

An earlier draft of this kit said flatly: never build country pages. That was
too blunt, and DASPA's twelve pages are the reason to be precise instead.

Measured across all 66 pairs of DASPA country pages, the **median 8-gram overlap
is 10%** — these are genuinely different documents, carrying country-specific
tax treatment, certification rules and banking detail. That is not a doorway
page set. It is a legitimate cluster.

But `/france` and `/italy` overlap **68%**, and `/spain` overlaps both at 53%.
Those three are converging on a template.

So the rule is a threshold, not a ban:

> A country page is legitimate when it carries material that is **true only of
> that country** — tax treaty treatment, who may certify documents there, how
> the payment arrives, what the local revenue authority will want. It is a
> doorway page when the only difference is the country name. Measure it:
> **under 30% pairwise overlap, keep it; over 50%, merge the group into one page
> with sections.**

Apply this before anyone proposes translated pages. `dasp` shows Korean and
Taiwanese volume that is a **different acronym entirely** — a data architecture
certificate. DASPA already ships `/ko` and `/zh-tw*`, correctly `noindex`ed.
Leave them that way.

---

## Part 7 — The checklist

Work through per site. Ticked items are done as at 24 September 2026.

### Trust and compliance — do these first, they gate everything

- [ ] "Not the ATO / not affiliated / free at the ATO / our fee $X" **above the fold** on every page that asks for money
- [ ] ABR or ATO free-option quote, with the government URL linked
- [ ] TPB Registered Tax Practitioner symbol with number and registration type, linked to the register entry
- [ ] Legal entity, ABN, street address, phone, email in the footer
- [ ] Named author on every page, linking to `/about/[name]` with photo, credential, TPB number, LinkedIn — identical across all four sites
- [ ] Editorial policy page: who writes, who reviews, source rules, corrections
- [ ] Pricing, refund and complaints pages
- [ ] Privacy page stating explicitly how TFNs and passport copies are stored and destroyed
- [ ] Google Business Profile and ProductReview listings, actively collecting
- [ ] **20 named reviews minimum** before the next cutover

### Technical

- [x] robots.txt exact paths anchored with `$` (DASPA, 24 Sept)
- [ ] Longest-match robots checker run against the live sitemap — **zero sitemap URLs blocked**
- [ ] No `nosnippet` / `max-snippet` / `data-nosnippet` anywhere
- [ ] Every rate, threshold and worked example in the initial HTML
- [ ] Sitemap with accurate `lastmod` only — drop `changefreq` and `priority`, they are ignored
- [ ] `Crawl-delay` removed (GST, CGT — currently 10 seconds)
- [ ] `Disallow: /*?*` removed (GST, CGT — blocks every query-string URL)
- [ ] One host convention across all four: apex or `www`, redirected consistently
- [ ] Bing Webmaster Tools registered, IndexNow enabled — Bing feeds Copilot and partly ChatGPT
- [ ] GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot explicitly allowed
- [ ] CWV green at p75: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1

### Schema

- [ ] `Organization` with `taxID` = ABN, legalName, address, telephone, logo, sameAs
- [ ] `Service` + `Offer` carrying the real price
- [ ] `BreadcrumbList`
- [ ] `Article`/`WebPage` with author, datePublished, dateModified
- [ ] `ProfilePage` + `Person` on the author page
- [ ] `SearchAction` **removed** (dead since Nov 2024 — currently on GST and CGT)
- [ ] `FAQPage` only where Q&As are visible and real

### Content

- [ ] Answer-first paragraph, 40–80 words, self-contained, under every H2
- [ ] Bolded direct answer with the current figure, attributed to the ATO with the URL
- [ ] One page per fan-out sub-question — not one page per keyword variant
- [ ] Visible "Updated [date] · Reviewed by [name]", `dateModified` matching and moving only on real change
- [ ] Cluster near-duplicate overlap under 30% (see 6.6); merge anything over 50%
- [ ] Worked examples with real dollar figures — this is what AI Overviews quote

### Authority

- [ ] Referring domain count tracked monthly per site
- [ ] DASPA specifically: a link plan. Four referring domains is the whole problem
- [x] `link-audit.py` passing: every indexable page on 3+ in-body inbound links, nothing deeper than 3 clicks (DASPA, 24 Sept)
- [ ] `link-audit.py` ported to the other three repos and wired into CI
- [ ] Every new article ships with its three inbound links already added (6.4)
- [ ] Cross-site links follow a real journey and disclose common ownership (6.3)

---

## Part 8 — Cutover procedure, GST Register and CGT Clearance

Both are WordPress. CGT Clearance carries $903/month of traffic value and 23
referring domains — treat it as the higher-risk migration of the two.

1. **Crawl and freeze the old URL set first.** Every URL, including image and
   pagination URLs. You cannot write a 301 map for pages you did not enumerate.
2. **301 every old URL 1:1** where it earned anything. Nothing to a 404.
3. **Preserve `dateModified` and the author entity.** A migration that resets
   every date to launch day reads as a site-wide fake date bump, which the 2026
   cores demoted.
4. **Submit the new `/sitemap.xml` in Search Console on the day, and DELETE the
   old `sitemap_index.xml` row.** WordPress serves `sitemap_index.xml`; the new
   build will not. A stale sitemap row sits green and 404s for months — it
   happened to six properties on the LINK estate and nobody noticed, because the
   status column lies and a missing row produces no error to find.
5. **Verify the 301 map against the live site**, not against the spreadsheet.
6. **Confirm you are in the right Search Console property** before concluding
   nothing moved.
7. **Re-run the robots longest-match checker** against the new sitemap.
8. **Re-check traffic at 14 and 28 days** against the pre-cutover baseline in
   this document. That baseline is why Part 3 exists.

---

## Part 9 — Stop doing these

All confirmed obsolete against primary sources, September 2026.

- **Meta keywords, keyword density, TF-IDF, LSI keywords** — Google's Starter Guide says not used; AI systems understand synonyms
- **Word-count targets and minimum lengths** — no such factor
- **Publishing cadence** — "post weekly" is not a ranking input, and fake date bumps are now actively demoted
- **FAQ and HowTo schema for rich results** — both dead
- **`WebSite` + `SearchAction` markup** — dead November 2024, still live on two of your sites
- **Disavow files as routine maintenance** — Mueller, March 2026: most sites do not need it
- **llms.txt, "AI files", content chunking, GEO/AEO as a separate discipline** — no measured effect
- **Country page multiplication where the only difference is the country name** — doorway risk. Genuinely differentiated country pages are fine; measure it, see 6.6
- **"Duplicate content penalty"** — there is no penalty, only consolidation
- **Exact-match anchor campaigns, directory and press-release links** — link spam policy, and irrelevant at KD 0–3
- **"Structured data helps rankings"** — it does not; it clarifies entities and feeds Bing and Copilot
- **"LCP tightened to 2.0s" / "new CWV metric in 2026"** — not true, not on web.dev
- **Sitemap `changefreq` and `priority`, and the sitemap ping endpoint** — ignored and removed respectively

---

## Open items

Things this kit asserts that should be re-checked rather than trusted forever.

- **AI Overview click figures** are vendor studies with different methodologies.
  The direction is unambiguous, the magnitude is not.
- **Passage-position citation data** (44–55% from the first third of a page) is
  correlational, not a Google statement.
- **Korean and Taiwanese DASP volume** is a false signal — verified as a
  different acronym. Re-check before anyone proposes translated pages.
- **NSW/ACCC enforcement posture** on government-lookalike services is evolving.
  The disclosure standard in rule 2 should be reviewed, not assumed stable.
- **CGT Clearance's "few hours" vs "14 to 28 days"** contradiction is live on the
  site today and one of the two figures is wrong.
