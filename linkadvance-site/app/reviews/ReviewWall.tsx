"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_REVIEWS,
  BROKERS,
  GROUPS,
  PRAISES,
  SERVICES,
  type Broker,
  type Group,
  type Praise,
  type Review,
  type Service,
  brokersIn,
} from "@/lib/reviews";

// The review wall in the link.com.au treatment: grey tiles, tint avatars.
//
// Default view is every review GROUPED by what the client came in for, each
// section with its own heading, count and expand, so you can read the whole
// lot section by section without touching a filter. Filtering is the other
// mode: pick a chip and it collapses to a single flat list of the matches.
// The first version only had the flat list, which meant the only way to see
// a section was to hide every other one.
//
// Two filter families, both read from the review text and never inferred:
// what the client came in for, and what they singled out. Reviews that name
// no transaction (a few just praise the broker) are still reachable through
// the second family, which is why it exists.
//
// Every review stays in the DOM at all times and the overflow is hidden with
// CSS. If the "show more" button sliced the array instead, most of the
// reviews would be missing from the prerendered HTML, which is the whole
// reason this page exists.

const TINT = "#fff6cc";
const INITIAL = 9; // flat list, when a filter is on
const BATCH = 9;
const PER_GROUP = 3; // grouped view, per section before its own expand

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

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

export function CountUp({ target }: { target: number }) {
  const [n, setN] = useState(0);
  const [run, setRun] = useState(false);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setRun(true), { threshold: 0.4 });
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
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, target]);

  return <span ref={ref}>{n || target}</span>;
}

