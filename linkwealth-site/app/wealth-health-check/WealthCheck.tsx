"use client";

import { useCallback, useEffect, useState } from "react";

// The LINK Wealth Check - the HQ Performance Check's interaction pattern
// (intro band, one question per screen, live radar, score-ring results).
//
// Question set v3 (8 Aug, per James): built from the adviser fact-find, the
// firm's actual value and what's commercial. Two unscored context questions
// open the check the way a discovery meeting does (who you are; where super
// sits - the ~$200k mark is the firm's own SMSF viability line). Protection
// is deepened to the four cover types (life, TPD, income protection,
// trauma) because insurance reviews are a signature LINK Wealth service and
// the FSC puts the national income-protection gap at ~3.4m people. The
// results add "where this usually leads" pathway cards - SMSF premises for
// business owners with the super for it, the extraction workshop, the
// equity workshop, retirement funding, an insurance review - and the whole
// profile travels with the lead. General-advice safe throughout: pathways
// are "people in this position often...", never "you should". No email
// wall - the score shows before any form.

type Option = { label: string; points: number; none?: boolean; tip?: string };
type Question = {
  key: string;
  stage: string; // the narrative spine shown in the eyebrow
  area: string; // short axis label (scored) / eyebrow label (context)
  type: "single" | "multi";
  scored?: false; // context questions shape pathways, not the score
  label: string;
  hint?: string;
  base?: number; // multi: starting score before ticked points
  lowTip?: string; // multi: the flag-card tip when the area scores low
  options: Option[];
  tool?: { label: string; href: string };
};

