import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icons";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { EyebrowPill } from "@/components/v2";

// The tools hub: every calculator and check in one place. Plays for the
// "home loan calculators" long tail and, more importantly, gives the seven
// engines one shareable front door with internal links to each.

const PATH = "/calculators";

export const metadata: Metadata = {
  title: { absolute: "Home Loan Calculators & Checks | Free, No Email Wall | LINK Advance" },
  description:
    "Seven free tools from Brisbane mortgage brokers: borrowing power, repayments with the APRA stress test, LMI, QLD stamp duty, the $30,000 FHOG eligibility check, and health checks for your home loan and your business's borrowing position. All on screen, nothing stored, no email required.",
  alternates: { canonical: PATH },
};

const TOOLS = [
  {
    href: "/borrowing-power-calculator",
    icon: Icon.calculator,
    title: "Borrowing power",
    answers: "How much will a lender actually let me borrow?",
    note: "Runs the maths the way a serviceability engine does: net income, benchmark expenses, the APRA buffer and the card-limit rule.",
    time: "1 minute · numbers",
  },
  {
    href: "/home-loan-repayment-calculator",
    icon: Icon.dollar,
    title: "Repayments + stress test",
    answers: "What does the loan cost per month, and could I survive +3%?",
    note: "Monthly, fortnightly and weekly repayments, total interest, and what extra repayments save in years and dollars.",
    time: "30 seconds · numbers",
  },
  {
    href: "/stamp-duty-calculator-qld",
    icon: Icon.home,
    title: "Stamp duty QLD",
    answers: "What transfer duty do I pay, and do I pay any at all?",
    note: "General, owner-occupier and first-home rates, including the May 2025 rules: zero duty on new builds for first home buyers.",
    time: "30 seconds · numbers",
  },
  {
    href: "/lenders-mortgage-insurance-calculator",
    icon: Icon.shieldCheck,
    title: "LMI estimator",
    answers: "What does lenders mortgage insurance cost, and how do I avoid it?",
    note: "Premium ranges by deposit size, plus the four escape routes: the Guarantee, a guarantor, professional waivers, band edges.",
    time: "30 seconds · numbers",
  },
  {
    href: "/first-home-buyers-grant",
    icon: Icon.key,
    title: "FHOG eligibility check",
    answers: "Do I qualify for the $30,000 first home owner grant?",
    note: "The real QLD rules as quick questions, with the verdict updating as you answer.",
    time: "2 minutes · questions",
  },
  {
    href: "/home-loan-health-check",
    icon: Icon.clipboardCheck,
    title: "Home loan health check",
    answers: "Is my current loan still the right one?",
    note: "Six areas scored out of 10: rate drift, structure, offset use, fit and the equity underneath. Flags what to fix first.",
    time: "2 minutes · questions",
  },
  {
    href: "/business-borrowing-health-check",
    icon: Icon.trendingUp,
    title: "Business borrowing check",
    answers: "How would a commercial credit desk read my business?",
    note: "Structure, numbers, profit, add-backs, the ATO position, facilities and security, scored the way lenders score them.",
    time: "3 minutes · questions",
  },
] as const;

const FAQS = [
  {
    q: "Are these calculators accurate?",
    a: "They run the standard formulas (amortisation, QRO duty rates, serviceability with the 3% APRA buffer) and are kept current, but every lender applies its own policy on top, which is why results show as estimates or ranges. Treat them as the honest starting point, and confirm exact figures with a broker or lender before acting.",
  },
  {
    q: "Do I have to give an email address to see results?",
    a: "No. Every tool runs entirely on your screen: nothing is stored, transmitted or attached to you, and there is no email wall in front of any result. If you want a broker to look at your numbers afterwards, that's your call to make.",
  },
  {
    q: "Which tool should I start with?",
    a: "Buying: borrowing power first, then repayments on the figure it gives you, then stamp duty and LMI for the cash-to-complete picture. First home: start with the FHOG eligibility check, because the grant and duty rules change what you need to save. Already have a loan: the home loan health check tells you in two minutes whether a review is worth it.",
  },
  {
    q: "Why do your results sometimes differ from a bank's calculator?",
    a: "Bank calculators use that bank's own policy and often flatter the result to start a conversation. These tools use benchmark settings and show ranges where lenders genuinely differ: the borrowing power spread between lenders on identical inputs is routinely six figures, which is the point of using a broker.",
  },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Calculators", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "LINK Advance home loan calculators and checks",
            url: `https://linkadvance.com.au${PATH}`,
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <EyebrowPill tint>Free · on screen · no email wall</EyebrowPill>
        <h1 className="mt-6 max-w-3xl font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-[58px]">
          Every number you need <span className="marker">before you borrow.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.4] text-ink/80">
          Seven tools, each built to answer one question properly: what you can borrow, what
          it costs, what the government takes and gives back, and whether the loan or the
          business file you already have is in shape. Nothing is stored, nothing needs your
          email.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="group flex flex-col rounded-[25px] bg-[#f1f1f1] p-7 transition hover:bg-advance-light"
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
                <span className="text-advance">.</span>
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
            Most broker calculators are lead traps: the result sits behind a form, and the
            numbers are tuned to flatter. Ours run on your screen, show the honest figure
            (including the ranges where lenders genuinely differ), and leave the next step
            with you. The bet is simple: if the numbers are useful, you&apos;ll want the
            person who can move them.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
          { label: "Home loans Brisbane", href: "/home-loans-brisbane" },
          { label: "Commercial lending", href: "/commercial-lending" },
        ]}
      />

      <CtaBand
        heading="The numbers are free. So is the conversation."
        intro="Run your figures, then tell us what you're planning. A broker will tell you which lenders read your situation best, at no cost."
        subject="Calculators hub"
      />
    </main>
  );
}
