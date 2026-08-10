import { reviewsFor, type Service } from "@/lib/reviews";
import { SITE } from "@/lib/site";

// Topic-matched proof for the money pages: the reviews from clients who came
// in for THIS thing, sitting next to the page that claims we do it well,
// rather than all of them pooled on /reviews where nobody reads them at the
// moment of doubt.
//
// Server component by design: the quotes are in the HTML with no JavaScript,
// because their job is to be read and crawled, not to animate.

export function ReviewsFor({
  service,
  heading,
  intro,
  limit = 3,
}: {
  service: Service;
  heading: string;
  intro?: string;
  limit?: number;
}) {
  const picks = reviewsFor(service, limit);
  if (picks.length === 0) return null;

  return (
    <section className="border-y border-ink/10 bg-neutral-50 py-20">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            {heading}
          </h2>
          {intro && <p className="mt-4 text-lg leading-[1.4] text-ink/80">{intro}</p>}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {picks.map((r) => (
            <figure key={r.name} className="rounded-[25px] bg-white p-7">
              <span aria-hidden className="flex gap-0.5 text-advance">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} width={16} height={16} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </span>
              <blockquote className="mt-4 text-[15px] leading-[1.45] text-ink">{r.text}</blockquote>
              <figcaption className="mt-5 text-[13px] text-ink/60">
                <span className="block text-[15px] font-semibold text-ink">{r.name}</span>
                Google review
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink/60">
          {SITE.reviews.count} Google reviews at {SITE.reviews.rating.toFixed(1)}.{" "}
          <a
            href="/reviews"
            className="font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
          >
            Read them in full
          </a>
          , filtered by what people came in for.
        </p>
      </div>
    </section>
  );
}
