#!/usr/bin/env python3
"""Render SEO-KIT.md to SEO-KIT.pdf.

Run: python scripts/build-seo-kit-pdf.py

WHY A PDF. The kit is dropped into four repositories and read by people who are
not in a terminal, and a PDF is the format that survives being emailed, printed
and annotated. The Markdown remains the source of truth: SEO-KIT.md is what
Claude Code and every other tool reads, this only renders it. Never edit the
PDF. Regenerate it.

HOW. Headless Chromium prints the page, so what you get is exactly what the
browser lays out. No external requests: fonts are system stacks and styles are
inline, because a PDF that depends on the network renders differently depending
on when you built it.

WHAT IT DOES NOT DO. It does not check that anything in the kit is still true.
Every figure in the document is stamped with the date it was pulled, and this
script will happily render figures that went stale a year ago.
"""
import os
import re
import subprocess
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

SRC = "SEO-KIT.md"
OUT = "SEO-KIT.pdf"

# Playwright's bundled build and the image's pre-installed build drift apart, so
# find whatever Chromium is actually on disk rather than trusting the pin.
def chromium():
    env = os.environ.get("CHROMIUM_PATH")
    if env and os.path.exists(env):
        return env
    base = os.environ.get("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    found = []
    for root, _dirs, files in os.walk(base):
        for name in ("chrome", "chrome-headless-shell", "headless_shell"):
            if name in files and os.access(os.path.join(root, name), os.X_OK):
                found.append(os.path.join(root, name))
    for path in ("/usr/bin/chromium", "/usr/bin/google-chrome"):
        if os.path.exists(path):
            found.append(path)
    if not found:
        sys.exit(
            "No Chromium found. Set CHROMIUM_PATH, or install one. Do not run "
            "`playwright install` in the Claude Code cloud image, it ships a "
            "browser already."
        )
    # Prefer the full browser over the headless shell: the shell cannot print
    # backgrounds, which is most of the styling below.
    found.sort(key=lambda p: ("headless" in p, len(p)))
    return found[0]


CSS = """
@page { size: A4; margin: 17mm 15mm 18mm 15mm; }
* { box-sizing: border-box; }
body {
  font: 10.2pt/1.52 "Charter","Bitstream Charter","Georgia","Times New Roman",serif;
  color: #16181d; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
h1, h2, h3, h4 {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.2; color: #0d1b3e; margin: 0 0 .4em;
}
h1 { font-size: 21pt; letter-spacing: -.01em; }
h2 {
  font-size: 14.5pt; margin-top: 1.9em; padding-top: .5em;
  border-top: 2.5px solid #0d1b3e; break-after: avoid;
}
h2:first-of-type { margin-top: 0; }
h3 { font-size: 11.6pt; margin-top: 1.5em; color: #1c3f86; break-after: avoid; }
h4 { font-size: 10.4pt; margin-top: 1.2em; break-after: avoid; }
p, li { orphans: 3; widows: 3; }
p { margin: 0 0 .65em; }
ul, ol { margin: 0 0 .75em; padding-left: 1.25em; }
li { margin-bottom: .22em; }
strong { color: #0d1b3e; }
a { color: #1c3f86; text-decoration: none; }
code {
  font: 8.9pt/1.4 "SF Mono", Menlo, Consolas, monospace;
  background: #eef0f5; padding: .1em .35em; border-radius: 3px; color: #27324a;
}
blockquote {
  margin: .9em 0; padding: .7em .95em; background: #fbf6e6;
  border-left: 3.5px solid #e0b100; break-inside: avoid;
}
blockquote p:last-child { margin-bottom: 0; }
table {
  border-collapse: collapse; width: 100%; margin: .85em 0;
  font-size: 9.1pt; break-inside: avoid;
}
th, td { border: 1px solid #ccd2e0; padding: 4.5px 7px; text-align: left; vertical-align: top; }
th { background: #0d1b3e; color: #fff; font-family: Helvetica, Arial, sans-serif; font-size: 8.7pt; }
tbody tr:nth-child(even) { background: #f5f7fb; }
hr { border: 0; border-top: 1px solid #dfe3ec; margin: 1.6em 0; }
/* GitHub-style task list checkboxes, rendered as glyphs for print */
li.task { list-style: none; margin-left: -1.05em; }
li.task::before { font-family: Helvetica, Arial, sans-serif; margin-right: .45em; }
li.task-open::before { content: "\\2610"; color: #7a8299; }
li.task-done::before { content: "\\2611"; color: #1a7f45; }
li.task-done { color: #5c6478; }

.cover { height: 252mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
.cover .eyebrow { font-family: Helvetica, Arial, sans-serif; font-size: 9.5pt;
  letter-spacing: .17em; text-transform: uppercase; color: #8a91a6; margin-bottom: 1.1em; }
.cover h1 { font-size: 33pt; line-height: 1.08; margin-bottom: .45em; }
.cover .rule { width: 62px; height: 4px; background: #e0b100; margin: 1.1em 0 1.5em; }
.cover .sites { font-family: Helvetica, Arial, sans-serif; font-size: 11.5pt;
  color: #1c3f86; line-height: 1.85; }
.cover .meta { margin-top: auto; font-size: 8.8pt; color: #6b7386;
  border-top: 1px solid #dfe3ec; padding-top: .9em; }
.toc { break-after: page; }
.toc h2 { border-top: none; margin-top: 0; }
.toc ol { list-style: none; padding: 0; font-family: Helvetica, Arial, sans-serif; font-size: 10pt; }
.toc li { padding: .34em 0; border-bottom: 1px dotted #d8dde8; }
.toc .sub { padding-left: 1.5em; font-size: 9pt; color: #5c6478; border-bottom: none; }
"""

FOOTER = """
<div style="width:100%;font:7.5pt Helvetica,Arial,sans-serif;color:#8a91a6;
     padding:0 15mm;display:flex;justify-content:space-between;">
  <span>The Online Services SEO Kit &middot; LINK</span>
  <span class="pageNumber"></span>
</div>"""


def to_html(md_text):
    import markdown

    body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )
    # Task-list checkboxes: python-markdown leaves the literal "[ ]" in place.
    body = re.sub(r"<li>\[x\]\s*", '<li class="task task-done">', body)
    body = re.sub(r"<li>\[ \]\s*", '<li class="task task-open">', body)
    return body


