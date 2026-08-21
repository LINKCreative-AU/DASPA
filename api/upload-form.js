// POST, receives one file of a paper-form submission (the page loops for
// multiple files, grouped by a client-generated submissionId). Files land in
// the private 'paper-forms' Supabase Storage bucket (created on first use);
// the team picks them up from the dashboard via the claim_audit_log trail.
// On the final file we email the client a receipt confirmation.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (+ RESEND_API_KEY for the ack).

const email = require('./_lib/email');
const db = require('./_lib/supabase');

const BUCKET = 'paper-forms';
const MAX_BYTES = 3 * 1024 * 1024;
const OK_TYPES = /^(application\/pdf|image\/(jpeg|png|webp|heic|heif))$/i;

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function ensureBucket() {
  const r = await fetch(`${BASE}/storage/v1/bucket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  });
  // 409 / "already exists" is the normal case after the first upload ever
  if (!r.ok && r.status !== 409) {
    const body = await r.text();
    if (!/exists/i.test(body)) throw new Error(`bucket create failed: ${r.status} ${body}`);
  }
}

async function putObject(path, buf, contentType) {
  const r = await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': contentType, apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: buf,
  });
  if (!r.ok) throw new Error(`storage upload failed: ${r.status} ${await r.text()}`);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const { submissionId, name, email: from, phone, note, fileIndex, fileCount, finalize, file } = req.body || {};

    if (!submissionId || !/^[0-9a-f-]{36}$/i.test(submissionId)) return res.status(400).json({ error: 'invalid submission id' });
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    if (!from || !/^\S+@\S+\.\S+$/.test(from)) return res.status(400).json({ error: 'valid email required' });
    if (!file || !file.dataBase64) return res.status(400).json({ error: 'file required' });
    if (!OK_TYPES.test(file.type || '')) return res.status(400).json({ error: 'unsupported file type' });

    const buf = Buffer.from(file.dataBase64, 'base64');
    if (!buf.length) return res.status(400).json({ error: 'empty file' });
    if (buf.length > MAX_BYTES) return res.status(413).json({ error: 'file too large (3 MB max)' });

    const day = new Date().toISOString().slice(0, 10);
    const safeName = String(file.name || 'form').replace(/[^\w.\-]+/g, '_').slice(-80);
    const path = `${day}/${submissionId}/${String(fileIndex || 1).padStart(2, '0')}-${safeName}`;

    await ensureBucket();
    await putObject(path, buf, file.type);

    await db.insertAudit(
      null,
      'paper_form_received',
      `${String(name).trim()} <${from}>${phone ? ` · ${phone}` : ''} · file ${fileIndex || 1}/${fileCount || 1} → ${BUCKET}/${path}${note ? ` · note: ${String(note).slice(0, 300)}` : ''}`
    );

    if (finalize) {
      await email.opsPaperForm(String(name).trim(), from, phone, note && String(note).slice(0, 300));
      // Receipt ack, mirrors the tone of the online-flow emails. Never let a
      // mail failure fail the upload; the file is already safe in storage.
      await email.send(
        from,
        'Your paper form arrived safely ✓',
        `Hi ${String(name).trim().split(/\s+/)[0]},

Your completed DASPA application form just arrived, thanks for sending it back to us.

What happens next: a registered tax agent reviews your form, we email you a secure payment link ($149 + GST flat, refunded in full if we can't recover any super), and you verify your identity from your phone with your passport and a selfie. Then we find every super account in your name, including ATO-held money, and lodge your claim.

If anything on the form needs clarifying, we'll be in touch by email${phone ? ' or phone/WhatsApp' : ''}.

The DASPA team
Australian Registration Office Pty Ltd · Registered Tax Agent 26076969
https://daspa.com.au`
      ).catch(() => {});
    }

    return res.status(200).json({ ok: true, stored: path });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
