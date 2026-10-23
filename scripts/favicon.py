"""Generates the favicon set: favicon.ico, favicon.svg, favicon-192.png and
apple-touch-icon.png.

Replaces the inline data: URI the site shipped with. Google does not fetch a
data: URI favicon, so the site had no icon in search results at all, which is
the one place a favicon earns anything. The files are small and static, so they
are generated once and committed rather than built at deploy.

  python scripts/favicon.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

NAVY = (9, 31, 91)        # --navy  #091F5B
YELLOW = (252, 200, 0)    # --yellow #FCC800
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FONTS = r"C:\Windows\Fonts"


def font_at(size):
    for n in ("segoeuib.ttf", "arialbd.ttf", "arial.ttf"):
        p = os.path.join(FONTS, n)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def tile(px, radius_ratio=0.22, letter="D"):
    """A navy rounded square with a yellow D, drawn at 4x and downsampled so the
    curve and the glyph stay clean at 16px."""
    s = px * 4
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * radius_ratio), fill=NAVY)

    f = font_at(int(s * 0.62))
    l, t, r, b = d.textbbox((0, 0), letter, font=f)
    # centre on the glyph's ink, not on its advance box, or it sits low and left
    d.text(((s - (r - l)) / 2 - l, (s - (b - t)) / 2 - t), letter, font=f, fill=YELLOW)

    return img.resize((px, px), Image.LANCZOS)


out = []

ico = os.path.join(ROOT, "favicon.ico")
# 16 and 32 are what a browser tab actually uses; 48 is what Google's crawler wants
tile(48).save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
out.append(ico)

for name, px in (("favicon-192.png", 192), ("apple-touch-icon.png", 180)):
    p = os.path.join(ROOT, name)
    img = tile(px)
    if name == "apple-touch-icon.png":
        # iOS masks its own corners and composites on white, so give it a square
        # with no alpha rather than letting it round an already-rounded tile
        flat = Image.new("RGB", (px, px), NAVY)
        flat.paste(tile(px, radius_ratio=0), (0, 0), tile(px, radius_ratio=0))
        img = flat
    img.save(p)
    out.append(p)

svg = os.path.join(ROOT, "favicon.svg")
with open(svg, "w", encoding="utf-8") as fh:
    fh.write(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        '<rect width="64" height="64" rx="14" fill="#091F5B"/>'
        '<text x="32" y="45" font-family="Arial,Helvetica,sans-serif" font-size="38"'
        ' font-weight="bold" fill="#FCC800" text-anchor="middle">D</text>'
        "</svg>\n"
    )
out.append(svg)

for p in out:
    print(f"  {os.path.relpath(p, ROOT):<24} {os.path.getsize(p):>6} bytes")
