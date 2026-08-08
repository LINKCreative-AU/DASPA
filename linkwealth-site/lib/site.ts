// LINK Wealth - single source of truth for brand, contact, proof and legal
// data. Built on LINK Brand Strategy & Style Guide V1.5: monochrome master
// brand with one accent per division. Wealth's accent is #1f9e84 per the
// linkhq kit brand register (deepened from the palette mint #95e5cb for
// legibility on white); the mint carries accents on dark backgrounds.

export const SITE = {
  name: "LINK Wealth",
  descriptor: "Wealth",
  tagline: "The long game.",
  url: "https://wealth.link.com.au",
  phone: "(07) 2101 4377",
  phoneHref: "tel:0721014377",
  // NO public email address, deliberately (house rule carried from the
  // Advisors rebuild): a mailto in the markup is a free address for every
  // scraper. Contact is the phone number and the form.
  address: {
    street: "Level 1, 57 Berwick Street",
    suburb: "Fortitude Valley",
    state: "QLD",
    postcode: "4006",
  },
  color: "#1f9e84", // kit brand register (lib/brand.ts in linkhq)
  colorBright: "#95e5cb",
  colorDark: "#26494d",
  colorLight: "#daf2eb",
  // From the linkhq kit brand register (reviewFallback, 2026-08-08; the old
  // site footer said 35). Swap to the Places engine when the API key lands.
  reviews: {
    rating: 5.0,
    count: 36,
    placeId: "ChIJNQYvAVudk2sRwFeU_s7KnRY",
    googleUrl:
      "https://search.google.com/local/reviews?placeid=ChIJNQYvAVudk2sRwFeU_s7KnRY",
  },
  // Compliance identity, carried verbatim from the old site footer - every
  // page must show LEGAL.publisher + LEGAL.disclaimer (AFSL requirement).
  legal: {
    entity: "Link Wealth Pty Ltd",
    publisher:
      "This website is published by Link Wealth Pty Ltd. Richard Leal (AR 327265) and Link Wealth Pty Ltd (CAR 1312767) are authorised representatives of Millennium 3 Financial Services Pty Ltd (ABN 61 094 529 987), AFSL 244252.",
    disclaimer:
      "The information contained in this website and any of the resources available through it including eBooks, and fact sheets has been prepared for general information purposes only and is not (and cannot be construed or relied upon as) personal advice. No investment objectives, financial circumstances or needs of any individual have been taken into consideration in the preparation of the Content. Financial products entail risk of loss, may rise and fall, and are impacted by a range of market and economic factors, and you should always obtain professional advice to ensure trading or investing in such products is suitable for your circumstances. Under no circumstances will any of Link Wealth Pty Ltd, Millennium 3 Financial Services Pty Ltd, its officers, representatives, associates or agents be liable for any loss or damage, whether direct, incidental or consequential, caused by reliance on or use of the Content. This Content is restricted to Australian residents and is for the intended recipient only. From time to time, Link Wealth Pty Ltd representatives or associates may hold interests in or transact in companies or products mentioned herein, and may receive fees or other benefits, in connection with the making of any recommendation or facilitating a transaction in such companies or products.",
    privacyPdf: "/wp-content/uploads/2024/12/Privacy-Policy_LINK-Wealth.pdf",
    fsgPdf: "/wp-content/uploads/2026/07/FSG-Part-1-M3-v3.1_combined.pdf",
  },
  social: {
    instagram: "https://www.instagram.com/link.australia/",
  },
  group: {
    name: "LINK",
    url: "https://link.com.au",
    careersUrl: "https://link.com.au/careers",
    line: "Part of LINK - accounting, bookkeeping, finance, wealth and property, one connected team.",
  },
} as const;

// One page per head term - the keyword map lives in SEO.md. The old site let
// four URLs share the homepage title; every page now owns exactly one intent.
export type NavLink = { label: string; href: string };
export type NavItem = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export const NAV: NavItem[] = [
  {
    label: "Services",
    children: [
      { label: "Retirement planning", href: "/retirement-planning" },
      { label: "Property investment advice", href: "/property-investment-advice" },
      { label: "Family wealth management", href: "/family-wealth-management" },
      { label: "High net worth advisory", href: "/high-net-worth-wealth-advisors" },
      { label: "SMSF commercial property", href: "/smsf" },
    ],
  },
  {
    label: "Workshops",
    children: [
      {
        label: "Business owner wealth extraction",
        href: "/business-owner-wealth-extraction-workshop-link-wealth",
      },
      { label: "Retirement funding", href: "/retirement-funding-workshop-link-wealth" },
      { label: "Equity strategy", href: "/home-equity-long-term-wealth-strategy" },
    ],
  },
  { label: "SMSF", href: "/smsf" },
  { label: "Equity calculator", href: "/home-equity-estimator-calculator" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Insights", href: "/insights" },
];

// The live team roster (home + workshop pages, 2026-08-08). JC and Nathan
// both appear as Client Services on different live pages - keep both.
export const TEAM = [
  { name: "Richard Leal", role: "Managing Director" },
  { name: "PJ Byrne", role: "Director" },
  { name: "James Webb", role: "Director" },
  { name: "Chris Tinta", role: "Director" },
  { name: "Rhonda Burton", role: "Practice Manager" },
  { name: "JC Crusit", role: "Client Services" },
  { name: "Nathan Phengrasmy", role: "Client Services" },
] as const;

// The LINK group connection - the journey Wealth sits inside.
export const GROUP_TEAMS = [
  { name: "Advisors", meaning: "The accounting", color: "#1283eb", url: "https://www.linkadvisors.com.au" },
  { name: "Books", meaning: "The day-to-day", color: "#f26b49", url: "https://books.link.com.au" },
  { name: "Advance", meaning: "The finance", color: "#f7dd57", url: "https://linkadvance.com.au" },
  { name: "Living", meaning: "The property", color: "#2fae4a", url: "https://www.linkliving.com.au" },
] as const;
