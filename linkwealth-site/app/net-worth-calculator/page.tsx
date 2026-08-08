import type { Metadata } from "next";
import { NetWorthCalculator } from "./NetWorthCalculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// The net worth calculator - the arithmetic companion to the Wealth Check
// (which scores behaviours, not balances - Richard's read, correctly).
// SEO: "how to calculate net worth" 1,500/mo AU, "net worth calculator"
// 692/mo, ~1,900 traffic potential. Answer-first copy, worked example,
// no email wall.

const PATH = "/net-worth-calculator";

export const metadata: Metadata = {
  title: { absolute: "Net Worth Calculator Australia | Free, No Sign-Up" },
  description:
    "Calculate your net worth in two minutes: everything you own (home, super, shares, cash, business) minus everything you owe. See where your wealth actually sits - on screen, nothing stored, no email required.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Net worth calculator - what you own minus what you owe",
    description:
      "The one number behind your finances, plus where it actually sits. Free, on screen, no email wall.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How do I calculate my net worth?",
    a: "Add up everything you own - your home at today's market value, investment property, super, shares and managed funds, cash (including offset balances), your share of any business, and other assets like vehicles. Then subtract everything you owe: home loan, investment loans, credit cards and personal loans, HECS/HELP and any other debts. What's left is your net worth.",
  },
  {
    q: "Should I include my home and super?",
    a: "Yes to both - net worth counts everything. But the shape matters: the calculator splits your result into property, super, and investable wealth, because a high net worth locked entirely in the family home and super is a very different position from the same number spread across income-producing assets you can actually reach.",
  },
  {
    q: "Should I include HECS/HELP debt?",
    a: "For a true net worth figure, yes - it's money you owe. That said, HECS/HELP is interest-free (indexed to inflation) and repaid through income, so most advisers treat it differently from other debts when planning: it's rarely worth paying down ahead of investing or clearing dearer debt.",
  },
  {
    q: "What's a good net worth for my age?",
    a: "There's no official target - it depends on income, city and goals. ABS household wealth data puts the average Australian household around $1.5-1.6 million, but that average is dragged up by the wealthiest households and the median sits far lower. The more useful habit is tracking your own number yearly: the trend tells you whether your strategy is working, which no comparison table can.",
  },
  {
    q: "Is anything I enter stored or sent anywhere?",
    a: "No. The calculator runs entirely on your screen - nothing is saved, transmitted or attached to you. If you choose to book a discovery meeting afterwards, you decide what to share.",
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
            name: "LINK Wealth Net Worth Calculator",
            url: `https://wealth.link.com.au${PATH}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Net Worth Calculator", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Net Worth Calculator", path: PATH },
        ]}
      />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Free tool · 2 minutes · nothing stored"
            title="Net worth calculator: what you own minus what you owe."
            mark="minus what you owe."
            intro="The one number behind all the others. Enter what you own and what you owe - home, super, shares, cash, business, loans - and see your net worth and where it actually sits, on screen as you type. Nothing is stored or sent."
            accent
          />
        </div>
        <div className="mt-10">
          <NetWorthCalculator />
        </div>
      </section>

      {/* How to calculate - the answer-first section for the 1,500/mo query */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            How to calculate net worth.
          </h2>
          <p className="mt-5 text-lg text-ink/65">
            <strong className="text-ink">Net worth = total assets − total liabilities.</strong>{" "}
            On the asset side: your home and any investment property at today&apos;s market
            value, super (all accounts), shares and managed funds, cash and offset balances,
            your share of any business at a realistic price, and anything else of real value.
            On the liability side: the home loan, investment loans, credit cards and personal
            loans, HECS/HELP and anything else owing.
          </p>
          <p className="mt-4 text-lg text-ink/65">
            A worked example: a home worth $950,000 with $420,000 owing, $310,000 of combined
            super, $60,000 in shares and $40,000 in savings, against $8,000 on cards, is a net
            worth of <strong className="text-ink">$932,000</strong> - with about 57% of it in
            the family home. That last part is the insight the total hides: the{" "}
            <em>shape</em> of your net worth decides what your options are, and reshaping it -
            without selling the house - is what strategies like{" "}
            <a href="/insights/wealth-creation-using-debt-recycling" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              debt recycling
            </a>{" "}
            and{" "}
            <a href="/home-equity-long-term-wealth-strategy" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              equity strategy
            </a>{" "}
            are for.
          </p>
          <p className="mt-4 text-lg text-ink/65">
            Then track it. Once a year, same method, written down. The trend - not the
            comparison to anyone else - is the cleanest scoreboard your finances have. When
            you want to know whether the <em>behaviours</em> behind the number are set up to
            grow it, the{" "}
            <a href="/wealth-health-check" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              Wealth Check
            </a>{" "}
            scores those in two minutes.
          </p>
        </div>
      </section>

      <FAQ
        title="Net worth, answered."
        faqs={FAQS}
        related={[
          { label: "Wealth health check", href: "/wealth-health-check" },
          { label: "Home equity calculator", href: "/home-equity-estimator-calculator" },
          { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire" },
        ]}
      />

      <CtaBand
        heading="Know the number. Now grow it."
        intro="Bring your net worth to a free, no-obligation discovery meeting and a licensed adviser will map what it could look like in ten years - and what to do first."
        variant="discovery"
        subject="Net Worth Calculator"
      />
    </main>
  );
}
