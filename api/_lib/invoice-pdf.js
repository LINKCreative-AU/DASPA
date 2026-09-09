// Renders the invoice model onto one A4 page.
//
// Layout only. What the document SAYS is decided in _lib/invoice.js, which
// refuses to hand over a model missing any of the seven ATO elements, so this
// file can lay out what it is given without re-checking the law.
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

const NAVY = 0.15;      // greys, since the standard fonts carry no colour
const MUTED = 0.42;
const RULE = 0.82;

const M = 48;           // page margin
const RIGHT = pdf.A4.width - M;

function label(d, s, x, y) {
  d.text(String(s).toUpperCase(), x, y, { size: 7.5, bold: true, grey: MUTED });
}

function render(model) {
  const m = model;
  if (!m || !m.document_type) {
    throw new Error('invoice-pdf: called without a built invoice model. Use _lib/invoice.js build() first, so the seven elements are checked before anything is drawn.');
  }

  const d = pdf.doc();
  let y = M;

  // ---------------------------------------------------------------- header
  d.text('DASPA', M, y + 4, { size: 20, bold: true, grey: NAVY });
  // element 1: the document must say what it is, and it is the largest
  // right-hand thing on the page for that reason.
  d.text(m.document_type, RIGHT, y + 4, { size: 13, bold: true, align: 'right', grey: NAVY });
  y += 26;
  d.line(M, y, RIGHT, y, { width: 1.4, grey: 0.15 });
  y += 22;

  // -------------------------------------------------- issued by / billed to
  const colR = M + 292;

  label(d, 'Issued by', M, y);
  // elements 2 and 3
  d.text(m.seller_trading_as, M, y + 14, { size: 11, bold: true, grey: NAVY });
  d.text(m.seller_legal_name, M, y + 28, { size: 8.5, grey: MUTED });
  d.text(`ABN ${m.seller_abn}`, M, y + 40, { size: 8.5, grey: MUTED });
  d.text(`Registered Tax Agent ${m.seller_tax_agent_number}`, M, y + 52, { size: 8.5, grey: MUTED });

  label(d, 'Billed to', colR, y);
  /* The name, only if it can be drawn. See the header. */
  const nameDrawable = m.buyer_name && pdf.canEncode(m.buyer_name);
  if (nameDrawable) {
    d.text(m.buyer_name, colR, y + 14, { size: 11, bold: true, grey: NAVY });
  } else {
    d.text('Details as per your claim', colR, y + 14, { size: 9.5, grey: MUTED });
  }
  if (m.buyer_email && pdf.canEncode(m.buyer_email)) {
    d.text(m.buyer_email, colR, y + (nameDrawable ? 28 : 28), { size: 8.5, grey: MUTED });
  }
  y += 76;

  // ------------------------------------------------------ number / date row
  const cells = [
    ['Invoice number', m.invoice_number],
    ['Date of issue', m.date_of_issue],     // element 4
    ['Amount paid', m.total],
  ];
  cells.forEach(([k, v], i) => {
    const x = M + i * 168;
    label(d, k, x, y);
    d.text(String(v), x, y + 14, { size: 10.5, bold: true, grey: NAVY });
  });
  y += 40;

  // ------------------------------------------------------------ line items
  d.line(M, y, RIGHT, y, { width: 1, grey: RULE });
  y += 8;
  label(d, 'Description', M, y);
  label(d, 'Qty', M + 336, y);
  /* Right-aligned, so it cannot use the label() helper, which is left-aligned.
     Drawing both printed "AMOUNTAMOUNT" on the first render. */
  d.text('AMOUNT', RIGHT, y, { size: 7.5, bold: true, align: 'right', grey: MUTED });
  y += 12;
  d.line(M, y, RIGHT, y, { width: 1, grey: RULE });
  y += 6;

  // element 5: description, quantity and price
  m.lines.forEach((ln) => {
    y += 12;
    d.text(ln.description, M, y, { size: 9.5, grey: NAVY });
    d.text(String(ln.quantity), M + 336, y, { size: 9.5, grey: NAVY });
    d.text(ln.amount, RIGHT, y, { size: 9.5, bold: true, align: 'right', grey: NAVY });
    y += 10;
    d.line(M, y, RIGHT, y, { grey: 0.9 });
  });

  // ---------------------------------------------------------------- totals
  y += 20;
  const tl = RIGHT - 150;
  d.text('Subtotal', tl, y, { size: 9.5, grey: MUTED });
  d.text(m.subtotal, RIGHT, y, { size: 9.5, align: 'right', grey: NAVY });
  y += 15;
  // element 6
  /* Named "GST" either way. On a GST-free sale the amount reads $0.00 and the
     grey panel below states plainly that no GST was charged, which is clearer
     than omitting the row and leaving a reader to wonder. */
  d.text('GST', tl, y, { size: 9.5, grey: MUTED });
  d.text(m.gst_amount, RIGHT, y, { size: 9.5, align: 'right', grey: NAVY });
  y += 6;
  d.line(tl, y + 4, RIGHT, y + 4, { width: 1, grey: RULE });
  y += 22;
  d.text('Total paid', tl, y, { size: 11, bold: true, grey: NAVY });
  d.text(`${m.total} ${m.currency}`, RIGHT, y, { size: 13, bold: true, align: 'right', grey: NAVY });

  // ------------------------------------------------------- the tax position
  y += 30;
  d.rect(M, y - 4, RIGHT - M, 34, { grey: 0.955 });
  d.text(m.paid_statement, M + 12, y + 8, { size: 9, bold: true, grey: NAVY });
  d.text(m.gst_statement, M + 12, y + 21, { size: 9, grey: MUTED });

  y += 48;
  // element 7
  d.text(m.taxable_extent, M, y, { size: 8.5, grey: MUTED });

  // ----------------------------------------------------------------- footer
  let fy = pdf.A4.height - M - 34;
  d.line(M, fy, RIGHT, fy, { grey: RULE });
  fy += 12;
  d.text(`${m.seller_legal_name} trading as ${m.seller_trading_as}`, M, fy, { size: 8, grey: MUTED });
  fy += 11;
  d.text(`ABN ${m.seller_abn}  ·  Registered Tax Agent ${m.seller_tax_agent_number}`, M, fy, { size: 8, grey: MUTED });
  fy += 11;
  /* Both numbers. The 1800 is useless to somebody who has already flown home,
     which is most of this client base. */
  d.text(`${m.seller_email}  ·  ${m.seller_phone_au} (in Australia)  ·  ${m.seller_phone_intl} (overseas)`,
    M, fy, { size: 8, grey: MUTED });

  return d.end();
}

function filename(model) {
  return `DASPA invoice ${model.invoice_number}.pdf`;
}

module.exports = { render, filename };
