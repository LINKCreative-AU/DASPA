import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ, CheckList } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// NEW page from the second research pass: "first home super saver" 778/mo
// at KD 7 with 20k traffic potential - the fourth leg of the first-home
// stack the site already owns. Figures hedged, ato.gov.au named.

const PATH = "/first-home-super-saver";

export const metadata: Metadata = {
  title: { absolute: "First Home Super Saver Scheme (FHSS): Save Your Deposit Inside Super" },
  description:
    "The FHSS scheme explained: salary-sacrifice up to $15,000 a year (up to $50,000 total) into super at 15% tax instead of your marginal rate, then release it - plus earnings - for your first home deposit. How it works, the traps, and how it stacks with the QLD grants.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "How does the First Home Super Saver Scheme work?", a: "You make voluntary contributions into super - salary sacrifice or personal deductible contributions, taxed at 15% instead of your marginal rate - then apply to the ATO to release up to $50,000 of those contributions (plus deemed earnings) for your first home deposit. For someone on a 32% marginal rate, that tax gap builds a deposit meaningfully faster than a savings account." },
  { q: "How much can I contribute under the FHSS?", a: "Up to $15,000 of voluntary contributions per financial year count toward the scheme, with a $50,000 total cap per person - so a couple can release up to $100,000 plus deemed earnings. Contributions must stay within your normal concessional cap ($30,000 including employer contributions)." },
  { q: "What are the traps?", a: "Three real ones: the release takes time (apply for the determination BEFORE you sign a contract - the ATO release can take weeks); only voluntary contributions count, not employer super; and if you don't buy within 12 months of release (extendable to 24), the money goes back into super or cops extra tax. Sequencing the release around your purchase is exactly what your broker coordinates." },
  { q: "Does the FHSS stack with the QLD grants?", a: "Yes - fully. FHSS builds the deposit, the First Home Guarantee cuts the deposit needed to 5% with no LMI, the $30,000 FHOG applies on new builds, and QLD first-home stamp duty relief stacks on top. The full stack routinely adds up to $50,000+ of advantage." },
  { q: "Is the FHSS worth it?", a: "For most first home buyers saving over 2+ years on a middle tax bracket, yes - the 15% contributions tax versus your marginal rate is a structural head start no savings account matches. It's least useful for very short timeframes (the admin overhead) or very low incomes (small tax gap). Moneysmart and ato.gov.au carry the official detail." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "First Home Super Saver", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd data={[faqSchema(FAQS), breadcrumbSchema(CRUMBS)]} />
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            title="Build your deposit inside super - at 15% tax."
            mark="at 15% tax."
            intro="The FHSS scheme lets you save your first home deposit through voluntary super contributions taxed at 15% instead of your marginal rate, then release up to $50,000 each (plus earnings) when you buy. It's the least-known leg of the first-home stack - and one of the most valuable for planners."
            accent
          />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              The mechanics, in four steps.
            </h2>
            <CheckList
              items={[
                "Contribute - salary sacrifice or personal deductible contributions, up to $15,000/year counting toward the scheme ($50,000 total each)",
                "Grow - the ATO applies a deemed earnings rate to your FHSS balance while it sits in super",
                "Determine - request an FHSS determination from the ATO BEFORE signing any contract, then request the release",
                "Buy - sign within 12 months of the release (extendable), and the funds settle into your deposit",
              ]}
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              Why it beats the savings account.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              Every dollar you salary-sacrifice goes in at 15% tax instead of your marginal
              rate. On a 32% marginal rate, $15,000 of pre-tax salary becomes about $12,750
              inside super versus roughly $10,200 in your bank account - a 25% head start
              before earnings, repeated every year you save. A couple both using the scheme
              can release up to $100,000 plus deemed earnings.
            </p>
            <p className="mt-4 text-lg text-ink/65">
              The trade-off is flexibility: the money is locked to the home purchase (or
              stays in super), the release has real lead time, and only voluntary
              contributions count. The scheme rewards people who plan 1-3 years ahead -
              which is exactly the conversation to have alongside your borrowing power and
              the rest of the first-home stack.
            </p>
          </div>
        </div>
      </section>

      <FAQ
        title="FHSS, answered."
        faqs={FAQS}
        related={[
          { label: "First Home Guarantee (5% deposit)", href: "/first-home-guarantee" },
          { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
        ]}
      />

      <CtaBand
        heading="Stack all four legs before you save another dollar."
        intro="FHSS, the Guarantee, the grant and the duty relief - a broker sequences them around your timeframe, free."
        subject="First Home Super Saver"
      />
    </main>
  );
}
