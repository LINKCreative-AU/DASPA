"use client";

import { useState } from "react";

// LMI estimator - indicative premium ranges by LVR and loan-size band,
// modelled on published insurer estimator outputs (rates differ by insurer
// and lender; this brackets them). The avoid-LMI paths are the broker angle
// none of the ranking calculators carry.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

// Indicative premium ranges as % of loan: rows are [low, high] for LVR
// bands <=85 / <=90 / <=95, by loan-size band.
const BANDS: { maxLoan: number; rates: [number, number][] }[] = [
  { maxLoan: 300_000, rates: [[0.6, 0.9], [1.2, 1.7], [2.2, 3.2]] },
  { maxLoan: 600_000, rates: [[0.7, 1.1], [1.5, 2.1], [2.8, 4.0]] },
  { maxLoan: 1_000_000, rates: [[0.9, 1.4], [1.9, 2.6], [3.4, 4.6]] },
];

function premiumRange(loan: number, lvr: number): [number, number] | null {
  if (lvr <= 80 || lvr > 95 || loan <= 0) return null;
  const band = BANDS.find((b) => loan <= b.maxLoan) ?? BANDS[BANDS.length - 1];
  const row = lvr <= 85 ? band.rates[0] : lvr <= 90 ? band.rates[1] : band.rates[2];
  return [(loan * row[0]) / 100, (loan * row[1]) / 100];
}

function Field({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">$</span>
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
  const [value, setValue] = useState("");
  const [deposit, setDeposit] = useState("");

  const v = parseFloat(value) || 0;
  const d = parseFloat(deposit) || 0;
  const loan = Math.max(v - d, 0);
  const lvr = v > 0 ? (loan / v) * 100 : 0;
  const range = premiumRange(loan, lvr);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <Field label="Property value" value={value} onChange={setValue} />
        <Field label="Your deposit" hint="Cash plus any grant you'll put in." value={deposit} onChange={setDeposit} />
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:self-start">
        {v <= 0 ? (
          <p className="text-white/75">Enter a property value and deposit to estimate LMI.</p>
        ) : (
          <dl className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Loan amount</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{fmt(loan)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">LVR</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{lvr.toFixed(1)}%</dd>
              </div>
            </div>
            <div className="border-t border-white/15 pt-5">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">Estimated LMI premium</dt>
              {lvr <= 80 ? (
                <dd className="mt-1 font-display text-3xl font-semibold text-advance-bright">$0</dd>
              ) : lvr > 95 ? (
                <dd className="mt-2 text-sm text-white/80">
                  Above 95% LVR, standard lending generally isn&apos;t available, but the First
                  Home Guarantee&apos;s 5% path or a guarantor may be.
                </dd>
              ) : (
                <dd className="mt-1 font-display text-3xl font-semibold text-advance-bright">
                  {range ? `${fmt(range[0])} to ${fmt(range[1])}` : "-"}
                </dd>
              )}
              {lvr <= 80 && v > 0 && (
                <p className="mt-2 text-sm text-white/70">
                  At 80% LVR or below, lenders don&apos;t charge LMI. Your deposit clears the line.
                </p>
              )}
              {lvr > 80 && lvr <= 95 && (
                <p className="mt-2 text-xs text-white/55">
                  Indicative range modelled on published insurer tables. The exact premium
                  varies by lender, insurer and whether it&apos;s capitalised into the loan.
                </p>
              )}
            </div>
            {lvr > 80 && (
              <div className="border-t border-white/15 pt-5">
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">Ways to avoid it</dt>
                <dd className="mt-2 space-y-2 text-sm text-white/80">
                  <p>· <strong className="text-white">First Home Guarantee</strong>: eligible first home buyers pay no LMI with 5% down</p>
                  <p>· <strong className="text-white">Guarantor</strong>: family security takes the effective LVR to 80% or below</p>
                  <p>· <strong className="text-white">Professional waivers</strong>: some lenders waive LMI to 90% for certain professions</p>
                  <p>· <strong className="text-white">A bigger deposit</strong>: each LVR band down cuts the premium sharply</p>
                </dd>
              </div>
            )}
          </dl>
        )}
        <p className="mt-6 border-t border-white/15 pt-4 text-xs text-white/50">
          General information only, not a quote. LMI protects the lender, not you.
        </p>
      </div>
    </div>
  );
}
