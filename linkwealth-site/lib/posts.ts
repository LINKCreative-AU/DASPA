import postsJson from "@/content/posts.json";

// Every live post, migrated 1:1 (scripts/fetch-wp.mjs). metaTitle and
// metaDescription are the exact live Yoast head values - they carry the old
// rankings and stay unless SEO.md says a page's meta was deliberately
// rewritten (the rewrite then lives in the page, not here).
export type Post = {
  slug: string;
  urlPath: string;
  category: "insights" | "case-studies";
  date: string;
  modified: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string;
  html: string;
};

const POSTS = (postsJson as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export function getPosts(category?: Post["category"]): Post[] {
  return category ? POSTS.filter((p) => p.category === category) : POSTS;
}

export function getPost(category: Post["category"], slug: string): Post | undefined {
  return POSTS.find((p) => p.category === category && p.slug === slug);
}

// First wp-content image in the post body - used for listing cards.
export function postImage(p: Post): string | null {
  return p.html.match(/<img[^>]*src="(\/wp-content[^"]+)"/)?.[1] ?? null;
}
