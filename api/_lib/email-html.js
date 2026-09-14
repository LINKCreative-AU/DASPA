// The HTML email shell and its parts.
//
// Structure lifted from the ABN Assist confirmation Juan supplied, in DASPA's
// palette: navy band with the wordmark and the phone opposite, white card,
// reference chip, amber callout carrying the one thing the client has to do,
// numbered what-happens-next, the invoice inline, then a footer that says this
// is a service message and not marketing.
//
// WHY TABLES AND INLINE STYLES. Outlook on Windows renders through Word, which
// has no flexbox, no grid and no <style> support worth relying on. A 600px
// table with every style on the element is the only layout that survives every
// client, and it is why this file looks like 2004.
//
// EVERY INTERPOLATED VALUE GOES THROUGH esc(). A claimant's name arrives from a
// form and lands in an inbox; an apostrophe in O'Brien is harmless and a
// "<script>" is not, and an unescaped ampersand breaks the markup for everyone.
//
// EVERY EMAIL SHIPS A PLAIN-TEXT ALTERNATIVE. Resend will generate one from the
// HTML if asked, but the result reads like stripped markup. A hand-written text
// part is also what some spam filters look for, and what a screen reader in
// text mode gets.

'use strict';

const config = require('./config');

// DASPA's palette, from assets/site.css. Hex, not CSS variables: Word does not
// support custom properties.
const C = {
  ground: '#F6F7FD',
  card: '#FFFFFF',
  navy: '#14164A',
  accent: '#4A7BFF',
  ink: '#1e2250',
  muted: '#5a6480',
  line: '#DCE0F2',
  green: '#1b9e62',
  greenBg: '#E3F5EC',
  amber: '#8a5d0b',
  amberBg: '#FFF8E4',
  amberEdge: '#E8B33A',
  chipBg: '#EFF4FF',
};

const FONT = 'Arial,Helvetica,sans-serif';

/* 600px, fixed, the same as the ABN Assist reference.
   It does overflow a 390px viewport, and that is a deliberate non-fix: Gmail,
   Apple Mail and Outlook mobile all scale a 600px message down to fit, 600 is
   the most battle-tested width in email, and the fluid-hybrid alternative
   trades a cosmetic gain on mobile for a real risk of breaking Outlook on
   Windows, which renders through Word and has no media queries. Checked at 700
   and 390 in Chromium: readable at both, and the invoice block holds its
   columns. */
const WIDTH = 600;

function esc(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* The whole document. `preheader` is the grey line a client sees next to the
   subject in their inbox before opening it; left empty, most clients show the
   first words of the body instead, which here would be the phone number. */
function shell({ title, preheader, body }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.ground};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader || '')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ground};border-collapse:collapse">
  <tr><td align="center" style="padding:28px 12px">
    <table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" style="width:${WIDTH}px;max-width:100%;border-collapse:collapse">
      <tr><td style="background:${C.navy};border-radius:16px 16px 0 0;padding:22px 28px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>
          <td style="font-family:${FONT};font-size:21px;font-weight:bold;color:#ffffff;letter-spacing:-.01em">DASP<span style="color:${C.accent}">A</span><span style="color:${C.accent}">.</span></td>
          <td align="right" style="font-family:${FONT};font-size:13px;font-weight:bold;color:#ffffff">1800 546 526</td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${C.card};padding:30px 28px 26px;font-family:${FONT};color:${C.ink};line-height:1.6">
