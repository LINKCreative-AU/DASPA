/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, workshopSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Testimonials } from "@/components/Testimonials";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { TEAM } from "@/lib/site";

// PROTECTED PAGE. Every sentence of body copy on this page is carried
// VERBATIM from the live site (James, 2026-08-08: "a lot of work was put
// into that one via the content copy - put in exactly as it is"). Only the
// structure around it is optimised: one H1 instead of the old duplicate
// pair, meta/OG kept, Service+Offer, FAQ and Breadcrumb schema added.
// Do not reword the copy.

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
            { name: "Workshops", path: PATH },
            { name: "Business Owner Wealth Extraction Workshop", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Business Owner Wealth Extraction Workshop", path: PATH },
        ]}
      />

      {/* Hero - verbatim */}
      <section className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="eyebrow text-wealth">Make Your Business Work for You</span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Business Owner Wealth <span className="marker">Extraction Workshop</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70">
            Running a business is demanding — but the real reward comes when your hard work
            starts building your wealth, not just the company’s. Our Business Owner Wealth
            Extraction Workshop shows you how to turn business profits into personal
            financial freedom, tax-effectively and strategically.
          </p>
          <a href="#contact" className="btn btn-wealth mt-8">
            Enquire Now to Secure Your Workshop
          </a>
          <p className="mt-5 max-w-xl text-sm text-ink/60">
            Backed by LINK Wealth’s Value Guarantee — if you don’t walk away with clear,
            actionable insights worth far more than the fee, we’ll refund you in full.
          </p>
        </div>
        <img
          src="/wp-content/uploads/2024/11/Richard-Wealth648x648-Outlook.png"
          alt="Richard Leal, Managing Director at LINK Wealth, runs the Business Owner Wealth Extraction Workshop"
          className="mx-auto w-full max-w-md rounded-3xl object-cover"
        />
      </section>

      {/* What the session covers - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-wealth">
              Business Owner Wealth Extraction Workshop
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
              What the Session Covers
            </h2>
            <p className="mt-4 text-ink/70">
              We’ll deep-dive into how your business, trust, and personal finances can align to
              grow your long-term wealth. In this strategy workshop, you’ll learn how to:
            </p>
            <ul className="mt-5 space-y-3">
              {COVERS.map((c) => (
                <li key={c} className="flex gap-3 text-ink/80">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-semibold text-ink">
              You’ll leave with a clear understanding of the options available to you to help
              turn your business into lasting wealth for you and your family!
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
            <p className="mt-6 text-ink/70">
              If you’ve built success inside your company, this is how you turn it into
              personal wealth outside it.
            </p>
            <div className="mt-8 rounded-xl2 bg-wealth-dark p-7 text-white">
              <p className="font-display text-xl font-bold">
                Meet with a licensed adviser who will review your current structure, profit
                flow, and tax position.
              </p>
              <p className="mt-3 text-white/75">What’s stopping you from starting today?</p>
              <a href="#contact" className="btn btn-mint mt-5">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What you can expect - verbatim */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            What You Can Expect?
          </h2>
          <ul className="mt-6 space-y-3">
            {EXPECT.map((c) => (
              <li key={c} className="flex gap-3 text-lg text-ink/80">
                <Check />
                {c}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-wealth mt-8">
            Book a call
          </a>
        </div>
      </section>

      {/* Why blocks - verbatim */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="border-t-2 border-wealth pt-5">
                <h2 className="font-display text-xl font-bold text-ink">{w.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{w.body}</p>
              </div>
            ))}
          </div>
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

      {/* FAQs (visible text and schema kept in sync) */}
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
        subject="Business Owner Wealth Extraction Workshop"
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
      className="mt-1 shrink-0 text-wealth"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6 10 2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
