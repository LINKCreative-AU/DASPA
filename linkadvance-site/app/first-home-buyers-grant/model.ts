// The FHOG QLD model: the grant constants and the eligibility questions the
// checker runs, kept out of the client component so the page can build the
// first-home concession stack table from exactly the same rules.
//
// Sources, checked August 2026:
//   grant amount and eligibility  qro.qld.gov.au/property-concessions-grants/first-home-grant/eligibility/
//   $30,000 continued from 1 July 2026  qro.qld.gov.au/2026/06/state-budget-2026/
//   duty concessions              lib/qld-duty.ts (QRO rates and concession tables)

import { duty, generalDuty, money } from "@/lib/qld-duty";

export const FHOG_AMOUNT = 30_000;
export const FHOG_VALUE_CAP = 750_000; // the home must be valued UNDER this, land included
export const FHOG_RESIDENCE_MONTHS = 6; // continuous, within 1 year of the completed transaction

export const fhogMoney = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export type Q = {
  key: string;
  label: string;
  hint?: string;
  options: { label: string; pass: boolean | null; why?: string }[];
};

export const QUESTIONS: Q[] = [
  {
    key: "age",
    label: "Are you 18 or older, applying as a person (not a company or trust)?",
    options: [
      { label: "Yes", pass: true },
      { label: "No", pass: false, why: "The grant is only available to natural persons aged 18+. Companies and trusts can't apply." },
    ],
  },
  {
    key: "resident",
    label: "Is at least one applicant an Australian citizen or permanent resident?",
    hint: "Since 1 August 2026 the transfer duty first home concessions carry the same requirement, so this answer now decides two benefits, not one.",
    options: [
      { label: "Yes", pass: true },
      { label: "No", pass: false, why: "At least one applicant must be an Australian citizen or permanent resident." },
    ],
  },
  {
    key: "priorGrant",
    label: "Have you or your spouse ever received a First Home Owner Grant anywhere in Australia?",
    options: [
      { label: "No, never", pass: true },
      { label: "Yes", pass: false, why: "A previous FHOG (yours or your spouse's, in any state) rules the grant out." },
    ],
  },
  {
    key: "priorHome",
    label: "Have you or your spouse ever owned AND lived in a property in Australia?",
    hint: "The QRO test is precise: residential property owned on or after 1 July 2000 counts only if you lived in it, but anything owned before 1 July 2000 counts whether you lived in it or not.",
    options: [
      { label: "No, never owned, or only an investment we never lived in", pass: true },
      { label: "Yes, owned and lived in one", pass: false, why: "Having owned and occupied a home before rules the grant out, though investment-only ownership from 1 July 2000 onward can survive the test; worth checking properly." },
    ],
  },
  {
    key: "newHome",
    label: "Is the home brand new, off the plan, a new build, or substantially renovated?",
    hint: "Cosmetic work (paint, sanded floors) doesn't count as substantial renovation.",
    options: [
      { label: "Yes: new, off the plan, building, or substantially renovated", pass: true },
      { label: "No, an established home", pass: false, why: "The QLD grant only applies to new or substantially renovated homes, but established-home buyers still get stamp duty concessions, which can be worth even more." },
    ],
  },
  {
    key: "value",
    label: `Will the total value (home plus land) be under ${fhogMoney(FHOG_VALUE_CAP)}?`,
    hint: "The QRO cap is 'less than $750,000' including land and any contract variations, so a $750,000 contract price is over the line, not on it.",
    options: [
      { label: "Yes, under $750k", pass: true },
      { label: "No, $750k or more", pass: false, why: "The grant caps total value (home + land) at less than $750,000, including contract variations." },
      { label: "Not sure yet", pass: null },
    ],
  },
  {
    key: "live",
    label: `Will you live in the home for at least ${FHOG_RESIDENCE_MONTHS} months within the first year?`,
    options: [
      { label: "Yes", pass: true },
      { label: "No / not sure", pass: null, why: "The residence requirement is six continuous months, and you must move in within a year of the completed transaction. If that's uncertain, it's worth a conversation before you commit." },
    ],
  },
];

// The stack table: for each scenario, what the grant and the duty concession
// are actually worth, computed from the same duty model the stamp duty
// calculator runs and the same $750,000 grant cap the checker applies.
export type StackRow = {
  scenario: string;
  value: number;
  grant: number;
  dutyPaid: number;
  investorDuty: number;
};

export function stackRow(scenario: string, value: number, kind: "new" | "established" | "land"): StackRow {
  const grant = kind === "new" && value < FHOG_VALUE_CAP ? FHOG_AMOUNT : 0;
  const buyer = kind === "new" ? "fh-new" : kind === "established" ? "fh-established" : "fh-land";
  return {
    scenario,
    value,
    grant,
    dutyPaid: Math.round(duty(value, buyer).duty),
    investorDuty: Math.round(generalDuty(value)),
  };
}

export const STACK: StackRow[] = [
  stackRow("New build or off the plan", 550_000, "new"),
  stackRow("New build or off the plan", 700_000, "new"),
  stackRow("New build or off the plan", 749_000, "new"),
  stackRow("New build or off the plan", 750_000, "new"),
  stackRow("New build or off the plan", 850_000, "new"),
  stackRow("Established home", 600_000, "established"),
  stackRow("Established home", 700_000, "established"),
  stackRow("Established home", 750_000, "established"),
  stackRow("Established home", 800_000, "established"),
  stackRow("Vacant land, then build", 350_000, "land"),
  stackRow("Vacant land, then build", 550_000, "land"),
];

export function stackRows(): (string | number)[][] {
  return STACK.map((r) => [
    `${r.scenario}, ${money(r.value)}`,
    r.grant > 0 ? money(r.grant) : "$0",
    money(r.dutyPaid),
    money(Math.max(r.investorDuty - r.dutyPaid, 0) + r.grant),
  ]);
}
