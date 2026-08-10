import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// NEW page, born from the SERP: every People Also Ask slot under "financial
// advisor brisbane" is a cost question ("How much does a financial advisor
// cost in Brisbane?", "Is it worth paying?", "What is a normal fee?", "Is
// $500,000 enough?") and nobody at advice quality answers with numbers.
// Same play as Advisors' /how-much-does-an-accountant-cost and the
// AI-discoverability standard: publish the number everyone else hides,
// hedge honestly, name the free path.

const PATH = "/how-much-does-a-financial-advisor-cost";

export const metadata: Metadata = {
  title: { absolute: "How Much Does a Financial Advisor Cost in Australia? (2026)" },
  description:
    "Real numbers: what financial advice costs in Australia in 2026: initial advice documents, ongoing fees, hourly rates, and LINK Wealth's own pricing ($0 first meeting, $660 strategy workshops).",
  alternates: { canonical: PATH },
  openGraph: {
    title: "How Much Does a Financial Advisor Cost in Australia?",
    description:
      "Published numbers for initial and ongoing advice fees, what moves them, and when advice is worth paying for.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How much does a financial advisor cost in Brisbane?",
    a: "The same as elsewhere in Australia: expect roughly $3,500-$6,000 for an initial Statement of Advice from a quality firm (industry surveys put the national average around $5,000-$6,000 in 2025-26), and $3,000-$8,000+ a year for ongoing advice depending on complexity. At LINK Wealth the first meeting is free and a full strategy workshop is $660 with a money-back Value Guarantee, so you can see the value before committing to a full advice engagement.",
  },
  {
    q: "Is it worth paying for a financial advisor?",
    a: "It depends on what is at stake. Advice tends to pay for itself when a decision is large and hard to reverse: structuring a business exit, an SMSF property purchase, retirement drawdown, debt recycling, or an inheritance. For simple situations, the free guidance on Moneysmart.gov.au and your super fund's intra-fund advice may be enough, and we will tell you if that is the case.",
  },
  {
    q: "What is a normal fee for a financial advisor to charge?",
    a: "Three common models: a fixed fee for an advice document (roughly $3,500-$6,000 initial), an ongoing fixed fee ($3,000-$8,000+ a year), or hourly rates (commonly $250-$450). Percentage-of-assets fees still exist but are increasingly rare. Any licensed adviser must disclose fees up front in their Financial Services Guide. Ours is linked in the footer of every page.",
  },
  {
    q: "Is $500,000 enough to work with a financial advisor?",
    a: "Yes, and you do not need anywhere near that. Fixed-fee advice makes sense when the fee is small relative to the value of the decisions, not the size of the portfolio. Building wealth isn't just for those with millions in the bank; strategies like super contributions, insurance structuring and debt recycling matter most in the accumulation years.",
  },
];

const TABLE: [string, string, string][] = [
  ["First conversation at LINK Wealth", "$0", "Free, no-obligation discovery meeting. We get to know you and your goals."],
  ["LINK strategy workshop", "$660 inc GST", "90 minutes one-on-one with a licensed adviser, modelling your numbers. Value Guarantee: full refund if you don't find it worthwhile."],
  ["Initial advice document (SoA), industry-wide", "≈ $3,500-$6,000", "Industry surveys put the average cost of initial advice around $5,000-$6,000 in 2025-26. Complexity moves the real number."],
  ["Ongoing advice, industry-wide", "≈ $3,000-$8,000+ / yr", "Annual strategy, portfolio and insurance reviews. Scales with complexity (entities, SMSF, property)."],
  ["Hourly / one-off scoped advice", "≈ $250-$450 / hr", "Some firms offer scoped, pay-as-you-go advice on a single question."],
  ["Free general guidance", "$0", "Moneysmart.gov.au (government), your super fund's intra-fund advice line."],
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "What financial advice costs", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "What financial advice costs", path: PATH },
        ]}
      />

      <article className="container-x max-w-3xl pb-16 pt-10 sm:pt-14">
        <span className="eyebrow text-wealth">Fees, published</span>
        <h1 className="mt-6 font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px]">
          How much does a financial advisor <span className="marker">actually cost?</span>
        </h1>
        <p className="mt-6 text-lg text-ink/80">
          <strong className="text-ink">
            In Australia in 2026, initial advice typically costs $3,500-$6,000 and ongoing
            advice $3,000-$8,000+ a year.
          </strong>{" "}
          Almost nobody publishes their numbers, which is why every search for a financial
          advisor turns into "contact us for a quote". Here are the numbers, including ours.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-ink/15 py-2 pr-4 text-left font-semibold text-ink">What</th>
                <th className="border-b-2 border-ink/15 py-2 pr-4 text-left font-semibold text-ink">Cost</th>
                <th className="border-b-2 border-ink/15 py-2 text-left font-semibold text-ink">Notes</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map(([what, cost, notes]) => (
                <tr key={what}>
                  <td className="border-b border-ink/10 py-3 pr-4 align-top font-semibold text-ink">{what}</td>
                  <td className="border-b border-ink/10 py-3 pr-4 align-top whitespace-nowrap font-bold text-wealth">{cost}</td>
                  <td className="border-b border-ink/10 py-3 align-top text-ink/70">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink/55">
          Industry-wide figures are indicative ranges from published adviser fee surveys and
          move with complexity: a couple with a company, trust and SMSF pays more than a
          single person with one super fund. Every licensed adviser must disclose their fees
          in a Financial Services Guide before you commit; ours is linked in the footer.
        </p>

        <h2 className="mt-14 font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
          What moves the fee.
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink/75">
          <li>Entities: companies, trusts and SMSFs multiply the modelling and compliance work.</li>
          <li>Scope: a single question costs less than a full plan across super, investments, debt and insurance.</li>
          <li>Implementation: advice that must be executed (rollovers, structures, insurance underwriting) carries more work than a strategy paper.</li>
          <li>Ongoing vs one-off: a standing relationship costs more per year but catches problems while they are cheap.</li>
        </ul>

        <h2 className="mt-14 font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
          The honest version of "is it worth it?"
        </h2>
        <p className="mt-5 text-lg text-ink/70">
          Paying $5,000 for advice to shuffle a simple index portfolio is poor value. Paying
          $5,000 before an SMSF property purchase, a business exit, or a decade of debt
          recycling is usually the cheapest insurance you will ever buy: one structural
          mistake in any of those costs multiples of the fee. If your situation is simple,
          start with the free tools: Moneysmart.gov.au, your super fund's advice line, and
          our own{" "}
          <a href="/home-equity-estimator-calculator" className="font-semibold text-wealth underline decoration-wealth/40 underline-offset-2">
            equity
          </a>{" "}
          and{" "}
          <a href="/insights/wealth-creation-using-debt-recycling#calculator" className="font-semibold text-wealth underline decoration-wealth/40 underline-offset-2">
            debt recycling
          </a>{" "}
          calculators. When the numbers get big, get advice.
        </p>
      </article>

      {/* FAQs (visible text and schema kept in sync) */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink">
            Frequently asked questions.
          </h2>
          <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="text-wealth transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Start with the free conversation."
        intro="Your first meeting costs nothing and obligates you to nothing. We'll tell you what advice would cost for your situation, and whether you need it at all."
        subject="Advice cost page"
      />
    </main>
  );
}
