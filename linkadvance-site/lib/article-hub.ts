import { POSTS, CATEGORY_LABELS, type Post } from "./posts";

// The articles hub, structured by the decision a reader is making rather
// than by publish date. The old /blog was a flat 34-tile grid that passed
// its equity nowhere except back into itself: 34 outbound links, all of
// them to other posts, none to a money page. Each section here carries a
// RELATED block into the matching service page and tool, which is the whole
// point of the rebuild.
//
// Rule: every post appears exactly ONCE across FEATURED + SECTIONS. The
// assertion at the bottom of this file fails the build if that stops being
// true, so a new post cannot quietly go missing from the hub.

export type HubLink = { label: string; href: string };

export type HubSection = {
  id: string;
  title: string; // rendered as the H2
  who: string; // one honest line: who this section is for
  slugs: string[];
  related: HubLink[];
  relatedLead: string;
};

// The two leads. Refinancing after separation is the site's #1 ranking
// article for its term; mortgage broker vs bank targets a zero-difficulty
// head term and is the page most likely to convert a cold reader.
export const FEATURED_SLUGS = [
  "refinancing-your-home-loan-after-separation-or-divorce",
  "mortgage-broker-vs-bank",
] as const;

export const SECTIONS: HubSection[] = [
  {
    id: "first-home",
    title: "Buying your first home.",
    who: "For people who have never owned property. What Queensland hands you right now, what it costs to get in, and the legitimate ways around a 20% deposit.",
    slugs: [
      "home-guarantee-scheme",
      "stamp-duty-savings-for-first-home-buyers",
      "8-amazing-tips-for-first-home-buyers",
      "8-tips-to-help-break-the-rent-cycle",
      "6-reasons-why-first-home-buyers-should-buy-older-units",
      "how-can-i-use-my-super-to-buy-a-house",
      "guarantor-loans-whats-the-go",
    ],
    relatedLead:
      "The $30,000 First Home Owner Grant, the 5% deposit First Home Guarantee and zero stamp duty on a new build since May 2025 all stack. These pages run the numbers on yours.",
    related: [
      { label: "First home buyer loans", href: "/first-home-buyers-loan" },
      { label: "First Home Owners Grant QLD", href: "/first-home-buyers-grant" },
      { label: "First Home Guarantee", href: "/first-home-guarantee" },
      { label: "First Home Super Saver", href: "/first-home-super-saver" },
      { label: "Stamp duty calculator QLD", href: "/stamp-duty-calculator-qld" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
    ],
  },
  {
    id: "choosing",
    title: "Choosing what to buy, and when.",
    who: "For buyers with the deposit sorted who are now arguing with themselves about the suburb, the timing, and whether to renovate something instead.",
    slugs: [
      "first-time-homebuyers-guide-which-australian-states-offer-the-most-affordable-options",
      "when-is-the-best-time-to-buy-property",
      "5-easy-ways-to-take-the-stress-out-of-buying-a-home",
      "5-cost-effective-ways-to-renovate-an-apartment",
    ],
    relatedLead:
      "Know the ceiling before you go to an open home, and know what the repayment looks like before you sign anything.",
    related: [
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
      { label: "Construction loans", href: "/construction-loans-brisbane" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
    ],
  },
  {
    id: "refinancing",
    title: "Refinancing and the loan you already have.",
    who: "For owners who signed years ago and have not looked at the rate since. What a proper review turns up, and when switching is worth the paperwork.",
    slugs: [
      "5-reasons-to-refinance",
      "annual-home-loan-health-checks-are-essential",
      "a-home-loan-health-check-that-powers-you-forward",
    ],
    relatedLead:
      "A review either confirms you are on a fair rate or hands you the number to take back to your bank.",
    related: [
      { label: "Refinancing Brisbane", href: "/refinancing-brisbane" },
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "Bridging loans", href: "/bridging-loans" },
    ],
  },
  {
    id: "investing",
    title: "Investing in property.",
    who: "For anyone weighing up a second property, including the version where you keep renting the suburb you love and buy where the yield actually works.",
    slugs: [
      "rentvesting-explained",
      "so-you-want-to-be-a-property-investor",
      "13-pros-and-cons-of-property-investment",
    ],
    relatedLead:
      "Investment lending is assessed differently to an owner-occupied loan, and structure decided at loan one is expensive to unwind at loan three.",
    related: [
      { label: "Investment home loans", href: "/investment-home-loans" },
      { label: "SMSF lending", href: "/smsf-mortgage-broker" },
      { label: "Construction loans", href: "/construction-loans-brisbane" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
    ],
  },
  {
    id: "borrowing-power",
    title: "Borrowing power, credit and how lenders decide.",
    who: "For borrowers who have been told no, or told a number well below what they expected. What sits behind an assessment, and which parts of it you can actually move.",
    slugs: [
      "increase-borrowing-capacity-ahead-of-a-loan-application",
      "lowering-the-assessment-rate-what-does-it-mean-for-you",
      "relaxing-responsible-lending-laws",
      "good-news-at-last",
      "comprehensive-credit-reporting-what-does-it-mean-for-you",
      "top-10-saving-tips",
    ],
    relatedLead:
      "The same income and the same debts can produce very different answers at different banks. Start with an estimate, then find out which of the 35+ lenders on our panel reads your file most kindly.",
    related: [
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Loans for doctors and professionals", href: "/home-loans-for-doctors" },
    ],
  },
  {
    id: "brokers-and-banks",
    title: "Brokers, banks and whose interests get served.",
    who: "For people deciding how to get the loan arranged, and what to ask before they hand anyone their payslips.",
    slugs: [
      "top-6-reasons-to-use-a-mortgage-broker",
      "10-questions-to-ask-your-mortgage-broker-australia",
      "who-has-your-best-interests-at-heart",
      "the-greatest-bank-heist-in-australian-history",
      "commitment-issues-get-into-a-long-term-relationship-with-your-mortgage-broker",
    ],
    relatedLead:
      "Brokers carry a Best Interests Duty. A bank branch does not. Here is who we are and what 262 five-star reviews look like up close.",
    related: [
      { label: "Mortgage brokers Brisbane", href: "/mortgage-brokers-brisbane" },
      { label: "Meet the brokers", href: "/about-us" },
      { label: "Reviews", href: "/reviews" },
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
    ],
  },
  {
    id: "business",
    title: "Business, commercial and asset finance.",
    who: "For business owners and self-employed borrowers, where the lender reads a profit and loss statement rather than a payslip.",
    slugs: [
      "new-flexible-business-loan-options",
      "the-low-down-on-car-finance",
      "10-lessons-about-financing-and-money-management-that-we-can-learn-from-superheroes",
      "so-apple-has-entered-the-credit-card-game-what-does-this-mean",
    ],
    relatedLead:
      "Commercial credit moves on cashflow, security and how the file is presented. The borrowing check tells you which of those is holding you up.",
    related: [
      { label: "Commercial lending", href: "/commercial-lending" },
      { label: "Business borrowing health check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Equipment and vehicle finance", href: "/business-car-and-equipment-loans" },
      { label: "Working capital finance", href: "/working-capital-finance" },
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Business acquisition loans", href: "/business-acquisition-loans" },
      { label: "Development finance", href: "/development-finance" },
    ],
  },
];

// Category index pages. The /blog/<category> routes are the ones the post
// breadcrumbs point at, so each needs a real reason to exist: its own
// intro, its own posts, its own set of links into the money pages.
export type CategoryMeta = {
  heading: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  relatedLead: string;
  related: HubLink[];
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "home-loans": {
    heading: "Home loans, explained by the people who write them.",
    metaTitle: "Home Loan Articles & Guides | LINK Advance Brisbane",
    metaDesc:
      "Home loan articles from LINK Advance's Brisbane brokers: borrowing power, refinancing, credit reporting, guarantor loans, broker versus bank, and what lender policy changes mean for your application.",
    intro:
      "The bulk of what we write sits here, because the bulk of what we do is home loans. Borrowing capacity and how to lift it, refinancing, guarantors, credit files, and the lender policy shifts that quietly change what you can borrow.",
    relatedLead: "The pages that do the arithmetic on your situation:",
    related: [
      { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
      { label: "Refinancing Brisbane", href: "/refinancing-brisbane" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
      { label: "Home loan health check", href: "/home-loan-health-check" },
      { label: "Mortgage brokers Brisbane", href: "/mortgage-brokers-brisbane" },
    ],
  },
  "first-home-buyers": {
    heading: "First home buyers.",
    metaTitle: "First Home Buyer Articles: Grants, Schemes & Stamp Duty | LINK Advance",
    metaDesc:
      "First home buyer articles from LINK Advance: the expanded Home Guarantee Scheme, Queensland stamp duty savings, and how the $30,000 grant and 5% deposit guarantee fit together.",
    intro:
      "Queensland is unusually generous to first home buyers at the moment, and the rules changed twice in the last two years. These articles cover what is on the table and how the pieces stack.",
    relatedLead: "Check what you qualify for and what it saves you:",
    related: [
      { label: "First home buyer loans", href: "/first-home-buyers-loan" },
      { label: "First Home Owners Grant QLD", href: "/first-home-buyers-grant" },
      { label: "First Home Guarantee", href: "/first-home-guarantee" },
      { label: "First Home Super Saver", href: "/first-home-super-saver" },
      { label: "Stamp duty calculator QLD", href: "/stamp-duty-calculator-qld" },
      { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
    ],
  },
  "investor-loans": {
    heading: "Investor loans.",
    metaTitle: "Property Investment Loan Articles | LINK Advance Brisbane",
    metaDesc:
      "Property investment articles from LINK Advance's Brisbane brokers: rentvesting, building a portfolio, and the honest pros and cons of investing in Australian property.",
    intro:
      "Investment lending is assessed on different rules to an owner-occupied loan, and the structure you set at property one decides how far you get by property three. These are the strategy questions worth settling early.",
    relatedLead: "Where the strategy meets the loan:",
    related: [
      { label: "Investment home loans", href: "/investment-home-loans" },
      { label: "SMSF lending", href: "/smsf-mortgage-broker" },
      { label: "Construction loans", href: "/construction-loans-brisbane" },
      { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
      { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
    ],
  },
  "commercial-lending": {
    heading: "Commercial lending.",
    metaTitle: "Commercial & Business Lending Articles | LINK Advance Brisbane",
    metaDesc:
      "Commercial and business lending articles from LINK Advance's Brisbane brokers: flexible business loan options, funding growth, and getting the money side of a business under control.",
    intro:
      "Business credit is a different animal to a mortgage. Cashflow, security and the quality of the file all move the answer, and the answer changes lender by lender.",
    relatedLead: "The commercial desk, and the check that tells you where you stand:",
    related: [
      { label: "Commercial lending", href: "/commercial-lending" },
      { label: "Business borrowing health check", href: "/business-borrowing-health-check" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Working capital finance", href: "/working-capital-finance" },
      { label: "Commercial property loans", href: "/commercial-property-loans" },
      { label: "Business acquisition loans", href: "/business-acquisition-loans" },
      { label: "Development finance", href: "/development-finance" },
    ],
  },
  "asset-and-vehicle-finance": {
    heading: "Asset and vehicle finance.",
    metaTitle: "Car, Equipment & Asset Finance Articles | LINK Advance Brisbane",
    metaDesc:
      "Asset and vehicle finance articles from LINK Advance's Brisbane brokers: how car finance really works, what dealer finance costs you, and why a finance relationship beats a one-off transaction.",
    intro:
      "Car and equipment finance often gets signed at a dealership desk at the end of a long Saturday, on terms nobody compared. Worth ten minutes of reading first.",
    relatedLead: "Finance the asset properly:",
    related: [
      { label: "Equipment and vehicle finance", href: "/business-car-and-equipment-loans" },
      { label: "Business loans", href: "/business-loans" },
      { label: "Commercial lending", href: "/commercial-lending" },
      { label: "Business borrowing health check", href: "/business-borrowing-health-check" },
    ],
  },
};

// ---------------------------------------------------------------------------

const BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

export function postBySlug(slug: string): Post {
  const post = BY_SLUG.get(slug);
  if (!post) throw new Error(`Article hub references a post that no longer exists: ${slug}`);
  return post;
}

export const FEATURED: Post[] = FEATURED_SLUGS.map(postBySlug);

export type ResolvedSection = HubSection & { posts: Post[] };

export const RESOLVED_SECTIONS: ResolvedSection[] = SECTIONS.map((s) => ({
  ...s,
  posts: s.slugs.map(postBySlug),
}));

// Build-time guard: every post placed exactly once, nothing orphaned.
(() => {
  const placed = [...FEATURED_SLUGS, ...SECTIONS.flatMap((s) => s.slugs)];
  const seen = new Set<string>();
  for (const slug of placed) {
    if (seen.has(slug)) throw new Error(`Article hub places "${slug}" more than once.`);
    seen.add(slug);
  }
  const orphans = POSTS.filter((p) => !seen.has(p.slug)).map((p) => p.slug);
  if (orphans.length) {
    throw new Error(`Article hub is missing ${orphans.length} post(s): ${orphans.join(", ")}`);
  }
})();

export const CATEGORY_SLUGS = Object.keys(CATEGORY_META);

export function postsInCategory(category: string): Post[] {
  return POSTS.filter((p) => p.category === category);
}

export function categoryCount(category: string): number {
  return postsInCategory(category).length;
}

export { CATEGORY_LABELS };

// The metaDescs are carried verbatim from the old Yoast fields, HTML
// entities and all. Decode for display only; the stored value is untouched.
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
  "&hellip;": "\u2026",
  "&#8216;": "\u2018",
  "&#8217;": "\u2019",
  "&#8220;": "\u201c",
  "&#8221;": "\u201d",
  "&#8211;": "\u2013",
  "&#8212;": "\u2014",
  "&#039;": "'",
  "&#39;": "'",
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&[a-zA-Z]+;|&#\d+;/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

export function blurb(post: Post): string {
  return decodeEntities(post.metaDesc);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
