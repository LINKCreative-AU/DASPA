# Making website changes safely with Claude Code

How to work on DASPA, ABN Assist and GST Register without ever breaking
production: branch first, preview always, merge deliberately. Shareable web
version: ask James for the artifact link.

## 0 · One-time setup

1. Get added to the **LINKCreative-AU** GitHub org and the **link-hq** Vercel team (ask James).
2. Install Claude Code, Git and Node, then authenticate once:
   ```
   gh auth login          # GitHub
   npx vercel login       # Vercel (LINK email)
   ```
3. Clone and start:
   ```
   git clone https://github.com/LINKCreative-AU/gstregister-site.git
   cd gstregister-site
   claude
   ```

| Repo | Production | What it is |
|---|---|---|
| DASPA | daspa.com.au | DASP super claims (ARO · Tax Agent 26076969) |
| abnassist-site | abnassist-site.vercel.app | ABN registration + business names (ARO · Tax Agent 26076969) |
| gstregister-site | gstregister-site.vercel.app | GST registration (ARLS · **BAS** Agent 25972850) |

> **Never mix the entities.** ABN Assist and DASPA belong to Australian
> Registration Office (tax agent 26076969). GST Register belongs to Australian
> Registration and Lodgement Services (BAS agent 25972850). A wrong number in
> a footer or declaration is a compliance problem, not a typo.

## 1 · Initialising Claude Code in a repo

First session in a repo, run `/init` so Claude generates a `CLAUDE.md`
(commit it). Then paste this context prompt:

> I'm working on [REPO NAME], one of LINK's Online Services sites — a static
> HTML site with Vercel serverless functions in /api, deployed on the link-hq
> Vercel team. Before changing anything: (1) never commit or push to main —
> we work on feature branches and use Vercel preview deployments for review;
> (2) the site has strict content rules documented in
> docs/seo-content-roadmap.md — read them first, especially: exact prices
> appear only on /pricing and form totals, the "you can do this free at the
> ATO" honesty appears only in FAQ answers and legal pages, and every rate or
> threshold needs an official source link with a "current as of" date;
> (3) visible FAQ text and its JSON-LD schema must always be edited together;
> (4) all forms are fail-open — they must store an order/lead before
> attempting payment or email, never lose a submission; (5) never put secrets
> in code — env vars live in Vercel project settings. Confirm you've read the
> roadmap doc, then wait for my task.

## 2 · The safe workflow: branch → preview → merge

**main is production. Never work on it directly.**

```
git checkout main
git pull origin main                 # always start from the latest
git checkout -b feature/short-name   # e.g. feature/faq-wording
```

Each repo also has a standing `markup` branch used for design-review rounds
with Chris (Vercel comments work on its preview).

Get a preview URL two ways:

- **Git previews** (once the Vercel GitHub App has repo access): just
  `git push -u origin feature/short-name` — Vercel builds a Preview
  Deployment automatically.
- **CLI previews** (always works): `npx vercel deploy` — note **no**
  `--prod`. Returns a unique preview URL, does not touch production.

> **The only commands that ship to production:** `npx vercel deploy --prod`,
> or merging/pushing to `main` once git-deploys are on. If you didn't type
> one of those, you can't have broken live.

## 3 · Example prompts

**New feature:**

> We're on branch feature/refunds-faq (confirm with git status — if we're on
> main, create the branch first). Task: add a "Refunds" question to the
> pricing page FAQ saying [exact wording]. Follow the repo's FAQ pattern:
> update the visible details block AND the FAQPage JSON-LD together, keep the
> wording identical in both. When done: (1) show me a summary of every file
> you changed and why, (2) run your verification pass — JSON-LD parses, no
> broken internal links, no pricing outside /pricing and form totals,
> (3) commit to this branch with a clear message and push, (4) give me the
> Vercel preview URL. Do NOT touch main and do NOT deploy to production.

**Bug fix:**

> Bug report: on [PAGE], [what's wrong]. We're on branch fix/short-name.
> First diagnose — show me the cause before changing anything. Then fix it,
> test the affected page in the preview browser (form validation still works,
> no console errors), show me the diff, and commit + push to this branch
> only. Give me the preview URL and list anything else the bug might affect.

Habits that make prompts safe: name the branch, ask for the diff, ask for
verification, end with the two prohibitions (*no main, no production*).

> **Commit only your own work.** Ask Claude to commit specific files
> (`git add file1 file2`), not `git add -A` — if someone else has uncommitted
> work in the same folder, `-A` sweeps it into your commit. If `git status`
> shows files you didn't touch, stop and ask in Slack.

## 4 · Verifying the preview before merging

Minimum checklist on every preview URL:

- The pages you changed — desktop and phone width
- Forms still submit (queue-mode: a test reaches "application received" —
  put "TEST" in the name so the team disregards it)
- Console clean (F12) on pages you touched
- Nothing leaked: prices outside /pricing, wrong agent number, dead paths
- Schema parses (Google rich results test) if you touched FAQ/articles

Design review: send the preview URL to Chris — he presses **c** in the
Vercel toolbar and pins comments. Fix, push again (same branch = same URL),
repeat.

Merging = releasing:

```
gh pr create --fill --base main     # second pair of eyes
gh pr merge --squash                # this IS the production release
```

Anything touching forms, /api, pricing or declarations always gets a PR.
After every release: load production, hard-refresh, click the thing you
shipped.

## 5 · House rules Claude must follow

- **Pricing** — exact figures only on /pricing and the form total.
- **DIY honesty** — FAQ answers and legal pages only; the business-name page
  mentions no DIY route at all.
- **Sourced claims** — no rate/threshold/fee without an official link and a
  "current as of" date. GST threshold $75,000; rideshare GST from the first
  dollar; no-ABN withholding 47%.
- **Schema sync** — visible FAQ text and JSON-LD change together.
- **Fail-open forms** — storage first, then payment/email.
- **No secrets in code** — keys live in Vercel env settings. A key in a diff
  stops the commit.

---
*LINK Online Services · 14 July 2026 · questions: James or #arls_aro.*
