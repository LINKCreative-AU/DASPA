/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { ReviewWall, CountUp } from "./ReviewWall";
import { SITE, TEAM } from "@/lib/site";

// The proof page, in the link.com.au treatment: the count-up number, the
// grey review tiles, the people. Review velocity on the Google listing is
// the map-pack lever for "mortgage broker brisbane", and this page is where
// that proof gets indexed. Case studies join when James has them.

const PATH = "/reviews";

export const metadata: Metadata = {
  title: "Reviews | 262 Five-Star Google Reviews",
  description:
    "LINK Advance's Google reviews: 5.0 stars from 262 reviews. Read what Brisbane first home buyers, refinancers and investors say about working with Hugh, Callum, Jacob and the team.",
  alternates: { canonical: PATH },
};

// Counted from the verbatim text of the 24 reviews below.
const MENTIONS: Record<string, number> = { Hugh: 9, Callum: 7, Jacob: 13 };

function Stars({ size = 20 }: { size?: number }) {
  return (
    <span aria-hidden className="inline-flex gap-1 text-advance">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

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

      {/* The count-up header, centred like the link.com.au proof section */}
      <section className="container-x pb-14 pt-10 text-center sm:pt-14">
        <h1 className="mx-auto max-w-2xl font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px]">
          Brisbane borrowers trust LINK Advance<span className="text-advance">.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.4] text-ink/80">
          Every review on this page is real, verbatim, and on a Google listing you can check
          yourself.
        </p>
        <div className="mt-12 font-display text-7xl font-normal tracking-tight text-ink sm:text-8xl">
          <CountUp target={SITE.reviews.count} />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Stars size={16} />
          <span className="text-sm font-semibold text-ink/70">
            {SITE.reviews.rating.toFixed(1)} average on Google
          </span>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-advance"
          >
            Verify them on Google
          </a>
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Worked with us? Leave a review
          </a>
        </div>
      </section>

      {/* The wall: link.com.au tiles, filterable */}
      <section className="container-x pb-20">
        <ReviewWall />
      </section>

      {/* The people the reviews keep naming - the real shot, not tiles */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex items-end justify-center rounded-3xl bg-white px-8 pt-8">
            <img
              src="/wp-content/uploads/2026/05/ADVANCE-the-boys-2025-web-scaled.jpg"
              alt="Jacob, Callum and Hugh, the LINK Advance brokers"
              className="max-h-[460px] w-auto mix-blend-multiply"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The people the reviews keep naming.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-[1.4] text-ink/80">
              No call centres and no hand-offs: the broker who meets you writes the loan,
              drives the approval and reprices it every year after. That&apos;s why the reviews
              name names.
            </p>
            <div className="mt-8 space-y-4">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-4">
                  <img
                    src={m.image}
                    alt={`${m.name}, ${m.role} at LINK Advance`}
                    className="h-14 w-14 rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <p className="text-sm text-ink/65">
                    <span className="block font-semibold text-ink">
                      {m.name} <span className="font-normal text-ink/45">· {m.role}</span>
                    </span>
                    Named in {MENTIONS[m.name]} of the 24 reviews on this page.
                  </p>
                </div>
              ))}
            </div>
            <a
              href="/about-us"
              className="mt-8 inline-block text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              Meet the whole team →
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Ready to be review number 263?"
        intro="The first step is a free, no-obligation chat about what you're trying to do. You'll know within twenty minutes whether we can help."
        subject="Reviews page"
      />
    </main>
  );
}
