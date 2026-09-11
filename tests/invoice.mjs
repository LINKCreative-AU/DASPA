// Tests the invoice model.
//
// The interesting cases are the ones a click-through cannot produce: a claim
// missing the data a tax invoice legally needs, pricing constants that stop
// reconciling, and the Brisbane date crossing midnight. The seven-element
// guard is the whole point of the module, so most of these prove it refuses
// rather than that it renders.
//
// Run: node tests/invoice.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

let n = 0, failed = 0;
const eq = (name, got, want) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++; console.log(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
  } else console.log(`PASS  ${name}`);
};
const throws = (name, fn, re) => {
  n++;
  try { fn(); failed++; console.log(`FAIL  ${name}\n  expected a throw, got none`); }
  catch (e) {
    if (re && !re.test(e.message)) { failed++; console.log(`FAIL  ${name}\n  message did not match ${re}\n  got: ${e.message}`); }
    else console.log(`PASS  ${name}`);
  }
};

const invoice = require('../api/_lib/invoice.js');

const paidClaim = (over = {}) => ({
  order_number: 'DASP00020151',
  full_name: 'Taylor McDonough',
  email: 'tay@example.com',
  payment_status: 'paid',
  paid_at: '2026-08-27T14:41:00Z',   // 00:41 on the 28th in Brisbane
  gst_treatment: 'gst_free',
  amount_paid_cents: 15000,
  ...over,
});

/* A sale invoiced before 11 September 2026, when the fee was $163.90 including
   GST. These have to keep reproducing the document the client was actually
   sent, so the taxable branch is tested against the price of the day, not
   today's. */
const legacyTaxable = (over = {}) =>
  paidClaim({ gst_treatment: 'taxable', amount_paid_cents: 16390, ...over });

// --- the seven elements are all present ---------------------------------
{
  const m = invoice.build(legacyTaxable());
  eq('1 document says tax invoice', m.document_type, 'TAX INVOICE');
  eq('2 seller identity', m.seller_name, 'Australian Registration Office Pty Ltd trading as DASPA');
  eq('3 seller ABN', m.seller_abn, '58 645 964 156');
  eq('4 date of issue in Brisbane, not UTC', m.date_of_issue, '28/08/2026');
  eq('5 one line, described, with quantity', [m.lines.length, m.lines[0].quantity, m.lines[0].description],
     [1, 1, 'DASP claim, flat service fee']);
  eq('6 GST amount stated', m.gst_amount, '$14.90');
  eq('7 taxable extent stated', m.taxable_extent, 'The whole of this sale is a taxable sale.');
}

// --- the date that would go wrong silently ------------------------------
// A UTC-formatted invoice would date this the 27th. It is the 28th in Brisbane,
// and this is a real claim, not a hypothetical.
eq('midnight crossing is Brisbane', invoice.build(paidClaim()).date_of_issue, '28/08/2026');
eq('a mid-morning AEST payment is unaffected',
   invoice.build(paidClaim({ paid_at: '2026-09-02T00:03:00Z' })).date_of_issue, '02/09/2026');

// --- taxable amounts reconcile with what Stripe charged -----------------
{
  const m = invoice.build(legacyTaxable());
  eq('subtotal is ex-GST', m.subtotal, '$149.00');   // model still carries it; the PDF does not print a subtotal row
  eq('total label says including GST', m.total_label, 'Total paid, including GST');
  eq('amount column is labelled ex-GST', m.amount_column_label, 'AMOUNT (EX GST)');
  eq('total is the old price, not today\'s', m.total, '$163.90');
  eq('GST is exactly one eleventh', m.gst_cents * 11, m.total_cents);
  eq('line amount is ex-GST when taxable', m.lines[0].amount, '$149.00');
  eq('short-form GST statement is offered', /Total price includes GST/.test(m.gst_statement), true);
}

