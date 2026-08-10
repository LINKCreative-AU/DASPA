// The scoring model for the home loan health check, kept out of the client
// component so the page can render the same bands, areas and weights as a
// crawlable table. Changing a question or a band here changes both at once.

export type Option = { label: string; points: number; none?: boolean; tip?: string };
export type Question = {
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

export const QUESTIONS: Question[] = [
  {
    key: "context",
    stage: "About the loan",
    area: "Context",
    type: "multi",
    scored: false,
    label: "First, which of these describe your situation?",
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
    hint: "Not what it was at settlement, but what it is today.",
    options: [
      { label: "Honestly, no idea", points: 0, tip: "Your rate is the single most expensive thing to not know. Find it on your statement or app in two minutes, then compare it. Loyalty is priced." },
      { label: "Roughly", points: 0.4, tip: "Close enough to start. Now compare it against what your own lender offers new customers for the same loan." },
      { label: "Exactly", points: 0.7, tip: "Knowing it is half the job; the other half is knowing what the market (and your own lender's new customers) pay." },
      { label: "Exactly, and I've compared it recently", points: 1 },
    ],
  },
  {
    key: "review",
    stage: "The basics",
    area: "Review",
    type: "single",
    label: "When was the loan last reviewed or repriced?",
    hint: "A review means someone compared it or pushed the lender for a sharper rate, not just a statement arriving.",
    options: [
      { label: "Never, or 3+ years ago", points: 0, tip: "Loans drift. Three unreviewed years is typically thousands in loyalty tax. A repricing call to your lender is free and often works same-week." },
      { label: "A couple of years back", points: 0.4, tip: "The market has moved since. An annual review (not necessarily a refinance) keeps the rate honest." },
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
      "Structure is free money: an offset you actually use, extra or fortnightly repayments and deliberate splits can save more than a rate cut, and they're available without refinancing.",
    options: [
      { label: "An offset account with real money in it", points: 0.4 },
      { label: "Extra repayments (or fortnightly payments)", points: 0.3 },
      { label: "A deliberate fixed/variable split", points: 0.3 },
      { label: "None of these", points: 0, none: true },
    ],
    tool: { label: "What extra repayments save: calculator", href: "/home-loan-repayment-calculator" },
  },
  {
    key: "fit",
    stage: "How it's built",
    area: "Fit",
    type: "single",
    label: "Since the loan was set up, how much has life changed?",
    hint: "Income, family, plans: the loan was built for a version of you.",
    options: [
      { label: "A lot, and the loan hasn't been touched", points: 0, tip: "A loan set up for a different life rarely fits the current one: features, structure and even the lender may be wrong now. That's a review conversation, not necessarily a refinance." },
      { label: "A fair bit", points: 0.4, tip: "Worth a check: changed income or plans often unlock better options (or flag risks worth restructuring around)." },
      { label: "A little", points: 0.7 },
      { label: "Not much, or the loan was updated as life changed", points: 1 },
    ],
  },
  {
    key: "equity",
    stage: "The position",
    area: "Equity",
    type: "single",
    label: "Do you know your equity position, roughly what share of the property you own?",
    options: [
      { label: "No idea", points: 0, tip: "Equity is your option book: it decides your rate band (LVR), whether LMI ever applies again, and what the next move could be funded with. Estimate it in two minutes: value minus loan." },
      { label: "Roughly", points: 0.5, tip: "Good. The next step is knowing your usable equity (what a lender would release at 80% LVR), because that's the number that funds renovations or the next property." },
      { label: "Yes, I know it", points: 0.8 },
      { label: "Yes, including what's usable for the next move", points: 1 },
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

export const SCORED = QUESTIONS.filter((q) => q.scored !== false);

export const BANDS = [
  { min: 8.5, name: "Dialled in", blurb: "The loan is being managed the way brokers manage them: sharp rate, working structure, annual attention. The remaining wins are opportunistic: cashbacks, split tweaks, and the next property's pre-positioning." },
  { min: 6.5, name: "Mostly working", blurb: "The bones are good, but at least one lever (rate, structure or attention) is idle. Idle levers on a mortgage are measured in thousands per year." },
  { min: 4, name: "Drifting", blurb: "This is where most loans live: set up properly once, then left alone while the lender quietly repriced the loyalty. The flags below are usually fixable inside a fortnight, often without refinancing." },
  { min: 0, name: "On autopilot", blurb: "No judgement: loans are built to be forgotten. But on a typical balance, the gap between an autopilot loan and a managed one is serious money. Start with the first flag below." },
];

export type Selections = Record<string, number[]>;

export function qScore(q: Question, sel: number[] | undefined): number | null {
  if (!sel || sel.length === 0) return null;
  if (q.type === "single") return q.options[sel[0]].points;
  const noneIdx = sel.find((i) => q.options[i].none);
  if (noneIdx != null) return q.options[noneIdx].points;
  const sum = (q.base ?? 0) + sel.reduce((a, i) => a + q.options[i].points, 0);
  return Math.max(0, Math.min(1, sum));
}

