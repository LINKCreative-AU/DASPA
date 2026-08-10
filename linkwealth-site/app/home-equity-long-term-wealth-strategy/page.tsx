/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { PageHero, Section, FeatureGrid, CheckList, FAQ } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { Pill } from "@/components/v2";

// The LINK Equity Strategy Workshop. Body copy carried verbatim from the
// live page. SEO targets the "using equity to buy investment property" /
// "how to use home equity" cluster (~420/mo combined). V1.5 bones.

const PATH = "/home-equity-long-term-wealth-strategy";
const DESC =
  "Discover how to make your property and cash work harder — whether through shares, investment property, or a blended debt-recycling approach.";

export const metadata: Metadata = {
  title: { absolute: "Using Home Equity to Build Wealth | LINK Equity Strategy Workshop" },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Use your home’s equity to build wealth.",
    description: DESC,
    url: PATH,
  },
};

const SESSION = [
  "Map your current property and loan structures",
  "Model how your equity could be redeployed into shares, an investment property, managed portfolios or a combination of these",
  "Assess the tax efficiency of your structures (family trust, bucket company, investment bond, SMSF, etc.)",
  "Identify opportunities for debt recycling and long-term wealth creation specific to your personal circumstances",
  "Show you how to balance growth, cash flow, and lifestyle objectives",
];

const WHO = [
  "Homeowners with available equity who want to build wealth without over-stretching",
  "Property investors looking to diversify or optimise their structure",
  "Professionals or business owners seeking smarter, tax-effective ways to grow wealth",
  "Anyone who wants clarity on how to make their money and property work together",
];

const LEAVE = [
  "A clear understanding of your equity position and options",
  "Guidance on the best next steps — whether through property, shares, or both",
  "Confidence to make informed, tax-efficient decisions",
];

const WHY = [
  {
    title: "Experience that counts.",
    body: "Benefit from decades of hands-on knowledge across property, lending, tax and wealth strategy.",
  },
  {
    title: "Tailored advice.",
    body: "One-size-fits-all strategies don’t deliver real results. We take the time to understand your unique goals, crafting a personalised plan to make your home equity work for your lifestyle and long-term goals.",
  },
  {
    title: "Guidance that adapts.",
    body: "Your strategy evolves as your goals, family and finances change — and we’re here to keep you on the right path.",
  },
];

