// Renders the invoice model onto one A4 page, following the ABN Assist tax
// invoice Juan supplied as the reference on 9 September 2026.
//
// Layout only. What the document SAYS is decided in _lib/invoice.js, which
// refuses to hand over a model missing any of the seven ATO elements, so this
// file lays out what it is given without re-checking the law.
//
// WHAT THE REFERENCE ACTUALLY LOOKS LIKE
//
// White page, no header band. A navy wordmark top left with the document type
// opposite it, a navy rule under both, then everything else stacked compactly
// in the upper third: issued-by and billed-to side by side, a row of three
// facts, the line table, GST and total right-aligned, a green full-width paid
// strip, and the notes as body text directly beneath it.
//
// The first version of this file invented a full-bleed navy header band and a
// footer pinned to the bottom of the page. Neither is in the reference, and
// both made the document look like a different company's. Restraint with navy
// accents is the house style, not decoration.
//
// The palette is DASPA's own, from assets/site.css, so it matches the site the
// client just paid on rather than copying ABN Assist's colours.
//
// THE ONE JUDGEMENT CALL IN HERE
//
// The buyer's name is drawn only when WinAnsi can represent it. A Japanese,
// Korean or Chinese name cannot be, and drawing it anyway produces a row of
// replacement boxes on a tax document. Under $1,000 the buyer's identity is not
// one of the required elements, so omitting it leaves the document complete;
// printing gibberish would not. The client's full name still appears in the
// email body and on the hosted copy, in proper Unicode.

'use strict';

const pdf = require('./pdf');

// assets/site.css :root
const NAVY = '#14164A';
const ACCENT = '#4A7BFF';
const INK = '#1e2250';
const MUTED = '#5a6480';
const LINE = '#DCE0F2';
const GREEN = '#1b9e62';
const GREEN_BG = '#E8F5EE';

const M = 48;
const W = pdf.A4.width;
const RIGHT = W - M;
const COL2 = M + 268;            // the billed-to column

function label(d, s, x, y, opt) {
  d.text(String(s).toUpperCase(), x, y,
    Object.assign({ size: 7.5, bold: true, color: NAVY }, opt || {}));
}

