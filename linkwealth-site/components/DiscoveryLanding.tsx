import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { ContactForm } from "@/components/ContactForm";

// Shared frame for the three discovery-meeting service pages (retirement,
// family wealth, high net worth). On the old site these URLs served a unique
// hero + lead form and then a byte-for-byte copy of the homepage - all three
// even shared the homepage title tag. Each page now owns one intent: unique
// meta, unique body sections, FAQPage schema, same hero copy verbatim.

export type LandingSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export function DiscoveryLanding({
  path,
  serviceName,
  serviceDescription,
  crumbName,
  eyebrow,
  h1,
  h1Mark,
  bullets,
  sections,
  faqs,
  faqHeading = "Your questions, answered.",
  relatedLinks,
}: {
  path: string;
  serviceName: string;
  serviceDescription: string;
  crumbName: string;
  eyebrow: string;
  h1: string;
  h1Mark?: string;
  bullets: string[];
  sections: LandingSection[];
  faqs: { q: string; a: string }[];
  faqHeading?: string;
  relatedLinks: { label: string; href: string }[];
}) {
  const title = h1Mark ? (
    <>
      {h1.slice(0, h1.indexOf(h1Mark))}
      <span className="marker">{h1Mark}</span>
      {h1.slice(h1.indexOf(h1Mark) + h1Mark.length)}
    </>
  ) : (
    h1
  );

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(serviceName, serviceDescription, path),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: crumbName, path },
          ]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: crumbName, path }]} />

      {/* Hero + discovery form, copy verbatim from the live page */}
      <section className="container-x grid items-start gap-12 py-14 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="eyebrow text-wealth-dark">{eyebrow}</span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 font-semibold text-ink">It starts with a simple conversation</p>
          <ul className="mt-4 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-ink/75">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="mt-1 shrink-0 text-wealth-dark"
                >
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m6 10 2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Book your free discovery meeting to get started.
          </h2>
          <p className="mb-4 mt-2 text-sm text-ink/60">
            Fill out the form below and we’ll be in touch within a few business hours to
            discuss your needs and set up a time for your discovery meeting.
          </p>
          <ContactForm variant="discovery" subject={crumbName} />
        </div>
      </section>

      {/* Unique supporting content - one intent per page */}
      {sections.map((s, i) => (
        <section key={s.heading} className={i % 2 === 0 ? "bg-cloud py-16 sm:py-24" : "py-16 sm:py-24"}>
          <div className="container-x max-w-4xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {s.heading}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-5 text-lg text-ink/70">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink/75">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <Testimonials />

      {/* FAQs (visible text and schema kept in sync) */}
      <section className="py-16 sm:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            {faqHeading}
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl2 border border-line bg-white p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-bold text-ink marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            {relatedLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:border-wealth-dark hover:text-ink"
              >
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand variant="discovery" subject={crumbName} formTitle="Book your free discovery meeting" />
    </main>
  );
}
