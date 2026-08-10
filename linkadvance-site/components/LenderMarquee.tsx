/* eslint-disable @next/next/no-img-element */

// The lender panel: all 31 logos the live site serves, mirrored locally
// from the WPStaq S3 origin and validated as real PNGs. The track renders
// the list twice and slides exactly -50%, so the ribbon never breaks or
// gaps; it pauses on hover and holds still under prefers-reduced-motion.

const LENDERS: { src: string; name: string }[] = [
  ["cba", "CommBank"], ["nab", "NAB"], ["anz", "ANZ"], ["westpac", "Westpac"],
  ["stgeorge", "St.George"], ["macquarie", "Macquarie"], ["suncorp", "Suncorp"],
  ["ing", "ING"], ["amp", "AMP"], ["citibank", "Citibank"], ["me", "ME Bank"],
  ["heritage", "Heritage"], ["mystate", "MyState"], ["auswide", "Auswide"],
  ["teachers", "Teachers Mutual"], ["unibank", "UniBank"],
  ["firefighters", "Firefighters Mutual"], ["health", "Health Professionals Bank"],
  ["gateway", "Gateway"], ["virgin", "Virgin Money"], ["pepper", "Pepper Money"],
  ["resimac", "Resimac"], ["firstmac", "Firstmac"], ["bluestone", "Bluestone"],
  ["latrobe", "La Trobe Financial"], ["betterchoice", "Better Choice"],
  ["bluebay", "Bluebay"], ["prospa", "Prospa"], ["getcapital", "GetCapital"],
  ["mkm", "MKM Capital"], ["bmm", "Better Mortgage Management"],
].map(([slug, name]) => ({ src: `/wp-content/uploads/media/2020/11/lender_${slug}.png`, name }));

export function LenderMarquee() {
  const row = (key: string, hidden: boolean) => (
    <div key={key} aria-hidden={hidden} className="flex shrink-0 items-center">
      {LENDERS.map((l) => (
        <img
          key={l.name}
          src={l.src}
          alt={hidden ? "" : l.name}
          loading="lazy"
          className="mx-7 h-10 w-auto max-w-[130px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12"
        />
      ))}
    </div>
  );
  return (
    <div className="marquee relative overflow-hidden py-2">
      <div className="marquee-track flex w-max">{[row("a", false), row("b", true)]}</div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-neutral-50 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-neutral-50 to-transparent sm:w-32" />
    </div>
  );
}
