import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { TEAM } from "@/lib/site";

// Body copy carried verbatim from the live page; structure fixed (one H1),
// meta kept, Service+Offer, FAQ and Breadcrumb schema added.

const TITLE = "Retirement Funding Workshop – LINK Wealth";
const DESC =
  "Our Retirement Funding Workshop helps you map out exactly how to make your super, savings, and investments support the lifestyle you want.";
const PATH = "/retirement-funding-workshop-link-wealth";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESC, url: PATH },
};

const DISCOVER = [
  "How much you’ll need to live the life you want — and how close you are now",
  "How super contributions, investments, and pensions can work together",
  "Strategies to make your income last longer (and reduce tax while you’re at it)",
  "Options for managing lump sums, drawdowns, and Centrelink benefits",
  "How to balance lifestyle spending with growth and peace of mind",
];

const WHO = [
  "Professionals or couples aged 45+ wanting to know if they’re on track",
  "Pre-retirees looking to optimise contributions before stopping work",
  "Retirees ready to fine-tune their income and preserve capital",
  "Business owners considering a sale or exit and what comes next",
];

const HOW = [
  "Book your $660 workshop (covered by our Value Guarantee — full refund if you don’t find it worthwhile).",
  "Meet with a licensed adviser who will model your current and projected position.",
  "Walk away with a clear understanding of how you are tracking towards retirement, and what options you have to get on track.",
];

const WHY = [
  {
    title: "30+ years experience.",
    body: "LINK Wealth brings you proven strategies and insights to help you turn your super, savings, and investments into a retirement you can confidently enjoy.",
  },
  {
    title: "Tailored advice.",
    body: "Count on expert guidance when it matters most. Our experienced advisers work alongside you, adapting your retirement strategy as your goals, super, and investments evolve over time.",
  },
  {
    title: "Your true partner.",
    body: "Count on expert guidance when it matters most. Our responsive advisory team works alongside you, adapting your strategy as your goals and circumstances evolve.",
  },
];

const FAQS = [
  {
    q: "What does the Retirement Funding Workshop cost?",
    a: "The workshop is $660, covered by LINK Wealth's Value Guarantee: a full refund if you don't find it worthwhile.",
  },
  {
    q: "Who is the Retirement Funding Workshop for?",
    a: "Professionals or couples aged 45+ wanting to know if they're on track, pre-retirees optimising contributions before stopping work, retirees fine-tuning income and preserving capital, and business owners considering a sale or exit.",
  },
  {
    q: "What happens in the session?",
    a: "You meet one-on-one with a licensed adviser who models your current and projected position, and you walk away with a clear understanding of how you are tracking towards retirement and what options you have to get on track.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          workshopSchema({
            name: "Retirement Funding Workshop",
            description: DESC,
            path: PATH,
            price: 660,
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Retirement Funding Workshop", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Retirement Funding Workshop", path: PATH },
        ]}
      />

      {/* Hero - verbatim */}
      <section className="container-x max-w-4xl py-14 sm:py-20">
        <span className="eyebrow text-wealth-dark">Retirement Funding Workshop</span>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Design the Retirement <span className="marker">You’ve Worked For</span>
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          You’ve spent years building a career, a family, and financial security — but how do
          you turn all of that into a comfortable, confident retirement? Our Retirement
          Funding Workshop helps you map out exactly how to make your super, savings, and
          investments support the lifestyle you want.
        </p>
        <a href="#contact" className="btn btn-wealth mt-8">
          Enquire Now to Secure Your Workshop
        </a>
        <p className="mt-5 text-sm text-ink/60">
          Backed by LINK Wealth’s Value Guarantee — if you don’t walk away with clear,
          actionable insights worth far more than the fee, we’ll refund you in full.
        </p>
      </section>

      {/* Discover + who - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              What You’ll Discover?
            </h2>
            <p className="mt-4 text-ink/70">
              In this one-on-one session, we’ll take the guesswork out of retirement planning.
              You’ll walk away with clarity on:
            </p>
            <ul className="mt-5 space-y-3">
              {DISCOVER.map((c) => (
                <li key={c} className="flex gap-3 text-ink/80">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-ink/70">
              This isn’t a product pitch — it’s a practical, tailored session that gives you a
              clear understanding of how you are tracking towards your retirement, and what
              options you have to ensure you are on track.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
              Who Is This Workshop For?
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
                In just 90 minutes, you’ll see how your money can fund your lifestyle — not
                just your retirement.
              </p>
              <p className="mt-3 text-white/75">What’s stopping you from starting today?</p>
              <a href="#contact" className="btn btn-mint mt-5">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            How It Works?
          </h2>
          <ol className="mt-8 space-y-6">
            {HOW.map((s, i) => (
              <li key={s} className="flex gap-5">
                <span className="font-display text-3xl font-extrabold text-wealth-mid">
                  0{i + 1}
                </span>
                <p className="pt-1.5 text-lg text-ink/80">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-display text-xl font-bold text-ink">
            Your future income deserves a strategy!
          </p>
        </div>
      </section>

      {/* Why blocks - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="border-t-2 border-wealth pt-5">
              <h2 className="font-display text-xl font-bold text-ink">{w.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      {/* Why choose LINK Wealth - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Why Choose LINK Wealth?
          </h2>
          <p className="mt-5 text-lg text-ink/70">
            We specialise in connecting all the pieces — superannuation, investments, tax and
            structure — to create retirement strategies that actually work in real life.
          </p>
          <p className="mt-4 text-lg font-semibold text-ink">
            You’ll leave this session with insight, direction, and confidence.
          </p>
          <a href="#contact" className="btn btn-wealth mt-8">
            Book a call
          </a>
        </div>
      </section>

      <TeamGrid
        heading="Your trusted retirement funding workshop team"
        members={TEAM.filter((t) => t.name !== "JC Crusit")}
      />

      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
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

      <CtaBand
        variant="discovery"
        subject="Retirement Funding Workshop"
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
