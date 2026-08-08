/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, faqSchema } from "@/components/Schema";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { SITE, TEAM, GROUP_TEAMS } from "@/lib/site";
import { getPosts, postImage } from "@/lib/posts";

// Homepage. Head term: "financial advisor brisbane" (1,400/mo, KD 0) with
// "wealth advisor" and "financial planner brisbane" secondary - carried in
// the title tag, intro copy and FAQs, never fought over by other pages.
//
// The hero, intro, OUR SERVICES, "Why work with us" and WHAT'S INCLUDED copy
// is carried VERBATIM from the old site (James, 2026-08-08: the crafted copy
// - especially "Profit to wealth transition" - stays word for word; only the
// SEO around it is optimised). Do not reword those blocks.

export const metadata: Metadata = {
  title: "Financial Advisor Brisbane | LINK Wealth Advisors",
  description:
    "LINK Wealth's Brisbane financial advisors help business owners and professionals turn hard work into lasting financial freedom. Tailored planning, investments, super and tax strategies. 5.0 Google rating from 35 reviews.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Financial Advisor Brisbane | LINK Wealth Advisors",
    description:
      "Helping business owners and professionals grow their personal wealth with tailored financial advice.",
    url: "/",
  },
};

// OUR SERVICES - verbatim, now linking each pillar to its dedicated page.
const SERVICES = [
  {
    title: "A sole focus on business owners.",
    body: "60-hour weeks, reinvesting every dollar, relentlessly grinding to grow – we see you. With custom strategies and a plan for lasting growth, we help you turn business success into personal freedom.",
    href: "/business-owner-wealth-extraction-workshop-link-wealth",
    linkLabel: "Business owner wealth extraction workshop",
  },
  {
    title: "Financial independence & retirement planning.",
    body: "Get a detailed, step-by-step plan tailored to your timeline. We map out clear actions for today and tomorrow. So you’re set for 5, 10, or 20 years down the line.",
    href: "/retirement-planning",
    linkLabel: "Retirement planning",
  },
  {
    title: "Beyond the basics: diverse investments.",
    body: "Together, we’ll build a portfolio that matches your goals, not just market trends. Using assets like shares and property where it makes sense (and avoiding where it doesn’t) to give you a balanced, resilient financial foundation.",
    href: "/property-investment-advice",
    linkLabel: "Property investment advice",
  },
  {
    title: "Professional support, whenever you need it.",
    body: "From insurance to lending, rental management, accounting, bookkeeping, marketing, and branding – the LINK ecosystem connects you with experts to elevate your business and personal life, all in one place.",
    href: "/family-wealth-management",
    linkLabel: "Family wealth management",
  },
];

// Why work with us - verbatim.
const WHY = [
  {
    title: "30+ years experience.",
    body: "Backed by decades of expertise, you’ll have access to proven strategies and deep industry knowledge so you can make the best decisions for your financial future.",
  },
  {
    title: "Tailored advice.",
    body: "Generic, cookie-cutter solutions don’t cut it. With tailored advice for your specific situation, you get strategies built for you – your business, your lifestyle, your future.",
  },
  {
    title: "Your true partner.",
    body: "Get expert guidance when you need it most with one-on-one collaboration an agile, responsive advisory team who adapts as your goals and circumstances evolve.",
  },
];

// WHAT'S INCLUDED - PROTECTED COPY. Carried verbatim from the old homepage,
// including "Profit to wealth transition." Do not edit the wording.
const INCLUDED = [
  {
    title: "Diverse investment strategy.",
    body: "Beyond shares – you’ll get recommendations that suit your objectives and help create a balanced, resilient portfolio.",
  },
  {
    title: "Tax and cash flow optimisation.",
    body: "Strategies to reduce your tax burden legally, improve cash flow, and maximise the funds available to invest in your future.",
  },
  {
    title: "Smart risk and asset protection.",
    body: "Clear risk management solutions and right-fit insurance to protect your growing wealth, family, and business (without upselling).",
  },
  {
    title: "Profit to wealth transition.",
    body: "Strategies to turn your business profits into personal wealth, ensuring your hard work builds financial security beyond your business.",
  },
];

const FAQS = [
  {
    q: "Where is LINK Wealth based?",
    a: "Our financial advisors are based at Level 1, 57 Berwick Street, Fortitude Valley in Brisbane, and we work with clients across Australia in person and online.",
  },
  {
    q: "Who do you help?",
    a: "We specialise in business owners and professionals who want to turn business success and strong incomes into personal wealth: retirement planning, investments, superannuation and SMSFs, property, tax-effective structures and personal insurance.",
  },
  {
    q: "How much does financial advice cost?",
    a: "Your first consultation is free and no-obligation. Our strategy workshops are $660 including GST, backed by LINK's Value Guarantee: if you don't walk away with clear, actionable insights, we refund you in full. Ongoing advice is quoted up front once we understand your situation.",
  },
  {
    q: "Are you licensed?",
    a: "Yes. Richard Leal (AR 327265) and Link Wealth Pty Ltd (CAR 1312767) are authorised representatives of Millennium 3 Financial Services Pty Ltd (ABN 61 094 529 987), AFSL 244252.",
  },
];

