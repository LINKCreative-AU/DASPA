"use client";

import { useState } from "react";

// The LINK Wealth Check - the division's score engine, in the family
// tradition (HQ's Business & Life Performance Check, Advisors' health
// check): tap-to-answer questions, a score out of 10 on screen immediately,
// no email wall. General-advice safe: every answer maps to a general
// observation, never a personal recommendation.

type Option = { label: string; score: number; tip?: string };
type Question = { key: string; label: string; hint?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    key: "networth",
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
    label: "What does your debt look like?",
    options: [
      { label: "Mostly credit cards / personal loans", score: 0, tip: "High-interest personal debt usually beats every investment return - clearing it is the highest-yield move available." },
      { label: "Home loan, standard setup", score: 0.5, tip: "A standard loan does the job; offset accounts, splits and debt recycling can make the same repayments work harder." },
      { label: "Home loan with offset / splits working for me", score: 0.9 },
      { label: "No debt (or fully deductible investment debt)", score: 1 },
    ],
  },
  {
    key: "super",
    label: "How engaged are you with your super?",
    options: [
      { label: "Couldn't tell you the balance", score: 0, tip: "Super is most people's second-biggest asset - knowing the balance and investment option is step one." },
      { label: "Know the balance, default settings", score: 0.4, tip: "Default settings suit the average member; your age and goals may point somewhere different." },
      { label: "Chosen my investment options deliberately", score: 0.8 },
      { label: "Active strategy (extra contributions / SMSF)", score: 1 },
    ],
  },
  {
    key: "invest",
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
  { min: 8.5, name: "Optimising", blurb: "The foundations are set and working. At this level the wins are in fine-tuning: tax structure, contribution strategy, and making sure the plan survives a bad year (and a good accountant)." },
  { min: 6.5, name: "Compounding", blurb: "You're ahead of most - the machine is built and running. The gap between here and optimised is usually structure: where assets sit, whose name they're in, and how tax-efficiently money moves." },
  { min: 4, name: "Building", blurb: "Real progress with real gaps. One or two of the flags below are quietly expensive - closing them is usually worth more than picking better investments." },
  { min: 0, name: "Foundations first", blurb: "No judgement - almost everyone starts here. The flags below are in rough priority order, and the first two or three are usually fixable within a month." },
];

export function WealthCheck() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const answered = Object.keys(answers).length;
  const total = QUESTIONS.length;
  const score = (Object.values(answers).reduce((a, b) => a + b, 0) / total) * 10;
  const band = BANDS.find((b) => score >= b.min)!;
  const flags = QUESTIONS.filter((q) => {
    const s = answers[q.key];
    return s !== undefined && s < 0.8;
  }).map((q) => ({ q, opt: q.options.find((o) => o.score === answers[q.key])! }));

  if (done) {
    return (
      <div className="rounded-3xl bg-ink p-6 text-white sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
          Your wealth check result
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="font-display text-6xl font-semibold text-wealth-bright">
            {score.toFixed(1)}
            <span className="text-2xl text-white/50">/10</span>
          </span>
          <span className="font-display text-2xl font-normal">{band.name}</span>
        </div>
        <p className="mt-4 max-w-2xl text-white/75">{band.blurb}</p>

        {flags.length > 0 && (
          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/60">
              What's holding the score back
            </p>
            <ul className="mt-4 grid gap-4 lg:grid-cols-2">
              {flags.map(({ q, opt }) => (
                <li key={q.key} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-sm font-bold">{q.label}</p>
                  <p className="mt-1.5 text-sm text-white/65">{opt.tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#contact" className="btn bg-white text-ink hover:bg-neutral-100">
            Talk the result through - free, no obligation
          </a>
          <button
            onClick={() => {
              setAnswers({});
              setDone(false);
            }}
            className="btn border border-white/25 text-white hover:border-white"
          >
            Start again
          </button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/55">
          The score weighs eight general markers of financial health equally - it doesn't know
          your income, age or goals, so treat it as a conversation starter, not a verdict.
          General information only, not personal advice.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ink/55">
          {answered} of {total} answered
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-wealth transition-all"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-6 space-y-8">
        {QUESTIONS.map((q, i) => (
          <div key={q.key}>
            <p className="text-sm font-bold text-ink">
              <span className="mr-2 font-display text-wealth/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              {q.label}
            </p>
            {q.hint && <p className="mt-0.5 pl-8 text-xs text-ink/50">{q.hint}</p>}
            <div className="mt-2.5 flex flex-wrap gap-2 pl-8">
              {q.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={answers[q.key] === o.score}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.score }))}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
                    answers[q.key] === o.score
                      ? "border-wealth bg-wealth text-white"
                      : "border-ink/15 text-ink/65 hover:border-ink"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={answered < total}
        onClick={() => setDone(true)}
        className="btn btn-wealth mt-8 w-full disabled:opacity-40 sm:w-auto"
      >
        {answered < total ? `Answer ${total - answered} more to see your score` : "Show my score"}
      </button>
    </div>
  );
}
