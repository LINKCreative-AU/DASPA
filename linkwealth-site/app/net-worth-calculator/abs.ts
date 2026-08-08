// ABS Survey of Income and Housing 2019-20: mean household net worth by age
// of household reference person - the most recent detailed age breakdown
// published. Overall that wave: mean $1.04m, median $579,200; later ABS
// releases put the national mean around $1.5m, so treat bands as markers of
// the SHAPE of the curve, not targets. Household figures, not per person.

export const ABS_BANDS: { band: string; mean: number }[] = [
  { band: "15-19", mean: 129_000 },
  { band: "20-24", mean: 82_000 },
  { band: "25-29", mean: 242_000 },
  { band: "30-34", mean: 441_000 },
  { band: "35-39", mean: 555_000 },
  { band: "40-44", mean: 841_000 },
  { band: "45-49", mean: 1_055_000 },
  { band: "50-54", mean: 1_212_000 },
  { band: "55-59", mean: 1_453_000 },
  { band: "60-64", mean: 1_601_000 },
  { band: "65-69", mean: 1_835_000 },
  { band: "70-74", mean: 1_509_000 },
  { band: "75+", mean: 1_167_000 },
];

export const ABS_SOURCE =
  "ABS Survey of Income and Housing 2019-20, mean household net worth by age of household reference person";
