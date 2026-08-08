import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { Calculator } from "./Calculator";

// NEW page: "stamp duty qld" 3,497/mo at KD 0 (TP 13k). The SERP leans on
// the government calculator; the union play is calculator + the first-home
// rules in plain English (which changed 1 May 2025 and most content is
// stale on).

const PATH = "/stamp-duty-calculator-qld";

export const metadata: Metadata = {
  title: { absolute: "Stamp Duty Calculator QLD 2026 | First Home Buyers Pay $0 on New Builds" },
  description:
    "Calculate Queensland transfer (stamp) duty for first home buyers, owner-occupiers and investors - including the 2025 rule change: first home buyers pay zero duty on new builds, and the established-home concession now runs to $800,000.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "Do first home buyers pay stamp duty in QLD?", a: "Often not anymore. Since 1 May 2025, first home buyers building or buying a NEW home in Queensland pay no transfer duty at all - no price cap. For established homes the concession gives full relief up to $700,000, phasing out at $800,000; for vacant land, full relief to $350,000 phasing out at $500,000." },
  { q: "How much is stamp duty on a $750,000 house in QLD?", a: "It depends who's buying: an investor pays about $26,775 at general rates; an owner-occupier about $19,600 with the home concession; a first home buyer of an established home at $750,000 pays roughly half the home-rate duty under the phase-out; and a first home buyer of a NEW home pays $0. The calculator gives your exact case." },
  { q: "When is stamp duty payable in QLD?", a: "Generally within 30 days of settlement, and in practice your solicitor arranges payment at settlement - which means it's cash you need on top of your deposit, not part of the loan (unless your equity supports borrowing it)." },
  { q: "Does the stamp duty saving stack with the $30,000 grant?", a: "Yes. A first home buyer building a new home can combine zero stamp duty, the $30,000 First Home Owner Grant, the 5% deposit First Home Guarantee and the First Home Super Saver scheme - the full stack can be worth $50,000+." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Stamp Duty Calculator QLD", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Stamp Duty Calculator QLD",
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
            eyebrow="Free tool · QRO rates, mid-2026"
            title="Stamp duty in QLD - and who pays none at all."
            mark="none at all."
            intro="Queensland rewrote its first-home stamp duty rules in May 2025: zero duty on new builds at any price, and relief on established homes to $800,000. Pick your buyer type, enter the price, and see the duty - and the saving - instantly."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      <FAQ
        title="Stamp duty, answered."
        faqs={FAQS}
        related={[
          { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
          { label: "First Home Guarantee", href: "/first-home-guarantee" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
        ]}
      />
      <CtaBand
        heading="Duty, grants, deposit - sequenced properly."
        intro="A broker lines up everything you're entitled to before you sign anything - free, no obligation."
        subject="Stamp duty QLD"
      />
    </main>
  );
}
