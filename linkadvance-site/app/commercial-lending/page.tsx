import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ, ProofBar } from "@/components/ServicePage";
import { ReviewStrip } from "@/components/ReviewStrip";
import { CtaBand } from "@/components/CtaBand";

// The commercial hub - the bolt-on's front door. Head terms: "commercial
// finance broker" 314/mo KD 28 ($6 CPC), "commercial loan" 1,231/mo,
// "commercial mortgage broker" 543/mo KD 22. Jacob is the named specialist.

const PATH = "/commercial-lending";

export const metadata: Metadata = {
  title: { absolute: "Commercial Finance Broker Brisbane | Commercial Loans - LINK Advance" },
  description:
    "Commercial lending for Brisbane businesses: premises and commercial property, working capital, acquisitions and development finance. The deal prepared the way commercial credit teams read it. Bank, non-bank and private lenders compared.",
  alternates: { canonical: PATH },
};

const LANES = [
  { label: "Commercial property", href: "/commercial-property-loans", note: "Premises, investment, or through your SMSF" },
  { label: "Working capital", href: "/working-capital-finance", note: "Overdrafts, invoice finance, trade" },
  { label: "Acquisition & franchise", href: "/business-acquisition-loans", note: "Buy the business, funded properly" },
  { label: "Development finance", href: "/development-finance", note: "Site to settlement, in stages" },
  { label: "Business loans", href: "/business-loans", note: "Growth and cash-flow lending" },
  { label: "Equipment & vehicles", href: "/business-car-and-equipment-loans", note: "Often decided in days" },
];

const FAQS = [
  { q: "What does a commercial finance broker do?", a: "Commercial lending has no rate card. Every deal is priced on its file. A commercial broker prepares that file the way credit teams read it (financials, ATO position, security, the story), takes it to the lenders whose appetite fits your industry and deal size, and negotiates from competition. The spread between lenders on the same commercial deal is routinely whole percentage points." },
  { q: "How is commercial lending priced?", a: "Against risk and security: property-secured deals from established businesses price lowest, unsecured cash-flow lending highest, development and specialised assets in between. Fees matter as much as rates: establishment, line and valuation fees change the true cost materially." },
  { q: "Do you charge for commercial broking?", a: "Many commercial deals are lender-paid like home loans; complex or private-funded work can carry a mandate fee, agreed in writing before any work starts. You'll always know the model before we begin." },
  { q: "We bank with one of the majors - why not just ask them?", a: "Ask them, then compare. Your bank prices your loyalty; a broker prices the market. We regularly fund deals the incumbent bank declined, and reprice facilities the incumbent was quietly rolling over at last year's margin." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Commercial Lending", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          serviceSchema("Commercial lending", "Commercial finance broking: property, working capital, acquisition and development funding for Australian businesses.", PATH),
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-12 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="Commercial finance brokers, Brisbane"
            title="Commercial lending, done like commercial lenders think."
            mark="like commercial lenders think."
            intro="Business lending has no rate card. Every deal is priced on the strength of its file. We build that file properly, take it to the banks, non-banks and private lenders whose appetite fits your deal, and negotiate from competition. Jacob leads the desk; the group's accountants and advisers are down the hall."
            accent
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {/* Was "Talk to Jacob for free". On home lending the lender pays
                and it costs the client nothing, which is why that phrasing is
                fine elsewhere on the site. Commercial work can carry a fee,
                agreed in writing up front, so "free" cannot head a commercial
                page. The conversation genuinely is free, so say exactly that. */}
            <a href="#contact" className="btn btn-primary">Talk to Jacob, no charge for the conversation</a>
            <a href="/business-borrowing-health-check" className="btn btn-ghost">Check your business's borrowing position</a>
          </div>
        </div>
      </section>

      <ProofBar />

      <section className="py-16">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LANES.map((s) => (
              <a key={s.href} href={s.href} className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink">
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  {s.label}
                  <span className="text-advance">.</span>
                </p>
                <p className="mt-1.5 text-sm text-ink/55">{s.note}</p>
                <p className="mt-4 text-sm font-semibold text-ink/40 transition group-hover:text-ink">Learn more →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The file is the deal.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Commercial credit teams read the same things every time: two years of financials
              and what they really say once add-backs are understood; the ATO position, clean
              or with a plan; the security on offer and what it's genuinely worth; and the
              purpose: what the money does and how it comes back. A file that answers those
              questions before they're asked gets priced like a strong deal, because it reads
              like one. That preparation is most of what you're hiring.
            </p>
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              One group, the whole balance sheet.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Commercial deals cross disciplines: LINK Advisors gets the financials
              lender-ready and structures the entities; LINK Wealth handles the SMSF premises
              strategy and what the deal means for your personal position; the lending desk
              sits here. When the accountant, the adviser and the broker share a hallway, the
              deal doesn't lose weeks to email chains.
            </p>
          </div>
        </div>
      </section>

      <ReviewStrip />

      <FAQ title="Frequently asked questions." faqs={FAQS} related={[
        { label: "Business Borrowing Health Check", href: "/business-borrowing-health-check" },
        { label: "Commercial property loans", href: "/commercial-property-loans" },
        { label: "SMSF premises lending", href: "/smsf-mortgage-broker" },
      ]} />

      <CtaBand
        heading="Bring the plan. Jacob brings the lenders."
        intro="A straight read on what's fundable, at what price, from which lenders. Free, no obligation."
        subject="Commercial lending"
      />
    </main>
  );
}
