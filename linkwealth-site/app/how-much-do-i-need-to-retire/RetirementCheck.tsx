"use client";

import { useState } from "react";
import { Pill } from "@/components/v2";

// Retirement readiness check - the Wealth division's engine, in the family
// tradition (Advisors health check, Books Xero check, HQ performance check).
// No email wall: the verdict shows immediately, the CTA follows it.
//
// Model, stated on the page: everything in today's dollars. Super compounds
// at a REAL return (default 4% p.a. = growth-fund long-run return net of
// fees and inflation); contributions stay flat in today's dollars. Capital
// needed = annual lifestyle target x 25 (the 4% drawdown rule of thumb),
// with the ASFA lump sums shown alongside because they assume a part Age
// Pension and land much lower.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

// ASFA Retirement Standard annual budgets (2025-26, rounded to the nearest
// $500 - the live figures move quarterly; check asfa.asn.au).
const LIFESTYLES = [
  { key: "modest-single", label: "Modest · single", annual: 33500 },
  { key: "modest-couple", label: "Modest · couple", annual: 48500 },
  { key: "comfortable-single", label: "Comfortable · single", annual: 52500 },
  { key: "comfortable-couple", label: "Comfortable · couple", annual: 74000 },
] as const;

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
            suffix ? "px-4 pr-16" : "pl-8 pr-4"
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

export function RetirementCheck() {
  const [age, setAge] = useState("45");
  const [retireAge, setRetireAge] = useState("65");
  const [balance, setBalance] = useState("250000");
  const [contrib, setContrib] = useState("15000");
  const [lifestyle, setLifestyle] = useState<string>("comfortable-couple");
  const [custom, setCustom] = useState("");

  const a = Math.min(Math.max(parseInt(age) || 0, 16), 80);
  const ra = Math.min(Math.max(parseInt(retireAge) || 0, a + 1), 80);
  const b = parseFloat(balance) || 0;
  const c = parseFloat(contrib) || 0;
  const years = ra - a;
  const REAL_RETURN = 0.04;

  const target =
    lifestyle === "custom"
      ? parseFloat(custom) || 0
      : LIFESTYLES.find((l) => l.key === lifestyle)!.annual;

  // Project in today's dollars.
  let projected = b;
  for (let y = 0; y < years; y++) projected = projected * (1 + REAL_RETURN) + c;

  const needed = target * 25;
  const gap = needed - projected;
  const onTrack = gap <= 0;
  // Extra per year to close the gap: annuity factor at the real return.
  const factor = (Math.pow(1 + REAL_RETURN, years) - 1) / REAL_RETURN;
  const extraPerYear = years > 0 && gap > 0 ? gap / factor : 0;

  const valid = a > 0 && ra > a && target > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5 rounded-[25px] bg-[#f1f1f1] p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Your age" value={age} onChange={setAge} suffix="years" />
          <Field label="Retire at" value={retireAge} onChange={setRetireAge} suffix="years" />
        </div>
        <Field
          label="Super balance today"
          hint="Combined balance if you're checking as a couple."
          value={balance}
          onChange={setBalance}
        />
        <Field
          label="Going into super each year"
          hint="Employer contributions plus anything extra, before contributions tax."
          value={contrib}
          onChange={setContrib}
        />
        <div>
          <p className="text-sm font-bold text-ink">Retirement lifestyle</p>
          <p className="mt-0.5 text-xs text-ink/50">
            ASFA Retirement Standard annual budgets (2025-26, rounded), or set your own.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {LIFESTYLES.map((l) => (
              <button
                key={l.key}
                type="button"
                aria-pressed={lifestyle === l.key}
                onClick={() => setLifestyle(l.key)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                  lifestyle === l.key
                    ? "border-wealth bg-wealth text-white"
                    : "border-ink/15 text-ink/65 hover:border-ink"
                }`}
              >
                {l.label} · {fmt(l.annual)}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={lifestyle === "custom"}
              onClick={() => setLifestyle("custom")}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                lifestyle === "custom"
                  ? "border-wealth bg-wealth text-white"
                  : "border-ink/15 text-ink/65 hover:border-ink"
              }`}
            >
              My own number
            </button>
          </div>
          {lifestyle === "custom" && (
            <div className="mt-3">
              <Field label="Annual retirement income target" value={custom} onChange={setCustom} />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[25px] bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:self-start">
        {!valid ? (
          <p className="text-white/75">Fill in your numbers to see where you stand.</p>
        ) : (
          <>
            <p
              className={`inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${
                onTrack ? "bg-wealth-bright text-ink" : "bg-white/10 text-white"
              }`}
            >
              {onTrack ? "On track" : "Gap to close"}
            </p>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Projected super at {ra} (today&apos;s dollars)
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-wealth-bright">
                  {fmt(projected)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Capital for {fmt(target)}/yr (rule of 25)
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold">{fmt(needed)}</dd>
                <p className="mt-1 text-xs text-white/55">
                  The ASFA lump sums are much lower (roughly $595k single / $690k couple for
                  comfortable) because they assume a part Age Pension tops you up.
                </p>
              </div>
              <div className="border-t border-white/15 pt-5">
                <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  {onTrack ? "Projected surplus" : "Projected gap"}
                </dt>
                <dd
                  className={`mt-1 font-display text-4xl font-semibold ${
                    onTrack ? "text-wealth-bright" : "text-red-300"
                  }`}
                >
                  {fmt(Math.abs(gap))}
                </dd>
                {!onTrack && extraPerYear > 0 && (
                  <p className="mt-2 text-sm text-white/70">
                    Closing it from here means roughly{" "}
                    <strong className="text-white">{fmt(extraPerYear)}/yr</strong> more into
                    super (or a strategy that works harder; that&apos;s the conversation).
                  </p>
                )}
              </div>
            </dl>
            <div className="mt-7">
              <Pill href="#contact" variant="onDark">
                {onTrack ? "Keep it on track: talk to an adviser" : "Close the gap: book a free call"}
              </Pill>
            </div>
          </>
        )}
        <div className="mt-8 border-t border-white/15 pt-5 text-xs leading-relaxed text-white/60">
          <p>
            Everything is in today&apos;s dollars, assuming a 4% p.a. real return (a typical
            growth fund&apos;s long-run return net of fees and inflation, not guaranteed) and
            steady contributions. It ignores tax nuances, career breaks, the Age Pension and
            market sequence risk: the things a real plan models. General information only,
            not personal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
