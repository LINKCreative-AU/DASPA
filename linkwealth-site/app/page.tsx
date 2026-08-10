/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, faqSchema } from "@/components/Schema";
import { SectionHead } from "@/components/SectionHead";
import { Section, FeatureGrid, ProofBar, FAQ } from "@/components/ServicePage";
import { Icon } from "@/components/Icons";
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
// SEO around it is optimised). Do not reword those blocks. Layout follows
// the V1.5 bones shared with the Advisors/Books/Marketing builds.

export const metadata: Metadata = {
  title: "Financial Advisor Brisbane | LINK Wealth Advisors",
  description:
    "LINK Wealth's Brisbane financial advisors help business owners and professionals turn hard work into lasting financial freedom. Tailored planning, investments, super and tax strategies. 5.0 Google rating from 36 reviews.",
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
    icon: <Icon.rocket />,
  },
  {
    title: "Financial independence & retirement planning.",
    body: "Get a detailed, step-by-step plan tailored to your timeline. We map out clear actions for today and tomorrow. So you’re set for 5, 10, or 20 years down the line.",
    href: "/retirement-planning",
    icon: <Icon.shieldCheck />,
  },
  {
    title: "Beyond the basics: diverse investments.",
    body: "Together, we’ll build a portfolio that matches your goals, not just market trends. Using assets like shares and property where it makes sense (and avoiding where it doesn’t) to give you a balanced, resilient financial foundation.",
    href: "/property-investment-advice",
    icon: <Icon.trendingUp />,
  },
  {
    title: "Professional support, whenever you need it.",
    body: "From insurance to lending, rental management, accounting, bookkeeping, marketing, and branding – the LINK ecosystem connects you with experts to elevate your business and personal life, all in one place.",
    href: "/family-wealth-management",
    icon: <Icon.users />,
  },
];

// Why work with us - verbatim.
const WHY = [
  {
    title: "30+ years experience.",
    body: "Backed by decades of expertise, you’ll have access to proven strategies and deep industry knowledge so you can make the best decisions for your financial future.",
    icon: <Icon.clock />,
  },
  {
    title: "Tailored advice.",
    body: "Generic, cookie-cutter solutions don’t cut it. With tailored advice for your specific situation, you get strategies built for you – your business, your lifestyle, your future.",
    icon: <Icon.clipboardCheck />,
  },
  {
    title: "Your true partner.",
    body: "Get expert guidance when you need it most with one-on-one collaboration an agile, responsive advisory team who adapts as your goals and circumstances evolve.",
    icon: <Icon.userPhone />,
  },
];

