// Amortisation model: ONE source of truth for the repayments calculator and
// for the pre-computed tables on /home-loan-repayment-calculator, so the page
// and the tool always agree. Standard formulas, nothing proprietary.

export function pmt(P: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (P <= 0 || n <= 0) return 0;
  if (r === 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

// Total interest over the full term at the minimum repayment.
export function totalInterest(P: number, annualRatePct: number, years: number): number {
  return Math.max(pmt(P, annualRatePct, years) * years * 12 - P, 0);
}

// Interest-only repayment (the interest on the balance, nothing off principal).
export function ioPayment(P: number, annualRatePct: number): number {
  return (P * annualRatePct) / 100 / 12;
}

// Month-by-month payoff with an optional extra repayment on top of the
// minimum. Returns the months taken and the interest actually paid.
export function payoff(
  P: number,
  annualRatePct: number,
  years: number,
  extraMonthly = 0
): { months: number; interest: number } {
  const r = annualRatePct / 100 / 12;
  const pay = pmt(P, annualRatePct, years) + extraMonthly;
  let bal = P;
  let months = 0;
  let interest = 0;
  if (P <= 0 || pay <= bal * r) return { months: years * 12, interest: totalInterest(P, annualRatePct, years) };
  while (bal > 0 && months < years * 12 + 1) {
    const int = bal * r;
    interest += int;
    bal = bal + int - pay;
    months++;
  }
  return { months, interest };
}

// What an extra repayment buys: years off the term and interest saved.
export function extraRepaymentEffect(
  P: number,
  annualRatePct: number,
  years: number,
  extraMonthly: number
): { yearsSaved: number; interestSaved: number } {
  const base = totalInterest(P, annualRatePct, years);
  const { months, interest } = payoff(P, annualRatePct, years, extraMonthly);
  return { yearsSaved: years - months / 12, interestSaved: Math.max(base - interest, 0) };
}

export const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
