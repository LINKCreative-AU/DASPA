import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { POSTS, CATEGORY_LABELS, findPost } from "@/lib/posts";

// Every old post URL carried 1:1 (/blog/<category>/<slug>), exact metas from
// the old Yoast head so nothing re-earns rankings it already has.

export function generateStaticParams() {
  return POSTS.map((p) => ({ category: p.category, slug: p.slug }));
}

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, slug } = await params;
  const post = findPost(category, slug);
  if (!post) return {};
  return {
    title: { absolute: post.metaTitle || post.title },
    description: post.metaDesc,
    alternates: { canonical: post.path },
    openGraph: {
      title: post.title,
      description: post.metaDesc,
      url: post.path,
      type: "article",
      ...(post.ogImage ? { images: [{ url: post.ogImage }] } : {}),
    },
  };
}

export default async function Page({ params }: Params) {
  const { category, slug } = await params;
  const post = findPost(category, slug);
  if (!post) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/blog" },
    { name: CATEGORY_LABELS[post.category] ?? post.category, path: `/blog/${post.category}` },
    { name: post.title, path: post.path },
  ];
  return (
    <main>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.metaDesc,
            path: post.path,
            datePublished: post.date,
            dateModified: post.modified,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />
      <article className="container-x max-w-3xl pb-16 pt-8">
        <p className="eyebrow">
          <span className="text-advance">{CATEGORY_LABELS[post.category] ?? post.category}</span>
        </p>
        <h1 className="mt-4 font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-ink/50">
          {new Date(post.date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <CtaBand
        heading="Questions about your own loan?"
        intro="Talk it through with a broker: free, no obligation, and across 35+ lenders."
      />
    </main>
  );
}
