import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/email";

// Receives both form variants (general contact and free discovery meeting).
// Subject line carries the page context so triage can prioritise from the
// inbox list view alone.

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const name = [data?.firstName, data?.lastName].filter(Boolean).join(" ");
  if (!name || !data?.email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const s = (v: unknown) => (v ? String(v) : "-");
  const kind = data.variant === "discovery" ? "Discovery meeting" : "Contact";
  const subject = `Wealth lead - ${kind}${data.subject ? ` (${s(data.subject)})` : ""} - ${name}`;

  const { sent } = await sendLeadEmail(subject, [
    ["Name", name],
    ["Email", s(data.email)],
    ["Phone", s(data.phone)],
    ["Postcode", s(data.postcode)],
    ["Age band", s(data.age)],
    ["Page", s(data.subject)],
    ["Newsletter opt-in", data.newsletter ? "Yes" : "No"],
    ["Message", s(data.message)],
  ]);
  // The email is the only record of this enquiry. Reporting success over a
  // send that did not happen loses the lead twice: once in the pipe, and once
  // because the person believes they have already reached us.
  if (!sent) {
    return NextResponse.json({ ok: false, error: "not-delivered" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
