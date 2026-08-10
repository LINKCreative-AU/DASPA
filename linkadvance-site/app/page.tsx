/* eslint-disable @next/next/no-img-element */
import { JsonLd, firmSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { SectionHead } from "@/components/SectionHead";
import { FeatureGrid, CheckList, FAQ, ProcessSteps } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { LenderMarquee } from "@/components/LenderMarquee";
import { SITE, TEAM, GROUP_TEAMS } from "@/lib/site";

// The homepage: "mortgage broker brisbane" (1,710/mo, KD 24) is the head
// term; the map-pack lever is the 262-review base. Voice and facts carried
// from the old site (one broker end to end, 35+ lenders, know what the
// banks want), rebuilt answer-first on the V1.5 system.

const FAQS = [
  {
    q: "What does a mortgage broker cost?",
    a: "For standard home loans, nothing - the lender pays the broker a commission on settlement, which we disclose in full. You get the comparison across 35+ lenders, the negotiation and ongoing repricing without a fee.",
  },
  {
    q: "Is a broker better than going to my bank?",
    a: "Your bank can only offer its own products, assessed under its own policy. A broker compares 35+ lenders - including your bank - and knows which credit teams suit your situation before anything is submitted. Same loan, more competition for it.",
  },
  {
    q: "How long does approval take?",
    a: "Pre-approval typically runs a few days to two weeks; formal approval after signing a contract usually one to three weeks. Lender turnaround varies constantly - part of the job is knowing who's fast this month.",
  },
  {
    q: "Do you only do home loans?",
    a: "No - home loans are the core, but the desk covers refinancing, investment lending, construction, SMSF loans, business lending and car/equipment finance. One broker, whichever lane you're in.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          firmSchema(),
          faqSchema(FAQS),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
        ]}
      />

      {/* Hero - text left, team cutout on the grey panel right (the full-width
          band gave the image too much real estate; James, 9 Aug) */}
      <section className="container-x pb-16 pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="text-advance">Brisbane finance brokers</span>
          </p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-[1.05] tracking-tight text-ink sm:text-6xl">
            We make lending <span className="marker">easy.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/65">
            Work with experienced mortgage brokers who partner with you to get the outcome you
            want - one broker through the entire journey, from the initial coffee to approval,
            settlement, and every repricing after. Your goals are priority number one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-primary">
              Talk to a broker - free
            </a>
            <a href="/home-loan-health-check" className="btn btn-ghost">
              Check your current loan
            </a>
          </div>
          <p className="mt-6 text-sm font-semibold text-ink/60">
            <span aria-hidden className="text-advance">★★★★★</span> {SITE.reviews.rating.toFixed(1)} from{" "}
            {SITE.reviews.count} Google reviews · 35+ lenders · one broker end to end
          </p>
        </div>
        <div className="flex items-end justify-center rounded-3xl bg-neutral-50 px-6 pt-8 lg:self-stretch">
          <img
            src="/wp-content/uploads/2023/01/hugh.jpg"
            alt="Hugh, co-founder of LINK Advance"
            className="max-h-[440px] w-auto mix-blend-multiply"
          />
        </div>
        </div>
      </section>

      {/* Why - the old site's three proofs, tightened */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <SectionHead
            title="Why borrowers choose us for the loan or the refinance."
            mark="the loan or the refinance."
          />
          <FeatureGrid
            items={[
              {
                title: "Highly rated.",
                body: `${SITE.reviews.count} five-star Google reviews from clients helped through the loan process. We work to make every client our biggest advocate - read them unedited below.`,
              },
              {
                title: "Direct access to 35+ lenders.",
                body: "You don't have to go with the big four. With 35+ lenders competing, the loan gets shaped around what you're after - and the pricing gets sharp.",
              },
              {
                title: "Know what the banks want.",
                body: "Credit policies, assessment buffers, how applications are read - your file goes to lenders matched to your situation, with the issues cleared before submission.",
              },
            ]}
          />
        </div>
      </section>

      {/* Two doors - personal vs commercial */}
      <section className="container-x pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="/home-loans-brisbane" className="group rounded-3xl bg-ink p-8 text-white transition hover:opacity-95">
            <p className="font-display text-2xl font-bold tracking-tight">
              For you<span className="text-advance-bright">.</span>
            </p>
            <p className="mt-2 text-white/70">
              Home loans, first home, refinancing, investment - the personal side of the desk.
            </p>
            <p className="mt-5 text-sm font-semibold text-advance-bright">Personal lending →</p>
          </a>
          <a href="/commercial-lending" className="group rounded-3xl border-2 border-ink bg-white p-8 transition hover:bg-neutral-50">
            <p className="font-display text-2xl font-bold tracking-tight text-ink">
              For your business<span className="text-advance">.</span>
            </p>
            <p className="mt-2 text-ink/65">
              Premises, working capital, acquisitions, development - commercial is Jacob's desk.
            </p>
            <p className="mt-5 text-sm font-semibold text-advance">Commercial lending →</p>
          </a>
        </div>
      </section>

      {/* The panel of lenders - all 31 logos from the old site, scrolling */}
      <section className="py-14">
        <div className="container-x">
          <p className="eyebrow justify-center">
            <span>Our panel of lenders</span>
          </p>
        </div>
        <LenderMarquee />
      </section>

      {/* The lanes */}
      <section className="py-20">
        <div className="container-x">
          <SectionHead
            title="Whatever the loan, one broker owns it."
            mark="one broker owns it."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Home loans", href: "/home-loans-brisbane", note: "The big one, done properly" },
              { label: "First home buyers", href: "/first-home-buyers-loan", note: "5% deposit paths + the $30k grant" },
              { label: "Refinancing", href: "/refinancing-brisbane", note: "Or we make your lender price-match" },
              { label: "Investment loans", href: "/investment-home-loans", note: "Structure for the portfolio" },
              { label: "Construction loans", href: "/construction-loans-brisbane", note: "Staged like the build" },
              { label: "SMSF loans", href: "/smsf-mortgage-broker", note: "Property inside super, incl. your premises" },
              { label: "Business loans", href: "/business-loans", note: "Growth, cash flow, acquisition" },
              { label: "Car & equipment", href: "/business-car-and-equipment-loans", note: "Often approved in days" },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink"
              >
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  {s.label}
                  <span className="text-advance">.</span>
                </p>
                <p className="mt-1.5 text-sm text-ink/55">{s.note}</p>
                <p className="mt-4 text-sm font-semibold text-ink/40 transition group-hover:text-ink">
                  Learn more →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The journey - the old site's process pages, surfaced */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <SectionHead
            title="From first coffee to settled, with one person."
            mark="with one person."
          />
          <ProcessSteps
            steps={[
              { title: "Chat", body: "A free conversation about what you're planning - deposit, income, timeframe, and what's realistic." },
              { title: "Numbers", body: "Borrowing power, repayments, grants and the lender shortlist - your options in real dollars." },
              { title: "Approval", body: "The application prepared the way credit teams read it, submitted to the right lender, chased daily." },
              { title: "Settled + repriced", body: "We drive settlement with your solicitor and agent - then reprice your rate every year after." },
            ]}
          />
        </div>
      </section>

      {/* The brokers */}
      <TeamGrid members={TEAM} />

      <Testimonials />

      {/* Tools strip */}
      <section className="py-20">
        <div className="container-x">
          <SectionHead
            title="Run your own numbers first."
            mark="your own numbers"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Home loan health check", href: "/home-loan-health-check", note: "Score your current loan in 2 minutes" },
              { label: "Borrowing power estimator", href: "/borrowing-power-calculator", note: "What lenders are likely to lend you" },
              { label: "Repayments + LMI", href: "/home-loan-repayment-calculator", note: "What it costs per month, stress-tested" },
              { label: "Stamp duty QLD", href: "/stamp-duty-calculator-qld", note: "Duty + first-home concessions" },
            ].map((t) => (
              <a key={t.href} href={t.href} className="group rounded-3xl border border-ink/10 border-t-4 border-t-advance bg-white p-6 transition hover:border-ink hover:border-t-advance">
                <p className="font-display text-lg font-bold tracking-tight text-ink">{t.label}</p>
                <p className="mt-1.5 text-sm text-ink/55">{t.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Group band */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <SectionHead
            title="The finance team at LINK."
            mark="at LINK."
            intro="One connected team when you want it, just the loan when you don't."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_TEAMS.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink">
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  {t.name}
                  <span style={{ color: t.color }}>.</span>
                </p>
                <p className="mt-1 text-sm text-ink/55">{t.meaning}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FAQ title="Straight answers first." faqs={FAQS} />

      <CtaBand />
    </main>
  );
}
