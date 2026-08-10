"use client";

import { useState } from "react";
import { REVIEWS } from "@/components/Testimonials";

// The review wall: all 24 verbatim Google reviews, filterable by what the
// client actually came in for. Tags are read straight from the review text
// (a review that says "as first home buyers" is tagged first home) - no
// review is edited, only labelled.

type Tag = "First home" | "Refinance" | "Investing" | "Bought & sold" | "Home purchase";

const TAGS: Record<string, Tag> = {
  "Alys Taylor": "First home",
  "Brooke McHattie": "First home",
  "Tom Howden": "First home",
  "Genevieve Scanlan": "First home",
  "Jack Purtill": "First home",
  "Vicki Burton": "First home",
  "Naguib Hardie": "First home",
  "Jessica Dale": "First home",
  "Janae Paton": "Refinance",
  "Kate Tinta": "Refinance",
  "Michelle Dehlen": "Refinance",
  "Anthony Arthur": "Refinance",
  "Madison Else": "Investing",
  "Connor Mahoney": "Investing",
  "Britta Webb": "Investing",
  "Timothy Warren": "Bought & sold",
  "Jodie Warren": "Bought & sold",
  "Philip Kelly": "Bought & sold",
  "Micky Parker": "Home purchase",
  "Ye Lin": "Home purchase",
  "Nicola Todhunter": "Home purchase",
};

const FILTERS: { label: string; tag: Tag | null }[] = [
  { label: "All reviews", tag: null },
  { label: "First home buyers", tag: "First home" },
  { label: "Refinancing", tag: "Refinance" },
  { label: "Investing", tag: "Investing" },
  { label: "Bought & sold", tag: "Bought & sold" },
];

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Stars({ light = false }: { light?: boolean }) {
  return (
    <span aria-hidden className={`flex gap-0.5 ${light ? "text-advance-bright" : "text-advance"}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={15} height={15} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewWall() {
  const [active, setActive] = useState<Tag | null>(null);
  const shown = active ? REVIEWS.filter((r) => TAGS[r.name] === active) : REVIEWS;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by topic">
        {FILTERS.map((f) => {
          const on = active === f.tag;
          const count = f.tag ? REVIEWS.filter((r) => TAGS[r.name] === f.tag).length : REVIEWS.length;
          return (
            <button
              key={f.label}
              onClick={() => setActive(f.tag)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                on
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink"
              }`}
            >
              {f.label}
              <span className={`ml-1.5 tabular-nums ${on ? "text-white/50" : "text-ink/35"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {shown.map((r, i) => {
          const dark = !active && i % 9 === 4;
          return (
            <figure
              key={r.name}
              className={`mb-5 break-inside-avoid rounded-3xl p-7 ${
                dark ? "bg-ink text-white" : "border border-ink/10 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <Stars light={dark} />
                {TAGS[r.name] && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                      dark ? "bg-white/10 text-white/70" : "bg-advance-light text-ink/70"
                    }`}
                  >
                    {TAGS[r.name]}
                  </span>
                )}
              </div>
              <blockquote
                className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-ink/75"}`}
              >
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    dark ? "bg-advance-bright text-ink" : "bg-advance-light text-ink"
                  }`}
                >
                  {initials(r.name)}
                </span>
                <span>
                  <span className={`block text-sm font-semibold ${dark ? "text-white" : "text-ink"}`}>
                    {r.name}
                  </span>
                  <span className={`block text-[13px] ${dark ? "text-white/45" : "text-ink/50"}`}>
                    Google review
                  </span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
