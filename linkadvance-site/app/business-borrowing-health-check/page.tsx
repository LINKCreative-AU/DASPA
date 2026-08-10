import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { BizCheck } from "./BizCheck";

// The commercial score engine - the fact-find a credit desk runs, as the
// house wizard. Conversion engine for the commercial bolt-on; the lead
// carries the whole profile so Jacob opens the call informed.

const PATH = "/business-borrowing-health-check";

export const metadata: Metadata = {
  title: { absolute: "Business Borrowing Health Check | Is Your Business Fundable?" },
  description:
    "Score your business's borrowing position out of 10 in 3 minutes - structure, financials, profit, add-backs, ATO position, facilities and security. The same markers commercial credit teams read, on screen, no email wall.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "What makes a business 'fundable'?", a: "Commercial lenders read the same file every time: current financials, a clear profit story (including add-backs), a clean or managed ATO position, sensible structure, and security they can understand. The check scores those markers - because they're fixable, and fixing them changes both approval odds and pricing." },
  { q: "What are add-backs?", a: "Adjustments that show a business's true earning power: directors' wages above or below market, one-off costs, personal expenses run through the business. Lenders assess 'maintainable earnings' - profit after the story is understood - and documented add-backs can substantially lift what a file supports." },
  { q: "Will an ATO debt stop us borrowing?", a: "Not by itself. An ATO debt on a payment plan, disclosed up front, is routinely fundable. The deal-killer is the undisclosed version a lender finds in the bank statements. If there's tax debt, the move is a plan plus honesty - both of which we help arrange." },
  { q: "Is this credit advice?", a: "No - it weighs seven general markers of borrowing readiness and returns general observations. It doesn't know your revenue, industry or circumstances. The free review with Jacob is where the real assessment happens; structure and tax questions belong with your accountant (LINK Advisors, if you'd like ours)." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Business Borrowing Health Check", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Business Borrowing Health Check",
            url: `https://linkadvance.com.au${PATH}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Free tool · 3 minutes · no email needed"
            title="Is your business fundable? Score the file out of 10."
            mark="out of 10."
            intro="Commercial lenders don't price businesses - they price files. Seven quick questions across the markers a credit desk actually reads: structure, numbers, profit, add-backs, the ATO, facilities and security. Your score and the groundwork show up immediately."
            accent
          />
        </div>
        <div className="mt-10">
          <BizCheck />
        </div>
      </section>
      <FAQ
        title="Fundability, answered."
        faqs={FAQS}
        related={[
          { label: "Commercial lending", href: "/commercial-lending" },
          { label: "Commercial property loans", href: "/commercial-property-loans" },
          { label: "Working capital finance", href: "/working-capital-finance" },
        ]}
      />
      <CtaBand
        heading="A score is a start. A funded deal is the point."
        intro="Bring your result to a free review - Jacob turns the flags into a fundable file and takes it to the lenders who want it."
        subject="Business Borrowing Health Check"
      />
    </main>
  );
}
