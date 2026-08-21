# Generate the 1200x630 social cards, one per indexable page, and wire the
# og:image / twitter:card tags in.
#
# The site had NO og:image at all, so every share in WhatsApp, Messenger, Slack or
# Reddit rendered as a bare grey link. That matters more here than on most sites:
# the audience is backpackers passing a link round a group chat.
#
# Cards are rendered to static PNGs rather than generated at the edge, because this
# repo is deliberately build-free and dependency-free. Rerun this script when a
# headline changes. The variable TTF is fetched at run time and not committed.
import os, re, glob, io, urllib.request
from PIL import Image, ImageDraw, ImageFont

ROOT = r"C:\dev\daspa-site"
OUT = os.path.join(ROOT, "assets", "og")
UA_OLD = "Mozilla/4.0"   # legacy UA makes Google Fonts serve TTF instead of woff2

NAVY = (20, 22, 74)
NAVY2 = (30, 33, 96)
WHITE = (255, 255, 255)
YELLOW = (250, 229, 65)
ACCENT = (74, 123, 255)
MUTED = (174, 182, 216)

W, H = 1200, 630


def ttf(weight):
    url_css = ("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@%d" % weight)
    req = urllib.request.Request(url_css, headers={"User-Agent": UA_OLD})
    css = urllib.request.urlopen(req, timeout=40).read().decode()
    url = re.search(r"url\((https://[^)]+\.ttf)\)", css).group(1)
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA_OLD}), timeout=40).read()


CACHE = {}
def font(weight, size):
    if weight not in CACHE:
        CACHE[weight] = ttf(weight)
        print("  fetched ttf weight", weight)
    return ImageFont.truetype(io.BytesIO(CACHE[weight]), size)


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(headline, kicker, path):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img)

    # a lighter band behind the lower third, echoing the site's banded sections
    d.rectangle([0, 430, W, H], fill=NAVY2)
    # yellow rule as the brand's one bright mark
    d.rectangle([72, 92, 72 + 64, 92 + 6], fill=YELLOW)

    # wordmark
    f_logo = font(800, 40)
    x = 72
    d.text((x, 128), "DASP", font=f_logo, fill=WHITE)
    x += d.textlength("DASP", font=f_logo)
    d.text((x, 128), "A", font=f_logo, fill=ACCENT)
    x += d.textlength("A", font=f_logo)
    d.text((x, 128), ".", font=f_logo, fill=YELLOW)

    # headline, shrinking until it fits four lines
    for size in (66, 60, 54, 48, 44):
        f_h = font(800, size)
        lines = wrap(d, headline, f_h, W - 144)
        if len(lines) <= 4:
            break
    y = 214
    for ln in lines[:4]:
        d.text((72, y), ln, font=f_h, fill=WHITE)
        y += int(size * 1.16)

    # kicker inside the band
    f_k = font(500, 27)
    d.text((72, 474), kicker, font=f_k, fill=MUTED)

    # trust line
    f_t = font(700, 25)
    d.text((72, 528), "Registered Tax Agent 26076969", font=f_t, fill=WHITE)
    f_u = font(600, 25)
    url = "daspa.com.au"
    d.text((W - 72 - d.textlength(url, font=f_u), 528), url, font=f_u, fill=YELLOW)

    # flat colour and text, so a 128-colour palette is indistinguishable and
    # about 60% smaller than truecolour
    img = img.quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE)
    img.save(path, "PNG", optimize=True)
    return os.path.getsize(path)


