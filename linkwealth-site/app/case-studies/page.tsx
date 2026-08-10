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
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <h1 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-[58px]">
          Real clients, real strategies<span className="text-wealth">.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-[1.4] text-ink/80">
          See examples of how LINK Wealth has helped clients with our financial advice case
          studies.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {posts.map((p) => {
            const img = postImage(p);
            return (
              <a key={p.urlPath} href={p.urlPath} className="group rounded-[25px] bg-[#f1f1f1] p-6 transition hover:bg-wealth-light">
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
