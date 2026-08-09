import { SITE } from "@/lib/site";
import { Breadcrumbs } from "./Breadcrumbs";
import { SectionHead } from "./SectionHead";
import { Icon } from "./Icons";

// Auto-icon: when a FeatureGrid item has no explicit icon, pick a thin-line
// icon from its title so every card carries one (keyword order matters).
// Ported from the Advisors build; keywords tuned for lending topics.
function autoIcon(title: string): React.ReactNode {
  const t = title.toLowerCase();
  if (/award|winner|rated|star|loved|recommend|review/.test(t)) return <Icon.star />;
  if (/repric|rate|fee|fixed|price|pricing|cost|free/.test(t)) return <Icon.tag />;
  if (/broker|one .*(broker|person)|whole way|end to end|call|phone|dedicated|meet|corner/.test(t)) return <Icon.userPhone />;
  if (/lender|panel|market|family|member|team|people|group|next door/.test(t)) return <Icon.users />;
  if (/bank|credit|approval|polic|list|checklist|know what|prepared|current/.test(t)) return <Icon.clipboardCheck />;
  if (/smsf|super|retire|pension|waiver|doctor|profession|protect|insur|guarantee/.test(t)) return <Icon.shieldCheck />;
  if (/compli|asic|ato|licen[sc]|risk|control/.test(t)) return <Icon.shieldCheck />;
  if (/time|hour|experience|year|long|fast|speed|days|settle/.test(t)) return <Icon.clock />;
  if (/profit|grow|wealth|equity|portfolio|diverse|invest|asset|gear/.test(t)) return <Icon.trendingUp />;
  if (/structur|split|offset|tailored|build/.test(t)) return <Icon.wrench />;
  if (/book|record|plan|roadmap|master/.test(t)) return <Icon.book />;
  if (/brisbane|local|valley|based|premises|property|home|loan|deposit/.test(t)) return <Icon.home />;
  if (/calc|number|estimat/.test(t)) return <Icon.calculator />;
  if (/trust|advice/.test(t)) return <Icon.clipboardCheck />;
  if (/start|new|launch|workshop/.test(t)) return <Icon.rocket />;
  if (/tax|cash|money|dollar|rent|income/.test(t)) return <Icon.dollar />;
  return <Icon.key />;
}

// Shared building blocks for the service and workshop pages - the same V1.5
// bones as the Advisors/Books/Marketing builds. Every page: PageHero (one H1,
// one head term) → content sections → FAQ → CtaBand. Copy lives in each page
// file; these keep the look consistent.

export function PageHero({
  crumbs,
  eyebrow,
  title,
  mark,
  intro,
  image,
  imageAlt,
  ctaLabel = "Book a call",
  ctaHref = "/contact",
  secondaryLabel,
  secondaryHref,
  showStars = true,
  children,
}: {
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: string;
  mark?: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  showStars?: boolean;
  children?: React.ReactNode; // extra content under the CTA row (verbatim blocks)
}) {
  return (
    <>
      <Breadcrumbs crumbs={crumbs} />
      <section className="container-x grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHead as="h1" eyebrow={eyebrow} title={title} mark={mark} intro={intro} accent />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={ctaHref} className="btn btn-primary">
              {ctaLabel}
            </a>
            {secondaryLabel && secondaryHref ? (
              <a href={secondaryHref} className="btn btn-ghost">
                {secondaryLabel}
              </a>
            ) : (
              <a href={SITE.phoneHref} className="btn btn-ghost">
                Call {SITE.phone}
              </a>
            )}
          </div>
          {showStars && (
            <p className="mt-6 text-sm text-ink/55">
              <span aria-hidden className="text-advance">
                ★★★★★
              </span>{" "}
              Rated {SITE.reviews.rating.toFixed(1)} from {SITE.reviews.count} Google reviews ·
              Brisbane finance brokers
            </p>
          )}
          {children}
        </div>
        {image && (
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="hidden aspect-[4/5] w-full rounded-3xl object-cover object-top lg:block"
          />
        )}
      </section>
    </>
  );
}

