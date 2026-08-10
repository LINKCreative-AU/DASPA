// The scoring model for the business borrowing health check, kept out of the client
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
    stage: "About the business",
    area: "Context",
    type: "multi",
    scored: false,
    label: "First, which of these describe the business?",
    hint: "Tick everything that's true. This doesn't move the score; it shapes the next steps.",
    options: [
      { label: "We rent our premises", points: 0 },
      { label: "Trading for 2+ years", points: 0 },
      { label: "A purchase is on the cards: property, business or equipment", points: 0 },
      { label: "Cash flow gets tight some months", points: 0 },
      { label: "Carrying short-term or high-rate business debt", points: 0 },
    ],
  },
  {
    key: "structure",
    stage: "The bones",
    area: "Structure",
    type: "single",
    label: "How is the business structured?",
    hint: "Structure decides what lenders can lend to, and how tax-effectively debt sits.",
    options: [
      { label: "Sole trader, never really reviewed", points: 0.3, tip: "Sole-trader lending works, but companies and trusts unlock more lenders and cleaner security. A structure review with an accountant often pays for itself in the lending alone." },
      { label: "Company or trust, set up years ago and left alone", points: 0.6, tip: "Structures age: what fit at startup rarely fits at scale. A structure that matches today's business reads better to credit teams." },
      { label: "Company/trust structure, reviewed with an accountant recently", points: 1 },
      { label: "Honestly not sure", points: 0.2, tip: "If you're not sure, a lender will be less sure. It's a fifteen-minute question for an accountant and it changes what's fundable." },
    ],
  },
  {
    key: "numbers",
    stage: "The bones",
    area: "Numbers",
    type: "single",
    label: "How current are the financials?",
    hint: "Lenders price the file, and the file is mostly the numbers.",
    options: [
      { label: "Last year's still aren't done", points: 0, tip: "Out-of-date financials are the #1 reason commercial deals stall. Lender-ready numbers (even management accounts) move approvals from months to weeks." },
      { label: "Annuals done, nothing in between", points: 0.4, tip: "Annuals get you assessed; up-to-date management accounts get you believed. Quarterly numbers are the fundable rhythm." },
      { label: "Annuals + management accounts kept current", points: 0.8 },
      { label: "Current, and we know our key numbers cold", points: 1 },
    ],
  },
  {
    key: "profit",
    stage: "The engine",
    area: "Profit",
    type: "single",
    label: "What's the profit trend over the last two years?",
    options: [
      { label: "Loss-making or breakeven", points: 0.1, tip: "Losses narrow the lender pool but don't close it: asset-backed and turnaround lending exist. The story and the plan matter more than ever." },
      { label: "Profitable but bumpy", points: 0.5, tip: "Lenders read volatility as risk. The file needs to explain the bumps (projects, seasons, one-offs) before the credit team guesses." },
      { label: "Steadily profitable", points: 0.8 },
      { label: "Profitable and growing", points: 1 },
    ],
  },
  {
    key: "addbacks",
    stage: "The engine",
    area: "Add-backs",
    type: "multi",
    label: "Which of these are true about what the business really earns?",
    hint: "Tick everything that applies. Lenders assess maintainable earnings: profit AFTER the story is understood.",
    lowTip:
      "The gap between taxable profit and true earning power (directors' wages above or below market, one-off costs, personal expenses) is where commercial serviceability is won or lost. Knowing your add-backs, with evidence, can double what the file supports.",
    options: [
      { label: "Directors' wages are deliberate (not just what was left over)", points: 0.3 },
      { label: "We know our add-backs: one-offs, personal costs through the business", points: 0.4 },
      { label: "The accountant has discussed profit presentation for lending", points: 0.3 },
      { label: "None of these: profit is just what the tax return says", points: 0, none: true },
    ],
    tool: { label: "How acquisition lenders read add-backs", href: "/business-acquisition-loans" },
  },
  {
    key: "ato",
    stage: "The engine",
    area: "ATO",
    type: "single",
    label: "Where does the ATO position sit?",
    hint: "Arrears aren't fatal to a deal. Surprises are.",
    options: [
      { label: "Behind, no arrangement", points: 0, tip: "An undisclosed ATO debt kills more commercial deals than any other single factor. The same debt WITH a payment plan is routinely fundable." },
      { label: "Behind, but on a payment plan", points: 0.5, tip: "Workable: lenders fund businesses on ATO plans every week; the plan just has to be in the file, not discovered." },
      { label: "Up to date, sometimes tight", points: 0.8 },
      { label: "Clean and current", points: 1 },
    ],
  },
  {
    key: "facilities",
    stage: "The debt",
    area: "Facilities",
    type: "multi",
    label: "The existing debt: which of these are true?",
    hint: "Tick everything that applies.",
    lowTip:
      "Business debt drifts harder than home loans: facilities roll over at last year's margin, short-term loans stack, and nobody's comparing. An annual facility review is the commercial version of the repricing call, and it's free.",
    options: [
      { label: "We know every facility's rate and fees", points: 0.3 },
      { label: "Facilities were reviewed or repriced in the last 18 months", points: 0.4 },
      { label: "No expensive short-term debt (or it's there deliberately)", points: 0.3 },
      { label: "None of these", points: 0, none: true },
    ],
  },
  {
    key: "security",
    stage: "The debt",
    area: "Security",
    type: "single",
    label: "Do you know what security the business could offer, and what's already pledged?",
    options: [
      { label: "No real idea", points: 0.1, tip: "Security is your pricing lever: knowing what's available (property, equipment, debtors) and what's already encumbered decides which lenders and rates are on the table." },
      { label: "Roughly", points: 0.5, tip: "Worth mapping properly: directors are often personally guaranteeing more than they realise, and old encumbrances routinely outlive the loans they secured." },
      { label: "Yes, including existing guarantees and encumbrances", points: 0.9 },
      { label: "Yes, and it's structured deliberately", points: 1 },
    ],
  },
];

export const SCORED = QUESTIONS.filter((q) => q.scored !== false);

export const BANDS = [
  { min: 8.5, name: "Bankable", blurb: "This file would read well on a credit desk. The wins from here are pricing and structure: competition between lenders, and security working as hard as it can." },
  { min: 6.5, name: "Fundable", blurb: "The bones are good; one or two gaps are costing pricing power. Closing them before the next application usually pays for itself in the rate." },
  { min: 4, name: "Preparable", blurb: "Fundable with preparation. Most businesses sit here. The flags this check raises are the pre-lender checklist; several are accountant conversations, not lending ones." },
  { min: 0, name: "Groundwork first", blurb: "No judgement, but going to lenders now would price badly or stall. The flags this check raises, roughly in order, are the groundwork that changes the answer." },
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

