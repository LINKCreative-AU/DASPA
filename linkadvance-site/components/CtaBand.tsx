"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { SendFailed } from "./SendFailed";

// The sitewide closing band. Compact by rule (kit v3.20): the full
// qualifying form (chips, timing, long message) lives on the contact page,
// nowhere else. James, three times of asking. Then, 10 Aug, he asked for
// enough to know what the person actually wants, so the four fields gained
// a reason select and one optional line. The API already carried both:
// `reason` even goes into the lead subject for triage.
export function CtaBand({
  heading = "One broker, 35+ lenders, zero cost to you.",
  intro = "Tell us what you're planning and a broker will call to map your options. Free, no obligation. Most home loan broking is paid by the lender, not you.",
  variant = "contact",
  subject,
  formTitle = "Talk to a broker",
}: {
  heading?: string;
  intro?: string;
  variant?: "contact" | "discovery" | "guide";
  subject?: string;
  formTitle?: string;
}) {
  return (
    <section id="contact" className="container-x pb-24 pt-6">
      <div className="grid gap-10 rounded-3xl bg-ink p-8 text-white sm:p-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow guide-line-inline mb-4">
            <span className="text-white/60">Your broker for life.</span>
          </p>
          <h2 className="max-w-2xl font-display text-[34px] font-normal leading-[1.15] tracking-tight sm:text-[44px]">
            {heading}
          </h2>
          <p className="mt-4 max-w-xl text-white/70">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div>
              <p className="font-bold uppercase tracking-wider text-white/45">Call us</p>
              <a href={SITE.phoneHref} className="mt-1 block font-display text-xl font-bold hover:text-advance-bright">
                {SITE.phone}
              </a>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-white/45">Find us</p>
              <p className="mt-1 text-white/75">
                {SITE.address.street}, {SITE.address.suburb} {SITE.address.postcode}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/55">
            <span aria-hidden className="text-advance-bright">★★★★★</span>{" "}
            {SITE.reviews.rating.toFixed(1)} · based on {SITE.reviews.count} Google reviews
          </p>
        </div>
        <MiniForm variant={variant} subject={subject} formTitle={formTitle} />
      </div>
    </section>
  );
}

// Short on purpose: enough for a broker to open the call knowing which
// conversation it is, without turning the band back into a long form.
const REASONS = [
  "Buying my first home",
  "Buying or upgrading",
  "Refinancing an existing loan",
  "Investment property",
  "Building or renovating",
  "Business or commercial lending",
  "Not sure yet",
];

function MiniForm({
  variant,
  subject,
  formTitle,
}: {
  variant: "contact" | "discovery" | "guide";
  subject?: string;
  formTitle: string;
}) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", reason: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    // Only claim the enquiry landed if the server says it did.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variant, subject, age: "-", postcode: "-", newsletter: true }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex flex-col justify-center rounded-2xl border border-white/15 p-7">
        <h3 className="font-display text-2xl font-bold tracking-tight">Speak soon.</h3>
        <p className="mt-2 max-w-md text-white/70">
          {variant === "guide"
            ? "Your guide is on its way to your inbox, and we'll be in touch shortly."
            : "A broker will be in touch within a few business hours to talk it through. No cost, no obligation."}
        </p>

      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col justify-center">
      <p className="font-display text-lg font-bold">{formTitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Dark label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required autoComplete="given-name" />
        <Dark label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required autoComplete="family-name" />
        <Dark label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <Dark label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold text-white/50">What can we help with? *</span>
          <select
            required
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white [&>option]:bg-ink"
          >
            <option value="" disabled>
              Choose one
            </option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2">
          <Dark
            label="Anything we should know? (optional)"
            value={form.message}
            onChange={(v) => setForm({ ...form, message: v })}
          />
        </div>
      </div>
      <button type="submit" disabled={state === "sending"} className="btn mt-6 w-full bg-white text-ink hover:bg-neutral-100 disabled:opacity-50 sm:w-auto">
        {state === "sending" ? "Sending…" : "Book my free chat"}
      </button>
      {state === "error" && <SendFailed dark />}
    </form>
  );
}

function Dark({
  label, value, onChange, type = "text", required = false, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type} required={required} autoComplete={autoComplete} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white"
      />
    </label>
  );
}
