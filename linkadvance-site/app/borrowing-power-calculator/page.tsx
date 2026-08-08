import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { Calculator } from "./Calculator";

// "borrowing power calculator" 42.8k/mo KD 55 + "how much can i borrow"
// 13.3k/mo KD 56 - bank-owned head terms; this plays the long tail and
// conversion. Differentiators: the card-limit cost line and the honest
// negative-surplus state.

const PATH = "/borrowing-power-calculator";

export const metadata: Metadata = {
  title: { absolute: "Borrowing Power Calculator | How Much Can I Borrow? (With the APRA Buffer)" },
  description:
    "Estimate how much you can borrow the way lenders actually assess it: net income, expense benchmarks, the 3% APRA buffer and the 3.8%/month card-limit rule. See what your credit card limits cost you in borrowing power.",
  alternates: { canonical: PATH },
};

const FAQS = [
  { q: "How is borrowing power calculated?", a: "Lenders take your after-tax income, subtract living expenses (benchmarked to a minimum even if you declare less), existing commitments and about 3.8% per month of your credit card LIMITS, then work out what loan the remaining surplus services at your rate plus a ~3% buffer. Same formula here - which is why the estimate is honest rather than flattering." },
  { q: "Why do different lenders offer such different amounts?", a: "Policy. Lenders treat overtime, bonuses, casual income, rental income and self-employed income differently, apply different expense benchmarks, and a few use different buffers for refinances. On identical inputs, the spread between the most and least generous lender is routinely six figures - that spread is why brokers exist." },
  { q: "Do credit cards really reduce my borrowing power?", a: "Yes, dramatically - lenders assess about 3.8% of your total limit per month as a commitment even if the card is never used. A $20,000 unused limit can cost roughly $100,000 of borrowing power. Cancelling or cutting limits before applying is the quickest capacity win available." },
  { q: "How can I increase my borrowing power?", a: "In rough order of speed: cut card limits, clear small personal loans, trim provable living expenses for three months, ensure all income is documented (and consistent), then consider the bigger levers - a longer term, a co-borrower or lenders whose policy suits your income type. Our article on increasing borrowing capacity covers the details." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Borrowing Power Calculator", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Borrowing Power Calculator",
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
            eyebrow="Free tool · assessed like a lender would"
            title="How much can you borrow? The honest version."
            mark="The honest version."
            intro="Most borrowing calculators flatter you. This one runs the numbers the way a lender's serviceability engine does - net income, benchmarked expenses, the APRA buffer, and the card-limit rule most people have never heard of."
            accent
          />
        </div>
        <div className="mt-10">
          <Calculator />
        </div>
      </section>
      <FAQ
        title="Borrowing power, answered."
        faqs={FAQS}
        related={[
          { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
          { label: "Increase your borrowing capacity (article)", href: "/blog/home-loans/increase-borrowing-capacity-ahead-of-a-loan-application" },
          { label: "First home buyer loans", href: "/first-home-buyers-loan" },
        ]}
      />
      <CtaBand
        heading="The range is the reason to call."
        intro="Lenders differ by six figures on the same inputs. A broker finds which end of the range is yours - free."
        subject="Borrowing power"
      />
    </main>
  );
}