${body}
      </td></tr>
      <tr><td style="background:${C.card};border-radius:0 0 16px 16px;border-top:1px solid ${C.line};padding:18px 28px 24px;font-family:${FONT};font-size:12px;color:${C.muted};line-height:1.6">
        <p style="margin:0">Australian Registration Office Pty Ltd trading as DASPA<br>
        ABN 58 645 964 156 &middot; Registered Tax Agent 26076969<br>
        <a href="mailto:claims@daspa.com.au" style="color:${C.accent}">claims@daspa.com.au</a> &middot; 1800 546 526 in Australia &middot; +61 7 2101 4373 from overseas</p>
      </td></tr>
      <tr><td style="padding:16px 28px;font-family:${FONT};font-size:11px;color:${C.muted};text-align:center;line-height:1.5">
        You are receiving this because you placed an order with DASPA. This is a service message about that order, not marketing.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const h1 = (t) =>
  `        <h1 style="margin:0 0 14px;font-size:22px;font-weight:bold;color:${C.navy};line-height:1.25">${esc(t)}</h1>`;

const p = (html) =>
  `        <p style="margin:0 0 14px;font-size:16px">${html}</p>`;

const h2 = (t) =>
  `        <h2 style="margin:0 0 8px;font-size:16px;font-weight:bold;color:${C.ink}">${esc(t)}</h2>`;

/* The order reference, in a tinted chip. Its own block because a client on the
   phone to us needs to find it in two seconds. */
const chip = (ref) => `        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px">
          <tr><td style="background:${C.chipBg};border-radius:10px;padding:12px 16px;font-size:14px;color:${C.navy}">
            Your reference is <b style="font-size:16px">${esc(ref)}</b>. Quote it if you call.
          </td></tr>
        </table>`;

/* The one thing the client has to do, in amber with a green button. Deliberately
   the only call to action in the message: a second button halves the first. */
const callout = ({ text, buttonLabel, buttonUrl }) => `        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 22px">
          <tr><td style="background:${C.amberBg};border-left:4px solid ${C.amberEdge};border-radius:0 10px 10px 0;padding:16px 18px">
            <p style="margin:0 0 14px;font-size:15px;color:${C.ink}">${text}</p>
            <a href="${esc(buttonUrl)}" style="display:inline-block;background:${C.green};color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 22px;font-size:15px;font-weight:bold">${esc(buttonLabel)}</a>
          </td></tr>
        </table>`;

const done = (text) => `        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 22px">
          <tr><td style="background:${C.greenBg};border-radius:10px;padding:14px 18px;font-size:15px;font-weight:bold;color:${C.green}">${esc(text)}</td></tr>
        </table>`;

/* TAKES HTML, NOT TEXT. Every caller today passes static literals, which is
   why nothing here escapes. If you ever want a client's name or fund in a step,
   run it through esc() at the call site: this function will not do it for you
   and an unescaped ampersand in a fund name would break the list. */
const steps = (items) => `        <ol style="margin:0 0 24px;padding-left:20px;font-size:15px">${
  items.map((i) => `<li style="margin-bottom:7px">${i}</li>`).join('\n       ')}</ol>`;

/* ------------------------------------------------------------------ invoice
   Rendered from the same model that builds the PDF, so the figures in the body
   and the figures in the attachment cannot disagree. The GST rows appear only
   on a taxable sale: a nil GST line reads as though GST applies and happens to
   come to nothing, which is a different statement and the wrong one. */
