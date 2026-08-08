"use client";

import { useState } from "react";

// Borrowing power estimator - the serviceability math lenders actually run:
// net income minus declared expenses (floored at a HEM-like minimum), minus
// commitments and 3.8%/month of card limits, capitalised at the assessment
// rate (actual + 3% buffer). Indicative by design; every lender differs.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

// 2025-26 resident tax incl. Medicare levy (approximate, for estimation)
function netAnnual(gross: number): number {
  if (gross <= 0) return 0;
  const brackets: [number, number, number][] = [
    [0, 18_200, 0],
    [18_200, 45_000, 0.16],
    [45_000, 135_000, 0.30],
    [135_000, 190_000, 0.37],
    [190_000, Infinity, 0.45],
  ];
  let tax = 0;
  for (const [from, to, rate] of brackets) tax += Math.max(Math.min(gross, to) - from, 0) * rate;
  tax += gross * 0.02; // Medicare levy
  return gross - tax;
}

function maxLoan(surplusMonthly: number, assessRate: number, years = 30): number {
  const r = assessRate / 100 / 12;
  const n = years * 12;
  if (surplusMonthly <= 0) return 0;
  return (surplusMonthly * (1 - Math.pow(1 + r, -n))) / r;
}

function Field({ label, hint, value, onChange, prefix = "$" }: { label: string; hint?: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">{prefix}</span>
        <input
          type="text" inputMode="decimal" value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className="w-full rounded-lg border border-line py-3 pl-8 pr-4 text-base focus:border-advance focus:outline-none"
        />
      </div>
    </label>
  );
}

export function Calculator() {
  const [income1, setIncome1] = useState("");
  const [income2, setIncome2] = useState("");
  const [expenses, setExpenses] = useState("");
  const [repayments, setRepayments] = useState("");
  const [cardLimits, setCardLimits] = useState("");
  const [dependants, setDependants] = useState("0");

  const g1 = parseFloat(income1) || 0;
  const g2 = parseFloat(income2) || 0;
  const netMonthly = (netAnnual(g1) + netAnnual(g2)) / 12;

  const deps = Math.min(parseFloat(dependants) || 0, 8);
  const single = g2 === 0;
  // HEM-like floor: base living cost + per dependant (rough, indicative)
  const hemFloor = (single ? 2_300 : 3_400) + deps * 550;
  const livingExp = Math.max(parseFloat(expenses) || 0, hemFloor);

  const commitments = parseFloat(repayments) || 0;
  const cardLoad = ((parseFloat(cardLimits) || 0) * 0.038);

  const surplus = netMonthly - livingExp - commitments - cardLoad;
  const assessRate = 8.9; // ~5.9% typical variable + 3% APRA buffer
  const cap = maxLoan(surplus, assessRate);
  const low = cap * 0.9;
  const high = cap * 1.1;
  const started = g1 > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <Field label="Your income (gross, per year)" hint="Before tax - salary, plus reliable overtime/bonus." value={income1} onChange={setIncome1} />
        <Field label="Partner's income (gross, per year)" hint="Leave blank if applying alone." value={income2} onChange={setIncome2} />
        <Field label="Monthly living expenses" hint="Groceries, transport, bills, subscriptions - lenders apply a minimum benchmark even if you enter less." value={expenses} onChange={setExpenses} />
        <Field label="Other loan repayments (monthly)" hint="Car loans, personal loans, HELP repayments." value={repayments} onChange={setRepayments} />
        <Field label="Credit card limits (total)" hint="Lenders assess ~3.8% of the LIMIT per month, even if you never use the cards." value={cardLimits} onChange={setCardLimits} />
        <Field label="Dependants" hint="Children or others you support." value={dependants} onChange={setDependants} prefix="#" />
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:self-start">
        {!started ? (
          <p className="text-white/75">Enter your income to estimate borrowing power.</p>
        ) : surplus <= 0 ? (
          <div className="text-white/80">
            <p className="font-display text-2xl font-semibold">The maths is tight right now.</p>
            <p className="mt-3 text-sm text-white/70">
              On these numbers the assessed surplus is negative - but the inputs matter
              enormously: card limits you don&apos;t use, expenses that could be trimmed for
              three months, or a different income treatment can all change the answer. This is
              exactly the situation where a broker call is worth the most.
            </p>
          </div>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">Estimated borrowing power</dt>
              <dd className="mt-1 font-display text-4xl font-semibold text-advance-bright">
                {fmt(low)} - {fmt(high)}
              </dd>
              <p className="mt-2 text-xs text-white/55">
                Assessed at {assessRate}% (a typical rate plus the ~3% APRA buffer) over 30
                years. Lenders differ by six figures on the same inputs - that spread is the
                range, and finding your best lender is the job.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Net income /mo</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{fmt(netMonthly)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Assessed surplus /mo</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{fmt(surplus)}</dd>
              </div>
            </div>
            {(parseFloat(cardLimits) || 0) > 0 && (
              <p className="text-sm text-white/70">
                Those card limits cost you about{" "}
                <strong className="text-advance-bright">{fmt(maxLoan(cardLoad, assessRate))}</strong> of borrowing
                power - cancelling or reducing unused limits is the fastest capacity win there is.
              </p>
            )}
            <div className="border-t border-white/15 pt-5 text-sm text-white/70">
              <p>
                Next: what does that borrowing cost per month? The{" "}
                <a href="/home-loan-repayment-calculator" className="font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2">
                  repayments calculator
                </a>{" "}
                takes ten seconds.
              </p>
            </div>
          </dl>
        )}
        <p className="mt-6 border-t border-white/15 pt-4 text-xs text-white/50">
          Indicative estimate only - not a quote, an offer of credit or a suggestion of what
          you should borrow. Lender policies, income types and expenses treatment vary.
        </p>
      </div>
    </div>
  );
}
