"use client";

import { useState } from "react";

// The net worth calculator - Richard's ask (8 Aug): the Wealth Check scores
// planning behaviours, so the actual arithmetic lives here as its own tool.
// Assets minus liabilities, itemised the way an adviser's fact-find lists
// them, with the property/super/investable split shown so the shape of the
// number is visible, not just the total. Pure arithmetic on-screen -
// nothing stored, nothing sent.

const fmt = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

type Field = { key: string; label: string; hint?: string };

const ASSETS: Field[] = [
  { key: "home", label: "Family home", hint: "Your best estimate of market value today." },
  { key: "property", label: "Investment property", hint: "Combined value if you hold more than one." },
  { key: "superA", label: "Superannuation", hint: "Combined across accounts - and partners, if you plan together." },
  { key: "shares", label: "Shares, ETFs and managed funds", hint: "Outside super." },
  { key: "cash", label: "Cash and savings", hint: "Including offset balances." },
  { key: "business", label: "Business value", hint: "Your share, at a realistic sale price. Rough is fine." },
  { key: "other", label: "Other assets", hint: "Vehicles, collectibles, money owed to you." },
];

const DEBTS: Field[] = [
  { key: "homeLoan", label: "Home loan", hint: "Balance owing." },
  { key: "investLoan", label: "Investment loans", hint: "Property or share investment debt." },
  { key: "cards", label: "Credit cards and personal loans", hint: "Balances that are actually owing." },
  { key: "otherDebt", label: "Other debts", hint: "HECS/HELP, car loans, tax owing." },
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
  const set = (k: string) => (v: string) => setVals((s) => ({ ...s, [k]: v }));
  const num = (k: string) => parseFloat(vals[k]) || 0;

  const assets = ASSETS.reduce((a, f) => a + num(f.key), 0);
  const debts = DEBTS.reduce((a, f) => a + num(f.key), 0);
  const net = assets - debts;
  const started = assets > 0 || debts > 0;

  // the shape of the number - where the wealth actually sits
  const propertyNet = num("home") + num("property") - num("homeLoan") - num("investLoan");
  const superTotal = num("superA");
  const investable = num("shares") + num("cash");
  const split = [
    { label: "Property (net of loans)", value: propertyNet },
    { label: "Superannuation", value: superTotal },
    { label: "Shares and cash", value: investable },
    { label: "Business and other", value: num("business") + num("other") - num("cards") - num("otherDebt") },
  ];
  const splitMax = Math.max(...split.map((s) => Math.abs(s.value)), 1);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
          <p className="eyebrow">
            <span className="text-wealth">What you own</span>
          </p>
          {ASSETS.map((f) => (
            <NumField key={f.key} label={f.label} hint={f.hint} value={vals[f.key] ?? ""} onChange={set(f.key)} />
          ))}
        </div>
        <div className="space-y-5 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
          <p className="eyebrow">
            <span className="text-wealth">What you owe</span>
          </p>
          {DEBTS.map((f) => (
            <NumField key={f.key} label={f.label} hint={f.hint} value={vals[f.key] ?? ""} onChange={set(f.key)} />
          ))}
          <button type="button" onClick={() => setVals({})} className="btn btn-ghost">
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:self-start">
        {!started ? (
          <p className="text-white/75">
            Start entering what you own and owe - the number updates as you type. Nothing you
            enter leaves this page.
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
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Assets</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{fmt(assets)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">Debts</dt>
                <dd className="mt-1 font-display text-xl font-semibold">{fmt(debts)}</dd>
              </div>
            </div>
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
          </dl>
        )}

        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/70">
          <p className="font-semibold text-white">Track it, then stress-test it</p>
          <p className="mt-2">
            Write today&apos;s number down - net worth once a year is the cleanest scoreboard
            your finances have. Then take the{" "}
            <a href="/wealth-health-check" className="font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright">
              Wealth Check
            </a>{" "}
            to see whether the behaviours behind the number are set up to grow it.
          </p>
          <p className="mt-2 text-xs text-white/50">
            Everything is calculated on your screen - nothing is stored or sent. General
            information only, not personal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
