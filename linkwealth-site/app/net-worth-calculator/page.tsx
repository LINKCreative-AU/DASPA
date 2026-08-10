import type { Metadata } from "next";
import { NetWorthCalculator } from "./NetWorthCalculator";
import { ABS_BANDS } from "./abs";
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
  title: { absolute: "Net Worth Calculator Australia + Net Worth by Age (ABS Data)" },
  description:
    "Calculate your net worth in two minutes (what you own minus what you owe), then compare it to the ABS average for your age group. Liquid net worth, debt ratio and where your wealth sits, on screen, nothing stored, no email required.",
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
    a: "Add up everything you own: your home at today's market value, investment property, super, shares and managed funds, cash (including offset balances), your share of any business, and other assets like vehicles. Then subtract everything you owe: home loan, investment loans, credit cards and personal loans, HECS/HELP and any other debts. What's left is your net worth.",
  },
  {
    q: "Should I include my home and super?",
    a: "Yes to both: net worth counts everything. But the shape matters: the calculator splits your result into property, super, and investable wealth, because a high net worth locked entirely in the family home and super is a very different position from the same number spread across income-producing assets you can actually reach.",
  },
  {
    q: "Should I include HECS/HELP debt?",
    a: "For a true net worth figure, yes: it's money you owe. That said, HECS/HELP is interest-free (indexed to inflation) and repaid through income, so most advisers treat it differently from other debts when planning: it's rarely worth paying down ahead of investing or clearing dearer debt.",
  },
  {
    q: "What's a good net worth for my age?",
    a: "There's no official target. It depends on income, city and goals. The ABS age-band averages (full table on this page) show the shape: household net worth typically compounds hardest through the 40s and 50s as home equity and super stack, peaking around 65-69 before retirement drawdown. Averages are dragged up by the wealthiest households and medians sit far lower, so the more useful habit is tracking your own number yearly: the trend tells you whether your strategy is working, which no comparison table can.",
  },
  {
    q: "What should my net worth be at 40 in Australia?",
    a: "ABS survey data puts the average household net worth in the 40-44 age band around $841,000 (2019-20, the latest detailed age breakdown), but that average is pulled up hard by the wealthiest households, and the typical (median) household sits well below it. At 40 the more useful questions are directional: is the number growing year on year, is high-interest debt gone, and are home equity and super compounding? Those three decide where the curve goes from here.",
  },
  {
    q: "What is liquid net worth?",
    a: "Liquid net worth counts only the wealth you could actually reach within days (cash, savings, shares and other investments you can sell quickly), minus short-term debts like credit cards. It excludes the family home and super, which are real wealth but locked. Advisers watch it because it's your realistic buffer and opportunity fund: a $2 million net worth with $5,000 liquid is asset-rich and option-poor. The calculator shows yours automatically.",
  },
  {
    q: "Is anything I enter stored or sent anywhere?",
    a: "No. The calculator runs entirely on your screen. Nothing is saved, transmitted or attached to you. If you choose to book a discovery meeting afterwards, you decide what to share.",
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
            intro="The one number behind all the others. Enter what you own and what you owe (home, super, shares, cash, business, loans) and see your net worth and where it actually sits, on screen as you type. Nothing is stored or sent."
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
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            How to calculate net worth.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">Net worth = total assets − total liabilities.</strong>{" "}
            On the asset side: your home and any investment property at today&apos;s market
            value, super (all accounts), shares and managed funds, cash and offset balances,
            your share of any business at a realistic price, and anything else of real value.
            On the liability side: the home loan, investment loans, credit cards and personal
            loans, HECS/HELP and anything else owing.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            A worked example: a home worth $950,000 with $420,000 owing, $310,000 of combined
            super, $60,000 in shares and $40,000 in savings, against $8,000 on cards, is a net
            worth of <strong className="text-ink">$932,000</strong>, with about 57% of it in
            the family home. That last part is the insight the total hides: the{" "}
            <em>shape</em> of your net worth decides what your options are, and reshaping it
            (without selling the house) is what strategies like{" "}
            <a href="/insights/wealth-creation-using-debt-recycling" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              debt recycling
            </a>{" "}
            and{" "}
            <a href="/home-equity-long-term-wealth-strategy" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              equity strategy
            </a>{" "}
            are for.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Then track it. Once a year, same method, written down. The trend (not the
            comparison to anyone else) is the cleanest scoreboard your finances have. When
            you want to know whether the <em>behaviours</em> behind the number are set up to
            grow it, the{" "}
            <a href="/wealth-health-check" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              Wealth Check
            </a>{" "}
            scores those in two minutes.
          </p>
        </div>
      </section>

      {/* Net worth by age - the ABS table (the KD-0 cluster: average/median/
          by-age queries, ~1,000/mo combined). Hedged, household figures. */}
      <section id="by-age" className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Net worth by age in Australia.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            The most recent detailed age breakdown from the ABS (Survey of Income and Housing,
            2019-20) shows <strong className="text-ink">average household net worth by age of
            the main income earner</strong>. Two caveats before the table: these are{" "}
            <em>household</em> figures, not per person, and averages are dragged up hard by the
            wealthiest households: that survey's national average was $1.04 million while the
            median (typical) household sat at $579,200. Later ABS releases put the national
            average around $1.5 million, so read the table for the shape of the curve rather
            than the exact dollars.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink text-sm font-semibold uppercase tracking-wider text-ink/60">
                  <th className="py-3 pr-4">Age group</th>
                  <th className="py-3 text-right">Average household net worth</th>
                </tr>
              </thead>
              <tbody>
                {ABS_BANDS.map((b) => (
                  <tr key={b.band} className="border-b border-ink/10">
                    <td className="py-3 pr-4 font-semibold text-ink">{b.band}</td>
                    <td className="py-3 text-right tabular-nums text-ink/75">
                      {b.mean.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-ink/45">
            Source: ABS Survey of Income and Housing 2019-20, mean household net worth by age
            of household reference person. General information only.
          </p>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            The pattern to take from it: net worth roughly doubles across the 40s, peaks around
            65-69 at about $1.8 million on average, then declines through retirement drawdown.
            The wealthiest 20% of households hold the majority of it (their average sits
            around the $3.2 million mark), which is why the medians run at roughly half these
            figures at most ages. Wherever you are on the curve, the levers are the same:
            high-interest debt gone first, home equity and super compounding, and wealth
            building <em>outside</em> super for the years before preservation age.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Wealth health check", href: "/wealth-health-check" },
          { label: "Home equity calculator", href: "/home-equity-estimator-calculator" },
          { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire" },
        ]}
      />

      <CtaBand
        heading="Know the number. Now grow it."
        intro="Bring your net worth to a free, no-obligation discovery meeting and a licensed adviser will map what it could look like in ten years, and what to do first."
        variant="discovery"
        subject="Net Worth Calculator"
      />
    </main>
  );
}
