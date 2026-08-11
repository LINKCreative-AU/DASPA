// 301 map for linkadvance.com.au. Content URLs are KEPT 1:1 (all pages and
// /blog/<category>/<slug> posts), so this map holds the WordPress cruft and
// the utility pages that fold into the new structure.

export const REDIRECTS = [
  // WP date/author/category archives and pagination
  { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})", destination: "/blog", permanent: true },
  { source: "/:year(\\d{4})/:month(\\d{2})", destination: "/blog", permanent: true },
  { source: "/author/:slug*", destination: "/", permanent: true },
  { source: "/category/:slug*", destination: "/blog", permanent: true },
  // The category archives actually present in the old WordPress sitemap were
  // served at /blog/category/<slug>, which the rule above never matched, so
  // all three 404'd on the new site: first-home-buyers, home-loans and
  // investor-loans. The rebuild kept those slugs, so this maps 1:1 onto the
  // real category hub rather than dumping them on /blog. These must sit above
  // the generic /blog/:category/page rule, or paginated category archives get
  // swallowed by it and land on the blog index instead of the category.
  { source: "/blog/category/:slug/page/:n(\\d+)", destination: "/blog/:slug", permanent: true },
  { source: "/blog/category/:slug", destination: "/blog/:slug", permanent: true },
  { source: "/blog/category", destination: "/blog", permanent: true },
  { source: "/blog/page/:n(\\d+)", destination: "/blog", permanent: true },
  { source: "/blog/:category/page/:n(\\d+)", destination: "/blog", permanent: true },

  // Old thin/utility pages folded into stronger homes
  // Linked from the old homepage but absent from its sitemap, so it is a live
  // internal link with no destination on the new site rather than an indexed
  // page. Sent to the about page, which is what it described.
  { source: "/link-advance", destination: "/about-us", permanent: true },
  { source: "/callum-talks-home-loan-health-checks", destination: "/home-loan-health-check", permanent: true },
  { source: "/government-incentives-for-first-home-buyers-in-australia", destination: "/first-home-guarantee", permanent: true },
  { source: "/first-home-buyers-loan/first-home-buyer-information-sessions", destination: "/first-home-buyers-loan", permanent: true },
  { source: "/moving-services", destination: "/home-loans-brisbane", permanent: true },
  { source: "/contact", destination: "/contact-us", permanent: true },
  { source: "/team", destination: "/about-us" , permanent: true },

  // NOTE: no uppercase-path redirect rules here - Next matches redirect
  // sources case-insensitively, so /Contact-Us -> /contact-us matches its
  // own destination and loops forever (the removed middleware existed for
  // this; legacy uppercase URLs now 404, which is acceptable).

  // WP internals
  { source: "/wp-admin/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/", permanent: true },
  { source: "/comments/feed", destination: "/", permanent: true },
];
