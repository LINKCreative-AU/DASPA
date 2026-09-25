# daspa.com.au, for Claude Code

Static HTML, no framework, no build step. Vercel serves the files as they are.
`README.md` is the operational manual; read it before changing anything that
touches payments, email or the claim flow.

## Before you push, always

```
python scripts/check.py        # SERP budgets, em dashes, canonicals, JSON-LD, placeholders
python scripts/link-audit.py   # internal linking, per SEO-KIT.md Part 6
```

Both run in CI on every push and pull request. Neither can tell you whether the
copy is **true**: rates, deadlines and fees are checked by a human against the
ATO, never here.

## SEO work: read SEO-KIT.md first

**`SEO-KIT.md` is the standard this site and its three siblings are built and
audited against** (abnassist.com.au, gstregister.com.au, cgtclearance.com.au).
It is the source of truth. `SEO-KIT.pdf` is a rendering of it for people who are
not in a terminal, produced by `scripts/build-seo-kit-pdf.py`; never edit the
PDF, regenerate it.

`SEO.md` is narrower and older: what is implemented on *this* site and why,
including the keyword-to-page map. Where the two disagree, the kit wins and
`SEO.md` needs updating.

The parts you will reach for most:

- **Part 1** the eleven standards. Cite these when someone wants to do something else.
- **Part 6** internal linking, and the brief every commissioned article carries.
- **Part 7** the checklist.
- **Part 9** what to stop doing. Check here before implementing SEO advice from anywhere else.

Rules that are load-bearing and easy to break by accident:

1. **A robots.txt rule is a prefix, not a path.** `Disallow: /claim` blocks
   `/claim-super-from` too. Anchor exact paths with `$`. This has cost this site
   real traffic twice.
2. **Every fact goes in the initial HTML.** AI crawlers do not execute
   JavaScript, so anything a calculator renders client-side is invisible to them
   and to Google. That is why `scripts/build-calculator-matrix.py` exists.
3. **Nothing indexable ships with fewer than three in-body inbound links.** Header
   and footer links do not count, and `link-audit.py` will not let you.
4. **Every new page ships with its inbound links already added** to the pages that
   should reference it. An article published without them launches orphaned and
   stays there.
5. **"Not the ATO", the free ATO option and our fee stay above the fold** on every
   page that asks for money. This is a compliance rule before it is an SEO one.
6. **No em dashes.** House style, enforced by `check.py`.

## Things that look like bugs and are not

- `/ko` and `/zh-tw*` are **deliberately noindex** until a native speaker signs off
  the copy. The Korean `dasp` search volume is a different acronym entirely, a
  data architecture certificate. Do not index them to chase it.
- `/claim`, `/verify`, `/confirmation` and `/upload-form` are noindex **and**
  disallowed on purpose. They are the transactional flow.
- `/faq` and `/terms` carry few in-body links by design; the legal pages are
  exempt in `link-audit.py` and the exemption is documented there.
- `/france`, `/italy` and `/spain` overlap 54 to 68 percent and are **waived, not
  fixed**, in `link-audit.py`. The kit says a group over 50 percent should be
  merged into one page with sections. Three live URLs, so it is owed a human.
