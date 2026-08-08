"use client";

import { useState } from "react";

// The live estimator's exact model, rebuilt without Elementor:
//   value basis = property value - (property value x selling costs %)   [if costs entered]
//   equity      = value basis - (home loan balance + other secured debts)
// Plus one addition the old tool lacked: usable equity at the common 80%
// lender ceiling (0.8 x value - loan), clearly labelled as a rule of thumb.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function NumField({
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
      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
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
              suffix ? "px-4" : "pl-8 pr-4"
            }`}
          />
          {suffix && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </label>
  );
}

export function Calculator() {
  const [value, setValue] = useState("");
  const [loan, setLoan] = useState("");
  const [other, setOther] = useState("");
  const [costs, setCosts] = useState("");

  const v = parseFloat(value) || 0;
  const l = parseFloat(loan) || 0;
  const o = parseFloat(other) || 0;
  const cPct = Math.min(Math.max(parseFloat(costs) || 0, 0), 100);

  const hasValue = v > 0;
  const hasCosts = costs !== "" && cPct > 0;
  const basis = hasCosts ? v - v * (cPct / 100) : v;
  const equity = basis - (l + o);
  const equityPct = hasValue ? (equity / basis) * 100 : 0;
  const usable = 0.8 * v - l;

  function reset() {
    setValue("");
    setLoan("");
    setOther("");
    setCosts("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-xl2 border border-line bg-white p-6 sm:p-8">
        <NumField
          label="Estimated property value"
          hint="Tip: enter your best estimate (e.g., recent appraisal, comparable sales)."
          value={value}
          onChange={setValue}
        />
        <NumField label="Home loan balance owing" value={loan} onChange={setLoan} />
        <NumField
          label="Other secured debts"
          hint="For example: line of credit secured against the property."
          value={other}
          onChange={setOther}
        />
        <NumField
          label="Estimated selling costs (optional)"
          hint="If you’re estimating equity after sale (agent fees, marketing, legal, etc.)."
          value={costs}
          onChange={setCosts}
          suffix="%"
        />
        <button type="button" onClick={reset} className="btn btn-ghost">
          Reset
        </button>
      </div>

      <div className="rounded-xl2 bg-wealth-dark p-6 text-white sm:p-8">
        {!hasValue ? (
          <p className="text-white/75">Enter an estimated property value to see results.</p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Estimated equity
              </dt>
              <dd className="mt-1 font-display text-4xl font-extrabold text-wealth">
                {fmt(equity)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Equity percentage
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">
                {equityPct.toFixed(1)}%
              </dd>
            </div>
            {hasCosts && (
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Value after selling costs
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold">{fmt(basis)}</dd>
              </div>
            )}
            <div className="border-t border-white/15 pt-5">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Usable equity at 80% LVR
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">{fmt(Math.max(usable, 0))}</dd>
              <p className="mt-2 text-xs text-white/55">
                Most lenders let you borrow against up to 80% of your property’s value without
                lenders mortgage insurance. A rule of thumb only - lender policies differ.
              </p>
            </div>
          </dl>
        )}

        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/70">
          <p className="font-semibold text-white">How this estimate is calculated</p>
          <p className="mt-2">
            If selling costs are entered, we estimate: Value after costs = Property value −
            (Property value × selling costs %). Then: Equity = (Value basis) − (Home loan
            balance + other secured debts).
          </p>
          <p className="mt-2">
            This is a simple estimate and does not include unsecured debts, early payout fees,
            tax considerations, or lender policies.
          </p>
        </div>
      </div>
    </div>
  );
}
