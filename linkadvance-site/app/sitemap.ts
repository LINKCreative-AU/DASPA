import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { POSTS } from "@/lib/posts";
import { CATEGORY_SLUGS } from "@/lib/article-hub";

const CORE: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/home-loans-brisbane", priority: 0.9 },
  { path: "/mortgage-brokers-brisbane", priority: 0.9 },
  { path: "/refinancing-brisbane", priority: 0.9 },
  { path: "/bridging-loans", priority: 0.9 },
  { path: "/first-home-buyers-loan", priority: 0.9 },
  { path: "/first-home-buyers-grant", priority: 0.9 },
  { path: "/first-home-guarantee", priority: 0.9 },
  { path: "/first-home-super-saver", priority: 0.9 },
  { path: "/home-loans-for-doctors", priority: 0.9 },
  { path: "/commercial-lending", priority: 0.9 },
  { path: "/commercial-property-loans", priority: 0.9 },
  { path: "/working-capital-finance", priority: 0.8 },
  { path: "/business-acquisition-loans", priority: 0.8 },
  { path: "/development-finance", priority: 0.8 },
  { path: "/business-borrowing-health-check", priority: 0.9 },
  { path: "/investment-home-loans", priority: 0.9 },
  { path: "/second-tier-lenders", priority: 0.9 },
  { path: "/construction-loans-brisbane", priority: 0.8 },
  { path: "/smsf-mortgage-broker", priority: 0.8 },
  { path: "/business-loans", priority: 0.8 },
  { path: "/business-car-and-equipment-loans", priority: 0.8 },
  { path: "/calculators", priority: 0.8 },
  { path: "/home-loan-health-check", priority: 0.9 },
  { path: "/borrowing-power-calculator", priority: 0.9 },
  { path: "/home-loan-repayment-calculator", priority: 0.9 },
  { path: "/lenders-mortgage-insurance-calculator", priority: 0.9 },
  { path: "/stamp-duty-calculator-qld", priority: 0.9 },
  { path: "/about-us", priority: 0.7 },
  { path: "/reviews", priority: 0.7 },
  { path: "/contact-us", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...CORE.map((c) => ({
      url: `${SITE.url}${c.path === "/" ? "" : c.path}`,
      lastModified: now,
      priority: c.priority,
    })),
    // Category indexes: real pages now, and the target of every post breadcrumb.
    ...CATEGORY_SLUGS.map((c) => ({
      url: `${SITE.url}/blog/${c}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...POSTS.map((p) => ({
      url: `${SITE.url}${p.path}`,
      lastModified: new Date(p.modified),
      priority: 0.6,
    })),
  ];
}
