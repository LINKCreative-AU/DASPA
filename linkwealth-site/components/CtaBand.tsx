import { ContactForm } from "./ContactForm";
import { SITE } from "@/lib/site";

// The sitewide closing band, carried from the old site: "Your path to
// financial freedom is waiting" + the contact form + call/find us panel.
// Every page ends here so a reader never runs out of page without a way in.
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
    <section id="contact" className="wealth-gradient py-16 sm:py-24">
      <div className="container-x grid items-start gap-12 lg:grid-cols-2">
        <div className="text-white">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/80">{intro}</p>
          <div className="mt-10 space-y-6 text-sm">
            <div>
              <p className="font-bold uppercase tracking-wider text-white/60">Call us</p>
              <a href={SITE.phoneHref} className="mt-1 block font-display text-2xl font-bold hover:text-wealth-bright">
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-white/60">Find us</p>
              <p className="mt-1 text-white/85">
                {SITE.address.street}, {SITE.address.suburb}, Brisbane, Queensland{" "}
                {SITE.address.postcode}
              </p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-white/60">Google rating</p>
              <p className="mt-1 text-white/85">
                {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count} reviews
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-4 font-display text-lg font-bold text-white">{formTitle}</p>
          <ContactForm variant={variant} subject={subject} />
        </div>
      </div>
    </section>
  );
}
