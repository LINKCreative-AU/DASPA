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

/* Passports we cannot take at all, which is a different thing from manual-only.

   Stripe's Identity use-case terms (docs.stripe.com/identity/use-cases, read
   4 November 2026) bar verifying anyone linked with Cuba, Iran, North Korea or
   Syria, and the same countries are on Stripe's restricted list for taking
   payment, so there is no manual route either: we could not charge the fee.
   China and Russia are manual-only because Stripe can still take their payment.

   The same terms also name the Crimea, Donetsk and Luhansk regions. A passport
   country cannot express a region, so those are not caught here; a Ukrainian
   passport is fine.

   The claim form now picks the country from a list (names from the browser's
   Intl region names, e.g. "North Korea"), but older rows and any hand-typed
   value are free text, so this matches spellings rather than one string. */
const SANCTIONED = [
  /\bcuba\b/, /\bcub\b/,
  /\biran\b/, /\birn\b/, /islamic republic of iran/,
  /\bnorth korea\b/, /\bdprk\b/, /\bprk\b/, /democratic people'?s republic of korea/,
  /\bsyria\b/, /\bsyrian\b/, /\bsyr\b/,
];

function sanctioned(country) {
  const c = String(country || '').toLowerCase().trim();
  if (!c) return false;
  return SANCTIONED.some((re) => re.test(c));
}

/* Claim-level versions, checking where the client lives as well as who issued
   the passport. Stripe's wording is "linked directly or indirectly", and a
   French passport holder living in Shanghai is linked with China whatever the
   passport says. Decided 4 November 2026.

   Each returns a short reason naming the field and country, or null, so the
   team alert can say which one tripped it. Passport first, because that is
   the document Stripe would be looking at. */
function why(claim, test) {
  const c = claim || {};
  if (test(c.passport_country)) return `passport issued by ${c.passport_country}`;
  if (test(c.address_country)) return `client lives in ${c.address_country}`;
  return null;
}
const manualOnlyReason = (claim) => why(claim, manualOnly);
const sanctionedReason = (claim) => why(claim, sanctioned);

module.exports = { manualOnly, sanctioned, manualOnlyReason, sanctionedReason };
