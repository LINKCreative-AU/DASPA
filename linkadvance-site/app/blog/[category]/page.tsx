import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CtaBand } from "@/components/CtaBand";
import { ArticleCard, RelatedLinks } from "@/components/ArticleCard";
import { CATEGORY_LABELS } from "@/lib/posts";
import { CATEGORY_META, CATEGORY_SLUGS, postsInCategory, categoryCount } from "@/lib/article-hub";

// The category index the post breadcrumbs have always claimed existed.
// Same treatment as the hub at a smaller scale: a real heading, an intro,
// the posts, and the service pages and tools that match the category.
// The /blog/<category>/<slug> post URLs are untouched.

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

type Params = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};
  return {
    title: { absolute: meta.metaTitle },
    description: meta.metaDesc,
    alternates: { canonical: `/blog/${category}` },
  };
}

export default async function Page({ params }: Params) {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) notFound();
  const label = CATEGORY_LABELS[category] ?? category;
  const posts = postsInCategory(category);
  const path = `/blog/${category}`;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/blog" },
    { name: label, path },
  ];

  const others = CATEGORY_SLUGS.filter((c) => c !== category);

  return (
    <main>
      <JsonLd
        data={[
          collectionPageSchema({
            name: `${label} articles`,
            description: meta.metaDesc,
            path,
            items: posts.map((p) => ({ title: p.title, path: p.path })),
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />

      <section className="container-x pb-12 pt-10 sm:pt-14">
        <SectionHead
          as="h1"
          eyebrow={`${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
          title={meta.heading}
          intro={meta.intro}
          accent
        />
      </section>

      <section className="container-x pb-16">
        <div
          className={`grid gap-5 sm:grid-cols-2 ${posts.length > 2 ? "lg:grid-cols-3" : ""}`}
        >
          {posts.map((post) => (
            <ArticleCard key={post.path} post={post} />
          ))}
        </div>
        <RelatedLinks lead={meta.relatedLead} links={meta.related} />
      </section>

      <section className="border-t border-ink/10 py-14">
        <div className="container-x">
          <h2 className="font-display text-[26px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[32px]">
            The rest of the library.
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-[1.4] text-ink/80">
            Everything we publish sits on the{" "}
            <a
              href="/blog"
              className="font-medium text-advance underline decoration-advance/30 underline-offset-2 hover:decoration-advance"
            >
              articles hub
            </a>
            , grouped by the decision rather than the loan type.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {others.map((slug) => (
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
        </div>
      </section>

      <CtaBand
        heading="One broker, 35+ lenders, zero cost to you."
        intro="Tell us what you're planning and a broker will call to map your options. No obligation."
        subject={`Articles: ${label}`}
      />
    </main>
  );
}
