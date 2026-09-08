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
  * the language pages' TRANSLATION QUALITY. It can prove /ja contains only
    Japanese scripts; it cannot prove the Japanese is correct, idiomatic, or
    says what the English says. That needs a native reader, which is why those
    pages ship noindex.
"""
import json
import os
import re
import subprocess
import sys
import unicodedata
from glob import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# Failure messages can quote Chinese, Japanese or Korean text. The Windows console
# defaults to cp1252 and raises on those, so the guard would crash instead of
# telling you what was wrong, which is the one moment it has to work.
for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

TITLE_MAX = 60      # Google truncates around here on desktop
DESC_MAX = 158
EM_DASH = "—"

# Transactional steps, kept out of the index. The language pages are NOT listed
# here: they each carry their own noindex meta tag, and reading that is more
# reliable than a list somebody has to remember to append to.
NOINDEX = {"claim", "verify", "confirmation", "upload-form"}

# Scripts a page may contain, keyed on its own <html lang>. A stray Cyrillic
# character once reached a Japanese call to action and nothing would have caught
# it, because nobody here reads the output. Latin is allowed everywhere: DASP,
# ATO and the dollar figures stay in Latin on purpose.
LANG_SCRIPTS = {
    "zh-Hant-TW": {"Han", "Latin", "Common"},
    "ja": {"Han", "Hiragana", "Katakana", "Latin", "Common"},
    "ko": {"Hangul", "Han", "Latin", "Common"},
}
SCRIPT_NAMES = {"CJK": "Han", "HIRAGANA": "Hiragana", "KATAKANA": "Katakana",
                "HANGUL": "Hangul", "LATIN": "Latin"}


def script_of(ch):
    name = unicodedata.name(ch, "")
    for key in ("CJK", "HIRAGANA", "KATAKANA", "HANGUL", "CYRILLIC", "GREEK",
                "ARABIC", "HEBREW", "THAI", "DEVANAGARI", "LATIN"):
        if key in name:
            return SCRIPT_NAMES.get(key, key.title())
    return "Common"


def serp_width(text):
    """Rough SERP pixel budget in half-widths. A CJK glyph takes about twice the
    width of a Latin one, so counting characters would let a Chinese or Japanese
    title run to double the length Google actually shows."""
    return sum(2 if unicodedata.east_asian_width(c) in ("W", "F") else 1 for c in text)

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
    elif indexable and serp_width(title.group(1)) > TITLE_MAX:
        err("%s: title is %d wide, budget is %d. It will be truncated."
            % (name, serp_width(title.group(1)), TITLE_MAX))
    if not desc:
        err("%s: no meta description" % name)
    elif indexable:
        if serp_width(desc) > DESC_MAX:
            err("%s: description is %d wide, budget is %d. The closing promise, "
                "which is the reason to click, gets cut."
                % (name, serp_width(desc), DESC_MAX))
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

    # --- 5. language pages carry only their own scripts -------------------
    page_lang = re.search(r'<html lang="([^"]+)"', html)
    page_lang = page_lang.group(1) if page_lang else "en"
    if page_lang in LANG_SCRIPTS:
        allowed = LANG_SCRIPTS[page_lang]
        visible = re.sub(r"<script.*?</script>", "", html, flags=re.S)
        stray = {}
        for ch in visible:
            if ord(ch) < 128:
                continue
            sc = script_of(ch)
            if sc not in allowed:
                stray.setdefault(sc, set()).add(ch)
        for sc, chars in stray.items():
            err("%s: contains %s characters (%s). Nobody here reads this page, "
                "so a stray glyph would ship unnoticed."
                % (name, sc, "".join(sorted(chars))[:20]))

        if "lang-governs" not in html:
            err("%s: translated page with no 'English version governs' line. "
                "A translation is a convenience, the English is the instrument." % name)

    # --- 6. schema parses ------------------------------------------------
    for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            json.loads(block)
        except json.JSONDecodeError as e:
            err("%s: JSON-LD does not parse (%s)" % (name, e))

# --- 7. sitemap points at real pages -------------------------------------
for s in sorted(sitemap_slugs):
    if not os.path.exists((s or "index") + ".html"):
        err("sitemap.xml lists /%s which has no page" % s)

# --- 8. no placeholders in anything we ship ------------------------------
shipped = pages + glob("assets/*.js") + glob("api/*.js") + glob("api/_lib/*.js")
for path in shipped:
    body = open(path, encoding="utf-8").read()
    for token in ("WHATSAPP_NUMBER_PLACEHOLDER", "AW-XXXXXXXXX", "YOUR_KEY_HERE"):
        if token in body:
            err("%s: ships the placeholder %s. Resolve it from env instead."
                % (path, token))

# --- 9. server functions at least parse ----------------------------------
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

# --- 10. inline page scripts do not call functions that do not exist ------
# `node --check` above proves the FUNCTIONS parse. It cannot see that a page
# calls a helper nobody defines, because that is a runtime ReferenceError, not
# a syntax error. That gap shipped a real fault: commit 34d7d28 moved the
# WhatsApp number server-side and deleted wireWhatsApp() from assets/site.js,
# leaving three call sites behind in claim.html and verify.html. Each sat on
# the second line of a catch block, so the throw stopped the button ever being
# re-enabled. A client who failed at either step was left with a dead button
# and no way back except reloading the page. Three paying clients hit it in
# August and September 2026.
#
# Deliberately narrow: bare `name(` calls only, in <script> blocks that are
# actually code. Anything reached through a dot, a constructor, or a
# type-carrying block such as application/ld+json is somebody else's problem.
JS_KEYWORDS = set("""if for while switch catch return typeof new delete void do else try
finally function var let const of in instanceof await async yield throw case break
continue default""".split())
JS_GLOBALS = set("""fetch setTimeout setInterval clearTimeout clearInterval
requestAnimationFrame parseInt parseFloat isNaN isFinite encodeURIComponent
decodeURIComponent encodeURI decodeURI alert confirm prompt resolve reject
structuredClone queueMicrotask btoa atob""".split())

# <script> with no src and no type, i.e. the ones the browser runs as script.
INLINE_CODE = re.compile(r"<script(?![^>]*\ssrc=)(?![^>]*\stype=)[^>]*>(.*?)</script>", re.S)


def _strip_js(js):
    """Remove comments and string bodies so prose cannot look like a call.

    A single pass, not a stack of regexes, because the regex version had a real
    bug: it stripped // comments before string bodies, so the // inside
    'https://js.stripe.com/v3/' ate the rest of that line and left a dangling
    quote. The next quote anywhere in the file then paired with it and every
    function definition in between vanished, which made the guard report five
    functions as undefined when all five were defined right there. A guard that
    cries wolf gets switched off, so it walks the source once instead.

    Regex literals are not tracked. A regex containing a quote or a // would
    still confuse this; no page has one, and the failure mode is a false
    positive that a human reads, not a silent pass.
    """
    out = []
    i, n = 0, len(js)
    while i < n:
        c = js[i]
        nxt = js[i + 1] if i + 1 < n else ""
        if c == "/" and nxt == "*":                 # block comment
            end = js.find("*/", i + 2)
            i = n if end == -1 else end + 2
            out.append(" ")
        elif c == "/" and nxt == "/":               # line comment
            end = js.find("\n", i)
            i = n if end == -1 else end
            out.append(" ")
        elif c in "\"'`":                           # string or template body
            quote = c
            i += 1
            while i < n and js[i] != quote:
                i += 2 if js[i] == "\\" else 1
            i += 1
            out.append(quote * 2)
        else:
            out.append(c)
            i += 1
    return "".join(out)


def _declared(js):
    names = set(re.findall(r"function\s+([A-Za-z_$][\w$]*)", js))
    names |= set(re.findall(r"(?:var|let|const)\s+([A-Za-z_$][\w$]*)", js))
    for args in re.findall(r"function\s*[\w$]*\s*\(([^)]*)\)", js):
        names |= {a.strip() for a in args.split(",") if a.strip()}
    return names


_shared_js = ""
for path in glob("assets/*.js"):
    _shared_js += _strip_js(open(path, encoding="utf-8").read())
_shared_names = _declared(_shared_js)

for path in pages:
    blocks = INLINE_CODE.findall(open(path, encoding="utf-8").read())
    if not blocks:
        continue
    body = _strip_js("\n".join(blocks))
    known = _declared(body) | _shared_names | JS_KEYWORDS | JS_GLOBALS
    for name in sorted(set(re.findall(r"(?<![.\w$])([a-z_$][\w$]*)\s*\(", body)) - known):
        err("%s: calls %s() which is not defined in the page or in assets/. "
            "A ReferenceError here stops every line after it in the same block."
            % (path, name))

# --- 11. nothing ships a path that only exists on one machine ------------
# A test that required '/home/user/DASPA/api/stripe-webhook.js' passed locally
# and failed on every CI runner, which is the worst shape of failure: green in
# the place you are looking, red in the place that gates a release. It surfaced
# during a live payment incident, holding up the merge that fixed it.
#
# Node resolves a relative require against the importing file, so there is no
# reason for an absolute path in this repo. Checking the tests as well as the
# shipped code, because the tests are the gate.
MACHINE_PATH = re.compile(r"['\"](?:/home/|/Users/|/root/|[A-Za-z]:\\\\)[^'\"\n]*['\"]")
for path in (glob("api/*.js") + glob("api/_lib/*.js") + glob("assets/*.js")
             + glob("tests/*.mjs") + glob("scripts/*.py")):
    if os.path.abspath(path) == os.path.abspath(__file__):
        continue  # this file names those prefixes on purpose, just above
    for m in MACHINE_PATH.findall(open(path, encoding="utf-8").read()):
        err("%s: contains the machine-specific path %s. Use a path relative to "
            "the file (Node resolves those against the importer), or it will "
            "work here and fail in CI." % (path, m))

# --- report ---------------------------------------------------------------
for w in warnings:
    print("WARN  " + w)
for e in errors:
    print("FAIL  " + e)

print("\n%d pages checked, %d error(s), %d warning(s)"
      % (len(pages), len(errors), len(warnings)))
sys.exit(1 if errors else 0)
