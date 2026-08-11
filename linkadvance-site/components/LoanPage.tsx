/* eslint-disable @next/next/no-img-element */
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/Schema";
import { PageHero, Section, FeatureGrid, CheckList, FAQ, ProofBar } from "@/components/ServicePage";
import { ReviewStrip } from "@/components/ReviewStrip";
import { ReviewsFor } from "@/components/ReviewsFor";
import { CtaBand } from "@/components/CtaBand";
import type { Service } from "@/lib/reviews";

// The data-driven loan service page, on the V2 rhythm: hero with the page's
// photo on a grey tile, prose sections that change treatment as they go
// (bullet sections split two-column, worked examples sit on ink cards), the
// broker band, then either topic-matched reviews or the drifting review
// tiles. Copy lives in lib/loans.ts.

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
  // true when heroImage is a studio headshot, not a white cutout
  heroPhoto?: boolean;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  features?: { title: string; body: string }[];
  featuresHeading?: string;
  faqs: { q: string; a: string }[];
  related?: { label: string; href: string }[];
  ctaHeading?: string;
  ctaIntro?: string;
  subject: string;
  // When a page has reviews from clients who came in for exactly this, show
  // those instead of the sitewide drifting strip: proof beside the claim.
  reviewService?: Service;
  reviewHeading?: string;
  reviewIntro?: string;
};

function BodySection({ s, flip }: { s: LoanPageData["sections"][number]; flip: boolean }) {
  const isExample = /example/i.test(s.heading);

  if (isExample) {
    // Worked examples get the ink card: the numbers deserve a stage.
    return (
      <div className="rounded-[25px] bg-ink p-8 text-white sm:p-12">
        <h2 className="max-w-2xl font-display text-[34px] font-normal leading-[1.15] tracking-tight sm:text-[44px]">
          {s.heading}
        </h2>
        {s.paragraphs.map((p) => (
          <p key={p.slice(0, 40)} className="mt-5 max-w-3xl text-lg leading-[1.5] text-white/80">
            {p}
          </p>
        ))}
        {s.bullets && (
          <div className="max-w-3xl [&_li]:!text-white/80 [&_svg]:!text-advance-bright">
            <CheckList items={s.bullets} dark />
          </div>
        )}
      </div>
    );
  }

  if (s.bullets) {
    // Bullet sections split: prose one side, the list on a grey tile.
    return (
      <div className={`grid items-start gap-8 lg:grid-cols-2 ${flip ? "" : ""}`}>
        <div className={flip ? "lg:order-2" : ""}>
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            {s.heading}
          </h2>
          {s.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="mt-4 text-lg leading-[1.4] text-ink/80">
              {p}
            </p>
          ))}
        </div>
        <div className={`rounded-[25px] bg-[#f1f1f1] p-7 sm:p-8 ${flip ? "lg:order-1" : ""}`}>
          <CheckList items={s.bullets} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
        {s.heading}
      </h2>
      {s.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="mt-4 text-lg leading-[1.4] text-ink/80">
          {p}
        </p>
      ))}
    </div>
  );
}

export function LoanPage({ data }: { data: LoanPageData }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: data.crumbName, path: data.path },
  ];
  let bulletCount = 0;
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
        eyebrow={data.eyebrow}
        title={data.h1}
        mark={data.h1Mark}
        intro={data.intro}
        ctaLabel="Talk to a broker"
        ctaHref="#contact"
        panelImage={data.heroImage}
        panelImageAlt={data.heroImageAlt}
        panelPhoto={data.heroPhoto}
      >
        <div className="mt-6 max-w-xl">
          <CheckList items={data.bullets} />
        </div>
      </PageHero>

      <ProofBar />

      <section className="py-20 sm:py-24">
        <div className="container-x space-y-16 sm:space-y-20">
          {data.sections.map((s) => {
            const flip = s.bullets && !/example/i.test(s.heading) ? bulletCount++ % 2 === 1 : false;
            return <BodySection key={s.heading} s={s} flip={flip} />;
          })}
        </div>
      </section>

      {data.features && (
        <Section title={data.featuresHeading ?? "Why LINK Advance."}>
          <FeatureGrid items={data.features} cards />
        </Section>
      )}

      {/* The people, on every lending page - the broker who meets you writes
          the loan (cutout on the grey tile, never a 21/8 crop) */}
      <section className="py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-end justify-center rounded-[25px] bg-[#f1f1f1] px-8 pt-6">
            <img
              src="/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg"
              alt="Jacob, Callum and Hugh, the LINK Advance brokers"
              className="max-h-[360px] w-auto mix-blend-multiply"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Your broker, not a call centre.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-[1.4] text-ink/80">
              Hugh, Callum and Jacob write every loan themselves: the person who meets you is
              the person who structures the deal, drives the approval and reprices your rate
              every six months after settlement. That&apos;s why 262 Google reviews name them
              personally.
            </p>
            <a
              href="/about-us"
              className="mt-6 inline-block text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              Meet the team →
            </a>
          </div>
        </div>
      </section>

      {data.reviewService ? (
        <ReviewsFor
          service={data.reviewService}
          heading={data.reviewHeading ?? "What clients who came in for this say."}
          intro={data.reviewIntro}
        />
      ) : (
        <ReviewStrip />
      )}

      <FAQ title="Frequently asked questions." faqs={data.faqs} related={data.related} />

      <CtaBand
        heading={data.ctaHeading ?? "One broker, 35+ lenders, zero cost to you."}
        intro={
          data.ctaIntro ??
          "Most home loan broking is paid by the lender, not you. Tell us what you're planning and a broker will call to map your options. No obligation."
        }
        subject={data.subject}
      />
    </main>
  );
}
