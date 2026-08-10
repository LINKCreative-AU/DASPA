import type { Metadata } from "next";
import { getPost } from "@/lib/posts";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// The SMSF cluster's content spoke, upgraded in place: the live SMSF SERP's
// People Also Ask wants the 5% in-house asset rule and the NALI/NALE traps,
// and the protected /smsf page must stay verbatim - so the depth lives here.
// Original post copy verbatim; the rules section is additive.

const PATH = "/insights/buying-commercial-property";

export const metadata: Metadata = {
  title: { absolute: "Buying Commercial Property With an SMSF: Rules + Traps | LINK Wealth" },
  description:
    "How Australian business owners use SMSFs to buy commercial property, plus the rules the ATO actually polices: business real property, the 5% in-house asset rule, NALI/NALE and arm's length terms.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Buying commercial property with an SMSF: the rules that matter",
    description:
      "Business real property, the 5% in-house asset rule, NALI and arm's length terms, explained for business owners.",
    url: PATH,
    type: "article",
  },
};

// Answers the live SMSF SERP's People Also Ask gaps.
const FAQS = [
  {
    q: "What is the 5% SMSF rule?",
    a: "An SMSF can hold at most 5% of its total assets in 'in-house assets': investments in, loans to, or assets leased to related parties. Commercial property escapes the cap through a specific exception: business real property (property used wholly and exclusively in a business) can be leased to a related business at market rent without counting as an in-house asset. That exception is the entire legal basis of the buy-your-premises strategy, and it does not extend to residential property.",
  },
  {
    q: "What is NALI and why does it matter for SMSF property?",
    a: "Non-arm's length income (NALI) is income an SMSF earns from arrangements that are not on commercial terms, like your business paying above-market rent to the fund, or the fund buying the property below market value. NALI is taxed at 45% instead of 15%, which destroys the strategy's tax advantage. The cousin, NALE (non-arm's length expenses, e.g. free renovations by your own trade business), can taint the property's income the same way. Market-rate lease, independent valuations, documented terms: that discipline is what keeps the 15% rate.",
  },
  {
    q: "What counts as business real property?",
    a: "Land and buildings used wholly and exclusively in one or more businesses: an office, warehouse, factory, medical suite, shop or farm (a farmhouse on farming land has a limited allowance). The test is about use, not zoning: a residential house used as a genuine business premises can qualify, and a commercial unit sitting empty as an investment may not. It has to pass at the time the fund acquires or leases it to a related party.",
  },
  {
    q: "Can my SMSF renovate the property it bought with a loan?",
    a: "Under a limited recourse borrowing arrangement the fund can repair and maintain the property, but cannot use borrowed money to improve it, and cannot change the asset's fundamental character while the loan is in place (a warehouse cannot become apartments). Once the loan is repaid, improvements are generally allowed. Tenants (including your own business) typically handle fit-outs instead.",
  },
];

export default function Page() {
  const post = getPost("insights", "buying-commercial-property")!;

  return (
    <main>
      <JsonLd
        data={[
          articleSchema({
            title: "Buying commercial property with an SMSF: the rules that matter",
            description: metadata.description as string,
            path: PATH,
            datePublished: post.date,
            dateModified: "2026-08-08T00:00:00",
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: "Buying commercial property", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: "Buying commercial property", path: PATH },
        ]}
      />

      <article className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-wealth">
          Guide · updated 8 August 2026 · LINK Wealth
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal leading-[1.1] tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>

        {/* Original post, verbatim */}
        <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

        {/* Additive depth: the rules the SERP asks about */}
        <h2 className="mt-14 font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
          The rules the ATO actually polices.
        </h2>
        <p className="mt-5 text-lg text-ink/70">
          The strategy is legal and well-trodden, but it lives inside four rules. Get them
          right and the fund pays 15% on rent; get them wrong and the ATO's penalty settings
          take over.
        </p>
        <ol className="mt-5 list-decimal space-y-4 pl-6 text-lg text-ink/75">
          <li>
            <strong className="text-ink">Business real property.</strong> Your business can
            only lease property from your fund if it is used wholly and exclusively in a
            business. That exception is what lets the deal exist at all; residential property
            never qualifies for lease to you or your business.
          </li>
          <li>
            <strong className="text-ink">The 5% in-house asset rule.</strong> Related-party
            assets are capped at 5% of the fund; business real property leased at market
            rent is the carve-out. Stay inside the carve-out and the cap never bites.
          </li>
          <li>
            <strong className="text-ink">Arm's length everything (NALI/NALE).</strong> Market
            rent, independent valuations, real lease terms, no mates-rates services to the
            fund. Non-arm's length income is taxed at 45% instead of 15%, the single fastest
            way to wreck the economics.
          </li>
          <li>
            <strong className="text-ink">Borrowing limits (LRBA).</strong> The fund can borrow
            through a limited recourse arrangement, but borrowed money can repair, not
            improve, and the asset cannot change character while the loan runs.
          </li>
        </ol>
        <p className="mt-5 text-lg text-ink/70">
          This is why the strategy runs as a team sport:{" "}
          <a href="/smsf" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
            our SMSF commercial property page
          </a>{" "}
          covers how the adviser, accountant and lender coordinate it end to end.
        </p>
      </article>

      {/* FAQs (visible text and schema kept in sync) */}
      <section className="py-20">
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
        heading="Thinking about buying your premises with super?"
        intro="Get the free SMSF Property Purchase Guide and a no-obligation strategy call: whether the strategy fits, how much your SMSF could borrow, and what the rules mean for your setup."
        variant="guide"
        subject="Buying commercial property guide"
        formTitle="Get the free SMSF guide"
      />
    </main>
  );
}
