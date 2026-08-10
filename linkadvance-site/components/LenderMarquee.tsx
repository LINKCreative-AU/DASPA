/* eslint-disable @next/next/no-img-element */

// The lender panel, scrolling - all 31 logos the old homepage served,
// mirrored locally. Pure CSS marquee: the row is rendered twice and slides
// -50%; pauses on hover, static under prefers-reduced-motion.

const LENDERS: { src: string; name: string }[] = [
  { src: "/wp-content/uploads/media/2020/11/lender_amp.png", name: "Amp" },
  { src: "/wp-content/uploads/media/2020/11/lender_anz.png", name: "Anz" },
  { src: "/wp-content/uploads/media/2020/11/lender_auswide.png", name: "Auswide" },
  { src: "/wp-content/uploads/media/2020/11/lender_betterchoice.png", name: "Betterchoice" },
  { src: "/wp-content/uploads/media/2020/11/lender_bluebay.png", name: "Bluebay" },
  { src: "/wp-content/uploads/media/2020/11/lender_bluestone.png", name: "Bluestone" },
  { src: "/wp-content/uploads/media/2020/11/lender_bmm.png", name: "Bmm" },
  { src: "/wp-content/uploads/media/2020/11/lender_cba.png", name: "Cba" },
  { src: "/wp-content/uploads/media/2020/11/lender_citibank.png", name: "Citibank" },
  { src: "/wp-content/uploads/media/2020/11/lender_firefighters.png", name: "Firefighters" },
  { src: "/wp-content/uploads/media/2020/11/lender_firstmac.png", name: "Firstmac" },
  { src: "/wp-content/uploads/media/2020/11/lender_gateway.png", name: "Gateway" },
  { src: "/wp-content/uploads/media/2020/11/lender_getcapital.png", name: "Getcapital" },
  { src: "/wp-content/uploads/media/2020/11/lender_health.png", name: "Health" },
  { src: "/wp-content/uploads/media/2020/11/lender_heritage.png", name: "Heritage" },
  { src: "/wp-content/uploads/media/2020/11/lender_ing.png", name: "Ing" },
  { src: "/wp-content/uploads/media/2020/11/lender_latrobe.png", name: "Latrobe" },
  { src: "/wp-content/uploads/media/2020/11/lender_macquarie.png", name: "Macquarie" },
  { src: "/wp-content/uploads/media/2020/11/lender_me.png", name: "Me" },
  { src: "/wp-content/uploads/media/2020/11/lender_mkm.png", name: "Mkm" },
  { src: "/wp-content/uploads/media/2020/11/lender_mystate.png", name: "Mystate" },
  { src: "/wp-content/uploads/media/2020/11/lender_nab.png", name: "Nab" },
  { src: "/wp-content/uploads/media/2020/11/lender_pepper.png", name: "Pepper" },
  { src: "/wp-content/uploads/media/2020/11/lender_prospa.png", name: "Prospa" },
  { src: "/wp-content/uploads/media/2020/11/lender_resimac.png", name: "Resimac" },
  { src: "/wp-content/uploads/media/2020/11/lender_stgeorge.png", name: "Stgeorge" },
  { src: "/wp-content/uploads/media/2020/11/lender_suncorp.png", name: "Suncorp" },
  { src: "/wp-content/uploads/media/2020/11/lender_teachers.png", name: "Teachers" },
  { src: "/wp-content/uploads/media/2020/11/lender_unibank.png", name: "Unibank" },
  { src: "/wp-content/uploads/media/2020/11/lender_virgin.png", name: "Virgin" },
  { src: "/wp-content/uploads/media/2020/11/lender_westpac.png", name: "Westpac" }
];

export function LenderMarquee() {
  const row = (key: string, hidden: boolean) => (
    <div key={key} aria-hidden={hidden} className="flex shrink-0 items-center gap-14 pr-14">
      {LENDERS.map((l) => (
        <img
          key={l.name}
          src={l.src}
          alt={hidden ? "" : l.name}
          loading="lazy"
          className="h-9 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-11"
        />
      ))}
    </div>
  );
  return (
    <div className="marquee mt-8 overflow-hidden">
      <div className="marquee-track flex w-max">{[row("a", false), row("b", true)]}</div>
    </div>
  );
}
