"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS, REVIEW_TINT, ReviewStars, reviewInitials } from "@/components/Testimonials";

// The review wall in the link.com.au treatment: the count-up stat, then the
// grey tiles ([#f1f1f1], rounded-[25px], tint avatars, "Google review · tag"
// captions), filterable by what the client came in for. Tags are read
// straight from the verbatim review text; nothing is edited, only labelled.

type Tag = "Retirement" | "Insurance" | "Property & home" | "Super & estate";

const TAGS: Record<string, Tag> = {
  "Sarah Wilson": "Property & home",
  "Ye Lin": "Insurance",
  "Kate Tinta": "Property & home",
  "Ardian Berisha": "Retirement",
  "Timothy Warren": "Property & home",
  Deb: "Retirement",
  "Lachlan McKinnon": "Property & home",
  "Hui Ru McKinnon": "Retirement",
  "Kelly Walker": "Insurance",
  "hadi irwan": "Super & estate",
  "Rachel McMillan": "Super & estate",
  "Emma Warren": "Insurance",
  "Nathan P": "Insurance",
  "Su Yee Nandar": "Insurance",
  "Jacob Keenan": "Insurance",
};

const FILTERS: { label: string; tag: Tag | null }[] = [
  { label: "All reviews", tag: null },
  { label: "Retirement", tag: "Retirement" },
  { label: "Insurance", tag: "Insurance" },
  { label: "Property & home", tag: "Property & home" },
  { label: "Super & estate", tag: "Super & estate" },
];

// The link.com.au count-up: eases to the target when it scrolls into view.
export function CountUp({ target }: { target: number }) {
  const [n, setN] = useState(0);
  const [run, setRun] = useState(false);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setRun(true), {
      threshold: 0.4,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    const dur = 1200;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, target]);

  return <span ref={ref}>{n || target}</span>;
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
        {shown.map((r) => (
          <figure key={r.name} className="mb-5 break-inside-avoid rounded-[25px] bg-[#f1f1f1] p-7">
            <ReviewStars />
            <blockquote className="mt-4 text-[15px] leading-[1.45] text-ink">{r.text}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink"
                style={{ backgroundColor: REVIEW_TINT }}
              >
                {reviewInitials(r.name)}
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-ink">{r.name}</span>
                <span className="block text-[13px] text-ink/60">
                  Google review{TAGS[r.name] ? ` · ${TAGS[r.name]}` : ""}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
