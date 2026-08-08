import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// Form destination page - noindex utility. Kept at its old URL.

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for getting in touch with LINK Advance.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <main className="container-x flex min-h-[50vh] max-w-2xl flex-col justify-center py-24">
      <span className="eyebrow mb-5 text-advance">Message received</span>
      <h1 className="font-display text-4xl font-normal tracking-tight text-ink">
        Thank you for getting in touch.
      </h1>
      <p className="mt-5 text-lg text-ink/65">
        A LINK Advance broker will reach out to you shortly. Need an answer sooner? Call
        us on{" "}
        <a href={SITE.phoneHref} className="font-semibold text-advance">
          {SITE.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex gap-3">
        <a href="/blog" className="btn btn-primary">
          Read our insights
        </a>
        <a href="/" className="btn btn-ghost">
          Back home
        </a>
      </div>
    </main>
  );
}