function invoiceBlock(m) {
  const taxable = m.gst_treatment === 'taxable';
  const lbl = `font-size:10px;font-weight:700;color:${C.muted};letter-spacing:.05em`;
  const val = `font-size:14px;font-weight:700;color:${C.ink}`;
  const fact = (k, v) => `            <td style="padding:0 10px 0 0;vertical-align:top">
              <div style="${lbl};padding-bottom:3px">${esc(k)}</div>
              <div style="${val}">${esc(v)}</div>
            </td>`;

  return `        <div style="border:1px solid ${C.line};border-radius:12px;padding:20px 20px 22px;margin:0 0 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td style="font-size:19px;font-weight:800;color:${C.navy};padding-bottom:10px;border-bottom:2px solid ${C.navy};vertical-align:bottom;line-height:1">DASP<span style="color:${C.accent}">A</span><span style="color:${C.accent}">.</span></td>
          <td style="text-align:right;font-size:14px;font-weight:800;color:${C.navy};letter-spacing:.06em;padding-bottom:10px;border-bottom:2px solid ${C.navy};vertical-align:bottom;line-height:1">${esc(m.document_type)}</td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:18px 0 0">
        <tr>
          <td width="52%" style="vertical-align:top;padding-right:14px">
            <div style="${lbl};padding-bottom:6px">ISSUED BY</div>
            <div style="font-size:14px;font-weight:700;color:${C.ink}">${esc(m.seller_trading_as)}</div>
            <div style="font-size:12px;color:${C.muted};line-height:1.55">${esc(m.seller_legal_name)}<br>
            Our ABN (the supplier): ${esc(m.seller_abn)}<br>Registered Tax Agent ${esc(m.seller_tax_agent_number)}</div>
          </td>
          <td width="48%" style="vertical-align:top">
            <div style="${lbl};padding-bottom:6px">BILLED TO</div>
            <div style="font-size:14px;font-weight:700;color:${C.ink}">${esc(m.buyer_name || '')}</div>
            <div style="font-size:12px;color:${C.muted};line-height:1.55">${esc(m.buyer_email || '')}</div>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:18px 0 0">
        <tr>
${fact('ORDER / INVOICE NUMBER', m.invoice_number)}
${fact('DATE PAID', m.date_of_issue)}
${/* The reference's third column is PAYMENT METHOD, and the PDF deliberately
      does not use it: DASPA records the payment intent, not the card brand, so
      "Credit card" would be an assumption printed on a tax document. The same
      three facts as _lib/invoice-pdf.js, because a client comparing the body of
      this email to the attachment must not find them different. */''}
${fact('AMOUNT PAID', `${m.total} ${m.currency}`)}
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:18px">
        <tr>
          <td style="padding-bottom:8px;border-bottom:2px solid ${C.line};${lbl}">DESCRIPTION</td>
          <td style="padding-bottom:8px;border-bottom:2px solid ${C.line};${lbl};text-align:right;white-space:nowrap">${esc(m.amount_column_label)}</td>
        </tr>
${m.lines.map((l) => `          <tr>
            <td style="padding:11px 0;border-bottom:1px solid ${C.line};font-size:14px;color:${C.ink}">${esc(l.description)}</td>
            <td style="padding:11px 0;border-bottom:1px solid ${C.line};font-size:14px;font-weight:700;color:${C.ink};text-align:right;white-space:nowrap">${esc(l.amount)}</td>
          </tr>`).join('\n')}
${taxable ? `        <tr>
          <td style="padding:14px 8px 4px 0;font-size:14px;color:${C.muted};text-align:right">GST</td>
          <td style="padding:14px 0 4px;font-size:14px;color:${C.ink};text-align:right;white-space:nowrap">${esc(m.gst_amount)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:4px 8px 4px 0;font-size:14px;font-weight:700;color:${C.ink};text-align:right">${esc(m.total_label)}</td>
          <td style="padding:4px 0;font-size:19px;font-weight:800;color:${C.ink};text-align:right;white-space:nowrap">${esc(m.total)}</td>
        </tr>
      </table>
      <div style="background:${C.greenBg};border-radius:10px;padding:12px 14px;margin-top:18px;font-size:14px;font-weight:700;color:${C.green}">${esc(m.paid_statement)}</div>
      <p style="font-size:12px;color:${C.muted};line-height:1.6;margin:16px 0 0">${esc(m.taxable_extent)} Keep this invoice with your records.</p>
        </div>`;
}

const link = (url, label) =>
  `<a href="${esc(url)}" style="color:${C.accent};font-weight:bold">${esc(label || url)}</a>`;

const mailto = () => link(`mailto:${config.CONTACT_EMAIL || 'claims@daspa.com.au'}`, 'claims@daspa.com.au');

module.exports = { shell, esc, h1, h2, p, chip, callout, done, steps, invoiceBlock, link, mailto, C };
