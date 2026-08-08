/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { Section, FeatureGrid, CheckList, ProcessSteps, FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// PROTECTED PAGE (James, 2026-08-08: replicate precisely). Every sentence,
// FAQ, infographic and stat is carried verbatim from the live page in the
// live order - only the schema and heading structure are optimised, and the
// layout follows the shared V1.5 bones.
// Head terms: "smsf property investment" (627/mo, KD 2) + "smsf commercial
// property" (175/mo, KD 0).

const PATH = "/smsf";
const TITLE = "SMSF Commercial Property. Use Your Super to Invest.";
const DESC =
  "Speak to Richard Leal for financial advice on how to use your super to buy commercial property through an SMSF.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PATH,
    images: [{ url: "/wp-content/uploads/2026/03/smsf-business-loss-839x1024.png" }],
  },
};

const WHO_FOR = [
  "You own and operate an established Australian business with stable cashflow.",
  "Your business leases commercial premises (office, warehouse, professional suite).",
  "You have at least $200k in super individually or as a couple combined in super.",
  "You're serious about building long-term wealth through your business.",
];

const WHY_WORKS = [
  {
    title: "Turn rent into an asset.",
    body: "With capital growth and equity that belongs to you. So your rent supports your retirement, not someone else’s.",
  },
  {
    title: "Powerful tax effectiveness.",
    body: "Rental income inside super is taxed at 15%. Capital gains tax can be as low as 10%, or 0% once you retire.",
  },
  {
    title: "No change to cashflow.",
    body: "Your business operates the same. You pay the same rent. Just to a different destination.",
  },
  {
    title: "Control your premises.",
    body: "No rent hikes. No surprise sales. No cancelled lease. Your super owns the building, so your interests come first.",
  },
  {
    title: "Made for business owners.",
    body: "Not a speculative property strategy. A business and wealth strategy, for those who want more from their money.",
  },
];

const HOW = [
  {
    title: "Take control of your super.",
    body: "Your existing super is rolled into a new Self Managed Super Fund (SMSF).",
  },
  {
    title: "Your business leases the premises from your SMSF.",
    body: "A formal lease is drawn up, at genuine market rent, and your business continues running exactly as it does today.",
  },
  {
    title: "Rent flows into your super fund.",
    body: "You pay the rent into your SMSF. Inside your super, that money compounds and grows, while you pay less tax.",
  },
  {
    title: "Your SMSF builds equity in a commercial asset.",
    body: "The fund pays down the loan. Capital growth and rental income accumulate inside super.",
  },
];

const SPECIALISTS = [
  {
    team: "LINK WEALTH",
    title: "Wealth advisors.",
    body: "Your SMSF strategy isn’t one-size-fits-all. Our licensed financial advisors assess your situation, model the numbers and map out exactly what a commercial property purchase could look like for you.",
    points: ["Suitability assessment.", "SMSF strategy.", "Cashflow modelling.", "Compliance planning."],
    img: "/wp-content/uploads/2026/03/99109d48c9e8ab6e6ffd7c6f16c0112a3894821c-1024x707.jpg",
  },
  {
    team: "LINK ADVISORS",
    title: "Chartered Accountants.",
    body: "Administering an SMSF is complex. Our expert SMSF accountants give you the clarity to stay compliant, minimise your tax and get the most from your fund.",
    points: ["SMSF setup.", "Ongoing tax support.", "Reporting and advice.", "Administration and BAS lodgement."],
    img: "/wp-content/uploads/2026/03/e953c0024cfd5eaad86b140858c1279cdcdacfd6-1024x719.jpg",
  },
  {
    team: "LINK ADVANCE",
    title: "Lending specialists.",
    body: "SMSF commercial property loans are a specialist game. Our licensed mortgage brokers know the lenders, their credit policies and exactly what it takes to get a deal across the line. Fast.",
    points: ["Personalised lending options.", "Direct access to lenders.", "Loan application support.", "Ongoing rate negotiations."],
    img: "/wp-content/uploads/2026/03/7fc0621d17b2e02bf1cc7bd17b4876ecb41abbb61-1024x683.jpg",
  },
];

