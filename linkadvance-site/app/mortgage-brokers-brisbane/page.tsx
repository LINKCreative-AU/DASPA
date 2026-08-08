import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import type { LoanPageData } from "@/components/LoanPage";

// The money term: "mortgage broker brisbane" 1,710/mo KD 24, CPC ~$7. The
// map-pack lever is the 262-review GBP; this page is the organic twin.

const data: LoanPageData = {
  path: "/mortgage-brokers-brisbane",
  serviceName: "Mortgage broking",
  serviceDescription:
    "Brisbane mortgage brokers comparing 35+ lenders: home loans, refinancing, investment and first-home lending with one broker end to end.",
  crumbName: "Mortgage Brokers Brisbane",
  eyebrow: "Mortgage brokers Brisbane",
  h1: "Brisbane mortgage brokers who work for you, not a lender.",
  h1Mark: "for you, not a lender.",
  intro:
    "Fortitude Valley based, Australia wide. One broker handles your whole loan - comparison across 35+ lenders, the negotiation, the paperwork, settlement, and the annual repricing your bank hopes you'll forget.",
  bullets: [
    "10+ years of broking experience across home, investment and business lending",
    "Access to 35+ lenders - the big four are four of them, not all of them",
    "Ongoing home loan repricing and property purchase coaching after settlement",
  ],
  heroImage: "/wp-content/uploads/2020/11/LINK-Heroshot-2025-1.jpg",
  heroImageAlt: "The LINK Advance mortgage brokers in Fortitude Valley, Brisbane",
  sections: [
    {
      heading: "What makes a good Brisbane broker.",
      paragraphs: [
        "Any broker can quote a rate. The work that actually changes your outcome is upstream: knowing which lender's credit policy suits your income type, preparing the application the way that credit team reads it, and clearing the questions before they're asked. That's why our approvals run fast and our clients' rates stay sharp - the file goes to the right lender the first time.",
        "And because your broker doesn't change, neither does the accountability: the person who met you for the first coffee is the one chasing the lender at 4:55pm on settlement day - and the one repricing your rate next year.",
      ],
    },
    {
      heading: "Local, but not limited.",
      paragraphs: [
        "We're based at Level 1, 57 Berwick Street, Fortitude Valley - free parking, good coffee - and most of Brisbane's inner north can walk in. But lending is national: we settle loans across Queensland and Australia-wide, with everything handled by phone and email when that's easier.",
      ],
    },
  ],
  features: [
    { title: "262 five-star reviews.", body: "Real clients, real outcomes, unedited on our Google listing - and reprinted in full below." },
    { title: "Every lane of lending.", body: "Home, first home, refinance, investment, construction, SMSF, business, vehicles - one desk covers it." },
    { title: "Free for home loans.", body: "The lender pays the broker on settlement; we disclose the commission. You pay nothing for the comparison." },
  ],
  faqs: [
    { q: "Is it worth using a mortgage broker in Brisbane?", a: "Brokers now write the majority of Australian home loans, for a simple reason: a broker compares dozens of lenders and negotiates with the leverage of taking your loan elsewhere. You get more competition for your loan at no cost - the lender pays the broker on settlement." },
    { q: "How do mortgage brokers get paid?", a: "For home loans, by the lender: an upfront commission and a small trailing commission, both disclosed to you in full. Brokers are also legally bound by a Best Interests Duty - unlike a bank, whose staff can only sell that bank's products." },
    { q: "Which lenders do you work with?", a: "A panel of 35+ - the majors, regional banks and non-bank lenders. The mix matters: non-banks often win on policy niches (self-employed income, small deposits, credit blemishes) while majors win on price for vanilla loans." },
    { q: "Can you help if the bank said no?", a: "Often, yes. A decline usually means the wrong lender for your situation, not an unlendable situation. Different lenders read self-employment, casual income, existing debts and small deposits completely differently - matching that is the job." },
  ],
  related: [
    { label: "Home loans", href: "/home-loans-brisbane" },
    { label: "Refinancing", href: "/refinancing-brisbane" },
    { label: "Home loan health check", href: "/home-loan-health-check" },
  ],
  subject: "Mortgage broking",
};

export const metadata: Metadata = {
  title: { absolute: "Mortgage Brokers Brisbane | 35+ Lenders, 262 Five-Star Reviews" },
  description:
    "LINK Advance's Brisbane mortgage brokers compare 35+ lenders and stay on your loan for life - repricing included. 5.0 stars across 262 Google reviews. Free for home loans; the lender pays us.",
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: data.intro, url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
