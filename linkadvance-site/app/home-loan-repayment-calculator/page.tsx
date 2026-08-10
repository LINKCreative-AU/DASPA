import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { Calculator } from "./Calculator";

// "mortgage repayment calculator" 78k/mo and "home loan repayment
// calculator" 34.5k/mo are KD 57-59 head terms owned by banks - this page
// plays for the long tail and for conversion, not the head. The stress-test
// line and extra-repayment model are the differentiators.

const PATH = "/home-loan-repayment-calculator";

export const metadata: Metadata = {
  title: { absolute: "Home Loan Repayment Calculator | Weekly, Fortnightly, Monthly + Stress Test" },
  description:
    "Calculate home loan repayments at any rate and term (monthly, fortnightly and weekly), plus the +3% stress test lenders actually apply and what extra repayments save. Free, on screen, no email wall.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "How are home loan repayments calculated?", a: "Principal-and-interest repayments use an amortisation formula: each payment covers the month's interest on the remaining balance plus some principal, so early payments are interest-heavy and later ones principal-heavy. The calculator applies the standard formula lenders use." },
  { q: "Why do lenders assess me at a higher rate than I'll pay?", a: "APRA requires lenders to test that you could still afford repayments if rates rose: the serviceability buffer, currently around 3 percentage points above your actual rate. That stressed figure, not the advertised repayment, is what decides your borrowing power." },
  { q: "Do fortnightly repayments really save interest?", a: "Paying half your monthly amount fortnightly sneaks in one extra month's payment per year (26 halves = 13 months), which genuinely shortens the loan. The effect in this calculator's extra-repayment field: roughly one-twelfth of your monthly repayment as 'extra'." },
  { q: "What difference do extra repayments make?", a: "On a typical 30-year loan, even a few hundred dollars extra per month removes years from the term and five figures from the interest. The calculator shows your exact numbers. An offset account achieves the same effect while keeping the cash accessible." },
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
            title="Home loan repayment calculator, with the stress test banks apply."
            mark="stress test banks apply."
            intro="Monthly, fortnightly and weekly repayments at your rate and term, the total interest over the loan, what the +3% assessment buffer does to the numbers, and what extra repayments actually save."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      {/* The pre-computed table: same formula the calculator runs, so the
          page carries indexable answers, not just an interactive widget */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Monthly repayments at a glance.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Principal and interest over 30 years, by loan size and rate. Run your exact
            numbers in the calculator above; these are the reference points people ask about
            most.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Monthly principal and interest repayments over 30 years by loan amount and interest rate"
              head={["Loan amount", "5.0%", "5.5%", "5.9%", "6.5%", "7.0%"]}
              rows={[
                ["$400,000", "$2,147", "$2,271", "$2,373", "$2,528", "$2,661"],
                ["$500,000", "$2,684", "$2,839", "$2,966", "$3,160", "$3,327"],
                ["$600,000", "$3,221", "$3,407", "$3,559", "$3,792", "$3,992"],
                ["$700,000", "$3,758", "$3,975", "$4,152", "$4,424", "$4,657"],
                ["$800,000", "$4,295", "$4,542", "$4,745", "$5,057", "$5,322"],
                ["$1,000,000", "$5,368", "$5,678", "$5,931", "$6,321", "$6,653"],
              ]}
              note="Principal and interest, 30-year term, standard amortisation. Indicative only: your rate, fees and structure change the figure, and lenders assess you at roughly 3 percentage points above the rate you pay."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Two readings worth taking from the table: the difference between 5.5% and 6.5% on
            a $600,000 loan is $385 a month ($4,620 a year), which is why the yearly repricing
            call matters. And a lender assessing you at the 3% buffer reads your $600,000 loan
            at roughly the 8.9% row that isn&apos;t on this table: about $4,790 a month. That
            gap between what you&apos;d pay and what you must prove you could pay is the
            borrowing power question, and the{" "}
            <a href="/borrowing-power-calculator" className="font-medium text-advance underline decoration-advance/30 underline-offset-2 hover:decoration-advance">
              borrowing power estimator
            </a>{" "}
            runs it.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
          { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
          { label: "Home loan health check", href: "/home-loan-health-check" },
        ]}
      />
      <CtaBand
        heading="The repayment is maths. The rate is negotiation."
        intro="A broker compares your numbers across 35+ lenders. It's free, and the lender pays us."
        subject="Repayments calculator"
      />
    </main>
  );
}
