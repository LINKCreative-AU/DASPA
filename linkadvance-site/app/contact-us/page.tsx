/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { SITE } from "@/lib/site";

// New page (the old site had no /contact URL - only footer forms). Gives the
// header CTA and every "Book a call" a stable destination.

export const metadata: Metadata = {
  title: "Contact Us: Talk to a Brisbane Mortgage Broker",
  description:
    // Was "financial advisors" on (07) 2101 4377: both wrong. 4377 is LINK
    // Wealth's number, and "financial adviser" is a restricted term tied to an
    // AFSL. Advance holds a credit authorisation, not an AFSL.
    "Book a free, no-obligation consultation with LINK Advance's Brisbane mortgage and finance brokers. Call (07) 2101 4374 or send us a message. We reply within a few business hours.",
  alternates: { canonical: "/contact-us" },
};

export default function Contact() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact-us" },
        ])}
      />
      <section className="container-x grid items-start gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow text-advance">Contact</span>
          <h1 className="mt-6 font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px]">
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
                className="mt-1 block font-display text-2xl font-bold text-ink hover:text-advance"
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
          <img
            src="/wp-content/uploads/2020/11/LINK-Heroshot-2025-1.jpg"
            alt="A business owner on the phone to her broker"
            loading="lazy"
            className="mt-10 aspect-[3/2] w-full rounded-3xl object-cover"
          />
        </div>
        <div>
          <p className="mb-4 font-display text-lg font-bold text-ink">Send us a message</p>
          <ContactForm subject="Contact page" />
        </div>
      </section>
    </main>
  );
}
