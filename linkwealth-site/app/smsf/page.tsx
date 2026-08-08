/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// Head terms: "smsf property investment" (627/mo, KD 2) + "smsf commercial
// property" (175/mo, KD 0) + "using super to buy commercial property".
// The strongest conversion page on the old site - copy carried verbatim,
// now with the 14 live FAQs in FAQPage schema (they were plain accordions
// with no markup before).

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
  },
  {
    team: "LINK ADVISORS",
    title: "Chartered Accountants.",
    body: "Administering an SMSF is complex. Our expert SMSF accountants give you the clarity to stay compliant, minimise your tax and get the most from your fund.",
    points: ["SMSF setup.", "Ongoing tax support.", "Reporting and advice.", "Administration and BAS lodgement."],
  },
  {
    team: "LINK ADVANCE",
    title: "Lending specialists.",
    body: "SMSF commercial property loans are a specialist game. Our licensed mortgage brokers know the lenders, their credit policies and exactly what it takes to get a deal across the line. Fast.",
    points: ["Personalised lending options.", "Direct access to lenders.", "Loan application support.", "Ongoing rate negotiations."],
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

      {/* Hero - verbatim */}
      <section className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="eyebrow text-wealth-dark">
            Australian SMSF commercial property specialists
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Stop paying rent to a landlord. <span className="marker">Buy your business premises with super</span> instead.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70">
            If your business leases commercial property, you could redirect that rent into
            your own Self-Managed Super Fund (SMSF). Transforming your rent into an asset you
            control, without changing how your business operates.
          </p>
          <a href="#contact" className="btn btn-wealth mt-8">
            Show me how
          </a>
        </div>
        <a
          href="/case-studies/scott-bought-his-business-premises-with-his-super"
          className="group rounded-xl2 border border-line bg-cloud p-7 transition hover:border-wealth-mid"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-wealth-dark">
            Success story
          </p>
          <p className="mt-3 font-display text-2xl font-bold text-ink group-hover:text-wealth-dark">
            Scott bought his business premises with his super.
          </p>
          <p className="mt-3 text-ink/70">
            Find out how Scott used his SMSF to buy the warehouse his business operates from.
          </p>
          <p className="mt-4 text-sm font-semibold text-wealth-dark">Read success story →</p>
        </a>
      </section>

      {/* The problem - verbatim */}
      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your rent is making <span className="text-wealth">someone else wealthy.</span>
            </h2>
            <p className="mt-5 text-white/75">
              Think about how much rent your business has paid. Now think about what you have
              to show for it. No equity. No asset. Just a landlord who’s done very well out of
              your business.
            </p>
            <p className="mt-4 text-white/75">
              A landlord who can sell the building. Hike the rent. Decide not to renew. A
              landlord who takes action on their terms, not yours.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              But what if your rent could work for you instead?
            </h2>
            <p className="mt-5 text-white/75">
              There’s a legal, ATO-compliant and highly tax effective alternative most business
              owners don’t know about. Eligible business owners can use their super to purchase
              a commercial premises, then lease it back to their business at market rent.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl2 border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold text-wealth">Your business operates exactly as it does today.</h3>
                <p className="mt-2 text-sm text-white/70">
                  The only thing that changes is where the money goes (and what it does for you
                  over time).
                </p>
              </div>
              <div className="rounded-xl2 border border-white/10 bg-white/5 p-5">
                <h3 className="font-bold text-wealth">Your money works harder for you.</h3>
                <p className="mt-2 text-sm text-white/70">
                  Instead of funding someone else’s retirement, you’ll fund your own. Same
                  premises. Same rent. Better outcome.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <span className="eyebrow text-wealth-dark">Who it’s for</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            This strategy suits a specific type of business owner.
          </h2>
          <ul className="mt-6 space-y-3">
            {WHO_FOR.map((c) => (
              <li key={c} className="flex gap-3 text-lg text-ink/80">
                <Check />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why it works - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x">
          <span className="eyebrow text-wealth-dark">Why it works</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Why do business owners use their super to buy their premises?
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_WORKS.map((w) => (
              <div key={w.title} className="rounded-xl2 border border-line bg-white p-6">
                <h3 className="font-display text-lg font-bold text-ink">{w.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <span className="eyebrow text-wealth-dark">How it works</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            How it works.
          </h2>
          <ol className="mt-8 space-y-8">
            {HOW.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-display text-3xl font-extrabold text-wealth-mid">
                  0{i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-ink/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-xl2 bg-wealth-dark p-7 text-white">
            <h3 className="font-display text-xl font-bold">Is this strategy right for you?</h3>
            <p className="mt-3 text-white/75">
              Reach out and we’ll schedule a free, no-obligation strategy call to determine if
              this is right for you. Plus, you’ll get a free copy of our SMSF Property Purchase
              Guide delivered to your inbox instantly.
            </p>
            <a href="#contact" className="btn btn-mint mt-5">
              Show me how
            </a>
          </div>
        </div>
      </section>

      {/* How we help - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x">
          <span className="eyebrow text-wealth-dark">How we help</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            All the specialists you need. Working together.
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-ink/70">
            To do this properly, you need a licensed financial advisor, an SMSF accountant and
            a specialist SMSF lender. Most firms only handle one part of the strategy. LINK
            coordinates the whole process. From start to finish.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {SPECIALISTS.map((s) => (
              <div key={s.team} className="rounded-xl2 border border-line bg-white p-7">
                <p className="text-xs font-bold uppercase tracking-wider text-wealth-dark">
                  {s.team}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{s.body}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/70">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-wealth-dark">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink/55">
            * Our teams operate independently, as regulation requires. With your consent, we
            work together to implement the strategy, keeping things simple for you.
          </p>
        </div>
      </section>

      {/* Why us - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl text-center">
          <span className="eyebrow text-wealth-dark">Why us?</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            SMSF commercial property specialists.
          </h2>
          <p className="mt-5 text-lg text-ink/70">
            Licensed tax agents, financial advisors &amp; mortgage brokers. Helping business
            owners grow wealth. ASIC &amp; ATO compliant. 30+ years experience.
          </p>
          <a href="#contact" className="btn btn-wealth mt-8">
            Show me how
          </a>
        </div>
      </section>

      {/* FAQs - all 14, verbatim, now in FAQPage schema */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <span className="eyebrow text-wealth-dark">FAQs</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            Your questions, answered.
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
        heading="Your rent is due either way. Make it count."
        intro="Get in touch for a free strategy call with our financial advisors and find out: if this is the right strategy for you, how much your SMSF could borrow, and if this aligns with your business goals. Plus, a free copy of our SMSF Property Purchase Guide. Straight to your inbox. No obligation. No pressure. Expert advice."
        variant="discovery"
        subject="SMSF Commercial Property"
        formTitle="Get the free SMSF guide"
      />
    </main>
  );
}

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="mt-1 shrink-0 text-wealth-dark"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6 10 2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
