// LINK Advance - single source of truth for brand, contact, proof and legal
// data. Built on LINK Brand Strategy & Style Guide V1.5: monochrome master
// brand with one accent per division. Advance's accent is the register's
// working gold #e0a500 (deepened ONCE from palette yellow #f7dd57 - lib/brand.ts
// in linkhq); the palette yellow carries accents on dark backgrounds.

export const SITE = {
  name: "LINK Advance",
  descriptor: "Advance",
  tagline: "We make lending easy.",
  url: "https://linkadvance.com.au",
  phone: "07 2101 4374",
  phoneHref: "tel:0721014374",
  // NO public email address, deliberately (house rule carried from the
  // Advisors rebuild): a mailto in the markup is a free address for every
  // scraper. Contact is the phone number and the form.
  address: {
    street: "Level 1, 57 Berwick Street",
    suburb: "Fortitude Valley",
    state: "QLD",
    postcode: "4006",
  },
  color: "#e0a500", // kit brand register working gold (deepened once from palette #f7dd57)
  colorBright: "#f7dd57", // the V1.5 palette yellow
  colorDark: "#4d451f",
  colorLight: "#fff6cc",
  // 262 Google reviews at 5.0 - counts and place ID from the kit brand
  // register (reviewFallback, lib/brand.ts in linkhq).
  reviews: {
    rating: 5.0,
    count: 262,
    placeId: "ChIJgRsxOGpZkWsR-1Md1zgPFbE",
    googleUrl: "https://search.google.com/local/reviews?placeid=ChIJgRsxOGpZkWsR-1Md1zgPFbE",
  },
  // Compliance identity, carried verbatim from the old site (credit licence
  // chain, NCCP) - every page must show LEGAL.publisher; do not reword
  // without licensee sign-off.
  legal: {
    entity: "LINK Advance",
    abn: "12 612 337 587",
    publisher:
      "LINK Advance ABN 12 612 337 587. The Brokers are authorised as credit representatives of Connective Credit Services Pty Ltd ACN 143 651 496 (Australian Credit Licence 389328).",
    disclaimer:
      "The information on this website is general in nature and does not take into account your objectives, financial situation or needs. All loan applications are subject to the credit provider's assessment and lending criteria. Terms, conditions, fees and charges apply. Comparison rates and calculator results are indicative only: they are not a quote, a loan offer or a suggestion of your borrowing capacity, and you should always confirm figures with your broker or lender before acting.",
    privacyPath: "/privacy-policy",
    emailDisclaimerPath: "/mail-disclaimer",
  },
  social: {
    instagram: "https://www.instagram.com/link.advance",
    facebook: "https://www.facebook.com/link.advanceau/",
  },
  group: {
    name: "LINK",
    url: "https://link.com.au",
    careersUrl: "https://link.com.au/careers",
    line: "Part of LINK: accounting, bookkeeping, finance, wealth and property, one connected team.",
  },
} as const;

// One page per head term - the keyword map lives in SEO.md. Existing slugs
// carried 1:1 (the FHOG QLD page ranks #1 on its eligibility cluster).
export type NavLink = { label: string; href: string };
export type NavColumn = { heading: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href?: string;
  children?: NavLink[]; // simple dropdown
  columns?: NavColumn[]; // grouped panel
};

export const NAV: NavItem[] = [
  {
    label: "Lending",
    href: "/home-loans-brisbane",
    columns: [
      {
        heading: "Personal",
        links: [
          { label: "Home loans", href: "/home-loans-brisbane" },
          { label: "First home buyers", href: "/first-home-buyers-loan" },
          { label: "Refinancing", href: "/refinancing-brisbane" },
          { label: "Bridging loans", href: "/bridging-loans" },
          { label: "Investment loans", href: "/investment-home-loans" },
          { label: "Second tier lenders", href: "/second-tier-lenders" },
          { label: "Construction loans", href: "/construction-loans-brisbane" },
          { label: "Doctors & professionals", href: "/home-loans-for-doctors" },
          { label: "SMSF loans", href: "/smsf-mortgage-broker" },
        ],
      },
      {
        heading: "Commercial",
        links: [
          { label: "Commercial lending", href: "/commercial-lending" },
          { label: "Commercial property", href: "/commercial-property-loans" },
          { label: "Working capital", href: "/working-capital-finance" },
          { label: "Acquisition & franchise", href: "/business-acquisition-loans" },
          { label: "Development finance", href: "/development-finance" },
          { label: "Business loans", href: "/business-loans" },
          { label: "Equipment & vehicles", href: "/business-car-and-equipment-loans" },
        ],
      },
      {
        heading: "First home extras",
        links: [
          { label: "First Home Owners Grant QLD", href: "/first-home-buyers-grant" },
          { label: "First Home Guarantee", href: "/first-home-guarantee" },
          { label: "First Home Super Saver", href: "/first-home-super-saver" },
        ],
      },
    ],
  },
  {
    label: "Tools",
    href: "/calculators",
    children: [
      { label: "All calculators & checks", href: "/calculators" },
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Business borrowing check", href: "/business-borrowing-health-check" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
      { label: "Stamp duty QLD calculator", href: "/stamp-duty-calculator-qld" },
      { label: "Cost of capital calculator", href: "/second-tier-lenders#wacc-calculator" },
    ],
  },
  { label: "Articles", href: "/blog" },
  {
    label: "About",
    href: "/about-us",
    children: [
      { label: "Meet the brokers", href: "/about-us" },
      { label: "Reviews", href: "/reviews" },
      { label: "Mortgage brokers Brisbane", href: "/mortgage-brokers-brisbane" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
];

// The brokers, exactly as the live about page names them (the site publishes
// first names; Jacob's surname appears in review responses).
export const TEAM = [
  {
    name: "Hugh",
    role: "Co-Founder & Director",
    focus: "Every loan, fought for. Real estate and property brokerage background.",
    image: "/wp-content/uploads/2026/05/Hugh-1024x1024-LinkedIn-Square-Grey.png",
  },
  {
    name: "Callum",
    role: "Mortgage Broker",
    focus: "First home buyers and investors. Bachelor of Business (Economics and Finance), five years both sides of the desk.",
    image: "/wp-content/uploads/2026/05/Callum-Advance-1024x1024-LinkedIn-Grey-Square.png",
  },
  {
    name: "Jacob",
    role: "Mortgage Broker",
    focus: "The lending other brokers find difficult: complex commercial, SMSF, small business finance.",
    image: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
  },
] as const;

// The LINK group connection - the journey Advance sits inside.
export const GROUP_TEAMS = [
  { name: "Advisors", meaning: "The accounting", color: "#1283eb", url: "https://www.linkadvisors.com.au" },
  { name: "Books", meaning: "The day-to-day", color: "#f26b49", url: "https://books.link.com.au" },
  { name: "Wealth", meaning: "The long game", color: "#95e5cb", url: "https://wealth.link.com.au" },
  { name: "Living", meaning: "The property", color: "#2fae4a", url: "https://www.linkliving.com.au" },
] as const;
