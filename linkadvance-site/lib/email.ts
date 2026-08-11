// Lead email delivery via Resend (https://resend.com), no SDK needed.
// Env: RESEND_API_KEY (required to send), LEADS_TO, RESEND_FROM.
// Without a key, callers fall back to console logging - leads are never silently dropped.

// Leads post into the #leads Slack channel via the LINK entity's own
// channel address (see SLACK-EMAIL-INTEGRATIONS.md in the linkhq repo, James
// 2026-07-28) so sources stay distinguishable in the channel. To add a direct
// recipient set LEADS_TO as a comma-separated list. NOTE: the default below is
// the shared LINK Slack leads address - set LEADS_TO to the Advance channel
// address before go-live (human item in README).
const TO = (process.env.LEADS_TO ?? "q8u7a0q9n1o8t9e6@linkcohq.slack.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// link.com.au is verified in Resend, so the shared leads@ sender works out of the box.
const FROM = process.env.RESEND_FROM ?? "LINK Advance website <leads@link.com.au>";

// Optional Slack notification: set SLACK_LEADS_WEBHOOK to an incoming-webhook URL
// for the leads channel and every lead posts there too.
async function postToSlack(subject: string, lines: [string, string][]) {
  const hook = process.env.SLACK_LEADS_WEBHOOK;
  if (!hook) return;
  const body = lines.map(([k, v]) => `*${k}:* ${v}`).join("\n");
  await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: `:house: *${subject}*\n${body}` }),
  }).catch((e) => console.error("[lead slack failed]", e));
}

export async function sendLeadEmail(subject: string, lines: [string, string][]) {
  const key = process.env.RESEND_API_KEY;
  const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");
  await postToSlack(subject, lines);
  if (!key) {
    console.log(`[lead - email not configured] ${subject}\n${text}`);
    return { sent: false as const };
  }
  const html =
    `<h2 style="font-family:sans-serif">${subject}</h2>` +
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    lines
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${v}</strong></td></tr>`
      )
      .join("") +
    `</table>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: TO, subject, text, html }),
  });
  if (!res.ok) {
    console.error("[lead email failed]", res.status, await res.text().catch(() => ""));
    console.log(`[lead - fallback log] ${subject}\n${text}`);
    return { sent: false as const };
  }
  return { sent: true as const };
}

// REMOVED Aug 2026: sendGuideEmail(). This file was copied from linkwealth-site
// and the lead-magnet function came with it intact - it sent LINK Wealth's SMSF
// Property Purchase Guide, LINK Wealth's phone number ((07) 2101 4377, not
// Advance's 4374) and, at the foot of the message, LINK Wealth's AFSL
// disclosure naming Richard Leal, Link Wealth Pty Ltd and Millennium 3's
// AFSL 244252. All of it would have gone out over an Advance sender.
//
// No Advance page passes variant="guide", so it never fired in normal use, but
// it was still reachable by POSTing that variant to /api/contact. Advance has
// no lead magnet of its own; if one is ever added, write a new function with
// Advance's identity rather than reviving this.
