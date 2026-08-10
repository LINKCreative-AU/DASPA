/* eslint-disable @next/next/no-img-element */
import { SectionHead } from "./SectionHead";

// "Meet our Mortgage Brokers." - the live broker roster with the same grey
// square portraits the old site serves (mirrored under /wp-content so URLs
// survive cutover). Images travel on the TEAM entries in lib/site.ts.

export function TeamGrid({
  heading = "Meet our Mortgage Brokers.",
  eyebrow,
  members,
}: {
  heading?: string;
  eyebrow?: string;
  members: readonly { name: string; role: string; focus?: string; image?: string }[];
}) {
  return (
    <section className="py-20">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={heading} />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {members.map((m) => (
            <div key={m.name}>
              {m.image && (
                <img
                  src={m.image}
                  alt={`${m.name}, ${m.role} at LINK Advance`}
                  loading="lazy"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              )}
              <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
                {m.name}
              </h3>
              <p className="text-sm text-ink/55">{m.role}</p>
              {m.focus && <p className="mt-2 text-sm text-ink/70">{m.focus}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
