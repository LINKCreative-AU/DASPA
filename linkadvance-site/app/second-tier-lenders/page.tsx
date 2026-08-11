import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/v2";
import { SITE } from "@/lib/site";
import {
  APRA_BUFFER,
  TIER_ONE_ONLY,
  TIERS,
  WORKED_EXAMPLE,
  money,
  pct,
  tierMeta,
  wacc,
} from "@/lib/wacc";
import { Calculator } from "./Calculator";

// NEW pillar page, from Chris Tinta's brief of 10 August 2026. One page for
// the whole tiered-lending cluster: "second tier lenders" (320/mo, KD 0),
// "non bank lenders australia" (590/mo, KD 0), "tier 2 lenders australia"
// (100/mo, KD 0, $7 CPC), "third tier lenders" (40/mo), "private lenders
// australia" (400/mo, KD 28) and "how to increase borrowing capacity"
// (220/mo, KD 0). Roughly 1,500/mo at near-zero difficulty, which is rare.
//
// The H2s below map to those query formats deliberately. The capacity
// section lives here rather than on /borrowing-power-calculator so the two
// pages don't compete for the same term.
//
// Editorial decision, per the brief: we describe lender CATEGORIES, never a
// named list. A named list goes stale, reads as a recommendation we are not
// licensed to make on a web page, and creates lender-partner sensitivities.

const PATH = "/second-tier-lenders";

export const metadata: Metadata = {
  title: {
    absolute: "Second Tier Lenders Australia | Tiered Lending and Your Cost of Capital",
  },
  description:
    "The three tiers of the Australian lending market explained: what a second tier lender is, what a third tier lender is, and why the order you borrow in decides how far a portfolio goes. Includes a weighted average cost of capital calculator.",
  alternates: { canonical: PATH },
};

const FAQS = [
  {
    q: "What is a second tier lender?",
    a: "A second tier lender is a smaller bank or non-bank lender that funds loans outside the big four. Most are regulated, hold the required licences, and offer the same consumer protections on regulated loans. The practical difference is credit policy: where a major bank declines, a second tier lender may approve, because they assess income, existing debt and property type differently. You pay a modest rate premium for that flexibility.",
  },
  {
    q: "Are second tier lenders safe?",
    a: "Most second tier lenders are regulated and licensed, and regulated loans carry the same consumer protections regardless of which tier the lender sits in. The main differences are rate, credit policy and brand recognition, not safety. What does change with tier is the terms you are agreeing to, so read the loan contract rather than relying on the brand you recognise.",
  },
  {
    q: "Do second tier lenders charge higher interest rates?",
    a: "Typically yes, by a margin over the majors. The trade is rate for capacity: you pay a little more to keep borrowing. What matters is the blended rate across your whole portfolio, not the rate on any single loan. A portfolio that is mostly tier one debt can absorb one higher-rate loan and barely move its average.",
  },
  {
    q: "What is a third tier lender?",
    a: "A third tier lender is a private or non-institutional lender. They set their own credit rules, move quickly, and price for risk, so rates are the highest of the three tiers. For investors, third tier debt is short-term capacity: it gets the asset secured now, with a plan to refinance down a tier once the loan has a clean track record.",
  },
  {
    q: "Why does the bank say no when I can afford the repayments?",
    a: `Lenders must assess you at your actual rate plus at least ${APRA_BUFFER} percentage points, and they assess your existing debts conservatively. You can be declined with room to spare in your real budget. Different lenders apply different rules to income types, existing debt and property, which is exactly why the tiers exist.`,
  },
  {
    q: "Can I refinance from a private lender back to a bank?",
    a: "Yes, and it is a common strategy. Around 12 months of clean repayments, plus any growth in the property value, puts you in a strong position to refinance down a tier and cut your cost of capital. The plan to move back down should exist before you take the higher-tier loan, not after.",
  },
  {
    q: "How do I increase my borrowing capacity?",
    a: "In rough order of speed: reduce or cancel credit card limits (lenders assess the limit, not the balance), clear small personal and car loans, keep provable living expenses tidy for three months, and make sure every income stream is documented the way a lender wants to see it. After that come the structural levers: a longer loan term, a different repayment type, an ownership structure that suits the assets, and moving individual loans to lenders whose policy fits your income. The tiers are the last lever, not the first.",
  },
  {
    q: "What is a weighted average cost of capital on a property portfolio?",
    a: `It is the debt-weighted average interest rate across every loan you hold. Take each loan's rate, weight it by that loan's share of your total debt, and add them up. In the worked example on this page, ${money(WORKED_EXAMPLE.reduce((s, l) => s + l.debt, 0))} of debt split across the three tiers at 6%, 7% and 8% blends to ${pct(wacc(WORKED_EXAMPLE).wacc!)}, not 8%, because most of the debt sits in tier one.`,
  },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Second Tier Lenders", path: PATH },
];

