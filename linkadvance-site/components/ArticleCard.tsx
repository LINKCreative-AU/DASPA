import { ArrowCircle, EyebrowPill } from "./v2";
import { CATEGORY_LABELS, type Post } from "@/lib/posts";
import { blurb, formatDate, type HubLink } from "@/lib/article-hub";

// Typographic article tiles in the V2 language (25px radius, #f1f1f1).
// Deliberately image-free: 11 of the 34 posts have no usable image in
// /public/wp-content/uploads (their old WordPress ogImage files never came
// across in the migration) and the rest are generic stock, so half-imaged
// cards would read as a broken grid. Title, blurb and date do the work.

export function ArticleCard({ post, tone = "grey" }: { post: Post; tone?: "grey" | "white" }) {
  return (
    <a
      href={post.path}
      className={`group flex flex-col rounded-[25px] p-7 transition ${
        tone === "white"
          ? "border border-ink/10 bg-white hover:border-ink/25"
          : "bg-[#f1f1f1] hover:bg-advance-light"
      }`}
    >
      <p className="eyebrow">
        <span className="text-advance">{CATEGORY_LABELS[post.category] ?? post.category}</span>
        <span className="mx-2 text-ink/25">·</span>
        <span className="text-ink/45">{formatDate(post.date)}</span>
      </p>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight text-ink">
        {post.title}
      </h3>
      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink/65">{blurb(post)}</p>
      <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-ink">
        Read the article
        <ArrowCircle bg="#000000" fg="#ffffff" size={20} />
      </span>
    </a>
  );
}

// The lead treatment: bigger type, dark tile, the reason it leads spelled out.
export function FeaturedArticleCard({ post, note }: { post: Post; note: string }) {
  return (
    <a
      href={post.path}
      className="group flex flex-col rounded-[25px] bg-ink p-8 text-white transition hover:bg-ink/90 sm:p-10"
    >
      <div>
        <EyebrowPill onDark>{CATEGORY_LABELS[post.category] ?? post.category}</EyebrowPill>
      </div>
      <h3 className="mt-6 font-display text-[26px] font-normal leading-[1.15] tracking-tight sm:text-[32px]">
        {post.title}
      </h3>
      <p className="mt-4 text-base leading-relaxed text-white/70">{blurb(post)}</p>
      <p className="mt-5 text-sm font-semibold text-advance-bright">{note}</p>
      <span className="mt-auto flex items-center gap-2 pt-8 text-base font-semibold">
        Read the article
        <ArrowCircle bg="#ffffff" fg="#000000" size={23} />
      </span>
    </a>
  );
}

// The point of the rebuild: every section hands its reader on to the page
// that actually prices the thing they were reading about.
export function RelatedLinks({ lead, links }: { lead: string; links: HubLink[] }) {
  return (
    <nav aria-label="Related pages and tools" className="mt-8 rounded-[25px] bg-advance-light p-7">
      <p className="max-w-3xl text-base leading-relaxed text-ink/80">{lead}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            {l.label}
            <ArrowCircle bg="#000000" fg="#ffffff" size={16} />
          </a>
        ))}
      </div>
    </nav>
  );
}
