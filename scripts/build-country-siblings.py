#!/usr/bin/env python3
"""Give every country page in-body links to its nearest siblings.

WHY. Measured from this repository on 24 Sept 2026, with header, footer and nav
stripped out (a link on all 46 pages says nothing about which page matters),
every country page had exactly TWO in-body inbound links and /brazil had one.
Both real paths ran through /claim-super-from -- and until PR #31 that index was
Disallowed in robots.txt. Twelve pages, ~15,000 words, covering UK 250/mo,
Philippines 90 and Ireland 60, hanging off a single blocked hub.

A cluster reachable only through its own index is not published, it is staged.
This adds the sideways edges: spoke -> sibling, so no country page depends on
any one other page surviving.

WHAT THIS DOES NOT DO. It does not make the pages worth ranking, and it is not
a licence to add more of them. A country page earns its place by carrying
something true only of that country; /france and /italy already overlap 68% on
8-grams and are converging on a template. See SEO-KIT.md 6.6 -- under 30%
pairwise overlap keep it, over 50% merge the group.
"""
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# Nearest siblings: who a reader on the wrong page is plausibly looking for.
# Grouped by how the claim actually differs -- payment rails and certification
# practice -- not by continent for its own sake.
SIBLINGS = {
    "uk":          ["ireland", "germany", "france"],
    "ireland":     ["uk", "germany", "spain"],
    "germany":     ["france", "ireland", "uk"],
    "france":      ["germany", "italy", "spain"],
    "italy":       ["spain", "france", "germany"],
    "spain":       ["italy", "france", "brazil"],
    "philippines": ["indonesia", "malaysia", "thailand"],
    "india":       ["malaysia", "philippines", "brazil"],
    "indonesia":   ["malaysia", "thailand", "philippines"],
    "malaysia":    ["indonesia", "thailand", "india"],
    "thailand":    ["malaysia", "indonesia", "philippines"],
    "brazil":      ["philippines", "india", "spain"],
}

LABEL = {
    "uk": "the UK", "ireland": "Ireland", "germany": "Germany", "france": "France",
    "italy": "Italy", "spain": "Spain", "philippines": "the Philippines",
    "india": "India", "indonesia": "Indonesia", "malaysia": "Malaysia",
    "thailand": "Thailand", "brazil": "Brazil",
}

MARK_OPEN = "<!-- country-siblings:start -->"
MARK_CLOSE = "<!-- country-siblings:end -->"


def block(slug):
    sibs = SIBLINGS[slug]
    links = ", ".join(
        f'<a href="/{s}">claiming from {LABEL[s]}</a>' for s in sibs[:-1]
    )
    links += f' or <a href="/{sibs[-1]}">from {LABEL[sibs[-1]]}</a>'
    return (
        f"{MARK_OPEN}\n"
        f'<h2>Claiming from somewhere else?</h2>\n'
        f"<p>The process is the same wherever you are, but the tax treaty position, "
        f"who can certify your documents and how the payment lands all change with "
        f"the country. We cover {links}, and every country we handle is listed on "
        f'<a href="/claim-super-from">the full country index</a>. If yours is not '
        f'there, the <a href="/claim-super-leaving-australia">main guide to claiming '
        f"super after leaving Australia</a> applies unchanged.</p>\n"
        f"{MARK_CLOSE}"
    )


def main():
    existing = re.compile(
        re.escape(MARK_OPEN) + r".*?" + re.escape(MARK_CLOSE), re.S
    )
    changed = []
    for slug in SIBLINGS:
        path = f"{slug}.html"
        if not os.path.exists(path):
            sys.exit(f"{path} is missing; SIBLINGS is out of date with the site")
        html = open(path, encoding="utf-8").read()
        new = block(slug)
        if existing.search(html):
            out = existing.sub(new, html)
        else:
            anchor = '<div class="cta-band">'
            if anchor not in html:
                sys.exit(f"{path}: no .cta-band to insert before; markup changed")
            out = html.replace(anchor, new + "\n" + anchor, 1)
        if out != html:
            open(path, "w", encoding="utf-8").write(out)
            changed.append(path)

    # Every country must be NAMED by at least two siblings, so losing one page
    # never strands another. The whole point was removing the single path.
    named = Counter(s for sibs in SIBLINGS.values() for s in sibs)
    thin = sorted(s for s in SIBLINGS if named[s] < 2)
    if thin:
        sys.exit(f"these countries are named by fewer than 2 siblings: {thin}")

    print(f"country siblings: {len(changed)} page(s) written, "
          f"{len(SIBLINGS)} in the cluster, "
          f"min inbound sibling mentions {min(named.values())}")


if __name__ == "__main__":
    main()