export default function Home() {
  const latest = getPosts().slice(0, 3);
  return (
    <main>
      <JsonLd data={faqSchema(FAQS)} />

      {/* Hero - verbatim copy */}
      <section className="wealth-gradient">
        <div className="container-x grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="text-white">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              Helping business owners and professionals grow their{" "}
              <span className="text-wealth">personal wealth.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              Grinding away on your business but feeling like you’ve got nothing to show for
              it? Let’s fix that. With expert advice and a financial strategy tailor-made for
              you and your goals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/contact" className="btn btn-mint">
                Book a call
              </a>
              <a href={SITE.phoneHref} className="btn border border-white/30 text-white hover:border-white">
                {SITE.phone}
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Google rating {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count}{" "}
              reviews · Fortitude Valley, Brisbane
            </p>
          </div>
          <img
            src="/wp-content/uploads/2026/06/Wealth-PJ-and-Richard-NEW-scaled.jpg"
            alt="LINK Wealth financial advisors Richard Leal and PJ Byrne in Brisbane"
            className="hidden aspect-[4/3] w-full rounded-3xl object-cover lg:block"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Intro - verbatim copy */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <span className="eyebrow text-wealth-dark">Financial planning, Brisbane</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Turn your hard work into <span className="marker">lasting financial freedom.</span>
          </h2>
          <div className="mt-6 space-y-4 text-lg text-ink/70">
            <p>
              Building wealth isn’t just for those with millions in the bank. It’s achievable,
              even if you’re just starting out. But you need more than a one-size-fits-all
              plan. <strong>And that’s why you feel stuck.</strong>
            </p>
            <p>
              Information on the internet can only get you so far and, the truth is, some
              financial planners will only take you seriously if you’re already sitting on a
              mountain of cash.
            </p>
            <p>
              But we’ve got the missing link to your financial success: a clear, personalised
              roadmap that grows with you. With a combination of smart investments, insurance,
              tax strategies, and diverse assets (including property), you can build and
              maintain your wealth long-term.
            </p>
            <p className="font-semibold text-ink">
              The earlier you start, the more wealth you accumulate. It’s as simple as that.
              What are you waiting for?
            </p>
          </div>
          <a href="/contact" className="btn btn-wealth mt-8">
            Book a call
          </a>
        </div>
      </section>

      {/* Our services - verbatim copy, now routing to the dedicated pages */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x">
          <span className="eyebrow text-wealth-dark">Our services</span>
          <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            How we grow and protect your wealth.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="group rounded-xl2 border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:border-wealth-mid hover:shadow-[0_12px_32px_-16px_rgba(32,67,71,0.35)]"
              >
                <h3 className="font-display text-xl font-bold tracking-tight text-ink transition group-hover:text-wealth-dark">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{s.body}</p>
                <p className="mt-4 text-sm font-semibold text-wealth-dark opacity-0 transition group-hover:opacity-100">
                  {s.linkLabel} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why work with us - verbatim copy */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Why work with us?
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="border-t-2 border-wealth pt-5">
                <h3 className="font-display text-xl font-bold text-ink">{w.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED - protected copy, verbatim */}
      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="container-x">
          <span className="eyebrow !border-white/50 !text-white/70">What’s included?</span>
          <h2 className="mt-6 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            A clear master plan to get you <span className="text-wealth">where you want to be.</span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {INCLUDED.map((s) => (
              <div key={s.title} className="rounded-xl2 border border-white/10 bg-white/5 p-7">
                <h3 className="font-display text-xl font-bold tracking-tight text-wealth">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamGrid members={TEAM} />

      <Testimonials />

      {/* Latest insights */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Insights from the team.
            </h2>
            <a
              href="/insights"
              className="text-sm font-semibold text-wealth-dark underline decoration-wealth underline-offset-4 hover:decoration-wealth-dark"
            >
              All insights →
            </a>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latest.map((p) => {
              const img = postImage(p);
              return (
                <a key={p.urlPath} href={p.urlPath} className="group">
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="mb-4 aspect-[3/2] w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="wealth-gradient mb-4 aspect-[3/2] w-full rounded-2xl" />
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wider text-wealth-dark">
                    {p.category === "case-studies" ? "Case study" : "Insights"}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-ink transition group-hover:text-wealth-dark">
                    {p.title}
                  </h3>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs (visible text and schema kept in sync - never let them drift) */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Your questions, answered.
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

      {/* The LINK group strip */}
      <section className="py-14">
        <div className="container-x">
          <p className="text-sm font-semibold text-ink/50">
            {SITE.group.line}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {GROUP_TEAMS.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-ink/70 transition hover:text-ink"
              >
                LINK <span style={{ color: t.color }}>{t.name}</span>
                <span className="ml-2 font-normal text-ink/45">{t.meaning}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand subject="Homepage" />
    </main>
  );
}