// WHAT'S INCLUDED - PROTECTED COPY. Carried verbatim from the old homepage,
// including "Profit to wealth transition." Do not edit the wording.
const INCLUDED = [
  {
    title: "Diverse investment strategy.",
    body: "Beyond shares – you’ll get recommendations that suit your objectives and help create a balanced, resilient portfolio.",
    icon: <Icon.trendingUp />,
  },
  {
    title: "Tax and cash flow optimisation.",
    body: "Strategies to reduce your tax burden legally, improve cash flow, and maximise the funds available to invest in your future.",
    icon: <Icon.dollar />,
  },
  {
    title: "Smart risk and asset protection.",
    body: "Clear risk management solutions and right-fit insurance to protect your growing wealth, family, and business (without upselling).",
    icon: <Icon.shieldCheck />,
  },
  {
    title: "Profit to wealth transition.",
    body: "Strategies to turn your business profits into personal wealth, ensuring your hard work builds financial security beyond your business.",
    icon: <Icon.bolt />,
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
    a: "Your first consultation is free and no-obligation. Our strategy workshops are $660 including GST, backed by LINK's Value Guarantee: if you don't walk away with clear, actionable insights, we refund you in full. Ongoing advice is quoted up front once we understand your situation. If you just want free general guidance first, the government's Moneysmart.gov.au is a good place to start, and our advice cost guide publishes the industry-wide fee ranges.",
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

      {/* HERO - verbatim copy, house treatment */}
      <section className="container-x grid items-center gap-12 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow guide-line-inline mb-6">
            <span className="text-wealth">Financial advisors · Brisbane</span>
          </p>
          <h1 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-6xl">
            Helping business owners and professionals grow their{" "}
            <span className="marker">personal wealth.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-[1.4] text-ink/80">
            Grinding away on your business but feeling like you’ve got nothing to show for it?
            Let’s fix that. With expert advice and a financial strategy tailor-made for you
            and your goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/contact" className="btn btn-primary">
              Book a call
            </a>
            <a href={SITE.phoneHref} className="btn btn-ghost">
              Call {SITE.phone}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {[
              [<Icon.star key="i" className="h-4 w-4" />, `${SITE.reviews.rating.toFixed(1)} · ${SITE.reviews.count} Google reviews`],
              [<Icon.shieldCheck key="i" className="h-4 w-4" />, "Licensed financial advisers"],
              [<Icon.pin key="i" className="h-4 w-4" />, "Fortitude Valley, Brisbane"],
            ].map(([icon, label]) => (
              <span
                key={String(label)}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink/70"
              >
                <span className="text-wealth">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:block">
          <img
            src="/wp-content/uploads/2026/06/Wealth-PJ-and-Richard-NEW-scaled.jpg"
            alt="LINK Wealth financial advisors Richard Leal and PJ Byrne in Brisbane"
            className="aspect-[4/5] w-full rounded-3xl object-cover"
            fetchPriority="high"
          />
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white px-5 py-4 shadow-lg">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
              <span className="text-wealth">
                <Icon.star className="h-5 w-5" />
              </span>
              Google rating {SITE.reviews.rating.toFixed(1)}
            </p>
            <p className="mt-0.5 pl-7 text-xs font-semibold text-ink/50">
              Based on {SITE.reviews.count} reviews
            </p>
          </div>
        </div>
      </section>

      <ProofBar />

      {/* INTRO - verbatim copy */}
      <section className="py-20">
        <div className="container-x max-w-4xl">
          <SectionHead
            eyebrow="Financial planning, Brisbane"
            title="Turn your hard work into lasting financial freedom."
            mark="lasting financial freedom."
          />
          <div className="mt-8 space-y-4 text-lg leading-[1.4] text-ink/80">
            <p>
              Building wealth isn’t just for those with millions in the bank. It’s achievable,
              even if you’re just starting out. But you need more than a one-size-fits-all
              plan. <strong className="text-ink">And that’s why you feel stuck.</strong>
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
          <a href="/contact" className="btn btn-primary mt-8">
            Book a call
          </a>
        </div>
      </section>

      {/* OUR SERVICES - verbatim copy, house router cards */}
      <Section
        tint
       
        title="How we grow and protect your wealth."
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="group rounded-3xl border border-ink/10 bg-white p-7 transition hover:-translate-y-0.5 hover:border-wealth/40 hover:shadow-[0_12px_32px_-16px_rgba(31,158,132,0.35)]"
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wealth/10 text-wealth transition group-hover:bg-wealth group-hover:text-white">
                {s.icon}
              </span>
              <h3 className="font-display text-lg font-bold tracking-tight text-ink transition group-hover:text-wealth">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.body}</p>
              <p className="mt-4 text-sm font-semibold text-wealth opacity-0 transition group-hover:opacity-100">
                Explore →
              </p>
            </a>
          ))}
        </div>
      </Section>

      {/* WHY WORK WITH US - verbatim copy */}
      <Section title="Why work with us?">
        <FeatureGrid items={WHY} />
      </Section>

      {/* WHAT'S INCLUDED - protected copy, house dark section */}
      <Section
        dark
       
        title="A clear master plan to get you where you want to be."
      >
        <FeatureGrid items={INCLUDED} cols={2} dark cards />
      </Section>

      <TeamGrid members={TEAM} />

      <Testimonials />

      {/* INSIGHTS */}
      <Section
        title="Insights from the team."
        intro="Plain-English guides on debt recycling, super, property and building wealth in Australia."
      >
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => {
            const img = postImage(p);
            return (
              <a key={p.urlPath} href={p.urlPath} className="group block">
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
                <p className="eyebrow mb-2">
                  <span className="text-wealth">
                    {p.category === "case-studies" ? "Case study" : "Insights"}
                  </span>
                </p>
                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink transition group-hover:text-wealth">
                  {p.title}
                </h3>
              </a>
            );
          })}
        </div>
        <a
          href="/insights"
          className="mt-8 inline-block text-sm font-semibold text-wealth underline decoration-wealth/30 underline-offset-4 hover:decoration-wealth"
        >
          All insights →
        </a>
      </Section>

      {/* FAQs (visible text and schema kept in sync - never let them drift) */}
      <FAQ
        faqs={FAQS}
        related={[
          { label: "What financial advice costs", href: "/how-much-does-a-financial-advisor-cost" },
          { label: "Free wealth health check", href: "/wealth-health-check" },
          { label: "Case studies", href: "/case-studies" },
        ]}
      />

      {/* GROUP */}
      <section className="border-t border-ink/10 py-20">
        <div className="container-x">
          <SectionHead
            title="Wealth is just the start."
            intro={SITE.group.line}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_TEAMS.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-ink/10 p-6 transition hover:border-ink"
              >
                <span className="mb-4 block h-[3px] w-10" style={{ backgroundColor: t.color }} />
                <p className="font-display text-lg font-bold text-ink">LINK {t.name}</p>
                <p className="mt-1 text-sm text-ink/55">{t.meaning}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand subject="Homepage" />
    </main>
  );
}
