import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Pill, EyebrowPill } from "@/components/v2";

// Form destination page - noindex utility. Kept at its old URL.

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for getting in touch with LINK Wealth.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <main className="container-x flex min-h-[50vh] max-w-2xl flex-col justify-center py-24">
      <div className="mb-6">
        <EyebrowPill tint>Message received</EyebrowPill>
      </div>
      <h1 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px]">
        Thank you for getting in touch.
      </h1>
      <p className="mt-5 text-lg leading-[1.4] text-ink/80">
        A LINK Wealth team member will reach out to you shortly. Need an answer sooner? Call
        us on{" "}
        <a href={SITE.phoneHref} className="font-semibold text-wealth">
          {SITE.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Pill href="/insights">Read our insights</Pill>
        <Pill href="/" variant="ghost">
          Back home
        </Pill>
      </div>
    </main>
  );
}
