import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// No crawl-delay (the old WPStaq robots.txt throttled Google with a 10s delay).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