const QUESTIONS: Question[] = [
  {
    key: "goals",
    stage: "About you",
    area: "Goals",
    type: "multi",
    scored: false,
    label: "What do you want your money to do next?",
    hint: "Tick everything that's on the list. Goals don't move the score. They decide which pathways show with your result.",
    options: [
      { label: "Buy (or upgrade) a home", points: 0 },
      { label: "Get the kids set up: education, first homes", points: 0 },
      { label: "Grow investments and income", points: 0 },
      { label: "Retire well, maybe early", points: 0 },
      { label: "Grow the business, or get its value out", points: 0 },
      { label: "Protect what we've already built", points: 0 },
    ],
  },
  {
    key: "context",
    stage: "About you",
    area: "Context",
    type: "multi",
    scored: false,
    label: "First, which of these fit you?",
    hint: "Tick everything that's true. This doesn't move the score; it makes the next steps actually fit your situation.",
    options: [
      { label: "I run a business (or I'm self-employed)", points: 0 },
      { label: "I own my home, or I'm paying it off", points: 0 },
      { label: "Retirement is within about 10 years", points: 0 },
      { label: "People depend on my income (partner, kids)", points: 0 },
      { label: "None of these", points: 0, none: true },
    ],
  },
  {
    key: "networth",
    stage: "Where you stand",
    area: "Net worth",
    type: "single",
    label: "How well do you know your household net worth?",
    hint: "Everything you own minus everything you owe: the scoreboard behind every other answer here.",
    options: [
      { label: "Honestly, no idea", points: 0, tip: "Start with the number: net worth = assets minus debts. You can't steer what you don't measure." },
      { label: "A rough figure in my head", points: 0.4, tip: "Rough is a start. Writing it down once a year turns a guess into a trend." },
      { label: "I know the number", points: 0.7, tip: "Knowing it is most of the battle. Tracking it yearly shows whether the strategy is actually working." },
      { label: "I track it, and it's trending up", points: 1 },
    ],
    tool: { label: "Net worth calculator", href: "/net-worth-calculator" },
  },
  {
    key: "buffer",
    stage: "Where you stand",
    area: "Buffer",
    type: "single",
    label: "If your income stopped tomorrow, how long could you cover the essentials?",
    hint: "Cash you could reach within days: savings, offset, redraw.",
    options: [
      { label: "Less than a month", points: 0, tip: "A cash buffer is the foundation everything else stands on. Most plans start by building 3 months of essentials." },
      { label: "One to three months", points: 0.4, tip: "A solid start. The common target is 3-6 months of essential spending." },
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
      "High-interest debt goes first. It usually beats any investment return. Then make the home loan work harder: offsets, splits and debt recycling turn the same repayments into progress.",
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
    key: "superband",
    stage: "Making money work",
    area: "Super balance",
    type: "single",
    scored: false,
    label: "Roughly where does your super sit today?",
    hint: "Combined across accounts (and partners, if you plan together). It doesn't move the score. It changes which strategies are even on the table.",
    options: [
      { label: "Under $100k", points: 0 },
      { label: "$100k to $200k", points: 0 },
      { label: "$200k to $500k", points: 0 },
      { label: "Over $500k", points: 0 },
      { label: "Prefer not to say", points: 0 },
    ],
  },
  {
    key: "super",
    stage: "Making money work",
    area: "Super",
    type: "multi",
    label: "And how hands-on are you with it? Which of these are true?",
    hint: "Tick everything that applies. For most people super is the second-biggest asset they own.",
    lowTip:
      "Super is most people's second-biggest asset, run on default settings. Knowing the balance, choosing the investment option deliberately and adding even a little extra are the three highest-leverage moves.",
    options: [
      { label: "I know my current balance", points: 0.25 },
      { label: "I've deliberately chosen my investment option", points: 0.3 },
      { label: "I contribute more than the employer minimum", points: 0.25 },
      { label: "I run (or am working toward) an SMSF strategy", points: 0.2 },
      { label: "None of these: super runs itself", points: 0, none: true },
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
      "Wealth outside super is what funds life before preservation age, and a regular, automated plan usually beats ad-hoc buying. Even a small monthly amount compounds.",
    options: [
      { label: "I hold investments: shares, ETFs or property", points: 0.4 },
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
    label: "If illness or injury stopped you working, what's actually in place?",
    hint: "Tick everything you hold. Default cover inside super counts, but tick the review line only if someone has sized it to your real debts and dependants.",
    lowTip:
      "Protection is the part of wealth most people under-do: the FSC estimates 3.4 million Australians are underinsured for income protection alone. Your income funds every other answer in this check. Cover sized to your real debts and dependants (not the default in super) is usually the first advice conversation.",
    options: [
      { label: "Life cover", points: 0.2 },
      { label: "TPD (total & permanent disability) cover", points: 0.2 },
      { label: "Income protection", points: 0.3 },
      { label: "Trauma / critical illness cover", points: 0.1 },
      { label: "Cover reviewed against my debts and dependants in the last 3 years", points: 0.2 },
      { label: "No cover, or honestly not sure", points: 0, none: true },
    ],
    tool: { label: "Insurance advice fees are now often tax-deductible", href: "/insights/you-can-now-claim-a-tax-deduction-on-personal-insurance-advice-fees" },
  },
  {
    key: "estate",
    stage: "Protecting it",
    area: "Estate",
    type: "multi",
    label: "If something happened to you tomorrow, what paperwork is ready?",
    hint: "Tick everything that's current.",
    lowTip:
      "Without a will, state formulas decide, and super sits outside your will entirely. A will, enduring powers of attorney and up-to-date super death-benefit nominations are the minimum kit.",
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
    label: "And the plan holding it all together: what does it look like?",
    hint: "The thing that decides whether the other answers point in the same direction.",
    options: [
      { label: "There isn't one", points: 0, tip: "A goal without a number is a wish. Even one page with targets changes behaviour." },
      { label: "Goals, but they live in my head", points: 0.4, tip: "Write them down with dollar figures and dates. That's when trade-offs get visible." },
      { label: "Written goals with real numbers", points: 0.7, tip: "The last step is a review rhythm: a plan looked at yearly survives contact with real life." },
      { label: "A written plan I review at least yearly", points: 1 },
    ],
  },
  {
    key: "control",
    stage: "Pulling it together",
    area: "Control",
    type: "single",
    label: "Last one. Day to day, how does money actually feel?",
    hint: "The validated wellbeing scales all end up here: not what you have, but whether it runs you or you run it.",
    options: [
      { label: "It controls my life: constant stress", points: 0, tip: "Money stress is a signal, not a character flaw, and it usually traces to one or two of the flags above. Fixing the buffer and the highest-interest debt is where the feeling starts to shift." },
      { label: "I worry more than I'd like", points: 0.35, tip: "Worry usually lives in the unknowns: an unanswered 'are we okay?'. A plan with real numbers is the most reliable cure the research finds." },
      { label: "Mostly on top of it", points: 0.7, tip: "Solid. The step from 'on top of it' to genuinely calm is usually a written plan that's already decided what happens in a bad year." },
      { label: "Calm: money's a tool, not a worry", points: 1 },
    ],
  },
];

const SCORED = QUESTIONS.filter((q) => q.scored !== false);

const BANDS = [
  { min: 8.5, name: "Optimising", blurb: "The foundations are set and working. At this level the wins are in fine-tuning: tax structure, contribution strategy, and making sure the plan survives a bad year." },
  { min: 6.5, name: "Compounding", blurb: "You're ahead of most. The machine is built and running. The gap between here and optimised is usually structure: where assets sit, whose name they're in, and how tax-efficiently money moves." },
  { min: 4, name: "Building", blurb: "Real progress with real gaps. One or two of the flags below are quietly expensive. Closing them is usually worth more than picking better investments." },
  { min: 0, name: "Foundations first", blurb: "No judgement: almost everyone starts here. The flags below are in rough priority order, and the first two or three are usually fixable within a month." },
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

// ---- the commercial routing: profile -> "where this usually leads" ----
type Pathway = { title: string; body: string; href: string; linkLabel: string };

function buildPathways(sel: Selections): Pathway[] {
  const goals = new Set(sel["goals"] ?? []);
  const goalKids = goals.has(1);
  const goalRetire = goals.has(3);
  const goalBiz = goals.has(4);
  const ctx = new Set(sel["context"] ?? []);
  const biz = ctx.has(0) || goalBiz;
  const home = ctx.has(1);
  const retire10 = ctx.has(2) || goalRetire;
  const deps = ctx.has(3);
  const bandIdx = (sel["superband"] ?? [])[0];
  const superOver200k = bandIdx === 2 || bandIdx === 3;
  const protectQ = QUESTIONS.find((q) => q.key === "protect")!;
  const protectLow = (qScore(protectQ, sel["protect"]) ?? 0) < 0.8;

  const out: Pathway[] = [];
  if (biz && superOver200k) {
    out.push({
      title: "Your premises, owned by your super.",
      body: "Business owners with around $200k+ in super often use an SMSF to buy the premises they already rent, so the rent builds their retirement instead of a landlord's.",
      href: "/smsf",
      linkLabel: "How SMSF commercial property works",
    });
  } else if (biz) {
    out.push({
      title: "Profits into personal wealth.",
      body: "The gap between a good business and a wealthy owner is usually structure: how profit gets out of the company and into your name, tax-effectively.",
      href: "/business-owner-wealth-extraction-workshop-link-wealth",
      linkLabel: "The Business Owner Wealth Extraction Workshop",
    });
  }
  if ((deps || protectLow) && protectLow) {
    out.push({
      title: "Protection first: it's the part most people under-do.",
      body: deps
        ? "With people depending on your income, cover sized to your actual debts and dependants matters more than any investment choice, and part of the advice fee is now often tax-deductible."
        : "Cover sized to your actual debts and situation (not the default in super) is usually the quickest gap to close, and part of the advice fee is now often tax-deductible.",
      href: "/insights/you-can-now-claim-a-tax-deduction-on-personal-insurance-advice-fees",
      linkLabel: "What changed with insurance advice fees",
    });
  }
  if (retire10) {
    out.push({
      title: "The next ten years decide the shape of retirement.",
      body: "Inside a decade of retiring, sequencing matters as much as saving: contribution strategy, tax and when to de-risk. This is when a funding plan earns its keep.",
      href: "/retirement-funding-workshop-link-wealth",
      linkLabel: "The Retirement Funding Workshop",
    });
  }
  if (goalKids) {
    out.push({
      title: "Wealth that includes the kids.",
      body: "Education and investment bonds are a tax-effective way to build school fees and first-home head starts, one of the most-used tools in family wealth plans.",
      href: "/family-wealth-management",
      linkLabel: "How family wealth management works",
    });
  }
  if (home && !biz) {
    out.push({
      title: "The equity in your home can work harder.",
      body: "Homeowners often have more strategy options than they realise: offsets, splits, debt recycling and equity redeployed into investments, modelled against your own numbers.",
      href: "/home-equity-long-term-wealth-strategy",
      linkLabel: "The Equity Strategy Workshop",
    });
  }
  return out.slice(0, 3);
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
      <p className="mt-5 text-xl font-semibold">2 minutes. 9 areas. One real score.</p>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
        One screen at a time, starting where an adviser would: what you want money to do.
        Then where you stand, how it&apos;s working, what&apos;s protecting it, the plan, and
        how it all feels. Your score, the flags and the likely next steps show up straight
        away.
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
          Each scored answer pulls the shape outward. The dashed ring is the strong mark.
        </p>
      </div>
    </div>
  );
}

// ---- the radar - the 8 scored axes ----
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
        <polygon
          key={ring}
          points={SCORED.map((_, i) => pt(i, (ring / 10) * R).join(",")).join(" ")}
          fill="none"
          stroke="#e7e9ec"
          strokeWidth="1"
        />
      ))}
      {SCORED.map((_, i) => {
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
      {SCORED.map((q, i) => {
        if (qScore(q, sel[q.key]) == null) return null;
        const [x, y] = pt(i, (Math.max(0.4, val(q)) / 10) * R);
        return <circle key={q.key} cx={x} cy={y} r="4.5" fill="#1f9e84" style={{ transition: "all .4s" }} />;
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

// ---- results ----
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

function profileSummary(sel: Selections): string {
  const goalsQ = QUESTIONS.find((q) => q.key === "goals")!;
  const ctxQ = QUESTIONS.find((q) => q.key === "context")!;
  const bandQ = QUESTIONS.find((q) => q.key === "superband")!;
  const goals = (sel["goals"] ?? []).map((i) => goalsQ.options[i].label).join(", ") || "-";
  const ctx = (sel["context"] ?? []).map((i) => ctxQ.options[i].label).join(", ") || "-";
  const band = bandQ.options[(sel["superband"] ?? [])[0]]?.label ?? "-";
  return `Goals: ${goals}. Profile: ${ctx}. Super band: ${band}`;
}

function Results({ sel, onRestart }: { sel: Selections; onRestart: () => void }) {
  const score = (SCORED.reduce((a, q) => a + (qScore(q, sel[q.key]) ?? 0), 0) / SCORED.length) * 10;
  const band = BANDS.find((b) => score >= b.min)!;
  const flags = buildFlags(sel);
  const pathways = buildPathways(sel);

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
            Your shape: the dashed ring is the strong mark. The goal is to fill it on every axis.
          </p>
        </div>
      </div>

      {/* where this usually leads - profile-driven, general pathways */}
      {pathways.length > 0 && (
        <div className="mt-6 rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="eyebrow mb-5">
            <span className="text-white/60">Where this usually leads</span>
          </p>
          <div className={`grid gap-6 ${pathways.length === 2 ? "sm:grid-cols-2" : pathways.length >= 3 ? "sm:grid-cols-3" : ""}`}>
            {pathways.map((p) => (
              <div key={p.href} className="flex flex-col">
                <h4 className="font-display text-xl font-bold tracking-tight">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
                <a
                  href={p.href}
                  className="mt-auto pt-4 text-sm font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright"
                >
                  {p.linkLabel} →
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/45">
            General pathways people in similar positions often explore, not a recommendation.
            Whether any of them fit you is exactly what a discovery meeting works out.
          </p>
        </div>
      )}

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
          {SCORED.map((q) => {
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

      <SnapshotForm score={score} band={band.name} flags={flags} profile={profileSummary(sel)} />

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        The score weighs nine general markers of financial health equally. It doesn&apos;t know
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

// ---- snapshot lead form: score, flags AND profile travel with the enquiry ----
function SnapshotForm({
  score,
  band,
  flags,
  profile,
}: {
  score: number;
  band: string;
  flags: Flag[];
  profile: string;
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
          message: `Wealth Check result: ${score.toFixed(1)}/10 (${band}). ${profile}. Flags: ${
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
          Your result is with the team. An adviser will be in touch within a few business hours
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
        Turn the flags into a sequence. Free, with a licensed adviser.
      </h3>
      <p className="mt-2 max-w-xl text-white/65">
        Your score, flags and context travel with the enquiry, so the conversation starts at
        the answer, not the form. In the FAAA&apos;s Value of Advice research, 88% of advised
        Australians are confident they&apos;ll have enough for retirement, against 62% of the
        unadvised.
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