export function Section({
  eyebrow,
  title,
  mark,
  intro,
  children,
  dark = false,
  tint = false,
}: {
  eyebrow?: string;
  title: string;
  mark?: string;
  intro?: string;
  children?: React.ReactNode;
  dark?: boolean;
  tint?: boolean; // neutral-50 band with hairline borders
}) {
  return (
    <section
      className={
        dark ? "bg-ink py-20 text-white" : tint ? "border-y border-ink/10 bg-neutral-50 py-20" : "py-20"
      }
    >
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={title} mark={mark} intro={intro} dark={dark} />
        {children}
      </div>
    </section>
  );
}

export function FeatureGrid({
  items,
  cols = 3,
  dark = false,
  cards = false,
}: {
  items: { title: string; body: string; icon?: React.ReactNode }[];
  cols?: 2 | 3 | 4;
  dark?: boolean;
  cards?: boolean; // white bordered cards with icon chips (brighter variant)
}) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return (
    <div className={`mt-12 grid ${cards ? "gap-5" : "gap-x-8 gap-y-10"} ${colClass}`}>
      {items.map((f) => (
        <div
          key={f.title}
          className={
            cards
              ? dark
                ? "rounded-3xl border border-white/10 bg-white/5 p-7"
                : "rounded-3xl border border-ink/10 bg-white p-7"
              : undefined
          }
        >
          <span
            className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
              dark ? "bg-white/10 text-white" : "bg-advance/10 text-advance"
            }`}
          >
            {f.icon ?? autoIcon(f.title)}
          </span>
          <h3 className={`font-display text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
            {f.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-ink/65"}`}>{f.body}</p>
        </div>
      ))}
    </div>
  );
}

// Numbered steps - the house 01/02/03 treatment (numbers only where the
// content genuinely is a sequence).
export function ProcessSteps({
  steps,
  dark = false,
  cols = 4,
}: {
  steps: { title: string; body?: string }[];
  dark?: boolean;
  cols?: 2 | 3 | 4;
}) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[cols];
  return (
    <ol className={`mt-12 grid gap-8 ${colClass}`}>
      {steps.map((s, i) => (
        <li key={s.title}>
          <span
            className={`font-display text-3xl font-semibold ${dark ? "text-advance-bright/70" : "text-advance/40"}`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3
            className={`mt-2 font-display text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}
          >
            {s.title}
          </h3>
          {s.body && (
            <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-ink/65"}`}>
              {s.body}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function FAQ({
  faqs,
  title = "Your questions, answered.",
  eyebrow = "Good to know",
  related,
}: {
  faqs: { q: string; a: string }[];
  title?: string;
  eyebrow?: string;
  // crawlable contextual internal links, rendered under the FAQs
  related?: { label: string; href: string }[];
}) {
  return (
    <section className="py-20">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow={eyebrow} title={title} />
        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-advance transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
        {related && related.length > 0 && (
          <nav aria-label="Related" className="mt-8">
            <p className="eyebrow mb-3">Related</p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/75 transition hover:border-advance hover:text-advance"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}

// Check list used for the verbatim bullet blocks on the workshop pages.
export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((c) => (
        <li key={c} className={`flex gap-3 ${dark ? "text-white/80" : "text-ink/75"}`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className={`mt-1 shrink-0 ${dark ? "text-advance-bright" : "text-advance"}`}
          >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="m6 10 2.6 2.6L14 7.4" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {c}
        </li>
      ))}
    </ul>
  );
}

// Proof strip used across pages: rating + licensing.
export function ProofBar() {
  return (
    <section className="border-y border-ink/10 bg-neutral-50">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-5 text-sm font-semibold text-ink/75">
        <span>
          <span aria-hidden className="text-advance">
            ★★★★★
          </span>{" "}
          {SITE.reviews.rating.toFixed(1)} from {SITE.reviews.count} Google reviews
        </span>
        <span>One broker, end to end</span>
        <span>35+ lenders on the panel</span>
        <span>Ongoing loan repricing</span>
        <span>Brisbane based, Australia wide</span>
      </div>
    </section>
  );
}
