import type { Metadata } from "next";
import { DiscoveryLanding } from "@/components/DiscoveryLanding";

// Head terms: "high net worth financial advisor" (98/mo, KD 0) + "wealth
// management brisbane" (357/mo, KD 10). Previously a homepage clone; now
// owns the HNW intent. Hero copy verbatim.

const PATH = "/high-net-worth-wealth-advisors";

export const metadata: Metadata = {
  title: { absolute: "High Net Worth Financial Advisors | Wealth Management Brisbane" },
  description:
    "Exclusive wealth advisory for high net worth individuals from LINK Wealth in Brisbane: investment, trust and tax strategies working together to preserve and grow your wealth and legacy.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "High Net Worth Wealth Advisors | LINK Wealth",
    description: "Exclusive Wealth Advisory for High Net Worth Individuals.",
    url: PATH,
  },
};

export default function Page() {
  return (
    <DiscoveryLanding
      path={PATH}
      serviceName="High net worth wealth advisory"
      serviceDescription="Wealth management for high net worth individuals and families: investment strategy, trusts, tax structuring and legacy planning."
      crumbName="High Net Worth Advisory"
      eyebrow="Wealth management, Brisbane"
      h1="Exclusive Wealth Advisory for High Net Worth Individuals"
      h1Mark="High Net Worth"
      bullets={[
        "Speak with a dedicated wealth advisor about your long-term financial vision",
        "Discover whether your current strategy supports your lifestyle and legacy goals",
        "See how investments, trusts, and tax strategies can work together to preserve and grow your wealth",
        "Plan with clarity and confidence through expert high-net-worth guidance",
      ]}
      sections={[
        {
          heading: "Wealth management built around preservation and growth.",
          paragraphs: [
            "With significant wealth, the questions change: it is less about accumulating and more about structuring - protecting what you have built, growing it tax-effectively, and moving it to the next generation on your terms.",
            "Our advisers work with a deliberately small number of high net worth clients, integrating investment strategy, trust and company structures, superannuation and estate planning into one coordinated plan.",
          ],
        },
        {
          heading: "What high net worth advisory covers.",
          paragraphs: ["Your strategy typically brings together:"],
          bullets: [
            "Portfolio strategy across shares, property, managed portfolios and alternatives",
            "Family trust, bucket company and investment bond structuring",
            "Superannuation and SMSF strategy, including commercial property",
            "Tax planning coordinated with your accountant",
            "Asset protection and right-fit personal insurance",
            "Succession, legacy and intergenerational wealth transfer",
          ],
        },
        {
          heading: "The whole LINK group behind your strategy.",
          paragraphs: [
            "Wealth strategies at this level touch tax, lending and accounting. Through the LINK group, your adviser coordinates chartered accountants (LINK Advisors) and lending specialists (LINK Advance) as regulation allows - one connected team, rather than three firms who never speak.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Who counts as a high net worth client?",
          a: "There is no strict threshold. Our high net worth advisory typically suits individuals and families with $2m+ in investable assets outside the family home, or business owners approaching a liquidity event, where structure and tax strategy start to matter as much as investment selection.",
        },
        {
          q: "Do you work with trusts and companies?",
          a: "Yes. Family trusts, bucket companies, investment bonds and SMSFs are core tools in high net worth planning - we assess the tax efficiency of your existing structures and model alternatives before recommending changes.",
        },
        {
          q: "Can you work alongside my existing accountant and lawyer?",
          a: "Yes. We regularly coordinate with clients' existing accountants and estate lawyers. If you prefer one connected team, the LINK group includes chartered accountants and lending specialists who work together with your consent.",
        },
        {
          q: "How do your fees work?",
          a: "Fees are agreed up front and quoted for your situation - no percentage-of-assets surprises. The first conversation is free, confidential and no-obligation.",
        },
      ]}
      relatedLinks={[
        { label: "Selling your business (LINK exits practice)", href: "https://link.com.au/selling-your-business" },
        { label: "SMSF commercial property", href: "/smsf" },
        { label: "Business owner wealth extraction", href: "/business-owner-wealth-extraction-workshop-link-wealth" },
        { label: "Tailored wealth strategies case study", href: "/case-studies/tailored-wealth-strategies-why-personalised-advice-matters-more-than-ever" },
      ]}
    />
  );
}
