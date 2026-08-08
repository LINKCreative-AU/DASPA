"use client";

import { useCallback, useEffect, useState } from "react";

// The LINK Wealth Check - rebuilt on the HQ Performance Check's interaction
// pattern (James, 8 Aug: "concept's good, improve the layout"): an intro
// band, ONE question per screen with auto-advance and keyboard input, the
// shape drawing itself live alongside, then a results screen with the score
// ring, the flags as first-moves cards, the breakdown bars and a snapshot
// lead form. General-advice safe throughout: observations, never personal
// recommendations. No email wall - the score shows before any form.

type Option = { label: string; score: number; tip?: string };
type Question = {
  key: string;
  area: string; // short axis label
  label: string;
  hint?: string;
  options: Option[];
  tool?: { label: string; href: string };
};

const QUESTIONS: Question[] = [
  {
    key: "networth",
    area: "Net worth",
    label: "Do you know your household net worth?",
    hint: "Everything you own minus everything you owe.",
    options: [
      { label: "No idea", score: 0, tip: "Start with the number: net worth = assets minus debts. You can't steer what you don't measure." },
      { label: "Roughly", score: 0.4, tip: "Rough is a start - writing it down once a year turns a guess into a trend." },
      { label: "Yes, I track it", score: 0.8 },
      { label: "Track it, and it's growing", score: 1 },
    ],
  },
  {
    key: "buffer",
    area: "Buffer",
    label: "If your income stopped, how long could you cover the essentials?",
    options: [
      { label: "Under a month", score: 0, tip: "A cash buffer is the foundation everything else stands on - most plans start by building 3 months of essentials." },
      { label: "1-3 months", score: 0.4, tip: "A solid start - the common target is 3-6 months of essential spending." },
      { label: "3-6 months", score: 0.8 },
      { label: "6+ months", score: 1 },
    ],
  },
  {
    key: "debt",
    area: "Debt",
    label: "What does your debt look like?",
    options: [
      { label: "Mostly credit cards / personal loans", score: 0, tip: "High-interest personal debt usually beats every investment return - clearing it is the highest-yield move available." },
      { label: "Home loan, standard setup", score: 0.5, tip: "A standard loan does the job; offset accounts, splits and debt recycling can make the same repayments work harder." },
      { label: "Home loan with offset / splits working for me", score: 0.9 },
      { label: "No debt (or fully deductible investment debt)", score: 1 },
    ],
    tool: { label: "Debt recycling calculator", href: "/insights/wealth-creation-using-debt-recycling#calculator" },
  },
  {
    key: "super",
    area: "Super",
    label: "How engaged are you with your super?",
    options: [
      { label: "Couldn't tell you the balance", score: 0, tip: "Super is most people's second-biggest asset - knowing the balance and investment option is step one." },
      { label: "Know the balance, default settings", score: 0.4, tip: "Default settings suit the average member; your age and goals may point somewhere different." },
      { label: "Chosen my investment options deliberately", score: 0.8 },
      { label: "Active strategy (extra contributions / SMSF)", score: 1 },
    ],
    tool: { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire#check" },
  },
  {
    key: "invest",
    area: "Investing",
    label: "Are you investing outside super?",
    options: [
      { label: "Not yet", score: 0, tip: "Wealth outside super is what funds life before preservation age - even a small regular plan compounds." },
      { label: "Some savings / a few shares", score: 0.4, tip: "A regular, automated plan usually beats ad-hoc buying." },
      { label: "Regular investing plan", score: 0.8 },
      { label: "Diversified portfolio with a strategy", score: 1 },
    ],
  },
  {
    key: "protect",
    area: "Protection",
    label: "If illness stopped you working, is your income protected?",
    options: [
      { label: "No cover", score: 0, tip: "Your income is the engine of every other answer here - income protection and life cover are usually the first advice conversation." },
      { label: "Default cover in super, never reviewed", score: 0.3, tip: "Default cover is rarely sized to your actual debts and dependants - a review is quick and often free." },
      { label: "Cover reviewed in the last 3 years", score: 0.8 },
      { label: "Reviewed cover incl. income protection", score: 1 },
    ],
  },
  {
    key: "estate",
    area: "Estate",
    label: "If something happened to you tomorrow, is the paperwork ready?",
    options: [
      { label: "No will", score: 0, tip: "Without a will, state formulas decide - a will, powers of attorney and super death-benefit nominations are the minimum kit." },
      { label: "Will only", score: 0.5, tip: "Add enduring powers of attorney and check your super's death-benefit nomination - super sits outside your will." },
      { label: "Will + powers of attorney", score: 0.8 },
      { label: "Will, POAs and super nominations current", score: 1 },
    ],
  },
  {
    key: "plan",
    area: "Plan",
    label: "Do you have a written plan with actual numbers?",
    options: [
      { label: "No plan", score: 0, tip: "A goal without a number is a wish - even one page with targets changes behaviour." },
      { label: "Goals in my head", score: 0.4, tip: "Write them down with dollar figures and dates - that's when trade-offs get visible." },
      { label: "Clear goals, loosely tracked", score: 0.7 },
      { label: "Written plan, reviewed yearly", score: 1 },
    ],
  },
];

const BANDS = [
  { min: 8.5, name: "Optimising", blurb: "The foundations are set and working. At this level the wins are in fine-tuning: tax structure, contribution strategy, and making sure the plan survives a bad year." },
  { min: 6.5, name: "Compounding", blurb: "You're ahead of most - the machine is built and running. The gap between here and optimised is usually structure: where assets sit, whose name they're in, and how tax-efficiently money moves." },
  { min: 4, name: "Building", blurb: "Real progress with real gaps. One or two of the flags below are quietly expensive - closing them is usually worth more than picking better investments." },
  { min: 0, name: "Foundations first", blurb: "No judgement - almost everyone starts here. The flags below are in rough priority order, and the first two or three are usually fixable within a month." },
];

type Answers = Record<string, number>;

export function WealthCheck() {
  const [stage, setStage] = useState<"intro" | "q" | "results">("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const restart = () => {
    setAnswers({});
    setStage("intro");
  };
  return (
    <div>
      {stage === "intro" && <Intro onStart={() => setStage("q")} />}
      {stage === "q" && (
        <Flow answers={answers} setAnswers={setAnswers} onDone={() => setStage("results")} onExit={restart} />
      )}
      {stage === "results" && <Results answers={answers} onRestart={restart} />}
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
        Answer one quick question for each of the eight things that actually decide financial
        health - buffer, debt, super, investing, protection, estate, the plan and the number
        behind them all. Your score and what&apos;s holding it back show up straight away.
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

// ---- the flow: one question per screen, auto-advance, live shape ----
function Flow({
  answers,
  setAnswers,
  onDone,
  onExit,
}: {
  answers: Answers;
  setAnswers: (f: (a: Answers) => Answers) => void;
  onDone: () => void;
  onExit: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [locked, setLocked] = useState(false);
  const q = QUESTIONS[qi];
  const done = Object.keys(answers).length;

  const answer = useCallback(
    (score: number) => {
      if (locked) return;
      setAnswers((a) => ({ ...a, [q.key]: score }));
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        if (qi + 1 < QUESTIONS.length) setQi(qi + 1);
        else onDone();
      }, 320);
    },
    [locked, q, qi, setAnswers, onDone]
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) answer(q.options[n - 1].score);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [q, answer]);

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
          <div className="flex items-center justify-between">
            <p className="eyebrow">
              <span className="text-wealth">{q.area}</span>
            </p>
            <span className="text-xs font-semibold text-ink/40">
              {qi + 1} of {QUESTIONS.length}
            </span>
          </div>
          <p className="mt-5 max-w-2xl font-display text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            {q.label}
          </p>
          {q.hint && <p className="mt-3 max-w-xl text-base text-ink/55">{q.hint}</p>}
          <div className="mt-8 flex flex-col items-start gap-2.5">
            {q.options.map((o, oi) => {
              const active = answers[q.key] === o.score;
              return (
                <button
                  key={o.label}
                  onClick={() => answer(o.score)}
                  className={`rounded-full border-2 px-5 py-2.5 text-left text-base font-semibold transition ${
                    active
                      ? "border-transparent bg-wealth text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                  }`}
                >
                  <span className="mr-2 text-xs opacity-50">{oi + 1}</span>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 px-8 py-4">
          <button onClick={back} className="text-sm font-semibold text-ink/50 hover:text-ink">
            ← Back
          </button>
          <span className="text-xs font-semibold text-ink/35">
            {done}/{QUESTIONS.length} answered · keys 1-{q.options.length} work
          </span>
        </div>
      </div>

      {/* The shape draws itself as you answer */}
      <div className="rounded-3xl border border-ink/10 bg-white p-6 max-lg:hidden">
        <p className="eyebrow">
          <span>Your shape, live</span>
        </p>
        <Radar answers={answers} size={250} />
        <p className="mt-2 text-center text-xs text-ink/45">
          Each answer pulls the shape outward. The dashed ring is the strong mark.
        </p>
      </div>
    </div>
  );
}

// ---- the radar, 8 axes ----
function Radar({ answers, size = 280 }: { answers: Answers; size?: number }) {
  const c = size / 2;
  const R = c - 34;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / QUESTIONS.length - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const val = (q: Question) => (answers[q.key] != null ? answers[q.key] * 10 : 0);
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
        if (answers[q.key] == null) return null;
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
function Results({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const score = (Object.values(answers).reduce((a, b) => a + b, 0) / QUESTIONS.length) * 10;
  const band = BANDS.find((b) => score >= b.min)!;
  const flags = QUESTIONS.map((q) => ({ q, opt: q.options.find((o) => o.score === answers[q.key]) }))
    .filter((f): f is { q: Question; opt: Option } => !!f.opt && f.opt.score < 0.8)
    .sort((a, z) => a.opt.score - z.opt.score);

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
          <Radar answers={answers} size={280} />
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
            {flags.slice(0, 6).map(({ q, opt }, i) => (
              <div key={q.key} className="flex flex-col rounded-3xl border border-ink/10 border-t-4 border-t-wealth bg-white p-5">
                <p className="font-display text-3xl font-semibold text-ink/20">{i + 1}</p>
                <p className="mt-1 text-lg font-bold text-ink">{q.area}</p>
                <p className="text-sm font-semibold text-ink/45">{opt.label}</p>
                <p className="mt-3 text-sm leading-snug text-ink/70">{opt.tip}</p>
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
            const v = (answers[q.key] ?? 0) * 10;
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
function SnapshotForm({
  score,
  band,
  flags,
}: {
  score: number;
  band: string;
  flags: { q: Question; opt: Option }[];
}) {
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
            flags.map((f) => `${f.q.area} - ${f.opt.label}`).join("; ") || "none"
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
