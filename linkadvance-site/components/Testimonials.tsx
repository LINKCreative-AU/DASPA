"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { REVIEWS } from "@/lib/reviews";

// The review data moved to lib/reviews.ts, where it carries its tags and a
// build-time guard. Re-exported here because several components still import
// it from this module.
export { REVIEWS };

export function Testimonials({ heading = "Hear from our happy clients." }: { heading?: string }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? REVIEWS : REVIEWS.slice(0, 6);
  return (
    <section className="bg-ink py-20 text-white">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight sm:text-[50px]">
            {heading}
          </h2>
          <p className="mt-5 text-lg text-white/70">
            {SITE.reviews.count} Google reviews at {SITE.reviews.rating.toFixed(1)} stars. A few
            recent ones:
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <figure key={r.name} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p aria-hidden className="text-advance-bright">
                ★★★★★
              </p>
              <blockquote className="mt-3 text-sm leading-relaxed text-white/75">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-white/90">
                {r.name}
                <span className="ml-2 font-normal text-white/40">Google review</span>
              </figcaption>
            </figure>
          ))}
        </div>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="btn mt-8 border border-white/25 text-white hover:border-white"
          >
            Show more reviews
          </button>
        )}
      </div>
    </section>
  );
}
