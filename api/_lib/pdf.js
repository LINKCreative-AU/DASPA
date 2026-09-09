// A minimal PDF writer. About 200 lines, no npm dependency.
//
// WHY HAND-ROLLED
//
// This repo has no package.json and no build step, deliberately: it deploys as
// static files plus functions, and the deploy path is the one thing on a live
// revenue site nobody wants to make more complicated. pdfkit or pdf-lib would
// put a bundler in front of every deployment to draw left-aligned text, two
// rules and a table. Same call ABN Assist made.
//
// WHAT IT DOES
//
// A4, one page, the 14 standard Type 1 fonts (Helvetica and Helvetica-Bold are
// all this needs), WinAnsi text, horizontal rules and filled rectangles.
// Coordinates are given from the TOP-LEFT in points, because that is how a
// layout is written; PDF's own origin is bottom-left and this converts.
//
// THE LIMIT THAT MATTERS, AND IT IS NOT A BUG
//
// WinAnsiEncoding is Latin-1 plus the CP1252 range. It cannot represent
// Japanese, Korean or Chinese characters at all. DASPA has ja, ko and zh-tw
// pages, so those clients are real. Drawing an unrepresentable name would
// produce replacement boxes on a tax document, which is worse than leaving it
// out, so canEncode() lets the caller ask FIRST and decide.
//
// Fixing it properly means embedding a CJK font and writing TrueType
// subsetting: several megabytes in the repo and a great deal of code, for a
// field the ATO does not require on a sale under $1,000. The email and the
// hosted copy show the full name in Unicode either way.

'use strict';

const A4 = { width: 595.28, height: 841.89 };

/* CP1252 above 0x7E. The eight-bit range is Latin-1 and passes through, so only
   the 0x80 to 0x9F window needs a map. PDF's WinAnsiEncoding is this. */
const CP1252_HIGH = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
  0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
  0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
  0x017E: 0x9E, 0x0178: 0x9F,
};

function codeFor(ch) {
  const cp = ch.codePointAt(0);
  if (cp === 0x0A || cp === 0x0D) return null;          // never drawn
  if (cp >= 0x20 && cp <= 0x7E) return cp;
  if (cp >= 0xA0 && cp <= 0xFF) return cp;
  if (CP1252_HIGH[cp] !== undefined) return CP1252_HIGH[cp];
  return null;
}

// Ask before drawing. A false here is the signal to omit the field.
function canEncode(s) {
  const str = String(s == null ? '' : s);
  for (const ch of str) if (codeFor(ch) === null) return false;
  return true;
}

function encodeWinAnsi(s) {
  const out = [];
  for (const ch of String(s == null ? '' : s)) {
    const code = codeFor(ch);
    if (code !== null) out.push(code);
  }
  return Buffer.from(out);
}

/* Adobe's standard widths, per 1000 units of font size, for codes 32 to 126.
   Needed only to right-align the money column; a small error shifts a number a
   point or two and is invisible, whereas having no widths at all means
   guessing. Accented Latin-1 letters take their base letter's width, which is
   true for these two fonts. */
const W_REG = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const W_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

/* Accent stripping for width purposes only. The character drawn is the real
   one; this just picks a sensible advance for it. */
const BASE = { 0xC0:'A',0xC1:'A',0xC2:'A',0xC3:'A',0xC4:'A',0xC5:'A',0xC6:'A',0xC7:'C',0xC8:'E',0xC9:'E',0xCA:'E',0xCB:'E',0xCC:'I',0xCD:'I',0xCE:'I',0xCF:'I',0xD1:'N',0xD2:'O',0xD3:'O',0xD4:'O',0xD5:'O',0xD6:'O',0xD8:'O',0xD9:'U',0xDA:'U',0xDB:'U',0xDC:'U',0xDD:'Y',0xE0:'a',0xE1:'a',0xE2:'a',0xE3:'a',0xE4:'a',0xE5:'a',0xE6:'a',0xE7:'c',0xE8:'e',0xE9:'e',0xEA:'e',0xEB:'e',0xEC:'i',0xED:'i',0xEE:'i',0xEF:'i',0xF1:'n',0xF2:'o',0xF3:'o',0xF4:'o',0xF5:'o',0xF6:'o',0xF8:'o',0xF9:'u',0xFA:'u',0xFB:'u',0xFC:'u',0xFD:'y' };

function charWidth(code, bold) {
  const table = bold ? W_BOLD : W_REG;
  if (code >= 32 && code <= 126) return table[code - 32];
  const base = BASE[code];
  if (base) return table[base.charCodeAt(0) - 32];
  return table[('n').charCodeAt(0) - 32];   // a middling advance
}

function textWidth(s, size, bold) {
  let w = 0;
  for (const ch of String(s == null ? '' : s)) {
    const code = codeFor(ch);
    if (code !== null) w += charWidth(code, bold);
  }
  return (w * size) / 1000;
}

