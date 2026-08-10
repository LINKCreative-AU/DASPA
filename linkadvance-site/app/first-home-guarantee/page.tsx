import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ, CheckList } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";

// NEW page: "first home guarantee" 2,438/mo at KD 0 with 23k traffic
// potential - the biggest soft territory on Advance's map. The SERP is
// government sites and an unanswered PAA box; no broker owns a plain-English
// explainer. Facts current to the 1 Oct 2025 expansion (no income caps,
// unlimited places, higher price caps), hedged with housingaustralia.gov.au
// named as the official source.

const PATH = "/first-home-guarantee";

export const metadata: Metadata = {
  title: { absolute: "First Home Guarantee: Buy With a 5% Deposit, No LMI (2026 Guide)" },
  description:
    "The expanded First Home Guarantee lets first home buyers purchase with a 5% deposit and no LMI, now with no income caps and unlimited places. How it works, QLD price caps, the downsides, and how to apply through a participating lender.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "First Home Guarantee - 5% deposit, no LMI, explained straight",
    description: "No income caps, unlimited places, real price caps, and the trade-offs nobody mentions.",
    url: PATH,
  },
};

const FAQS = [
  {
    q: "How does the First Home Guarantee scheme work?",
    a: "The federal government guarantees up to 15% of your loan, so a participating lender will lend to you with just a 5% deposit without charging lenders mortgage insurance. It's not a cash payment. It's a guarantee that removes the LMI a low-deposit borrower would normally pay, which on a $600,000 purchase can save well over $20,000.",
  },
  {
    q: "What are the downsides of the First Home Guarantee?",
    a: "Three honest ones. Borrowing at 95% means bigger repayments and much more interest over the loan's life than a 20% deposit loan. A small deposit leaves you exposed if prices dip: you can owe close to what the home is worth. And only participating lenders offer it, so the sharpest advertised rate in the market may not be available inside the scheme. It's still often the right call (renting while saving 20% has costs too), but it's a numbers decision, not a default.",
  },
  {
    q: "Is $40,000 enough for a house deposit?",
    a: "Under the Guarantee, $40,000 is 5% of an $800,000 purchase (within the QLD price caps), though you'll also need stamp duty (often zero for first-home buyers in QLD now) and legal/loan costs on top. Without the scheme, $40,000 would normally mean paying LMI. A broker can tell you quickly what your savings support.",
  },
  {
    q: "How much deposit do I need for a $700,000 house?",
    a: "Through the First Home Guarantee: about $35,000 (5%) plus purchase costs. Outside the scheme: roughly $70,000 (10%) with LMI, or $140,000 (20%) without it. In Queensland a new-build first home at that price now also pays zero stamp duty, which changes the total cash needed materially.",
  },
  {
    q: "Who is eligible now that income caps are gone?",
    a: "Since 1 October 2025 the scheme has no income caps and no place limits. You still need to be an Australian citizen or permanent resident, 18+, buying your first home (or not having owned in the last ten years), planning to live in it, and buying under your region's property price cap through a participating lender. Official criteria: housingaustralia.gov.au.",
  },
  {
    q: "Can I use the Guarantee with the $30,000 QLD grant?",
    a: "Yes, they stack. A new build can combine the First Home Owner Grant ($30,000), zero QLD stamp duty, the 5% deposit Guarantee and the First Home Super Saver scheme. Sequencing them correctly with the loan is exactly what your broker is for.",
  },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "First Home Guarantee", path: PATH },
];

export default function Page() {
  return (
    <main>
      <JsonLd data={[faqSchema(FAQS), breadcrumbSchema(CRUMBS)]} />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            title="Buy your first home with a 5% deposit and no LMI."
            mark="no LMI."
            intro="The First Home Guarantee has the federal government guarantee part of your loan so a participating lender accepts a 5% deposit without charging lenders mortgage insurance. Since October 2025 there are no income caps and no place limits. The question is no longer whether you qualify, but whether the numbers suit you."
            accent
          />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              What it actually does.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              Normally, borrowing more than 80% of a property's value means paying lenders
              mortgage insurance, a premium that can run from a few thousand dollars to well
              over $25,000, protecting the lender, not you. Under the Guarantee, Housing
              Australia guarantees up to 15% of the loan instead, so the lender treats your 5%
              deposit like 20%. No LMI, years less saving.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              The eligibility tests that remain.
            </h2>
            <CheckList
              items={[
                "Australian citizen or permanent resident, 18 or older",
                "First home buyer, or no property owned in Australia in the past ten years",
                "You'll live in the home (owner-occupiers only, not investors)",
                "The price is under your area's property price cap",
                "The loan is with a participating lender (not every lender is in the scheme)",
              ]}
            />
            <p className="mt-4 text-lg text-ink/65">
              Price caps vary by state and region and get revised. In south-east Queensland
              the cap sits in the high hundreds of thousands, with regional caps lower. Check
              your exact suburb's cap at housingaustralia.gov.au, or ask us. It takes a
              minute.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              The downsides, said out loud.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              A 95% loan means bigger repayments and substantially more interest over the life
              of the loan than a bigger-deposit loan; a thin equity buffer if prices dip; and
              a smaller pool of lenders, so the scheme rate may not be the market's sharpest.
              None of that makes it a bad deal (buying years earlier has real value, and rent
              isn't free either), but the comparison deserves actual numbers. That's the free
              part of our job.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              How to apply.
            </h2>
            <p className="mt-4 text-lg text-ink/65">
              You don't apply to the government. The scheme runs through participating
              lenders, and your broker reserves your place as part of the loan application.
              We check the price cap for your target area, pick the participating lender whose
              policy and pricing suit you, and stack the QLD grant and stamp duty relief on
              top where they apply.
            </p>
          </div>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
          { label: "LMI calculator: what you're avoiding", href: "/lenders-mortgage-insurance-calculator" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
        ]}
      />

      <CtaBand
        heading="5% deposit, full picture."
        intro="A broker will check your price cap, compare participating lenders and stack every grant you're entitled to. Free, no obligation."
        subject="First Home Guarantee"
      />
    </main>
  );
}
