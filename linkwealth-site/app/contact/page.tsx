import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { SITE } from "@/lib/site";

// New page (the old site had no /contact URL - only footer forms). Gives the
// header CTA and every "Book a call" a stable destination.

export const metadata: Metadata = {
  title: "Contact | Book a Call",
  description:
    "Book a free, no-obligation consultation with LINK Wealth's Brisbane financial advisors. Call (07) 2101 4377 or send us a message - we reply within a few business hours.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="container-x grid items-start gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow text-wealth">Contact</span>
          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.02] tracking-tight text-ink sm:text-5xl">
            Your path to financial freedom <span className="marker">is waiting.</span>
          </h1>
          <p className="mt-6 text-lg text-ink/70">
            The first step is a free, no-obligation consultation. We’ll get to know you and
            your goals. You’ll get moving in the right direction. Let’s get started.
          </p>
          <div className="mt-10 space-y-6 text-sm">
            <div>
              <p className="font-bold uppercase tracking-wider text-ink/50">Call us</p>
              <a
                href={SITE.phoneHref}
                className="mt-1 block font-display text-2xl font-bold text-ink hover:text-wealth"
              >
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-ink/50">Find us</p>
              <p className="mt-1 text-ink/75">
                {SITE.address.street}, {SITE.address.suburb}, Brisbane, Queensland{" "}
                {SITE.address.postcode}
              </p>
              <p className="mt-1 text-ink/55">Free parking and great coffee if you’d like to visit in person.</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-ink/50">Google rating</p>
              <p className="mt-1 text-ink/75">
                {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count} reviews
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-4 font-display text-lg font-bold text-ink">Send us a message</p>
          <ContactForm subject="Contact page" />
        </div>
      </section>
    </main>
  );
}
