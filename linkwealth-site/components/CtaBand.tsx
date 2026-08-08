import { ContactForm } from "./ContactForm";
import { SITE } from "@/lib/site";

// The sitewide closing band in the house CTABand treatment (dark rounded
// panel inside the content column), with the contact form embedded - the old
// Wealth site carried its form in the footer band of every page, and the
// leads matter more than the minimalism.
export function CtaBand({
  heading = "Your path to financial freedom is waiting.",
  intro = "The first step is a free, no-obligation consultation. We'll get to know you and your goals. You'll get moving in the right direction. Let's get started.",
  variant = "contact",
  subject,
  formTitle = "Contact us",
}: {
  heading?: string;
  intro?: string;
  variant?: "contact" | "discovery";
  subject?: string;
  formTitle?: string;
}) {
  return (
    <section id="contact" className="container-x pb-24 pt-6">
      <div className="grid gap-10 rounded-3xl bg-ink p-8 text-white sm:p-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow guide-line-inline mb-4">
            <span className="text-white/60">No cost, no obligation</span>
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-normal tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-xl text-white/70">{intro}</p>
          <div className="mt-8 space-y-5 text-sm">
            <div>
              <p className="font-bold uppercase tracking-wider text-white/45">Call us</p>
              <a
                href={SITE.phoneHref}
                className="mt-1 block font-display text-xl font-bold hover:text-wealth-bright"
              >
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-white/45">Find us</p>
              <p className="mt-1 text-white/75">
                {SITE.address.street}, {SITE.address.suburb}, Brisbane, Queensland{" "}
                {SITE.address.postcode}
              </p>
            </div>
            <p className="text-white/55">
              <span aria-hidden className="text-wealth-bright">
                ★★★★★
              </span>{" "}
              {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count} Google reviews
            </p>
          </div>
        </div>
        <div>
          <p className="mb-4 font-display text-lg font-bold">{formTitle}</p>
          <ContactForm variant={variant} subject={subject} />
        </div>
      </div>
    </section>
  );
}
