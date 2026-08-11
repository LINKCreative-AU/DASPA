"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Pill } from "./v2";

// The three brokers, one at a time, with what each of them actually does.
// This replaces both the old team grid and the separate commercial band:
// the commercial pitch belongs to Jacob, the first home pitch belongs to
// Callum, and saying it through the person is worth more than a band of
// prose nobody reads.
//
// Every panel stays in the DOM (hidden, never unmounted) so all the copy
// and every link is crawlable, the same rule the lane chooser follows.

type Spec = {
  id: string;
  name: string;
  role: string;
  photo: string;
  headline: string;
  body: string[];
  does: string[];
  links: { label: string; href: string }[];
  cta?: { label: string; href: string };
};

const SPECIALISTS: Spec[] = [
  {
    id: "hugh",
    name: "Hugh",
    role: "Co-Founder & Director",
    photo: "/wp-content/uploads/2026/05/Hugh-1024x1024-LinkedIn-Square-Grey.png",
    headline: "Every loan, fought for.",
    body: [
      "Hugh founded the desk on a simple idea: the broker who meets you should be the broker who writes your loan, drives the approval and picks up the phone two years later when the rate drifts. No hand-offs, no call centre, no file passed to someone you have never met.",
      "A background in real estate and property brokerage means he reads a deal from both sides, which is why the negotiation tends to go our way.",
    ],
    does: [
      "Refinancing and the yearly repricing call",
      "Complex applications the banks pushed back on",
      "Buying and selling in the same window",
    ],
    links: [
      { label: "Refinancing", href: "/refinancing-brisbane" },
      { label: "Home loans", href: "/home-loans-brisbane" },
      { label: "Bridging loans", href: "/bridging-loans" },
    ],
    cta: { label: "Check your current loan", href: "/home-loan-health-check" },
  },
  {
    id: "callum",
    name: "Callum",
    role: "Mortgage Broker",
    photo: "/wp-content/uploads/2026/05/Callum-Advance-1024x1024-LinkedIn-Grey-Square.png",
    headline: "First home, done without the second-guessing.",
    body: [
      "Callum runs the first home desk, and most of our first home reviews name him. Five years on both sides of the lending desk, as a loan processor and as a broker, plus a Bachelor of Business majoring in Economics and Finance: he knows what the assessor is looking for before the file goes anywhere.",
      "For Queensland first home buyers he sequences the whole stack, because the schemes interact and most people only ever claim one of them.",
    ],
    does: [
      "The $30,000 grant, checked against the real rules",
      "Zero stamp duty on new builds since May 2025",
      "5% deposit with no LMI under the First Home Guarantee",
      "Investors building a portfolio, structured properly",
    ],
    links: [
      { label: "First home buyers", href: "/first-home-buyers-loan" },
      { label: "First Home Owners Grant", href: "/first-home-buyers-grant" },
      { label: "Investment loans", href: "/investment-home-loans" },
    ],
    cta: { label: "Run the grant eligibility check", href: "/first-home-buyers-grant" },
  },
  {
    id: "jacob",
    name: "Jacob",
    role: "Mortgage Broker",
    photo: "/wp-content/uploads/2026/05/Jacob-1024x1024-LinkedIn-Square-Grey.png",
    headline: "The lending other brokers find difficult.",
    body: [
      "Jacob runs the commercial desk. Business lending has no rate card: every deal is priced on the strength of its file, so the work is building that file the way a credit team reads it. Two years of financials and what they really say once add-backs are understood, the ATO position, the security, and what the money actually does.",
      "Then it goes to the banks, non-banks and private lenders whose appetite fits your deal, and the pricing comes from competition rather than hope. The spread between lenders on the same commercial deal is routinely whole percentage points.",
    ],
    does: [
      "Premises purchases, including through your SMSF, at LVRs up to 80%",
      "Working capital against invoices, equipment and trade",
      "Acquisitions funded at 50-70% of maintainable earnings",
      "Development finance at 65-80% of total development cost",
    ],
    links: [
      { label: "Commercial lending", href: "/commercial-lending" },
      { label: "Commercial property", href: "/commercial-property-loans" },
      { label: "Development finance", href: "/development-finance" },
    ],
    cta: { label: "Score your business file", href: "/business-borrowing-health-check" },
  },
];

export function Specialists() {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + SPECIALISTS.length) % SPECIALISTS.length);

  return (
    <section className="bg-ink py-20 text-white sm:py-24">
      <div className="container-x">
        <h2 className="max-w-2xl font-display text-[34px] font-normal leading-[1.15] tracking-tight sm:text-[44px]">
          Three brokers, three specialities<span className="text-advance-bright">.</span>
        </h2>

        {/* Name tabs, each with the face: the "scroll through the guys" control.
            James, 11 Aug: the arrows used to sit in the top right corner of the
            section, level with the heading and a long way from the thing they
            move. Nothing about that position said what they did. They now flank
            the faces, so the control and what it controls read as one object.
            The chips are still the primary way in; the arrows are the shortcut.

            No flex-1 on the chip group: it would stretch to fill the container
            and fling the right arrow back out to the page edge, which is the
            problem being fixed. Natural width keeps both arrows on the faces.

            Arrows are sm-and-up only. On a phone all three chips are stacked
            and visible at once, so the arrows carry no information the faces
            do not - and at 390px the row cannot fit them, so they wrapped onto
            their own lines and read as stray buttons. Tapping a face is the
            better mobile control anyway. */}
        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={() => go(i - 1)}
            aria-label="Previous broker"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 transition hover:border-white hover:bg-white/10 sm:flex"
          >
            <span aria-hidden>←</span>
          </button>

          <div className="flex flex-wrap gap-3">
            {SPECIALISTS.map((s, n) => {
              const on = n === i;
              return (
                <button
                  key={s.id}
                  onClick={() => setI(n)}
                  aria-pressed={on}
                  className={`flex items-center gap-3 rounded-full py-2 pl-2 pr-5 transition ${
                    on ? "bg-white text-ink" : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <img
                    src={s.photo}
                    alt=""
                    className={`h-10 w-10 rounded-full object-cover ${on ? "" : "opacity-70 grayscale"}`}
                    loading="lazy"
                  />
                  <span className="text-left">
                    <span className="block text-[15px] font-semibold leading-tight">{s.name}</span>
                    <span className={`block text-[12px] ${on ? "text-ink/55" : "text-white/45"}`}>
                      {s.role}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => go(i + 1)}
            aria-label="Next broker"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 transition hover:border-white hover:bg-white/10 sm:flex"
          >
            <span aria-hidden>→</span>
          </button>
        </div>

        {SPECIALISTS.map((s, n) => (
          <article
            key={s.id}
            hidden={n !== i}
            className={n !== i ? "hidden" : "mt-10 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]"}
          >
            {/* These are studio headshots with a grey backdrop baked in, so
                they are shown as full-bleed portraits. mix-blend-multiply
                only works on true white-background cutouts. */}
            <div className="overflow-hidden rounded-[25px]">
              <img
                src={s.photo}
                alt={`${s.name}, ${s.role} at LINK Advance`}
                className="aspect-[4/5] w-full object-cover object-top"
                loading={n === 0 ? undefined : "lazy"}
              />
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {s.headline}
              </p>
              {s.body.map((p) => (
                <p key={p.slice(0, 30)} className="mt-4 max-w-2xl text-lg leading-[1.5] text-white/75">
                  {p}
                </p>
              ))}
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {s.does.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[15px] text-white/80">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-advance-bright" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {s.cta && (
                  <Pill href={s.cta.href} variant="onDark">
                    {s.cta.label}
                  </Pill>
                )}
                {s.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
