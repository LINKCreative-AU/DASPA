import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icons";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { EyebrowPill } from "@/components/v2";

// The tools hub: every calculator and check in one place. Five engines were
// only reachable from a nav dropdown; this gives them one shareable front
// door, framed by the question each one answers.

const PATH = "/tools";

export const metadata: Metadata = {
  title: { absolute: "Free Financial Calculators & Checks | No Email Wall | LINK Wealth" },
  description:
    "Five free tools from Brisbane financial advisers: net worth, home equity, retirement readiness, debt recycling and a wealth health check scored out of 10. Everything runs on your screen, nothing is stored, no email required.",
  alternates: { canonical: PATH },
};

const TOOLS = [
  {
    href: "/wealth-health-check",
    icon: Icon.clipboardCheck,
    title: "Wealth health check",
    answers: "How healthy are my finances, honestly?",
    note: "Nine areas scored out of 10: buffer, debt, super, investing, protection, estate, the plan and how money feels. Flags what to fix first, in order.",
    time: "2 minutes · questions",
  },
  {
    href: "/net-worth-calculator",
    icon: Icon.trendingUp,
    title: "Net worth calculator",
    answers: "What am I actually worth, and where does it sit?",
    note: "Assets minus liabilities, quick or fully itemised, with liquid net worth, debt-to-asset ratio, the property/super/investable split and an ABS comparison by age.",
    time: "2 minutes · numbers",
  },
  {
    href: "/home-equity-estimator-calculator",
    icon: Icon.home,
    title: "Home equity estimator",
    answers: "How much equity have I built, and how much can I use?",
    note: "Property value minus what is secured against it, plus usable equity at the 80% lender ceiling, with the pre-computed table if you would rather just read it.",
    time: "30 seconds · numbers",
  },
  {
    href: "/how-much-do-i-need-to-retire",
    icon: Icon.shieldCheck,
    title: "Retirement readiness check",
    answers: "Will my super fund the retirement I want?",
    note: "Projects your balance in today's dollars against the ASFA benchmarks and the rule of 25, and sizes the gap plus what closing it costs a year.",
    time: "1 minute · numbers",
  },
  {
    href: "/insights/wealth-creation-using-debt-recycling#calculator",
    icon: Icon.dollar,
    title: "Debt recycling calculator",
    answers: "Is recycling my mortgage better than just paying it down?",
    note: "Compares directing surplus cash at the loan against recycling it into investments, on your own rate, return, tax rate and timeframe.",
    time: "1 minute · numbers",
  },
  {
    href: "/how-much-does-a-financial-advisor-cost",
    icon: Icon.tag,
    title: "What advice costs",
    answers: "What will a financial adviser actually charge me?",
    note: "Published fee ranges for Australian advice in 2026, initial and ongoing, including our own workshop pricing. Not a calculator, just the numbers nobody prints.",
    time: "A short read",
  },
] as const;

const FAQS = [
  {
    q: "Do I have to give an email address to see results?",
    a: "No. Every tool runs entirely on your screen: nothing is stored, transmitted or attached to you, and there is no email wall in front of any result. If you want an adviser to look at your numbers afterwards, that is your call to make.",
  },
  {
    q: "Which tool should I start with?",
    a: "If you have never put a number on it, start with the net worth calculator: it is the scoreboard every other answer sits on. If you want to know what to fix first, the wealth health check scores nine areas and orders the flags. If retirement is the question, go straight to the readiness check.",
  },
  {
    q: "How accurate are the results?",
    a: "They run standard, stated arithmetic (net worth is assets minus liabilities, usable equity is 80% of value minus the loan, retirement projections compound at a 4% real return, the rule of 25 is annual spending times 25) and each tool prints its own assumptions underneath. They are estimates, not projections of your actual outcome, and they do not know your tax position, income or circumstances.",
  },
  {
    q: "Are these tools financial advice?",
    a: "No. They provide general information only and do not take into account your objectives, financial situation or needs. Richard Leal (AR 327265) and Link Wealth Pty Ltd (CAR 1312767) are authorised representatives of Millennium 3 Financial Services Pty Ltd (ABN 61 094 529 987), AFSL 244252, and personal advice is given in a meeting, not by a calculator.",
  },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Tools", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "LINK Wealth financial calculators and checks",
            url: `https://wealth.link.com.au${PATH}`,
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <EyebrowPill tint>Free · on screen · no email wall</EyebrowPill>
        <h1 className="mt-6 max-w-3xl font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-[58px]">
          Run your own numbers <span className="marker">before the meeting.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.4] text-ink/80">
          Six tools, each built to answer one question properly: what you are worth, what your
          home equity can do, whether your super will get you there, and what a financial
          adviser charges. Nothing is stored and nothing needs your email.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="group flex flex-col rounded-[25px] bg-[#f1f1f1] p-7 transition hover:bg-wealth-light"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink">
                  <t.icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                  {t.time}
                </span>
              </div>
              <p className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                {t.title}
                <span className="text-wealth">.</span>
              </p>
              <p className="mt-2 text-[15px] font-semibold text-ink/75">{t.answers}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.note}</p>
              <p className="mt-auto pt-5 text-sm font-semibold text-ink/40 transition group-hover:text-ink">
                Open the tool →
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight sm:text-[44px]">
            Why none of these ask for your email.
          </h2>
          <p className="mt-5 text-lg leading-[1.5] text-white/80">
            Most adviser calculators are lead traps: the result sits behind a form and the
            numbers are tuned to flatter. Ours run on your screen, print their assumptions
            underneath, and leave the next step with you. The bet is simple: if the numbers
            are useful, you will want to talk to the people who can move them.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Retirement planning", href: "/retirement-planning" },
          { label: "Property investment advice", href: "/property-investment-advice" },
          { label: "SMSF commercial property", href: "/smsf" },
        ]}
      />

      <CtaBand
        heading="The numbers are free. So is the first conversation."
        intro="Run your figures, then bring them to a free, no-obligation discovery meeting. A licensed adviser will tell you what they mean and what moves them."
        variant="discovery"
        subject="Tools hub"
      />
    </main>
  );
}
