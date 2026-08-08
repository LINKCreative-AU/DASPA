"use client";

import { useState } from "react";

// Debt recycling estimator - "debt recycling calculator" is 518/mo at KD 0
// and nobody ranking for the head term ships one. The model is deliberately
// simple and stated on the page:
//
// Each year you direct an amount C at your finances.
//   Pay-down-only: C reduces the home loan, a guaranteed after-tax return at
//   the loan rate (balance compounds at loanRate).
//   Debt recycling: C pays down the loan and is immediately redrawn to
//   invest, so the portfolio compounds at the expected return; the
//   investment-loan interest (loanRate x amount redrawn) becomes
//   tax-deductible, and the annual tax saving is reinvested.
// Net position = portfolio value minus the investment loan (redrawn total).

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="relative mt-2">
        {!suffix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">
            $
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className={`w-full rounded-lg border border-line py-3 text-base focus:border-wealth focus:outline-none ${
            suffix ? "px-4 pr-10" : "pl-8 pr-4"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function DebtRecyclingCalculator() {
  const [annual, setAnnual] = useState("20000");
  const [loanRate, setLoanRate] = useState("6");
  const [invReturn, setInvReturn] = useState("8");
  const [taxRate, setTaxRate] = useState("37");
  const [years, setYears] = useState("10");

  const C = parseFloat(annual) || 0;
  const r = (parseFloat(loanRate) || 0) / 100;
  const g = (parseFloat(invReturn) || 0) / 100;
  const t = Math.min((parseFloat(taxRate) || 0) / 100, 0.6);
  const N = Math.min(Math.max(Math.round(parseFloat(years) || 0), 1), 40);

  // Pay-down-only: contributions compound at the loan rate (interest avoided).
  let payDown = 0;
  // Recycling: portfolio compounds at g; redrawn loan D accrues deductible
  // interest whose tax refund is reinvested.
  let portfolio = 0;
  let redrawn = 0;
  for (let y = 0; y < N; y++) {
    payDown = payDown * (1 + r) + C;
    const refund = redrawn * r * t;
    portfolio = portfolio * (1 + g) + C + refund;
    redrawn += C;
  }
  const recycleNet = portfolio - redrawn + payDown; // loan is repaid then redrawn: paydown benefit kept
  const diff = recycleNet - payDown;

  const valid = C > 0;

  return (
    <div className="not-prose grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <Field
          label="Amount you can direct each year"
          hint="Surplus cash you could put against the mortgage (and redraw to invest)."
          value={annual}
          onChange={setAnnual}
        />
        <Field label="Home loan interest rate" value={loanRate} onChange={setLoanRate} suffix="% p.a." />
        <Field
          label="Expected investment return"
          hint="Total return (income + growth), before tax. Long-run Australian shares have averaged 8-9% p.a. - not guaranteed."
          value={invReturn}
          onChange={setInvReturn}
          suffix="% p.a."
        />
        <Field
          label="Your marginal tax rate"
          hint="Including Medicare levy, e.g. 34.5, 39 or 47."
          value={taxRate}
          onChange={setTaxRate}
          suffix="%"
        />
        <Field label="Timeframe" value={years} onChange={setYears} suffix="years" />
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
        {!valid ? (
          <p className="text-white/75">Enter an annual amount to see the comparison.</p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Paying down the loan only, after {N} years
              </dt>
              <dd className="mt-1 font-display text-3xl font-semibold">{fmt(payDown)}</dd>
              <p className="mt-1 text-xs text-white/55">
                Loan reduction - a guaranteed, tax-free return at your loan rate.
              </p>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Debt recycling, after {N} years
              </dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-wealth-bright">
                {fmt(recycleNet)}
              </dd>
              <p className="mt-1 text-xs text-white/55">
                Portfolio of {fmt(portfolio)} + the same loan reduction − the {fmt(redrawn)}{" "}
                investment loan.
              </p>
            </div>
            <div className="border-t border-white/15 pt-5">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Estimated difference
              </dt>
              <dd
                className={`mt-1 font-display text-4xl font-semibold ${
                  diff >= 0 ? "text-wealth-bright" : "text-red-300"
                }`}
              >
                {diff >= 0 ? "+" : ""}
                {fmt(diff)}
              </dd>
            </div>
          </dl>
        )}
        <div className="mt-8 border-t border-white/15 pt-5 text-xs leading-relaxed text-white/60">
          <p>
            A simplified annual model for illustration only: returns are assumed steady (real
            markets are not), the tax refund on investment-loan interest is reinvested, and
            franking credits, fees, and rate changes are ignored. If your investment return
            ends up below your loan rate, recycling leaves you worse off than paying down the
            loan. General information only - not personal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
