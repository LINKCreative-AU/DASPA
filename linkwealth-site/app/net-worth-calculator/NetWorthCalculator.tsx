"use client";

import { useState } from "react";
import { ABS_BANDS } from "./abs";

// The net worth calculator, best-in-market pass (James, 8 Aug). The AU SERP
// leader (Moneysmart) is a bare form; the compare intent ranks separately
// (ACOSS). This combines both and adds what advisers actually read off a
// balance sheet: quick fields with an optional deeper itemisation
// (progressive disclosure - Richard's "deeper calc if they choose"), liquid
// net worth, debt-to-asset ratio, the where-it-sits split, an ABS age-band
// comparison, and a copy-my-summary button. Pure arithmetic on-screen -
// nothing stored, nothing sent.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

type Field = { key: string; label: string; hint?: string; detail?: boolean; quickLabel?: string };

const ASSETS: Field[] = [
  { key: "home", label: "Family home", hint: "Your best estimate of market value today." },
  { key: "property", label: "Investment property", hint: "Combined value if you hold more than one." },
  { key: "superA", label: "Superannuation", hint: "Combined across accounts (and partners, if you plan together)." },
  { key: "shares", label: "Shares, ETFs and managed funds", hint: "Outside super." },
  { key: "cash", label: "Cash and savings", hint: "Including offset balances." },
  { key: "business", label: "Business value", hint: "Your share, at a realistic sale price. Rough is fine.", detail: true },
  { key: "contents", label: "Home contents and vehicles", hint: "Insured value is a good proxy.", detail: true },
  { key: "crypto", label: "Crypto and other investments", hint: "At today's prices.", detail: true },
  { key: "owed", label: "Money owed to you", hint: "Loans to family, director loans.", detail: true },
  {
    key: "otherA",
    label: "Other assets",
    quickLabel: "Everything else (business, vehicles, contents…)",
    hint: "Anything of real value not listed above.",
  },
];

const DEBTS: Field[] = [
  { key: "homeLoan", label: "Home loan", hint: "Balance owing." },
  { key: "investLoan", label: "Investment loans", hint: "Property or share investment debt." },
  { key: "cards", label: "Credit cards and personal loans", hint: "Balances that are actually owing." },
  { key: "carLoan", label: "Car loans and leases", detail: true },
  { key: "hecs", label: "HECS/HELP", hint: "Interest-free, but it's still money owing.", detail: true },
  {
    key: "otherDebt",
    label: "Other debts",
    quickLabel: "Other debts (car, HECS, tax…)",
    hint: "Tax owing, buy-now-pay-later, anything else.",
  },
];

function NumField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/40">
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className="w-full rounded-lg border border-line py-3 pl-8 pr-4 text-base focus:border-wealth focus:outline-none"
        />
      </div>
    </label>
  );
}

