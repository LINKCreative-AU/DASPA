import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { PageHero, Section, FeatureGrid, CheckList, FAQ } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { TEAM } from "@/lib/site";

// PROTECTED PAGE. Every sentence of body copy on this page is carried
// VERBATIM from the live site (James, 2026-08-08: "a lot of work was put
// into that one via the content copy - put in exactly as it is"). Only the
// structure around it is optimised: one H1 instead of the old duplicate
// pair, meta/OG kept, Service+Offer, FAQ and Breadcrumb schema added.
// Do not reword the copy. Layout = the shared V1.5 page bones.

const TITLE = "Business Owner Wealth Extraction Workshop – LINK Wealth";
const DESC =
  "Our Business Owner Wealth Extraction Workshop shows you how to turn business profits into personal financial freedom, tax-effectively and strategically.";
const PATH = "/business-owner-wealth-extraction-workshop-link-wealth";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PATH,
    images: [{ url: "/wp-content/uploads/2024/11/Richard-Wealth648x648-Outlook.png" }],
  },
};

const COVERS = [
  "Extract profits from your business in smarter, tax-efficient ways",
  "Use company or trust structures to invest beyond your trading entity",
  "Balance reinvestment vs. personal wealth creation",
  "Integrate superannuation, dividends, and investments into one plan",
  "Prepare your structure for future succession or sale",
];

const WHO = [
  "Established business owners and directors with retained profits",
  "Professionals operating through a company or trust",
  "Entrepreneurs planning for an exit or transition",
  "Anyone tired of seeing money ‘stuck’ in the business",
];

const EXPECT = [
  "A 90-minute collaborative workshop ($660, Value Guarantee included)",
  "A review of your current structure, profit flow, and tax position",
  "Modelling of extraction and reinvestment options",
  "A clear understanding of the options available to build your wealth — without compromising your business",
];

const WHY = [
  {
    title: "30+ years experience.",
    body: "LINK Wealth brings you proven strategies and insights to help you turn your business profits into personal wealth, building financial freedom beyond your company.",
  },
  {
    title: "Tailored advice.",
    body: "Count on expert guidance when it matters most. Our experienced advisers work alongside you to design strategies that align your business, investments, and personal goals — helping you extract wealth efficiently as your needs and circumstances evolve.",
  },
  {
    title: "Your true partner.",
    body: "Count on expert guidance when it matters most. Our responsive advisory team works alongside you to navigate the complexities of business ownership, adapting your wealth strategy as your goals, structure, and circumstances evolve.",
  },
];

