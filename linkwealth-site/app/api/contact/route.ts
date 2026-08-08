import { NextResponse } from "next/server";
import { sendLeadEmail, sendGuideEmail } from "@/lib/email";

// Receives all form variants (general contact, free discovery meeting, and
// the SMSF-guide lead magnet). Subject line carries the page context so
// triage can prioritise from the inbox list view alone.

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const name = [data?.firstName, data?.lastName].filter(Boolean).join(" ");
  if (!name || !data?.email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const s = (v: unknown) => (v ? String(v) : "-");
  const kind =
    data.variant === "guide"
      ? "SMSF guide"
      : data.variant === "discovery"
        ? "Discovery meeting"
        : "Contact";
  const subject = `Wealth lead - ${kind}${data.reason ? ` (${s(data.reason)})` : ""}${
    data.subject ? ` - ${s(data.subject)}` : ""
  } - ${name}`;

  const { sent } = await sendLeadEmail(subject, [
    ["Name", name],
    ["Email", s(data.email)],
    ["Phone", s(data.phone)],
    ["Reason", s(data.reason)],
    ["Timeframe", s(data.timing)],
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

  // Lead magnet: deliver the guide to the visitor. The thank-you screen also
  // shows the direct download, so a failed guide email never strands anyone.
  if (data.variant === "guide") {
    await sendGuideEmail(String(data.email), s(data.firstName));
  }

  return NextResponse.json({ ok: true });
}
