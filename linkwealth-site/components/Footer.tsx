import Image from "next/image";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";
import symbol from "@/public/link-symbol-reversed.png";

const SERVICES = [
  { label: "Retirement planning", href: "/retirement-planning" },
  { label: "Property investment advice", href: "/property-investment-advice" },
  { label: "Family wealth management", href: "/family-wealth-management" },
  { label: "High net worth advisory", href: "/high-net-worth-wealth-advisors" },
  { label: "SMSF commercial property", href: "/smsf" },
];

const WORKSHOPS = [
  {
    label: "Business owner wealth extraction",
    href: "/business-owner-wealth-extraction-workshop-link-wealth",
  },
  { label: "Retirement funding", href: "/retirement-funding-workshop-link-wealth" },
  { label: "Equity strategy", href: "/home-equity-long-term-wealth-strategy" },
];

const RESOURCES = [
  { label: "All tools", href: "/tools" },
  { label: "Wealth health check", href: "/wealth-health-check" },
  { label: "Home equity calculator", href: "/home-equity-estimator-calculator" },
  { label: "Retirement readiness check", href: "/how-much-do-i-need-to-retire" },
  { label: "What financial advice costs", href: "/how-much-does-a-financial-advisor-cost" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Insights", href: "/insights" },
];

const COMPANY = [
  { label: "The team", href: "/team" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy policy", href: SITE.legal.privacyPdf, external: true },
  { label: "Advisor profile & Financial Services Guide", href: SITE.legal.fsgPdf, external: true },
  { label: "Careers", href: SITE.group.careersUrl, external: true },
];

export function Footer() {
  return (
    <footer className="bg-ink py-16 text-white">
      <div className="container-x">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark height={22} />
            <p className="mt-5 max-w-xs text-sm text-white/70">
              Financial advisors helping business owners and professionals grow
              their personal wealth. {SITE.group.line}
            </p>
            <p className="mt-5 text-sm text-white/70">
              {SITE.address.street}
              <br />
              {SITE.address.suburb}, {SITE.address.state} {SITE.address.postcode}
              <br />
              <a href={SITE.phoneHref} className="hover:text-white">
                {SITE.phone}
              </a>
            </p>
            <p className="mt-5 text-sm text-white/70">
              Google rating {SITE.reviews.rating.toFixed(1)} · based on{" "}
              {SITE.reviews.count} reviews
            </p>
          </div>

          <FooterCol title="How we help" links={SERVICES} />
          <FooterCol title="Workshops" links={WORKSHOPS} />
          <FooterCol title="Resources" links={RESOURCES} />
          <div className="space-y-10">
            <FooterCol title="Company" links={COMPANY} />
            <FooterCol title="Legal" links={LEGAL} />
          </div>
        </div>

        {/* AFSL compliance text, carried verbatim from the old site footer.
            Every page must show it - do not trim or reword without the
            licensee's sign-off. */}
        <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45">
          <p>{SITE.legal.publisher}</p>
          <p>{SITE.legal.disclaimer}</p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} LINK. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>
              Part of{" "}
              <a href={SITE.group.url} className="underline hover:text-white/80">
                LINK
              </a>
              . Power forward.
            </p>
            <a href={SITE.group.url} aria-label="LINK group">
              <Image src={symbol} alt="LINK symbol" height={26} className="opacity-90" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="font-semibold text-white">
        {title}
        <span className="text-wealth-bright">.</span>
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
