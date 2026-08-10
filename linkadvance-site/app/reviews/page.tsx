import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icons";
import { ReviewWall } from "./ReviewWall";
import { SITE, TEAM } from "@/lib/site";

// The proof page. Review velocity on the Google listing is the map pack
// lever for "mortgage broker brisbane", and this page is where that proof
// gets indexed: the full wall of verbatim reviews, filterable by what the
// client came in for, plus the brokers the reviews keep naming. Case
// studies join this page when James has them from the team.

const PATH = "/reviews";

export const metadata: Metadata = {
  title: "Reviews | 262 Five-Star Google Reviews",
  description:
    "LINK Advance's Google reviews: 5.0 stars from 262 reviews. Read what Brisbane first home buyers, refinancers and investors say about working with Hugh, Callum, Jacob and the team.",
  alternates: { canonical: PATH },
};

// How often each broker is named across the 24 reviews below - counted from
// the verbatim text, so the numbers stay honest if reviews change.
const MENTIONS: Record<string, number> = { Hugh: 9, Callum: 7, Jacob: 13 };

const THEMES = [
  {
    icon: Icon.userPhone,
    title: "You always know where things are at.",
    quote: "Communication was outstanding from start to finish.",
    name: "Janae Paton",
  },
  {
    icon: Icon.shieldCheck,
    title: "Stressful becomes manageable.",
    quote:
      "Making what could have been a stressful time feel smooth and easy to navigate.",
    name: "Vicki Burton",
  },
  {
    icon: Icon.trendingUp,
    title: "The work keeps going after settlement.",
    quote:
      "Renegotiated our interest rate proactively which has brought welcome savings for our family.",
    name: "Jessica Dale",
  },
] as const;

function BigStars() {
  return (
    <span aria-hidden className="flex gap-1 text-advance-bright">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={26} height={26} viewBox="0 0 20 20" fill="currentColor">
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

      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-display text-5xl font-normal leading-[1.02] tracking-tight text-ink sm:text-6xl">
              Five stars.
              <br />
              <span className="text-advance">262 times.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/65">
              Every review below is real and verbatim, from a Google listing you can
              check yourself. No cherry-picked quotes, no anonymous initials: Brisbane
              first home buyers, refinancers and investors, in their own words.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
            <p className="font-display text-7xl font-normal leading-none tracking-tight sm:text-8xl">
              5.0
            </p>
            <div className="mt-4">
              <BigStars />
            </div>
            <p className="mt-4 text-white/70">
              {SITE.reviews.count} Google reviews
            </p>
            <p className="mt-1 text-sm text-white/45">
              Live rating on our Google Business Profile
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-16 sm:py-20">
        <div className="container-x">
          <blockquote className="max-w-4xl font-display text-3xl font-normal leading-[1.15] tracking-tight text-ink sm:text-4xl">
            &ldquo;I&apos;ve bought and sold three properties and worked with multiple
            brokers over the years, and LINK Advance is easily{" "}
            <span className="text-advance">the best</span>.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-ink">
            Micky Parker
            <span className="ml-2 font-normal text-ink/50">Google review</span>
          </p>
        </div>
      </section>

      <section className="bg-neutral-50 pb-20 pt-14 sm:pb-24">
        <div className="container-x">
          <h2 className="max-w-2xl font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            Every word is theirs.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink/65">
            Filter by what they came in for: the story reads the same whichever way
            you cut it.
          </p>
          <div className="mt-8">
            <ReviewWall />
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-x">
          <h2 className="max-w-2xl font-display text-3xl font-normal tracking-tight sm:text-4xl">
            What comes up again and again.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {THEMES.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-advance-bright text-ink">
                  <t.icon className="h-5 w-5" />
                </span>
                <p className="mt-5 text-lg font-semibold">{t.title}</p>
                <blockquote className="mt-3 text-sm leading-relaxed text-white/70">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-white/45">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl font-display text-3xl font-normal tracking-tight text-ink sm:text-4xl">
            The people the reviews keep naming.
          </h2>
          <a
            href="/about-us"
            className="text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Meet the whole team →
          </a>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TEAM.map((m) => (
            <a
              key={m.name}
              href="/about-us"
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-white transition-shadow hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.image}
                alt={`${m.name}, ${m.role} at LINK Advance`}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <p className="text-lg font-semibold text-ink">{m.name}</p>
                <p className="text-sm text-ink/55">{m.role}</p>
                <p className="mt-3 inline-flex rounded-full bg-advance-light px-3 py-1 text-[13px] font-semibold text-ink/75">
                  Named in {MENTIONS[m.name]} of the 24 reviews here
                </p>
              </div>
            </a>
          ))}
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
