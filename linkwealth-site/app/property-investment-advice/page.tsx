/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";

// Head terms: "property investment advice" (336/mo, KD 8) + "property
// investment advisor australia" (150/mo). Intro copy verbatim. The old
// page's "Essentials of Property Investment" accordion linked four anchors
// that never existed on the page (dead links, live 2026-08-08) - those four
// topics are now real sections.

const PATH = "/property-investment-advice";
const TITLE = "Property Investment Advice to Grow and Protect Your Wealth";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description:
    "Independent property investment advice from LINK Wealth's Brisbane advisors: whether property fits your strategy, which type suits you, and how SMSFs, equity and cash flow come together.",
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description:
      "At LINK, we help you decide if property investment is the right step for your financial journey.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "Do I need a financial adviser to invest in property?",
    a: "You don't need one to buy, but you do benefit from one before you commit. An adviser stress-tests whether property fits your cash flow, tax position and goals, and whether shares, super or a blended approach would serve you better. We advise on the strategy; we don't sell property, so the advice has no listing behind it.",
  },
  {
    q: "Is an investment property better than shares?",
    a: "Neither is better in isolation. Property offers leverage and stability but concentrates risk in one asset and one suburb; shares offer liquidity and diversification but more day-to-day volatility. The right mix depends on your equity, income, timeframe and temperament. That is what the advice works out.",
  },
  {
    q: "Can I use my home equity to buy an investment property?",
    a: "Often, yes. Lenders typically let you borrow against up to 80% of your home's value. Whether you should depends on your cash flow buffer and goals. Start with our free home equity calculator, then model the strategy properly in an Equity Strategy Workshop.",
  },
  {
    q: "Can my super buy property?",
    a: "Through a self-managed super fund, yes, including the commercial premises your own business rents. Residential property in an SMSF is possible but often less suitable. See our SMSF commercial property page for how the strategy works.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(
            "Property investment advice",
            "Advice on whether property investment fits your wealth strategy, which property type suits you, and how to fund it.",
            PATH
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Property Investment Advice", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Property Investment Advice", path: PATH },
        ]}
      />

      {/* Hero - verbatim intro */}
      <section className="container-x grid items-start gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-2">
        <div>
          <span className="eyebrow text-wealth">Property investment</span>
          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Property Investment Advice to <span className="marker">grow and protect your wealth.</span>
          </h1>
          <div className="mt-6 space-y-4 text-lg text-ink/70">
            <p>
              At LINK, we help you decide if property investment is the right step for your
              financial journey. Property is a powerful asset, but it should never sit in
              isolation. It needs to work as part of your bigger wealth strategy.
            </p>
            <p>
              We take the time to review your financial position and show you where property
              fits in. The goal is to make sure your investments are balanced, affordable, and
              aligned with both your short-term lifestyle and long-term wealth goals. For some
              people, property can deliver strong growth and diversification.
            </p>
            <p>
              For others, it may create unnecessary risks or cash-flow strain. Our job is to
              give you clear, tailored advice so you can make confident, informed choices.
            </p>
          </div>
        </div>
        <div className="self-center rounded-3xl bg-ink p-8 text-white">
          <h2 className="font-display text-xl font-bold">
            Book your free discovery meeting to get started.
          </h2>
          <p className="mt-2 text-sm text-white/65">
            We’ll be in touch within a few business hours to set up a time.
          </p>
          <a href="#contact" className="btn mt-5 bg-white text-ink hover:bg-neutral-100">
            Book my free discovery meeting
          </a>
        </div>
      </section>

      <div className="container-x pb-14">
        <img
          src="/wp-content/uploads/2024/12/AdobeStock_599893056-1-min-scaled.jpeg"
          alt="A couple comparing property listings while planning an investment purchase"
          loading="lazy"
          className="aspect-[21/8] w-full rounded-3xl object-cover"
        />
      </div>

      {/* The essentials - the four promised topics, now with real content */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            The Essentials of Property Investment
          </h2>

          <h3 id="pros-cons" className="mt-12 scroll-mt-24 font-display text-2xl font-bold text-ink">
            Investment property: pros and cons
          </h3>
          <div className="mt-4 space-y-4 text-lg text-ink/70">
            <p>
              Property's strengths are real: you can borrow against it at scale, rents tend to
              rise with inflation, and a well-chosen asset compounds quietly for decades. Add
              tax levers like depreciation and negative gearing and it is easy to see why
              Australians love it.
            </p>
            <p>
              The costs are just as real: stamp duty and agent fees at each end, land tax,
              maintenance, vacancy risk, and concentration: one asset, one suburb, one
              tenant. A property that strains your cash flow can force you to sell at the
              worst time. The pros only win when the numbers work in your plan, not in a
              seminar spreadsheet.
            </p>
          </div>

          <h3 id="right-type-investment-property" className="mt-12 scroll-mt-24 font-display text-2xl font-bold text-ink">
            Choosing the right type of investment property
          </h3>
          <div className="mt-4 space-y-4 text-lg text-ink/70">
            <p>
              Houses, units, townhouses, commercial premises: each behaves differently.
              Houses typically carry more land value and growth; units yield more but grow
              slower; commercial property offers higher yields and longer leases with more
              vacancy risk. New builds bring depreciation benefits, established homes bring
              negotiating room and proven streets.
            </p>
            <p>
              The right type is the one that matches your cash flow, borrowing power and
              timeframe, not the one being promoted this month. That is the assessment we
              build with you before you ever go to an open home.
            </p>
          </div>

          <h3 id="self-managed-super-funds" className="mt-12 scroll-mt-24 font-display text-2xl font-bold text-ink">
            The role of self-managed super funds in property investment
          </h3>
          <div className="mt-4 space-y-4 text-lg text-ink/70">
            <p>
              An SMSF can buy property your personal name cannot reach tax-effectively:
              rental income inside super is taxed at 15%, capital gains as low as 10%, and
              potentially 0% in retirement phase. For business owners, the standout play is
              buying your own business premises through your SMSF and paying rent to your own
              retirement fund instead of a landlord.
            </p>
            <p>
              The rules are strict (arm's length leases, limited recourse borrowing, liquidity
              requirements), which is why the strategy needs an adviser, an SMSF accountant
              and a specialist lender working together.{" "}
              <a href="/smsf" className="font-semibold text-wealth underline decoration-wealth underline-offset-2">
                See how the SMSF commercial property strategy works
              </a>
              .
            </p>
          </div>

          <h3 id="brisbane-market-overview" className="mt-12 scroll-mt-24 font-display text-2xl font-bold text-ink">
            Funding it: equity, borrowing and cash flow
          </h3>
          <div className="mt-4 space-y-4 text-lg text-ink/70">
            <p>
              Most investors fund their first property with home equity rather than cash.
              Knowing your usable equity (typically up to 80% of your home's value minus your
              loan) tells you what is realistic before you fall in love with a listing. Our{" "}
              <a href="/home-equity-estimator-calculator" className="font-semibold text-wealth underline decoration-wealth underline-offset-2">
                free home equity calculator
              </a>{" "}
              gives you that number in under a minute.
            </p>
            <p>
              From there, strategies like{" "}
              <a href="/insights/wealth-creation-using-debt-recycling" className="font-semibold text-wealth underline decoration-wealth underline-offset-2">
                debt recycling
              </a>{" "}
              can make the same dollars work twice: converting non-deductible home loan debt
              into deductible investment debt as you build the portfolio.
            </p>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FAQs (visible text and schema kept in sync) */}
      <section className="py-20">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink">
            Property investment advice FAQs
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

      <CtaBand variant="discovery" subject="Property Investment Advice" formTitle="Book your free discovery meeting" />
    </main>
  );
}
