import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { ReviewWall, CountUp } from "./ReviewWall";
import { ReviewStars } from "@/components/Testimonials";
import { CtaBand } from "@/components/CtaBand";
import { Pill } from "@/components/v2";
import { SITE } from "@/lib/site";

// NEW page (Advisors /reviews pattern): the review proof in one indexable
// place, plus the ask - review velocity on the Google listing is the map
// pack lever for "financial advisor brisbane".

const PATH = "/reviews";

export const metadata: Metadata = {
  title: "Reviews | 5.0 Stars on Google",
  description:
    "LINK Wealth's Google reviews: 5.0 stars from 36 reviews. Read what Brisbane business owners, families and retirees say about working with Richard and the team.",
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
          title="We love our clients, and our clients love us."
          mark="love us."
          intro={`${SITE.reviews.count} Google reviews at ${SITE.reviews.rating.toFixed(1)} stars. Every one of them is real, from the listing you can check yourself.`}
          accent
        />
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div>
            <p className="font-display text-6xl font-normal tracking-tight text-ink sm:text-7xl">
              <CountUp target={SITE.reviews.count} />
            </p>
            <div className="mt-2 flex items-center gap-2">
              <ReviewStars size={14} />
              <span className="text-sm font-semibold text-ink/70">
                {SITE.reviews.rating.toFixed(1)} average on Google
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Pill href={SITE.reviews.googleUrl} variant="accent">
            Worked with us? Leave a review
          </Pill>
          <Pill href={SITE.reviews.googleUrl} variant="ghost">
            See the listing on Google
          </Pill>
        </div>
      </section>

      <section className="container-x py-14">
        <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          In their words.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-[1.4] text-ink/80">
          Filter by what each client came in for. The words are exactly as they were left on
          Google; only the labels are ours.
        </p>
        <div className="mt-8">
          <ReviewWall />
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="overflow-hidden rounded-[25px] bg-[#f1f1f1] px-6 pt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wp-content/uploads/2026/06/Wealth-Web-scaled.jpg"
            alt="The LINK Wealth advisory team in Brisbane"
            width={2560}
            height={1676}
            loading="lazy"
            className="mx-auto h-[280px] max-w-full object-contain mix-blend-multiply sm:h-[380px]"
          />
        </div>
        <p className="mt-4 text-sm text-ink/55">
          The team these reviews are about, at the Fortitude Valley office.
        </p>
      </section>

      <CtaBand
        heading="Ready to be the next happy client?"
        intro="The first step is a free, no-obligation consultation. We'll get to know you and your goals. You'll get moving in the right direction. Let's get started."
        subject="Reviews page"
      />
    </main>
  );
}
