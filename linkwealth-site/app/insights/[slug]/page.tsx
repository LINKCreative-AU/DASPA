/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, postImage } from "@/lib/posts";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";

// Every insights post at its exact old URL, with its exact live title tag
// and meta description (they carry the rankings - the children's bonds post
// is the site's best organic performer).

export function generateStaticParams() {
  return getPosts("insights").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost("insights", slug);
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
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost("insights", slug);
  if (!post) notFound();

  const related = getPosts("insights")
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

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
            { name: "Insights", path: "/insights" },
            { name: post.title, path: post.urlPath },
          ]),
        ]}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path: post.urlPath },
        ]}
      />

      <article className="container-x max-w-3xl py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-wealth-dark">
          {new Date(post.date).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · LINK Wealth
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <div
          className="prose-post mt-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <section className="bg-cloud py-16">
        <div className="container-x">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Keep reading.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => {
              const img = postImage(p);
              return (
                <a key={p.urlPath} href={p.urlPath} className="group">
                  {img && (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="mb-3 aspect-[3/2] w-full rounded-2xl object-cover"
                    />
                  )}
                  <h3 className="font-display text-base font-bold leading-snug text-ink transition group-hover:text-wealth-dark">
                    {p.title}
                  </h3>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand subject={`Insights: ${post.title}`} />
    </main>
  );
}
