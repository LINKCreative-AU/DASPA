/* eslint-disable @next/next/no-img-element */
import { SectionHead } from "./SectionHead";

// "Meet your financial force." - the live team roster with the same photos
// the old site serves (mirrored under /wp-content so URLs survive cutover).
const PHOTOS: Record<string, string> = {
  "Richard Leal": "/wp-content/uploads/2026/06/Richard-Wealth-1024-x-1024-Grey-Square-768x768.jpg",
  "PJ Byrne": "/wp-content/uploads/2026/06/PJ-Wealth-1024-x-1024-Grey-Square-768x768.jpg",
  "James Webb": "/wp-content/uploads/2026/06/James-General-1024x1024-Square-Grey-768x768.jpg",
  "Chris Tinta": "/wp-content/uploads/2026/06/Chris-Advisors-1024x1024-Grey-Square-768x768.jpg",
  "Rhonda Burton": "/wp-content/uploads/2026/06/Rhonda-Growth-1024x1024-Grey-Square-768x768.jpg",
  "JC Crusit": "/wp-content/uploads/2026/06/JC-Wealth-1024x1024-Grey-Square-768x768.jpg",
  "Nathan Phengrasmy": "/wp-content/uploads/2024/11/Nathan-General-1024x1024-LinkedIn.png",
};

export function TeamGrid({
  heading = "Meet your financial force.",
  eyebrow = "The team",
  members,
}: {
  heading?: string;
  eyebrow?: string;
  members: readonly { name: string; role: string }[];
}) {
  return (
    <section className="py-20">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow} title={heading} />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {members.map((m) => (
            <div key={m.name}>
              {PHOTOS[m.name] && (
                <img
                  src={PHOTOS[m.name]}
                  alt={`${m.name}, ${m.role} at LINK Wealth`}
                  loading="lazy"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              )}
              <h3 className="mt-3 font-display text-base font-bold tracking-tight text-ink">
                {m.name}
              </h3>
              <p className="text-sm text-ink/55">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
