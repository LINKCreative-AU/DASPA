#!/usr/bin/env python3
"""Internal-link audit for daspa.com.au. Enforces SEO-KIT.md Part 6.

Run: python scripts/link-audit.py   (add --report to print without failing)

WHY THIS EXISTS. Internal linking is the only ranking lever a site with four
referring domains fully controls, and it is the one that failed here silently:
twelve country pages sat behind a single hub that robots.txt was blocking, and
nothing in the build could notice. A check that lives in someone's memory is
not a check.

THE THREE RULES IT ENFORCES (SEO-KIT.md 6.2 and 6.5)
  1. Every indexable page has >= 3 IN-BODY inbound links, from >= 3 different
     pages. Header, footer and nav links are stripped before counting: a link
     that appears on all 46 pages carries no signal about which page matters,
     so counting it would make the audit pass by decoration.
  2. Click depth from / is <= 3 following ANY link, footer and nav included --
     that is how a crawler actually discovers pages. Body-only depth is
     reported alongside it as a warning, because a page reachable only through
     the footer is discoverable but carries no editorial context.
  3. No pair of pages inside a cluster exceeds 30% 8-gram overlap. Above 50%
     the group should be merged into one page with sections (6.6).

WHAT IT CANNOT SEE, stated deliberately because a blind spot is invisible from
inside the guard:
  * whether the anchor text is any good. It counts edges, not persuasion, and
    three links reading "click here" pass.
  * whether the linked page deserves to rank, or whether the topic has demand.
  * links added by JavaScript. This is a static site; if that ever stops being
    true, this audit stops being complete and will not say so.
  * anything about the live site. It reads the repository. A page can pass here
    and be blocked in production -- run the robots check for that.
  * whether Google agrees two pages are one topic. Overlap is a proxy for
    duplication, not for the SERP's own clustering.

EXEMPTIONS, and why each is a deliberate decision rather than an oversight:
  * noindex pages are skipped entirely -- they are not competing for anything.
  * legal and transactional pages (/terms, /privacy, /tpb) are exempt from the
    inbound-link minimum. They are linked site-wide from the footer on purpose
    and they are not trying to rank; forcing prose links to them would be
    decoration aimed at this script.
"""
import os
import re
import sys
from collections import deque
from glob import glob
from itertools import combinations

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

MIN_INBOUND = 3
MAX_DEPTH = 3
OVERLAP_WARN = 0.30
OVERLAP_FAIL = 0.50
SHINGLE = 8

# Exempt from the inbound-link minimum. Footer-linked on purpose, not ranking.
EXEMPT = {"terms.html", "privacy.html", "tpb.html"}

# Cluster pairs whose overlap is known, accepted for now, and NOT yet fixed.
# The recorded figure is the ceiling: if a pair drifts higher the waiver breaks
# and this fails, so the problem cannot quietly get worse while being ignored.
# /france, /italy and /spain are converging on a template and SEO-KIT.md 6.6
# says a group over 50% should be merged into one page with sections. That is a
# content decision with three live URLs at stake, so it is owed a human, not a
# script. Until then it is visible on every run rather than forgotten.
WAIVED = {
    ("france.html", "italy.html"): 0.68,
    ("france.html", "spain.html"): 0.54,
    ("italy.html", "spain.html"): 0.54,
}

# Clusters checked for near-duplication. A cluster is a set of pages built from
# the same template for different subjects -- exactly where doorway pages form.
CLUSTERS = {
    "country": ["uk", "ireland", "germany", "france", "italy", "spain",
                "philippines", "india", "indonesia", "malaysia", "thailand",
                "brazil"],
    "visa": ["visa-417", "visa-462", "visa-482", "visa-500"],
}

CHROME = re.compile(r"<(header|footer|nav)\b.*?</\1>", re.S | re.I)
NOINDEX = re.compile(r'name=["\']robots["\'][^>]*noindex', re.I)
HREF = re.compile(r'href=["\']([^"\']+)["\']')


def read(path):
    with open(path, encoding="utf-8", errors="ignore") as fh:
        return fh.read()


def body_of(html):
    return CHROME.sub("", html)


def targets(html, pages, self_name):
    """In-repo page targets of the hrefs in this fragment."""
    out = set()
    for href in HREF.findall(html):
        if href.startswith(("http", "mailto", "tel", "javascript", "#", "/assets")):
            continue
        name = href.split("#")[0].split("?")[0].strip("/").split("/")[-1]
        name = name or "index"
        if not name.endswith(".html"):
            name += ".html"
        if name in pages and name != self_name:
            out.add(name)
    return out


