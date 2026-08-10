// Tiered lending and weighted average cost of capital: ONE source of truth
// for the calculator on /second-tier-lenders and the crawlable tables on the
// same page, so a figure in the copy can never disagree with the tool.
//
// The maths is deliberately plain: WACC here is the debt-weighted average
// interest rate across a portfolio, which is what an investor actually feels.
// It is not the corporate finance WACC (no equity cost, no tax shield); the
// page says so in the copy, because calling it something it isn't would be
// the sort of precision that misleads.
//
// Rates are user-entered in the tool and illustrative in the tables. Nothing
// here is a quote, and no figure needs maintaining when the market moves.

export type Tier = 1 | 2 | 3;

export const TIERS: {
  tier: Tier;
  label: string;
  short: string;
  blurb: string;
  defaultRate: number;
  // Kit brand register tones, per the brief: palette yellow, working gold,
  // dark tone. Held as hex because the SVG bar needs literal fills.
  fill: string;
}[] = [
  {
    tier: 1,
    label: "Tier one · Major banks",
    short: "Tier one",
    blurb: "The sharpest rates and the strictest assessments.",
    defaultRate: 6,
    fill: "#f7dd57",
  },
  {
    tier: 2,
    label: "Tier two · Non-bank and smaller lenders",
    short: "Tier two",
    blurb: "A modest rate premium for credit policy the majors do not offer.",
    defaultRate: 7,
    fill: "#e0a500",
  },
  {
    tier: 3,
    label: "Tier three · Private and non-institutional lenders",
    short: "Tier three",
    blurb: "The most flexible and the most expensive. A tool, not a destination.",
    defaultRate: 8,
    fill: "#4d451f",
  },
];

export const tierMeta = (t: Tier) => TIERS[t - 1];

export type Loan = { id: string; name: string; tier: Tier; debt: number; rate: number };

export type WaccResult = {
  totalDebt: number;
  annualInterest: number;
  wacc: number | null; // null when there is no debt to weight
  byTier: { tier: Tier; debt: number; share: number; interest: number; rate: number | null }[];
};

// The whole model, in one function: weight each loan's rate by its share of
// total debt. With no debt entered there is nothing to average, and the
// callers render an empty state rather than a fake 0%.
export function wacc(loans: Loan[]): WaccResult {
  const clean = loans.filter((l) => l.debt > 0);
  const totalDebt = clean.reduce((s, l) => s + l.debt, 0);
  const annualInterest = clean.reduce((s, l) => s + (l.debt * l.rate) / 100, 0);

  const byTier = TIERS.map(({ tier }) => {
    const inTier = clean.filter((l) => l.tier === tier);
    const debt = inTier.reduce((s, l) => s + l.debt, 0);
    const interest = inTier.reduce((s, l) => s + (l.debt * l.rate) / 100, 0);
    return {
      tier,
      debt,
      share: totalDebt > 0 ? debt / totalDebt : 0,
      interest,
      rate: debt > 0 ? (interest / debt) * 100 : null,
    };
  });

  return {
    totalDebt,
    annualInterest,
    wacc: totalDebt > 0 ? (annualInterest / totalDebt) * 100 : null,
    byTier,
  };
}

// What one more loan does to the blend. This is the question the page is
// built to answer, so it gets its own function rather than living in the
// component.
export function withNextLoan(loans: Loan[], next: { tier: Tier; debt: number; rate: number }) {
  const before = wacc(loans);
  const after = wacc([...loans, { id: "next", name: "Next loan", ...next }]);
  return {
    before,
    after,
    deltaPoints: before.wacc !== null && after.wacc !== null ? after.wacc - before.wacc : null,
    extraInterest: after.annualInterest - before.annualInterest,
  };
}

// The worked example from the brief, held here so the calculator's starting
// state, the table in the copy and the FAQ answers are the same three loans.
export const WORKED_EXAMPLE: Loan[] = [
  { id: "a", name: "Property 1", tier: 1, debt: 3_000_000, rate: 6 },
  { id: "b", name: "Property 2", tier: 2, debt: 2_000_000, rate: 7 },
  { id: "c", name: "Property 3", tier: 3, debt: 1_000_000, rate: 8 },
];

// A single-lender portfolio stops at the tier one wall. Used to show what the
// same investor holds if they never leave their bank.
export const TIER_ONE_ONLY: Loan[] = [WORKED_EXAMPLE[0]];

export const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export const pct = (n: number, dp = 2) => `${n.toFixed(dp)}%`;

// APRA's serviceability buffer: assess at the actual rate plus at least
// 3 percentage points. Reconfirmed by APRA in May 2026. Recheck at each
// content review; the calculator takes user-entered rates only, so nothing
// here is a rate the site has to maintain.
export const APRA_BUFFER = 3;
