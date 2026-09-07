# Generate the DASPA logo assets from the site's own type and tokens.
#
# The wordmark only ever existed as CSS (`a.logo` in assets/site.css: Plus Jakarta
# Sans 700, .04em tracking, white DASP / #4A7BFF A / #fae541 dot), so there was no
# file to hand anyone who needed the logo outside the site. This renders that exact
# lockup to SVG (outlines, so no font dependency) and PNG.
#
# Rerun after changing the logo tokens in assets/site.css:
#   pip install fonttools brotli pillow && python3 scripts/build-logo.py
import io, os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "fonts", "plus-jakarta-sans-latin.woff2")
OUT = os.path.join(ROOT, "assets", "logo")

# Tokens lifted from :root in assets/site.css
NAVY = "#14164A"
WHITE = "#ffffff"
ACCENT = "#4A7BFF"       # logo A on navy
BLUE = "#3844CA"         # brand blue, the A on light backgrounds
YELLOW = "#fae541"       # logo dot
GOLD = "#eed935"         # --ybord, the dot on light backgrounds
MUTED_DARK = "#aeb6d8"   # tagline on navy
MUTED_LIGHT = "#5a6480"  # tagline on white

F = 100.0                # wordmark type size in SVG user units
TRACK = 0.04             # .logo letter-spacing
TAG_SIZE = 9.5 / 24 * F  # .logo small font-size, relative to the 24px logo
TAG_TRACK = 0.14
TAG_GAP = 0.155 * F      # optical gap under the wordmark baseline
PAD = 0.16 * F           # clear space around the lockup

TAGLINE = "GET YOUR SUPER BACK"


def instance(weight):
    """Static TTF at one weight, as a parsed font and as bytes for PIL."""
    ttf = instancer.instantiateVariableFont(TTFont(SRC), {"wght": weight}, inplace=False)
    buf = io.BytesIO()
    ttf.save(buf)
    return TTFont(io.BytesIO(buf.getvalue())), buf.getvalue()


BOLD, BOLD_BYTES = instance(700)
MED, MED_BYTES = instance(500)
UPEM = BOLD["head"].unitsPerEm
CAP = BOLD["OS/2"].sCapHeight / UPEM
TAG_CAP = MED["OS/2"].sCapHeight / UPEM


def layout(font, text, size, track):
    """[(char, glyph, x)] pen positions plus the run's advance, in SVG units."""
    cmap, hmtx = font.getBestCmap(), font["hmtx"]
    x, out = 0.0, []
    for ch in text:
        g = cmap[ord(ch)]
        out.append((ch, g, x))
        x += hmtx[g][0] / UPEM * size + track * size
    return out, x - track * size  # trim the trailing tracking


def paths(font, text, size, track, x0, baseline, colour):
    gs = font.getGlyphSet()
    s, frags = size / UPEM, []
    for _, g, dx in layout(font, text, size, track)[0]:
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}")
        gs[g].draw(pen)
        d = pen.getCommands()
        if d:
            frags.append(
                f'<path fill="{colour}" transform="translate({x0 + dx:.2f} {baseline:.2f}) '
                f'scale({s:.5f} {-s:.5f})" d="{d}"/>'
            )
    return frags


def runs(dasp, a, dot):
    return [("DASP", dasp), ("A", a), (".", dot)]


def wordmark(dasp, a, dot, tag_colour=None):
    """The lockup as an SVG string, plus its width and height in user units."""
    x, frags = PAD, []
    baseline = PAD + CAP * F
    for text, colour in runs(dasp, a, dot):
        frags += paths(BOLD, text, F, TRACK, x, baseline, colour)
        x += layout(BOLD, text, F, TRACK)[1] + TRACK * F
    width, height = x - TRACK * F - PAD, CAP * F
    if tag_colour:
        tag_base = baseline + TAG_GAP + TAG_CAP * TAG_SIZE
        frags += paths(MED, TAGLINE, TAG_SIZE, TAG_TRACK, PAD, tag_base, tag_colour)
        width = max(width, layout(MED, TAGLINE, TAG_SIZE, TAG_TRACK)[1])
        height = tag_base - PAD
    w, h = width + 2 * PAD, height + 2 * PAD
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
        f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="DASPA">'
        f"<title>DASPA</title>" + "".join(frags) + "</svg>"
    ), w, h


