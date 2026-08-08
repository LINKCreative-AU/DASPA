// 301 map for linkadvance.com.au. Content URLs are KEPT 1:1 (all pages and
// /blog/<category>/<slug> posts), so this map holds the WordPress cruft and
// the utility pages that fold into the new structure.

export const REDIRECTS = [
  // WP date/author/category archives and pagination
  { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})", destination: "/blog", permanent: true },
  { source: "/:year(\\d{4})/:month(\\d{2})", destination: "/blog", permanent: true },
  { source: "/author/:slug*", destination: "/", permanent: true },
  { source: "/category/:slug*", destination: "/blog", permanent: true },
  { source: "/blog/page/:n(\\d+)", destination: "/blog", permanent: true },
  { source: "/blog/:category/page/:n(\\d+)", destination: "/blog", permanent: true },

  // Old thin/utility pages folded into stronger homes
  { source: "/callum-talks-home-loan-health-checks", destination: "/home-loan-health-check", permanent: true },
  { source: "/government-incentives-for-first-home-buyers-in-australia", destination: "/first-home-guarantee", permanent: true },
  { source: "/first-home-buyers-loan/first-home-buyer-information-sessions", destination: "/first-home-buyers-loan", permanent: true },
  { source: "/moving-services", destination: "/home-loans-brisbane", permanent: true },
  { source: "/contact", destination: "/contact-us", permanent: true },
  { source: "/team", destination: "/about-us" , permanent: true },

  // WP internals
  { source: "/wp-admin/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/", permanent: true },
  { source: "/comments/feed", destination: "/", permanent: true },
];
