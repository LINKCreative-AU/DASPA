/* eslint-disable @next/next/no-img-element */
import { JsonLd, firmSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { SectionHead } from "@/components/SectionHead";
import { Icon } from "@/components/Icons";
import { FeatureGrid, CheckList, FAQ, ProcessSteps } from "@/components/ServicePage";
import { ReviewStrip } from "@/components/ReviewStrip";
import { CtaBand } from "@/components/CtaBand";
import { LenderMarquee } from "@/components/LenderMarquee";
import { LaneChooser } from "@/components/LaneChooser";
import { Specialists } from "@/components/Specialists";
import { SITE, GROUP_TEAMS } from "@/lib/site";
import { Pill, EyebrowPill } from "@/components/v2";

// The homepage: "mortgage broker brisbane" (1,710/mo, KD 24) is the head
// term; the map-pack lever is the 262-review base. Voice and facts carried
// from the old site (one broker end to end, 35+ lenders, know what the
// banks want), rebuilt answer-first on the V1.5 system.

const FAQS = [
  {
    q: "What does a mortgage broker cost?",
    a: "For standard home loans, nothing. The lender pays the broker a commission on settlement, which we disclose in full. You get the comparison across 35+ lenders, the negotiation and ongoing repricing without a fee.",
  },
  {
    q: "Is it worth paying a mortgage broker?",
    a: "For a home loan you don't pay one, so the question is really whether the service is worth using: a comparison across 35+ lenders, an application prepared the way credit teams read it, negotiation with walk-away leverage, and a repricing call every year after settlement. For complex commercial work where a fee can apply, it's quoted in writing before anything starts.",
  },
  {
    q: "Is a broker better than going to my bank?",
    a: "Your bank can only offer its own products, assessed under its own policy. A broker compares 35+ lenders (including your bank) and knows which credit teams suit your situation before anything is submitted. Same loan, more competition for it.",
  },
  {
    q: "What is the downside of using a mortgage broker?",
    a: "Two honest ones. A handful of lenders only deal direct, so no broker panel covers absolutely everything. And a bad broker can chase the easiest commission rather than the best loan: the law counters this (brokers owe you a Best Interests Duty; banks owe you nothing of the kind) and so does disclosure, so ask any broker how many lenders they accredit with and exactly how they're paid. We'll answer both before you ask.",
  },
  {
    q: "Can you help if the bank said no?",
    a: "Often, yes. A decline is one lender's policy, not a verdict: another lender can read the same file differently on income type, casual employment, credit history or property type. We start with why it was declined, then match the file to lenders whose policy actually fits, including guarantor, low-doc and specialist options where they make sense.",
  },
  {
    q: "How long does approval take?",
    a: "Pre-approval typically runs a few days to two weeks; formal approval after signing a contract usually one to three weeks. Lender turnaround varies constantly. Part of the job is knowing who's fast this month.",
  },
  {
    q: "Do I have to come into the office?",
    a: "No. Most clients run the whole process by phone, email and video, and loans settle Australia-wide. If you'd rather sit down over a coffee, the office is at Level 1, 57 Berwick Street, Fortitude Valley, with free parking.",
  },
  {
    q: "Do you only do home loans?",
    a: "No. Home loans are the core, but the desk covers refinancing, investment lending, construction, SMSF loans, business lending and car/equipment finance. One broker, whichever lane you're in.",
  },
];

// The three guides surfaced on the homepage: the post that ranks #1, the
// broker-vs-bank piece (KD 0 term) and rentvesting.
const GUIDES = [
  {
    href: "/blog/home-loans/mortgage-broker-vs-bank",
    title: "Mortgage broker vs bank: who actually gets you the better loan?",
    note: "Whose interest each one legally serves, how the pricing really works, and when the bank is the right answer.",
  },
  {
    href: "/blog/home-loans/refinancing-your-home-loan-after-separation-or-divorce",
    title: "Refinancing your home loan after separation or divorce",
    note: "Keeping the house, releasing a name from the loan, and the order to do it in.",
  },
  {
    href: "/blog/investor-loans/rentvesting-explained",
    title: "Rentvesting: live where you love, buy where the numbers work",
    note: "The strategy for buying an investment first when your own suburb is out of reach.",
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
          <EyebrowPill tint>Brisbane finance brokers</EyebrowPill>
          <h1 className="mt-5 font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-[58px]">
            Your broker for <span className="marker">life.</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-[1.4] text-ink sm:text-[22px] sm:leading-[31px]">
            The same person from your first call to settlement, and a look at your loan every
            year after it, without you having to ask. We put 35+ lenders in competition for your
            loan, and on almost all home lending it costs you nothing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Pill href="#contact">Talk to a broker</Pill>
            <Pill href="/home-loan-health-check" variant="ghost">
              Check your current loan
            </Pill>
          </div>
          <p className="mt-6 text-sm font-semibold text-ink/60">
            <span aria-hidden className="text-advance">★★★★★</span> {SITE.reviews.rating.toFixed(1)} from{" "}
            {SITE.reviews.count} Google reviews · 35+ lenders · one broker end to end
          </p>
        </div>
        <div className="flex items-end justify-center rounded-[25px] bg-[#f1f1f1] px-6 pt-8 lg:self-stretch">
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
                body: `${SITE.reviews.count} five-star Google reviews from clients helped through the loan process. We work to make every client our biggest advocate. Read them unedited below.`,
              },
              {
                title: "Direct access to 35+ lenders.",
                body: "You don't have to go with the big four. With 35+ lenders competing, the loan gets shaped around what you're after, and the pricing gets sharp.",
              },
              {
                title: "Know what the banks want.",
                body: "Credit policies, assessment buffers, how applications are read: your file goes to lenders matched to your situation, with the issues cleared before submission.",
              },
              {
                // James, 11 Aug: the one nobody else claims. Getting the loan
                // is the transaction; keeping it sharp is the relationship.
                // Headline was "We keep you on the best rate" - see the note in
                // lib/loans.ts on why it changed and why this version is better.
                title: "We don't let your rate drift.",
                body: "Settlement isn't the finish line. Every year we review your loan against the market and go back to your lender when it has moved, so the sharp rate you signed doesn't quietly become an average one. Most clients get repriced without ever having to ask.",
              },
            ]}
            cols={4}
          />
        </div>
      </section>

      {/* The lender panel: white, headed properly, logos at real size.
          James, 10 Aug: the grey band made it look small and incidental. */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Direct access to 35+ lenders, <span className="marker">not just the big four.</span>
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              Majors, second-tier banks, credit unions and specialist lenders, all on the
              panel. When they compete for your loan, the pricing gets sharp and the policy
              gets flexible. Your bank can only ever offer you its own.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <LenderMarquee />
        </div>
      </section>

      {/* What are you here for: personal or commercial. Both grids stay in
          the DOM (hidden, not unmounted) so every lane link is crawlable. */}
      <section className="border-y border-ink/10 bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHead
            title="Whatever the loan, one broker owns it."
            mark="one broker owns it."
            intro="Two very different conversations, so pick your side and we'll show you the right desk."
          />
          <div className="mt-10">
            <LaneChooser />
          </div>
        </div>
      </section>

      {/* First home - the division's proven strength gets its own band
          instead of one card among eight */}
      <section className="py-20">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_2.15fr]">
            <div>
              <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
                First home in Queensland: the money on the table.
              </h2>
              <p className="mt-4 text-ink/65">
                Three government schemes stack for Queensland first home buyers right now, and
                most people we meet are only using one of them.
              </p>
              <div className="mt-6 flex items-center gap-4 rounded-[25px] bg-[#f1f1f1] p-4">
                <img
                  src="/wp-content/uploads/2026/05/Callum-Advance-1024x1024-LinkedIn-Grey-Square.png"
                  alt="Callum, mortgage broker at LINK Advance"
                  className="h-16 w-16 rounded-2xl object-cover"
                  loading="lazy"
                />
                <p className="text-sm text-ink/65">
                  <span className="block font-semibold text-ink">Callum runs the first home desk.</span>
                  Five years both sides of the lending desk, and most of our first home reviews
                  name him.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  stat: "$30,000",
                  label: "The QLD First Home Owner Grant for new builds. Check your eligibility in two minutes.",
                  href: "/first-home-buyers-grant",
                  cta: "Run the eligibility check",
                },
                {
                  stat: "$0 duty",
                  label: "Queensland abolished stamp duty for first home buyers building or buying new, from May 2025.",
                  href: "/stamp-duty-calculator-qld#first-home",
                  cta: "See what you'd pay",
                },
                {
                  stat: "5% deposit",
                  label: "The First Home Guarantee: buy with 5% down and no lenders mortgage insurance.",
                  href: "/first-home-guarantee",
                  cta: "How the guarantee works",
                },
              ].map((c) => (
                <a key={c.href} href={c.href} className="group flex flex-col rounded-[25px] bg-advance-light/60 p-6 transition hover:bg-advance-light">
                  <p className="font-display text-3xl font-bold tracking-tight text-ink">{c.stat}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.label}</p>
                  <p className="mt-auto pt-4 text-sm font-semibold text-ink/50 transition group-hover:text-ink">
                    {c.cta} →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Specialists />

      {/* The journey - the old site's process pages, surfaced */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <SectionHead
            title="From first coffee to settled, with one person."
            mark="with one person."
          />
          <ProcessSteps
            steps={[
              { title: "Chat", body: "A free conversation about what you're planning: deposit, income, timeframe, and what's realistic." },
              { title: "Numbers", body: "Borrowing power, repayments, grants and the lender shortlist: your options in real dollars." },
              { title: "Approval", body: "The application prepared the way credit teams read it, submitted to the right lender, chased daily." },
              { title: "Settled + repriced", body: "We drive settlement with your solicitor and agent, then reprice your rate every year after." },
            ]}
          />
        </div>
      </section>

      {/* The brokers */}
      <ReviewStrip />

      {/* Three guides - freshness, blog equity, expertise beyond sales pages */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead title="Worth reading before you borrow." mark="before you borrow." />
            <a href="/blog" className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline">
              All articles →
            </a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GUIDES.map((g) => (
              <a key={g.href} href={g.href} className="group flex flex-col rounded-[25px] bg-[#f1f1f1] p-7 transition hover:bg-advance-light">
                <p className="font-display text-lg font-bold leading-snug tracking-tight text-ink">
                  {g.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{g.note}</p>
                <p className="mt-auto pt-5 text-sm font-semibold text-ink/40 transition group-hover:text-ink">
                  Read the guide →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tools: a list beside the pitch. A four-card grid here sat directly
          on top of the group's four-card grid and read as one repeated shape
          (James, 10 Aug). */}
      <section className="py-20 sm:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Run your own numbers <span className="marker">first.</span>
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              Eight tools, free, on screen, no email wall. Work out what you can borrow, what
              it costs, what the government takes and gives back, then bring the numbers to a
              broker who can move them.
            </p>
            <div className="mt-8">
              <Pill href="/calculators" variant="ghost">
                All calculators and checks
              </Pill>
            </div>
          </div>
          <div className="divide-y divide-ink/10 rounded-[25px] bg-[#f1f1f1] px-7">
            {[
              { label: "Borrowing power estimator", href: "/borrowing-power-calculator", note: "What a lender will actually lend you, with the APRA buffer", icon: <Icon.calculator /> },
              { label: "Repayments and stress test", href: "/home-loan-repayment-calculator", note: "Monthly cost, and the cost if rates rise 3%", icon: <Icon.dollar /> },
              { label: "Stamp duty QLD", href: "/stamp-duty-calculator-qld", note: "Duty by buyer type, including the first home rules", icon: <Icon.home /> },
              { label: "LMI estimator", href: "/lenders-mortgage-insurance-calculator", note: "The premium, and the four ways to avoid paying it", icon: <Icon.shieldCheck /> },
              { label: "First home grant check", href: "/first-home-buyers-grant", note: "The $30,000 grant, against the real eligibility rules", icon: <Icon.key /> },
              { label: "Home loan health check", href: "/home-loan-health-check", note: "Score the loan you already have, out of 10", icon: <Icon.clipboardCheck /> },
              { label: "Business borrowing check", href: "/business-borrowing-health-check", note: "How a commercial credit desk would read your file", icon: <Icon.trendingUp /> },
            ].map((t) => (
              <a key={t.href} href={t.href} className="group flex items-center gap-4 py-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ink">
                  {t.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold tracking-tight text-ink">
                    {t.label}
                  </span>
                  <span className="block text-sm text-ink/60">{t.note}</span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-lg text-ink/30 transition group-hover:translate-x-1 group-hover:text-ink"
                >
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Group band */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHead
            title="The finance team at LINK."
            mark="at LINK."
            intro="One connected team when you want it, just the loan when you don't."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_TEAMS.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="rounded-[25px] bg-[#f1f1f1] p-6 transition hover:bg-advance-light">
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  {t.name}
                  <span style={{ color: t.color }}>.</span>
                </p>
                <p className="mt-1 text-sm text-ink/55">{t.meaning}</p>
              </a>
            ))}
          </div>
          <div className="mt-10 overflow-hidden rounded-[25px]">
            <img
              src="/wp-content/uploads/2020/11/LINK-Heroshot-2025-1.jpg"
              alt="The LINK group team"
              loading="lazy"
              className="aspect-[2400/860] w-full object-cover object-bottom"
            />
          </div>
        </div>
      </section>

      {/* The cost answer, in visible copy - the head-term PAA is four cost
          questions and they shouldn't live only inside a collapsed FAQ */}
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What a broker costs, and what you get.
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              For home loans: <strong className="text-ink">you pay nothing</strong>. The lender
              pays a commission when the loan settles, and we disclose exactly what it is before
              you sign anything. The comparison across 35+ lenders, the negotiation and the
              yearly repricing call are all part of that.
            </p>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              For complex commercial work, where a fee can apply, it&apos;s quoted in writing
              before anything starts. No surprises either way: since 2021 mortgage brokers owe
              you a legal Best Interests Duty. Your bank owes you nothing of the kind.
            </p>
            <p className="mt-5 text-sm font-semibold">
              <a href="/blog/home-loans/mortgage-broker-vs-bank" className="text-ink/70 underline-offset-4 hover:text-ink hover:underline">
                The full broker-vs-bank breakdown →
              </a>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-advance text-xs font-semibold uppercase tracking-wider text-ink/50">
                  <th className="py-3 pr-3"></th>
                  <th className="py-3 pr-3">Your bank</th>
                  <th className="py-3 text-ink">LINK Advance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Loans compared", "Its own products", "35+ lenders, including your bank"],
                  ["Legally serves", "Its shareholders", "You: Best Interests Duty"],
                  ["Your rate", "The advertised one", "Negotiated, with walk-away leverage"],
                  ["The paperwork", "You chase it", "Prepared and chased for you"],
                  ["After settlement", "Nothing", "Repriced every year"],
                  ["Cost to you", "$0", "$0 for home loans, disclosed commission"],
                ].map((r) => (
                  <tr key={r[0]} className="border-b border-ink/10 align-top">
                    <td className="py-3 pr-3 font-semibold text-ink">{r[0]}</td>
                    <td className="py-3 pr-3 text-ink/55">{r[1]}</td>
                    <td className="py-3 font-medium text-ink/85">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQ title="Straight answers first." faqs={FAQS} />

      <CtaBand />

      {/* Local band - the map pack is the head-term prize, and a
          geo-consistent homepage supports it */}
      <section className="border-y border-ink/10 bg-neutral-50 py-16">
        <div className="container-x grid gap-8 md:grid-cols-3">
          <div className="flex gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-advance-light text-advance">
              <Icon.pin className="h-5 w-5" />
            </span>
            <p className="text-sm text-ink/65">
              <span className="block font-semibold text-ink">Fortitude Valley, Brisbane.</span>
              Level 1, 57 Berwick Street, QLD 4006, with free parking.{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=LINK+Advance+Fortitude+Valley&query_place_id=${SITE.reviews.placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink/75 underline-offset-4 hover:text-ink hover:underline"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-advance-light text-advance">
              <Icon.clock className="h-5 w-5" />
            </span>
            <p className="text-sm text-ink/65">
              <span className="block font-semibold text-ink">Monday to Friday, 8:30 to 5:00.</span>
              And whenever the deal needs it: settlements don&apos;t keep office hours, so we
              don&apos;t always either.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-advance-light text-advance">
              <Icon.userPhone className="h-5 w-5" />
            </span>
            <p className="text-sm text-ink/65">
              <span className="block font-semibold text-ink">Brisbane based, Australia wide.</span>
              Loans settle in every state, with everything handled by phone, email and video
              when that&apos;s easier. <a href={SITE.phoneHref} className="font-semibold text-ink/75 underline-offset-4 hover:text-ink hover:underline">{SITE.phone}</a>
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
