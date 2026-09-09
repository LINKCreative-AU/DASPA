// Tests the hand-rolled PDF writer and the invoice layout.
//
// Two things are worth testing here and neither is "does it look right", which
// is what eyes are for:
//
//  1. STRUCTURE. A PDF with a wrong xref byte offset opens in some readers and
//     is rejected by others, so the failure shows up at a client rather than
//     here. The test parses the xref table we emit and checks every offset
//     actually lands on its object.
//  2. THE ENCODING DECISION. WinAnsi cannot represent CJK, so a Japanese name
//     must be left out rather than drawn as boxes, and a French name must be
//     drawn rather than dropped. Both directions are asserted against the real
//     bytes of the file.
//
// Run: node tests/invoice-pdf.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

let n = 0, failed = 0;
const eq = (name, got, want) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++; console.log(`FAIL  ${name}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`);
  } else console.log(`PASS  ${name}`);
};

const pdf = require('../api/_lib/pdf.js');
const invoice = require('../api/_lib/invoice.js');
const invoicePdf = require('../api/_lib/invoice-pdf.js');

const claim = (over = {}) => ({
  order_number: 'DASP00020151',
  full_name: 'Taylor McDonough',
  email: 'tay@example.com',
  payment_status: 'paid',
  paid_at: '2026-08-27T14:41:00Z',
  gst_treatment: 'taxable',
  ...over,
});
const render = (over) => invoicePdf.render(invoice.build(claim(over)));

// --- can this character be drawn at all ---------------------------------
eq('ASCII encodable', pdf.canEncode('Taylor McDonough'), true);
eq('French accents encodable', pdf.canEncode('Stéphane Dartois'), true);
eq('German umlaut encodable', pdf.canEncode('Jürgen Müller'), true);
eq('Nordic encodable', pdf.canEncode('Åsa Ekström'), true);
eq('Spanish tilde encodable', pdf.canEncode('Iñigo Peña'), true);
eq('en dash encodable (CP1252)', pdf.canEncode('a – b'), true);
eq('Japanese NOT encodable', pdf.canEncode('田中 太郎'), false);
eq('Korean NOT encodable', pdf.canEncode('김민준'), false);
eq('Chinese NOT encodable', pdf.canEncode('陳大文'), false);
eq('Cyrillic NOT encodable', pdf.canEncode('Иванов'), false);
eq('emoji NOT encodable', pdf.canEncode('Bob 🎉'), false);
eq('empty is encodable', pdf.canEncode(''), true);
eq('null is encodable (nothing to draw)', pdf.canEncode(null), true);

// --- the bytes are CP1252, not UTF-8 ------------------------------------
eq('é is one byte 0xE9', [...pdf.encodeWinAnsi('é')], [0xE9]);
eq('right single quote maps to 0x92', [...pdf.encodeWinAnsi('’')], [0x92]);
eq('em dash maps to 0x97', [...pdf.encodeWinAnsi('—')], [0x97]);
eq('CJK contributes no bytes', [...pdf.encodeWinAnsi('田')], []);

// --- structure -----------------------------------------------------------
{
  const buf = render();
  const s = buf.toString('latin1');
  eq('starts with a PDF header', s.slice(0, 8), '%PDF-1.4');
  eq('ends with EOF', s.trimEnd().endsWith('%%EOF'), true);
  eq('one page', (s.match(/\/Type \/Page[^s]/g) || []).length, 1);
  eq('declares WinAnsiEncoding', /\/Encoding \/WinAnsiEncoding/.test(s), true);
  eq('both fonts present', [/\/BaseFont \/Helvetica[ \/]/.test(s), /\/BaseFont \/Helvetica-Bold/.test(s)], [true, true]);

  // /Length must equal the real stream length, or readers truncate the page.
  const m = s.match(/<< \/Length (\d+) >>\nstream\n/);
  eq('stream declares a length', !!m, true);
  const start = s.indexOf('stream\n', m.index) + 'stream\n'.length;
  const declared = Number(m[1]);
  eq('declared length matches the bytes before endstream',
     s.slice(start + declared, start + declared + 10), '\nendstream');

  // Every xref offset must land on "<n> 0 obj".
  const xrefAt = Number(s.match(/startxref\n(\d+)/)[1]);
  eq('startxref points at the xref keyword', s.slice(xrefAt, xrefAt + 4), 'xref');
  const rows = s.slice(xrefAt).match(/^(\d{10}) 00000 n $/gm) || [];
  eq('six object offsets listed', rows.length, 6);
  const bad = rows.map((r, i) => {
    const off = Number(r.slice(0, 10));
    return s.startsWith(`${i + 1} 0 obj`, off) ? null : `obj ${i + 1} at ${off}`;
  }).filter(Boolean);
  eq('every xref offset lands on its object', bad, []);
}

