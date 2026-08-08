"use client";

import { useCallback, useEffect, useState } from "react";

// The LINK Wealth Check - the HQ Performance Check's interaction pattern
// (intro band, one question per screen, live radar, score-ring results).
// Question set reworked 8 Aug per James: the old single-pick options forced
// one answer where several were true at once ("home loan with offset" AND
// "credit cards"). Now the areas that are really a set of pieces are
// tick-all-that-apply and scored from the combination (with penalties);
// single-pick survives only where the scale is naturally exclusive (months
// of buffer, how well you know a number). Each question carries its stage
// so the eight screens read as one conversation. General-advice safe:
// observations, never personal recommendations. No email wall.

type Option = { label: string; points: number; none?: boolean; tip?: string };
type Question = {
  key: string;
  stage: string; // the narrative spine shown in the eyebrow
  area: string; // short axis label
  type: "single" | "multi";
  label: string;
  hint?: string;
  base?: number; // multi: starting score before ticked points
  lowTip?: string; // multi: the flag-card tip when the area scores low
  options: Option[];
  tool?: { label: string; href: string };
};

const QUESTIONS: Question[] = [
  {
    key: "networth",
    stage: "Where you stand",
    area: "Net worth",
    type: "single",
    label: "How well do you know your household net worth?",
    hint: "Everything you own minus everything you owe - the scoreboard behind every other answer here.",
    options: [
      { label: "Honestly, no idea", points: 0, tip: "Start with the number: net worth = assets minus debts. You can't steer what you don't measure." },
      { label: "A rough figure in my head", points: 0.4, tip: "Rough is a start - writing it down once a year turns a guess into a trend." },
      { label: "I know the number", points: 0.7, tip: "Knowing it is most of the battle - tracking it yearly shows whether the strategy is actually working." },
      { label: "I track it, and it's trending up", points: 1 },
    ],
  },
  {
    key: "buffer",
    stage: "Where you stand",
    area: "Buffer",
    type: "single",
    label: "If your income stopped tomorrow, how long could you cover the essentials?",
    hint: "Cash you could reach within days - savings, offset, redraw.",
    options: [
      { label: "Less than a month", points: 0, tip: "A cash buffer is the foundation everything else stands on - most plans start by building 3 months of essentials." },
      { label: "One to three months", points: 0.4, tip: "A solid start - the common target is 3-6 months of essential spending." },
      { label: "Three to six months", points: 0.8 },
      { label: "Six months or more", points: 1 },
    ],
  },
  {
    key: "debt",
    stage: "Making money work",
    area: "Debt",
    type: "multi",
    label: "Which of these describe your debts right now?",
    hint: "Tick everything that applies.",
    base: 0.5,
    lowTip:
      "High-interest debt goes first - it usually beats any investment return. Then make the home loan work harder: offsets, splits and debt recycling turn the same repayments into progress.",
    options: [
      { label: "Credit cards or personal loans carrying a balance", points: -0.5 },
      { label: "A home loan", points: 0 },
      { label: "An offset or split structure I actively use", points: 0.3 },
      { label: "Deductible investment debt (property, shares)", points: 0.2 },
      { label: "No debts at all", points: 1, none: true },
    ],
    tool: { label: "Debt recycling calculator", href: "/insights/wealth-creation-using-debt-recycling#calculator" },
  },
  {
    key: "super",
    stage: "Making money work",
    area: "Super",
    type: "multi",
    label: "Super - which of these are true for you?",
    hint: "Tick everything that applies. For most people it's the second-biggest asset they own.",
    lowTip:
      "Super is most people's second-biggest asset, run on default settings. Knowing the balance, choosing the investment option deliberately and adding even a little extra are the three highest-leverage moves.",
    options: [
      { label: "I know my current balance", points: 0.25 },
      { label: "I've deliberately chosen my investment option", points: 0.3 },
      { label: "I contribute more than the employer minimum", points: 0.25 },
      { label: "I run (or am working toward) an SMSF strategy", points: 0.2 },
      { label: "None of these - super runs itself", points: 0, none: true },
    ],
    tool: { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire#check" },
  },
  {
    key: "invest",
    stage: "Making money work",
    area: "Investing",
    type: "multi",
    label: "Outside super, where does investing sit?",
    hint: "Tick everything that applies. This is the wealth that funds life before preservation age.",
    lowTip:
      "Wealth outside super is what funds life before preservation age - and a regular, automated plan usually beats ad-hoc buying. Even a small monthly amount compounds.",
    options: [
      { label: "I hold investments - shares, ETFs or property", points: 0.4 },
      { label: "I add to them regularly (automated or scheduled)", points: 0.3 },
      { label: "There's a written strategy behind what I buy", points: 0.3 },
      { label: "Not investing outside super yet", points: 0, none: true },
    ],
  },
  {
    key: "protect",
    stage: "Protecting it",
    area: "Protection",
    type: "multi",
    label: "If illness or injury stopped you working, what's in place?",
    hint: "Tick everything that applies.",
    lowTip:
      "Your income is the engine of every other answer here. Income protection and life cover sized to your actual debts and dependants - not the default in super - are usually the first advice conversation.",
    options: [
      { label: "Life cover (inside super or outside it)", points: 0.3 },
      { label: "Income protection", points: 0.4 },
      { label: "Cover reviewed against my debts and dependants in the last 3 years", points: 0.3 },
      { label: "No cover - or honestly not sure", points: 0, none: true },
    ],
  },
  {
    key: "estate",
    stage: "Protecting it",
    area: "Estate",
    type: "multi",
    label: "If something happened to you tomorrow, what paperwork is ready?",
    hint: "Tick everything that's current.",
    lowTip:
      "Without a will, state formulas decide - and super sits outside your will entirely. A will, enduring powers of attorney and up-to-date super death-benefit nominations are the minimum kit.",
    options: [
      { label: "A current will", points: 0.4 },
      { label: "Enduring powers of attorney", points: 0.3 },
      { label: "Super death-benefit nominations, up to date", points: 0.3 },
      { label: "None of these yet", points: 0, none: true },
    ],
  },
  {
    key: "plan",
    stage: "Pulling it together",
    area: "Plan",
    type: "single",
    label: "And the plan holding it all together - what does it look like?",
    hint: "The thing that decides whether the other seven answers point in the same direction.",
    options: [
      { label: "There isn't one", points: 0, tip: "A goal without a number is a wish - even one page with targets changes behaviour." },
      { label: "Goals, but they live in my head", points: 0.4, tip: "Write them down with dollar figures and dates - that's when trade-offs get visible." },
      { label: "Written goals with real numbers", points: 0.7, tip: "The last step is a review rhythm - a plan looked at yearly survives contact with real life." },
      { label: "A written plan I review at least yearly", points: 1 },
    ],
  },
];

const BANDS = [
  { min: 8.5, name: "Optimising", blurb: "The foundations are set and working. At this level the wins are in fine-tuning: tax structure, contribution strategy, and making sure the plan survives a bad year." },
  { min: 6.5, name: "Compounding", blurb: "You're ahead of most - the machine is built and running. The gap between here and optimised is usually structure: where assets sit, whose name they're in, and how tax-efficiently money moves." },
  { min: 4, name: "Building", blurb: "Real progress with real gaps. One or two of the flags below are quietly expensive - closing them is usually worth more than picking better investments." },
  { min: 0, name: "Foundations first", blurb: "No judgement - almost everyone starts here. The flags below are in rough priority order, and the first two or three are usually fixable within a month." },
];

// selections per question key (option indices) - kept raw so Back restores
// exactly what was ticked, and multi scores stay recomputable
type Selections = Record<string, number[]>;

function qScore(q: Question, sel: number[] | undefined): number | null {
  if (!sel || sel.length === 0) return null;
  if (q.type === "single") return q.options[sel[0]].points;
  const noneIdx = sel.find((i) => q.options[i].none);
  if (noneIdx != null) return q.options[noneIdx].points;
  const sum = (q.base ?? 0) + sel.reduce((a, i) => a + q.options[i].points, 0);
  return Math.max(0, Math.min(1, sum));
}

export function WealthCheck() {
  const [stage, setStage] = useState<"intro" | "q" | "results">("intro");
  const [sel, setSel] = useState<Selections>({});
  const restart = () => {
    setSel({});
    setStage("intro");
  };
  return (
    <div>
      {stage === "intro" && <Intro onStart={() => setStage("q")} />}
      {stage === "q" && (
        <Flow sel={sel} setSel={setSel} onDone={() => setStage("results")} onExit={restart} />
      )}
      {stage === "results" && <Results sel={sel} onRestart={restart} />}
    </div>
  );
}

// ---- intro: the black promo band; starting swaps it in place ----
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-16 sm:py-16">
      <h2 className="mx-auto max-w-3xl font-display text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl">
        The LINK <strong className="font-bold">Wealth Check.</strong>
      </h2>
      <p className="mt-5 text-xl font-semibold">2 minutes. 8 areas. One real score.</p>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
        One screen at a time: where you stand, how your money is working, what&apos;s protecting
        it, and the plan holding it together. Some questions are a single tap, some are
        tick-everything-that&apos;s-true. Your score and what&apos;s holding it back show up
        straight away.
      </p>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onStart}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-white pl-5 pr-2.5 text-lg font-semibold text-ink transition hover:opacity-85"
        >
          Start the wealth check
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

