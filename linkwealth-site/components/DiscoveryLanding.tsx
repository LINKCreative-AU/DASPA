import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CheckList, FAQ } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { ContactForm } from "@/components/ContactForm";

// Shared frame for the three discovery-meeting service pages (retirement,
// family wealth, high net worth). On the old site these URLs served a unique
// hero + lead form and then a byte-for-byte copy of the homepage - all three
// even shared the homepage title tag. Each page now owns one intent: unique
// meta, unique body sections, FAQPage schema, same hero copy verbatim.
// Layout = the shared V1.5 page bones.

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
      <section className="container-x grid items-start gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-2">
        <div>
          <SectionHead as="h1" eyebrow={eyebrow} title={h1} mark={h1Mark} accent />
          <p className="mt-6 font-semibold text-ink">It starts with a simple conversation</p>
          <CheckList items={bullets} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            Book your free discovery meeting to get started.
          </h2>
          <p className="mb-4 mt-2 text-sm text-ink/55">
            Fill out the form below and we’ll be in touch within a few business hours to
            discuss your needs and set up a time for your discovery meeting.
          </p>
          <ContactForm variant="discovery" subject={crumbName} />
        </div>
      </section>

      {/* Unique supporting content - one intent per page */}
      {sections.map((s, i) => (
        <section
          key={s.heading}
          className={i % 2 === 0 ? "border-y border-ink/10 bg-neutral-50 py-20" : "py-20"}
        >
          <div className="container-x max-w-3xl">
            <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
              {s.heading}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-5 text-lg text-ink/65">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink/70">
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
      <FAQ title={faqHeading} faqs={faqs} related={relatedLinks} />

      <CtaBand variant="discovery" subject={crumbName} formTitle="Book your free discovery meeting" />
    </main>
  );
}
