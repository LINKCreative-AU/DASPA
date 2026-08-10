// Serviceability model: ONE source of truth for the borrowing power
// estimator and for the pre-computed tables on /borrowing-power-calculator.
// The maths a lender's engine runs, simplified: net income, a benchmark
// living-expense floor, commitments, a percentage of credit card LIMITS,
// then whatever the surplus services at the assessment rate.

// Resident income tax 2025-26 including the Medicare levy (approximate, for
// estimation only: no offsets, no HELP, no private health loading).
export function netAnnual(gross: number): number {
  if (gross <= 0) return 0;
  const brackets: [number, number, number][] = [
    [0, 18_200, 0],
    [18_200, 45_000, 0.16],
    [45_000, 135_000, 0.3],
    [135_000, 190_000, 0.37],
    [190_000, Infinity, 0.45],
  ];
  let tax = 0;
  for (const [from, to, rate] of brackets) tax += Math.max(Math.min(gross, to) - from, 0) * rate;
  tax += gross * 0.02; // Medicare levy
  return gross - tax;
}

// Lenders assess a percentage of the credit card LIMIT per month as a
// commitment, whether or not the card is used. Around 3.8% is the common
// setting; a few lenders use 3% and a few 3.8% of limit plus fees.
export const CARD_ASSESSMENT_RATE = 0.038;

// A typical variable rate plus APRA's serviceability buffer of about
// 3 percentage points (APRA guidance, apra.gov.au).
export const APRA_BUFFER = 3;
export const ASSESSMENT_RATE = 8.9;
export const DEFAULT_TERM_YEARS = 30;

// Benchmark minimum living expenses, in the spirit of the Household
// Expenditure Measure lenders floor declared expenses at. Indicative.
export function expenseFloor(single: boolean, dependants = 0): number {
  return (single ? 2_300 : 3_400) + Math.min(dependants, 8) * 550;
}

// What monthly surplus services over a term at the assessment rate.
export function maxLoan(
  surplusMonthly: number,
  assessRate = ASSESSMENT_RATE,
  years = DEFAULT_TERM_YEARS
): number {
  const r = assessRate / 100 / 12;
  const n = years * 12;
  if (surplusMonthly <= 0) return 0;
  return (surplusMonthly * (1 - Math.pow(1 + r, -n))) / r;
}

export type Household = {
  income1: number;
  income2?: number;
  expenses?: number;
  otherRepayments?: number;
  cardLimits?: number;
  dependants?: number;
};

export function assess(h: Household): {
  netMonthly: number;
  living: number;
  cardLoad: number;
  surplus: number;
  capacity: number;
  low: number;
  high: number;
} {
  const g1 = h.income1 || 0;
  const g2 = h.income2 || 0;
  const netMonthly = (netAnnual(g1) + netAnnual(g2)) / 12;
  const single = g2 === 0;
  const living = Math.max(h.expenses || 0, expenseFloor(single, h.dependants || 0));
  const cardLoad = (h.cardLimits || 0) * CARD_ASSESSMENT_RATE;
  const surplus = netMonthly - living - (h.otherRepayments || 0) - cardLoad;
  const capacity = maxLoan(surplus);
  // The published spread between the most and least generous lender on
  // identical inputs, expressed as a plus or minus 10% band.
  return { netMonthly, living, cardLoad, surplus, capacity, low: capacity * 0.9, high: capacity * 1.1 };
}

export const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export const money000 = (n: number) =>
  `$${(Math.round(n / 1_000) * 1_000).toLocaleString("en-AU")}`;
