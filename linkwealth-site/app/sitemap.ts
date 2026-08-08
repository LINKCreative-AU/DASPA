import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getPosts } from "@/lib/posts";

// Core routes + every migrated post (exact old URLs). The old Yoast sitemap
// also listed date/author/category archives - those 301 now (redirects.mjs)
// and deliberately stay out of the sitemap.
const CORE: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/retirement-planning", priority: 0.9 },
  { path: "/property-investment-advice", priority: 0.9 },
  { path: "/family-wealth-management", priority: 0.9 },
  { path: "/high-net-worth-wealth-advisors", priority: 0.9 },
  { path: "/smsf", priority: 0.9 },
  { path: "/home-equity-estimator-calculator", priority: 0.9 },
  { path: "/business-owner-wealth-extraction-workshop-link-wealth", priority: 0.8 },
  { path: "/retirement-funding-workshop-link-wealth", priority: 0.8 },
  { path: "/home-equity-long-term-wealth-strategy", priority: 0.8 },
  { path: "/case-studies", priority: 0.7 },
  { path: "/insights", priority: 0.7 },
  { path: "/how-much-does-a-financial-advisor-cost", priority: 0.8 },
  { path: "/how-much-do-i-need-to-retire", priority: 0.9 },
  { path: "/wealth-health-check", priority: 0.8 },
  { path: "/team", priority: 0.7 },
  { path: "/reviews", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = CORE.map((r) => ({
    url: `${SITE.url}${r.path}`,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  const posts: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: `${SITE.url}${p.urlPath}`,
    lastModified: new Date(p.modified),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...posts];
}
