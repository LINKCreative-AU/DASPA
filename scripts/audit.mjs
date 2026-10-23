import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const errs = [], warns = [];

// Must stay byte-identical to the decode() in gen-schema.mjs — the FAQ
// drift check compares this function's output against that one's.
const stripSrc = s => s.replace(/<div class="src"[\s\S]*?<\/div>\s*$/, '');
const decode = s => s.replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).trim();

for (const f of files) {
  const h = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const E = m => errs.push(`${f}: ${m}`);
  const W = m => warns.push(`${f}: ${m}`);

  const noindex = /<meta name="robots" content="noindex/.test(h);

  // --- JSON-LD parses, and FAQ text matches the visible <details> exactly
  const blocks = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  if (blocks.length > 1) E(`${blocks.length} ld+json blocks (want 1)`);
  if (!blocks.length && !noindex) E('no JSON-LD');

  for (const b of blocks) {
    const json = b.replace(/<\/?script[^>]*>/g, '');
    let data;
    try { data = JSON.parse(json); } catch (e) { E(`JSON-LD invalid: ${e.message}`); continue; }
    const graph = data['@graph'] || [];
    if (!graph.length) E('no @graph');

    const faqNode = graph.find(n => n['@type'] === 'FAQPage');
    const visible = [];
    const re = /<details[^>]*><summary[^>]*>([\s\S]*?)<\/summary><div[^>]*>([\s\S]*?)<\/div><\/details>/g;
    let m;
    while ((m = re.exec(h))) visible.push([decode(m[1]), decode(stripSrc(m[2])).replace(/\s+/g, ' ')]);

    if (visible.length && !faqNode) E(`${visible.length} <details> but no FAQPage`);
    if (faqNode) {
      const s = faqNode.mainEntity.map(q => [q.name, q.acceptedAnswer.text]);
      if (s.length !== visible.length) E(`FAQ count schema ${s.length} vs visible ${visible.length}`);
      for (let i = 0; i < Math.min(s.length, visible.length); i++) {
        if (s[i][0] !== visible[i][0]) E(`FAQ Q${i + 1} drift:\n    schema : ${s[i][0]}\n    visible: ${visible[i][0]}`);
        if (s[i][1] !== visible[i][1]) E(`FAQ A${i + 1} drift:\n    schema : ${s[i][1].slice(0, 90)}\n    visible: ${visible[i][1].slice(0, 90)}`);
      }
    }
  }

  // --- head hygiene
  const title = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const desc = (h.match(/<meta name="description" content="([\s\S]*?)">/) || [])[1] || '';
  const ogT = (h.match(/<meta property="og:title" content="([\s\S]*?)">/) || [])[1];
  const ogD = (h.match(/<meta property="og:description" content="([\s\S]*?)">/) || [])[1];
  /* DASPA strips the " | DASPA" brand suffix from og:title, on all 47 pages.
     That is a convention rather than drift: the social card already shows the
     domain, so repeating the brand wastes the line. The guard still has to
     catch real drift, so it accepts the title or the title minus the suffix,
     and nothing else. */
  const BRAND = ' | DASPA';
  const titleNoBrand = title.endsWith(BRAND) ? title.slice(0, -BRAND.length) : title;
  if (ogT !== title && ogT !== titleNoBrand) E('og:title is neither <title> nor <title> minus the brand suffix');
  if (ogD !== desc) E('og:description !== meta description');
  if (/[<>]/.test(ogT || '') || /[<>]/.test(ogD || '')) E('tag injected into og: attribute');
  if ((h.match(/<link rel="canonical"/g) || []).length !== 1) E('canonical count != 1');
  if (!/<link rel="icon" href="\/favicon\.ico"/.test(h)) E('no favicon.ico link');
  if (/rel="icon" href="data:/.test(h)) E('favicon is an inline data: URI, which Google cannot fetch');
  if (!/og:image/.test(h)) E('no og:image');
  if (!/twitter:card/.test(h)) E('no twitter:card');
  // Fonts are self-hosted. The preload is what makes that fast: without it the
  // font is only discovered once site.css has been fetched and parsed, which is
  // the request chain self-hosting was meant to remove. Catch a page that loses
  // it, and catch any page that drifts back to Google's CDN.
  if (!/rel="preload"[^>]*plus-jakarta-sans-latin\.woff2/.test(h)) E('font preload missing');
  if (/fonts\.(googleapis|gstatic)\.com/.test(h)) E('still loading fonts from Google');
  // measure what renders, not the source — &#8217; is 7 source chars but 1 glyph
  const titleLen = decode(title).length, descLen = decode(desc).length;
  if (!noindex && titleLen > 70) W(`title ${titleLen} chars`);
  if (!noindex && (descLen < 120 || descLen > 200)) W(`meta description ${descLen} chars`);

  // --- content hygiene
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => decode(m[1]));
  if (h1s.length !== 1) E(`${h1s.length} H1`);
  // Legal pages legitimately run short ("Privacy Policy."); the importer damage
  // this catches was one-word H1s on indexable content pages.
  else if (!noindex && h1s[0].split(/\s+/).length < 3) E(`H1 truncated: "${h1s[0]}"`);

  if (/Posts navigation|Recent Posts|Powered by/.test(h)) E('WordPress carcass in body');
  if (/&amp;(hellip|nbsp|amp|#\d+);/.test(h)) E('double-escaped entity');
  if (/wpstaq|squarespace-cdn/.test(h)) E('old CDN reference');

  const imgs = [...h.matchAll(/<img\b[^>]*>/g)];
  imgs.forEach((im, i) => {
    if (!/\balt=/.test(im[0])) E(`img ${i + 1} missing alt`);
    if (i > 0 && !/loading="lazy"/.test(im[0])) W(`img ${i + 1} below fold not lazy`);
  });
}

console.log(errs.length ? '### ERRORS\n' + errs.join('\n') : '### no errors');
console.log('\n### WARNINGS (' + warns.length + ')\n' + warns.join('\n'));
