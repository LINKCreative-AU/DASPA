/* Rebuilds the FAQPage node on every page from that page's own visible
   <details>, and leaves every other schema node exactly as it was.

   Why this rather than the full gen-schema.mjs that abnassist runs: the other
   nodes here are right. 26 pages already carry a correct BreadcrumbList,
   Organization and Service, and regenerating those from a hand-written
   47-entry map would risk changing things that are not broken in order to fix
   one thing that is.

   What is broken is the FAQ text. On 23 October 2026 the audit found 29 entries
   across four pages where the schema says one thing and the page displays
   another. The homepage had 17 of its 18 adrift, including:

     schema: "Can I claim my super back myself for free?"
     page:   "Can I do this myself for free?"

   Someone edited the visible copy and the schema never followed, which is the
   failure mode this script exists to end. Google's FAQPage guidance is that the
   schema has to match what the reader sees, so drift costs rich-result
   eligibility at best.

   Generating the node from the markup makes the two byte-identical by
   construction. Edit the <details>, run this, commit. Never hand-edit a
   FAQPage block.

   Run: node scripts/sync-faq-schema.mjs            (writes)
        node scripts/sync-faq-schema.mjs --check    (exits 1 if any page differs)
*/
import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

/* Must stay byte-identical to the decode() in scripts/audit.mjs: the audit
   compares that function's output against this one's, so any divergence shows
   up as drift that neither tool can resolve. */
const decode = s => s.replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).trim();

// The source line under an answer is attribution furniture, not the answer.
const stripSrc = s => s.replace(/<div class="src">[\s\S]*?<\/div>/g, '');

// Whitespace-tolerant: DASPA pretty-prints its <details>, abnassist minifies.
const DETAILS = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/details>/g;

let changed = 0, scanned = 0, skipped = 0;

for (const f of fs.readdirSync(ROOT).filter(n => n.endsWith('.html'))) {
  const p = path.join(ROOT, f);
  const h = fs.readFileSync(p, 'utf8');

  const block = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!block) continue;

  let data;
  try { data = JSON.parse(block[1]); }
  catch { console.error(`  ${f}: JSON-LD does not parse, left alone`); skipped++; continue; }

  const graph = data['@graph'];
  if (!Array.isArray(graph)) { skipped++; continue; }

  const idx = graph.findIndex(n => n['@type'] === 'FAQPage');
  if (idx === -1) continue;
  scanned++;

  const qs = [];
  let m;
  DETAILS.lastIndex = 0;
  while ((m = DETAILS.exec(h))) {
    const name = decode(m[1]);
    const text = decode(stripSrc(m[2])).replace(/\s+/g, ' ');
    if (name && text) qs.push({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } });
  }

  /* A page whose FAQPage node has no visible <details> behind it is a separate
     problem: the node is describing content that is not on the page. Removing
     it here would be a bigger decision than this script should make on its
     own, so it is reported and left. */
  if (!qs.length) {
    console.error(`  ${f}: FAQPage with no visible <details>, left for a decision`);
    skipped++;
    continue;
  }

  const next = { ...graph[idx], mainEntity: qs };
  if (JSON.stringify(next) === JSON.stringify(graph[idx])) continue;

  graph[idx] = next;
  const before = graph[idx].mainEntity.length;
  if (check) {
    console.error(`  ${f} differs (${qs.length} questions)`);
  } else {
    const out = h.replace(block[0],
      '<script type="application/ld+json">\n' + JSON.stringify(data, null, 1) + '\n</script>');
    fs.writeFileSync(p, out);
    console.log(`  ${f}: FAQPage rebuilt from ${qs.length} <details>`);
  }
  changed++;
}

console.log(`\n${scanned} page(s) with a FAQPage, ${changed} ${check ? 'differ' : 'rebuilt'}, ${skipped} skipped`);
if (check && changed) process.exit(1);
