import Image from "next/image";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";
import symbol from "@/public/link-symbol-reversed.png";

const SERVICES = [
  { label: "Home loans", href: "/home-loans-brisbane" },
  { label: "First home buyers", href: "/first-home-buyers-loan" },
  { label: "Refinancing", href: "/refinancing-brisbane" },
  { label: "Investment loans", href: "/investment-home-loans" },
  { label: "Construction loans", href: "/construction-loans-brisbane" },
  { label: "SMSF loans", href: "/smsf-mortgage-broker" },
  { label: "Business loans", href: "/business-loans" },
  { label: "Car & equipment finance", href: "/business-car-and-equipment-loans" },
  { label: "Home loans for doctors", href: "/home-loans-for-doctors" },
];

const FIRSTHOME = [
  { label: "First Home Buyers Grant QLD", href: "/first-home-buyers-grant" },
  { label: "First Home Guarantee", href: "/first-home-guarantee" },
  { label: "First home buyer loans", href: "/first-home-buyers-loan" },
  { label: "First Home Super Saver", href: "/first-home-super-saver" },
];

const RESOURCES = [
  { label: "Home loan health check", href: "/home-loan-health-check" },
  { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
  { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
  { label: "LMI calculator", href: "/lenders-mortgage-insurance-calculator" },
  { label: "Stamp duty QLD calculator", href: "/stamp-duty-calculator-qld" },
  { label: "Articles", href: "/blog" },
];

const COMPANY = [
  { label: "Meet the brokers", href: "/about-us" },
  { label: "Reviews", href: "/reviews" },
  { label: "Mortgage brokers Brisbane", href: "/mortgage-brokers-brisbane" },
  { label: "Contact", href: "/contact-us" },
];

const LEGAL = [
  { label: "Privacy policy", href: SITE.legal.privacyPath },
  { label: "E-mail disclaimer", href: SITE.legal.emailDisclaimerPath },
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
              Brisbane mortgage and finance brokers with direct access to over 35
              lenders. We make lending easy. {SITE.group.line}
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
          <FooterCol title="First home" links={FIRSTHOME} />
          <FooterCol title="Resources" links={RESOURCES} />
          <div className="space-y-10">
            <FooterCol title="Company" links={COMPANY} />
            <FooterCol title="Legal" links={LEGAL} />
          </div>
        </div>

        {/* Credit licence text (NCCP) - the licence chain carried verbatim
            from the old site. Every page must show it - do not trim or reword
            without the licensee's sign-off. */}
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
        <span className="text-advance-bright">.</span>
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
