import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { TeamGrid } from "@/components/TeamGrid";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { SITE, TEAM } from "@/lib/site";

// The About page, slug carried 1:1. Broker bios rewritten from the live
// page's facts (Hugh founder/real-estate background, Callum FHB + economics
// degree + both sides of the desk, Jacob complex/SMSF/commercial).

const PATH = "/about-us";

export const metadata: Metadata = {
  title: "About Us: Meet Our Brisbane Mortgage Brokers",
  description:
    "Meet the LINK Advance brokers: Hugh (founder), Callum (first home buyers and investors) and Jacob (complex, SMSF and commercial lending). One broker end to end, 35+ lenders, Fortitude Valley.",
  alternates: { canonical: PATH },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About Us", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-8 pt-10">
        <SectionHead
          as="h1"
          title="We make lending easy."
          mark="easy."
          intro="LINK Advance was built around giving clients the best possible experience of getting a loan: a personal, one-on-one service where your broker gets to know you, what you want out of the loan, answers everything - and then fights for the outcome across 35+ lenders."
          accent
        />
      </section>

      <TeamGrid members={TEAM} />

      {/* The bios, expanded */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink">
              About Hugh.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              Hugh founded LINK Advance to give his clients the best experience possible in
              financing, and it shows in how the firm runs: one broker per client, end to end.
              With previous experience in real estate and property brokerage, Hugh knows the
              industry from both sides - and clients get an approachable, straight-talking
              expert who is ready to fight for a great outcome.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink">
              About Callum.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              Callum's focus is making home ownership a reality - from first home buyers
              stepping into the market to investors building complex portfolios. With a
              Bachelor of Business majoring in Economics and Finance and more than five years
              as both a loan processor and a broker, he knows what happens on both sides of
              the desk. First home buyers in particular find he cuts through the complexity
              and answers the questions they didn't know they had.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink">
              About Jacob.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              Jacob's specialty is the lending other brokers find difficult: complex
              commercial deals, SMSF lending, small business finance. Five years in, he's
              built a reputation for getting results on transactions that need more than a
              straightforward application - backed by ongoing study in computational
              mathematics with a minor in Finance and Economics, and a calm, straight-talking
              manner that makes even the complicated deals feel handled.
            </p>
          </div>
        </div>
      </section>

      {/* Part of LINK */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <SectionHead
            title="The lending desk of a bigger team."
            mark="a bigger team."
            intro={`${SITE.group.line} When your loan touches tax, strategy or property management, the specialists are down the hall - not across town.`}
          />
        </div>
      </section>

      <Testimonials />

      <CtaBand
        heading="Meet your broker."
        intro="A free, no-obligation chat about what you're planning - and an honest read on what's achievable."
        subject="About us"
      />
    </main>
  );
}