// FAQ block: answers assembled from this page's own verbatim copy so the
// FAQPage schema gives the SERP something to show without inventing claims.
const FAQS = [
  {
    q: "What does the Business Owner Wealth Extraction Workshop cost?",
    a: "It is a 90-minute collaborative workshop for $660, with LINK Wealth's Value Guarantee included: if you don't walk away with clear, actionable insights worth far more than the fee, we'll refund you in full.",
  },
  {
    q: "Who is the workshop for?",
    a: "Established business owners and directors with retained profits, professionals operating through a company or trust, entrepreneurs planning for an exit or transition, and anyone tired of seeing money 'stuck' in the business.",
  },
  {
    q: "What will I walk away with?",
    a: "A review of your current structure, profit flow, and tax position, modelling of extraction and reinvestment options, and a clear understanding of the options available to build your wealth without compromising your business.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          workshopSchema({
            name: "Business Owner Wealth Extraction Workshop",
            description: DESC,
            path: PATH,
            price: 660,
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Business Owner Wealth Extraction Workshop", path: PATH },
          ]),
        ]}
      />

      {/* Hero - verbatim copy */}
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Business Owner Wealth Extraction Workshop", path: PATH },
        ]}
        eyebrow="Make Your Business Work for You"
        title="Business Owner Wealth Extraction Workshop."
        mark="Wealth Extraction"
        intro="Running a business is demanding — but the real reward comes when your hard work starts building your wealth, not just the company’s. Our Business Owner Wealth Extraction Workshop shows you how to turn business profits into personal financial freedom, tax-effectively and strategically."
        ctaLabel="Enquire Now to Secure Your Workshop"
        ctaHref="#contact"
        image="/wp-content/uploads/2024/11/Richard-Wealth648x648-Outlook.png"
        imageAlt="Richard Leal, Managing Director at LINK Wealth, runs the Business Owner Wealth Extraction Workshop"
        showStars={false}
      >
        <p className="mt-6 max-w-xl text-sm text-ink/55">
          Backed by LINK Wealth’s Value Guarantee — if you don’t walk away with clear,
          actionable insights worth far more than the fee, we’ll refund you in full.
        </p>
      </PageHero>

      {/* What the session covers / who it's for - verbatim */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What the Session Covers
            </h2>
            <p className="mt-5 text-ink/65">
              We’ll deep-dive into how your business, trust, and personal finances can align to
              grow your long-term wealth. In this strategy workshop, you’ll learn how to:
            </p>
            <CheckList items={COVERS} />
            <p className="mt-6 font-semibold text-ink">
              You’ll leave with a clear understanding of the options available to you to help
              turn your business into lasting wealth for you and your family!
            </p>
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Who Is This Workshop For?
            </h2>
            <CheckList items={WHO} />
            <p className="mt-6 text-ink/65">
              If you’ve built success inside your company, this is how you turn it into
              personal wealth outside it.
            </p>
            <div className="mt-8 rounded-3xl bg-ink p-8 text-white">
              <p className="font-display text-xl font-bold tracking-tight">
                Meet with a licensed adviser who will review your current structure, profit
                flow, and tax position.
              </p>
              <p className="mt-3 text-white/65">What’s stopping you from starting today?</p>
              <a href="#contact" className="btn mt-6 bg-white text-ink hover:bg-neutral-100">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What you can expect - verbatim */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What You Can Expect?
          </h2>
          <CheckList items={EXPECT} />
          <a href="#contact" className="btn btn-primary mt-8">
            Book a call
          </a>
        </div>
      </section>

      {/* Why blocks - verbatim */}
      <Section tint title="Why LINK Wealth.">
        <FeatureGrid items={WHY} />
      </Section>

      <Testimonials />

      {/* Why choose LINK Wealth - verbatim */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Why Choose LINK Wealth?
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            We understand business owners because we work with them every day. Our advisers
            integrate accounting, lending, and investment expertise to help you keep more of
            what you earn and deploy it with purpose.
          </p>
          <p className="mt-4 text-lg font-semibold text-ink">
            You’ll gain the confidence and structure to grow beyond your business — and the
            clarity to know exactly how to do it.
          </p>
        </div>
      </section>

      <TeamGrid heading="Your trusted team" members={TEAM.filter((t) => t.name !== "JC Crusit")} />

      {/* Cross-division handoff: LINK's exits practice routes sale proceeds here */}
      <section className="container-x pb-4">
        <div className="rounded-3xl border border-ink/10 bg-neutral-50 p-8 sm:p-10">
          <p className="eyebrow mb-4">
            <span className="text-wealth">Selling, not just extracting?</span>
          </p>
          <h2 className="max-w-2xl font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
            If an exit is on the cards, start with the group&apos;s exits practice.
          </h2>
          <p className="mt-3 max-w-2xl text-ink/65">
            LINK&apos;s selling-your-business team handles the sale side - valuation thinking,
            CGT concessions, deal structure - and hands the proceeds strategy to us. Same
            group, one picture of your finances.
          </p>
          <a
            href="https://link.com.au/selling-your-business"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            Selling your business, at LINK
          </a>
        </div>
      </section>

      {/* FAQs (visible text and schema kept in sync) */}
      <FAQ faqs={FAQS} />

      <CtaBand
        variant="discovery"
        subject="Business Owner Wealth Extraction Workshop"
        formTitle="Enquire now to secure your workshop"
      />
    </main>
  );
}
