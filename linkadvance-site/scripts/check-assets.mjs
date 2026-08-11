// Every image the site references must exist in public/.
//
// This exists because a full sweep of the inner pages found four broken
// images that nobody had noticed: three absolute URLs still pointing at the
// decommissioned WordPress media bucket (all 404), and nine srcset variants
// that were never migrated. The srcset ones were the nasty kind - the main
// src resolved fine, so the pages looked correct on a desktop and only broke
// at phone widths, where the browser picks a smaller candidate.
//
// Runs as part of `npm run build`. A missing asset fails the build rather
// than shipping a broken image.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = readFileSync(join(root, "content/posts.json"), "utf8");

const refs = new Map(); // url -> how it is used

for (const m of raw.matchAll(/src=\\"(\/wp-content\/[^\\"]+)\\"/g)) {
  refs.set(m[1], "src");
}
for (const m of raw.matchAll(/srcset=\\"([^\\]*)\\"/g)) {
  for (const cand of m[1].split(",")) {
    const url = cand.trim().split(" ")[0];
    if (url.startsWith("/wp-content/") && !refs.has(url)) refs.set(url, "srcset");
  }
}

const missing = [...refs].filter(([url]) => !existsSync(join(root, "public", url)));

// Absolute links to the old bucket are always wrong: it is switched off.
const stale = [...raw.matchAll(/https:\/\/wpstaq[^\\" ]*/g)].map((m) => m[0]);

if (missing.length || stale.length) {
  console.error("\nAsset check failed.\n");
  for (const [url, how] of missing) {
    console.error(`  missing (${how}): ${url}`);
  }
  for (const url of [...new Set(stale)]) {
    console.error(`  points at the decommissioned WP media bucket: ${url}`);
  }
  console.error(
    "\nEither add the file under public/, repoint the reference at one that " +
      "exists, or remove the image. A broken image is worse than no image.\n"
  );
  process.exit(1);
}

console.log(`Asset check: ${refs.size} image references, all present.`);