def cover_and_toc(md_text, body_html):
    version = "1.0"
    m = re.search(r"^Version\s+([\d.]+)", md_text, re.M)
    if m:
        version = m.group(1)
    parts = re.findall(r"^## (Part \d+ — [^\n]+|Open items)$", md_text, re.M)
    items = "\n".join(f"<li>{p}</li>" for p in parts)
    cover = f"""
<div class="cover">
  <div class="eyebrow">LINK &middot; Online Services</div>
  <h1>The Online&nbsp;Services<br>SEO Kit</h1>
  <div class="rule"></div>
  <div class="sites">
    daspa.com.au<br>abnassist.com.au<br>gstregister.com.au<br>cgtclearance.com.au
  </div>
  <div class="meta">
    Version {version} &middot; rendered {date.today():%-d %B %Y} &middot;
    source of truth is <code>SEO-KIT.md</code>, not this PDF.<br>
    Every figure is stamped with the date it was pulled. Re-check before relying on one.
  </div>
</div>
<div class="toc">
  <h2>Contents</h2>
  <ol>{items}</ol>
</div>
"""
    return cover + body_html


def main():
    if not os.path.exists(SRC):
        sys.exit(f"{SRC} not found. Run this from a repo that carries the kit.")
    md_text = open(SRC, encoding="utf-8").read()
    html = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        "<title>The Online Services SEO Kit</title>"
        f"<style>{CSS}</style></head><body>"
        + cover_and_toc(md_text, to_html(md_text))
        + "</body></html>"
    )
    tmp = os.path.join(os.environ.get("TMPDIR", "/tmp"), "seo-kit-render.html")
    with open(tmp, "w", encoding="utf-8") as fh:
        fh.write(html)

    from playwright.sync_api import sync_playwright

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            executable_path=chromium(), args=["--no-sandbox"]
        )
        page = browser.new_page()
        page.goto("file://" + tmp, wait_until="load")
        page.pdf(
            path=OUT,
            format="A4",
            print_background=True,
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=FOOTER,
            margin={"top": "17mm", "bottom": "18mm", "left": "15mm", "right": "15mm"},
        )
        browser.close()

    size = os.path.getsize(OUT)
    pages = len(re.findall(rb"/Type\s*/Page[^s]", open(OUT, "rb").read()))
    print(f"{OUT}: {pages} pages, {size/1024:.0f} KB, from {len(md_text.splitlines())} lines of {SRC}")
    if pages < 10:
        sys.exit("suspiciously short; the render probably failed")


if __name__ == "__main__":
    main()