function Chip({
  on,
  onClick,
  children,
  count,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  const dead = count === 0;
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      disabled={dead}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        on
          ? "border-ink bg-ink text-white"
          : dead
            ? "cursor-not-allowed border-ink/10 bg-white text-ink/25"
            : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink"
      }`}
    >
      {children}
      <span className={`ml-1.5 tabular-nums ${on ? "text-white/50" : "text-ink/35"}`}>{count}</span>
    </button>
  );
}

// showService is off inside a group, where the heading above already says it.
function Tile({ r, showService = true }: { r: Review; showService?: boolean }) {
  return (
    <figure className="mb-5 break-inside-avoid rounded-[25px] bg-[#f1f1f1] p-7">
      <Stars />
      <blockquote className="mt-4 text-[15px] leading-[1.45] text-ink">{r.text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink"
          style={{ backgroundColor: TINT }}
        >
          {initials(r.name)}
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-ink">{r.name}</span>
          <span className="block text-[13px] text-ink/60">
            Google review{showService && r.service ? ` · ${r.service}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

// One section of the grouped view: heading, count, its own expand. Reviews
// beyond the fold stay in the DOM and are hidden with CSS, same as the flat
// list, so the whole set is in the prerendered HTML either way.
function GroupSection({ g }: { g: Group }) {
  const [open, setOpen] = useState(false);
  const visible = open ? g.reviews.length : Math.min(PER_GROUP, g.reviews.length);
  const hidden = g.reviews.length - visible;

  return (
    <section aria-labelledby={`group-${g.key}`} className="border-t border-ink/10 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id={`group-${g.key}`}
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          {g.heading}
          <span className="ml-2 text-lg font-normal tabular-nums text-ink/40">
            {g.reviews.length}
          </span>
        </h2>
        {hidden > 0 && (
          <button
            onClick={() => setOpen(true)}
            className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-advance-mid"
          >
            Show all {g.reviews.length}
          </button>
        )}
        {open && g.reviews.length > PER_GROUP && (
          <button
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Show fewer
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-ink/55">{g.blurb}</p>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {g.reviews.map((r, idx) => (
          <div key={r.name} className={idx >= visible ? "hidden" : ""}>
            <Tile r={r} showService={false} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewWall() {
  const [service, setService] = useState<Service | null>(null);
  const [praise, setPraise] = useState<Praise | null>(null);
  const [broker, setBroker] = useState<Broker | null>(null);
  const [shown, setShown] = useState(INITIAL);

  const filtered = useMemo(
    () =>
      ALL_REVIEWS.filter(
        (r) =>
          (!service || r.service === service) &&
          (!praise || r.praise.includes(praise)) &&
          (!broker || brokersIn(r.text).includes(broker))
      ),
    [service, praise, broker]
  );

  const filtering = service !== null || praise !== null || broker !== null;

  // Changing a filter resets the window, so you never land on "showing 9 of 4".
  const applyFilter = (fn: () => void) => {
    fn();
    setShown(INITIAL);
  };

  const visible = Math.min(shown, filtered.length);
  const remaining = filtered.length - visible;
  const nextBatch = Math.min(BATCH, remaining);

  // Counts on the chips are always counts within the OTHER active filters, so
  // a chip never promises results it cannot deliver.
  const withinOthers = (extra: (r: Review) => boolean) =>
    ALL_REVIEWS.filter(
      (r) =>
        extra(r) &&
        (!praise || r.praise.includes(praise)) &&
        (!broker || brokersIn(r.text).includes(broker))
    ).length;

  const praiseWithinOthers = (p: Praise) =>
    ALL_REVIEWS.filter(
      (r) =>
        r.praise.includes(p) &&
        (!service || r.service === service) &&
        (!broker || brokersIn(r.text).includes(broker))
    ).length;

  const brokerWithinOthers = (b: Broker) =>
    ALL_REVIEWS.filter(
      (r) =>
        brokersIn(r.text).includes(b) &&
        (!service || r.service === service) &&
        (!praise || r.praise.includes(praise))
    ).length;

  return (
    <div>
      <div className="space-y-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter reviews by what the client came in for"
        >
          <Chip on={!service} onClick={() => applyFilter(() => setService(null))} count={withinOthers(() => true)}>
            All reviews
          </Chip>
          {SERVICES.map((s) => (
            <Chip
              key={s}
              on={service === s}
              onClick={() => applyFilter(() => setService(service === s ? null : s))}
              count={withinOthers((r) => r.service === s)}
            >
              {s}
            </Chip>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter reviews by what the client singled out"
        >
          <span className="mr-1 text-sm text-ink/50">What they singled out:</span>
          {PRAISES.map((p) => (
            <Chip
              key={p}
              on={praise === p}
              onClick={() => applyFilter(() => setPraise(praise === p ? null : p))}
              count={praiseWithinOthers(p)}
            >
              {p}
            </Chip>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter reviews by the broker named in them"
        >
          <span className="mr-1 text-sm text-ink/50">Named in the review:</span>
          {BROKERS.map((b) => (
            <Chip
              key={b}
              on={broker === b}
              onClick={() => applyFilter(() => setBroker(broker === b ? null : b))}
              count={brokerWithinOthers(b)}
            >
              {b}
            </Chip>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink/55">
        {filtering ? (
          <>
            Showing <strong className="font-semibold text-ink">{visible}</strong> of{" "}
            {filtered.length} matching {filtered.length === 1 ? "review" : "reviews"}.
            <button
              onClick={() =>
                applyFilter(() => {
                  setService(null);
                  setPraise(null);
                  setBroker(null);
                })
              }
              className="ml-2 font-semibold text-ink underline underline-offset-4"
            >
              Back to all sections
            </button>
          </>
        ) : (
          <>
            All <strong className="font-semibold text-ink">{ALL_REVIEWS.length}</strong> reviews,
            grouped by what the client came in for. Open a section to read the rest, or use a
            filter above to cut across the lot.
          </>
        )}
      </p>

      {filtering ? (
        filtered.length === 0 ? (
          <p className="mt-8 rounded-[25px] bg-[#f1f1f1] p-7 text-ink/70">
            No review matches all of those at once. Clear one and try again.
          </p>
        ) : (
          <>
            <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
              {filtered.map((r, idx) => (
                <div key={r.name} className={idx >= visible ? "hidden" : ""}>
                  <Tile r={r} />
                </div>
              ))}
            </div>
            {(remaining > 0 || visible > INITIAL) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {remaining > 0 && (
                  <button onClick={() => setShown(visible + nextBatch)} className="btn btn-ghost">
                    Show {nextBatch} more {nextBatch === 1 ? "review" : "reviews"}
                  </button>
                )}
                {remaining > nextBatch && (
                  <button onClick={() => setShown(filtered.length)} className="btn btn-ghost">
                    Show all {filtered.length}
                  </button>
                )}
                {visible > INITIAL && (
                  <button onClick={() => setShown(INITIAL)} className="btn btn-ghost">
                    Show fewer
                  </button>
                )}
              </div>
            )}
          </>
        )
      ) : (
        <div className="mt-8 space-y-12">
          {GROUPS.map((g) => (
            <GroupSection key={g.key} g={g} />
          ))}
        </div>
      )}
    </div>
  );
}
