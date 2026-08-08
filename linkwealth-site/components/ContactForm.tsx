"use client";

import { useState } from "react";
import { SendFailed } from "./SendFailed";

// The old site ran two WP Forms: a general "Contact Us" (name, email, phone,
// message) and a "Free Discovery Meeting" variant with postcode + age band.
// Both live here; the discovery variant is the default on service pages
// because the age band is what lets Richard prepare properly for the call.

const AGES = ["Under 30", "30-39", "40-49", "50-54", "55-59", "60-69", "70 and over"];

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  postcode: "",
  age: "",
  message: "",
  newsletter: true,
};

export function ContactForm({
  variant = "contact",
  subject,
}: {
  variant?: "contact" | "discovery";
  subject?: string;
}) {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof initial) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const discovery = variant === "discovery";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFailed(false);
    // Only claim the enquiry landed if the server says it did.
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, variant, subject }),
      });
      if (res.ok) setSent(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl2 border border-line bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-wealth-dark">
          Message sent
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Speak soon.</h3>
        <p className="mt-3 text-ink/65">
          Thanks for reaching out. We&apos;ll be in touch within a few business hours to
          discuss your needs{discovery ? " and set up a time for your discovery meeting" : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl2 border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={form.firstName} onChange={set("firstName")} required autoComplete="given-name" />
        <Field label="Last name" value={form.lastName} onChange={set("lastName")} required autoComplete="family-name" />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} required autoComplete="email" />
        <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} required autoComplete="tel" />
        {discovery && (
          <>
            <Field label="Postcode" value={form.postcode} onChange={set("postcode")} required autoComplete="postal-code" />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink/60">What is your age?</span>
              <select
                value={form.age}
                required
                onChange={(e) => set("age")(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-wealth-dark focus:outline-none"
              >
                <option value="">Please select</option>
                {AGES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-semibold text-ink/60">
          How can we help?
        </span>
        <textarea
          value={form.message}
          rows={4}
          required={discovery}
          onChange={(e) => set("message")(e.target.value)}
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-wealth-dark focus:outline-none"
        />
      </label>
      <label className="mt-4 flex items-start gap-2.5 text-sm text-ink/65">
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => set("newsletter")(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-wealth-dark"
        />
        Sign up to our mailing list to receive insights from LINK
      </label>

      <button type="submit" disabled={busy} className="btn btn-wealth mt-6 w-full sm:w-auto">
        {busy ? "Sending…" : discovery ? "Book my free discovery meeting" : "Send message"}
      </button>
      {failed && <SendFailed />}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-wealth-dark focus:outline-none"
      />
    </label>
  );
}