// Every figure in the tables below comes from lib/wacc.ts, the same model the
// calculator runs, so the page cannot state a number its own tool would not.
const EXAMPLE = wacc(WORKED_EXAMPLE);
const SINGLE = wacc(TIER_ONE_ONLY);

// Tier mixes for the "how far does the blend actually move" table: shares of
// one total debt across tier one, two and three. The point of the last rows
// is that heavy use of the expensive tiers still lands close to the cheap one.
const MIXES: [number, number, number][] = [
  [1, 0, 0],
  [0.8, 0.2, 0],
  [0.6, 0.4, 0],
  [0.5, 1 / 3, 1 / 6],
  [0.4, 0.4, 0.2],
  [1 / 3, 1 / 3, 1 / 3],
  [0, 0.5, 0.5],
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Weighted Average Cost of Capital Calculator",
            url: `https://linkadvance.com.au${PATH}#wacc-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-14 pt-10 sm:pt-14">
        <SectionHead
          as="h1"
          eyebrow="Tiered lending · Investors"
          title="Tiered lending explained: how investors keep borrowing when the bank says no."
          mark="when the bank says no."
          intro="Hit a wall with your bank? That wall is usually your borrowing capacity, not your ability to repay a loan. Investors who build multi-million dollar portfolios rarely do it with one lender. They use the three tiers of the Australian lending market, in order, and treat interest rate as the price of capacity rather than the whole decision."
          accent
        />
        <p className="mt-6 max-w-3xl text-lg leading-[1.4] text-ink/80">
          <strong className="text-ink">A second tier lender</strong> is a smaller bank or non-bank
          lender that funds loans outside the big four: regulated, licensed, a modest rate premium,
          and credit policy of its own. That policy is where the capacity your bank says you do not
          have usually comes from. Below is the calculator that tells you what borrowing across the
          tiers actually costs you, and under it, how the whole thing works.
        </p>
      </section>

      {/* The tool leads. Every other Advance tool page does the same, and the
          measurement that prompted this rebuild was blunt: at 4.3 screens down
          on desktop and 8.2 on a phone, the calculator may as well not have
          been on the page. The prose that used to sit above it all survives
          below, in the order someone actually needs it. */}
      <section id="wacc-calculator" className="container-x scroll-mt-24 pb-4">
        <Calculator />
      </section>

      <section className="container-x pb-16 pt-10">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-ink/10 bg-neutral-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-lg leading-[1.4] text-ink/80">
            Seen a number you want a second opinion on? A broker will map your capacity across all
            three tiers and tell you what sequence keeps the blend down.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <a href="/contact-us" className="btn btn-advance whitespace-nowrap">
              Book a call
            </a>
            <a
              href={SITE.phoneHref}
              className="font-display text-lg font-bold tracking-tight text-ink hover:text-advance"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
        {/* A 10-screen page needs a map. */}
        <nav aria-label="On this page" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="font-bold uppercase tracking-wider text-ink/45">On this page</span>
          {[
            { label: "What your number means", href: "#what-it-means" },
            { label: "The three tiers", href: "#tiers" },
            { label: "Second tier lenders", href: "#second-tier" },
            { label: "Third tier lenders", href: "#third-tier" },
            { label: "Increasing your capacity", href: "#increase-borrowing-capacity" },
            { label: "FAQ", href: "#faq" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-semibold text-ink/70 underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </section>






      {/* ACT 2 - make sense of the number they just generated. This used to
          sit above the calculator as an argument for using it; now it reads
          as an explanation of a figure already on their screen. */}
      <section id="what-it-means" className="scroll-mt-24 border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What your weighted average cost of capital is telling you.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Investors fixate on the rate of their next loan. What drives your portfolio is the
            blended rate across all of it. In the example the calculator opens with, the weighted
            average is {pct(EXAMPLE.wacc!)}, not 8%, because most of the debt sits in tier one. The
            question is never &ldquo;is 8% too expensive?&rdquo; It is &ldquo;does adding this loan
            at 8% still leave my whole portfolio profitable at a {pct(EXAMPLE.wacc!)} blended
            rate?&rdquo; That reframe is how sophisticated investors keep moving while everyone
            else waits for rate cuts.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Stop at tier one and the portfolio stops at roughly half the size:{" "}
            {money(SINGLE.totalDebt)} of debt at {pct(SINGLE.wacc!)}, one property, and a cheaper
            blended rate that is cheaper for the worst possible reason. The investor who accepted{" "}
            {pct(EXAMPLE.wacc!)} owns three assets. The one who held out for {pct(SINGLE.wacc!)}{" "}
            owns one.
          </p>

          <h3 className="mt-12 font-display text-xl font-bold tracking-tight text-ink">
            How far the blend actually moves.
          </h3>
          <p className="mt-3 text-lg leading-[1.4] text-ink/80">
            The fear is that touching tier two or tier three wrecks your cost of capital. On the
            same {money(EXAMPLE.totalDebt)} of debt, it does not. Even a third of the book at tier
            three rates only lifts the blend by a point.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Blended rate by tier mix, on the same total debt"
              head={["Tier one", "Tier two", "Tier three", "Blended rate", "Interest a year"]}
              rows={MIXES.map((m) => {
                const r = wacc(
                  m.map((share, i) => ({
                    id: String(i),
                    name: "",
                    tier: TIERS[i].tier,
                    debt: EXAMPLE.totalDebt * share,
                    rate: TIERS[i].defaultRate,
                  }))
                );
                return [
                  `${Math.round(m[0] * 100)}%`,
                  `${Math.round(m[1] * 100)}%`,
                  `${Math.round(m[2] * 100)}%`,
                  pct(r.wacc!),
                  money(r.annualInterest),
                ];
              })}
              note={`Illustrative tier rates of ${TIERS.map((x) => `${x.defaultRate}%`).join(", ")} on ${money(EXAMPLE.totalDebt)} of debt, generated by the same model the calculator runs. Not lender quotes: the calculator above uses the rates you enter.`}
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Why the order matters.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Exhaust the cheapest money first. Every dollar of tier one debt you lock in early is a
            dollar you never pay tier two or tier three rates on. Start at the expensive end and
            you burn your cheapest capacity on your most expensive debt.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            It sounds obvious written down, and it is routinely done backwards, because each
            purchase gets decided on its own. Someone takes the fast private loan for property
            three because it settles quickly, then finds their tier one capacity is gone by
            property four, spent on the loan that could have sat anywhere. The sequence is a
            portfolio decision, and it has to be made before the first loan, not the fourth.
          </p>
        </div>
      </section>

      {/* ACT 3 - the explanation, in the order someone reads it once the
          number has made them care. */}
      <section id="tiers" className="scroll-mt-24 border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What are the three tiers of lenders in Australia?
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">Tier one is the major banks:</strong> the sharpest rates
            and the strictest assessments. Banks must test whether you could still afford your
            repayments if your rate rose by at least {APRA_BUFFER} percentage points, so you will
            max out here first, often while you can comfortably afford more.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">Tier two is the non-bank and smaller lenders:</strong>{" "}
            rates sit a little higher, but credit policies differ, and some assess your existing
            debts less conservatively than the majors, unlocking capacity the big banks say you do
            not have.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">Tier three is the private and non-institutional
            lenders:</strong>{" "}
            outside the rules that apply to banks, the most flexible and the most expensive. Used
            deliberately and temporarily, they are a tool. Used as a last resort, they are a trap.
          </p>
          <div className="mt-10">
            <DataTable
              caption="The three tiers of the Australian lending market"
              head={["Tier", "Who they are", "Rate position", "What they are for"]}
              rows={[
                [
                  "Tier one",
                  "Major banks",
                  "Sharpest",
                  "The cheapest money. Use it first, and use all of it.",
                ],
                [
                  "Tier two",
                  "Non-bank and smaller lenders",
                  "A modest premium",
                  "Capacity the majors will not give you, on regulated terms.",
                ],
                [
                  "Tier three",
                  "Private and non-institutional lenders",
                  "Highest",
                  "Speed and flexibility, deliberately and temporarily.",
                ],
              ]}
              note="Categories, not a recommendation of any lender. Rate positions are relative, not quoted figures. Which lenders sit where changes with credit policy, and policy changes constantly."
            />
          </div>
        </div>
      </section>
      <section id="second-tier" className="scroll-mt-24 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What is a second tier lender?
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            A second tier lender is a smaller bank or non-bank lender that funds loans outside the
            big four. Most are regulated, hold the required licences, and offer the same consumer
            protections on regulated loans. The practical difference is credit policy: where a
            major bank declines, a second tier lender may approve, because they assess income,
            existing debt and property type differently. You pay a modest rate premium for that
            flexibility.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The phrase people search for is often &ldquo;non bank lenders&rdquo; or &ldquo;tier 2
            lenders&rdquo;, and in practice they mean the same thing: everyone who is not a major
            bank but is still a mainstream, licensed lender. It is a wide group. Some are
            customer-owned banks with rates that compete with the majors outright. Others fund
            through wholesale markets and price a little above. What they share is that their
            credit rules are their own, and those rules are where your extra capacity comes from.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Where second tier lenders most often say yes when a major says no: self-employed
            income with a short trading history or a strong recent year, rental income assessed at
            a higher percentage, existing debts with other lenders read at their actual repayment
            rather than a conservative loading, unusual security like small units or rural
            residential, and borrowers whose income is real but does not fit a payslip.
          </p>
        </div>
      </section>
      <section id="third-tier" className="scroll-mt-24 border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What is a third tier lender?
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            A third tier lender is a private or non-institutional lender. These lenders set their
            own credit rules, move quickly, and price for risk. Rates are the highest of the three
            tiers. For investors, third tier debt is short-term capacity: it gets the asset
            secured now, with a plan to refinance down a tier once the loan has a clean track
            record.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Two rules make third tier debt safe to use. The first is that the exit is agreed
            before you draw it, not improvised afterwards: what refinances this loan, into which
            tier, and on what evidence. The second is that the asset has to work at the higher
            rate for as long as you plan to hold the debt, with room to spare. If it only works on
            the assumption that you will be able to refinance on time, you are not using a tool,
            you are taking a bet.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Not all third tier debt is a mortgage on a home you live in, and the protections that
            apply to regulated consumer lending do not automatically apply to every private loan.
            Read what you are signing, and take advice before you sign it, particularly on
            default terms and what happens if the exit takes longer than planned.
          </p>
        </div>
      </section>
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Higher-tier debt is a stepping stone, not a life sentence.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Hold a tier two or tier three loan for around 12 months with a clean repayment history
            and refinancing down a tier becomes far more achievable, especially where the property
            has grown in value. The higher rate buys you the asset now; the refinance strategy
            brings the cost back down later.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            What makes the move down work is evidence. Twelve months of repayments made on time,
            with no arrears and no dishonours, is the single strongest thing you can hand a new
            lender. Add a valuation that has moved in your favour, tax returns that now cover the
            trading period a major bank wanted to see, and a debt position that is tidier than it
            was, and the loan that only tier three would write becomes a loan tier two or tier one
            will compete for. Our{" "}
            <TextLink href="/refinancing-brisbane">refinancing review</TextLink> is where that
            conversation usually starts.
          </p>
        </div>
      </section>


      {/* This section owns "how to increase borrowing capacity" (220/mo, KD 0)
          for the site. The borrowing power estimator links here rather than
          competing for the term. */}
      <section id="increase-borrowing-capacity" className="scroll-mt-24 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            How to increase your borrowing capacity.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Moving up a tier is the last lever, not the first. Before you pay a rate premium for
            capacity, take the capacity that is already yours and being quietly spent elsewhere.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Ways to increase borrowing capacity, by how quickly they work"
              head={["Lever", "How long it takes", "Why it works"]}
              rows={[
                [
                  "Cut or cancel card limits",
                  "Days",
                  "Lenders assess a monthly cost against the limit, not the balance. An unused card still costs you capacity.",
                ],
                [
                  "Clear small personal and car loans",
                  "Days to weeks",
                  "A small repayment removes a large multiple of borrowing capacity, because the repayment is assessed for the whole term.",
                ],
                [
                  "Tidy provable living expenses",
                  "Three months",
                  "Lenders read your statements and apply a benchmark minimum. Three clean months is what they ask for.",
                ],
                [
                  "Document every income stream properly",
                  "Weeks",
                  "Bonus, overtime, rent and self-employed income are all assessed differently, and undocumented income is assessed at nothing.",
                ],
                [
                  "Change term, structure or ownership",
                  "At application",
                  "Loan term, repayment type and which entity holds what all move the assessed figure without changing your actual position.",
                ],
                [
                  "Change lender within the same tier",
                  "At application",
                  "Two tier one banks can differ by six figures on identical inputs, because their assessment rules differ.",
                ],
                [
                  "Move a loan up a tier",
                  "At application",
                  "The last lever: buys capacity the tier below will not give you, at a rate premium you should price across the whole portfolio.",
                ],
              ]}
              note="General information, not credit advice. Which levers are available, and what each is worth, depends on your circumstances and the lender assessing you."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            The{" "}
            <TextLink href="/borrowing-power-calculator">borrowing power estimator</TextLink>{" "}
            shows what the first few levers are worth on your numbers, including how much of your
            capacity your card limits are currently consuming. If you have already pulled all of
            them and you are still short, that is the point at which the tiers become the
            conversation.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Where a broker earns their keep.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Each lender runs different calculators, buffers and debt-assessment rules, and they
            change constantly. A good broker sequences your lending across the tiers, structures
            each application to protect capacity for the next one, and manages the refinance path
            back down. That sequencing is the difference between a portfolio that stalls at one
            property and one that keeps compounding.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            It is also the part you cannot do from a comparison table, because the information is
            not published. Which lender is currently reading rental income at the higher rate,
            which one has quietly tightened on the security type you are buying, and which one
            will take the loan you are trying to move down a tier: that is knowledge from writing
            the loans, and it has a shelf life of about a month.{" "}
            <TextLink href="/investment-home-loans">Investment lending</TextLink> is where most of
            these conversations start, and{" "}
            <TextLink href="/commercial-lending">commercial lending</TextLink> is where the same
            logic applies with different rules.
          </p>
        </div>
      </section>

      <div id="faq" className="scroll-mt-24" />
      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Investment home loans", href: "/investment-home-loans" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
          { label: "Refinancing: the review", href: "/refinancing-brisbane" },
          { label: "Commercial lending", href: "/commercial-lending" },
        ]}
      />

      <section className="container-x pb-10">
        <p className="max-w-3xl text-xs leading-relaxed text-ink/50">
          General information only, not credit advice. Rates and figures shown on this page are
          illustrative and are not lender quotes. The calculator uses the rates you enter and
          stores nothing. Assessment at your actual rate plus at least {APRA_BUFFER} percentage
          points reflects the current APRA serviceability buffer, reconfirmed in May 2026. Your
          borrowing capacity and loan suitability depend on your circumstances, and all loan
          applications are subject to the credit provider&apos;s assessment and lending criteria.{" "}
          {SITE.legal.publisher}
        </p>
      </section>

      <CtaBand
        heading="Ready to map your borrowing capacity across all three tiers?"
        intro="Tell us what you're planning and a broker will call to work through the sequence: what sits where, what it costs blended, and what the next purchase does to it. No obligation."
        subject="Tiered lending enquiry"
        formTitle="Talk to a broker"
      />
    </main>
  );
}
