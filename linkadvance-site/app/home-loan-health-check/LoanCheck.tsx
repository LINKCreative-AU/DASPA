"use client";

import { useCallback, useEffect, useState } from "react";

// The Home Loan Health Check - the house wizard (intro band, one question
// per screen, auto-advance, live radar, score ring, snapshot lead form),
// applied to the six things that decide whether a loan is still working:
// rate awareness, review recency, structure, fit, equity and attention.
// Kit rules honoured: a checker is a wizard, not a form; tick-all where
// several answers are true at once; the lead carries the profile.

type Option = { label: string; points: number; none?: boolean; tip?: string };
type Question = {
  key: string;
  stage: string;
  area: string;
  type: "single" | "multi";
  scored?: false;
  label: string;
  hint?: string;
  base?: number;
  lowTip?: string;
  options: Option[];
  tool?: { label: string; href: string };
};

const QUESTIONS: Question[] = [
  {
    key: "context",
    stage: "About the loan",
    area: "Context",
    type: "multi",
    scored: false,
    label: "First - which of these describe your situation?",
    hint: "Tick everything that's true. This doesn't move the score; it shapes the next steps.",
    options: [
      { label: "It's the loan on the home we live in", points: 0 },
      { label: "There's an investment property loan", points: 0 },
      { label: "Some or all of it is on a fixed rate", points: 0 },
      { label: "We're thinking about the next property", points: 0 },
      { label: "Money's tighter than it was", points: 0 },
    ],
  },
  {
    key: "rate",
    stage: "The basics",
    area: "Rate",
    type: "single",
    label: "Do you know your current interest rate?",
    hint: "Not what it was at settlement - what it is today.",
    options: [
      { label: "Honestly, no idea", points: 0, tip: "Your rate is the single most expensive thing to not know - find it on your statement or app in two minutes, then compare it. Loyalty is priced." },
      { label: "Roughly", points: 0.4, tip: "Close enough to start - now compare it against what your own lender offers new customers for the same loan." },
      { label: "Exactly", points: 0.7, tip: "Knowing it is half the job; the other half is knowing what the market (and your own lender's new customers) pay." },
      { label: "Exactly - and I've compared it recently", points: 1 },
    ],
  },
  {
    key: "review",
    stage: "The basics",
    area: "Review",
    type: "single",
    label: "When was the loan last reviewed or repriced?",
    hint: "A review means someone compared it or pushed the lender for a sharper rate - not just a statement arriving.",
    options: [
      { label: "Never, or 3+ years ago", points: 0, tip: "Loans drift. Three unreviewed years is typically thousands in loyalty tax - a repricing call to your lender is free and often works same-week." },
      { label: "A couple of years back", points: 0.4, tip: "The market has moved since - an annual review (not necessarily a refinance) keeps the rate honest." },
      { label: "Within the last 18 months", points: 0.7 },
      { label: "Within the last year", points: 1 },
    ],
  },
  {
    key: "structure",
    stage: "How it's built",
    area: "Structure",
    type: "multi",
    label: "Which of these is your loan actually using?",
    hint: "Tick everything that applies.",
    lowTip:
      "Structure is free money: an offset you actually use, extra or fortnightly repayments and deliberate splits can save more than a rate cut - and they're available without refinancing.",
    options: [
      { label: "An offset account with real money in it", points: 0.4 },
      { label: "Extra repayments (or fortnightly payments)", points: 0.3 },
      { label: "A deliberate fixed/variable split", points: 0.3 },
      { label: "None of these", points: 0, none: true },
    ],
    tool: { label: "What extra repayments save - calculator", href: "/home-loan-repayment-calculator" },
  },
  {
    key: "fit",
    stage: "How it's built",
    area: "Fit",
    type: "single",
    label: "Since the loan was set up, how much has life changed?",
    hint: "Income, family, plans - the loan was built for a version of you.",
    options: [
      { label: "A lot - and the loan hasn't been touched", points: 0, tip: "A loan set up for a different life rarely fits the current one - features, structure and even the lender may be wrong now. That's a review conversation, not necessarily a refinance." },
      { label: "A fair bit", points: 0.4, tip: "Worth a check - changed income or plans often unlock better options (or flag risks worth restructuring around)." },
      { label: "A little", points: 0.7 },
      { label: "Not much - or the loan was updated as life changed", points: 1 },
    ],
  },
  {
    key: "equity",
    stage: "The position",
    area: "Equity",
    type: "single",
    label: "Do you know your equity position - roughly what share of the property you own?",
    options: [
      { label: "No idea", points: 0, tip: "Equity is your option book: it decides your rate band (LVR), whether LMI ever applies again, and what the next move could be funded with. Estimate it in two minutes: value minus loan." },
      { label: "Roughly", points: 0.5, tip: "Good - the next step is knowing your usable equity (what a lender would release at 80% LVR), because that's the number that funds renovations or the next property." },
      { label: "Yes, I know it", points: 0.8 },
      { label: "Yes - including what's usable for the next move", points: 1 },
    ],
  },
  {
    key: "attention",
    stage: "The position",
    area: "Attention",
    type: "multi",
    label: "In the last two years, which of these have happened?",
    hint: "Tick everything that's true.",
    lowTip:
      "Loans reward attention: a repricing call, a market comparison and a feature check-up once a year is an hour of admin that routinely saves four figures. If nobody's doing it, that's what a broker's ongoing service is for.",
    options: [
      { label: "Asked the lender for a better rate", points: 0.4 },
      { label: "Compared the loan against the market", points: 0.3 },
      { label: "Checked the features are still being used (offset, redraw, cards)", points: 0.3 },
      { label: "None of these", points: 0, none: true },
    ],
    tool: { label: "How refinancing reviews work", href: "/refinancing-brisbane" },
  },
];

