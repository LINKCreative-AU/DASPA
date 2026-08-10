"use client";

import { useState } from "react";
import { SendFailed } from "./SendFailed";

// Qualifying lead form in the Advisors chip pattern: taps a visitor can
// answer in seconds, mapped to what triage actually needs - reason,
// timeframe, and (on the discovery variant) the age band Richard uses to
// prepare the modelling. Three variants:
//   contact   - reason + timeframe chips + details
//   discovery - adds postcode + age band (the old site's discovery form)
//   guide     - the SMSF Property Purchase Guide lead magnet; on success the
//               guide is emailed AND offered as a direct download

const REASONS = [
  "Retirement planning",
  "Building wealth",
  "SMSF / super",
  "Property & home equity",
  "Insurance review",
  "Business owner strategy",
  "Inheritance",
  "Something else",
];

const TIMING = ["As soon as possible", "In the next month", "Next few months", "Just researching"];

const AGES = ["Under 30", "30-39", "40-49", "50-54", "55-59", "60-69", "70 and over"];

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(value === o ? "" : o)}
          className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${
            value === o
              ? "border-wealth bg-wealth text-white"
              : "border-ink/15 text-ink/65 hover:border-ink"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const initial = {
  reason: "",
  timing: "",
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
  variant?: "contact" | "discovery" | "guide";
  subject?: string;
}) {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof initial) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const discovery = variant === "discovery";
  const guide = variant === "guide";

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
      <div className="rounded-[25px] bg-[#f1f1f1] p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-wealth">
          {guide ? "Guide on its way" : "Message sent"}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Speak soon.
        </h3>
        {guide ? (
          <>
            <p className="mt-3 text-ink/65">
              Your SMSF Property Purchase Guide is on its way to your inbox, and we&apos;ll be
              in touch shortly to arrange your free strategy call. Want it right now?
            </p>
            <a
              href="/downloads/LINK-SMSF-Property-Guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wealth mt-5"
            >
              Download the guide
            </a>
          </>
        ) : (
          <p className="mt-3 text-ink/65">
            Thanks for reaching out. We&apos;ll be in touch within a few business hours to
            discuss your needs{discovery ? " and set up a time for your discovery meeting" : ""}.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[25px] bg-[#f1f1f1] p-6 sm:p-7">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-bold text-ink">
            {guide ? "What's driving the interest?" : "What brings you to LINK Wealth?"}
          </p>
          <Chips
            options={guide ? ["Buying our premises", "Starting an SMSF", "Just researching"] : REASONS}
            value={form.reason}
            onChange={set("reason")}
          />
        </div>
        {!guide && (
          <div>
            <p className="text-xs font-semibold text-ink/60">When do you want to get moving?</p>
            <Chips options={TIMING} value={form.timing} onChange={set("timing")} />
          </div>
        )}

        <div className="border-t border-ink/10 pt-4">
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
                    className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm focus:border-wealth focus:outline-none"
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
          {showMsg || form.message ? (
            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-semibold text-ink/60">
                How can we help? <span className="font-normal text-ink/40">optional</span>
              </span>
              <textarea
                value={form.message}
                rows={2}
                autoFocus={showMsg && !form.message}
                onChange={(e) => set("message")(e.target.value)}
                className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-wealth focus:outline-none"
              />
            </label>
          ) : (
            <button
              type="button"
              onClick={() => setShowMsg(true)}
              className="mt-4 text-sm font-semibold text-ink/50 hover:text-ink"
            >
              + Add a message <span className="font-normal text-ink/40">(optional)</span>
            </button>
          )}
          <label className="mt-3 flex items-start gap-2.5 text-xs text-ink/60">
            <input
              type="checkbox"
              checked={form.newsletter}
              onChange={(e) => set("newsletter")(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-wealth"
            />
            Sign up to our mailing list to receive insights from LINK
          </label>
        </div>
      </div>

      <button type="submit" disabled={busy} className="btn btn-wealth mt-5 w-full sm:w-auto">
        {busy
          ? "Sending…"
          : guide
            ? "Send me the free SMSF guide"
            : discovery
              ? "Book my free discovery meeting"
              : "Send message"}
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
        className="w-full rounded-lg border border-line px-4 py-2.5 text-sm focus:border-wealth focus:outline-none"
      />
    </label>
  );
}
