import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/v2";
import {
  APRA_BUFFER,
  ASSESSMENT_RATE,
  CARD_ASSESSMENT_RATE,
  assess,
  maxLoan,
  money,
  money000,
} from "@/lib/serviceability";
import { Calculator } from "./Calculator";

// "borrowing power calculator" 42.8k/mo KD 55 + "how much can i borrow"
// 13.3k/mo KD 56 - bank-owned head terms; this plays the long tail and
// conversion. Differentiators: the card-limit cost line and the honest
// negative-surplus state.

const PATH = "/borrowing-power-calculator";

export const metadata: Metadata = {
  title: { absolute: "Borrowing Power Calculator | How Much Can I Borrow? (With the APRA Buffer)" },
  description:
    "Estimate how much you can borrow the way lenders actually assess it: net income, expense benchmarks, the 3% APRA buffer and the 3.8%/month card-limit rule. See what your credit card limits cost you in borrowing power.",
  alternates: { canonical: PATH },
};

// Every figure below comes from lib/serviceability.ts, the same model the
// estimator above runs, so the page cannot disagree with its own tool.
const INCOME_ROWS: { label: string; g1: number; g2: number }[] = [
  { label: "$80,000 · single", g1: 80_000, g2: 0 },
  { label: "$100,000 · single", g1: 100_000, g2: 0 },
  { label: "$120,000 · single", g1: 120_000, g2: 0 },
  { label: "$150,000 · couple", g1: 75_000, g2: 75_000 },
  { label: "$180,000 · couple", g1: 90_000, g2: 90_000 },
  { label: "$200,000 · couple", g1: 100_000, g2: 100_000 },
  { label: "$250,000 · couple", g1: 125_000, g2: 125_000 },
];

const COMMITMENTS: { label: string; monthly: number }[] = [
  { label: "$10,000 credit card limit, never used", monthly: 10_000 * CARD_ASSESSMENT_RATE },
  { label: "$20,000 credit card limit, never used", monthly: 20_000 * CARD_ASSESSMENT_RATE },
  { label: "Personal loan at $400 a month", monthly: 400 },
  { label: "Car loan at $600 a month", monthly: 600 },
  { label: "Each dependant", monthly: 550 },
  { label: "$500 a month of extra declared living expenses", monthly: 500 },
];

