"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { REVIEWS } from "@/components/Testimonials";

// The review wall in the link.com.au treatment: grey tiles, tint avatars,
// filterable two ways. Topic tags are read from what the review text itself
// says the client came in for; broker tags are read from whose name appears
// in the text. Nothing is paraphrased and no review is edited, only labelled,
// so every count on this page can be checked against the words above it.

type Tag = "First home" | "Refinance" | "Investing" | "Bought & sold" | "Home purchase";
type Broker = "Hugh" | "Callum" | "Jacob";

const TINT = "#fff6cc";
const INITIAL = 9; // enough to prove the point; the rest sit behind the button

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

const TOPICS: { label: string; tag: Tag | null }[] = [
  { label: "All reviews", tag: null },
  { label: "First home buyers", tag: "First home" },
  { label: "Refinancing", tag: "Refinance" },
  { label: "Investing", tag: "Investing" },
  { label: "Bought & sold", tag: "Bought & sold" },
];

const BROKERS: Broker[] = ["Hugh", "Callum", "Jacob"];
const namesIn = (text: string) => BROKERS.filter((b) => text.toLowerCase().includes(b.toLowerCase()));

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

  return <span ref={ref}>{n || "262"}</span>;
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
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        on
          ? "border-ink bg-ink text-white"
          : "border-ink/15 bg-white text-ink/70 hover:border-ink/40 hover:text-ink"
      }`}
    >
      {children}
      <span className={`ml-1.5 tabular-nums ${on ? "text-white/50" : "text-ink/35"}`}>{count}</span>
    </button>
  );
}

export function ReviewWall() {
  const [topic, setTopic] = useState<Tag | null>(null);
  const [broker, setBroker] = useState<Broker | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () =>
      REVIEWS.filter(
        (r) =>
          (!topic || TAGS[r.name] === topic) &&
          (!broker || namesIn(r.text).includes(broker))
      ),
    [topic, broker]
  );

  // A filter is a deliberate narrowing, so show everything it returns.
  const filtering = topic !== null || broker !== null;
  // Every review stays in the DOM and the overflow is hidden with CSS. If the
  // button sliced the array instead, 15 of the 24 reviews would be absent from
  // the prerendered HTML, which is the whole reason this page exists.
  const capped = !filtering && !expanded;
  const hiddenCount = capped ? Math.max(filtered.length - INITIAL, 0) : 0;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by what the client came in for">
        {TOPICS.map((f) => (
          <Chip
            key={f.label}
            on={topic === f.tag}
            onClick={() => setTopic(f.tag)}
            count={f.tag ? REVIEWS.filter((r) => TAGS[r.name] === f.tag).length : REVIEWS.length}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filter reviews by broker named">
        <span className="mr-1 text-sm text-ink/50">Named in the review:</span>
        {BROKERS.map((b) => (
          <Chip
            key={b}
            on={broker === b}
            onClick={() => setBroker(broker === b ? null : b)}
            count={REVIEWS.filter((r) => namesIn(r.text).includes(b)).length}
          >
            {b}
          </Chip>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink/55">
        Showing {filtered.length - hiddenCount} of {filtered.length}
        {filtering ? " matching" : ""} reviews.
        {filtering && (
          <button
            onClick={() => {
              setTopic(null);
              setBroker(null);
            }}
            className="ml-2 font-semibold text-ink underline underline-offset-4"
          >
            Clear filters
          </button>
        )}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[25px] bg-[#f1f1f1] p-7 text-ink/70">
          No review on this page matches both of those at once. Clear one and try again.
        </p>
      ) : (
        <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((r, idx) => (
            <figure
              key={r.name}
              className={`mb-5 break-inside-avoid rounded-[25px] bg-[#f1f1f1] p-7 ${
                capped && idx >= INITIAL ? "hidden" : ""
              }`}
            >
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
                    Google review{TAGS[r.name] ? ` · ${TAGS[r.name]}` : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {hiddenCount > 0 && (
        <button onClick={() => setExpanded(true)} className="btn btn-ghost mt-4">
          Show {hiddenCount} more {hiddenCount === 1 ? "review" : "reviews"}
        </button>
      )}
    </div>
  );
}
