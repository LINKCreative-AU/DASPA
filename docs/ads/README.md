# DASPA Google Ads launch pack — 14 July 2026

Everything needed to launch the trial campaign from scratch. Strategy doc
(budgets, bidding, geo, evaluation plan): ask James for the artifact link.

## Files

| File | What it is | How to use |
|---|---|---|
| `keywords.csv` | 2 campaigns · 5 ad groups each · ~40 keywords with match types + starting CPCs | Google Ads Editor → Account → Import → paste/attach |
| `negative-keywords.csv` | Shared negative list (fund brands, ATO/mygov navigational, wrong-intent super queries) | Create a shared negative list "DASPA core negatives", apply to both campaigns |
| `ads-rsa.csv` | One RSA per ad group — headlines pipe-separated, all ≤30 chars; descriptions ≤90 | Build RSAs in Editor per ad group; pin nothing, let Google rotate |
| `monitoring-scripts.js` | Two read-only Ads Scripts: daily pacing/CPA alarm + weekly search-term digest | Ads UI → Tools → Scripts → paste, authorise, schedule (daily 8am / Mon 8am) |
| `conversion-tracking.md` | The two conversion actions + snippets Claude wires into the site | Do this FIRST — no launch without tracking |

## Launch order

1. Conversion actions created → IDs to Claude → tags wired + tested on preview
2. Import keywords + negatives + RSAs via Ads Editor; check campaign settings
   against the strategy doc (geo, language English, Search only, no Display
   Expansion, no auto-apply recommendations)
3. Install both monitoring scripts
4. Set daily budgets per the strategy doc, enable campaigns
5. Week 1: daily search-term check (script emails it); everything else weekly

## Non-negotiables

- **Search partners off, Display Expansion off** — the classic silent budget leak
- **Auto-apply recommendations OFF** (Settings → Recommendations) — every
  Google "optimisation" gets a human eye first
- Ads never imply government/ATO affiliation — we are a registered tax agent,
  and every ad carries or lands on the TPB number
- No price in ad copy for the trial (matches the site's pricing positioning);
  the "no super, no fee" guarantee is the hook instead
