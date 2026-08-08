/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";

// The LINK Equity Strategy Workshop. Body copy carried verbatim from the
// live page. SEO targets the "using equity to buy investment property" /
// "how to use home equity" cluster (~420/mo combined) - the old title
// ("Use your home's equity to build wealth.") is kept as the on-page H1
// and the title tag now leads with the searched phrase.

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
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Equity Strategy Workshop", path: PATH },
        ]}
      />

      {/* Hero - verbatim */}
      <section className="container-x max-w-4xl py-14 sm:py-20">
        <span className="eyebrow text-wealth-dark">Long term wealth strategy</span>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Turn Your Home Equity into a <span className="marker">Long-Term Wealth Strategy</span>
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          Discover how to make your property and cash work harder — whether through shares,
          investment property, or a blended debt-recycling approach.
        </p>
        <div className="mt-6 rounded-xl2 border border-line bg-cloud p-6">
          <p className="font-semibold text-ink">It starts with a simple conversation</p>
          <ul className="mt-3 space-y-2 text-ink/75">
            <li className="flex gap-3">
              <Check />
              Talk with a licensed financial adviser about how to make the most of your home
              equity
            </li>
            <li className="flex gap-3">
              <Check />
              See if you’re on track and explore the steps to unlock your property wealth
            </li>
          </ul>
        </div>
        <a href="#contact" className="btn btn-wealth mt-8">
          Enquire Now to Secure Your $660 Workshop
        </a>
        <p className="mt-5 text-sm text-ink/60">
          Backed by LINK’s Value Guarantee — if you don’t walk away with clear, actionable
          insights, we’ll refund you in full.
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Not sure of your equity position? Start with our free{" "}
          <a href="/home-equity-estimator-calculator" className="font-semibold text-wealth-dark underline decoration-wealth underline-offset-2">
            home equity calculator
          </a>
          .
        </p>
      </section>

      {/* What is the workshop - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              What is the LINK Equity Strategy Workshop?
            </h2>
            <p className="mt-4 text-ink/70">
              Your LINK Equity Strategy Workshop will be a 90-minute, hands-on planning session
              designed to help you understand how to make your existing equity, cash flow and
              investment opportunities work in harmony.
            </p>
            <p className="mt-4 text-ink/70">During this session, we will:</p>
            <ul className="mt-5 space-y-3">
              {SESSION.map((c) => (
                <li key={c} className="flex gap-3 text-ink/80">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-ink/70">
              This is not a sales pitch — it’s a collaborative session built to give you
              clarity, structure, and confidence in your next financial steps.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              Who is This Workshop For?
            </h2>
            <ul className="mt-5 space-y-3">
              {WHO.map((c) => (
                <li key={c} className="flex gap-3 text-ink/80">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl2 bg-wealth-dark p-7 text-white">
              <p className="font-display text-xl font-bold">
                In 90 minutes, align your equity, cash flow, and investments for growth.
              </p>
              <p className="mt-3 text-white/75">What’s stopping you from starting today?</p>
              <a href="#contact" className="btn btn-mint mt-5">
                Talk to Richard to see if a workshop is right for you
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose LINK - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="max-w-4xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              Why Choose LINK?
            </h2>
            <p className="mt-5 text-lg text-ink/70">
              At LINK, our wealth director Richard specialises in integrated financial
              strategies that connect property, tax, investments and superannuation.
            </p>
            <p className="mt-4 text-lg text-ink/70">
              Our big-picture approach helps clients move beyond one-off transactions — giving
              them the structure and insight to make strategic, long-term decisions with
              confidence.
            </p>
            <p className="mt-6 font-semibold text-ink">You’ll leave your workshop with:</p>
            <ul className="mt-4 space-y-3">
              {LEAVE.map((c) => (
                <li key={c} className="flex gap-3 text-ink/80">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="border-t-2 border-wealth pt-5">
                <h3 className="font-display text-xl font-bold text-ink">{w.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Investment - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl rounded-xl2 bg-ink p-10 text-white">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Your Investment:
          </h2>
          <p className="mt-4 text-lg text-white/85">
            Book your LINK Equity Strategy Workshop for <strong>$660 (inc. GST)</strong>
          </p>
          <p className="mt-3 text-white/70">
            Your workshop is backed by LINK’s 100% Value Guarantee. If you don’t walk away
            satisfied, with insights and direction we’ll refund it — no questions asked.
          </p>
          <p className="mt-6 font-display text-xl font-bold text-wealth">
            Ready to Explore What’s Possible?
          </p>
          <p className="mt-2 text-white/70">
            Take the first step toward making your equity work smarter. We’ll reach out to
            arrange your LINK Equity Strategy Workshop.
          </p>
          <a href="#contact" className="btn btn-mint mt-6">
            Talk to Richard to see if a workshop is right for you
          </a>
          <p className="mt-4 text-sm text-white/60">No obligation. No lock-in. Just clarity.</p>
        </div>
      </section>

      {/* Common questions - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <span className="eyebrow text-wealth-dark">Common questions</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            Wondering How It Works?
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl2 border border-line bg-white p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-bold text-ink marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Get advice from Richard - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid max-w-4xl items-center gap-8 sm:grid-cols-[auto_1fr]">
          <img
            src="/wp-content/uploads/2026/06/Richard-Wealth-1024-x-1024-Grey-Square-768x768.jpg"
            alt="Richard Leal, Managing Director at LINK Wealth"
            className="w-40 rounded-2xl object-cover sm:w-48"
          />
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              Get advice from Richard.
            </h2>
            <p className="mt-2 font-semibold text-ink/60">Richard Leal · Managing Director</p>
            <p className="mt-3 text-ink/70">
              Have a quick call with Richard to confirm the LINK Equity Workshop is right for
              you. This call is obligation free.
            </p>
            <a href="#contact" className="btn btn-wealth mt-5">
              Book a call
            </a>
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

function Check() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="mt-1 shrink-0 text-wealth-dark"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6 10 2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
