# Self-host Plus Jakarta Sans.
#
# Kit standard "fast by construction": every page made a render-blocking request
# to a third party for its typeface, behind two preconnects.
#
# Plus Jakarta Sans is a VARIABLE font: Google serves one file per unicode subset
# that carries every weight, and the five per-weight URLs in the stylesheet all
# resolve to the same bytes. So this ships two files with a weight RANGE, not ten
# identical copies. latin-ext is needed as well as latin because the country pages
# carry accented copy (Espana, Zurueck, Tornato).
import re, os, glob, hashlib, urllib.request

ROOT = r"C:\dev\daspa-site"
FONTDIR = os.path.join(ROOT, "assets", "fonts")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
CSS_URL = ("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:"
           "wght@400;500;600;700;800&display=swap")
WEIGHT_RANGE = "200 800"   # the family's published variable axis


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=40).read()


for stale in glob.glob(os.path.join(FONTDIR, "plus-jakarta-sans-[0-9]*.woff2")):
    os.remove(stale)

css = get(CSS_URL).decode("utf-8")
blocks = re.findall(r"/\* (\S+) \*/\s*(@font-face \{.*?\})", css, re.S)

faces, seen = [], {}
for subset in ("latin", "latin-ext"):
    block = next(b for s, b in blocks if s == subset)
    url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    rng = re.search(r"unicode-range:\s*([^;]+);", block).group(1).strip()
    data = get(url)
    digest = hashlib.md5(data).hexdigest()[:8]
    name = "plus-jakarta-sans-%s.woff2" % subset
    with open(os.path.join(FONTDIR, name), "wb") as fh:
        fh.write(data)
    print("%-34s %6d bytes  md5:%s" % (name, len(data), digest))
    seen[digest] = seen.get(digest, 0) + 1
    faces.append((name, rng))

assert len(set(seen)) == len(faces), "subsets should differ from each other"

face_css = "".join(
    "@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:%s;"
    "font-display:swap;src:url(/assets/fonts/%s) format('woff2');unicode-range:%s}\n"
    % (WEIGHT_RANGE, n, r) for n, r in faces)

HEAD = ("/* Plus Jakarta Sans, self-hosted. Regenerate with scripts/build-fonts.py.\n"
        "   One variable file per subset carries every weight, so the whole family is\n"
        "   two requests off our own origin instead of a blocking third-party stylesheet. */\n")

CSSFILE = os.path.join(ROOT, "assets", "site.css")
with open(CSSFILE, encoding="utf-8", newline="") as fh:
    site = fh.read()
site = re.sub(r"/\* Plus Jakarta Sans, self-hosted.*?\n(?:@font-face\{.*?\}\n)+", "", site, flags=re.S)
site = HEAD + face_css + site
with open(CSSFILE, "w", encoding="utf-8", newline="") as fh:
    fh.write(site)
print("site.css: %d @font-face rules" % len(faces))

PRELOAD_OLD = ('<link rel="preload" href="/assets/fonts/plus-jakarta-sans-400-latin.woff2" '
               'as="font" type="font/woff2" crossorigin>')
PRELOAD = ('<link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin.woff2" '
           'as="font" type="font/woff2" crossorigin>')
n = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    with open(path, encoding="utf-8", newline="") as fh:
        t = fh.read()
    before = t
    t = t.replace(PRELOAD_OLD, PRELOAD)
    t = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.googleapis\.com">', "", t)
    t = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>', "", t)
    t = re.sub(r'\s*<link href="https://fonts\.googleapis\.com/css2[^"]*" rel="stylesheet">', "", t)
    if PRELOAD not in t:
        t = t.replace('<link rel="stylesheet" href="/assets/site.css">',
                      PRELOAD + '\n<link rel="stylesheet" href="/assets/site.css">', 1)
    if t != before:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(t)
        n += 1
print("pages updated:", n)
