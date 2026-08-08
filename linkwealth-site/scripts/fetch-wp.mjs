// Pull every post from the live wealth.link.com.au WordPress REST API and
// write content/posts.json for the static rebuild. Yoast's title tag and
// meta description are not in the API, so each live page is also scraped
// for its exact <title> and meta description (they carry the old rankings).
// Same pipeline pattern as the Advisors rebuild.
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://wealth.link.com.au";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// WPStaq throttles aggressively (crawl-delay 10) - retry 503s with backoff.
async function json(url) {
  for (let i = 0; ; i++) {
    const res = await fetch(url).catch(() => null);
    if (res?.ok) return res.json();
    if (i >= 5) throw new Error(`${url}: HTTP ${res?.status ?? "network"}`);
    await sleep(3000 * (i + 1));
  }
}

function decode(s) {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8216;", "‘")
    .replaceAll("&#8220;", "“")
    .replaceAll("&#8221;", "”")
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8212;", "—")
    .replaceAll("&#038;", "&")
    .replaceAll("&#039;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&hellip;", "…");
}

// Strip WP/Elementor markup down to plain semantic HTML the prose-post CSS
// styles: drop classes/ids/styles/data-*, comments, empty spans/divs.
function cleanHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(?:class|id|style|dir|data-[\w-]+|aria-[\w-]+|srcset|sizes|decoding|loading|fetchpriority)="[^"]*"/g, "")
    .replace(/<(div|span|section|figure)\b[^>]*>\s*<\/\1>/g, "")
    .replace(/<img([^>]*?)\ssrc="https:\/\/wealth\.link\.com\.au(\/wp-content[^"]*)"/g, '<img$1 src="$2"')
    .replace(/href="https:\/\/wealth\.link\.com\.au\//g, 'href="/')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function scrapeHead(url) {
  try {
    await sleep(1500);
    let res = await fetch(url);
    if (!res.ok) {
      await sleep(8000);
      res = await fetch(url);
    }
    const html = await res.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? null;
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;
    return { title: title && decode(title), description: desc && decode(desc) };
  } catch {
    return { title: null, description: null };
  }
}

const cats = Object.fromEntries((await json(`${BASE}/wp-json/wp/v2/categories?per_page=100&_fields=id,slug`)).map((c) => [c.id, c.slug]));

const posts = [];
for (let page = 1; ; page++) {
  const batch = await json(`${BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}`).catch(() => []);
  if (!batch.length) break;
  posts.push(...batch);
  if (batch.length < 100) break;
}

const out = [];
for (const p of posts) {
  const category = cats[p.categories?.[0]] ?? "insights";
  const urlPath = new URL(p.link).pathname.replace(/\/$/, "");
  const head = await scrapeHead(p.link);
  out.push({
    slug: p.slug,
    urlPath,
    category,
    date: p.date,
    modified: p.modified,
    title: decode(p.title.rendered),
    metaTitle: head.title,
    metaDescription: head.description,
    excerpt: decode(p.excerpt.rendered.replace(/<[^>]+>/g, "")).trim(),
    html: cleanHtml(p.content.rendered),
  });
  console.log("post", urlPath);
}

await mkdir("content", { recursive: true });
await writeFile("content/posts.json", JSON.stringify(out, null, 1));
console.log(`wrote content/posts.json (${out.length} posts)`);