const SCORED = QUESTIONS.filter((q) => q.scored !== false);

const BANDS = [
  { min: 8.5, name: "Dialled in", blurb: "The loan is being managed the way brokers manage them - sharp rate, working structure, annual attention. The remaining wins are opportunistic: cashbacks, split tweaks, and the next property's pre-positioning." },
  { min: 6.5, name: "Mostly working", blurb: "The bones are good, but at least one lever - rate, structure or attention - is idle. Idle levers on a mortgage are measured in thousands per year." },
  { min: 4, name: "Drifting", blurb: "This is where most loans live: set up properly once, then left alone while the lender quietly repriced the loyalty. The flags below are usually fixable inside a fortnight - often without refinancing." },
  { min: 0, name: "On autopilot", blurb: "No judgement - loans are built to be forgotten. But on a typical balance, the gap between an autopilot loan and a managed one is serious money. Start with the first flag below." },
];

type Selections = Record<string, number[]>;

function qScore(q: Question, sel: number[] | undefined): number | null {
  if (!sel || sel.length === 0) return null;
  if (q.type === "single") return q.options[sel[0]].points;
  const noneIdx = sel.find((i) => q.options[i].none);
  if (noneIdx != null) return q.options[noneIdx].points;
  const sum = (q.base ?? 0) + sel.reduce((a, i) => a + q.options[i].points, 0);
  return Math.max(0, Math.min(1, sum));
}

type Pathway = { title: string; body: string; href: string; linkLabel: string };

