import type { Metadata } from "next";
import { getPost } from "@/lib/posts";
import { DebtRecyclingCalculator } from "./DebtRecyclingCalculator";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// The site's biggest keyword opportunity, upgraded from a blog post to a
// pillar: "debt recycling" 4,627/mo KD 0 + "debt recycling australia"
// 1,145/mo KD 0 + "debt recycling calculator" 518/mo KD 0. SERP check
// (8 Aug 2026): NAB, AMP and Reddit hold the top - but rispin.au ranks #6
// with DR 3 and zero referring domains, so content wins here, and nobody in
// the top 10 ships a calculator. Original post copy kept verbatim below the
// new answer-first head; the FAQs answer the live People Also Ask questions.

const PATH = "/insights/wealth-creation-using-debt-recycling";

export const metadata: Metadata = {
  title: { absolute: "Debt Recycling Australia: How It Works + Calculator | LINK Wealth" },
  description:
    "Debt recycling converts your non-deductible home loan into tax-deductible investment debt while you build a portfolio. How it works, a worked example, the risks, and a free calculator.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Debt Recycling Australia: How It Works + Calculator",
    description:
      "Turn your home loan into a wealth creation engine: strategy, worked example, risks and a free debt recycling calculator.",
    url: PATH,
    type: "article",
  },
};

// The live People Also Ask questions for "debt recycling", answered.
const FAQS = [
  {
    q: "Is debt recycling legal in Australia?",
    a: "Yes. Debt recycling uses ordinary loan features (repayments, redraws or split loans) and the standard tax rule that interest on money borrowed to produce assessable income is deductible. The structure has to be clean (borrowed funds must go directly to income-producing investments, never mixed with personal spending), which is where advice earns its keep.",
  },
  {
    q: "Does debt recycling actually work?",
    a: "It works when your after-tax investment return beats your loan rate over the period. The tax deduction lowers the effective cost of the investment debt, which tilts the odds in your favour, but markets can underperform your mortgage rate for years at a time. It suits investors with stable income, a cash-flow buffer and a decade-plus timeframe, not someone who would be forced to sell in a downturn.",
  },
  {
    q: "What is an example of debt recycling?",
    a: "You have a $500,000 home loan and $20,000 of surplus cash each year. You pay the $20,000 into the loan, then redraw it through an investment split and buy a share portfolio. The interest on the redrawn $20,000 is now tax-deductible, and dividends plus the tax saving go back into the home loan, so each year more of your debt converts from non-deductible to deductible while a portfolio builds.",
  },
  {
    q: "Is debt recycling the same as negative gearing?",
    a: "No. Negative gearing means your investment costs (mostly interest) exceed the income it produces, and you claim the loss against your salary. Debt recycling is about converting existing home loan debt into deductible investment debt. The investment can be positively or negatively geared. The two can overlap, but recycling works best when the investments produce income to fire back at the home loan. See our negative gearing analysis for that side of the story.",
  },
  {
    q: "Do I need a financial adviser to debt recycle?",
    a: "No. Your bank can set up a split loan and you can invest yourself. Advice matters for the structure (keeping deductible and non-deductible debt separate so the ATO position is clean), the sizing (how much leverage your cash flow can safely carry), and the investment selection. Our Equity Strategy Workshop models exactly this for your numbers, for $660 with a full refund if it is not worth it.",
  },
];

export default function Page() {
  const post = getPost("insights", "wealth-creation-using-debt-recycling")!;

  return (
    <main>
      <JsonLd
        data={[
          articleSchema({
            title: "Debt Recycling Australia: How It Works + Calculator",
            description: metadata.description as string,
            path: PATH,
            datePublished: post.date,
            dateModified: "2026-08-08T00:00:00",
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: "Debt recycling", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: "Debt recycling", path: PATH },
        ]}
      />

      <article className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-wealth">
          Guide · updated 8 August 2026 · LINK Wealth
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal leading-[1.1] tracking-tight text-ink sm:text-4xl">
          Maximise wealth through debt recycling.
        </h1>

        {/* Answer-first, for snippets and AI overviews */}
        <p className="mt-6 rounded-xl2 border border-wealth/30 bg-wealth-light/40 p-5 text-lg text-ink/85">
          <strong>Debt recycling</strong> is the strategy of paying down your non-deductible
          home loan and re-borrowing the same amount to invest in income-producing assets,
          converting "bad" debt into tax-deductible investment debt while a portfolio builds.
          It is legal, uses ordinary loan features, and works when your long-run investment
          return beats your mortgage rate. It adds risk: you are investing with borrowed money
          against your home.
        </p>

        {/* Original post, verbatim */}
        <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {/* The calculator nobody else in the SERP has */}
      <section id="calculator" className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink">
              Debt recycling calculator.
            </h2>
            <p className="mt-4 text-lg text-ink/70">
              Compare directing your surplus cash at the mortgage alone versus recycling it
              into investments, using your own numbers.
            </p>
          </div>
          <div className="mt-8">
            <DebtRecyclingCalculator />
          </div>
        </div>
      </section>

      {/* FAQs = the live PAA questions (visible text and schema kept in sync) */}
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
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/home-equity-estimator-calculator" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:border-wealth hover:text-ink">
              Home equity calculator →
            </a>
            <a href="/home-equity-long-term-wealth-strategy" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:border-wealth hover:text-ink">
              Equity Strategy Workshop →
            </a>
            <a href="/insights/is-negative-gearing-actually-dead-not-even-close" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:border-wealth hover:text-ink">
              Negative gearing analysis →
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Thinking about recycling your mortgage into wealth?"
        intro="Talk with a licensed financial adviser about whether debt recycling fits your cash flow, tax position and goals. The first conversation is free and no-obligation."
        variant="discovery"
        subject="Debt recycling guide"
      />
    </main>
  );
}