const FAQS = [
  { q: "How is borrowing power calculated?", a: "Lenders take your after-tax income, subtract living expenses (benchmarked to a minimum even if you declare less), existing commitments and about 3.8% per month of your credit card LIMITS, then work out what loan the remaining surplus services at your rate plus a ~3% buffer. Same formula here, which is why the estimate is honest rather than flattering." },
  { q: "Why do different lenders offer such different amounts?", a: "Policy. Lenders treat overtime, bonuses, casual income, rental income and self-employed income differently, apply different expense benchmarks, and a few use different buffers for refinances. On identical inputs, the spread between the most and least generous lender is routinely six figures. That spread is why brokers exist." },
  { q: "Do credit cards really reduce my borrowing power?", a: "Yes, dramatically: lenders assess about 3.8% of your total limit per month as a commitment even if the card is never used. A $20,000 unused limit is assessed as $760 a month, which on a 30-year loan at an 8.9% assessment rate is roughly $95,000 of borrowing power. Cancelling or cutting limits before applying is the quickest capacity win available." },
  { q: "How can I increase my borrowing power?", a: "In rough order of speed: cut card limits, clear small personal loans, trim provable living expenses for three months, ensure all income is documented (and consistent), then consider the bigger levers: a longer term, a co-borrower or lenders whose policy suits your income type. The full list, in order of how fast each one works, is on our tiered lending page." },
  { q: "How much can I borrow on a $100,000 salary?", a: "On this model, a single applicant earning $100,000 with no dependants, no card limits and no other debts nets about $6,434 a month, is assessed against a benchmark living expense floor, and lands in the range of $467,000 to $570,000. Add a partner on the same income and the range roughly doubles. Add a $20,000 card limit and it drops by about $95,000. Your actual number turns on your expenses, debts and which lender reads your income best." },
  { q: "Does HECS or HELP debt reduce my borrowing power?", a: "Yes, while it is being repaid. Once your income passes the ATO's compulsory repayment threshold, the repayment is deducted from your pay and lenders count it as a commitment like any other. A high-income earner with a large HELP balance can lose a six-figure slice of capacity. Some lenders will disregard the debt where the balance is small enough to be cleared shortly, and policies differ enough to be worth shopping. Current thresholds and rates: ato.gov.au." },
  { q: "Is rental income counted in full?", a: "No. Most lenders shade gross rent to around 80% before counting it, to allow for vacancy, management fees, rates and maintenance, and some go lower for short-stay or student accommodation. They will also add the full new loan repayment to your commitments. That is why a positively geared property on paper can still reduce what a lender says you can borrow." },
  { q: "Does a bigger deposit increase my borrowing power?", a: "It increases what you can buy, not what you can borrow. Borrowing power is a serviceability number set by income and commitments; the deposit sets the purchase price you can reach and whether lenders mortgage insurance applies. The one indirect effect is real though: getting to 80% LVR removes the LMI premium, and if you were going to capitalise that premium into the loan, avoiding it means you need to borrow less for the same house." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Borrowing Power Calculator", path: PATH },
];

export default function Page() {
  const per100 = maxLoan(100);
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Borrowing Power Calculator",
            url: `https://linkadvance.com.au${PATH}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Assessed like a lender would"
            title="How much can you borrow? The honest version."
            mark="The honest version."
            intro="Most borrowing calculators flatter you. This one runs the numbers the way a lender's serviceability engine does: net income, benchmarked expenses, the APRA buffer, and the card-limit rule most people have never heard of."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Indicative borrowing power by income.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The reference points, using the same serviceability model as the estimator above:
            net income after tax, benchmark living expenses, no other debts, no credit cards,
            no dependants, assessed at a typical rate plus the {APRA_BUFFER}% APRA buffer over 30
            years. Couples are shown with income split evenly. Your own debts, cards and
            expenses move these numbers a long way, in both directions.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Indicative borrowing power ranges by gross household income"
              head={["Household income (gross)", "Indicative borrowing power"]}
              rows={INCOME_ROWS.map((r) => {
                const a = assess({ income1: r.g1, income2: r.g2 });
                return [r.label, `${money000(a.low)} to ${money000(a.high)}`];
              })}
              note={`Indicative only, as at August 2026: not a quote or an offer of credit. Assessed at ${ASSESSMENT_RATE}% (a typical variable rate plus the ${APRA_BUFFER}% APRA serviceability buffer) over 30 years, on benchmark minimum living expenses and zero commitments. Real assessments use your declared expenses, debts and card limits, and every lender's policy reads income differently.`}
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            The range on each row isn&apos;t hedging, it&apos;s the actual spread between
            lenders on identical inputs: income shading, expense treatment and buffer policy
            differ enough that the same couple can be offered six figures more at one lender
            than another. Finding the right end of your range is the part of the job a
            broker does.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          {/* Deliberately NOT titled "how to increase your borrowing capacity":
              that term belongs to /second-tier-lenders, which answers it in
              full. This section explains what moves the estimator above. */}
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What moves the number above.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Serviceability is arithmetic, so it moves when you move one of its inputs. The single
            most useful number to carry around is the conversion rate: at an {ASSESSMENT_RATE}%
            assessment rate over 30 years, every $100 a month of assessed commitment you remove
            gives back about {money000(per100)} of borrowing power. Everything below is that one
            sum applied to different lines of your file. For the full list of levers, including
            the structural ones and what to do when you have run out,{" "}
            <TextLink href="/second-tier-lenders#increase-borrowing-capacity">
              how to increase your borrowing capacity
            </TextLink>{" "}
            takes it further.
          </p>
          <div className="mt-8">
            <DataTable
              caption="What each commitment costs in borrowing power"
              head={["Commitment", "Assessed per month", "Borrowing power it removes"]}
              rows={COMMITMENTS.map((c) => [
                c.label,
                money(Math.round(c.monthly)),
                money000(maxLoan(c.monthly)),
              ])}
              note={`Calculated with the same model as the estimator above: the monthly figure capitalised at ${ASSESSMENT_RATE}% over 30 years. Credit cards are assessed at ${(CARD_ASSESSMENT_RATE * 100).toFixed(1)}% of the limit per month at most lenders; a few use 3%, and a few add annual fees on top.`}
            />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-[1.4] text-ink/80">
            <p>
              <strong className="text-ink">Cut or close credit card limits.</strong> This is the
              fastest lever in lending, because the limit is assessed whether or not you owe a
              cent on it. Reducing a limit takes a phone call and usually takes effect the same
              day; you need the lender&apos;s letter or an updated statement as evidence. Two
              cards with $15,000 limits between them are worth about {money000(maxLoan(15_000 * CARD_ASSESSMENT_RATE))} of
              capacity.
            </p>
            <p>
              <strong className="text-ink">Clear the small, expensive debts.</strong> A personal
              loan or an interest-free retail plan with eighteen months left is assessed on its
              full repayment, so paying it out converts directly into capacity. Buy-now-pay-later
              accounts are read the same way by most lenders now, and heavy use also reads badly
              in the statement review even when the balances are trivial.
            </p>
            <p>
              <strong className="text-ink">Make your expenses provable, then reduce them.</strong>{" "}
              Lenders take the higher of what you declare and a benchmark minimum (the Household
              Expenditure Measure or the lender&apos;s own equivalent), so declaring an
              implausibly low figure achieves nothing. What does work is three months of clean
              statements: no gambling, no dishonours, no overdrawn accounts, subscriptions
              trimmed. Assessors read the statements, not the form.
            </p>
            <p>
              <strong className="text-ink">Document every dollar of income.</strong> Overtime,
              bonus, commission, allowances, second jobs and rent all count, but only when they
              are evidenced in the form the lender&apos;s policy asks for. A pattern of two years
              is worth more than a good last quarter, and a letter from an employer confirming
              that overtime is ongoing can be the difference between 50% and 100% of it counting.
            </p>
            <p>
              <strong className="text-ink">Consider the term, carefully.</strong> Stretching a
              loan from 25 to 30 years lifts capacity because the assessed repayment falls, and
              it also costs more interest over the life of the loan. It is a real lever with a
              real price, and the{" "}
              <TextLink href="/home-loan-repayment-calculator">repayments calculator</TextLink>{" "}
              shows exactly what the extra years cost before you use it.
            </p>
            <p>
              <strong className="text-ink">Then change lender, not behaviour.</strong> When the
              file is as clean as it can be, the remaining spread is policy. Two lenders looking
              at identical numbers can differ by six figures because one shades your bonus to 80%
              and the other to 100%, or because one applies a reduced buffer on a like-for-like
              refinance. Our note on{" "}
              <TextLink href="/blog/home-loans/increase-borrowing-capacity-ahead-of-a-loan-application">
                increasing borrowing capacity before you apply
              </TextLink>{" "}
              covers the preparation; matching the file to the right lender is the part we do.
            </p>
            <p>
              <strong className="text-ink">And when tier one runs out.</strong> The estimator
              above models a major bank&apos;s assessment. If you have pulled every lever and the
              answer is still short, the next move is not a better application, it is a different
              tier of lender:{" "}
              <TextLink href="/second-tier-lenders">tiered lending</TextLink> explains what second
              and third tier lenders do, and what borrowing across the tiers does to your blended
              cost of capital.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            How lenders read each type of income.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The estimator above takes gross income at face value. A real assessment does not:
            each income type is shaded by a policy percentage and needs its own evidence. This is
            where the six-figure spread between lenders actually lives, so it is worth knowing
            where your income sits before you pick a lender.
          </p>
          <div className="mt-8">
            <DataTable
              caption="How Australian lenders typically treat different income types in a serviceability assessment"
              head={["Income type", "Usually counted", "What the lender wants to see"]}
              rows={[
                ["PAYG base salary", "100%", "Two recent payslips and often a year-to-date figure or group certificate"],
                ["Overtime", "80% is common, 100% at some lenders for essential services", "Twelve months of consistency, sometimes an employer letter confirming it continues"],
                ["Bonus and commission", "80%, averaged over two years", "Two years of evidence; a single strong year is usually averaged down"],
                ["Casual employment", "80%, after a minimum employment period", "Six to twelve months in the role, longer if the industry is seasonal"],
                ["Part-time salary", "100% of the contracted hours", "Payslips plus an employment contract showing the hours are permanent"],
                ["Rental income", "Around 80% of gross rent", "A lease or a managing agent's appraisal; the full new repayment is added as a commitment"],
                ["Self-employed", "Two years of returns is the standard, one year at some lenders", "Company and personal returns, financials, and often an accountant's letter"],
                ["Dividends and trust distributions", "Averaged over two years", "Two years of tax returns showing the distributions are recurring"],
                ["Government family payments", "Accepted by some lenders, often only while children are young", "Centrelink statements; treatment varies more than any other category"],
              ]}
              note="Typical policy positions across mainstream Australian lenders as at August 2026, not a rule and not any one lender's policy. Every lender publishes its own credit policy and revises it regularly. Confirm treatment with your broker or lender before relying on it."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Two patterns are worth internalising. Variable income is shaded and averaged, so the
            year you are having matters less than the two years behind it, and steadiness beats a
            spike. And self-employed files are not harder because lenders dislike business
            owners; they are harder because the profit in a tax return is deliberately not the
            same number as the cash the business generates. If that is you, the{" "}
            <TextLink href="/business-borrowing-health-check">
              business borrowing health check
            </TextLink>{" "}
            walks through the add-backs and evidence a credit team looks for, and{" "}
            <TextLink href="/home-loans-for-doctors">
              some professions have their own policy concessions
            </TextLink>{" "}
            that change the maths entirely.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The buffer, and what this estimate cannot see.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            APRA requires lenders to test that you could still meet repayments if rates rose,
            using a serviceability buffer of around {APRA_BUFFER} percentage points above the
            rate you would actually pay. That single rule is why the amount you can borrow feels
            disconnected from the repayment you would make: you are being assessed on a
            repayment you are not making. There are narrow exceptions, most usefully for a
            like-for-like refinance where a borrower would otherwise be trapped with their
            current lender, and not every lender uses them.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Beyond the buffer, an estimate built from six inputs cannot see the things that
            actually decide a file: your credit file and repayment history, how long you have
            been in your job and whether you are still on probation, whether your deposit is
            genuine savings, the property itself (some postcodes, apartment sizes and property
            types carry lending restrictions), and whether a valuation comes in at contract
            price. It also cannot see the shape of the deal you are trying to do. Guarantor
            structures, family pledges and professional waivers all change the answer, and our
            note on{" "}
            <TextLink href="/blog/home-loans/guarantor-loans-whats-the-go">
              how guarantor loans work
            </TextLink>{" "}
            is the honest version of that conversation.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The negative result the tool shows some people is not a mistake either. If the
            assessed surplus is below zero on benchmark expenses, that is what a lender&apos;s
            engine would say too, and it is the most useful moment to talk to someone: card
            limits, a different income treatment or a co-borrower routinely turn that answer
            around inside a month.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            From capacity to an actual purchase price.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Borrowing power is only half of a price. The other half is your deposit, minus the
            costs that eat it on settlement day. A worked example, using nothing but arithmetic
            you can check: a couple on $150,000 lands around {money000(assess({ income1: 75_000, income2: 75_000 }).capacity)} of
            capacity on this model. With $120,000 saved, a $700,000 established home in
            Queensland costs them $0 in transfer duty as first home buyers, so the whole $120,000
            stays as deposit: that is a 17% deposit, an 83% LVR, and lenders mortgage insurance
            applies. Buying the same priced home as non-first-home owner-occupiers, duty is
            $17,350, the deposit drops to $102,650, and the LVR moves to about 85%. Legal fees,
            inspections and registration costs are left out of the example to keep the sum
            checkable; in real life they take another few thousand off the deposit line.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The tools that close that loop:{" "}
            <TextLink href="/home-loan-repayment-calculator">repayments</TextLink> for the monthly
            number and the stress test,{" "}
            <TextLink href="/stamp-duty-calculator-qld">QLD stamp duty</TextLink> for the
            government&apos;s share, and the{" "}
            <TextLink href="/lenders-mortgage-insurance-calculator">LMI estimator</TextLink> for
            what a deposit under 20% costs (or how to avoid it entirely). All seven sit together
            on the <TextLink href="/calculators">calculators and checks hub</TextLink>. If you
            already own, the{" "}
            <TextLink href="/home-loan-health-check">home loan health check</TextLink> is the
            faster starting point, because usable equity often changes the answer more than
            income does.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
          { label: "How to increase your borrowing capacity", href: "/second-tier-lenders#increase-borrowing-capacity" },
          { label: "Second tier lenders and your cost of capital", href: "/second-tier-lenders" },
          { label: "First home buyer loans", href: "/first-home-buyers-loan" },
          { label: "All calculators and checks", href: "/calculators" },
        ]}
      />
      <CtaBand
        heading="The range is the reason to call."
        intro="Lenders differ by six figures on the same inputs. A broker finds which end of the range is yours."
        subject="Borrowing power"
      />
    </main>
  );
}
