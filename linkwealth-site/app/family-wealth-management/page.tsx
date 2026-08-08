import type { Metadata } from "next";
import { DiscoveryLanding } from "@/components/DiscoveryLanding";

// Head term: "family wealth management" (200/mo, KD 9). Previously a
// homepage clone; now owns the family-wealth intent. Hero copy verbatim.

const PATH = "/family-wealth-management";

export const metadata: Metadata = {
  title: { absolute: "Family Wealth Management Brisbane | LINK Wealth Advisors" },
  description:
    "Family wealth management from LINK Wealth's Brisbane advisors: plan, grow and protect your family's wealth with tailored investment, insurance, education and estate strategies.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Family Wealth Management | LINK Wealth",
    description: "Helping you plan, grow, and protect your family's wealth with confidence.",
    url: PATH,
  },
};

export default function Page() {
  return (
    <DiscoveryLanding
      path={PATH}
      serviceName="Family wealth management"
      serviceDescription="Wealth management for families: investment strategy, insurance, education funding, inheritance and estate planning."
      crumbName="Family Wealth Management"
      heroImage="/wp-content/uploads/2024/12/AdobeStock_460793440-min-scaled.jpeg"
      heroImageAlt="A young family at home - planning for their future together"
      eyebrow="Family wealth management"
      h1="Helping you plan, grow, and protect your family’s wealth with confidence."
      h1Mark="family’s wealth"
      bullets={[
        "Talk with a licensed financial adviser about how your family’s wealth can work for you",
        "See if your financial plan is on track and learn steps to grow and protect your family’s assets",
        "Understand how investments, savings, and other financial strategies can work together to secure your family’s future",
        "Plan with clarity and confidence while reducing stress with expert guidance",
      ]}
      sections={[
        {
          heading: "One plan for the whole family's finances.",
          paragraphs: [
            "Family wealth management brings every moving part of your family's finances into one strategy: investments, superannuation, insurance, education funding, property and estate planning - so decisions support each other instead of competing.",
            "Generic, cookie-cutter solutions don't cut it. With tailored advice for your specific situation, you get strategies built for you - your family, your lifestyle, your future.",
          ],
        },
        {
          heading: "What family wealth advice covers.",
          paragraphs: ["Depending on your stage of life, your plan typically brings together:"],
          bullets: [
            "A clear picture of your family's financial position and goals",
            "Investment strategy that matches your goals, not just market trends",
            "Right-fit insurance to protect your growing wealth and family (without upselling)",
            "Education funding, including investment and education bonds for children",
            "Inheritance planning and tax-effective wealth transfer between generations",
            "Estate planning coordination so your wealth ends up where you intend",
          ],
        },
        {
          heading: "Advice that grows with your family.",
          paragraphs: [
            "Get expert guidance when you need it most with one-on-one collaboration and an agile, responsive advisory team who adapts as your goals and circumstances evolve - from first homes and growing families through to inheritance and legacy planning.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What is family wealth management?",
          a: "It is a single, coordinated strategy for your family's finances: investments, super, insurance, education funding, property and estate planning managed together, so each decision supports your family's bigger goals.",
        },
        {
          q: "Can you help us invest for our children?",
          a: "Yes. Education and investment bonds are a tax-effective way to build wealth for children - our advisers use them regularly for school fees and first-home head starts. Read our guide to children's bonds in Australia for how they work.",
        },
        {
          q: "Do you handle inheritances?",
          a: "Yes. We help families make smart, tax-effective decisions with inherited wealth: what to pay down, what to invest, super contribution opportunities and the tax traps to avoid.",
        },
        {
          q: "What does the first meeting cost?",
          a: "Nothing. Your discovery meeting is free and no-obligation - we get to know you and your goals, and you leave knowing exactly what a plan would look like.",
        },
      ]}
      relatedLinks={[
        { label: "Children's bonds guide", href: "/insights/how-to-use-childrens-bonds-in-australia" },
        { label: "Inheritance planning guide", href: "/insights/inheritance-planning" },
        { label: "Retirement planning", href: "/retirement-planning" },
      ]}
    />
  );
}
