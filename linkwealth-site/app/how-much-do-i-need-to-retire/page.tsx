import type { Metadata } from "next";
import { RetirementCheck } from "./RetirementCheck";
import { JsonLd, articleSchema, breadcrumbSchema, calculatorSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// NEW page from the second competitor pass: the retirement cluster is the
// biggest soft field on the map - "retirement calculator (australia)"
// 6,400/mo combined at KD 7-11 (18k TP), "how much super do i need to
// retire" 1,273 KD 9, "how much do i need to retire" 1,007 KD 7, "asfa
// retirement standard" 2,386 KD 22, "preservation age" 3,179 KD 0. One
// guide + the readiness check chases the lot; /retirement-planning stays
// the service page and this feeds it.

const PATH = "/how-much-do-i-need-to-retire";

export const metadata: Metadata = {
  title: { absolute: "How Much Do You Need to Retire in Australia? Calculator + 2026 Numbers" },
  description:
    "The real numbers: ASFA says a comfortable retirement costs ~$52,500/yr single or ~$74,000/yr couple. Use our retirement readiness check to see if your super is on track, and what closing the gap takes.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "How Much Do You Need to Retire in Australia?",
    description:
      "ASFA benchmarks, the rule of 25, super balance guides by age, and a free retirement readiness check.",
    url: PATH,
  },
};

// ASFA Super Balance Detective style guide: balance needed today to stay on
// course for a comfortable retirement at 67 (indicative, rounded - the live
// figures move; check superguru.com.au).
const BY_AGE: [string, string][] = [
  ["30", "≈ $65,000"],
  ["35", "≈ $110,000"],
  ["40", "≈ $160,000"],
  ["45", "≈ $220,000"],
  ["50", "≈ $290,000"],
  ["55", "≈ $370,000"],
  ["60", "≈ $460,000"],
  ["65", "≈ $570,000"],
];