function buildPathways(sel: Selections): Pathway[] {
  const ctx = new Set(sel["context"] ?? []);
  const fixed = ctx.has(2);
  const nextProp = ctx.has(3);
  const tight = ctx.has(4);
  const invest = ctx.has(1);
  const reviewScore = qScore(QUESTIONS.find((q) => q.key === "review")!, sel["review"]) ?? 0;

  const out: Pathway[] = [];
  if (reviewScore < 0.7 || tight) {
    out.push({
      title: "A free review - or a repricing call.",
      body: tight
        ? "When money's tighter, the loan is the biggest single lever: a review finds whether a sharper rate, consolidation or a structure change frees the most cash."
        : "An unreviewed loan is almost always paying loyalty tax. Either we find a sharper deal across 35+ lenders, or we make your lender price-match - both free.",
      href: "/refinancing-brisbane",
      linkLabel: "How the free review works",
    });
  }
  if (fixed) {
    out.push({
      title: "A fixed rate ending is a decision point.",
      body: "When the fixed term ends you'll roll to your lender's revert rate - usually their worst. Diarising the expiry and lining up the next move two months early is where the money is.",
      href: "/refinancing-brisbane",
      linkLabel: "Plan the roll-off",
    });
  }
  if (nextProp || invest) {
    out.push({
      title: "The next property starts inside this loan.",
      body: "Usable equity, structure and lender choice decide whether property two is easy or impossible - long before you find the property. Worth mapping early.",
      href: "/investment-home-loans",
      linkLabel: "How investors structure it",
    });
  }
  return out.slice(0, 3);
}

export function LoanCheck() {
  const [stage, setStage] = useState<"intro" | "q" | "results">("intro");
  const [sel, setSel] = useState<Selections>({});
  const restart = () => {
    setSel({});
    setStage("intro");
  };
  return (
    <div>
      {stage === "intro" && <Intro onStart={() => setStage("q")} />}
      {stage === "q" && <Flow sel={sel} setSel={setSel} onDone={() => setStage("results")} onExit={restart} />}
      {stage === "results" && <Results sel={sel} onRestart={restart} />}
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-16 sm:py-16">
      <h2 className="mx-auto max-w-3xl font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
        The <strong className="font-bold">Home Loan Health Check.</strong>
      </h2>
      <p className="mt-5 text-xl font-semibold">2 minutes. 6 areas. One real score.</p>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
        One screen at a time: your rate, the last review, the structure, whether the loan still
        fits your life, and the equity underneath it. Your score, the flags and the likely
        next steps show up straight away.
      </p>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onStart}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-white pl-5 pr-2.5 text-lg font-semibold text-ink transition hover:opacity-85"
        >
          Start the health check
          <span className="inline-flex h-[23px] w-[23px] items-center justify-center rounded-full bg-ink">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
      <p className="mt-4 text-base text-white/70">Free. No sign-up. No email wall.</p>
    </div>
  );
}

