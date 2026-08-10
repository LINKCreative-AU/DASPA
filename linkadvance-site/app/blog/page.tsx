import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CtaBand } from "@/components/CtaBand";
import { ArticleCard, FeaturedArticleCard, RelatedLinks } from "@/components/ArticleCard";
import { POSTS, CATEGORY_LABELS } from "@/lib/posts";
import { FEATURED, RESOLVED_SECTIONS, CATEGORY_SLUGS, categoryCount } from "@/lib/article-hub";

// The hub was a flat, date-ordered grid of 34 tiles that linked only to
// itself. It now runs as a sectioned index: two leads, category navigation,
// then seven reader-facing sections, each of which hands off to the service
// page and the calculator that price what the section is about. Post URLs,
// slugs, titles and metas are untouched: this is the index, not the posts.

const PATH = "/blog";

export const metadata: Metadata = {
  // Absolute: the layout template already appends "| LINK Advance", and the
  // brand is in this string once already.
  title: { absolute: "Home Loan & Finance Articles | LINK Advance Brisbane" },
  description:
    "Straight-talking home loan, first home buyer, refinancing, property investment and business finance articles from LINK Advance's Brisbane mortgage brokers, grouped by the decision you are making.",
  alternates: { canonical: PATH },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Articles", path: PATH },
];

const FEATURED_NOTES: Record<string, string> = {
  "refinancing-your-home-loan-after-separation-or-divorce":
    "Ranks first in Google for its search term, and it is the one people ring about the same day they read it.",
  "mortgage-broker-vs-bank":
    "The question behind almost every first phone call, answered without pretending the answer is always a broker.",
};

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          collectionPageSchema({
            name: "LINK Advance Articles",
            description:
              "Home loan, first home buyer, refinancing, property investment and business finance articles from LINK Advance's Brisbane mortgage brokers.",
            path: PATH,
            items: POSTS.map((p) => ({ title: p.title, path: p.path })),
          }),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-14 pt-10 sm:pt-14">
        <SectionHead
          as="h1"
          title="Lending, explained straight."
          mark="straight."
          intro={`${POSTS.length} articles from our Brisbane broking desk, grouped by the decision in front of you rather than the month they happened to be published.`}
          accent
        />
        <p className="mt-4 max-w-3xl text-lg leading-[1.4] text-ink/80">
          Start with the section that matches your situation. Each one ends with the loan page and
          the calculator that price what you have just read about, because seeing what stamp duty
          costs on your purchase beats reading about stamp duty in general. The rules-based
          articles get updated when the rules move, and the rules moved twice in Queensland in the
          last two years.
        </p>
      </section>

      <section className="container-x pb-16">
        <h2 className="font-display text-[26px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[32px]">
          Start with these two.
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-[1.4] text-ink/80">
          Who should arrange your loan, and what happens to the mortgage when a relationship ends.
          Between them they open most of the conversations we have.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {FEATURED.map((post) => (
            <FeaturedArticleCard key={post.path} post={post} note={FEATURED_NOTES[post.slug]} />
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <h2 className="font-display text-[26px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[32px]">
          Every article, by lending type.
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-[1.4] text-ink/80">
          The same {POSTS.length} articles, filed the way a lender would file them.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_SLUGS.map((slug) => (
            <a
              key={slug}
              href={`/blog/${slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink hover:bg-advance-light"
            >
              {CATEGORY_LABELS[slug] ?? slug}
              <span className="text-ink/40">{categoryCount(slug)}</span>
            </a>
          ))}
        </div>
      </section>

      {RESOLVED_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-ink/10 py-16 sm:py-20"
        >
          <div className="container-x">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              {section.title}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-[1.4] text-ink/80">{section.who}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.posts.map((post) => (
                <ArticleCard key={post.path} post={post} />
              ))}
            </div>
            <RelatedLinks lead={section.relatedLead} links={section.related} />
          </div>
        </section>
      ))}

      <section className="border-t border-ink/10 py-16 sm:py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[26px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[32px]">
            None of this is advice about your loan.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Articles are general by definition. Your borrowing capacity, your grant eligibility and
            your best lender all depend on things a web page cannot see. Run the numbers with the{" "}
            <a
              href="/calculators"
              className="font-medium text-advance underline decoration-advance/30 underline-offset-2 hover:decoration-advance"
            >
              calculators and health checks
            </a>
            , then have a broker check the assumptions. We deal with 35+ lenders and hold 262
            five-star Google reviews doing exactly that.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Read enough. Get the actual number."
        intro="Tell us what you're planning and a broker will map your options across 35+ lenders. Free, no obligation."
        subject="Articles"
      />
    </main>
  );
}
