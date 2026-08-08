import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CtaBand } from "@/components/CtaBand";
import { POSTS, CATEGORY_LABELS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Straight-talking articles from LINK Advance's Brisbane mortgage brokers: home loans, first home buyers, refinancing, investing and business finance.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Articles", path: "/blog" }])} />
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Articles", path: "/blog" }]} />
      <section className="container-x pb-20 pt-10">
        <SectionHead
          as="h1"
          eyebrow="Articles"
          title="Lending, explained straight."
          mark="straight."
          intro="What's changing in lending and what it means for your loan - from the brokers who deal with 35+ lenders every day."
          accent
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <a
              key={p.path}
              href={p.path}
              className="group flex flex-col rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-ink"
            >
              <p className="eyebrow">
                <span className="text-advance">{CATEGORY_LABELS[p.category] ?? p.category}</span>
              </p>
              <h2 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-ink">
                {p.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm text-ink/60">{p.metaDesc}</p>
              <p className="mt-auto pt-4 text-sm font-semibold text-ink/45">
                {new Date(p.date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </a>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