function Flow({
  sel,
  setSel,
  onDone,
  onExit,
}: {
  sel: Selections;
  setSel: (f: (s: Selections) => Selections) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [locked, setLocked] = useState(false);
  const q = QUESTIONS[qi];
  const done = QUESTIONS.filter((x) => (sel[x.key] ?? []).length > 0).length;
  const picked = sel[q.key] ?? [];

  const advance = useCallback(() => {
    if (qi + 1 < QUESTIONS.length) setQi(qi + 1);
    else onDone();
  }, [qi, onDone]);

  const pickSingle = useCallback(
    (i: number) => {
      if (locked) return;
      setSel((s) => ({ ...s, [q.key]: [i] }));
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        advance();
      }, 320);
    },
    [locked, q, setSel, advance]
  );

  const toggle = useCallback(
    (i: number) => {
      setSel((s) => {
        const cur = s[q.key] ?? [];
        if (cur.includes(i)) return { ...s, [q.key]: cur.filter((x) => x !== i) };
        if (q.options[i].none) return { ...s, [q.key]: [i] };
        return { ...s, [q.key]: [...cur.filter((x) => !q.options[x].none), i] };
      });
    },
    [q, setSel]
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) {
        if (q.type === "single") pickSingle(n - 1);
        else toggle(n - 1);
      } else if (e.key === "Enter" && q.type === "multi" && (sel[q.key] ?? []).length > 0) {
        advance();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [q, pickSingle, toggle, advance, sel]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
      <style>{`
        @keyframes lcRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .lc-rise { animation: lcRise .45s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .lc-rise { animation: none; } }
      `}</style>

      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <div className="h-1.5 bg-neutral-100">
          <div className="h-full bg-advance transition-all duration-300" style={{ width: `${(done / QUESTIONS.length) * 100}%` }} />
        </div>

        <div key={q.key} className="lc-rise flex min-h-[380px] flex-col justify-center px-8 py-12 sm:px-14">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow min-w-0">
              <span className="truncate">
                <span className="text-ink/40">{q.stage}</span>
                <span className="mx-1.5 text-ink/25">·</span>
                <span className="text-advance">{q.area}</span>
              </span>
            </p>
            <span className="shrink-0 text-xs font-semibold text-ink/40">
              {qi + 1} of {QUESTIONS.length}
            </span>
          </div>
          <p className="mt-5 max-w-2xl font-display text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            {q.label}
          </p>
          {q.hint && <p className="mt-3 max-w-xl text-base text-ink/55">{q.hint}</p>}
          <div className="mt-8 flex flex-col items-start gap-2.5">
            {q.options.map((o, oi) => {
              const active = picked.includes(oi);
              return (
                <button
                  key={o.label}
                  onClick={() => (q.type === "single" ? pickSingle(oi) : toggle(oi))}
                  aria-pressed={active}
                  className={`rounded-full border-2 px-5 py-2.5 text-left text-base font-semibold transition ${
                    active ? "border-transparent bg-advance text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                  }`}
                >
                  <span className="mr-2 text-xs opacity-50">{q.type === "multi" ? (active ? "✓" : oi + 1) : oi + 1}</span>
                  {o.label}
                </button>
              );
            })}
          </div>
          {q.type === "multi" && (
            <div className="mt-7">
              <button
                onClick={advance}
                disabled={picked.length === 0}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-30"
              >
                {picked.length === 0 ? "Tick what applies" : qi + 1 === QUESTIONS.length ? "See my score" : "Next"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 px-8 py-4">
          <button onClick={() => (qi > 0 ? setQi(qi - 1) : onExit())} className="text-sm font-semibold text-ink/50 hover:text-ink">
            ← Back
          </button>
          <span className="text-xs font-semibold text-ink/35">
            {done}/{QUESTIONS.length} answered ·{" "}
            {q.type === "multi" ? `keys 1-${q.options.length} tick, Enter next` : `keys 1-${q.options.length} work`}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-ink/10 bg-white p-6 max-lg:hidden">
        <p className="eyebrow">
          <span>Your loan's shape, live</span>
        </p>
        <Radar sel={sel} size={250} />
        <p className="mt-2 text-center text-xs text-ink/45">
          Each scored answer pulls the shape outward. The dashed ring is the strong mark.
        </p>
      </div>
    </div>
  );
}

function Radar({ sel, size = 280 }: { sel: Selections; size?: number }) {
  const c = size / 2;
  const R = c - 34;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / SCORED.length - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const val = (q: Question) => (qScore(q, sel[q.key]) ?? 0) * 10;
  const poly = (f: (q: Question) => number) =>
    SCORED.map((q, i) => pt(i, (Math.max(0.4, f(q)) / 10) * R).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto mt-2 w-full max-w-[300px]" aria-hidden>
      {[2.5, 5, 7.5, 10].map((ring) => (
        <polygon key={ring} points={SCORED.map((_, i) => pt(i, (ring / 10) * R).join(",")).join(" ")} fill="none" stroke="#e7e9ec" strokeWidth="1" />
      ))}
      {SCORED.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#e7e9ec" strokeWidth="1" />;
      })}
      <polygon points={poly(() => 8)} fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" />
      <polygon points={poly(val)} fill="#997000" fillOpacity="0.08" stroke="#997000" strokeWidth="2" strokeLinejoin="round" style={{ transition: "all .4s" }} />
      {SCORED.map((q, i) => {
        if (qScore(q, sel[q.key]) == null) return null;
        const [x, y] = pt(i, (Math.max(0.4, val(q)) / 10) * R);
        return <circle key={q.key} cx={x} cy={y} r="4.5" fill="#997000" style={{ transition: "all .4s" }} />;
      })}
      {SCORED.map((q, i) => {
        const [x, y] = pt(i, R + 18);
        return (
          <text key={q.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-ink/50" fontSize="10.5" fontWeight="600">
            {q.area}
          </text>
        );
      })}
    </svg>
  );
}

type Flag = { q: Question; score: number; sub: string; tip: string };

function buildFlags(sel: Selections): Flag[] {
  const flags: Flag[] = [];
  for (const q of SCORED) {
    const s = qScore(q, sel[q.key]);
    if (s == null || s >= 0.8) continue;
    if (q.type === "single") {
      const opt = q.options[(sel[q.key] ?? [])[0]];
      flags.push({ q, score: s, sub: opt.label, tip: opt.tip ?? "" });
    } else {
      const picked = sel[q.key] ?? [];
      const noneOpt = picked.map((i) => q.options[i]).find((o) => o.none);
      const scorable = q.options.filter((o) => !o.none && o.points > 0).length;
      const inPlace = picked.filter((i) => !q.options[i].none && q.options[i].points > 0).length;
      flags.push({ q, score: s, sub: noneOpt ? noneOpt.label : `${inPlace} of ${scorable} in place`, tip: q.lowTip ?? "" });
    }
  }
  return flags.sort((a, z) => a.score - z.score);
}

function profileSummary(sel: Selections): string {
  const ctxQ = QUESTIONS.find((q) => q.key === "context")!;
  const ctx = (sel["context"] ?? []).map((i) => ctxQ.options[i].label).join(", ") || "-";
  return `Context: ${ctx}`;
}

function Results({ sel, onRestart }: { sel: Selections; onRestart: () => void }) {
  const score = (SCORED.reduce((a, q) => a + (qScore(q, sel[q.key]) ?? 0), 0) / SCORED.length) * 10;
  const band = BANDS.find((b) => score >= b.min)!;
  const flags = buildFlags(sel);
  const pathways = buildPathways(sel);

  return (
    <div>
      <div className="grid gap-8 rounded-3xl border border-ink/10 bg-white p-8 sm:grid-cols-2 sm:items-center sm:p-12">
        <div>
          <p className="eyebrow mb-4">
            <span className="text-advance">Your health check</span>
          </p>
          <div className="flex items-center gap-6">
            <ScoreRing value={score} />
            <div>
              <h3 className="font-display text-3xl font-normal tracking-tight text-ink">{band.name}.</h3>
              <p className="mt-2 max-w-md text-ink/65">{band.blurb}</p>
            </div>
          </div>
        </div>
        <div>
          <Radar sel={sel} size={280} />
          <p className="mt-1 text-center text-xs text-ink/45">
            Your loan's shape - the dashed ring is the strong mark.
          </p>
        </div>
      </div>

      {pathways.length > 0 && (
        <div className="mt-6 rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="eyebrow mb-5">
            <span className="text-white/60">Where this usually leads</span>
          </p>
          <div className={`grid gap-6 ${pathways.length === 2 ? "sm:grid-cols-2" : pathways.length >= 3 ? "sm:grid-cols-3" : ""}`}>
            {pathways.map((p) => (
              <div key={p.title} className="flex flex-col">
                <h4 className="font-display text-xl font-bold tracking-tight">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
                <a href={p.href} className="mt-auto pt-4 text-sm font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2 hover:decoration-advance-bright">
                  {p.linkLabel} →
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/45">
            General pathways people in similar positions often explore - not a recommendation.
            Whether any fit you is what the free review works out.
          </p>
        </div>
      )}

      {flags.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-4">
            <span className="text-advance">Your first moves</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flags.slice(0, 6).map(({ q, sub, tip }, i) => (
              <div key={q.key} className="flex flex-col rounded-3xl border border-ink/10 border-t-4 border-t-advance bg-white p-5">
                <p className="font-display text-3xl font-semibold text-ink/20">{i + 1}</p>
                <p className="mt-1 text-lg font-bold text-ink">{q.area}</p>
                <p className="text-sm font-semibold text-ink/45">{sub}</p>
                <p className="mt-3 text-sm leading-snug text-ink/70">{tip}</p>
                {q.tool && (
                  <a href={q.tool.href} className="mt-auto pt-4 text-sm font-semibold text-advance underline decoration-advance/30 underline-offset-2 hover:decoration-advance">
                    {q.tool.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <p className="eyebrow mb-5">
          <span>The breakdown</span>
        </p>
        <div className="space-y-4">
          {SCORED.map((q) => {
            const v = (qScore(q, sel[q.key]) ?? 0) * 10;
            return (
              <div key={q.key} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[8rem_1fr_3rem]">
                <span className="truncate text-sm font-semibold text-ink">{q.area}</span>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-advance" style={{ width: `${v * 10}%` }} />
                </div>
                <span className="text-right font-display text-sm font-bold text-ink">{v.toFixed(0)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <SnapshotForm score={score} band={band.name} flags={flags} profile={profileSummary(sel)} />

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        The score weighs six general markers of loan health equally - it doesn&apos;t know your
        rate, balance or circumstances, so treat it as a conversation starter, not a verdict.
        General information only, not credit advice.
      </p>
      <button onClick={onRestart} className="mt-4 text-sm font-semibold text-ink/50 hover:text-ink">
        ↺ Retake the health check
      </button>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 10));
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e7e9ec" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#997000" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tracking-tight text-ink">{value.toFixed(1)}</span>
        <span className="text-xs font-semibold text-ink/40">out of 10</span>
      </div>
    </div>
  );
}

function SnapshotForm({ score, band, flags, profile }: { score: number; band: string; flags: Flag[]; profile: string }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variant: "contact",
          subject: "Home Loan Health Check",
          message: `Health check result: ${score.toFixed(1)}/10 (${band}). ${profile}. Flags: ${
            flags.map((f) => `${f.q.area} - ${f.sub}`).join("; ") || "none"
          }`,
          newsletter: true,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="mt-6 rounded-3xl bg-ink p-8 text-center text-white">
        <h3 className="font-display text-2xl font-bold tracking-tight">Speak soon.</h3>
        <p className="mx-auto mt-2 max-w-md text-white/70">
          Your result is with the team - a broker will be in touch within a few business hours
          to talk it through. No cost, no obligation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-3xl bg-ink p-8 text-white sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Talk the result through</p>
      <h3 className="mt-2 max-w-2xl font-display text-2xl font-normal tracking-tight sm:text-3xl">
        Turn the flags into savings - free, with a broker.
      </h3>
      <p className="mt-2 max-w-xl text-white/65">
        Your score, flags and context travel with the enquiry, so the conversation starts at
        the answer. Either we find a sharper loan, or we make your lender price-match.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DarkField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required autoComplete="given-name" />
        <DarkField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required autoComplete="family-name" />
        <DarkField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <DarkField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn bg-white text-ink hover:bg-neutral-100 disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Get my free loan review"}
        </button>
        <span className="text-sm text-white/50">
          Your score: <strong className="text-white">{score.toFixed(1)}/10</strong>
        </span>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          That didn&apos;t send, so nothing has reached us. Please call{" "}
          <a href="tel:0721014374" className="font-semibold underline">07 2101 4374</a>{" "}
          or try again in a moment.
        </p>
      )}
    </form>
  );
}

function DarkField({
  label, value, onChange, type = "text", required = false, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type} required={required} autoComplete={autoComplete} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white"
      />
    </label>
  );
}
