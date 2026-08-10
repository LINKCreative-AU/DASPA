import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { LoanCheck } from "./LoanCheck";

// The division's score engine - "home loan health check" is 141/mo at KD 0
// and the firm already owns the concept (Callum's video, two posts, annual
// checks as a service line). Conversion engine first, search legs second.

const PATH = "/home-loan-health-check";

export const metadata: Metadata = {
  title: { absolute: "Free Home Loan Health Check | Score Your Loan Out of 10" },
  description:
    "Seven quick questions, a score out of 10: rate awareness, review recency, structure, fit, equity and attention. See what your loan's costing you in neglect, on screen, no email wall.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "The Home Loan Health Check - score your loan out of 10",
    description: "Two minutes, a real score, and the flags holding your loan back. No email wall.",
    url: PATH,
  },
};

const FAQS = [
  { q: "What is a home loan health check?", a: "A structured review of whether your loan is still working: is the rate sharp, is the structure (offset, splits, repayments) being used, does the loan still fit your life, and is anyone paying attention to it. This tool scores those markers in two minutes; a broker review then does the real comparison across 35+ lenders." },
  { q: "How often should I review my home loan?", a: "Annually. That doesn't mean refinancing annually. Most annual reviews end in a free repricing call to your existing lender rather than a switch. What matters is that someone makes that call; loans drift precisely because nobody does." },
  { q: "Is the check personal or credit advice?", a: "No. It weighs six general markers of loan health and returns general observations. It doesn't know your rate, balance or circumstances. It's built to start the right conversation; the free review with a broker is where your actual loan gets assessed." },
  { q: "What happens if my loan scores badly?", a: "Usually good news, oddly: a low score means idle levers, and idle levers mean recoverable money. The most common fixes (a repricing call, activating an offset, cutting unused card limits) don't even require refinancing." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Home Loan Health Check", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Home Loan Health Check",
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
            eyebrow="Free tool · 2 minutes · no email needed"
            title="The Home Loan Health Check: score your loan out of 10."
            mark="out of 10."
            intro="Loans are built to be forgotten, and lenders price that forgetting. Seven quick questions across the things that decide whether your loan is still working, with your score, flags and next steps on screen immediately."
            accent
          />
        </div>
        <div className="mt-10">
          <LoanCheck />
        </div>
      </section>
      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Refinancing: the free review", href: "/refinancing-brisbane" },
          { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
        ]}
      />
      <CtaBand
        heading="A score is a start. Savings are the point."
        intro="Bring your result to a free review. Either we find a sharper loan across 35+ lenders, or we make your lender price-match."
        subject="Home Loan Health Check"
      />
    </main>
  );
}
