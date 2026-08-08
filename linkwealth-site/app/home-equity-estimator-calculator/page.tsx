import type { Metadata } from "next";
import { Calculator } from "./Calculator";
import { JsonLd, breadcrumbSchema, calculatorSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// The equity calculator is the site's biggest organic opportunity: "home
// equity calculator" 1,077/mo KD 0, parent topic "equity calculator"
// 5,918/mo, ~11k traffic potential. The old page ranked nowhere because the
// tool rendered from Elementor JS with almost no crawlable copy - the
// answer-first copy and FAQs below are the fix. Old title tag kept (it was
// the one well-optimised head on the site).

const PATH = "/home-equity-estimator-calculator";

export const metadata: Metadata = {
  title: { absolute: "Home Equity Calculator Australia | Estimate Property Equity (AUD)" },
  description:
    "Estimate your home equity in Australia using our free calculator. Enter your property value and loan balance to see equity in AUD. General information only.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Home Equity Calculator Australia",
    description:
      "Free Australian home equity calculator: property value minus loans, plus usable equity at 80% LVR.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How do I calculate my home equity?",
    a: "Home equity = your property's current market value minus everything secured against it (your home loan balance and any other secured debts, like a line of credit). For example, a $900,000 home with a $500,000 loan has $400,000 of equity.",
  },
  {
    q: "What is usable equity?",
    a: "Usable equity is the part of your equity a lender will typically let you borrow against - usually up to 80% of your property's value minus your current loan. On a $900,000 home with a $500,000 loan, usable equity is roughly $220,000 (80% x $900,000 - $500,000).",
  },
  {
    q: "How much equity do I need to buy an investment property?",
    a: "As a rough guide you need enough usable equity to cover a 10-20% deposit plus purchase costs (stamp duty, legal fees). Whether that is a good idea depends on your cash flow, goals and risk position - that is exactly what our Equity Strategy Workshop models for you.",
  },
  {
    q: "Is this calculator financial advice?",
    a: "No. This calculator provides general information only and does not take into account your objectives, financial situation or needs. Results are estimates and may differ from actual outcomes. Consider seeking independent financial, legal or taxation advice before acting on the results.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          calculatorSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Home Equity Calculator", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Home Equity Calculator", path: PATH },
        ]}
      />

      <section className="container-x py-14 sm:py-20">
        <div className="max-w-3xl">
          <span className="eyebrow text-wealth-dark">Free tool</span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Home Equity <span className="marker">Estimator</span>
          </h1>
          {/* Answer-first: the formula in the first paragraph, for featured
              snippets and AI overviews as much as for readers. */}
          <p className="mt-6 text-lg text-ink/70">
            <strong className="text-ink">
              Your home equity is your property’s value minus what you owe on it.
            </strong>{" "}
            Unlock a clearer picture of your property wealth with our Home Equity Estimator —
            a simple tool designed to help you understand how much equity you may have built
            in your home.
          </p>
          <p className="mt-4 text-ink/70">
            Whether you’re planning future investments, considering refinancing, or simply
            want to track your financial progress, this estimator gives you an easy way to
            gauge your current equity position.
          </p>
        </div>

        <div className="mt-10">
          <Calculator />
        </div>

        <p className="mt-6 max-w-3xl rounded-xl2 border border-line bg-cloud p-5 text-sm text-ink/60">
          <strong className="text-ink/80">Important:</strong> This calculator provides general
          information only and does not take into account your objectives, financial situation
          or needs. Results are estimates and may differ from actual outcomes. Consider
          seeking independent financial, legal or taxation advice before acting on the
          results.
        </p>
      </section>

      {/* What to do with the number - internal links to the money pages */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Know your equity? Here’s what it can do.
          </h2>
          <p className="mt-5 text-lg text-ink/70">
            Discover how to make your property and cash work harder — whether through shares,
            investment property, or a blended debt-recycling approach. It starts with a simple
            conversation:
          </p>
          <ul className="mt-5 space-y-2 text-ink/75">
            <li>
              Talk with a licensed financial adviser about how to make the most of your home
              equity
            </li>
            <li>See if you’re on track and explore the steps to unlock your property wealth.</li>
          </ul>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a href="/home-equity-long-term-wealth-strategy" className="rounded-xl2 border border-line bg-white p-5 font-semibold text-ink transition hover:border-wealth-mid">
              Equity Strategy Workshop →
            </a>
            <a href="/insights/wealth-creation-using-debt-recycling" className="rounded-xl2 border border-line bg-white p-5 font-semibold text-ink transition hover:border-wealth-mid">
              Debt recycling explained →
            </a>
            <a href="/property-investment-advice" className="rounded-xl2 border border-line bg-white p-5 font-semibold text-ink transition hover:border-wealth-mid">
              Property investment advice →
            </a>
          </div>
        </div>
      </section>

      {/* FAQs (visible text and schema kept in sync) */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Home equity questions, answered.
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl2 border border-line bg-white p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-bold text-ink marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Talk to Richard about ways to use your home equity."
        intro="Request a call back. Talk with a licensed financial adviser about how to make the most of your home equity, and explore the steps to unlock your property wealth."
        variant="discovery"
        subject="Home Equity Calculator"
        formTitle="Request a call back"
      />
    </main>
  );
}