// --- the encoding decision, in the real file -----------------------------
{
  const latin = render({ full_name: 'Stéphane Dartois' }).toString('latin1');
  eq('a French name IS drawn', latin.includes('St\xE9phane Dartois'), true);
  /* And as ONE CP1252 byte, not two UTF-8 ones. Comparing against the literal
     'Stéphane' proves nothing: read as latin1, byte 0xE9 decodes to é, so the
     two strings are identical. The thing that would be wrong is the UTF-8
     sequence 0xC3 0xA9 reaching the file, which a reader would draw as Ã©. */
  eq('and not as a UTF-8 byte pair', latin.includes('\xC3\xA9'), false);

  const cjk = render({ full_name: '田中 太郎', email: 'tanaka@example.jp' }).toString('latin1');
  eq('a Japanese name is NOT drawn', /\(\s*\)|\(田/.test(cjk), false);
  eq('the placeholder is drawn instead', cjk.includes('Details as per your claim'), true);
  eq('but the email still appears', cjk.includes('tanaka@example.jp'), true);
  eq('and no empty name string was emitted', cjk.includes('() Tj'), false);
}

// --- literal-string escaping --------------------------------------------
// A name with a bracket or a backslash would otherwise end the PDF string
// early and corrupt every byte after it.
{
  const s = render({ full_name: 'Ann (Annie) O\\Brien' }).toString('latin1');
  eq('brackets escaped', s.includes('Ann \\(Annie\\) O\\\\Brien'), true);
  const rows = s.slice(Number(s.match(/startxref\n(\d+)/)[1])).match(/^(\d{10}) 00000 n $/gm) || [];
  const bad = rows.map((r, i) => s.startsWith(`${i + 1} 0 obj`, Number(r.slice(0, 10))) ? null : i + 1).filter(Boolean);
  eq('and the file is still structurally sound', bad, []);
}

// --- the content that must be on a tax invoice ---------------------------
{
  const s = render().toString('latin1');
  for (const bit of ['TAX INVOICE', 'DASP00020151', '58 645 964 156', '28/08/2026',
                     '$149.00', '$14.90', '$163.90', '26076969',
                     'taxable sale', '1800 546 526', '+61 7 2101 4373']) {
    eq(`contains ${bit}`, s.includes(bit), true);
  }
  eq('no duplicated AMOUNT heading', (s.match(/\(AMOUNT\) Tj/g) || []).length, 1);
  eq('no "deductible" claim', /deductib/i.test(s), false);
}
{
  const s = render({ gst_treatment: 'gst_free' }).toString('latin1');
  eq('gst_free is titled INVOICE, not TAX INVOICE', /\(TAX INVOICE\)/.test(s), false);
  eq('gst_free says no GST was charged', s.includes('No GST has been charged'), true);
  eq('gst_free shows $0.00', s.includes('$0.00'), true);
}

// --- the layout refuses a raw claim -------------------------------------
{
  n++;
  try { invoicePdf.render({ order_number: 'DASP1' }); failed++; console.log('FAIL  raw object -> should refuse'); }
  catch (e) { console.log(/without a built invoice model/.test(e.message) ? 'PASS  raw object -> refuses' : `FAIL  wrong message: ${e.message}`); }
}

// --- colour parsing ------------------------------------------------------
eq('hex parses to three components', pdf.rgb('#14164A').map((v) => v.toFixed(3)),
   ['0.078', '0.086', '0.290']);
eq('hex without the hash also parses', !!pdf.rgb('14164A'), true);
eq('a bare number is grey', pdf.rgb(0.5), [0.5, 0.5, 0.5]);
eq('an array passes through clamped', pdf.rgb([2, -1, 0.5]), [1, 0, 0.5]);
eq('junk is null, not black-by-accident', pdf.rgb('nope'), null);

// --- the invoice is actually in brand colour -----------------------------
// The first version of the writer could only emit "g g g rg", so every invoice
// came out looking like a fax. These assert the brand colours reach the file,
// so a future change cannot quietly drop back to greyscale.
{
  const s = render().toString('latin1');
  const op = (hex, o) => {
    const v = pdf.rgb(hex).map((x) => (Math.round(x * 100) / 100).toString());
    return `${v[0]} ${v[1]} ${v[2]} ${o}`;
  };
  eq('navy fill is used', s.includes(op('#14164A', 'rg')), true);
  eq('accent blue is used (the A in the wordmark)', s.includes(op('#4A7BFF', 'rg')), true);
  eq('yellow is used (the keyline and the stop)', s.includes(op('#fae541', 'rg')), true);
  eq('green is used (the paid panel)', s.includes(op('#1b9e62', 'rg')), true);
  eq('the wordmark is drawn in three pieces', 
     [/\(DASP\) Tj/.test(s), /\(A\) Tj/.test(s), /\(\.\) Tj/.test(s)], [true, true, true]);
  eq('the tagline is on the band', s.includes('GET YOUR SUPER BACK'), true);
}

// --- right alignment actually measures ----------------------------------
eq('wider string measures wider',
   pdf.textWidth('$163.90', 10, false) > pdf.textWidth('$1.90', 10, false), true);
eq('bold is wider than regular for the same string',
   pdf.textWidth('Total paid', 11, true) > pdf.textWidth('Total paid', 11, false), true);

// --- filename ------------------------------------------------------------
eq('filename carries the invoice number',
   invoicePdf.filename(invoice.build(claim())), 'DASPA invoice DASP00020151.pdf');

console.log(`\n${n} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
