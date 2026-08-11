import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ, CheckList } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/v2";
import { FhogChecker } from "./FhogChecker";
import { FHOG_AMOUNT, fhogMoney, stackRows } from "./model";

// THE ranking asset: #1 for the FHOG QLD eligibility cluster (head term
// 6,522/mo, TP 14k). Substance carried from the old page and corrected
// where the law moved (the old page still showed the pre-May-2025 stamp
// duty thresholds); the eligibility checker is the SERP-union upgrade.
// Grant figures hedged and dated, qld.gov.au named as the official source.

const PATH = "/first-home-buyers-grant";

export const metadata: Metadata = {
  title: { absolute: "First Home Buyers Grant QLD | $30,000 FHOG Eligibility Check" },
  description:
    "The $30,000 First Home Owner Grant QLD, explained: eligibility tests, the $750k value cap, new-build rules and how to apply, plus a 2-minute eligibility checker and the stamp duty savings that stack on top.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "First Home Buyers Grant QLD - check your $30,000 eligibility",
    description: "Seven quick questions, an instant answer, and the concessions that stack on top.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How much is the First Home Owners Grant in QLD?",
    a: "$30,000 for eligible transactions. The Queensland Government doubled it from $15,000 for contracts signed from 20 November 2023 and has extended the $30,000 window since. The amount turns on your contract date, so confirm the current window at qld.gov.au before you rely on it.",
  },
  {
    q: "Who is eligible for the First Home Buyers Grant in QLD?",
    a: "You must be 18+, an Australian citizen or permanent resident (or buying with one), never have received a FHOG anywhere in Australia, never have owned and lived in an Australian property (investment-only ownership from 1 July 2000 onward can survive the test), buy or build a NEW or substantially renovated home with a total value of under $750,000 including land and contract variations, and live in it for at least six continuous months within the first year.",
  },
  {
    q: "Does the grant apply to established homes?",
    a: "No. The QLD grant is for new homes only: new builds, off-the-plan purchases and substantially renovated homes (cosmetic work like paint doesn't count). Established-home buyers still get first-home stamp duty concessions, which can be worth more than the grant itself.",
  },
  {
    q: "Do first home buyers pay stamp duty in QLD?",
    a: "Often not. Since 1 May 2025, first home buyers building or buying a NEW home in Queensland pay no transfer (stamp) duty at all, with no price cap, and first home vacant land also attracts a full concession with no value cap. For established homes, the first-home concession applies in full up to $700,000 and then steps down in $10,000 price bands to nothing at $800,000. Confirm current thresholds at qld.gov.au.",
  },
  {
    q: "How do I apply for the FHOG in QLD?",
    a: "Most people apply through their lender or broker with the loan application, so the grant is available at settlement. That's how we do it, and it's the path we recommend. You can also apply directly to the Queensland Revenue Office. Either way you'll need ID and your contract paperwork; applications generally must be lodged within a year of taking possession.",
  },
  {
    q: "Can the grant be used as part of my deposit?",
    a: "Often yes: many lenders count the FHOG toward your deposit for a new build, especially alongside the First Home Guarantee's 5% deposit path. Which lenders, and how the timing works with progress payments, is exactly the kind of thing your broker sequences.",
  },
  {
    q: "Can I get the grant if I've owned an investment property?",
    a: "Possibly. The QRO test is specific about dates: residential property you owned on or after 1 July 2000 only disqualifies you if you actually lived in it, so an investment you never occupied can survive the test. Anything you owned before 1 July 2000 disqualifies you whether you lived in it or not. Your spouse's history counts as yours. If you have owned anything at all, get the dates checked against the rule rather than assuming either way.",
  },
  {
    q: "When is the grant actually paid?",
    a: "It depends on what you are buying, not on how quickly you apply. Buying a new or substantially renovated home, the grant is paid at settlement. Building on land you own, it is paid at the first progress payment after the slab is down. Buying off the plan, it is paid at settlement of the completed home, which can be a long way from the contract date. Applying through your lender is what makes those timings line up with the money actually leaving your account.",
  },
  {
    q: "Do I have to pay the First Home Owner Grant back?",
    a: "Only if you stop qualifying. The grant is repayable if the residence requirement is not met (six continuous months of living there, starting within a year of the completed transaction) or if the application turns out to have been wrong. You notify the QRO, and interest and penalties can apply on top of the repayment. Plans change, so if the six months is genuinely uncertain, that is worth working through before you claim rather than after.",
  },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "First Home Buyers Grant QLD", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd data={[faqSchema(FAQS), breadcrumbSchema(CRUMBS)]} />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-14 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            title="The $30,000 First Home Buyers Grant, QLD: who gets it and how."
            mark="who gets it and how."
            intro="If you're buying or building your first home in Queensland, the First Home Owner Grant puts $30,000 toward it, if you pass the eligibility tests and the home is new. Here's every test, what stacks on top, and a two-minute checker that gives you a straight answer."
            accent
          />
        </div>
        <div className="mt-10">
          <FhogChecker />
        </div>
      </section>

      {/* The substance - carried and corrected */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The eligibility tests, in plain English.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">To qualify for the FHOG QLD:</p>
            <CheckList
              items={[
                "You're a person (not a company or trust), 18 or older",
                "You or a co-applicant is an Australian citizen or permanent resident",
                "Neither you nor your spouse has received a First Home Owner Grant anywhere in Australia",
                "Neither of you has previously owned and lived in an Australian property (owning an investment you never lived in can be OK)",
                "The home is new: a new build, off the plan, or substantially renovated (cosmetic work doesn't count)",
                "Total value (home plus land) is under $750,000, including any contract variations",
                "You'll live in it for at least six continuous months within the first year",
              ]}
            />
            <p className="mt-6 text-lg leading-[1.4] text-ink/80">
              Two of those tests catch more people than the rest combined. The prior-ownership
              test turns on dates as well as occupation: property owned on or after 1 July 2000
              only counts against you if you lived in it, while anything owned before 1 July 2000
              counts whether you lived in it or not, and your spouse&apos;s history is treated as
              yours even if they are not on the contract. And the value cap is &quot;less
              than&quot; {fhogMoney(750_000)} including land and any contract variations, so a
              build that starts at $735,000 and picks up $20,000 of upgrades has moved out of the
              grant, not into a smaller one. It is all or nothing.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What the whole stack is worth, by scenario.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The grant and the duty concession are separate schemes with different rules, and
              the combination is what actually decides your deposit. Every figure below is
              generated from the QRO&apos;s published duty rates and concession tables and the
              grant rules the checker above runs, so the table and the tools agree.
            </p>
            <div className="mt-8">
              <DataTable
                caption="Queensland first home grant and transfer duty concession by purchase scenario"
                head={["Scenario", "First Home Owner Grant", "Transfer duty you pay", "Grant plus duty saved"]}
                rows={stackRows()}
                note="Duty saved is measured against what an investor would pay at general rates on the same property. Grant amount and eligibility per qro.qld.gov.au; duty per the QRO general, home concession and first home concession tables, checked August 2026. Indicative only, and it excludes the First Home Guarantee and First Home Super Saver, which are worth more again."
              />
            </div>
            <p className="mt-6 text-lg leading-[1.4] text-ink/80">
              Three cliffs are visible in that table. A new build at $749,000 collects the grant
              and pays no duty; the same build at $750,000 collects nothing, because the cap is
              &quot;less than&quot; $750,000. An established home at $700,000 pays no duty, while
              at $800,000 the concession is gone entirely. And a new build at $850,000 still pays
              zero duty, because the duty concession for new homes has no price cap at all even
              though the grant does. The{" "}
              <TextLink href="/stamp-duty-calculator-qld#first-home">
                stamp duty calculator
              </TextLink>{" "}
              runs your exact price against those bands.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What counts as a new home.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The grant is for homes that have not been lived in. That covers a house you build,
              a house and land package, an off-the-plan apartment, and a home a builder has
              completed but never sold or occupied. It does not cover a renovation of a house you
              already own, and it does not cover a tidy-up that a seller calls a renovation.
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              &quot;Substantially renovated&quot; is a defined term, not a judgement call: the
              QRO looks for a renovation that is a taxable supply for GST purposes, where most of
              the building has been removed or replaced, and where the home has not been
              occupied or sold as a residence since the work. New paint, new floors and a new
              kitchen do not get there. If a listing is marketing a renovation as grant-eligible,
              the vendor&apos;s statement is the document that decides it, and it is worth
              getting sight of before the contract rather than after.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Stamp duty: the saving that stacks on top.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The grant gets the headlines, but the stamp duty rules changed on 1 May 2025 and
              they&apos;re now often worth more:{" "}
              <strong className="text-ink">
                first home buyers building or buying a new home in Queensland pay no transfer
                duty at all, with no price cap.
              </strong>{" "}
              Buying an established home? The first-home concession applies in full up to
              $700,000 and then steps down in $10,000 price bands until it disappears at
              $800,000. Buying vacant land to build on? Since 1 May 2025 that is a full
              concession too, with no value cap, provided you build and move in within two years
              of settlement. (Official thresholds: qld.gov.au, and our{" "}
              <TextLink href="/stamp-duty-calculator-qld">stamp duty calculator</TextLink> runs
              your numbers in seconds.)
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              One change worth knowing about if your residency status is anything other than
              straightforward: from 1 August 2026, claiming any transfer duty home concession,
              first home concession or first home vacant land concession in Queensland requires
              you to be an Australian citizen, permanent resident or a specified foreign retiree.
              That aligns the duty concessions with the grant, which has always carried a
              citizenship or permanent residency test. Source: qro.qld.gov.au.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              How to apply, and when the money lands.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The practical path: apply through your lender with the loan, so the grant is
              approved alongside the finance and available when you need it: at settlement
              for a purchase, or at the first progress payment for a build. We prepare the
              application and the supporting documents (ID, contract, and the build paperwork
              for construction) as part of the loan, at no charge. Prefer to do it yourself?
              Applications go to the Queensland Revenue Office directly.
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Timing is where builds get uncomfortable, so it is worth being blunt about it. On a{" "}
              <TextLink href="/construction-loans-brisbane">construction loan</TextLink> the land
              settles first, the builder draws progress payments in stages, and you pay interest
              only on what has been drawn. The grant arrives at the first progress payment after
              the slab, not at land settlement, so it cannot be your deposit on the land. Plan
              the cash for the land, the duty and the early draws separately from the grant, and
              the build stops being a cash-flow problem.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The residence rule, and what happens if you break it.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The grant is conditional on living in the home: six continuous months, starting
              within a year of the completed transaction. For the transfer duty concessions the
              test is a separate one and slightly different, which is the part that catches
              people. You must move in within a year of settlement, you cannot lease any part of
              the home before you move in, and you cannot lease the whole home within the first
              year of occupying it. Since 10 September 2024 you can rent out part of the home (a
              room, a granny flat) while you continue to live there without losing the duty
              concession.
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Break either rule and the benefit is reassessed and repaid, with unpaid tax
              interest and penalties possible on top. Two situations are worth thinking about
              before you claim rather than after: a job that might move interstate inside twelve
              months, and a plan to rent the place out and live elsewhere, which is a{" "}
              <TextLink href="/blog/investor-loans/rentvesting-explained">
                rentvesting strategy
              </TextLink>{" "}
              and is incompatible with both benefits in year one. Telling the QRO when plans
              change costs far less than being found later.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The full first-home stack.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">Line all four up before you look at listings:</p>
            <CheckList
              items={[
                `First Home Owner Grant: ${fhogMoney(FHOG_AMOUNT)} toward a new home (this page)`,
                "Stamp duty relief: zero duty on new homes and first-home vacant land; concessions to $800k on established",
                "First Home Guarantee: buy with 5% deposit and no LMI, now without income caps",
                "First Home Super Saver: release voluntary super contributions for the deposit",
              ]}
            />
            <p className="mt-6 text-lg leading-[1.4] text-ink/80">
              They interact, which is why the order matters. The{" "}
              <TextLink href="/first-home-super-saver">First Home Super Saver scheme</TextLink>{" "}
              needs the contributions made well before you buy, so it is the one to start
              earliest. The{" "}
              <TextLink href="/first-home-guarantee">First Home Guarantee</TextLink> decides
              whether you need 5% or 20%, which changes the savings target the other three are
              working toward. Duty relief decides how much of your savings survives settlement
              day. And the grant lands last, at settlement or at the slab. Run the numbers on
              the <TextLink href="/borrowing-power-calculator">borrowing power estimator</TextLink>{" "}
              to find the price bracket that is real for your income, then the rest of the{" "}
              <TextLink href="/calculators">calculators and checks</TextLink> for repayments,
              duty and LMI. When you want it sequenced properly against a real property, the{" "}
              <TextLink href="/first-home-buyers-loan">first home buyer loan page</TextLink>{" "}
              explains how we do it.
            </p>
          </div>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "First Home Guarantee (5% deposit)", href: "/first-home-guarantee" },
          { label: "First home stamp duty rules + calculator", href: "/stamp-duty-calculator-qld#first-home" },
          { label: "First home buyer loans", href: "/first-home-buyers-loan" },
          { label: "All calculators and checks", href: "/calculators" },
        ]}
      />

      <CtaBand
        heading="Maximise every grant you're entitled to."
        intro="Tell us where you're at and a broker will map the grant, the duty relief and the deposit path together. No obligation."
        subject="FHOG QLD"
      />
    </main>
  );
}
