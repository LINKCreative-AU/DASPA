// Editorial section header in the V2 style: a bordered EyebrowPill, then the
// display heading. `accent` fills the eyebrow with the Wealth light tint (the
// treatment reserved for the pill that sits above an H1).
import { EyebrowPill } from "./v2";

function markTitle(title: string, mark?: string) {
  if (!mark) return title;
  const i = title.indexOf(mark);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="marker">{mark}</span>
      {title.slice(i + mark.length)}
    </>
  );
}

export function SectionHead({
  no,
  eyebrow,
  title,
  mark,
  intro,
  dark = false,
  accent = false,
  as: Tag = "h2",
}: {
  no?: string;
  eyebrow?: string;
  title: string;
  mark?: string; // substring of title to wrap in the marker highlight
  intro?: string;
  dark?: boolean;
  accent?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <div className="mb-6">
          <EyebrowPill tint={accent && !dark} onDark={dark}>
            {eyebrow}
          </EyebrowPill>
        </div>
      )}
      <Tag
        className={`font-display font-normal leading-[1.15] tracking-tight ${
          Tag === "h1"
            ? "text-[40px] sm:text-[50px] lg:text-[58px]"
            : "text-[34px] sm:text-[44px]"
        } ${dark ? "text-white" : "text-ink"}`}
      >
        {markTitle(title, mark)}
      </Tag>
      {intro && (
        <p className={`mt-5 text-lg leading-[1.4] ${dark ? "text-white/80" : "text-ink/80"}`}>{intro}</p>
      )}
    </div>
  );
}
