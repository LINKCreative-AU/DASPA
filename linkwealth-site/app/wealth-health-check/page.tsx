import type { Metadata } from "next";
import { WealthCheck } from "./WealthCheck";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// The LINK Wealth Check - the division's score engine (the house pattern:
// HQ performance check, Advisors health check, Books Xero check). Primarily
// a conversion engine ("financial health check" is only 120/mo at KD 2);
// the SEO legs come from the net-worth angle on the page: "net worth by age
// australia" 196/mo KD 0, "average net worth australia" 160/mo KD 3.

const PATH = "/wealth-health-check";

export const metadata: Metadata = {
  title: { absolute: "Free Wealth Health Check | Score Your Finances Out of 10" },
  description:
    "Eight questions, two minutes, a score out of 10 - buffer, debt, super, investments, protection, estate and plan. See what's holding your wealth back, no email required. Plus: how Australian net worth stacks up by age.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "The LINK Wealth Check - score your finances out of 10",
    description:
      "Eight quick questions, a score out of 10, and the flags holding it back. No email wall.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How do I calculate my net worth?",
    a: "Add everything you own (home at market value, super, investments, cash, business interests) and subtract everything you owe (home loan, investment loans, cards, personal loans). That single number, tracked yearly, is the cleanest scoreboard your finances have.",
  },
  {
    q: "What is the average net worth in Australia?",
    a: "ABS household wealth data puts the average Australian household around the $1.5-1.6 million mark - but that average is dragged up hard by the wealthiest households, and the median (typical) household sits far lower. Age matters more than averages: net worth normally peaks in the early-60s just before retirement drawdown starts.",
  },
  {
    q: "What net worth should I have at my age?",
    a: "There is no official target - it depends on income, city and goals. A useful pattern from the ABS data: households typically cross the median in their 40s as home equity and super compound, and the strongest predictor of an above-average curve is starting the boring things (buffer, contributions, regular investing) a decade earlier than feels necessary.",
  },
  {
    q: "Why does the check ask about insurance?",
    a: "Because protection is the part of wealth most people under-do. The Financial Services Council estimates around 1 million Australians are underinsured for death and TPD cover and 3.4 million for income protection - and the default cover inside super is rarely sized to your actual debts and dependants. A plan that builds assets but leaves the income funding them unprotected is one accident away from unwinding, which is why the check weighs life, TPD, income protection and trauma cover alongside super and investments.",
  },
  {
    q: "Why does it ask about my situation and super balance?",
    a: "Two context questions - whether you run a business, own a home, are within about ten years of retirement or have people depending on your income, and roughly where your super sits - don't move the score at all. They decide which general pathways show with your result, because the strategies worth exploring at $80k of super are different from the ones on the table at $300k. If you'd rather not say, the check still works.",
  },
  {
    q: "Is the wealth check personal advice?",
    a: "No. It weighs eight general markers of financial health and returns a score with general observations - it doesn't know your income, age or circumstances. It's built to start the right conversation; the free discovery meeting is where your actual situation gets assessed by a licensed adviser.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Wealth Health Check",
            url: `https://wealth.link.com.au${PATH}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Wealth Health Check", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Wealth Health Check", path: PATH },
        ]}
      />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Free tool · 2 minutes · no email needed"
            title="The Wealth Check: score your finances out of 10."
            mark="out of 10."
            intro="Eight scored areas across the things that actually decide financial health - buffer, debt, super, investments, protection, estate and the plan itself - plus two quick context questions so the next steps fit your situation. Your score, the flags holding it back and the pathways people in your position usually explore show up immediately, on screen, no email wall."
            accent
          />
        </div>
        <div className="mt-10">
          <WealthCheck />
        </div>
      </section>

      {/* The net worth angle - the page's search legs */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            The one number behind the score: net worth.
          </h2>
          <p className="mt-5 text-lg text-ink/65">
            <strong className="text-ink">Net worth = everything you own minus everything you
            owe.</strong> Home at market value, super, investments and cash on one side; the
            mortgage, investment loans and cards on the other. It's the first question in the
            check because it's the scoreboard for all the others.
          </p>
          <p className="mt-4 text-lg text-ink/65">
            For context, ABS household wealth data puts the <em>average</em> Australian
            household around $1.5-1.6 million - a figure dragged up by the wealthiest
            households, with the typical (median) household far lower. The shape matters more
            than the number: net worth usually compounds hardest through the 40s and 50s as
            home equity and super stack, peaking just before retirement. Where you are on that
            curve - and whether the curve is steep enough for the retirement you want - is
            exactly what the{" "}
            <a href="/how-much-do-i-need-to-retire" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              retirement readiness check
            </a>{" "}
            models next.
          </p>
        </div>
      </section>

      {/* FAQs (visible text and schema kept in sync) */}
      <FAQ
        title="Net worth and the check, answered."
        faqs={FAQS}
        related={[
          { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire" },
          { label: "Home equity calculator", href: "/home-equity-estimator-calculator" },
          { label: "Debt recycling calculator", href: "/insights/wealth-creation-using-debt-recycling" },
        ]}
      />

      <CtaBand
        heading="A score is a start. A plan is the point."
        intro="Bring your result to a free, no-obligation discovery meeting and a licensed adviser will turn the flags into a sequence - what to fix first, and what it's worth."
        variant="discovery"
        subject="Wealth Health Check"
      />
    </main>
  );
}