def icon():
    """Rounded-square app mark: navy tile, yellow D, as the site favicon has it."""
    S, size = 512.0, 512.0 * 0.62
    adv = layout(BOLD, "D", size, 0)[1]
    baseline = S / 2 + CAP * size / 2
    frags = paths(BOLD, "D", size, 0, (S - adv) / 2, baseline, YELLOW)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" '
        f'height="512" role="img" aria-label="DASPA"><title>DASPA</title>'
        f'<rect width="512" height="512" rx="{S * 0.22:.0f}" fill="{NAVY}"/>'
        + "".join(frags) + "</svg>"
    )


def png_wordmark(path, dasp, a, dot, tag_colour, target_w):
    """Same layout drawn with PIL — the repo has no SVG rasteriser."""
    _, w, h = wordmark(dasp, a, dot, tag_colour)
    k = target_w / w
    img = Image.new("RGBA", (round(w * k), round(h * k)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    fb = ImageFont.truetype(io.BytesIO(BOLD_BYTES), round(F * k))
    fm = ImageFont.truetype(io.BytesIO(MED_BYTES), round(TAG_SIZE * k))
    baseline, x = (PAD + CAP * F) * k, PAD * k
    for text, colour in runs(dasp, a, dot):
        glyphs, adv = layout(BOLD, text, F * k, TRACK)
        for ch, _, dx in glyphs:
            d.text((x + dx, baseline), ch, font=fb, fill=colour, anchor="ls")
        x += adv + TRACK * F * k
    if tag_colour:
        tb = baseline + (TAG_GAP + TAG_CAP * TAG_SIZE) * k
        for ch, _, dx in layout(MED, TAGLINE, TAG_SIZE * k, TAG_TRACK)[0]:
            d.text((PAD * k + dx, tb), ch, font=fm, fill=tag_colour, anchor="ls")
    img.save(path)


def png_icon(path, px):
    img = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, px - 1, px - 1], radius=round(px * 0.22), fill=NAVY)
    size = px * 0.62
    f = ImageFont.truetype(io.BytesIO(BOLD_BYTES), round(size))
    d.text((px / 2, px / 2 + CAP * size / 2), "D", font=f, fill=YELLOW, anchor="ms")
    img.save(path)


def write(name, s):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(s)
    print("  ", name)


os.makedirs(OUT, exist_ok=True)
write("daspa-logo-on-dark.svg", wordmark(WHITE, ACCENT, YELLOW)[0])
write("daspa-logo-on-dark-tagline.svg", wordmark(WHITE, ACCENT, YELLOW, MUTED_DARK)[0])
write("daspa-logo-on-light.svg", wordmark(NAVY, BLUE, GOLD)[0])
write("daspa-logo-on-light-tagline.svg", wordmark(NAVY, BLUE, GOLD, MUTED_LIGHT)[0])
write("daspa-logo-mono-white.svg", wordmark(WHITE, WHITE, WHITE)[0])
write("daspa-logo-mono-navy.svg", wordmark(NAVY, NAVY, NAVY)[0])
write("daspa-icon.svg", icon())

for w in (800, 1600):
    png_wordmark(os.path.join(OUT, f"daspa-logo-on-dark-{w}.png"), WHITE, ACCENT, YELLOW, None, w)
    png_wordmark(os.path.join(OUT, f"daspa-logo-on-light-{w}.png"), NAVY, BLUE, GOLD, None, w)
    print("   daspa-logo-on-{dark,light}-%d.png" % w)
png_wordmark(os.path.join(OUT, "daspa-logo-on-dark-tagline-1600.png"), WHITE, ACCENT, YELLOW, MUTED_DARK, 1600)
png_wordmark(os.path.join(OUT, "daspa-logo-on-light-tagline-1600.png"), NAVY, BLUE, GOLD, MUTED_LIGHT, 1600)
print("   daspa-logo-on-{dark,light}-tagline-1600.png")
for px in (512, 180):
    png_icon(os.path.join(OUT, f"daspa-icon-{px}.png"), px)
    print("   daspa-icon-%d.png" % px)
