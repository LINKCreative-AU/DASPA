import posts from "@/content/posts.json";

export type Post = {
  slug: string;
  path: string;
  category: string;
  title: string;
  date: string;
  modified: string;
  metaTitle: string;
  metaDesc: string;
  ogImage: string;
  html: string;
};

export const POSTS = posts as Post[];

export const CATEGORY_LABELS: Record<string, string> = {
  "home-loans": "Home loans",
  "first-home-buyers": "First home buyers",
  "investor-loans": "Investor loans",
  "commercial-lending": "Commercial lending",
  "asset-and-vehicle-finance": "Asset & vehicle finance",
};

export function findPost(category: string, slug: string) {
  return POSTS.find((p) => p.category === category && p.slug === slug);
}
