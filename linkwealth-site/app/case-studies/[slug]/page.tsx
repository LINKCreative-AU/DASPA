/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, postImage } from "@/lib/posts";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

export function generateStaticParams() {
  return getPosts("case-studies").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("case-studies", slug);
  if (!post) return {};
  return {
    title: { absolute: post.metaTitle ?? post.title },
    description: post.metaDescription ?? post.excerpt.slice(0, 155),
    alternates: { canonical: post.urlPath },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt.slice(0, 155),
      url: post.urlPath,
      type: "article",
      ...(postImage(post) ? { images: [{ url: postImage(post)! }] } : {}),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("case-studies", slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.metaDescription ?? post.excerpt.slice(0, 155),
            path: post.urlPath,
            datePublished: post.date,
            dateModified: post.modified,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: post.title, path: post.urlPath },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: post.title, path: post.urlPath },
        ]}
      />

      <article className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-wealth">
          Case study · LINK Wealth · Reviewed by Richard Leal (AR 327265)
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal leading-[1.1] tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <div className="prose-post mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <CtaBand
        heading="Want a strategy like this one?"
        intro="Every case study started with a free, no-obligation conversation. We'll get to know you and your goals, and you'll leave knowing exactly what's possible."
        subject={`Case study: ${post.title}`}
      />
    </main>
  );
}