export function NetWorthCalculator() {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [deep, setDeep] = useState(false);
  const [ageBand, setAgeBand] = useState("");
  const [copied, setCopied] = useState(false);
  const set = (k: string) => (v: string) => setVals((s) => ({ ...s, [k]: v }));
  const num = (k: string) => parseFloat(vals[k]) || 0;

  const visible = (fields: Field[]) => fields.filter((f) => deep || !f.detail);
  const assets = ASSETS.reduce((a, f) => a + num(f.key), 0);
  const debts = DEBTS.reduce((a, f) => a + num(f.key), 0);
  const net = assets - debts;
  const started = assets > 0 || debts > 0;

  // adviser diagnostics
  const liquid = num("cash") + num("shares") + num("crypto") - num("cards");
  const debtRatio = assets > 0 ? (debts / assets) * 100 : 0;

  // the shape of the number - where the wealth actually sits
  const propertyNet = num("home") + num("property") - num("homeLoan") - num("investLoan");
  const split = [
    { label: "Property (net of loans)", value: propertyNet },
    { label: "Superannuation", value: num("superA") },
    { label: "Shares, cash and crypto", value: num("shares") + num("cash") + num("crypto") },
    {
      label: "Business and other",
      value:
        num("business") + num("contents") + num("owed") + num("otherA") -
        num("cards") - num("carLoan") - num("hecs") - num("otherDebt"),
    },
  ];
  const splitMax = Math.max(...split.map((s) => Math.abs(s.value)), 1);
  const absBand = ABS_BANDS.find((b) => b.band === ageBand);

  async function copySummary() {
    const lines = [
      `My net worth: ${fmt(net)} (assets ${fmt(assets)} − debts ${fmt(debts)})`,
      `Liquid net worth: ${fmt(liquid)} · Debt-to-asset ratio: ${debtRatio.toFixed(0)}%`,
      ...split.map((s) => `${s.label}: ${fmt(s.value)}`),
      `Calculated at wealth.link.com.au/net-worth-calculator`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable - no-op */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <div className="space-y-5 rounded-[25px] bg-[#f1f1f1] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">
              <span className="text-wealth">What you own</span>
            </p>
            <button
              type="button"
              onClick={() => setDeep(!deep)}
              aria-pressed={deep}
              className={`rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition ${
                deep ? "border-transparent bg-wealth text-white" : "border-ink/15 text-ink/60 hover:border-ink"
              }`}
            >
              {deep ? "✓ Detailed" : "+ More detail"}
            </button>
          </div>
          {visible(ASSETS).map((f) => (
            <NumField
              key={f.key}
              label={!deep && f.quickLabel ? f.quickLabel : f.label}
              hint={f.hint}
              value={vals[f.key] ?? ""}
              onChange={set(f.key)}
            />
          ))}
        </div>
        <div className="space-y-5 rounded-[25px] bg-[#f1f1f1] p-6 sm:p-8">
          <p className="eyebrow">
            <span className="text-wealth">What you owe</span>
          </p>
          {visible(DEBTS).map((f) => (
            <NumField
              key={f.key}
              label={!deep && f.quickLabel ? f.quickLabel : f.label}
              hint={f.hint}
              value={vals[f.key] ?? ""}
              onChange={set(f.key)}
            />
          ))}
          <button type="button" onClick={() => setVals({})} className="btn btn-ghost">
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-[25px] bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:self-start">
        {!started ? (
          <p className="text-white/75">
            Start entering what you own and owe. The number updates as you type. Use{" "}
            <strong className="text-white">+ More detail</strong> for the full itemised
            balance sheet. Nothing you enter leaves this page.
          </p>
        ) : (
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Your net worth
              </dt>
              <dd className={`mt-1 font-display text-4xl font-semibold ${net < 0 ? "text-red-300" : "text-wealth-bright"}`}>
                {fmt(net)}
              </dd>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5 sm:grid-cols-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Assets</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{fmt(assets)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Debts</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{fmt(debts)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Liquid</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{fmt(liquid)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Debt ratio</dt>
                <dd className="mt-1 font-display text-lg font-semibold">{debtRatio.toFixed(0)}%</dd>
              </div>
            </div>
            <p className="text-xs text-white/55">
              Liquid = cash, shares and crypto minus card and personal-loan balances: the
              wealth you could actually reach within days. Debt ratio = total debts as a share
              of total assets.
            </p>
            <div className="border-t border-white/15 pt-5">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                Where it sits
              </dt>
              <dd className="mt-3 space-y-3">
                {split.map((s) => (
                  <div key={s.label} className="grid grid-cols-[9rem_1fr_auto] items-center gap-3 text-sm">
                    <span className="text-white/70">{s.label}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${s.value < 0 ? "bg-red-400" : "bg-wealth-bright"}`}
                        style={{ width: `${(Math.abs(s.value) / splitMax) * 100}%` }}
                      />
                    </div>
                    <span className="text-right font-semibold tabular-nums">{fmt(s.value)}</span>
                  </div>
                ))}
              </dd>
              <p className="mt-3 text-xs text-white/55">
                The shape matters as much as the total: wealth concentrated in the family home
                can&apos;t pay for groceries in retirement, and wealth locked in super can&apos;t
                fund life before preservation age.
              </p>
            </div>

            {/* the ABS age comparison - the thing no other AU calculator does */}
            <div className="border-t border-white/15 pt-5">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/60">
                How does it compare?
              </dt>
              <dd className="mt-3">
                <select
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white focus:border-white focus:outline-none [&>option]:text-ink"
                >
                  <option value="">Select your age group (optional)</option>
                  {ABS_BANDS.map((b) => (
                    <option key={b.band} value={b.band}>
                      {b.band}
                    </option>
                  ))}
                </select>
                {absBand && (
                  <p className="mt-3 text-sm text-white/75">
                    The ABS puts the <em>average</em> household net worth for the {absBand.band}{" "}
                    age group at <strong className="text-white">{fmt(absBand.mean)}</strong>{" "}
                    (2019-20 survey, the latest age breakdown). Averages are pulled up hard by
                    the wealthiest households (the national median that year was roughly half
                    the mean), so treat it as a rough marker of the curve, not a target.{" "}
                    <a href="#by-age" className="font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright">
                      Full table below
                    </a>
                    .
                  </p>
                )}
              </dd>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/15 pt-5">
              <button type="button" onClick={copySummary} className="btn bg-white text-ink hover:bg-neutral-100">
                {copied ? "Copied ✓" : "Copy my summary"}
              </button>
            </div>
          </dl>
        )}

        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/70">
          <p className="font-semibold text-white">Track it, then stress-test it</p>
          <p className="mt-2">
            Write today&apos;s number down: net worth once a year is the cleanest scoreboard
            your finances have. Then take the{" "}
            <a href="/wealth-health-check" className="font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright">
              Wealth Check
            </a>{" "}
            to see whether the behaviours behind the number are set up to grow it.
          </p>
          <p className="mt-2 text-xs text-white/50">
            Everything is calculated on your screen. Nothing is stored or sent. General
            information only, not personal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
