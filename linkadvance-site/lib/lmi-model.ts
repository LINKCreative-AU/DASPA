// LMI model: ONE source of truth for the estimator and for the premium table
// on /lenders-mortgage-insurance-calculator. Indicative premium ranges as a
// percentage of the loan, bracketed by LVR band and loan size, modelled on
// the ranges published insurer estimators return. Every lender and insurer
// prices its own book, so this is a range, never a quote.

const BANDS: { maxLoan: number; rates: [number, number][] }[] = [
  { maxLoan: 300_000, rates: [[0.6, 0.9], [1.2, 1.7], [2.2, 3.2]] },
  { maxLoan: 600_000, rates: [[0.7, 1.1], [1.5, 2.1], [2.8, 4.0]] },
  { maxLoan: 1_000_000, rates: [[0.9, 1.4], [1.9, 2.6], [3.4, 4.6]] },
];

export function premiumRange(loan: number, lvr: number): [number, number] | null {
  if (lvr <= 80 || lvr > 95 || loan <= 0) return null;
  const band = BANDS.find((b) => loan <= b.maxLoan) ?? BANDS[BANDS.length - 1];
  const row = lvr <= 85 ? band.rates[0] : lvr <= 90 ? band.rates[1] : band.rates[2];
  return [(loan * row[0]) / 100, (loan * row[1]) / 100];
}

// Helia, the largest LMI provider in Australia, publishes a partial refund
// where the loan is discharged early and never fell into arrears.
export const REFUND_TIERS = [
  { window: "Discharged within 12 months", share: "Up to 40% of the premium" },
  { window: "Discharged in months 13 to 24", share: "Up to 20% of the premium" },
  { window: "Discharged after 24 months", share: "No refund" },
];

export const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
