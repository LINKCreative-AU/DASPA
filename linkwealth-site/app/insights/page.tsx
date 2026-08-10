/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getPosts, postImage } from "@/lib/posts";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: { absolute: "Insights - LINK Wealth" },
  description:
    "Wealth-building insights from LINK Wealth's Brisbane financial advisors: debt recycling, home equity, negative gearing, SMSFs, investment bonds and more.",
  alternates: { canonical: "/insights" },
};

export default function Insights() {
  const posts = getPosts("insights");
  return (
    <main>
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <h1 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px] lg:text-[58px]">
          The best from our blog<span className="text-wealth">.</span>
        </h1>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const img = postImage(p);
            return (
              <a key={p.urlPath} href={p.urlPath} className="group">
                {img ? (
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    className="mb-4 aspect-[3/2] w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="wealth-gradient mb-4 aspect-[3/2] w-full rounded-2xl" />
                )}
                <p className="text-xs font-semibold uppercase tracking-wider text-wealth">
                  {new Date(p.date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight text-ink transition group-hover:text-wealth">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink/60">{p.excerpt}</p>
                )}
              </a>
            );
          })}
        </div>
      </section>
      <CtaBand subject="Insights" />
    </main>
  );
}
