import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { PageHero, Section, FeatureGrid, CheckList, ProcessSteps, FAQ } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { TEAM } from "@/lib/site";

// Body copy carried verbatim from the live page; structure fixed (one H1),
// meta kept, Service+Offer, FAQ and Breadcrumb schema added. V1.5 bones.

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
  {
    title: "Book",
    body: "Book your $660 workshop (covered by our Value Guarantee — full refund if you don’t find it worthwhile).",
  },
  {
    title: "Model",
    body: "Meet with a licensed adviser who will model your current and projected position.",
  },
  {
    title: "Act",
    body: "Walk away with a clear understanding of how you are tracking towards retirement, and what options you have to get on track.",
  },
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

      {/* Hero - verbatim copy */}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Retirement Funding Workshop", path: PATH },
        ]}
        eyebrow="Retirement Funding Workshop"
        title="Design the Retirement You’ve Worked For."
        mark="You’ve Worked For."
        intro="You’ve spent years building a career, a family, and financial security — but how do you turn all of that into a comfortable, confident retirement? Our Retirement Funding Workshop helps you map out exactly how to make your super, savings, and investments support the lifestyle you want."
        ctaLabel="Enquire Now to Secure Your Workshop"
        ctaHref="#contact"
        showStars={false}
      >
        <p className="mt-6 max-w-xl text-sm text-ink/55">
          Backed by LINK Wealth’s Value Guarantee — if you don’t walk away with clear,
          actionable insights worth far more than the fee, we’ll refund you in full.
        </p>
      </PageHero>

      {/* Discover + who - verbatim */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              What You’ll Discover?
            </h2>
            <p className="mt-5 text-ink/65">
              In this one-on-one session, we’ll take the guesswork out of retirement planning.
              You’ll walk away with clarity on:
            </p>
            <CheckList items={DISCOVER} />
            <p className="mt-6 text-ink/65">
              This isn’t a product pitch — it’s a practical, tailored session that gives you a
              clear understanding of how you are tracking towards your retirement, and what
              options you have to ensure you are on track.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              Who Is This Workshop For?
            </h2>
            <CheckList items={WHO} />
            <div className="mt-8 rounded-3xl bg-ink p-8 text-white">
              <p className="font-display text-xl font-bold tracking-tight">
                In just 90 minutes, you’ll see how your money can fund your lifestyle — not
                just your retirement.
              </p>
              <p className="mt-3 text-white/65">What’s stopping you from starting today?</p>
              <a href="#contact" className="btn mt-6 bg-white text-ink hover:bg-neutral-100">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - verbatim, house numbered steps */}
      <Section title="How It Works?">
        <ProcessSteps steps={HOW} cols={3} />
        <p className="mt-10 font-display text-xl font-bold tracking-tight text-ink">
          Your future income deserves a strategy!
        </p>
      </Section>

      {/* Why blocks - verbatim */}
      <Section tint title="Why LINK Wealth.">
        <FeatureGrid items={WHY} />
      </Section>

      <Testimonials />

      {/* Why choose LINK Wealth - verbatim */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            Why Choose LINK Wealth?
          </h2>
          <p className="mt-5 text-lg text-ink/65">
            We specialise in connecting all the pieces — superannuation, investments, tax and
            structure — to create retirement strategies that actually work in real life.
          </p>
          <p className="mt-4 text-lg font-semibold text-ink">
            You’ll leave this session with insight, direction, and confidence.
          </p>
          <a href="#contact" className="btn btn-primary mt-8">
            Book a call
          </a>
        </div>
      </section>

      <TeamGrid
        heading="Your trusted retirement funding workshop team"
        members={TEAM.filter((t) => t.name !== "JC Crusit")}
      />

      <FAQ faqs={FAQS} />

      <CtaBand
        variant="discovery"
        subject="Retirement Funding Workshop"
        formTitle="Enquire now to secure your workshop"
      />
    </main>
  );
}
