#!/usr/bin/env python3
"""Pre-flight checks for daspa.com.au. Run `python scripts/check.py` before pushing.

Exists because this is a static site with no build step, which means nothing can
fail. That is how WHATSAPP_NUMBER_PLACEHOLDER reached production and put 62 dead
links across 29 live pages, and how every meta description drifted 20 to 100
characters past the point Google truncates.

WHAT THIS GUARD CANNOT SEE, written down deliberately, because a blind spot is
never obvious from inside the guard:
  * whether the copy is TRUE. Rates, deadlines and fees are checked by a human
    against the ATO, not here.
  * whether a page ranks, or whether a description earns the click. It checks the
    budget and the leak, not the persuasion.
  * anything about the Vercel environment. It cannot tell you WHATSAPP_NUMBER,
    OPS_EMAIL or RESEND_API_KEY are set in production. It only proves the code
    stopped hardcoding them.
  * the /api functions at runtime. Syntax only, via `node --check`, if node exists.
  * the Korean and Taiwanese pages' language quality, which needs a native reader.
"""
import json
import os
import re
import subprocess
import sys
from glob import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

TITLE_MAX = 60      # Google truncates around here on desktop
DESC_MAX = 158
EM_DASH = "—"

# Pages deliberately kept out of the index: transactional steps and the two
# language pages that are built but awaiting a native review.
NOINDEX = {"claim", "verify", "confirmation", "upload-form", "ko", "zh-tw"}

# A description must not resolve the question its page answers. See the kit
# standard: at position 6 to 9 a complete answer in the SERP is read and skipped.
LEAKS = [
    (r"\b\d{2}%", "states a tax rate"),
    (r"\b28 days?\b", "states the processing time"),
    (r"^(generally )?no\b", "answers the question outright"),
    (r"^yes\b", "answers the question outright"),
]

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def slug_of(path):
    base = os.path.basename(path)[:-5]
    return "" if base == "index" else base


def meta(html, name=None, prop=None):
    if name:
        m = re.search(r'<meta name="%s" content="([^"]*)"' % name, html)
    else:
        m = re.search(r'<meta property="%s" content="([^"]*)"' % prop, html)
    return m.group(1) if m else None


pages = sorted(glob("*.html"))
if not pages:
    err("no HTML pages found; is the working directory right?")

sitemap = open("sitemap.xml", encoding="utf-8").read() if os.path.exists("sitemap.xml") else ""
sitemap_slugs = set(
    re.findall(r"<loc>https://daspa\.com\.au/([^<]*)</loc>", sitemap))

for path in pages:
    html = open(path, encoding="utf-8").read()
    slug = slug_of(path)
    name = os.path.basename(path)
    indexable = (slug or "index") not in NOINDEX and "noindex" not in (
        meta(html, name="robots") or "")

    # --- 1. em dashes ---------------------------------------------------
    if EM_DASH in html:
        err("%s: %d em dash(es). House style: comma, colon, full stop or middot."
            % (name, html.count(EM_DASH)))

    # --- 2. SERP budgets and answer leakage -----------------------------
    title = re.search(r"<title>([^<]*)</title>", html)
    desc = meta(html, name="description")
    if not title:
        err("%s: no <title>" % name)
    elif indexable and len(title.group(1)) > TITLE_MAX:
        err("%s: title is %d chars, budget is %d. It will be truncated."
            % (name, len(title.group(1)), TITLE_MAX))
    if not desc:
        err("%s: no meta description" % name)
    elif indexable:
        if len(desc) > DESC_MAX:
            err("%s: description is %d chars, budget is %d. The closing promise, "
                "which is the reason to click, gets cut." % (name, len(desc), DESC_MAX))
        for pattern, why in LEAKS:
            if re.search(pattern, desc, re.I):
                err("%s: description %s. Name the question, promise what the SERP "
                    "cannot show, do not answer it." % (name, why))

    # --- 3. head essentials ---------------------------------------------
    if indexable:
        if not re.search(r'<link rel="canonical"', html):
            err("%s: no canonical" % name)
        og_image = meta(html, prop="og:image")
        if not og_image:
            err("%s: no og:image. Shares render as a bare link." % name)
        else:
            local = og_image.replace("https://daspa.com.au/", "")
            if not os.path.exists(local):
                err("%s: og:image points at %s which is not in the repo" % (name, local))
        if not meta(html, name="twitter:card"):
            warn("%s: no twitter:card" % name)

    # --- 4. sitemap agreement -------------------------------------------
    if indexable and slug not in sitemap_slugs:
        err("%s: indexable but missing from sitemap.xml" % name)
    if not indexable and slug in sitemap_slugs:
        err("%s: noindex but listed in sitemap.xml" % name)

    # --- 5. schema parses ------------------------------------------------
    for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            json.loads(block)
        except json.JSONDecodeError as e:
            err("%s: JSON-LD does not parse (%s)" % (name, e))

# --- 6. sitemap points at real pages -------------------------------------
for s in sorted(sitemap_slugs):
    if not os.path.exists((s or "index") + ".html"):
        err("sitemap.xml lists /%s which has no page" % s)

# --- 7. no placeholders in anything we ship ------------------------------
shipped = pages + glob("assets/*.js") + glob("api/*.js") + glob("api/_lib/*.js")
for path in shipped:
    body = open(path, encoding="utf-8").read()
    for token in ("WHATSAPP_NUMBER_PLACEHOLDER", "AW-XXXXXXXXX", "YOUR_KEY_HERE"):
        if token in body:
            err("%s: ships the placeholder %s. Resolve it from env instead."
                % (path, token))

# --- 8. server functions at least parse ----------------------------------
node = None
for candidate in ("node", "node.exe"):
    try:
        subprocess.run([candidate, "--version"], capture_output=True, check=True)
        node = candidate
        break
    except (OSError, subprocess.CalledProcessError):
        continue
if node:
    for path in glob("api/*.js") + glob("api/_lib/*.js") + glob("assets/*.js"):
        r = subprocess.run([node, "--check", path], capture_output=True)
        if r.returncode:
            err("%s: syntax error\n%s" % (path, r.stderr.decode()[:400]))
else:
    warn("node not found, skipped the syntax check on api/ and assets/")

# --- report ---------------------------------------------------------------
for w in warnings:
    print("WARN  " + w)
for e in errors:
    print("FAIL  " + e)

print("\n%d pages checked, %d error(s), %d warning(s)"
      % (len(pages), len(errors), len(warnings)))
sys.exit(1 if errors else 0)