// All 14 live FAQs, verbatim.
const FAQS = [
  {
    q: "What types of property can an SMSF purchase?",
    a: "An SMSF can acquire both commercial and residential property. Commercial property includes assets such as offices, warehouses, factories, medical suites, retail shops and hospitality venues. Residential property can also be purchased, however it is often less suitable due to lower yields and stricter compliance constraints compared to commercial property.",
  },
  {
    q: "Can my business rent the property from my SMSF?",
    a: "Yes – but only if the property qualifies as business real property. This means the property must be used wholly and exclusively in a business. The lease must be on arm’s length commercial terms, with rent charged at market rates and supported by a formal lease agreement. Residential property cannot be leased to you or your business.",
  },
  {
    q: "Can I transfer a property I already own into my SMSF?",
    a: "Yes – provided the property qualifies as business real property and is transferred at market value.",
  },
  {
    q: "Can the SMSF buy a property before my business moves in?",
    a: "Yes. The property can be leased to a third party initially and later leased to your business, provided all arrangements remain on arm’s length terms.",
  },
  {
    q: "Who can be a member of an SMSF?",
    a: "SMSFs commonly include spouses, but can also include other individuals such as family members or business partners. More complex member structures can introduce additional risks and should be carefully considered.",
  },
  {
    q: "Can my SMSF borrow money to buy property?",
    a: "Yes. SMSFs can borrow using a Limited Recourse Borrowing Arrangement (LRBA), which allows the fund to purchase property under specific rules.",
  },
  {
    q: "How much super do I need to buy property through an SMSF?",
    a: "There is no fixed minimum, however these strategies are generally more effective with higher super balances. Lenders typically require a 25–35% deposit, plus funds to cover purchase costs such as stamp duty and legal fees. Additional contributions may be used to help fund the purchase, subject to limits. It’s also important the fund retains sufficient liquidity to meet ongoing expenses. Advice should be sought to determine what’s appropriate for your circumstances.",
  },
  {
    q: "How much deposit does an SMSF usually need?",
    a: "Typically, a deposit of 25–35% is required, depending on the lender and structure.",
  },
  {
    q: "Who pays the property expenses?",
    a: "This depends on the lease terms. In many commercial property arrangements, the tenant pays some or all of the outgoings, such as council rates, insurance and maintenance. The exact responsibilities should be clearly set out in the lease agreement.",
  },
  {
    q: "Can improvements or renovations be done on an SMSF property?",
    a: "If the property is acquired using borrowed funds, you cannot make substantial alterations while the loan is in place. Where no borrowing exists, improvements are generally allowed. In commercial property, tenants often undertake fit-outs rather than the SMSF altering the core structure.",
  },
  {
    q: "What are the main benefits of owning business premises in an SMSF?",
    a: "Key benefits include: paying rent to your own super fund instead of a landlord, potential tax efficiencies, greater control over your business premises, and building long-term retirement assets within super.",
  },
  {
    q: "Can I have more than one property in my SMSF?",
    a: "Yes. An SMSF can hold multiple properties, provided the fund has sufficient resources and remains compliant with diversification and liquidity requirements. Each acquisition should be considered in the context of the overall investment strategy of the fund.",
  },
  {
    q: "What tax rate applies to rental income inside an SMSF?",
    a: "Rental income is generally taxed at 15% while the fund is in accumulation phase. Where the fund is supporting retirement phase pensions, some or all of this income may be tax-free (0%), depending on the proportion of the fund in pension phase and applicable limits.",
  },
  {
    q: "What happens to the capital gain if the SMSF sells the property?",
    a: "In accumulation phase, capital gains are taxed at 15%, with a 1/3 discount applying if the asset is held for more than 12 months (effective rate of 10%). If the fund is in retirement phase, some or all of the capital gain may be tax-free, depending on the proportion of assets supporting pensions.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(
            "SMSF commercial property advice",
            "Financial advice for Australian business owners using a self-managed super fund to buy their business premises.",
            PATH
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "SMSF Commercial Property", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "SMSF Commercial Property", path: PATH },
        ]}
      />

      {/* Hero - verbatim, with the live Scott success-story card */}
      <section className="container-x grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHead
            as="h1"
            eyebrow="Australian SMSF commercial property specialists"
            title="Stop paying rent to a landlord. Buy your business premises with super instead."
            mark="with super"
            intro="If your business leases commercial property, you could redirect that rent into your own Self-Managed Super Fund (SMSF). Transforming your rent into an asset you control, without changing how your business operates."
            accent
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn btn-primary">
              Show me how
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/55">
            <span aria-hidden className="text-wealth">
              ★★★★★
            </span>{" "}
            Licensed tax agents, financial advisors &amp; mortgage brokers · ASIC &amp; ATO
            compliant
          </p>
        </div>
        <a
          href="/case-studies/scott-bought-his-business-premises-with-his-super"
          className="group rounded-3xl border border-ink/10 bg-neutral-50 p-7 transition hover:border-wealth/40"
        >
          <p className="eyebrow mb-4">
            <span className="text-wealth">Success story</span>
          </p>
          <p className="font-display text-2xl font-bold tracking-tight text-ink transition group-hover:text-wealth">
            Scott bought his business premises with his super.
          </p>
          <p className="mt-3 text-ink/65">
            Find out how Scott used his SMSF to buy the warehouse his business operates from.
          </p>
          <p className="mt-4 text-sm font-semibold text-wealth">Read success story →</p>
        </a>
      </section>

      {/* The problem / the alternative - verbatim, house dark section */}
      <section className="bg-ink py-20 text-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight sm:text-4xl">
              Your rent is making someone else wealthy.
            </h2>
            <p className="mt-5 text-white/70">
              Think about how much rent your business has paid. Now think about what you have
              to show for it. No equity. No asset. Just a landlord who’s done very well out of
              your business.
            </p>
            <p className="mt-4 text-white/70">
              A landlord who can sell the building. Hike the rent. Decide not to renew. A
              landlord who takes action on their terms, not yours.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight sm:text-4xl">
              But what if your rent could work for you instead?
            </h2>
            <p className="mt-5 text-white/70">
              There’s a legal, ATO-compliant and highly tax effective alternative most business
              owners don’t know about. Eligible business owners can use their super to purchase
              a commercial premises, then lease it back to their business at market rent.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-display text-base font-bold">
                  Your business operates exactly as it does today.
                </h3>
                <p className="mt-1.5 text-sm text-white/60">
                  The only thing that changes is where the money goes (and what it does for you
                  over time).
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-display text-base font-bold">
                  Your money works harder for you.
                </h3>
                <p className="mt-1.5 text-sm text-white/60">
                  Instead of funding someone else’s retirement, you’ll fund your own. Same
                  premises. Same rent. Better outcome.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for - verbatim */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <SectionHead
            eyebrow="Who it’s for"
            title="This strategy suits a specific type of business owner."
          />
          <CheckList items={WHO_FOR} />
        </div>
      </section>

      {/* Why it works - verbatim */}
      <Section
        tint
        eyebrow="Why it works"
        title="Why do business owners use their super to buy their premises?"
      >
        <FeatureGrid items={WHY_WORKS} cards />
      </Section>

      {/* How it works - verbatim, house numbered steps + live infographics */}
      <Section eyebrow="How it works" title="How it works.">
        <ProcessSteps steps={HOW} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <figure>
            <figcaption className="mb-3 font-display text-lg font-bold tracking-tight text-ink">
              Your Current Situation
            </figcaption>
            <img
              src="/wp-content/uploads/2026/03/smsf-business-loss-839x1024.png"
              alt="Diagram of the current situation: your business pays rent to a landlord and builds no asset"
              loading="lazy"
              className="w-full rounded-2xl border border-ink/10"
            />
          </figure>
          <figure>
            <figcaption className="mb-3 font-display text-lg font-bold tracking-tight text-ink">
              Our SMSF Strategy
            </figcaption>
            <img
              src="/wp-content/uploads/2026/03/smsf-business-win-838x1024.png"
              alt="Diagram of the SMSF strategy: your business pays market rent to your own super fund, which builds equity in the premises"
              loading="lazy"
              className="w-full rounded-2xl border border-ink/10"
            />
          </figure>
        </div>
        <div className="mt-12 rounded-3xl bg-ink p-8 text-white sm:p-10">
          <h3 className="font-display text-2xl font-normal tracking-tight">
            Is this strategy right for you?
          </h3>
          <p className="mt-3 max-w-2xl text-white/70">
            Reach out and we’ll schedule a free, no-obligation strategy call to determine if
            this is right for you. Plus, you’ll get a free copy of our SMSF Property Purchase
            Guide delivered to your inbox instantly.
          </p>
          <a href="#contact" className="btn mt-6 bg-white text-ink hover:bg-neutral-100">
            Show me how
          </a>
        </div>
      </Section>

      {/* How we help - verbatim */}
      <Section
        tint
        eyebrow="How we help"
        title="All the specialists you need. Working together."
        intro="To do this properly, you need a licensed financial advisor, an SMSF accountant and a specialist SMSF lender. Most firms only handle one part of the strategy. LINK coordinates the whole process. From start to finish."
      >
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SPECIALISTS.map((s) => (
            <div key={s.team} className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
              <img
                src={s.img}
                alt={`${s.title.replace(/\.$/, "")} at LINK`}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="p-7">
                <p className="eyebrow mb-4 !text-[10px]">
                  <span className="text-wealth">{s.team}</span>
                </p>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.body}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/65">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-wealth">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/50">
          * Our teams operate independently, as regulation requires. With your consent, we
          work together to implement the strategy, keeping things simple for you.
        </p>
      </Section>

      {/* Why us - verbatim, with the live page's stat counters as static values */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <SectionHead
            eyebrow="Why us?"
            title="SMSF commercial property specialists."
            intro="Licensed tax agents, financial advisors & mortgage brokers. Helping business owners grow wealth."
          />
          <dl className="mt-10 grid grid-cols-2 gap-5 sm:max-w-md">
            <div className="rounded-2xl border border-ink/10 p-6">
              <dd className="font-display text-4xl font-semibold text-wealth">100%</dd>
              <dt className="mt-1 text-sm font-semibold text-ink/55">ASIC &amp; ATO compliant</dt>
            </div>
            <div className="rounded-2xl border border-ink/10 p-6">
              <dd className="font-display text-4xl font-semibold text-wealth">30+</dd>
              <dt className="mt-1 text-sm font-semibold text-ink/55">years experience</dt>
            </div>
          </dl>
          <a href="#contact" className="btn btn-primary mt-8">
            Show me how
          </a>
        </div>
      </section>

      {/* FAQs - all 14, verbatim, house treatment */}
      <section className="border-y border-ink/10 bg-neutral-50">
        <FAQ eyebrow="FAQs" title="Your questions, answered." faqs={FAQS} />
      </section>

      {/* Make it count - verbatim, with the live page's image */}
      <section className="py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              Your rent is due either way. <span className="marker">Make it count.</span>
            </h2>
            <h3 className="mt-5 font-semibold text-ink">
              Get in touch for a free strategy call with our financial advisors and find out:
            </h3>
            <CheckList
              items={[
                "If this is the right strategy for you",
                "How much your SMSF could borrow",
                "If this aligns with your business goals",
              ]}
            />
            <p className="mt-5 text-ink/65">
              Plus, a free copy of our SMSF Property Purchase Guide. Straight to your inbox.
            </p>
            <p className="mt-4 text-sm font-semibold text-ink/50">
              No obligation • No pressure • Expert advice
            </p>
          </div>
          <img
            src="/wp-content/uploads/2026/03/1a1643209924763ed399c5cae74b5c452611156b-1024x483.jpg"
            alt="Commercial business premises owned through an SMSF"
            loading="lazy"
            className="w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      <CtaBand
        heading="Let’s make your money work harder for you."
        intro="Stop renting. Start owning. Get the free SMSF guide - reach out and we’ll schedule a free, no-obligation strategy call to determine if this is right for you."
        variant="guide"
        subject="SMSF Commercial Property"
        formTitle="Get the free SMSF guide"
      />
    </main>
  );
}
