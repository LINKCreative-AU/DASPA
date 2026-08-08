/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getPosts, postImage } from "@/lib/posts";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: { absolute: "Case Studies - LINK Wealth" },
  description:
    "See examples of how LINK Wealth has helped clients with our financial advice case studies.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudies() {
  const posts = getPosts("case-studies");
  return (
    <main>
      <section className="container-x py-14 sm:py-20">
        <span className="eyebrow text-wealth">Case studies</span>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Real clients, real strategies<span className="text-wealth">.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/65">
          See examples of how LINK Wealth has helped clients with our financial advice case
          studies.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {posts.map((p) => {
            const img = postImage(p);
            return (
              <a key={p.urlPath} href={p.urlPath} className="group rounded-xl2 border border-line p-6 transition hover:border-wealth hover:shadow-[0_12px_32px_-16px_rgba(32,67,71,0.35)]">
                {img && (
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="mb-5 aspect-[2/1] w-full rounded-2xl object-cover"
                  />
                )}
                <h2 className="font-display text-2xl font-bold leading-snug tracking-tight text-ink transition group-hover:text-wealth">
                  {p.title}
                </h2>
                {p.excerpt && <p className="mt-3 text-ink/65">{p.excerpt}</p>}
                <p className="mt-4 text-sm font-semibold text-wealth">Read case study →</p>
              </a>
            );
          })}
        </div>
      </section>
      <CtaBand subject="Case studies" />
    </main>
  );
}
