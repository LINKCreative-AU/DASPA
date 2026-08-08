// Mirror every wp-content/uploads asset referenced anywhere on the live
// wealth.link.com.au into public/wp-content/uploads/... so image and PDF
// URLs survive the WordPress cutover 1:1 (same pattern as the Advisors
// rebuild). Re-runnable; skips files already on disk.
import { mkdir, writeFile, access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";

const EXTRACT = process.env.EXTRACT_DIR;
if (!EXTRACT) {
  console.error("Set EXTRACT_DIR to the crawl output directory (with media-manifest.json and wp-media*.json)");
  process.exit(1);
}

const urls = new Set();
const manifest = JSON.parse(readFileSync(path.join(EXTRACT, "media-manifest.json"), "utf8"));
for (const u of Object.keys(manifest)) urls.add(u);
for (const f of ["wp-media.json", "wp-media-2.json", "wp-media-3.json"]) {
  try {
    for (const m of JSON.parse(readFileSync(path.join(EXTRACT, f), "utf8"))) {
      if (m.source_url) urls.add(m.source_url);
    }
  } catch {}
}

let ok = 0, skip = 0, fail = 0;
for (const u of [...urls].sort()) {
  const m = u.match(/^https?:\/\/wealth\.link\.com\.au(\/wp-content\/uploads\/.+)$/);
  if (!m) continue;
  const rel = decodeURIComponent(m[1]).split("?")[0];
  if (rel.includes("..")) continue;
  const dest = path.join("public", rel);
  try {
    await access(dest);
    skip++;
    continue;
  } catch {}
  try {
    const res = await fetch(u);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) {
    console.error("FAIL", u, e.message);
    fail++;
  }
}
console.log(`mirrored ${ok}, skipped ${skip}, failed ${fail}`);
