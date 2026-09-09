// Renders the invoice model onto one A4 page, in DASPA's own colours.
//
// Layout only. What the document SAYS is decided in _lib/invoice.js, which
// refuses to hand over a model missing any of the seven ATO elements, so this
// file lays out what it is given without re-checking the law.
//
// The palette is lifted from assets/site.css rather than chosen here, so an
// invoice looks like the site the client just paid on. The wordmark follows the
// same treatment as the site header: DASP in white, the A in accent blue, the
// full stop in yellow.
//
// THE ONE JUDGEMENT CALL IN HERE
//
// The buyer's name is drawn only when WinAnsi can represent it. A Japanese,
// Korean or Chinese name cannot be, and drawing it anyway produces a row of
// replacement boxes on a tax document. Under $1,000 the buyer's identity is not
// one of the required elements, so omitting it leaves the document complete;
// printing gibberish would not. The client's full name still appears in the
// email body and on the hosted copy, in proper Unicode.
//
// Decided with Juan, 9 September 2026.

'use strict';

const pdf = require('./pdf');

// assets/site.css :root
const NAVY = '#14164A';
const ACCENT = '#4A7BFF';
const YELLOW = '#fae541';
const INK = '#1e2250';
const MUTED = '#5a6480';
const LINE = '#DCE0F2';
const GREEN = '#1b9e62';
const PANEL = '#F5F7FD';
const WHITE = '#ffffff';
const REVERSED = '#aeb6d8';      // the muted tone that works on navy

const M = 48;                    // page margin
const W = pdf.A4.width;
const RIGHT = W - M;

function label(d, s, x, y, opt) {
  d.text(String(s).toUpperCase(), x, y,
    Object.assign({ size: 7.5, bold: true, color: MUTED }, opt || {}));
}