# slug -> (headline on the card, kicker line)
CARDS = {
 "index": ("Left Australia? Your super can come with you.", "Every fund, plus ATO-held super. Flat fee, no super no fee."),
 "dasp-calculator": ("What will you actually get back?", "Payout calculator, balance estimator and the six-month deadline check."),
 "dasp-online-application": ("Apply for your DASP online in five minutes", "Two ways to lodge, compared honestly. No paper forms."),
 "claim-super-leaving-australia": ("How to claim your super when leaving Australia", "The 2026 guide: eligibility, rates, timing and claiming from abroad."),
 "how-much-is-super-taxed-when-leaving-australia": ("How much is super taxed when you leave?", "The 2026 rate table, worked in dollars, and the trap that raises it."),
 "dasp-processing-time": ("How long does a DASP actually take?", "What starts the clock, what stalls it, and how to chase a slow claim."),
 "can-i-claim-tax-back-on-super-withdrawal": ("Can you claim the tax back on your super?", "The one narrow exception, and the refund most people miss."),
 "can-i-claim-my-super-myself-for-free": ("Yes, you can do this yourself for free.", "The ATO route step by step, and where DIY claims come unstuck."),
 "dasp-nat-7204-application-form": ("The DASP application form, as a fillable PDF", "Our version of NAT 7204. Fill it in, send it back, we lodge it."),
 "faq": ("Straight answers about claiming your super", "Tax, timing, lost funds, overseas payments and the free ATO option."),
 "pricing": ("One flat fee. Never a percentage.", "$149 + GST covers every fund. No super recovered, no fee."),
 "visas": ("Which visa were you on?", "417, 462, 482, 500 and the rest. Your subclass sets your tax rate."),
 "claim-super-from": ("Claiming your Australian super from overseas", "You do not need to go back, and you do not need an Australian bank."),
 "brazil": ("Claim your Australian super from Brazil", "Studied here on a 500? You pay the lower rate, not the backpacker one."),
 "uk": ("Claim your Australian super from the UK", "Paid to a UK account. Flat fee $149 + GST, every fund included."),
 "ireland": ("Claim your Australian super from Ireland", "Several jobs usually means several funds. We find all of them."),
 "germany": ("Claim your Australian super from Germany", "Paid to a German account, paperwork handled in English."),
 "france": ("Claim your Australian super from France", "No notaire, no consulate queue. A passport and a selfie."),
 "italy": ("Claim your Australian super from Italy", "No notaio, no queue. The whole claim runs from your phone."),
 "spain": ("Claim your Australian super from Spain", "417 or 462, the super side is identical. Paid to a Spanish bank."),
 "philippines": ("Claim your Australian super from the Philippines", "Sponsored and student visas usually pay the lower rate."),
 "visa-417": ("Claim your super after a 417 working holiday", "What backpackers have waiting, and an honest word on the rate."),
 "visa-462": ("Claim your super after a 462 work and holiday", "Same rules as the 417, and the same money left behind."),
 "visa-482": ("Claim your super after a 482 skilled visa", "The largest balances, and the most to lose by waiting."),
 "visa-500": ("Claim your super after a student visa", "Part-time job super that students never knew they had."),
 "privacy": ("Privacy Policy", "How we handle your information, including your TFN."),
 "terms": ("Terms of Service", "What we do, what we do not, fees, refunds and timing."),
 "tpb": ("Tax Agent Services disclosures", "Our registration, your rights, and how to complain."),
}

os.makedirs(OUT, exist_ok=True)
total = 0
for slug, (headline, kicker) in sorted(CARDS.items()):
    path = os.path.join(OUT, slug + ".png")
    size = card(headline, kicker, path)
    total += size
    print("%-48s %6d bytes" % (slug + ".png", size))
print("total %d cards, %.0f KB" % (len(CARDS), total / 1024))

# ---- wire the tags in -------------------------------------------------------
TW = '<meta name="twitter:card" content="summary_large_image">'
n = 0
for slug in CARDS:
    path = os.path.join(ROOT, ("index" if slug == "index" else slug) + ".html")
    with open(path, encoding="utf-8", newline="") as fh:
        t = fh.read()
    before = t
    img = "https://daspa.com.au/assets/og/%s.png" % slug
    tags = ('<meta property="og:image" content="%s">\n'
            '<meta property="og:image:width" content="1200">\n'
            '<meta property="og:image:height" content="630">\n'
            '<meta property="og:site_name" content="DASPA">\n'
            '%s\n<meta name="twitter:image" content="%s">' % (img, TW, img))
    t = re.sub(r'\n<meta property="og:image".*?<meta name="twitter:image"[^>]*>', "", t, flags=re.S)
    m = re.search(r'<meta property="og:url" content="[^"]*">', t)
    t = t[:m.end()] + "\n" + tags + t[m.end():]
    if t != before:
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(t)
        n += 1
print("og tags wired into", n, "pages")