/* Colour. Accepts '#14164A', 'F5F7FD', [r,g,b] in 0..1, or a single number as
   grey. The first version of this writer emitted only "g g g rg", so a brand
   navy was literally unrepresentable and every invoice came out looking like a
   fax. PDF wants three components in 0..1. */
function rgb(c) {
  if (c === undefined || c === null) return null;
  if (Array.isArray(c)) return c.slice(0, 3).map((v) => Math.max(0, Math.min(1, v)));
  if (typeof c === 'number') return [c, c, c];
  const h = String(c).replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

function colourOp(c, op, fallback) {
  const v = rgb(c === undefined ? fallback : c);
  if (!v) return '';
  return `${num(v[0])} ${num(v[1])} ${num(v[2])} ${op}\n`;
}

function pdfString(s) {
  // Escape only what a PDF literal string requires, on the encoded bytes.
  const bytes = encodeWinAnsi(s);
  const out = [0x28];                                    // (
  for (const b of bytes) {
    if (b === 0x28 || b === 0x29 || b === 0x5C) out.push(0x5C);
    out.push(b);
  }
  out.push(0x29);                                        // )
  return Buffer.from(out);
}

function num(n) {
  // Trim float noise so the content stream stays readable and short.
  return (Math.round(n * 100) / 100).toString();
}

function doc(opts) {
  const page = (opts && opts.page) || A4;
  const parts = [];                       // content stream fragments
  const push = (s) => parts.push(Buffer.isBuffer(s) ? s : Buffer.from(s, 'latin1'));
  const flip = (y) => page.height - y;    // top-left in, bottom-left out

  const api = {
    page,
    /* Every draw call takes top-left coordinates. `bold` picks Helvetica-Bold.
       `align` of 'right' measures the string and shifts x left by its width,
       which is what the money column needs. */
    text(s, x, y, o) {
      const opt = o || {};
      const size = opt.size || 10;
      const bold = !!opt.bold;
      let tx = x;
      if (opt.align === 'right') tx = x - textWidth(s, size, bold);
      else if (opt.align === 'center') tx = x - textWidth(s, size, bold) / 2;
      push('BT\n');
      push(colourOp(opt.color !== undefined ? opt.color : opt.grey, 'rg', 0));
      push(`/${bold ? 'F2' : 'F1'} ${num(size)} Tf\n`);
      push(`1 0 0 1 ${num(tx)} ${num(flip(y) - size * 0.28)} Tm\n`);
      push(pdfString(s));
      push(' Tj\nET\n');
      return api;
    },
    line(x1, y1, x2, y2, o) {
      const opt = o || {};
      push(colourOp(opt.color !== undefined ? opt.color : opt.grey, 'RG', 0.8));
      push(`${num(opt.width || 0.7)} w\n`);
      push(`${num(x1)} ${num(flip(y1))} m ${num(x2)} ${num(flip(y2))} l S\n`);
      return api;
    },
    rect(x, y, w, h, o) {
      const opt = o || {};
      push(colourOp(opt.color !== undefined ? opt.color : opt.grey, 'rg', 0.95));
      push(`${num(x)} ${num(flip(y + h))} ${num(w)} ${num(h)} re f\n`);
      return api;
    },
    widthOf: (s, size, bold) => textWidth(s, size, bold),
    canEncode,

    end() {
      const content = Buffer.concat(parts);
      const objs = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(page.width)} ${num(page.height)}] `
          + '/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
        null,   // 4: the content stream, assembled below
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
      ];

      const chunks = [Buffer.from('%PDF-1.4\n', 'latin1')];
      /* A binary comment right after the header. Without it some tools treat
         the file as text and a transport can mangle line endings. */
      chunks.push(Buffer.from([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));
      let offset = chunks.reduce((n, b) => n + b.length, 0);
      const xref = [];

      objs.forEach((body, i) => {
        const n = i + 1;
        xref[n] = offset;
        let buf;
        if (n === 4) {
          buf = Buffer.concat([
            Buffer.from(`4 0 obj\n<< /Length ${content.length} >>\nstream\n`, 'latin1'),
            content,
            Buffer.from('\nendstream\nendobj\n', 'latin1'),
          ]);
        } else {
          buf = Buffer.from(`${n} 0 obj\n${body}\nendobj\n`, 'latin1');
        }
        chunks.push(buf);
        offset += buf.length;
      });

      const startxref = offset;
      let x = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
      for (let n = 1; n <= objs.length; n++) {
        x += `${String(xref[n]).padStart(10, '0')} 00000 n \n`;
      }
      x += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
      chunks.push(Buffer.from(x, 'latin1'));

      return Buffer.concat(chunks);
    },
  };
  return api;
}

module.exports = { doc, A4, canEncode, encodeWinAnsi, textWidth, rgb };
