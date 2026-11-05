/* Measure the layout in a real browser (kit rule 17: do not guess, do not trust
 * the stylesheet). Ported from abnassist-site/scripts/measure-layout.mjs and
 * widened for this site, where most running text sits OUTSIDE .prose: feature
 * cards, the three steps, FAQ answers, band subs. The ABN version judges only
 * .prose, which here would pass a page whose FAQ answers run 140 characters a
 * line. So this one reads every paragraph and list item in the page body and
 * reports both the median and the WORST, naming the worst by selector so it can
 * be fixed rather than merely counted.
 *
 *   overflow   document wider than the viewport (horizontal scroll)
 *   shell      header content width as a share of the window
 *   cpl        median characters per line of body text (blocks of 2+ lines)
 *   worst      the longest-measure block on the page, with where it lives
 *
 * Run:   node scripts/measure-layout.mjs [page,page,...]   (default: every page)
 * Exit:  non-zero if any page overflows at any width, or any body block runs
 *        over 90 characters a line at 1280 and wider. 80 is the kit's ceiling
 *        for prose; 90 allows for short-line UI text without hiding a real
 *        fault.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = 8198;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  let f = path.join(ROOT, p);
  if (!path.extname(f)) f += '.html';
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(PORT);

const all = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''));
const pages = process.argv[2] ? process.argv[2].split(',') : all;
const WIDTHS = (process.env.WIDTHS || '375,1280,1440,1920').split(',').map(Number);
const CEILING = 90;

const browser = await chromium.launch();
let bad = 0;
const worstSeen = [];
for (const page of pages) {
  const rows = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const pg = await ctx.newPage();
    await pg.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    await pg.goto(`http://localhost:${PORT}/${page === 'index' ? '' : page}`, { waitUntil: 'load' });
    const m = await pg.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const out = { overflow: document.documentElement.scrollWidth - W };
      const hw = document.querySelector('header .wrap');
      if (hw) {
        const cs = getComputedStyle(hw);
        out.shell = Math.round(100 * (hw.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / W);
      }
      const where = (el) => {
        const sec = el.closest('section');
        const id = sec && sec.id ? '#' + sec.id : (sec ? 'section.' + [...sec.classList].join('.') : 'body');
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '';
        const par = el.parentElement && el.parentElement.className ? '.' + String(el.parentElement.className).trim().split(/\s+/)[0] : '';
        return `${id} ${par} > ${el.tagName.toLowerCase()}${cls}`.replace(/\s+/g, ' ');
      };
      const cpl = [];
      let worst = { cpl: 0, at: '' };
      for (const p of document.querySelectorAll('p, li, dd')) {
        if (p.closest('details:not([open]), header, nav, footer, form, .quiz, table')) continue;
        const r = p.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const cs = getComputedStyle(p);
        const lh = parseFloat(cs.lineHeight) || 1.6 * parseFloat(cs.fontSize);
        const lines = Math.round(r.height / lh);
        const n = p.textContent.replace(/\s+/g, ' ').trim().length;
        if (lines < 2) continue;
        const c = n / lines;
        cpl.push(c);
        if (c > worst.cpl) worst = { cpl: Math.round(c), at: where(p) };
      }
      cpl.sort((a, b) => a - b);
      out.cpl = cpl.length ? Math.round(cpl[Math.floor(cpl.length / 2)]) : null;
      out.worst = worst;
      return out;
    });
    const flags = [];
    if (m.overflow > 0) { flags.push('OVERFLOW'); bad++; }
    if (w >= 1280 && m.worst.cpl > CEILING) { flags.push('CPL'); bad++; worstSeen.push({ page, w, ...m.worst }); }
    rows.push(`  ${String(w).padStart(4)}  overflow ${m.overflow}  shell ${m.shell}%  cpl ${m.cpl}  worst ${m.worst.cpl}` +
      `${flags.length ? '  <- ' + flags.join(',') + '  ' + m.worst.at : ''}`);
    await ctx.close();
  }
  if (process.env.VERBOSE || rows.some((r) => r.includes('<-'))) console.log(`\n${page}\n${rows.join('\n')}`);
}
await browser.close();
server.close();

console.log(`\n${pages.length} pages at ${WIDTHS.join(', ')}: ${bad ? bad + ' problem(s)' : 'clean'}`);
if (worstSeen.length) {
  const byAt = {};
  for (const x of worstSeen) (byAt[x.at] ||= []).push(`${x.page}@${x.w}:${x.cpl}`);
  console.log('\nlongest measures, grouped by where they live:');
  for (const [at, hits] of Object.entries(byAt).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${hits.length.toString().padStart(3)}x  ${at}\n        ${hits.slice(0, 4).join('  ')}${hits.length > 4 ? '  ...' : ''}`);
  }
}
process.exit(bad ? 1 : 0);
