// 301 map for wealth.link.com.au. Every content URL is KEPT 1:1 in this
// rebuild (13 pages + /insights/{slug} + /case-studies/{slug}), so this map
// only holds the WordPress cruft that used to resolve as thin duplicates of
// the homepage or archives: date archives, author pages, category archives,
// pagination and the stray /uncategorized/ post URL.

export const REDIRECTS = [
  // WP date archives (all served the homepage clone with the homepage title)
  {
    source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})",
    destination: "/insights",
    permanent: true,
  },
  {
    source: "/:year(\\d{4})/:month(\\d{2})",
    destination: "/insights",
    permanent: true,
  },

  // WP author archives (more homepage clones)
  { source: "/author/:slug*", destination: "/", permanent: true },

  // Category archives duplicate the real indexes
  { source: "/category/case-studies", destination: "/case-studies", permanent: true },
  { source: "/category/insights", destination: "/insights", permanent: true },
  { source: "/category/:slug*", destination: "/insights", permanent: true },

  // Blog pagination (10 posts fit on one page)
  { source: "/insights/page/:n(\\d+)", destination: "/insights", permanent: true },

  // The calculator was also published as an uncategorized post
  {
    source: "/uncategorized/home-equity-estimator-calculator",
    destination: "/home-equity-estimator-calculator",
    permanent: true,
  },
  { source: "/uncategorized/:slug*", destination: "/insights", permanent: true },

  // WP feeds
  { source: "/feed", destination: "/insights", permanent: true },
  { source: "/:path*/feed", destination: "/insights", permanent: true },
];
