// The invoice model. One place that decides what a DASPA invoice says, so the
// PDF, the version rendered inside the email and anything added later cannot
// disagree with each other or with what was charged.
//
// THE SEVEN ELEMENTS, AND WHY THIS THROWS
//
// For a taxable sale under $1,000 the ATO requires enough information to
// clearly determine seven things: that the document is intended to be a tax
// invoice, the seller's identity, the seller's ABN, the date of issue, a
// description of what was sold including quantity and price, the GST amount,
// and the extent to which each sale is taxable. The buyer's identity is only
// required at $1,000 or more.
// https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices
// Detail in GSTR 2013/1.
//
// build() REFUSES to return a model missing any of them. A tax document that is
// quietly incomplete is worse than no document: the client files it, and nobody
// finds out until an audit or a dispute. Failing loudly at send time means the
// email does not go and somebody looks.
//
// AMOUNTS COME FROM THE PRICING MODULE, NEVER FROM ARITHMETIC HERE
//
// If the invoice recomputed the fee it could disagree with the Stripe charge.
// It reads config and asserts the numbers reconcile instead.
//
// WHAT THIS DOES NOT SAY
//
// No "tax deductible as a cost of carrying on your business" line. ABN Assist
// has one and it is true there, for a sole trader registering an ABN. A
// departing temporary resident claiming their super has no business and no such
// deduction, and telling them otherwise would be a misleading representation.

'use strict';

const config = require('./config');

// ARO Pty Ltd. Verified: the ABN passes the ATO check-digit algorithm
// (weighted sum 534, divisible by 89). The tax agent number is NOT an ABN and
// cannot stand in for one on a tax invoice.
const SELLER = {
  legal_name: 'Australian Registration Office Pty Ltd',
  trading_as: 'DASPA',
  abn: '58 645 964 156',
  tax_agent_number: '26076969',
  email: 'claims@daspa.com.au',
  // Both, deliberately. The 1800 only works from inside Australia, and most of
  // these clients have already left.
  phone_au: '1800 546 526',
  phone_intl: '+61 7 2101 4373',
};

/* Brisbane, explicitly, and not the server's UTC. A payment at 14:41 UTC on
   27 August is 00:41 on the 28th in Brisbane, so a UTC-formatted invoice would
   be dated a day early. That is exactly the case in the recovered claims.
   Queensland has no daylight saving, so AEST is always the right label.
   dd/mm/yyyy because that is how the team reads the data, even though house
   style elsewhere is longhand. */
const TZ = 'Australia/Brisbane';

function brisbaneDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const p = new Intl.DateTimeFormat('en-AU', {
    timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric',
  }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.day}/${p.month}/${p.year}`;
}

function brisbaneTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(d).replace(/ /g, ' ').toLowerCase() + ' AEST';
}

function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

/* The seven elements, named so a failure says which one is missing rather than
   "invalid invoice". The order matches the ATO's list. */
const REQUIRED = [
  ['document_type', 'element 1: the document must say it is a tax invoice'],
  ['seller_name', "element 2: the seller's identity"],
  ['seller_abn', "element 3: the seller's ABN"],
  ['date_of_issue', 'element 4: the date of issue'],
  ['lines', 'element 5: a description of what was sold, with quantity and price'],
  ['gst_statement', 'element 6: the GST amount payable, or a statement that there is none'],
  ['taxable_extent', 'element 7: the extent to which each sale is taxable'],
];

function build(claim) {
  const c = claim || {};

  if (!c.order_number) {
    throw new Error('invoice: no order_number on this claim. The order number IS the invoice number, so there is nothing to number this document with.');
  }
  if (c.payment_status !== 'paid') {
    throw new Error(`invoice: claim ${c.order_number} is ${c.payment_status || 'unpaid'}. An invoice states that a sale happened.`);
  }
  if (!c.paid_at) {
    throw new Error(`invoice: claim ${c.order_number} has no paid_at, so the date of issue cannot be established.`);
  }

  /* Defaulting to taxable rather than throwing on a null. Every page on the
     site advertises "$163.90 inc. GST", so taxable is what the client was told,
     and it is the direction that does not under-remit if the position is ever
     revisited. Claims predating 9 September 2026 have no declaration. */
  const treatment = c.gst_treatment === 'gst_free' ? 'gst_free' : 'taxable';
  const taxable = treatment === 'taxable';

  const total = config.FEE_CENTS;
  const exGst = config.FEE_EX_GST_CENTS;
  const gst = taxable ? total - exGst : 0;

  /* Reconciliation, not decoration. If someone changes one constant and not the
     other, this stops an invoice going out with figures that do not add up. */
  if (taxable && gst * 11 !== total) {
    throw new Error(`invoice: GST of ${gst} is not one eleventh of ${total}. The pricing constants in _lib/config.js disagree with each other.`);
  }

  const lines = [{
    description: taxable
      ? 'DASP claim, flat service fee'
      : 'DASP claim, flat service fee (GST-free export of services)',
    quantity: 1,
    amount_cents: taxable ? exGst : total,
    amount: money(taxable ? exGst : total),
    taxable,
  }];

  const model = {
    // element 1
    document_type: taxable ? 'TAX INVOICE' : 'INVOICE',
    // element 2
    seller_name: `${SELLER.legal_name} trading as ${SELLER.trading_as}`,
    seller_legal_name: SELLER.legal_name,
    seller_trading_as: SELLER.trading_as,
    // element 3
    seller_abn: SELLER.abn,
    seller_tax_agent_number: SELLER.tax_agent_number,
    seller_email: SELLER.email,
    seller_phone_au: SELLER.phone_au,
    seller_phone_intl: SELLER.phone_intl,
    // element 4
    date_of_issue: brisbaneDate(c.paid_at),
    time_of_issue: brisbaneTime(c.paid_at),
    // element 5
    lines,
    // element 6
    gst_cents: gst,
    gst_amount: money(gst),
    /* The ATO allows the short form "Total price includes GST" where the GST is
       exactly one eleventh of the total, which it is here. The amount is shown
       as well, because a client forwarding this to their own accountant is
       better served by the figure than by the formula. */
    gst_statement: taxable
      ? `GST ${money(gst)}. Total price includes GST.`
      : 'No GST has been charged on this sale.',
    // element 7
    taxable_extent: taxable
      ? 'The whole of this sale is a taxable sale.'
      : 'This sale is GST-free. It is a supply of services to a recipient who was outside Australia, treated as a GST-free export.',

    // number and totals
    invoice_number: c.order_number,
    order_number: c.order_number,
    subtotal_cents: taxable ? exGst : total,
    subtotal: money(taxable ? exGst : total),
    total_cents: total,
    total: money(total),
    currency: (config.CURRENCY || 'aud').toUpperCase(),
    paid_statement: `Paid in full on ${brisbaneDate(c.paid_at)}`
      + (brisbaneTime(c.paid_at) ? ` at ${brisbaneTime(c.paid_at)}` : '') + '.',

    /* Not one of the seven: the buyer's identity is only required at $1,000 or
       more and this sale is $163.90. Carried anyway so the template stays valid
       if the fee ever crosses that line, and because a client looking for their
       own record expects to see their name on it. */
    buyer_name: c.full_name || null,
    buyer_email: c.email || null,

    gst_treatment: treatment,
  };

  const missing = REQUIRED.filter(([k]) => {
    const v = model[k];
    return v === null || v === undefined || v === ''
      || (Array.isArray(v) && v.length === 0);
  });
  if (missing.length) {
    throw new Error('invoice: refusing to render an incomplete tax invoice for '
      + `${c.order_number}. Missing ${missing.map(([, why]) => why).join('; ')}.`);
  }

  return model;
}

module.exports = { build, SELLER, brisbaneDate, brisbaneTime, money };
