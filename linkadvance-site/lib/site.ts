// LINK Advance - single source of truth for brand, contact, proof and legal
// data. Built on LINK Brand Strategy & Style Guide V1.5: monochrome master
// brand with one accent per division. Advance's accent is the register's
// working gold #e0a500 (deepened ONCE from palette yellow #f7dd57 - lib/brand.ts
// in linkhq); the palette yellow carries accents on dark backgrounds.

export const SITE = {
  name: "LINK Advance",
  descriptor: "Advance",
  // Replaced Aug 2026: credit compliance rejected "We make lending easy."
  // "Easy" risks implying the credit assessment is a formality, and it also
  // sat in the most crowded space in the category (Lendi "simple", Time Home
  // Loans "uncomplicate", Yellow Brick Road "hassle-free"). This claims the
  // relationship rather than the outcome, which is conduct we can substantiate.
  tagline: "Your broker for life.",
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
  // Compliance identity. The licensee (Connective) mandates two strings on a
  // credit representative's website WORD FOR WORD - `licence` and `disclaimer`
  // below are those strings, reproduced exactly from the Connective wiki
  // (Advertising requirements: websites). DO NOT EDIT EITHER ONE. They are not
  // ours to improve: paraphrasing them, however well, is the breach.
  //
  // Entity facts checked against the ABR record for ABN 12 612 337 587 (Aug
  // 2026): entity name DELLIT & WEBB WEALTH SERVICES PTY LTD, ACN 612 337 587,
  // registered business name "Link Advance" since 18 Oct 2018. Connective
  // requires legal name AND trading name AND ABN/ACN, which is why all three
  // are here rather than the trading name alone.
  legal: {
    entity: "LINK Advance",
    legalName: "Dellit & Webb Wealth Services Pty Ltd",
    acn: "612 337 587",
    abn: "12 612 337 587",
    identity:
      "LINK Advance is a registered business name of Dellit & Webb Wealth Services Pty Ltd ACN 612 337 587, ABN 12 612 337 587.",
    // Connective's mandated licensing statement, verbatim, once per credit
    // representative. All three numbers supplied by James 11 Aug 2026; all
    // three brokers operate under Connective's ACL 389328.
    //
    // The repetition is deliberate. Connective specifies the singular sentence
    // "Credit Representative (insert number) is authorised under Australian
    // Credit Licence 389328." and folding three numbers into one pluralised
    // sentence would be a paraphrase of a string we were told to reproduce
    // exactly - the same mistake the old wording made. If Connective would
    // rather see the combined form, that is their call to give, not ours.
    creditReps: [
      { name: "Hugh", number: "492039" },
      { name: "Callum", number: "573582" },
      { name: "Jacob", number: "574906" },
    ],
    licence: [
      "Credit Representative 492039 is authorised under Australian Credit Licence 389328.",
      "Credit Representative 573582 is authorised under Australian Credit Licence 389328.",
      "Credit Representative 574906 is authorised under Australian Credit Licence 389328.",
    ].join(" "),
    // Connective's mandated general disclaimer, verbatim.
    disclaimer:
      "This page provides general information only and has been prepared without taking into account your objectives, financial situation or needs. We recommend that you consider whether it is appropriate for your circumstances and your full financial situation will need to be reviewed prior to acceptance of any offer or product. It does not constitute legal, tax or financial advice and you should always seek professional advice in relation to your individual circumstances.",
    // Connective's recommended best-practice addition.
    eligibility:
      "Subject to lenders terms and conditions, fees and charges and eligibility criteria apply.",
    // Ours, not the licensee's: the calculators need saying-so beyond the
    // general disclaimer, because a number on screen reads as a promise in a
    // way prose does not.
    toolsDisclaimer:
      "Calculator and check results are indicative only. They are not a quote, a loan offer or an assessment of your borrowing capacity, and every figure should be confirmed with your broker or lender before you act on it.",
    // Composed for the places that want the whole compliance identity in one
    // string (schema publisher, article footers). Keep in step with `identity`
    // and `licence` above.
    publisher:
      "LINK Advance is a registered business name of Dellit & Webb Wealth Services Pty Ltd ACN 612 337 587, ABN 12 612 337 587. Credit Representative 492039 is authorised under Australian Credit Licence 389328. Credit Representative 573582 is authorised under Australian Credit Licence 389328. Credit Representative 574906 is authorised under Australian Credit Licence 389328.",
    privacyPath: "/privacy-policy",
    emailDisclaimerPath: "/mail-disclaimer",
    complaintsPath: "/compliments-and-concerns",
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
//
// creditRep is each broker's own credit representative number under Connective's
// ACL 389328, so the number sits next to the person it belongs to rather than
// only in a footer block of three near-identical sentences.
export const TEAM = [
  {
    name: "Hugh",
    creditRep: "492039",
    role: "Co-Founder & Director",
    focus: "Every loan, fought for. Real estate and property brokerage background.",
    image: "/wp-content/uploads/2026/05/Hugh-1024x1024-LinkedIn-Square-Grey.png",
    // Sourced from LINK Advance's own published article: "Hugh has worked in
    // the broking industry since 2016." Ten years to 2026.
    credential: "Broking since 2016 · Licensed real estate agent",
    bio:
      "Hugh has been writing loans since 2016 and came to broking from real estate, where he still holds his licence. That order matters: he learned what a contract does to a buyer before he learned what a lender does to an application, which is why his advice tends to start with the purchase rather than the product. He founded LINK Advance to run lending the way he wanted it run for himself: one broker per client, the same person from the first call to settlement and every year after it.",
  },
  {
    name: "Callum",
    creditRep: "573582",
    role: "Mortgage Broker",
    focus: "First home buyers and investors. Bachelor of Business (Economics and Finance), five years both sides of the desk.",
    image: "/wp-content/uploads/2026/05/Callum-Advance-1024x1024-LinkedIn-Grey-Square.png",
    credential: "Bachelor of Business, Economics and Finance · 5 years",
    bio:
      "Callum works with first home buyers stepping into the market and investors building portfolios, and he has spent five years on both sides of the desk: first assessing and processing loan applications, now writing them. Knowing how a file is read from the inside is why his applications tend not to come back with questions. First home buyers say the same thing about him in review after review: he answers the questions they did not know to ask.",
  },
  {
    name: "Jacob",
    creditRep: "574906",
    role: "Mortgage Broker",
    focus: "The lending other brokers find difficult: complex commercial, SMSF, small business finance.",
    image: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    credential: "Commercial, SMSF and business lending · 5 years",
    bio:
      "Jacob takes the lending other brokers pass on: complex commercial deals, SMSF purchases, business and equipment finance, and the residential files that do not fit a template. He is the reason the firm can now do the commercial end at all, and he is studying computational mathematics with a minor in finance and economics, which tells you roughly how he approaches a hard structure. Clients describe the same thing each time, which is that a complicated transaction stopped feeling complicated.",
  },
] as const;

// The LINK group connection - the journey Advance sits inside.
export const GROUP_TEAMS = [
  { name: "Advisors", meaning: "The accounting", color: "#1283eb", url: "https://www.linkadvisors.com.au" },
  { name: "Books", meaning: "The day-to-day", color: "#f26b49", url: "https://books.link.com.au" },
  { name: "Wealth", meaning: "The long game", color: "#95e5cb", url: "https://wealth.link.com.au" },
  { name: "Living", meaning: "The property", color: "#2fae4a", url: "https://www.linkliving.com.au" },
] as const;
