// The country gate, in one place.
//
// Extracted from api/identity-session.js so /api/identity and
// /api/identity-session cannot drift apart on which passports Stripe Identity
// is allowed to look at. Two copies of a compliance rule is one copy too many.
//
// The restriction is CONTRACTUAL, not a coverage gap: both countries appear in
// Stripe's supported-document list, and the Stripe Identity Agreement prohibits
// verifying anyone linked directly or indirectly with China or the Russian
// Federation. The agreement sits on the same Stripe account that takes every
// payment, so a refusal here is cheaper than a breach.

'use strict';

// Countries the Stripe Identity Agreement puts out of reach (see the header).
// The claim form takes country of issue as free text, so this has to absorb
// spellings, abbreviations and scripts rather than match a code. Hong Kong and
// Macau are included because they are Chinese SARs travelling on Chinese SAR
// passports, and the agreement says "linked directly or indirectly".
//
// Taiwan is deliberately NOT here. Stripe lists Taiwan separately in its own
// supported-document tables, so blocking it would refuse claimants Stripe is
// willing to verify. Worth a written answer from Stripe before launch, because
// Taiwanese claimants are a real share of this market.
const MANUAL_ONLY = [
  /\bchina\b/, /\bchinese\b/, /\bprc\b/, /\bp\.?r\.?c\b/, /\bcn\b/, /\bchn\b/,
  /中国/, /中國/,
  /\bhong\s*kong\b/, /\bhksar\b/, /\bhk\b/, /香港/,
  /\bmaca[uo]\b/, /\bmo\b/, /澳門/, /澳门/,
  /\brussia\b/, /\brussian\b/, /\bru\b/, /\brus\b/, /росси/i,
];

// Explicitly naming Taiwan wins over the China patterns, so "Republic of China
// (Taiwan)" is read as Taiwan. "Republic of China" on its own is not exempted:
// it is ambiguous, and a needless manual check costs us nothing while a wrongly
// permitted one breaches the agreement.
const TAIWAN = [/\btaiwan\b/, /\btwn?\b/, /台湾/, /台灣/];

function manualOnly(country) {
  const c = String(country || '').toLowerCase().trim();
  if (!c) return false;
  if (TAIWAN.some((re) => re.test(c))) return false;
  return MANUAL_ONLY.some((re) => re.test(c));
}

module.exports = { manualOnly };