function render(model) {
  const m = model;
  if (!m || !m.document_type) {
    throw new Error('invoice-pdf: called without a built invoice model. Use _lib/invoice.js build() first, so the seven elements are checked before anything is drawn.');
  }

  const d = pdf.doc();
  let y = 56;

  // ------------------------------------------------------- wordmark and type
  /* Three pieces so the A carries the accent, as on the site. The full stop is
     yellow on the navy site header; on white it would be invisible, so it takes
     the accent blue too. Widths are measured, not guessed. */
  const wmSize = 21;
  let wx = M;
  d.text('DASP', wx, y, { size: wmSize, bold: true, color: NAVY });
  wx += d.widthOf('DASP', wmSize, true);
  d.text('A', wx, y, { size: wmSize, bold: true, color: ACCENT });
  wx += d.widthOf('A', wmSize, true);
  d.text('.', wx, y, { size: wmSize, bold: true, color: ACCENT });

  // element 1
  d.text(m.document_type, RIGHT, y + 4, { size: 11, bold: true, align: 'right', color: NAVY });

  y += 16;
  d.line(M, y, RIGHT, y, { width: 1.6, color: NAVY });
  y += 16;

  // -------------------------------------------------- issued by / billed to
  label(d, 'Issued by', M, y);
  // elements 2 and 3
  d.text(m.seller_trading_as, M, y + 13, { size: 10.5, bold: true, color: INK });
  d.text(m.seller_legal_name, M, y + 26, { size: 8, color: MUTED });
  d.text(`Our ABN (the supplier): ${m.seller_abn}`, M, y + 37, { size: 8, color: MUTED });
  d.text(`Registered Tax Agent ${m.seller_tax_agent_number}`, M, y + 48, { size: 8, color: MUTED });

  label(d, 'Billed to', COL2, y);
  const nameDrawable = m.buyer_name && pdf.canEncode(m.buyer_name);
  if (nameDrawable) {
    d.text(m.buyer_name, COL2, y + 13, { size: 10.5, bold: true, color: INK });
  } else {
    d.text('Details as per your claim', COL2, y + 13, { size: 9.5, color: MUTED });
  }
  if (m.buyer_email && pdf.canEncode(m.buyer_email)) {
    d.text(m.buyer_email, COL2, y + 26, { size: 8, color: MUTED });
  }
  y += 74;

  // ------------------------------------------------------ three facts, no panel
  /* The reference's third column is PAYMENT METHOD. DASPA does not store it:
     the webhook records the payment intent, not the card brand, so putting
     "Credit card" here would be an assumption on a tax document. Amount paid is
     a fact we hold. Capturing the method from charge.payment_method_details is
     a small follow-up if it is wanted. */
  [['Order / invoice number', m.invoice_number],
   ['Date paid', m.date_of_issue],
   ['Amount paid', `${m.total} ${m.currency}`],
  ].forEach(([k, v], i) => {
    const x = M + i * 168;
    label(d, k, x, y);
    d.text(String(v), x, y + 14, { size: 10.5, bold: true, color: INK });
  });
  y += 42;

  // ------------------------------------------------------------ line items
  label(d, 'Description', M, y);
  d.text(m.amount_column_label, RIGHT, y, { size: 7.5, bold: true, align: 'right', color: NAVY });
  y += 10;
  d.line(M, y, RIGHT, y, { width: 1, color: NAVY });

  // element 5
  m.lines.forEach((ln) => {
    y += 19;
    d.text(ln.description, M, y, { size: 9.5, color: INK });
    d.text(ln.amount, RIGHT, y, { size: 9.5, bold: true, align: 'right', color: INK });
    y += 10;
    d.line(M, y, RIGHT, y, { color: LINE });
  });

  // ------------------------------------------------------------ GST + total
  /* No subtotal row. The line amount already IS the ex-GST figure, so a
     subtotal of a single line just repeats it, which is why the reference
     labels the total "including GST" instead. */
  y += 22;
  /* And no GST row at all on a GST-free sale. "GST $0.00" reads as though GST
     applies and happens to be nil, which is a different statement from the one
     the note underneath makes, and the wrong one. A sale with no GST on it
     says so in words and shows no line. */
  if (m.gst_cents > 0) {
    d.text('GST', RIGHT - 84, y, { size: 9.5, align: 'right', color: MUTED });
    d.text(m.gst_amount, RIGHT, y, { size: 9.5, align: 'right', color: INK });
    y += 15;
  }
  d.text(m.total_label, RIGHT - 84, y, { size: 9.5, align: 'right', color: MUTED });
  d.text(`${m.total}`, RIGHT, y, { size: 13, bold: true, align: 'right', color: INK });

  // --------------------------------------------------------- paid, in green
  y += 22;
  d.rect(M, y, RIGHT - M, 26, { color: GREEN_BG });
  d.text(m.paid_statement, M + 12, y + 10, { size: 9, bold: true, color: GREEN });

  // ------------------------------------------------------------------ notes
  /* Body text under the panel, not a page footer. Deliberately NOT carrying
     ABN Assist's "this fee is tax deductible as a cost of carrying on your
     business": true for a sole trader registering an ABN, false for a departing
     temporary resident claiming super, and a misleading representation if
     copied across. */
  y += 44;
  const note = (t) => { d.text(t, M, y, { size: 7.5, color: MUTED }); y += 11; };
  // element 6 and element 7
  note(m.gst_statement);
  note(m.taxable_extent);
  note('Keep this invoice with your records.');
  note('The ABN under "Issued by" is ours as the supplier of this service.');
  y += 3;
  note(`${m.seller_legal_name} trading as ${m.seller_trading_as}. Registered Tax Agent ${m.seller_tax_agent_number}.`);
  /* Both numbers: the 1800 is useless to somebody who has already flown home,
     which is most of this client base. */
  note(`Questions about this invoice: ${m.seller_email}, ${m.seller_phone_au} in Australia, or ${m.seller_phone_intl} from overseas.`);

  return d.end();
}

function filename(model) {
  /* Named for what the document actually is. A GST-free sale is an invoice,
     not a tax invoice, and the filename is the first thing the client sees in
     their downloads folder. */
  const kind = model.document_type === 'TAX INVOICE' ? 'tax invoice' : 'invoice';
  return `DASPA - Order ${model.invoice_number} ${kind}.pdf`;
}

module.exports = { render, filename };
