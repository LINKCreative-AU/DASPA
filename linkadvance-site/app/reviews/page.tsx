import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { Testimonials } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { SITE } from "@/lib/site";

// NEW page (Advisors /reviews pattern): the review proof in one indexable
// place, plus the ask - review velocity on the Google listing is the map
// pack lever for "mortgage broker brisbane".

const PATH = "/reviews";

export const metadata: Metadata = {
  title: "Reviews | 5.0 Stars on Google",
  description:
    "LINK Advance's Google reviews: 5.0 stars from 262 reviews. Read what Brisbane home buyers, refinancers and business owners say about working with Hugh, Callum, Jacob and the team.",
  alternates: { canonical: PATH },
};

export default function Reviews() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Reviews", path: PATH },
        ])}
      />
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Reviews", path: PATH }]} />

      <section className="container-x pb-4 pt-10 sm:pt-14">
        <SectionHead
          as="h1"
          eyebrow="Reviews"
          title="We love our clients, and our clients love us."
          mark="love us."
          intro={`${SITE.reviews.count} Google reviews at ${SITE.reviews.rating.toFixed(1)} stars. Every one of them is real, from the listing you can check yourself.`}
          accent
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            See the listing on Google
          </a>
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-advance"
          >
            Worked with us? Leave a review
          </a>
        </div>
      </section>

      <Testimonials heading="In their words." />

      <CtaBand
        heading="Ready to be the next happy client?"
        intro="The first step is a free, no-obligation consultation. We'll get to know you and your goals. You'll get moving in the right direction. Let's get started."
        subject="Reviews page"
      />
    </main>
  );
}
