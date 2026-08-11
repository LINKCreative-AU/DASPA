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

  // Everything below came out of Ahrefs' crawled-URL index for the domain,
  // which is the only source that sees pages the sitemap omits and nothing
  // links to. The sitemap audit passed all 52 of its URLs while these were
  // still broken, because they are not in the sitemap and not linked.
  //
  // The old /services/* tree, retired in favour of one page per head term.
  { source: "/services", destination: "/home-loans-brisbane", permanent: true },
  { source: "/services/home-loans", destination: "/home-loans-brisbane", permanent: true },
  { source: "/services/home-loans/guarantor-loans", destination: "/blog/home-loans/guarantor-loans-whats-the-go", permanent: true },
  { source: "/services/investor-loans", destination: "/investment-home-loans", permanent: true },
  { source: "/services/asset-and-vehicle-finance/personal-vehicle-finance", destination: "/business-car-and-equipment-loans", permanent: true },
  { source: "/services/:path*", destination: "/home-loans-brisbane", permanent: true },
  // The old team page. /team was already covered; the real URL was /our-team.
  { source: "/our-team", destination: "/about-us", permanent: true },
  // WP author archives sat under /blog/author/*, not /author/*, so the rule
  // further up never matched them.
  { source: "/blog/author/:slug*", destination: "/about-us", permanent: true },
  // Two posts moved category during the rebuild; these are their old homes.
  { source: "/blog/articles/:slug*", destination: "/blog", permanent: true },
  { source: "/blog/uncategorized/first-time-homebuyers-guide-which-australian-states-offer-the-most-affordable-options", destination: "/blog/home-loans/first-time-homebuyers-guide-which-australian-states-offer-the-most-affordable-options", permanent: true },
  { source: "/blog/uncategorized/:slug*", destination: "/blog", permanent: true },
  { source: "/blog/commercial-lending/10-lessons-about-financing-and-money-management", destination: "/blog/commercial-lending/10-lessons-about-financing-and-money-management-that-we-can-learn-from-superheroes", permanent: true },
  // Four posts WordPress itself had already deleted: the old site returns 410
  // Gone for each. Nothing was lost in the migration, but Google still has
  // them indexed and a 404 wastes the link equity, so they go to the hub.
  { source: "/5-common-mortgage-broker-myths", destination: "/blog", permanent: true },
  { source: "/8-reasons-youre-better-going-with-a-broker-than-direct-to-a-bank", destination: "/mortgage-brokers-brisbane", permanent: true },
  { source: "/why-you-lose-when-youre-loyal", destination: "/refinancing-brisbane", permanent: true },
  { source: "/your-credit-cards-handy-tool-or-evil-vice", destination: "/borrowing-power-calculator", permanent: true },

  // NOTE: no uppercase-path redirect rules here - Next matches redirect
  // sources case-insensitively, so /Contact-Us -> /contact-us matches its
  // own destination and loops forever (the removed middleware existed for
  // this; legacy uppercase URLs now 404, which is acceptable).

  // WP internals
  { source: "/wp-admin/:path*", destination: "/", permanent: true },
  { source: "/feed", destination: "/", permanent: true },
  { source: "/comments/feed", destination: "/", permanent: true },
];
