"use client";

/* eslint-disable @next/next/no-img-element */
import { REVIEWS } from "./Testimonials";
import { SITE } from "@/lib/site";

// The review carousel in the link.com.au treatment: cards drifting through
// the pool, pausing on hover, static under reduced motion. Same verbatim
// Google reviews the old homepage widget served.

const TINT = "#fff6cc"; // the register light tint carries the initials

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span aria-hidden className="flex gap-0.5 text-advance">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export function ReviewStrip({ heading }: { heading?: string | null } = {}) {
  // heading={null} on a page that already introduced the reviews above it.
  const track = [...REVIEWS, ...REVIEWS];
  return (
    <section aria-label="Reviews from LINK Advance clients" className="py-16 sm:py-20">
      <div className="container-x flex flex-wrap items-end justify-between gap-4">
        {heading !== null && (
          <h2 className="max-w-xl font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            {heading ?? (
              <>
                262 five-star reviews, and counting<span className="text-advance">.</span>
              </>
            )}
          </h2>
        )}
        <span className="flex gap-5">
          <a
            href="/reviews"
            className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            The reviews page →
          </a>
          <a
            href={SITE.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Verify on Google →
          </a>
        </span>
      </div>

      <div className="marquee mt-10 overflow-hidden">
        <div className="marquee-track flex w-max gap-5">
          {track.map((r, i) => (
            <figure
              key={i}
              aria-hidden={i >= REVIEWS.length}
              className="flex w-[330px] shrink-0 flex-col rounded-[25px] bg-[#f1f1f1] p-7 sm:w-[373px]"
            >
              <Stars />
              <blockquote className="mt-4 line-clamp-6 text-[15px] leading-[1.45] text-ink">
                {r.text}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-ink"
                  style={{ backgroundColor: TINT }}
                >
                  {initials(r.name)}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{r.name}</span>
                  <span className="block text-[13px] text-ink/55">Google review</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
