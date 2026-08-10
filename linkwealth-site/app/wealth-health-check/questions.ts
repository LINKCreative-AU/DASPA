// The Wealth Check question set, bands and scoring, in a plain module so the
// page (a server component) can render a crawlable table of the same scale the
// client tool applies. Data only: no React, no "use client".

export type Option = { label: string; points: number; none?: boolean; tip?: string };
export type Question = {
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

export const QUESTIONS: Question[] = [
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

export const SCORED = QUESTIONS.filter((q) => q.scored !== false);

// The scored areas, exported so the page can render a crawlable table of the
// same scale the tool applies (a client-rendered tool is invisible to Google).
export const SCORED_AREAS = SCORED.map((q) => ({
  area: q.area,
  stage: q.stage,
  question: q.label,
  best: q.type === "single"
    ? q.options[q.options.length - 1].label
    : q.options.filter((o) => !o.none && o.points > 0).map((o) => o.label).join("; "),
}));

export const BANDS = [
  { min: 8.5, name: "Optimising", blurb: "The foundations are set and working. At this level the wins are in fine-tuning: tax structure, contribution strategy, and making sure the plan survives a bad year." },
  { min: 6.5, name: "Compounding", blurb: "You're ahead of most. The machine is built and running. The gap between here and optimised is usually structure: where assets sit, whose name they're in, and how tax-efficiently money moves." },
  { min: 4, name: "Building", blurb: "Real progress with real gaps. One or two of the flags below are quietly expensive. Closing them is usually worth more than picking better investments." },
  { min: 0, name: "Foundations first", blurb: "No judgement: almost everyone starts here. The flags below are in rough priority order, and the first two or three are usually fixable within a month." },
];

// selections per question key (option indices) - kept raw so Back restores
// exactly what was ticked, and multi scores stay recomputable
export type Selections = Record<string, number[]>;

export function qScore(q: Question, sel: number[] | undefined): number | null {
  if (!sel || sel.length === 0) return null;
  if (q.type === "single") return q.options[sel[0]].points;
  const noneIdx = sel.find((i) => q.options[i].none);
  if (noneIdx != null) return q.options[noneIdx].points;
  const sum = (q.base ?? 0) + sel.reduce((a, i) => a + q.options[i].points, 0);
  return Math.max(0, Math.min(1, sum));
}
