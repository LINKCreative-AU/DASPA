import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { Calculator } from "./Calculator";

// "mortgage repayment calculator" 78k/mo and "home loan repayment
// calculator" 34.5k/mo are KD 57-59 head terms owned by banks - this page
// plays for the long tail and for conversion, not the head. The stress-test
// line and extra-repayment model are the differentiators.

const PATH = "/home-loan-repayment-calculator";

export const metadata: Metadata = {
  title: { absolute: "Home Loan Repayment Calculator | Weekly, Fortnightly, Monthly + Stress Test" },
  description:
    "Calculate home loan repayments at any rate and term - monthly, fortnightly and weekly - plus the +3% stress test lenders actually apply and what extra repayments save. Free, on screen, no email wall.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "How are home loan repayments calculated?", a: "Principal-and-interest repayments use an amortisation formula: each payment covers the month's interest on the remaining balance plus some principal, so early payments are interest-heavy and later ones principal-heavy. The calculator applies the standard formula lenders use." },
  { q: "Why do lenders assess me at a higher rate than I'll pay?", a: "APRA requires lenders to test that you could still afford repayments if rates rose - the serviceability buffer, currently around 3 percentage points above your actual rate. That stressed figure, not the advertised repayment, is what decides your borrowing power." },
  { q: "Do fortnightly repayments really save interest?", a: "Paying half your monthly amount fortnightly sneaks in one extra month's payment per year (26 halves = 13 months), which genuinely shortens the loan. The effect in this calculator's extra-repayment field: roughly one-twelfth of your monthly repayment as 'extra'." },
  { q: "What difference do extra repayments make?", a: "On a typical 30-year loan, even a few hundred dollars extra per month removes years from the term and five figures from the interest - the calculator shows your exact numbers. An offset account achieves the same effect while keeping the cash accessible." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Repayments Calculator", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Home Loan Repayment Calculator",
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
            title="Home loan repayment calculator - with the stress test banks apply."
            mark="stress test banks apply."
            intro="Monthly, fortnightly and weekly repayments at your rate and term, the total interest over the loan, what the +3% assessment buffer does to the numbers, and what extra repayments actually save."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      <FAQ
        title="Repayments, answered."
        faqs={FAQS}
        related={[
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
          { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
          { label: "Home loan health check", href: "/home-loan-health-check" },
        ]}
      />
      <CtaBand
        heading="The repayment is maths. The rate is negotiation."
        intro="A broker compares your numbers across 35+ lenders - free, and the lender pays us."
        subject="Repayments calculator"
      />
    </main>
  );
}
