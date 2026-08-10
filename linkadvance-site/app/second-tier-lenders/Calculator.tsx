"use client";

import { useState } from "react";

// Weighted average cost of capital across a tiered portfolio. Built from
// Chris Tinta's brief (10 Aug 2026): rates prefill with per-tier defaults but
// are fully editable, because the honest answer to "what rate would I get?"
// is that it depends, and a tool that pretends otherwise goes stale the week
// after it ships. The user's own rates drive the result, so nothing here
// needs maintaining and nothing here is a quote.
//
// The maths lives in lib/wacc.ts so the tables further down the page are
// generated from the same model this runs.

import {
  type Loan,
  type Tier,
  TIERS,
  WORKED_EXAMPLE,
  money,
  pct,
  tierMeta,
  wacc,
  withNextLoan,
} from "@/lib/wacc";

const num = (v: string) => parseFloat(v.replace(/[^\d.]/g, "")) || 0;

// AUD-formatted while you type, so a seven-figure debt stays readable.
const group = (v: string) => {
  const raw = v.replace(/[^\d]/g, "");
  return raw ? Number(raw).toLocaleString("en-AU") : "";
};

function TierPicker({
  value,
  onChange,
  idPrefix,
}: {
  value: Tier;
  onChange: (t: Tier) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lender tier">
      {TIERS.map((t) => (
        <button
          key={t.tier}
          type="button"
          id={`${idPrefix}-tier-${t.tier}`}
          onClick={() => onChange(t.tier)}
          aria-pressed={value === t.tier}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            value === t.tier
              ? "border-transparent bg-advance text-white"
              : "border-line bg-white text-ink/70 hover:border-advance/40 hover:text-ink"
          }`}
        >
          {t.short}
        </button>
      ))}
    </div>
  );
}

function MoneyField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-xs font-bold uppercase tracking-wider text-ink/55">{label}</span>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(group(e.target.value))}
          className="w-full rounded-lg border border-line py-2.5 pl-7 pr-3 text-base tabular-nums focus:border-advance focus:outline-none"
        />
      </div>
    </label>
  );
}

function RateField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-xs font-bold uppercase tracking-wider text-ink/55">{label}</span>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          className="w-full rounded-lg border border-line py-2.5 pl-3 pr-8 text-base tabular-nums focus:border-advance focus:outline-none"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
          %
        </span>
      </div>
    </label>
  );
}

type Row = { id: string; name: string; tier: Tier; debt: string; rate: string };

const rowsFromExample = (): Row[] =>
  WORKED_EXAMPLE.map((l) => ({
    id: l.id,
    name: l.name,
    tier: l.tier,
    debt: l.debt.toLocaleString("en-AU"),
    rate: l.rate.toFixed(2),
  }));

export function Calculator() {
  const [rows, setRows] = useState<Row[]>(rowsFromExample);
  const [seq, setSeq] = useState(rows.length);
  const [nextTier, setNextTier] = useState<Tier>(3);
  const [nextDebt, setNextDebt] = useState("800,000");
  const [nextRate, setNextRate] = useState("8.00");

  const loans: Loan[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    tier: r.tier,
    debt: num(r.debt),
    rate: num(r.rate),
  }));

  const result = wacc(loans);
  const projection = withNextLoan(loans, {
    tier: nextTier,
    debt: num(nextDebt),
    rate: num(nextRate),
  });

  const update = (id: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const add = () => {
    const n = seq + 1;
    setSeq(n);
    setRows((rs) => [
      ...rs,
      { id: `l${n}`, name: `Property ${n}`, tier: 1, debt: "", rate: tierMeta(1).defaultRate.toFixed(2) },
    ]);
  };

  const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

  // Changing a loan's tier moves the rate to that tier's default, but only
  // while the rate is still whatever the previous default was. Once someone
  // types their real rate, we leave it alone.
  const setTier = (id: string, tier: Tier) =>
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const wasDefault = num(r.rate) === tierMeta(r.tier).defaultRate;
        return { ...r, tier, rate: wasDefault ? tierMeta(tier).defaultRate.toFixed(2) : r.rate };
      })
    );

  const showing = result.totalDebt > 0;
  const nextDebtValue = num(nextDebt);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink/55">Your loans</p>
        {rows.map((r, i) => (
          <div key={r.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <input
                aria-label={`Loan ${i + 1} name`}
                value={r.name}
                onChange={(e) => update(r.id, { name: e.target.value })}
                className="w-full max-w-[220px] rounded border border-transparent bg-transparent px-1 py-0.5 font-display text-lg font-bold tracking-tight text-ink hover:border-line focus:border-advance focus:outline-none"
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  aria-label={`Remove ${r.name}`}
                  className="shrink-0 rounded-full p-1 text-xl leading-none text-ink/30 transition hover:bg-neutral-100 hover:text-ink"
                >
                  ×
                </button>
              )}
            </div>
            <div className="mt-3">
              <TierPicker value={r.tier} onChange={(t) => setTier(r.id, t)} idPrefix={r.id} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MoneyField
                id={`${r.id}-debt`}
                label="Debt"
                value={r.debt}
                onChange={(v) => update(r.id, { debt: v })}
              />
              <RateField
                id={`${r.id}-rate`}
                label="Rate % p.a."
                value={r.rate}
                onChange={(v) => update(r.id, { rate: v })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="w-full rounded-2xl border border-dashed border-ink/20 py-4 text-sm font-semibold text-ink/60 transition hover:border-advance hover:text-ink"
        >
          + Add a loan
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-white/55">
            Your weighted average cost of capital
          </p>
          {!showing ? (
            <p className="mt-4 text-white/70">
              Enter a debt amount to see your blended rate across the tiers.
            </p>
          ) : (
            <>
              <p className="mt-2 font-display text-5xl font-semibold text-advance-bright">
                {result.wacc!.toFixed(2)}
                <span className="ml-1 align-baseline text-2xl font-normal text-white/60">% p.a.</span>
              </p>

              {/* Tier split, drawn straight from the model's shares */}
              <div
                className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-white/10"
                role="img"
                aria-label={`Debt split: ${result.byTier
                  .filter((t) => t.debt > 0)
                  .map((t) => `${tierMeta(t.tier).short} ${Math.round(t.share * 100)}%`)
                  .join(", ")}`}
              >
                {result.byTier
                  .filter((t) => t.debt > 0)
                  .map((t) => (
                    <span
                      key={t.tier}
                      style={{ width: `${t.share * 100}%`, backgroundColor: tierMeta(t.tier).fill }}
                    />
                  ))}
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/55">
                    Total debt
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tabular-nums">
                    {money(result.totalDebt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/55">
                    Annual interest cost
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tabular-nums">
                    {money(result.annualInterest)}
                  </dd>
                </div>
              </dl>

              <ul className="mt-5 space-y-2 border-t border-white/15 pt-5 text-sm">
                {result.byTier.map((t) => (
                  <li key={t.tier} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: t.debt > 0 ? tierMeta(t.tier).fill : "transparent",
                        // Tier three's brand tone is a dark olive, which
                        // disappears on the ink panel without a ring.
                        boxShadow: t.debt > 0 ? "0 0 0 1px rgba(255,255,255,.35)" : "none",
                        border: t.debt > 0 ? "none" : "1px solid rgba(255,255,255,.3)",
                      }}
                    />
                    <span className={t.debt > 0 ? "text-white/80" : "text-white/40"}>
                      {tierMeta(t.tier).label}
                    </span>
                    <span
                      className={`ml-auto shrink-0 tabular-nums ${
                        t.debt > 0 ? "text-white" : "text-white/40"
                      }`}
                    >
                      {money(t.debt)}
                      {t.rate !== null && ` @ ${pct(t.rate)}`}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* The conversion moment, per the brief: what does the next loan do? */}
        <div className="rounded-3xl border border-advance/30 bg-advance-light/60 p-6 sm:p-8">
          <p className="font-display text-lg font-bold tracking-tight text-ink">Test your next loan</p>
          <p className="mt-1 text-sm text-ink/70">
            Thinking about your next purchase? See what it does to your blended rate.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <MoneyField id="next-debt" label="New debt" value={nextDebt} onChange={setNextDebt} />
            <RateField id="next-rate" label="Rate % p.a." value={nextRate} onChange={setNextRate} />
          </div>
          <div className="mt-3">
            <TierPicker value={nextTier} onChange={setNextTier} idPrefix="next" />
          </div>

          {showing && nextDebtValue > 0 && projection.deltaPoints !== null && (
            <div className="mt-5 border-t border-advance/30 pt-4 text-sm leading-relaxed text-ink/80">
              <p>
                Adding <strong className="text-ink">{money(nextDebtValue)}</strong> at{" "}
                <strong className="text-ink">{pct(num(nextRate))}</strong> takes your total debt to{" "}
                <strong className="text-ink">{money(projection.after.totalDebt)}</strong> and your
                blended rate to{" "}
                <strong className="text-ink">{pct(projection.after.wacc!)}</strong>{" "}
                <span className="whitespace-nowrap">
                  ({projection.deltaPoints >= 0 ? "+" : ""}
                  {projection.deltaPoints.toFixed(2)} pts)
                </span>
                . Interest cost rises {money(projection.extraInterest)} a year.
              </p>
              <p className="mt-2 text-ink/60">
                The question is whether the whole portfolio still stacks up at that blended rate,
                not whether {pct(num(nextRate))} sounds expensive on its own.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed text-ink/50">
          General information only. Rates are yours to enter and are illustrative, not lender
          quotes. This is the debt-weighted average interest rate across the loans you enter: it
          does not account for fees, loan terms, tax treatment or the cost of your equity. Your
          borrowing capacity and loan suitability depend on your circumstances.
        </p>
      </div>
    </div>
  );
}