// The live page's "Wondering How It Works?" questions, verbatim.
const FAQS = [
  { q: "How long does it take?", a: "Set aside 90 minutes." },
  {
    q: "Where is the workshop held?",
    a: "We can do the workshop in person at our Fortitude Valley office or in an online meeting. We’ve got free parking and great coffee if you’d like to visit us in person.",
  },
  {
    q: "Is this personal advice?",
    a: "The workshop uses your information to model general strategies and scenarios relevant to your situation, but it’s general advice only. The purpose of the workshop isn’t to deliver a financial strategy that’s ready to implement, but to help you decide on the strategy direction you’re most comfortable pursuing. If, at that point, you’d like to proceed with advice to prepare a fully actionable financial plan, you can then choose to engage us for personal advice.",
  },
  {
    q: "What preparation do I need to do?",
    a: "In booking the workshop, we’ll provide you with a simple fact finding form which will take you approximately 15 minutes to complete. We need this at least 2 days prior so we can prepare the modelling for the workshop.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          workshopSchema({
            name: "LINK Equity Strategy Workshop",
            description: DESC,
            path: PATH,
            price: 660,
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Equity Strategy Workshop", path: PATH },
          ]),
        ]}
      />

      {/* Hero - verbatim copy */}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Equity Strategy Workshop", path: PATH },
        ]}
        eyebrow="Long term wealth strategy"
        title="Turn Your Home Equity into a Long-Term Wealth Strategy."
        mark="Long-Term Wealth Strategy."
        intro="Discover how to make your property and cash work harder — whether through shares, investment property, or a blended debt-recycling approach."
        ctaLabel="Enquire Now to Secure Your $660 Workshop"
        ctaHref="#contact"
        showStars={false}
      >
        <div className="mt-6 max-w-xl">
          <p className="font-semibold text-ink">It starts with a simple conversation</p>
          <CheckList
            items={[
              "Talk with a licensed financial adviser about how to make the most of your home equity",
              "See if you’re on track and explore the steps to unlock your property wealth",
            ]}
          />
          <p className="mt-5 text-sm text-ink/55">
            Backed by LINK’s Value Guarantee — if you don’t walk away with clear, actionable
            insights, we’ll refund you in full.
          </p>
          <p className="mt-3 text-sm text-ink/55">
            Not sure of your equity position? Start with our free{" "}
            <a
              href="/home-equity-estimator-calculator"
              className="font-semibold text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth"
            >
              home equity calculator
            </a>
            .
          </p>
        </div>
      </PageHero>

      <div className="container-x pb-14">
        <img
          src="/wp-content/uploads/2024/12/AdobeStock_599893056-1-min-scaled.jpeg"
          alt="A couple exploring investment property options for their home equity"
          loading="lazy"
          className="aspect-[21/8] w-full rounded-[25px] object-cover"
        />
      </div>

      {/* What is the workshop / who - verbatim */}
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What is the LINK Equity Strategy Workshop?
            </h2>
            <p className="mt-5 text-ink/65">
              Your LINK Equity Strategy Workshop will be a 90-minute, hands-on planning session
              designed to help you understand how to make your existing equity, cash flow and
              investment opportunities work in harmony.
            </p>
            <p className="mt-4 text-ink/65">During this session, we will:</p>
            <CheckList items={SESSION} />
            <p className="mt-6 text-ink/65">
              This is not a sales pitch — it’s a collaborative session built to give you
              clarity, structure, and confidence in your next financial steps.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Who is This Workshop For?
            </h2>
            <CheckList items={WHO} />
            <div className="mt-8 rounded-[25px] bg-ink p-8 text-white">
              <p className="font-display text-xl font-bold tracking-tight">
                In 90 minutes, align your equity, cash flow, and investments for growth.
              </p>
              <p className="mt-3 text-white/65">What’s stopping you from starting today?</p>
              <div className="mt-6">
                <Pill href="#contact" variant="onDark">
                  Talk to Richard to see if a workshop is right for you
                </Pill>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose LINK - verbatim */}
      <section className="py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Why Choose LINK?
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              At LINK, our wealth director Richard specialises in integrated financial
              strategies that connect property, tax, investments and superannuation.
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Our big-picture approach helps clients move beyond one-off transactions — giving
              them the structure and insight to make strategic, long-term decisions with
              confidence.
            </p>
            <p className="mt-6 font-semibold text-ink">You’ll leave your workshop with:</p>
            <CheckList items={LEAVE} />
          </div>
          <FeatureGrid items={WHY} />
        </div>
      </section>

      <Testimonials />

      {/* Investment - verbatim, house dark panel */}
      <section className="container-x py-20">
        <div className="rounded-[25px] bg-ink p-10 text-white sm:p-14">
          <p className="eyebrow guide-line-inline mb-4">
            <span className="text-white/60">Your Investment</span>
          </p>
          <h2 className="max-w-2xl font-display text-[34px] font-normal leading-[1.15] tracking-tight sm:text-[44px]">
            Book your LINK Equity Strategy Workshop for $660 (inc. GST).
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Your workshop is backed by LINK’s 100% Value Guarantee. If you don’t walk away
            satisfied, with insights and direction we’ll refund it — no questions asked.
          </p>
          <p className="mt-6 font-display text-lg font-bold text-white">
            Ready to Explore What’s Possible?
          </p>
          <p className="mt-2 max-w-xl text-white/70">
            Take the first step toward making your equity work smarter. We’ll reach out to
            arrange your LINK Equity Strategy Workshop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Pill href="#contact" variant="onDark">
              Talk to Richard to see if a workshop is right for you
            </Pill>
          </div>
          <p className="mt-4 text-sm text-white/55">No obligation. No lock-in. Just clarity.</p>
        </div>
      </section>

      {/* Common questions - verbatim */}
      <FAQ title="Wondering How It Works?" faqs={FAQS} />

      {/* Get advice from Richard - verbatim */}
      <section className="pb-20">
        <div className="container-x grid max-w-3xl items-center gap-8 sm:grid-cols-[auto_1fr]">
          <img
            src="/wp-content/uploads/2026/06/Richard-Wealth-1024-x-1024-Grey-Square-768x768.jpg"
            alt="Richard Leal, Managing Director at LINK Wealth"
            className="w-40 rounded-2xl object-cover sm:w-48"
          />
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink">
              Get advice from Richard.
            </h2>
            <p className="mt-2 text-sm font-semibold text-ink/55">
              Richard Leal · Managing Director
            </p>
            <p className="mt-3 text-ink/65">
              Have a quick call with Richard to confirm the LINK Equity Workshop is right for
              you. This call is obligation free.
            </p>
            <div className="mt-5">
              <Pill href="#contact">Book a call</Pill>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        variant="discovery"
        subject="Equity Strategy Workshop"
        formTitle="Enquire now to secure your workshop"
      />
    </main>
  );
}