function render(model) {
  const m = model;
  if (!m || !m.document_type) {
    throw new Error('invoice-pdf: called without a built invoice model. Use _lib/invoice.js build() first, so the seven elements are checked before anything is drawn.');
  }

  const d = pdf.doc();

  // ------------------------------------------------------- navy header band
  // Full bleed, like the site header. 96pt deep.
  d.rect(0, 0, W, 96, { color: NAVY });

  /* Wordmark, drawn in three pieces so the A and the stop carry their colours.
     Widths are measured rather than guessed, because "DASP" in 24pt bold is not
     a number anybody should hardcode. */
  const wmY = 34;
  const wmSize = 24;
  let wx = M;
  d.text('DASP', wx, wmY, { size: wmSize, bold: true, color: WHITE });
  wx += d.widthOf('DASP', wmSize, true);
  d.text('A', wx, wmY, { size: wmSize, bold: true, color: ACCENT });
  wx += d.widthOf('A', wmSize, true);
  d.text('.', wx, wmY, { size: wmSize, bold: true, color: YELLOW });
  d.text('GET YOUR SUPER BACK', M + 1, wmY + 26, { size: 6.5, bold: true, color: REVERSED });

  // element 1: what this document is, reversed out on the right
  d.text(m.document_type, RIGHT, wmY, { size: 14, bold: true, align: 'right', color: WHITE });
  d.text(`Registered Tax Agent ${m.seller_tax_agent_number}`, RIGHT, wmY + 26,
    { size: 7.5, align: 'right', color: REVERSED });

  // yellow keyline under the band, the site's accent device
  d.rect(0, 96, W, 3, { color: YELLOW });

  let y = 128;

  // -------------------------------------------------- issued by / billed to
  const colR = M + 292;
  label(d, 'Issued by', M, y);
  d.text(m.seller_trading_as, M, y + 15, { size: 11.5, bold: true, color: INK });
  d.text(m.seller_legal_name, M, y + 29, { size: 8.5, color: MUTED });
  d.text(`ABN ${m.seller_abn}`, M, y + 41, { size: 8.5, color: MUTED });

  label(d, 'Billed to', colR, y);
  const nameDrawable = m.buyer_name && pdf.canEncode(m.buyer_name);
  if (nameDrawable) {
    d.text(m.buyer_name, colR, y + 15, { size: 11.5, bold: true, color: INK });
  } else {
    d.text('Details as per your claim', colR, y + 15, { size: 10, color: MUTED });
  }
  if (m.buyer_email && pdf.canEncode(m.buyer_email)) {
    d.text(m.buyer_email, colR, y + 29, { size: 8.5, color: MUTED });
  }
  y += 66;

  // ------------------------------------------- number / date / amount panel
  d.rect(M, y, RIGHT - M, 50, { color: PANEL });
  const cells = [
    ['Invoice number', m.invoice_number],
    ['Date of issue', m.date_of_issue],     // element 4
    ['Amount paid', `${m.total} ${m.currency}`],
  ];
  cells.forEach(([k, v], i) => {
    const x = M + 16 + i * 166;
    label(d, k, x, y + 13);
    d.text(String(v), x, y + 30, { size: 11, bold: true, color: INK });
  });
  y += 76;

  // ------------------------------------------------------------ line items
  label(d, 'Description', M, y, { color: NAVY });
  label(d, 'Qty', M + 336, y, { color: NAVY });
  /* Right-aligned, so it cannot use label(), which is left-aligned. Drawing
     both printed AMOUNTAMOUNT on the first version of this file. */
  d.text('AMOUNT', RIGHT, y, { size: 7.5, bold: true, align: 'right', color: NAVY });
  y += 11;
  d.line(M, y, RIGHT, y, { width: 1.2, color: NAVY });

  // element 5: description, quantity and price
  m.lines.forEach((ln) => {
    y += 20;
    d.text(ln.description, M, y, { size: 10, color: INK });
    d.text(String(ln.quantity), M + 336, y, { size: 10, color: INK });
    d.text(ln.amount, RIGHT, y, { size: 10, bold: true, align: 'right', color: INK });
    y += 11;
    d.line(M, y, RIGHT, y, { color: LINE });
  });

  // ---------------------------------------------------------------- totals
  y += 20;
  const tl = RIGHT - 160;
  d.text('Subtotal', tl, y, { size: 9.5, color: MUTED });
  d.text(m.subtotal, RIGHT, y, { size: 9.5, align: 'right', color: INK });
  y += 16;
  /* Named GST either way. On a GST-free sale it reads $0.00 and the panel below
     states plainly that none was charged, which is clearer than dropping the
     row and leaving a reader to wonder whether it was forgotten. */
  d.text('GST', tl, y, { size: 9.5, color: MUTED });
  d.text(m.gst_amount, RIGHT, y, { size: 9.5, align: 'right', color: INK });
  y += 10;
  d.line(tl, y, RIGHT, y, { width: 1, color: LINE });
  y += 20;
  d.text('Total paid', tl, y, { size: 11.5, bold: true, color: INK });
  d.text(`${m.total} ${m.currency}`, RIGHT, y, { size: 14, bold: true, align: 'right', color: NAVY });

  // ------------------------------------------------ paid panel, green means done
  y += 32;
  d.rect(M, y, RIGHT - M, 40, { color: '#E8F5EE' });
  d.rect(M, y, 3.5, 40, { color: GREEN });
  d.text(m.paid_statement, M + 16, y + 15, { size: 9.5, bold: true, color: GREEN });
  // element 6
  d.text(m.gst_statement, M + 16, y + 29, { size: 9, color: MUTED });
  y += 58;

  // element 7
  d.text(m.taxable_extent, M, y, { size: 8.5, color: MUTED });
  y += 18;
  d.text('Keep this invoice with your records.', M, y, { size: 8.5, color: MUTED });

  // ----------------------------------------------------------------- footer
  let fy = pdf.A4.height - M - 40;
  d.line(M, fy, RIGHT, fy, { color: LINE });
  fy += 13;
  d.text(`${m.seller_legal_name} trading as ${m.seller_trading_as}`, M, fy, { size: 8, bold: true, color: MUTED });
  fy += 11;
  d.text(`ABN ${m.seller_abn}   ·   Registered Tax Agent ${m.seller_tax_agent_number}`, M, fy, { size: 8, color: MUTED });
  fy += 11;
  /* Both numbers. The 1800 is useless to somebody who has already flown home,
     which is most of this client base. */
  d.text(`${m.seller_email}   ·   ${m.seller_phone_au} (in Australia)   ·   ${m.seller_phone_intl} (overseas)`,
    M, fy, { size: 8, color: MUTED });

  return d.end();
}

function filename(model) {
  return `DASPA invoice ${model.invoice_number}.pdf`;
}

module.exports = { render, filename };