// ---- the flow: one question per screen, live shape alongside ----
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

  // single: pick and auto-advance after a beat
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

  // multi: toggle; the exclusive "none" option clears the rest (and vice versa)
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

  const back = () => {
    if (qi > 0) setQi(qi - 1);
    else onExit();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
      <style>{`
        @keyframes wcRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .wc-rise { animation: wcRise .45s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .wc-rise { animation: none; } }
      `}</style>

      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <div className="h-1.5 bg-neutral-100">
          <div
            className="h-full bg-wealth transition-all duration-300"
            style={{ width: `${(done / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div key={q.key} className="wc-rise flex min-h-[380px] flex-col justify-center px-8 py-12 sm:px-14">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow min-w-0">
              <span className="truncate">
                <span className="text-ink/40">{q.stage}</span>
                <span className="mx-1.5 text-ink/25">·</span>
                <span className="text-wealth">{q.area}</span>
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
                    active
                      ? "border-transparent bg-wealth text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink"
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
          <button onClick={back} className="text-sm font-semibold text-ink/50 hover:text-ink">
            ← Back
          </button>
          <span className="text-xs font-semibold text-ink/35">
            {done}/{QUESTIONS.length} answered ·{" "}
            {q.type === "multi" ? `keys 1-${q.options.length} tick, Enter next` : `keys 1-${q.options.length} work`}
          </span>
        </div>
      </div>

      {/* The shape draws itself as you answer */}
      <div className="rounded-3xl border border-ink/10 bg-white p-6 max-lg:hidden">
        <p className="eyebrow">
          <span>Your shape, live</span>
        </p>
        <Radar sel={sel} size={250} />
        <p className="mt-2 text-center text-xs text-ink/45">
          Each answer pulls the shape outward. The dashed ring is the strong mark.
        </p>
      </div>
    </div>
  );
}

// ---- the radar, 8 axes ----
function Radar({ sel, size = 280 }: { sel: Selections; size?: number }) {
  const c = size / 2;
  const R = c - 34;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / QUESTIONS.length - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const val = (q: Question) => (qScore(q, sel[q.key]) ?? 0) * 10;
  const poly = (f: (q: Question) => number) =>
    QUESTIONS.map((q, i) => pt(i, (Math.max(0.4, f(q)) / 10) * R).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto mt-2 w-full max-w-[300px]" aria-hidden>
      {[2.5, 5, 7.5, 10].map((ring) => (
        <polygon
          key={ring}
          points={QUESTIONS.map((_, i) => pt(i, (ring / 10) * R).join(",")).join(" ")}
          fill="none"
          stroke="#e7e9ec"
          strokeWidth="1"
        />
      ))}
      {QUESTIONS.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#e7e9ec" strokeWidth="1" />;
      })}
      <polygon points={poly(() => 8)} fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" />
      <polygon
        points={poly(val)}
        fill="#1f9e84"
        fillOpacity="0.08"
        stroke="#1f9e84"
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transition: "all .4s" }}
      />
      {QUESTIONS.map((q, i) => {
        if (qScore(q, sel[q.key]) == null) return null;
        const [x, y] = pt(i, (Math.max(0.4, val(q)) / 10) * R);
        return <circle key={q.key} cx={x} cy={y} r="4.5" fill="#1f9e84" style={{ transition: "all .4s" }} />;
      })}
      {QUESTIONS.map((q, i) => {
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

// ---- results ----
type Flag = { q: Question; score: number; sub: string; tip: string };

function buildFlags(sel: Selections): Flag[] {
  const flags: Flag[] = [];
  for (const q of QUESTIONS) {
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
      flags.push({
        q,
        score: s,
        sub: noneOpt ? noneOpt.label : `${inPlace} of ${scorable} in place`,
        tip: q.lowTip ?? "",
      });
    }
  }
  return flags.sort((a, z) => a.score - z.score);
}

function Results({ sel, onRestart }: { sel: Selections; onRestart: () => void }) {
  const score =
    (QUESTIONS.reduce((a, q) => a + (qScore(q, sel[q.key]) ?? 0), 0) / QUESTIONS.length) * 10;
  const band = BANDS.find((b) => score >= b.min)!;
  const flags = buildFlags(sel);

  return (
    <div>
      {/* score + shape */}
      <div className="grid gap-8 rounded-3xl border border-ink/10 bg-white p-8 sm:grid-cols-2 sm:items-center sm:p-12">
        <div>
          <p className="eyebrow mb-4">
            <span className="text-wealth">Your wealth check</span>
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
            Your shape - the dashed ring is the strong mark. The goal is to fill it on every axis.
          </p>
        </div>
      </div>

      {/* the flags as first moves */}
      {flags.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-4">
            <span className="text-wealth">Your first moves</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flags.slice(0, 6).map(({ q, sub, tip }, i) => (
              <div key={q.key} className="flex flex-col rounded-3xl border border-ink/10 border-t-4 border-t-wealth bg-white p-5">
                <p className="font-display text-3xl font-semibold text-ink/20">{i + 1}</p>
                <p className="mt-1 text-lg font-bold text-ink">{q.area}</p>
                <p className="text-sm font-semibold text-ink/45">{sub}</p>
                <p className="mt-3 text-sm leading-snug text-ink/70">{tip}</p>
                {q.tool && (
                  <a href={q.tool.href} className="mt-auto pt-4 text-sm font-semibold text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
                    {q.tool.label} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* the breakdown */}
      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
        <p className="eyebrow mb-5">
          <span>The breakdown</span>
        </p>
        <div className="space-y-4">
          {QUESTIONS.map((q) => {
            const v = (qScore(q, sel[q.key]) ?? 0) * 10;
            return (
              <div key={q.key} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[8rem_1fr_3rem]">
                <span className="truncate text-sm font-semibold text-ink">{q.area}</span>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-wealth" style={{ width: `${v * 10}%` }} />
                </div>
                <span className="text-right font-display text-sm font-bold text-ink">{v.toFixed(0)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <SnapshotForm score={score} band={band.name} flags={flags} />

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        The score weighs eight general markers of financial health equally - it doesn&apos;t know
        your income, age or goals, so treat it as a conversation starter, not a verdict. General
        information only, not personal advice.
      </p>
      <button onClick={onRestart} className="mt-4 text-sm font-semibold text-ink/50 hover:text-ink">
        ↺ Retake the wealth check
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
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#1f9e84"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tracking-tight text-ink">{score1(value)}</span>
        <span className="text-xs font-semibold text-ink/40">out of 10</span>
      </div>
    </div>
  );
}
const score1 = (v: number) => v.toFixed(1);

// ---- snapshot lead form: the score travels with the enquiry ----
function SnapshotForm({ score, band, flags }: { score: number; band: string; flags: Flag[] }) {
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
          variant: "discovery",
          subject: "Wealth Health Check",
          message: `Wealth Check result: ${score.toFixed(1)}/10 (${band}). Flags: ${
            flags.map((f) => `${f.q.area} - ${f.sub}`).join("; ") || "none"
          }`,
          age: "-",
          postcode: "-",
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
          Your result is with the team - an adviser will be in touch within a few business hours
          to talk it through. No cost, no obligation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-3xl bg-ink p-8 text-white sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
        Talk the result through
      </p>
      <h3 className="mt-2 max-w-2xl font-display text-2xl font-normal tracking-tight sm:text-3xl">
        Turn the flags into a sequence - free, with a licensed adviser.
      </h3>
      <p className="mt-2 max-w-xl text-white/65">
        Your score and flags travel with the enquiry, so the conversation starts at the
        answer, not the form. No cost, no obligation.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DarkField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required autoComplete="given-name" />
        <DarkField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required autoComplete="family-name" />
        <DarkField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <DarkField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn bg-white text-ink hover:bg-neutral-100 disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Book my free discovery meeting"}
        </button>
        <span className="text-sm text-white/50">
          Your score: <strong className="text-white">{score.toFixed(1)}/10</strong>
        </span>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          That didn&apos;t send, so nothing has reached us. Please call{" "}
          <a href="tel:0721014377" className="font-semibold underline">
            (07) 2101 4377
          </a>{" "}
          or try again in a moment.
        </p>
      )}
    </form>
  );
}

function DarkField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white"
      />
    </label>
  );
}
