import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { Calculator } from "./Calculator";

// Existing slug carried 1:1. "lmi calculator" 4,739/mo at KD 10 - a DR-14
// site holds #7, so this is winnable. SERP union: estimator (Helia/Lendi
// have it) + avoid-LMI strategy (nobody pairs it).

const PATH = "/lenders-mortgage-insurance-calculator";

export const metadata: Metadata = {
  title: { absolute: "LMI Calculator | Estimate Lenders Mortgage Insurance + How to Avoid It" },
  description:
    "Estimate your lenders mortgage insurance from property value and deposit - indicative premiums by LVR - and the four legitimate ways to avoid LMI entirely: the First Home Guarantee, guarantors, professional waivers and the 80% line.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "What is lenders mortgage insurance?", a: "LMI is a one-off insurance premium charged when you borrow more than 80% of a property's value. It protects the lender if you default - not you - and it's usually added to your loan, so you pay interest on it for the life of the loan." },
  { q: "How much is LMI on a $600,000 house with 10% deposit?", a: "A $540,000 loan at 90% LVR typically attracts an LMI premium somewhere around $8,000-$12,000 depending on insurer and lender. The calculator above brackets your exact numbers - and the avoid-LMI paths below it are often worth more than shopping the premium." },
  { q: "Can LMI be added to the loan?", a: "Usually yes - most lenders capitalise the premium into the loan so you don't pay cash upfront. It's convenient but means paying interest on the premium for up to 30 years; the true cost is meaningfully higher than the sticker price." },
  { q: "How do I avoid paying LMI?", a: "Four real paths: get to a 20% deposit (or 80% LVR); use the First Home Guarantee if you're an eligible first home buyer (5% deposit, no LMI); use a family guarantor to bring effective LVR to 80%; or qualify for a professional LMI waiver - some lenders waive it to 90% LVR for doctors, lawyers, accountants and other professions." },
  { q: "Is LMI ever worth paying?", a: "Sometimes, honestly, yes. If prices in your target area are rising faster than you can save the next 10% of deposit, paying LMI to buy years earlier can be the cheaper mistake. It's a numbers comparison - one a broker can run with you in minutes." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "LMI Calculator", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance LMI Calculator",
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
            eyebrow="Free tool · no email wall"
            title="LMI calculator - and the four ways to not pay it."
            mark="not pay it."
            intro="Enter your property value and deposit for an indicative lenders mortgage insurance estimate - then see whether the First Home Guarantee, a guarantor or a professional waiver makes the premium disappear entirely."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      <FAQ
        title="LMI, answered."
        faqs={FAQS}
        related={[
          { label: "First Home Guarantee", href: "/first-home-guarantee" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
          { label: "First home buyer loans", href: "/first-home-buyers-loan" },
        ]}
      />
      <CtaBand
        heading="Before you pay LMI, spend five minutes not paying it."
        intro="A broker checks the Guarantee, guarantor and waiver paths against your numbers - free."
        subject="LMI calculator"
      />
    </main>
  );
}
