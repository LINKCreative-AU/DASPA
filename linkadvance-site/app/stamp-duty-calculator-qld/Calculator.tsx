"use client";

import { useState } from "react";

// QLD transfer duty calculator. The rates, concessions and buyer options
// all live in lib/qld-duty.ts so this tool and the tables on the page are
// generated from one model and cannot disagree. Rates as published by the
// Queensland Revenue Office, checked August 2026; indicative only.

import { BUYER_OPTIONS, duty, generalDuty, type Buyer } from "@/lib/qld-duty";

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export function Calculator() {
  const [value, setValue] = useState("");
  const [buyer, setBuyer] = useState<Buyer>("fh-established");

  const v = parseFloat(value) || 0;
  const res = duty(v, buyer);
  const general = generalDuty(v);
  const saving = Math.max(general - res.duty, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <label className="block">
          <span className="block text-sm font-bold text-ink">Property value</span>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">$</span>
            <input
              type="text" inputMode="decimal" value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))}
              className="w-full rounded-lg border border-line py-3 pl-8 pr-4 text-base focus:border-advance focus:outline-none"
            />
          </div>
        </label>
        <div>
          <span className="block text-sm font-bold text-ink">I&apos;m buying as</span>
          <div className="mt-2.5 flex flex-col items-start gap-2">
            {BUYER_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                aria-pressed={buyer === o.key}
                onClick={() => setBuyer(o.key)}
                className={`rounded-full border-2 px-4 py-2 text-left text-sm font-semibold transition ${
                  buyer === o.key ? "border-transparent bg-advance text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:self-start">
        {v <= 0 ? (
          <p className="text-white/75">Enter a property value to calculate QLD transfer duty.</p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">Estimated transfer (stamp) duty</dt>
              <dd className={`mt-1 font-display text-4xl font-semibold ${res.duty === 0 ? "text-advance-bright" : ""}`}>
                {fmt(Math.round(res.duty))}
              </dd>
              <p className="mt-2 text-sm text-white/70">{res.note}</p>
            </div>
            {saving > 0 && (
              <div className="border-t border-white/15 pt-5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Saving vs investor rates</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-advance-bright">{fmt(Math.round(saving))}</dd>
              </div>
            )}
            <p className="border-t border-white/15 pt-4 text-xs text-white/50">
              Indicative only, based on QRO rates current mid-2026; excludes registration fees
              and foreign surcharges. Official calculator: qro.qld.gov.au.
            </p>
          </dl>
        )}
      </div>
    </div>
  );
}