// --- the price change must not restate an invoice already issued ---------
// The whole reason amount_paid_cents exists. Before it, the model read
// config.FEE_CENTS, so moving the price rewrote every historical document and
// the invoice stopped agreeing with the client's card statement.
{
  eq('a $163.90 sale still renders $163.90', invoice.build(legacyTaxable()).total, '$163.90');
  eq('a $150 sale renders $150', invoice.build(paidClaim()).total, '$150.00');
  // No stored amount: rows written before the column existed all paid the old
  // price, but the fallback is today's, so this is only correct while those
  // rows have been backfilled. The migration does that.
  eq('no stored amount falls back to the current price',
     invoice.build(paidClaim({ amount_paid_cents: null })).total, '$150.00');
  eq('a zero amount is not trusted',
     invoice.build(paidClaim({ amount_paid_cents: 0 })).total, '$150.00');
}

// --- GST-free ------------------------------------------------------------
{
  const m = invoice.build(paidClaim({ gst_treatment: 'gst_free' }));
  eq('gst_free is not titled TAX INVOICE', m.document_type, 'INVOICE');
  eq('gst_free has no GST', m.gst_cents, 0);
  eq('gst_free says so plainly', m.gst_statement, 'No GST has been charged on this sale.');
  eq('gst_free line carries the whole amount', m.lines[0].amount, '$150.00');
  eq('gst_free line is marked not taxable', m.lines[0].taxable, false);
  eq('gst_free total still matches the charge', m.total, '$150.00');
  eq('gst_free total label drops "including GST"', m.total_label, 'Total paid');
  eq('gst_free amount column is plain', m.amount_column_label, 'AMOUNT');
  eq('element 7 explains the basis', /GST-free export/.test(m.taxable_extent), true);
}

// --- a null treatment defaults to GST-free, it does not throw ------------
// Matching the database default from 11 September 2026. Only an explicit
// 'taxable' produces a tax invoice now, so a missing value cannot quietly
// put GST on a sale that carries none.
{
  const m = invoice.build(paidClaim({ gst_treatment: null }));
  eq('null treatment -> gst_free', m.gst_treatment, 'gst_free');
  eq('null treatment -> no GST', m.gst_cents, 0);
  eq('null treatment -> not a tax invoice', m.document_type, 'INVOICE');
}

// --- an amount with no exact GST is refused rather than rounded ----------
// $150 taxable would be $13.6363 of GST. An invoice cannot state that, and
// silently rounding it would put a figure on a tax document that does not
// reconcile.
throws('taxable on an indivisible amount -> refuses',
  () => invoice.build(legacyTaxable({ amount_paid_cents: 15000 })), /eleven whole cents/);

// --- it refuses to render an incomplete tax document ---------------------
throws('no order number -> refuses',
  () => invoice.build(paidClaim({ order_number: null })), /order_number/);
throws('unpaid claim -> refuses',
  () => invoice.build(paidClaim({ payment_status: 'unpaid' })), /is unpaid/);
throws('refunded claim -> refuses',
  () => invoice.build(paidClaim({ payment_status: 'refunded' })), /is refunded/);
throws('no paid_at -> refuses, date of issue cannot be established',
  () => invoice.build(paidClaim({ paid_at: null })), /date of issue/);
throws('nothing at all -> refuses',
  () => invoice.build(), /order_number/);
throws('unparseable paid_at -> refuses rather than printing Invalid Date',
  () => invoice.build(paidClaim({ paid_at: 'not a date' })), /element 4|date of issue/);

// --- the buyer is optional under $1,000 but carried ----------------------
{
  const m = invoice.build(paidClaim({ full_name: null }));
  eq('missing buyer name does NOT block the invoice', m.buyer_name, null);
  eq('and the seven elements are still complete', m.document_type, 'INVOICE');
}
{
  // CJK name: the model must carry it intact. Whether the PDF can DRAW it is a
  // separate problem, handled in the PDF writer, not by mangling it here.
  const m = invoice.build(paidClaim({ full_name: '田中 太郎' }));
  eq('CJK buyer name survives the model', m.buyer_name, '田中 太郎');
}

// --- no claim that is false for this product ----------------------------
{
  const m = invoice.build(paidClaim());
  const blob = JSON.stringify(m).toLowerCase();
  eq('no "tax deductible" claim anywhere', blob.includes('deductib'), false);
  eq('no "carrying on your business"', blob.includes('carrying on'), false);
  eq('both phone numbers present', [!!m.seller_phone_au, !!m.seller_phone_intl], [true, true]);
  eq('tax agent number is not passed off as the ABN', m.seller_abn === m.seller_tax_agent_number, false);
}

console.log(`\n${n} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
