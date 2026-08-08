"use client";

import { useState } from "react";

// QLD transfer duty calculator. General brackets + the home concession +
// the post-1-May-2025 first home rules (zero duty on new homes at any
// price; established homes full relief to $700k phasing out at $800k;
// vacant land relief to $350k phasing at $500k). Rates as published by the
// Queensland Revenue Office mid-2026; indicative only.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

// General transfer duty (QLD)
function generalDuty(v: number): number {
  if (v <= 5_000) return 0;
  if (v <= 75_000) return ((v - 5_000) / 100) * 1.5;
  if (v <= 540_000) return 1_050 + ((v - 75_000) / 100) * 3.5;
  if (v <= 1_000_000) return 17_325 + ((v - 540_000) / 100) * 4.5;
  return 38_025 + ((v - 1_000_000) / 100) * 5.75;
}

// Home (owner-occupier) concession: $1 per $100 on the first $350k, then
// general marginal rates above.
function homeDuty(v: number): number {
  if (v <= 350_000) return v * 0.01;
  let d = 3_500;
  const over = (from: number, to: number, rate: number) =>
    Math.max(Math.min(v, to) - from, 0) / 100 * rate;
  d += over(350_000, 540_000, 3.5);
  d += over(540_000, 1_000_000, 4.5);
  d += over(1_000_000, Infinity, 5.75);
  return d;
}

type Buyer = "fh-new" | "fh-established" | "fh-land" | "home" | "investor";

function duty(v: number, b: Buyer): { duty: number; note: string } {
  if (v <= 0) return { duty: 0, note: "" };
  switch (b) {
    case "fh-new":
      return { duty: 0, note: "First home buyers pay no transfer duty on new homes in QLD (from 1 May 2025) - no price cap." };
    case "fh-established": {
      const base = homeDuty(v);
      if (v <= 700_000) return { duty: 0, note: "Full first home concession - no duty up to $700,000." };
      if (v < 800_000) {
        const d = base * Math.min((v - 700_000) / 100_000, 1);
        return { duty: d, note: "Concession phasing out between $700,000 and $800,000 (indicative straight-line estimate - QRO uses a stepped table)." };
      }
      return { duty: base, note: "Above $800,000 the first home concession no longer applies - the owner-occupier home rate applies." };
    }
    case "fh-land": {
      if (v <= 350_000) return { duty: 0, note: "No duty on first-home vacant land up to $350,000." };
      const base = generalDuty(v);
      if (v < 500_000) {
        const d = base * Math.min((v - 350_000) / 150_000, 1);
        return { duty: d, note: "Land concession phasing out between $350,000 and $500,000 (indicative straight-line estimate)." };
      }
      return { duty: base, note: "Above $500,000 the vacant land concession no longer applies." };
    }
    case "home":
      return { duty: homeDuty(v), note: "Owner-occupier (home) concession rate applied - you must move in within a year and live there for one year." };
    case "investor":
      return { duty: generalDuty(v), note: "General transfer duty rates - no concession for investment purchases." };
  }
}

const OPTIONS: { key: Buyer; label: string }[] = [
  { key: "fh-new", label: "First home - new build / off the plan" },
  { key: "fh-established", label: "First home - established home" },
  { key: "fh-land", label: "First home - vacant land" },
  { key: "home", label: "Home to live in (not first)" },
  { key: "investor", label: "Investment property" },
];

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
            {OPTIONS.map((o) => (
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