def text_of(html):
    s = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    s = re.sub(r"<style.*?</style>", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", s).strip().lower()


def shingles(text):
    w = text.split()
    return {tuple(w[i:i + SHINGLE]) for i in range(len(w) - SHINGLE + 1)}


def main():
    report_only = "--report" in sys.argv
    pages = sorted(os.path.basename(p) for p in glob("*.html"))
    html = {p: read(p) for p in pages}
    indexable = [p for p in pages if not NOINDEX.search(html[p])]

    body_links = {p: targets(body_of(html[p]), pages, p) for p in pages}
    inbound = {p: sorted(src for src in pages if p in body_links[src]) for p in pages}

    failures = []
    warnings = []

    # 1. inbound minimum
    thin = [(p, inbound[p]) for p in indexable
            if p not in EXEMPT and len(inbound[p]) < MIN_INBOUND]
    for p, srcs in sorted(thin, key=lambda x: len(x[1])):
        failures.append(
            f"{p}: {len(srcs)} in-body inbound link(s), needs {MIN_INBOUND}"
            + (f" (from {', '.join(srcs)})" if srcs else " (ORPHAN)")
        )

    # 2. click depth from /. Discovery uses every link a crawler can follow;
    #    the body-only walk is reported separately as editorial reach.
    all_links = {p: targets(html[p], pages, p) for p in pages}

    def walk(graph):
        d = {"index.html": 0}
        q = deque(["index.html"])
        while q:
            cur = q.popleft()
            for nxt in graph[cur]:
                if nxt not in d:
                    d[nxt] = d[cur] + 1
                    q.append(nxt)
        return d

    depth = walk(all_links)
    editorial = walk(body_links)
    for p in indexable:
        d = depth.get(p)
        if d is None:
            failures.append(f"{p}: unreachable from / by any link")
        elif d > MAX_DEPTH:
            failures.append(f"{p}: {d} clicks from /, limit is {MAX_DEPTH}")
        if p not in EXEMPT and editorial.get(p) is None:
            warnings.append(f"{p}: reachable only through nav or footer, "
                            f"no in-body path from /")

    # 3. cluster near-duplication
    for cluster, slugs in CLUSTERS.items():
        present = [f"{s}.html" for s in slugs if f"{s}.html" in html]
        sh = {p: shingles(text_of(html[p])) for p in present}
        worst = 0.0
        for a, b in combinations(present, 2):
            union = sh[a] | sh[b]
            if not union:
                continue
            j = len(sh[a] & sh[b]) / len(union)
            worst = max(worst, j)
            line = f"{cluster}: {a} vs {b} overlap {j:.0%}"
            ceiling = WAIVED.get((a, b)) or WAIVED.get((b, a))
            if ceiling is not None:
                if j > ceiling + 0.01:
                    failures.append(
                        line + f" (waived at {ceiling:.0%} and now worse)")
                else:
                    warnings.append(line + f" (WAIVED at {ceiling:.0%}, "
                                           f"unresolved, see SEO-KIT.md 6.6)")
            elif j >= OVERLAP_FAIL:
                failures.append(line + f" (>= {OVERLAP_FAIL:.0%}, merge them)")
            elif j >= OVERLAP_WARN:
                warnings.append(line + f" (>= {OVERLAP_WARN:.0%}, converging on a template)")
        print(f"cluster {cluster}: {len(present)} pages, worst pair {worst:.0%}")

    print(f"{len(pages)} pages, {len(indexable)} indexable, "
          f"{len(pages) - len(indexable)} noindex")
    print(f"min in-body inbound among indexable non-exempt: "
          f"{min((len(inbound[p]) for p in indexable if p not in EXEMPT), default=0)}")
    print(f"max click depth from /: "
          f"{max((depth.get(p, 99) for p in indexable), default=0)} "
          f"(in-body only, excluding footer-linked legal pages: "
          f"{max((editorial.get(p, 99) for p in indexable if p not in EXEMPT), default=0)})")

    for w in warnings:
        print(f"WARN  {w}")
    for f in failures:
        print(f"FAIL  {f}")

    if failures and not report_only:
        sys.exit(f"\n{len(failures)} internal-link failure(s). See SEO-KIT.md Part 6.")
    print("\nOK" if not failures else "\n(report only)")


if __name__ == "__main__":
    main()
