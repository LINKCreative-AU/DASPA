"use client";

import { useState } from "react";

// Repayments calculator - house pattern (live as you type, dark result
// panel, stress test the banks actually apply). The amortisation maths lives
// in lib/loan-model.ts so the tool and the page tables agree. Indicative only.

import { extraRepaymentEffect, pmt, totalInterest } from "@/lib/loan-model";

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function Field({ label, hint, value, onChange, suffix }: { label: string; hint?: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="relative mt-2">
        {!suffix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">$</span>}
        <input
          type="text" inputMode="decimal" value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className={`w-full rounded-lg border border-line py-3 text-base focus:border-advance focus:outline-none ${suffix ? "px-4" : "pl-8 pr-4"}`}
        />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">{suffix}</span>}
      </div>
    </label>
  );
}

export function Calculator() {
  const [amount, setAmount] = useState("600000");
  const [rate, setRate] = useState("5.9");
  const [years, setYears] = useState("30");
  const [extra, setExtra] = useState("");

  const P = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const y = Math.min(parseFloat(years) || 30, 40);
  const ex = parseFloat(extra) || 0;

  const monthly = pmt(P, r, y);
  const total = totalInterest(P, r, y);
  const stressed = pmt(P, r + 3, y);
  const { yearsSaved, interestSaved } =
    ex > 0 ? extraRepaymentEffect(P, r, y, ex) : { yearsSaved: 0, interestSaved: 0 };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <Field label="Loan amount" value={amount} onChange={setAmount} />
        <Field label="Interest rate" hint="Your rate, or the rate you've been quoted." value={rate} onChange={setRate} suffix="% p.a." />
        <Field label="Loan term" value={years} onChange={setYears} suffix="years" />
        <Field label="Extra repayment (optional)" hint="Extra per month on top of the minimum." value={extra} onChange={setExtra} />
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:self-start">
        {P <= 0 ? (
          <p className="text-white/75">Enter a loan amount to see repayments.</p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">Monthly repayment (P&I)</dt>
              <dd className="mt-1 font-display text-4xl font-semibold text-advance-bright">{fmt(monthly)}</dd>
              <p className="mt-1 text-sm text-white/60">
                {fmt(monthly / 2)} fortnightly · {fmt((monthly * 12) / 52)} weekly
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Total interest</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{fmt(total)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">At +3% (bank stress test)</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{fmt(stressed)}/mo</dd>
              </div>
            </div>
            <p className="text-xs text-white/55">
              Lenders assess your application at roughly 3 percentage points above the actual
              rate. If the stressed repayment scares you, so will the bank's calculator.
            </p>
            {ex > 0 && interestSaved > 0 && (
              <div className="border-t border-white/15 pt-5">
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  With {fmt(ex)}/month extra
                </dt>
                <dd className="mt-2 text-sm text-white/80">
                  Paid off about <strong className="text-advance-bright">{yearsSaved.toFixed(1)} years sooner</strong>, saving
                  roughly <strong className="text-advance-bright">{fmt(interestSaved)}</strong> in interest.
                </dd>
              </div>
            )}
            <div className="border-t border-white/15 pt-5 text-sm text-white/70">
              <p>
                Indicative only: repayments vary with fees, offsets and rate changes. The real
                question is whether {fmt(monthly)} is the sharpest the market offers for your
                situation:{" "}
                <a href="/home-loan-health-check" className="font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2">
                  check your loan in 2 minutes
                </a>
                .
              </p>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
