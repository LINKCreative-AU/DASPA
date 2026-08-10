/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { ReviewWall, CountUp } from "./ReviewWall";
import { SITE, TEAM } from "@/lib/site";
import { ALL_REVIEWS } from "@/lib/reviews";
import { Icon } from "@/components/Icons";

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
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink/55">
          These {ALL_REVIEWS.length} are the reviews published in full on this site, reproduced word
          for word.
          The full set of {SITE.reviews.count} sits on our Google listing, where you can also
          see who wrote them and when.{" "}
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-4"
          >
            Read every review on Google
          </a>
          .
        </p>
      </section>


      {/* What the reviews keep saying. Every count is computed from the
          verbatim text of the 24 reviews above, so it can be checked. */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <h2 className="max-w-2xl font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The same four things, over and over.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-[1.4] text-ink/80">
            Counted from the words in the 24 reviews on this page, not from a
            marketing workshop.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 15, icon: Icon.star, title: "Recommend us outright.", quote: "Highly recommend to anyone needing an amazing mortgage broking team." },
              { n: 12, icon: Icon.shieldCheck, title: "Say we made it easy.", quote: "Made what could have been a very stressful experience feel smooth and manageable." },
              { n: 11, icon: Icon.userPhone, title: "Single out the communication.", quote: "We were kept informed every step of the way and nothing was ever too much trouble." },
              { n: 6, icon: Icon.trendingUp, title: "Say we went further than asked.", quote: "Renegotiated our interest rate proactively, which has brought welcome savings." },
            ].map((t) => (
              <div key={t.title} className="rounded-[25px] bg-white p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-advance-light text-ink">
                  <t.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 font-display text-4xl font-normal tracking-tight text-ink">
                  {t.n}
                  <span className="text-lg text-ink/40"> of 24</span>
                </p>
                <p className="mt-1 font-semibold text-ink">{t.title}</p>
                <blockquote className="mt-3 text-sm leading-relaxed text-ink/60">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
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
