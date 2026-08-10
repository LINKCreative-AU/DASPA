import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ, CheckList } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { FhogChecker } from "./FhogChecker";

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
    a: "You must be 18+, an Australian citizen or permanent resident (or buying with one), never have received a FHOG anywhere in Australia, never have owned and lived in an Australian property (investment-only ownership can survive the test), buy or build a NEW or substantially renovated home with a total value of $750,000 or less, and live in it for at least six continuous months within the first year.",
  },
  {
    q: "Does the grant apply to established homes?",
    a: "No. The QLD grant is for new homes only: new builds, off-the-plan purchases and substantially renovated homes (cosmetic work like paint doesn't count). Established-home buyers still get first-home stamp duty concessions, which can be worth more than the grant itself.",
  },
  {
    q: "Do first home buyers pay stamp duty in QLD?",
    a: "Often not. Since 1 May 2025, first home buyers building or buying a NEW home in Queensland pay no transfer (stamp) duty at all, with no price cap. For established homes, the first-home concession applies in full up to $700,000 and phases out to $800,000 (vacant land: $350,000 full, phasing to $500,000). Confirm current thresholds at qld.gov.au.",
  },
  {
    q: "How do I apply for the FHOG in QLD?",
    a: "Most people apply through their lender or broker with the loan application, so the grant is available at settlement. That's how we do it, and it's the path we recommend. You can also apply directly to the Queensland Revenue Office. Either way you'll need ID and your contract paperwork; applications generally must be lodged within a year of taking possession.",
  },
  {
    q: "Can the grant be used as part of my deposit?",
    a: "Often yes: many lenders count the FHOG toward your deposit for a new build, especially alongside the First Home Guarantee's 5% deposit path. Which lenders, and how the timing works with progress payments, is exactly the kind of thing your broker sequences.",
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
                "Total value (home plus land) is $750,000 or less",
                "You'll live in it for at least six continuous months within the first year",
              ]}
            />
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Stamp duty: the saving that stacks on top.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              The grant gets the headlines, but the stamp duty rules changed on 1 May 2025 and
              they're now often worth more:{" "}
              <strong className="text-ink">
                first home buyers building or buying a new home in Queensland pay no transfer
                duty at all, with no price cap.
              </strong>{" "}
              Buying an established home? The first-home concession applies in full up to
              $700,000 and phases out to $800,000; for vacant land it's full relief to
              $350,000, phasing to $500,000. (Official thresholds: qld.gov.au, and our stamp
              duty calculator runs your numbers in seconds.)
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
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The full first-home stack.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">Line all four up before you look at listings:</p>
            <CheckList
              items={[
                "First Home Owner Grant: $30,000 toward a new home (this page)",
                "Stamp duty relief: zero duty on new homes; concessions to $800k on established",
                "First Home Guarantee: buy with 5% deposit and no LMI, now without income caps",
                "First Home Super Saver: release voluntary super contributions for the deposit",
              ]}
            />
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
        ]}
      />

      <CtaBand
        heading="Maximise every grant you're entitled to."
        intro="Tell us where you're at and a broker will map the grant, the duty relief and the deposit path together. Free, no obligation."
        subject="FHOG QLD"
      />
    </main>
  );
}
