// Editorial section header in the V1.5 style: big faded number, grey eyebrow with Guide Line,
// then a large bold title with a period. `accent` renders the eyebrow's guide line in green.
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
          <span
            className={`eyebrow ${accent ? "text-wealth-dark" : ""} ${
              dark ? "!border-white/60 !text-white/60" : ""
            }`}
          >
            {eyebrow}
          </span>
        </div>
      )}
      <Tag
        className={`font-display text-4xl font-normal leading-[1.02] tracking-tight sm:text-5xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {markTitle(title, mark)}
      </Tag>
      {intro && (
        <p className={`mt-5 text-lg ${dark ? "text-white/70" : "text-ink/65"}`}>{intro}</p>
      )}
    </div>
  );
}
