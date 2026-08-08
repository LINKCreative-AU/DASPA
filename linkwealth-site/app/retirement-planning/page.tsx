import type { Metadata } from "next";
import { DiscoveryLanding } from "@/components/DiscoveryLanding";

// Head terms: "retirement planning brisbane" (164/mo) + "retirement planning
// australia" (500/mo, KD 15, 17k traffic potential) + "retirement financial
// advisor" (657/mo) + "superannuation advice brisbane" (173/mo) secondary.
// The old URL served the homepage title tag and body - it now owns the
// retirement intent outright. Hero copy verbatim from the live page.

const PATH = "/retirement-planning";

export const metadata: Metadata = {
  title: { absolute: "Retirement Planning Brisbane | Financial Advisors | LINK Wealth" },
  description:
    "Retirement planning advice from LINK Wealth's Brisbane financial advisors. See how your super, savings and the Age Pension can work together, find out if you're on track, and get a clear roadmap to retire with confidence.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Retirement Planning Brisbane | LINK Wealth",
    description: "Helping you preserve wealth and plan for retirement with confidence.",
    url: PATH,
  },
};

export default function Page() {
  return (
    <DiscoveryLanding
      path={PATH}
      serviceName="Retirement planning"
      serviceDescription="Retirement planning and superannuation advice for professionals, pre-retirees and retirees in Brisbane and across Australia."
      crumbName="Retirement Planning"
      eyebrow="Retirement planning, Brisbane"
      h1="Helping you preserve wealth and plan for retirement with confidence."
      h1Mark="retirement"
      bullets={[
        "Talk with a licensed financial adviser about your retirement goals and what level of retirement savings you will need to achieve your objectives.",
        "Find out if you’re on track and if not, what do you need to do to achieve your goals.",
        "See how your super, savings and the Age Pension could work together to fund your retirement.",
        "Have a clear roadmap on how to meet your retirement objectives and move forward with confidence!",
      ]}
      sections={[
        {
          heading: "Retirement planning that starts with your life, not a product.",
          paragraphs: [
            "Retirement planning is working out the lifestyle you want, what it costs, and how your superannuation, savings, investments and the Age Pension can fund it - then putting a strategy in place while time is still on your side.",
            "You get a detailed, step-by-step plan tailored to your timeline. We map out clear actions for today and tomorrow. So you're set for 5, 10, or 20 years down the line.",
            "The earlier you start, the more options you have: contribution strategies, transition-to-retirement pensions, investment structures and tax planning all work harder with time.",
          ],
        },
        {
          heading: "What your retirement plan covers.",
          paragraphs: [
            "Every plan is built for your situation, and typically brings together:",
          ],
          bullets: [
            "How much you'll need to retire, and how close you are now",
            "Superannuation contribution strategies and fund review",
            "Investment strategy inside and outside super",
            "Transition-to-retirement and pension drawdown options",
            "Age Pension and Centrelink entitlement planning",
            "Tax-effective income structuring for retirement",
            "Estate and legacy considerations for your family",
          ],
        },
        {
          heading: "Prefer to test the waters first?",
          paragraphs: [
            "Start with the free retirement readiness check: your age, balance and lifestyle target against the ASFA benchmarks, with the gap (and what closing it takes) in today's dollars.",
            "Then our 90-minute Retirement Funding Workshop ($660, Value Guarantee included) models your current and projected position one-on-one with a licensed adviser, so you can see exactly how you are tracking before committing to full advice.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much do I need to retire in Australia?",
          a: "It depends on the lifestyle you want. As a reference point, the ASFA Retirement Standard estimates a comfortable retirement costs roughly $52,000 a year for singles and $73,000 for couples who own their home. Your own number depends on your spending, health, housing and plans - which is exactly what a retirement plan works out.",
        },
        {
          q: "When should I start retirement planning?",
          a: "Earlier than you think. From about age 45 the levers get powerful: contribution strategies, investment structure and tax planning all compound with time. But a plan adds value at any age - including after you have already retired.",
        },
        {
          q: "Do you advise on superannuation?",
          a: "Yes. Superannuation advice is central to retirement planning: reviewing your fund and investment options, contribution strategies, transition-to-retirement pensions, and whether a self-managed super fund suits your situation.",
        },
        {
          q: "What does retirement advice cost?",
          a: "Your first discovery meeting is free and no-obligation. If you want to see detailed modelling before committing, the Retirement Funding Workshop is $660 with LINK's Value Guarantee. Ongoing advice fees are quoted up front once we understand your situation.",
        },
      ]}
      relatedLinks={[
        { label: "Free retirement readiness check", href: "/how-much-do-i-need-to-retire" },
        { label: "Retirement Funding Workshop", href: "/retirement-funding-workshop-link-wealth" },
        { label: "SMSF commercial property", href: "/smsf" },
        { label: "Family wealth management", href: "/family-wealth-management" },
      ]}
    />
  );
}
