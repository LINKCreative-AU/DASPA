// QLD transfer duty model: ONE source of truth for the calculator, the
// crawlable tables on /stamp-duty-calculator-qld, and the first-home stack
// table on /first-home-buyers-grant. The page can never disagree with the
// tool because both import this file.
//
// Rates and concessions as published by the Queensland Revenue Office
// (qro.qld.gov.au), checked August 2026:
//   general rates            qro.qld.gov.au/duties/transfer-duty/calculate/rates/
//   home concession rates    .../calculate/concession-rates/
//   first home concession    .../concessions/homes/first-home/
//   first home (new home)    .../concessions/homes/first-home-new-home/   (1 May 2025)
//   first home vacant land   .../concessions/homes/first-home-vacant-land/ (1 May 2025)
//   AFAD 8%                  .../transfer-duty/additional/afad/            (1 Jul 2024)
// Indicative only: this is not the QRO's own estimator.

export const AFAD_RATE = 0.08; // additional foreign acquirer duty, from 1 July 2024

// General transfer duty (the rate investors and anyone without a concession pay).
export function generalDuty(v: number): number {
  if (v <= 5_000) return 0;
  if (v <= 75_000) return ((v - 5_000) / 100) * 1.5;
  if (v <= 540_000) return 1_050 + ((v - 75_000) / 100) * 3.5;
  if (v <= 1_000_000) return 17_325 + ((v - 540_000) / 100) * 4.5;
  return 38_025 + ((v - 1_000_000) / 100) * 5.75;
}

// Home (owner-occupier) concession: $1 per $100 on the first $350k, then
// general marginal rates above.
export function homeDuty(v: number): number {
  if (v <= 350_000) return v * 0.01;
  let d = 3_500;
  const over = (from: number, to: number, rate: number) =>
    (Math.max(Math.min(v, to) - from, 0) / 100) * rate;
  d += over(350_000, 540_000, 3.5);
  d += over(540_000, 1_000_000, 4.5);
  d += over(1_000_000, Infinity, 5.75);
  return d;
}

// The first home concession is a further reduction of the home-concession
// duty, and the QRO publishes it as a stepped table (contracts from
// 9 June 2024), not a straight line.
const FIRST_HOME_STEPS: [number, number][] = [
  [710_000, 17_350],
  [720_000, 15_615],
  [730_000, 13_880],
  [740_000, 12_145],
  [750_000, 10_410],
  [760_000, 8_675],
  [770_000, 6_940],
  [780_000, 5_205],
  [790_000, 3_470],
  [800_000, 1_735],
];

export function firstHomeConcession(v: number): number {
  for (const [ceiling, amount] of FIRST_HOME_STEPS) if (v < ceiling) return amount;
  return 0;
}

export type Buyer = "fh-new" | "fh-established" | "fh-land" | "home" | "investor";

export const BUYER_OPTIONS: { key: Buyer; label: string }[] = [
  { key: "fh-new", label: "First home: new build / off the plan" },
  { key: "fh-established", label: "First home: established home" },
  { key: "fh-land", label: "First home: vacant land" },
  { key: "home", label: "Home to live in (not first)" },
  { key: "investor", label: "Investment property" },
];

export function duty(v: number, b: Buyer): { duty: number; note: string } {
  if (v <= 0) return { duty: 0, note: "" };
  switch (b) {
    case "fh-new":
      return {
        duty: 0,
        note: "First home buyers pay no transfer duty on new homes in QLD (contracts from 1 May 2025), with no price cap.",
      };
    case "fh-established": {
      const base = homeDuty(v);
      const d = Math.max(base - firstHomeConcession(v), 0);
      if (d === 0) return { duty: 0, note: "Full first home concession: no duty up to $700,000." };
      if (v < 800_000)
        return {
          duty: d,
          note: "The first home concession steps down in $10,000 price bands between $700,000 and $800,000, so the duty climbs quickly through this range.",
        };
      return {
        duty: d,
        note: "At $800,000 and above the first home concession no longer applies. The owner-occupier home rate applies instead.",
      };
    }
    case "fh-land":
      return {
        duty: 0,
        note: "First home vacant land attracts a full concession in QLD (contracts from 1 May 2025), with no value cap. You must build and move in within 2 years of settlement.",
      };
    case "home":
      return {
        duty: homeDuty(v),
        note: "Owner-occupier (home) concession rate applied. You must move in within a year of settlement and live there daily.",
      };
    case "investor":
      return {
        duty: generalDuty(v),
        note: "General transfer duty rates, with no concession for investment purchases.",
      };
  }
}

// Money, rounded to the dollar, for the crawlable tables.
export const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
