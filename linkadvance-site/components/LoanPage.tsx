/* eslint-disable @next/next/no-img-element */
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { PageHero, Section, FeatureGrid, CheckList, FAQ, ProofBar } from "@/components/ServicePage";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";

// The data-driven loan service page - Advance's equivalent of the Wealth
// DiscoveryLanding. One head term per page; copy rewritten answer-first from
// the old site's facts (one broker end-to-end, 35+ lenders, repricing).

export type LoanPageData = {
  path: string;
  serviceName: string;
  serviceDescription: string;
  crumbName: string;
  eyebrow: string;
  h1: string;
  h1Mark: string;
  intro: string;
  bullets: string[];
  heroImage?: string;
  heroImageAlt?: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  features?: { title: string; body: string }[];
  featuresHeading?: string;
  faqs: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  ctaHeading?: string;
  ctaIntro?: string;
  subject: string;
};

export function LoanPage({ data }: { data: LoanPageData }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: data.crumbName, path: data.path },
  ];
  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(data.serviceName, data.serviceDescription, data.path),
          faqSchema(data.faqs),
          breadcrumbSchema(crumbs),
        ]}
      />
      <PageHero
        crumbs={crumbs}
        title={data.h1}
        mark={data.h1Mark}
        intro={data.intro}
        ctaLabel="Talk to a broker for free"
        ctaHref="#contact"
      >
        <div className="mt-6 max-w-xl">
          <CheckList items={data.bullets} />
        </div>
      </PageHero>

      <ProofBar />

      {data.heroImage && (
        <div className="container-x pb-14 pt-10">
          <img
            src={data.heroImage}
            alt={data.heroImageAlt ?? ""}
            loading="lazy"
            className="aspect-[21/8] w-full rounded-3xl object-cover object-bottom"
          />
        </div>
      )}

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl space-y-12">
          {data.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 text-lg text-ink/65">
                  {p}
                </p>
              ))}
              {s.bullets && <CheckList items={s.bullets} />}
            </div>
          ))}
        </div>
      </section>

      {data.features && (
        <Section title={data.featuresHeading ?? "Why LINK Advance."}>
          <FeatureGrid items={data.features} />
        </Section>
      )}

      <Testimonials />

      <FAQ title="Frequently asked questions." faqs={data.faqs} related={data.related} />

      <CtaBand
        heading={data.ctaHeading ?? "One broker, 35+ lenders, zero cost to you."}
        intro={
          data.ctaIntro ??
          "Most home loan broking is paid by the lender, not you. Tell us what you're planning and a broker will call to map your options. Free, no obligation."
        }
        subject={data.subject}
      />
    </main>
  );
}
