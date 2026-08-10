import type { Metadata } from "next";
import { WealthCheck } from "./WealthCheck";
import { BANDS, SCORED_AREAS } from "./questions";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";

// The LINK Wealth Check - the division's score engine (the house pattern:
// HQ performance check, Advisors health check, Books Xero check). Primarily
// a conversion engine ("financial health check" is only 120/mo at KD 2);
// the SEO legs come from the net-worth angle on the page: "net worth by age
// australia" 196/mo KD 0, "average net worth australia" 160/mo KD 3.

const PATH = "/wealth-health-check";

export const metadata: Metadata = {
  title: { absolute: "Free Wealth Health Check | Score Your Finances Out of 10" },
  description:
    "Two minutes, a score out of 10: buffer, debt, super, investments, protection, estate, the plan and how money feels day to day. See what's holding your wealth back, no email required. Plus: how Australian net worth stacks up by age.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "The LINK Wealth Check - score your finances out of 10",
    description:
      "Two minutes, a score out of 10, and the flags holding it back. No email wall.",
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
    a: "ABS household wealth data puts the average Australian household around the $1.5-1.6 million mark, but that average is dragged up hard by the wealthiest households, and the median (typical) household sits far lower. Age matters more than averages: net worth normally peaks in the early-60s just before retirement drawdown starts.",
  },
  {
    q: "What net worth should I have at my age?",
    a: "There is no official target. It depends on income, city and goals. A useful pattern from the ABS data: households typically cross the median in their 40s as home equity and super compound, and the strongest predictor of an above-average curve is starting the boring things (buffer, contributions, regular investing) a decade earlier than feels necessary. The full ABS age-by-age table lives on our net worth calculator page.",
  },
  {
    q: "Why does the check ask about insurance?",
    a: "Because protection is the part of wealth most people under-do. The Financial Services Council estimates around 1 million Australians are underinsured for death and TPD cover and 3.4 million for income protection, and the default cover inside super is rarely sized to your actual debts and dependants. A plan that builds assets but leaves the income funding them unprotected is one accident away from unwinding, which is why the check weighs life, TPD, income protection and trauma cover alongside super and investments.",
  },
  {
    q: "Why does it ask about my situation and super balance?",
    a: "Three context questions (what you want money to do next, whether you run a business, own a home, are within about ten years of retirement or have people depending on your income, and roughly where your super sits) don't move the score at all. They decide which general pathways show with your result, because the strategies worth exploring at $80k of super are different from the ones on the table at $300k, and a plan that starts from your goals beats one that starts from averages. If you'd rather not say, the check still works.",
  },
  {
    q: "Is the wealth check personal advice?",
    a: "No. It weighs nine general markers of financial health and returns a score with general observations. It doesn't know your income, age or circumstances. It's built to start the right conversation; the free discovery meeting is where your actual situation gets assessed by a licensed adviser.",
  },
];

// The crawlable version of the scale the check applies: the same BANDS the
// tool reads and the same nine scored areas, so the scoring is indexable even
// though the tool itself renders client-side.
const BAND_ROWS = BANDS.map((b, i) => {
  const upper = i === 0 ? 10 : BANDS[i - 1].min;
  return [b.name, `${b.min.toFixed(1)} to ${upper.toFixed(1)}`, b.blurb];
});

const AREA_ROWS = SCORED_AREAS.map((a) => [a.area, a.stage, a.best]);

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
            intro="Nine scored areas across the things that actually decide financial health (buffer, debt, super, investments, protection, estate, the plan and how money feels day to day), plus three quick context questions so the next steps fit your goals and situation. Your score, the flags holding it back and the pathways people in your position usually explore show up immediately, on screen, no email wall."
            accent
          />
        </div>
        <div className="mt-10">
          <WealthCheck />
        </div>
      </section>

      {/* The crawlable scale: what the tool scores and what each band means */}
      <section className="py-20">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            How the score is worked out.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Nine scored areas, each marked out of 1 and averaged, then multiplied by ten. The
            three context questions (goals, situation, super band) carry no score at all: they
            only decide which pathways show with your result.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Wealth Check score bands and what each one means"
              head={["Band", "Score out of 10", "What it means"]}
              rows={BAND_ROWS}
              note="The same bands the tool above reads. The score weighs the nine areas equally and knows nothing about your income, age or goals, so it is a conversation starter, not a verdict."
            />
          </div>
          <h3 className="mt-14 font-display text-xl font-bold tracking-tight text-ink">
            The nine scored areas, and what a full mark looks like.
          </h3>
          <div className="mt-6">
            <DataTable
              caption="The nine scored areas in the LINK Wealth Check and what scores full marks in each"
              head={["Area", "Stage", "What scores full marks"]}
              rows={AREA_ROWS}
              note="Read straight from the question set the tool runs. General information only, not personal advice."
            />
          </div>
        </div>
      </section>

      {/* The net worth angle - the page's search legs */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The one number behind the score: net worth.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">Net worth = everything you own minus everything you
            owe.</strong> Home at market value, super, investments and cash on one side; the
            mortgage, investment loans and cards on the other. It's the first scored question
            in the check because it's the scoreboard for all the others, and if you don't
            know yours, the free{" "}
            <a href="/net-worth-calculator" className="font-medium text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth">
              net worth calculator
            </a>{" "}
            works it out on screen in two minutes.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            For context, ABS household wealth data puts the <em>average</em> Australian
            household around $1.5-1.6 million, a figure dragged up by the wealthiest
            households, with the typical (median) household far lower. The shape matters more
            than the number: net worth usually compounds hardest through the 40s and 50s as
            home equity and super stack, peaking just before retirement. Where you are on that
            curve (and whether the curve is steep enough for the retirement you want) is
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
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire" },
          { label: "Home equity calculator", href: "/home-equity-estimator-calculator" },
          { label: "Debt recycling calculator", href: "/insights/wealth-creation-using-debt-recycling" },
        ]}
      />

      <CtaBand
        heading="A score is a start. A plan is the point."
        intro="Bring your result to a free, no-obligation discovery meeting and a licensed adviser will turn the flags into a sequence: what to fix first, and what it's worth."
        variant="discovery"
        subject="Wealth Health Check"
      />
    </main>
  );
}