const FAQS = [
  {
    q: "How much money do you need to retire in Australia?",
    a: "As a benchmark, the ASFA Retirement Standard (2025-26) puts a comfortable retirement at roughly $52,500 a year for a single home-owner or $74,000 for a couple, and ASFA estimates lump sums of about $595,000 (single) or $690,000 (couple) get you there with a part Age Pension. If you want to fund the same lifestyle without relying on the pension, the rule-of-25 says you need about 25 times your annual spending: $1.3m-$1.85m. Your real number depends on your spending, housing and health, which is what a retirement plan works out.",
  },
  {
    q: "How much do I need to retire at 60 in Australia?",
    a: "Retiring at 60 instead of 67 means funding roughly seven extra years yourself, with no Age Pension until 67. As a rough guide, add your annual lifestyle cost for each early year on top of the lump sums above. A comfortable single retiring at 60 is closer to $950,000+ than $595,000. Early retirement is exactly the scenario worth modelling properly before you commit.",
  },
  {
    q: "When can I access my super?",
    a: "At your preservation age, which is 60 for anyone born after 30 June 1964, so effectively 60 for everyone still working. You can access super at 60 if you retire (or via a transition-to-retirement pension while still working), and at 65 regardless of work status. The Age Pension, separately, starts at 67.",
  },
  {
    q: "Does the Age Pension count towards retirement income?",
    a: "Yes, and it does more of the work than most people expect: ASFA's comfortable lump sums assume a part Age Pension tops up your drawdown as your balance runs down. The full couple rate is roughly $45,000 a year (indexed). Assets and income tests decide your entitlement, another reason two households with the same super can need very different plans.",
  },
  {
    q: "Is $500,000 in super enough to retire on?",
    a: "For a couple who own their home, roughly $500,000 plus the Age Pension can sustain a lifestyle between ASFA's modest and comfortable standards. For a single, it is close to ASFA's comfortable lump sum. Whether it is enough for you depends on the retirement you actually want. Run your numbers through the readiness check above, then test them properly in a Retirement Funding Workshop.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          articleSchema({
            title: "How Much Do You Need to Retire in Australia?",
            description: metadata.description as string,
            path: PATH,
            datePublished: "2026-08-08T00:00:00",
            dateModified: "2026-08-08T00:00:00",
          }),
          calculatorSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Retirement Planning", path: "/retirement-planning" },
            { name: "How much do you need to retire?", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Retirement Planning", path: "/retirement-planning" },
          { name: "How much do you need to retire?", path: PATH },
        ]}
      />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Free tool + guide"
            title="How much do you need to retire in Australia?"
            mark="retire in Australia?"
            accent
          />
          {/* Answer-first: the numbers up top, for snippets and AI overviews */}
          <p className="mt-6 text-lg text-ink/80">
            <strong className="text-ink">
              Benchmark answer: a comfortable retirement costs about $52,500 a year for a
              single home-owner or $74,000 for a couple (ASFA Retirement Standard, 2025-26),
              and ASFA puts the lump sums at roughly $595,000 and $690,000 with a part Age
              Pension.
            </strong>{" "}
            Fund it entirely from your own capital and the rule-of-25 says you need around 25
            times your annual spending. Your number sits somewhere between those two.
            Here&apos;s how to find it.
          </p>
        </div>

        <div id="check" className="mt-10 scroll-mt-24">
          <h2 className="mb-6 font-display text-3xl font-normal tracking-tight text-ink">
            The retirement readiness check.
          </h2>
          <RetirementCheck />
        </div>
      </section>

      {/* The two benchmarks */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            The two numbers everyone quotes, and why they differ.
          </h2>
          <p className="mt-5 text-lg text-ink/65">
            <strong className="text-ink">The ASFA Retirement Standard</strong> prices a real
            retirement budget each quarter: modest (~$33,500 single / $48,500 couple a year)
            and comfortable (~$52,500 / $74,000). Its famous lump sums (about $595,000 for a
            single, $690,000 for a couple) look achievable because they assume the Age
            Pension progressively tops you up as your balance runs down.
          </p>
          <p className="mt-4 text-lg text-ink/65">
            <strong className="text-ink">The rule of 25</strong> (the 4% drawdown rule) prices
            independence: 25 times your annual spending, no pension assumed. For the same
            comfortable couple that is ~$1.85m. Neither number is wrong; they answer
            different questions, and most real plans land between them.
          </p>
          <p className="mt-4 text-lg text-ink/65">
            One date worth knowing: your <strong className="text-ink">preservation age</strong>{" "}
            (when you can access super) is 60 for anyone born after 30 June 1964. The Age
            Pension starts separately at 67. Retiring in the 60-67 window means your super
            carries everything until the pension arrives.
          </p>
        </div>
      </section>

      {/* Balance by age */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            How much super should you have at your age?
          </h2>
          <p className="mt-5 text-lg text-ink/65">
            ASFA&apos;s guide to the balance that keeps you on course for a comfortable
            retirement at 67 (indicative and rounded; the live figures move with markets and
            wages; check ASFA&apos;s Super Balance Detective for today&apos;s number):
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full max-w-md border-collapse text-base">
              <thead>
                <tr>
                  <th className="border-b-2 border-ink/15 py-2 pr-6 text-left text-sm font-semibold uppercase tracking-wide text-ink/60">
                    Age today
                  </th>
                  <th className="border-b-2 border-ink/15 py-2 text-left text-sm font-semibold uppercase tracking-wide text-ink/60">
                    Balance to be on track
                  </th>
                </tr>
              </thead>
              <tbody>
                {BY_AGE.map(([ageRow, bal]) => (
                  <tr key={ageRow}>
                    <td className="border-b border-ink/10 py-2.5 pr-6 font-semibold text-ink">{ageRow}</td>
                    <td className="border-b border-ink/10 py-2.5 font-semibold text-wealth">{bal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-lg text-ink/65">
            Behind? You are in the majority, and the levers get stronger the earlier you pull
            them: salary-sacrifice and catch-up concessional contributions, investment
            settings inside super, spouse contributions and splitting,{" "}
            <a href="/insights/wealth-creation-using-debt-recycling" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              debt recycling
            </a>{" "}
            outside super, and, for business owners,{" "}
            <a href="/smsf" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              an SMSF that owns your premises
            </a>
            . A transition-to-retirement pension can also cut tax in the final working years.
          </p>
        </div>
      </section>

      {/* Route to the service */}
      <section className="container-x pb-4">
        <div className="rounded-3xl bg-ink p-10 text-white sm:p-14">
          <p className="eyebrow guide-line-inline mb-4">
            <span className="text-white/60">From estimate to plan</span>
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-normal tracking-tight sm:text-4xl">
            The check gives you a number. The plan gets you there.
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            A licensed adviser models your real position (tax, Age Pension, contribution
            caps, market sequence) in a free discovery meeting, or one-on-one in the $660
            Retirement Funding Workshop (Value Guarantee: full refund if it is not worth it).
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/retirement-planning" className="btn bg-white text-ink hover:bg-neutral-100">
              Retirement planning advice
            </a>
            <a
              href="/retirement-funding-workshop-link-wealth"
              className="btn border border-white/25 text-white hover:border-white"
            >
              Retirement Funding Workshop
            </a>
          </div>
        </div>
      </section>

      {/* FAQs (visible text and schema kept in sync) */}
      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Retirement planning", href: "/retirement-planning" },
          { label: "Retirement Funding Workshop", href: "/retirement-funding-workshop-link-wealth" },
          { label: "SMSF commercial property", href: "/smsf" },
        ]}
      />

      <CtaBand
        heading="See your real retirement number."
        intro="The readiness check is a rule of thumb. Your plan should not be. Book a free, no-obligation discovery meeting and we'll model your actual position."
        variant="discovery"
        subject="How much do I need to retire"
      />
    </main>
  );
}
