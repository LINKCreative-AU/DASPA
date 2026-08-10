import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import type { LoanPageData } from "@/components/LoanPage";

// NEW page from the second research pass: "home loans for doctors" 687/mo
// at KD 1 with a $7 CPC - the professional-waiver niche is a broker's
// natural territory and nobody local owns the SERP.

const data: LoanPageData = {
  path: "/home-loans-for-doctors",
  serviceName: "Home loans for doctors and professionals",
  serviceDescription:
    "Medico and professional lending: LMI waived to 90-95% LVR, higher borrowing capacity and sharper pricing for doctors, dentists, vets and other eligible professions.",
  crumbName: "Home Loans for Doctors",
  eyebrow: "Doctors & professionals",
  h1: "Home loans for doctors: no LMI to 95%, no games.",
  h1Mark: "no LMI to 95%,",
  intro:
    "Lenders compete hard for medical professionals: waived lenders mortgage insurance at 90-95% LVR, sharper pricing and more generous income treatment. The catch: every lender's eligible-professions list and conditions differ, and none of them advertise the best version. That's broker territory.",
  bullets: [
    "LMI waived up to 90-95% LVR for eligible medical professionals, a five-figure saving on most purchases",
    "Overtime, allowances and private income treated generously by the right lenders",
    "Also available (with different limits) for dentists, vets, and at some lenders lawyers and accountants",
  ],
  sections: [
    {
      heading: "How the medico waiver actually works.",
      paragraphs: [
        "Several lenders waive LMI entirely for eligible medical professionals borrowing up to 90% (and a handful go to 95%) because the data says medicos don't default. On an $800,000 purchase with 10% down, that's roughly $15,000-$18,000 of LMI that simply doesn't get charged. Eligibility usually turns on your profession (and sometimes AHPRA registration or association membership), not your income.",
        "The lists differ by lender: GPs, specialists, dentists and vets are widely included; optometrists, pharmacists, physios and others appear on some lists and not others. Lawyers and accountants get similar (usually 90%) waivers at a smaller set of lenders. Which lender's list you fit (and which of those prices best for your loan) is a ten-minute broker question.",
      ],
    },
    {
      heading: "It's not just the waiver.",
      paragraphs: [
        "The same lenders often treat medical income more generously: higher acceptance of overtime and on-call allowances, private billings for specialists, and higher loan-to-income appetite. For junior doctors the practical effect is buying years earlier with a small deposit and no LMI; for established specialists it's structure (trusts, investment lending and practice finance), where the group's accountants and advisers plug in.",
      ],
    },
  ],
  features: [
    { title: "The lists, current.", body: "Eligible professions and LVR caps change. We keep the live matrix across the panel, so you fit where you fit." },
    { title: "Beyond the purchase.", body: "Practice finance, equipment and SMSF premises lending for practice owners: one desk, the whole picture." },
    { title: "The group behind it.", body: "LINK Advisors on tax and structure, LINK Wealth on strategy, useful once incomes get serious." },
  ],
  faqs: [
    { q: "Which professions get LMI waived?", a: "Most widely: doctors (GPs, specialists, registrars, interns), dentists and vets. Depending on the lender: optometrists, pharmacists, chiropractors, physiotherapists and mid-tier health professions. Lawyers and accountants get 90% waivers at a smaller set of lenders. Each lender maintains its own list. We match you against all of them." },
    { q: "Do I need a big income to qualify?", a: "No. The waiver is profession-based, not income-based. Junior doctors on registrar salaries routinely qualify. Some lenders set minimum income thresholds for the 95% tier, but the 90% tier is broadly accessible." },
    { q: "How much does the waiver actually save?", a: "LMI on a 90% loan typically runs 1.5-2.6% of the loan amount, roughly $11,000-$19,000 on a $720,000 loan. Waived means zero, and unlike the First Home Guarantee there are no property price caps or first-home requirements." },
    { q: "Can I combine this with other benefits?", a: "Often. A first-home medico can stack the FHOG, stamp duty relief and a waiver instead of using a Guarantee place, keeping the price caps out of the picture. The right combination depends on the purchase; that's the modelling we do before applying." },
  ],
  related: [
    { label: "LMI calculator: what you'd avoid", href: "/lenders-mortgage-insurance-calculator" },
    { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
    { label: "First home buyer loans", href: "/first-home-buyers-loan" },
  ],
  ctaHeading: "Find your waiver.",
  ctaIntro: "Tell us your profession and the plan. A broker will map which lenders waive LMI for you and what they'll lend. Free, no obligation.",
  subject: "Doctors & professionals",
};

export const metadata: Metadata = {
  title: { absolute: "Home Loans for Doctors | LMI Waived to 95% LVR | LINK Advance" },
  description:
    "Medico home loans: LMI waived at 90-95% LVR for doctors, dentists and vets (and 90% for some other professions), generous income treatment and no price caps. Brisbane brokers across 35+ lenders.",
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: data.intro, url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
