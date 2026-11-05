/* POST /api/id-document  { action: 'start',  … }  -> { id, uploads: [{ name, url }] }
   POST /api/id-document  { action: 'finish', id }  -> { ok, received, order }

   The manual ID upload behind /id-verification, for the client whose Stripe
   Identity check will not go through (an unsupported document, a camera the
   browser cannot open, a selfie match that keeps failing) and for the client
   Stripe is not allowed to verify at all (China, Hong Kong, Macau, Russia: see
   _lib/manual-only.js). The documents land in a private Supabase Storage bucket
   and the team is emailed a download link to each one. The team then runs the
   check by hand in Stripe, against the client's Stripe customer.

   PORTED FROM abnassist-site/api/id-document.js on 5 November 2026, at Juan's
   request, so DASPA offers the same upload as ABN Assist and GST Register in
   place of "email us your passport". The differences are deliberate:

     - ONLY FOR A PAID DASPA CLAIM. ABN Assist stores any upload and matches it
       to an order afterwards if it can. DASPA refuses at 'start', before a
       single byte is stored, unless the email or order number belongs to a paid
       claim. Two reasons: an unpaid order emails nobody (Juan, 5 November
       2026), and we have no business holding a stranger's passport.
     - No ABN field; DASPA's honeypot is company_website, not fld_x9.
     - The team alert is the full claim alert (every submitted field) with the
       documents added, because the person running the check needs the claim
       details beside the passport.

   TWO CALLS, NOT ONE, and the reason is a hard limit rather than a preference:
   a Vercel function body caps at 4.5 MB, and a passport photo off a modern
   phone is routinely 3-8 MB. So the file never passes through here. 'start'
   validates, finds the claim, writes the pending record and hands back one
   short-lived signed upload URL per file; the browser PUTs each file straight
   to Supabase; 'finish' checks what actually arrived, links it to the claim and
   notifies the team. The submission id is the capability: a uuid under a dated
   prefix, so 'finish' cannot be pointed at anything the caller did not just
   create.

   WHAT IS DELIBERATELY NOT DONE: the documents are not attached to the team
   email. These are passports. A signed link that expires keeps them in one
   private bucket with an audit trail, instead of copying them into every
   mailbox and mail server the message passes through, forever.

   If the record cannot be written, 'start' fails loudly rather than handing out
   upload URLs for a submission nobody will ever see.

   Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (+ RESEND_API_KEY, EMAIL_FROM,
   OPS_EMAIL for the team alert). */

'use strict';

const { guard } = require('./_lib/guard');
const docs = require('./_lib/id-documents');
const email = require('./_lib/email');
const db = require('./_lib/supabase');

const LINK_DAYS = 7;

/* The paid claim these documents belong to, or null.

   Order number first, because it is unambiguous; it is printed on every email
   the client has had from us. Email second: the newest paid claim for that
   address that is not yet verified is the one they are trying to finish.

   ilike with no wildcards is an exact match that ignores case, because
   addresses are stored as typed. PostgREST treats * as a wildcard in ilike, so
   it is stripped rather than allowed to widen the match. */
async function claimFor({ orderNumber, email: addr }) {
  const order = String(orderNumber || '').trim().toUpperCase();
  if (/^DASP\d{8}$/.test(order)) {
    const rows = await db.selectClaims(
      `order_number=eq.${encodeURIComponent(order)}&payment_status=eq.paid&select=*&limit=1`
    );
    if (rows[0]) return { claim: rows[0], matchedOn: 'order number' };
  }
  const e = String(addr || '').trim().replace(/\*/g, '');
  if (!e) return null;
  const rows = await db.selectClaims(
    `email=ilike.${encodeURIComponent(e)}&payment_status=eq.paid&verification_status=neq.verified`
    + '&select=*&order=paid_at.desc&limit=1'
  );
  return rows[0] ? { claim: rows[0], matchedOn: 'email address' } : null;
}

/* ---------- start ---------- */

async function start(req, res) {
  /* form:true, so the honeypot and the fill timing both apply. This is the call
     a person makes; 'finish' is the browser reporting back on it. */
  if (await guard(req, res, { bucket: 'id-document', form: true, limit: 5, windowMs: 60000 })) return;

  const b = req.body || {};
  const name = String(b.name || '').trim();
  /* Whitespace and zero-width characters stripped, not just trimmed: they are
     invisible, an address cannot contain them, and one left in would make the
     claim lookup below miss a client who did everything right. */
  const emailAddr = String(b.email || '').replace(/[\s\u200B-\u200D\u2060\uFEFF]/g, '');
  if (!name) return res.status(400).json({ error: 'name required' });
  if (!/^\S+@\S+\.\S+$/.test(emailAddr)) return res.status(400).json({ error: 'valid email required' });

  const bad = docs.checkFiles(b.files);
  if (bad) return res.status(400).json({ error: bad });

  /* Before anything is stored. No paid claim, no upload. */
  const match = await claimFor({ orderNumber: b.order, email: emailAddr });
  if (!match) {
    return res.status(404).json({
      error: 'We could not find a paid DASPA claim for that email address or order number. '
        + 'Use the email address you paid with, or the order number from your confirmation email (it starts with DASP).',
      reason: 'no_paid_claim',
    });
  }
  if (match.claim.verification_status === 'verified') {
    return res.status(409).json({
      error: 'Your identity is already verified for this claim, so there is nothing to upload.',
      reason: 'already_verified',
    });
  }

  const now = new Date();
  const uuid = (globalThis.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-0000-4000-8000-000000000000`;
  const id = `${now.toISOString().slice(0, 10)}/${uuid}`;

  /* Numbered, so two photos both called image.jpg cannot overwrite each other
     and the team sees them in the order they were attached. */
  const files = b.files.map((f, i) => ({
    field: `${i + 1}-${docs.safeName(f.name)}`,
    original: String(f.name).slice(0, 200),
    declared_size: Number(f.size),
  }));

  const record = {
    id,
    status: 'pending',
    started_at: now.toISOString(),
    name: name.slice(0, 200),
    email: emailAddr.slice(0, 200),
    order_number: b.order ? String(b.order).trim().slice(0, 60) : null,
    claim_id: match.claim.id,
    matched_order: match.claim.order_number,
    matched_on: match.matchedOn,
    note: b.note ? String(b.note).trim().slice(0, 2000) : null,
    files,
  };

  await docs.ensureBucket();
  await docs.putJson(`${id}/${docs.RECORD}`, record);

  const uploads = [];
  for (const f of files) {
    uploads.push({ name: f.original, url: await docs.signUpload(`${id}/${f.field}`) });
  }

  return res.status(200).json({ id, uploads });
}

/* ---------- finish ---------- */

async function finish(req, res) {
  /* Origin still applies, the form layers do not: there is no second honeypot
     and no second fill time, and demanding them would fail every real upload. */
  if (await guard(req, res, { bucket: 'id-document-finish', limit: 20, windowMs: 60000 })) return;

  const id = String((req.body || {}).id || '');
  if (!docs.ID_RE.test(id)) return res.status(400).json({ error: 'invalid submission' });

  const record = await docs.getJson(`${id}/${docs.RECORD}`);
  if (!record) return res.status(404).json({ error: 'unknown submission' });

  const found = await docs.list(`${id}/`);
  const byName = new Map(found.map((o) => [o.name, o.size]));

  const arrived = [], missing = [];
  for (const f of record.files) {
    if (byName.has(f.field) && byName.get(f.field) > 0) {
      arrived.push({ field: f.field, original: f.original, size: byName.get(f.field) });
    } else {
      missing.push(f.original);
    }
  }

  /* Nothing arrived means the PUTs failed, so this is not a submission yet. The
     browser shows its own error and the client can try again on the same page
     rather than being told we have documents we do not have. */
  if (!arrived.length) {
    console.warn(`id-document: finish with no files present for ${id}`);
    return res.status(409).json({ error: 'no documents arrived', missing });
  }

  const now = new Date().toISOString();

  /* The claim link, which is what lets _lib/identity-verified.js destroy the
     images the moment Stripe marks the check verified. Written after the files
     are known to be there, so a submission where nothing arrived never stamps
     a row. If the claim already points at an earlier upload, this replaces the
     pointer: the newer documents are the ones being checked, and the earlier
     ones are still caught by the 30-day sweep. */
  let claim = null, linked = false;
  try {
    claim = await db.getClaim(record.claim_id);
    if (claim) {
      const updated = await db.updateClaim(claim.id, { id_documents_path: id, id_documents_at: now });
      linked = true;
      claim = updated || { ...claim, id_documents_path: id, id_documents_at: now };
      await db.insertAudit(claim.id, 'id_documents_uploaded',
        `${arrived.length} file(s) at ${docs.BUCKET}/${id}${missing.length ? `, ${missing.length} missing` : ''}`)
        .catch(() => {});
    }
  } catch (e) {
    console.warn(`id-document: could not link ${id} to claim ${record.claim_id}, documents will age out instead:`, e.message);
  }

  record.status = missing.length ? 'partial' : 'received';
  record.received_at = now;
  record.arrived = arrived;
  record.missing = missing;
  record.auto_delete_on_verification = linked;
  await docs.putJson(`${id}/${docs.RECORD}`, record);

  /* Signed links are minted here because signing is the storage module's job;
     laying them out is the email module's. */
  const documents = [];
  for (const f of arrived) {
    let url = null;
    try { url = await docs.signDownload(`${id}/${f.field}`, LINK_DAYS * 86400, f.field); }
    catch (e) { console.warn('signed link failed:', e.message); }
    documents.push({ name: f.original, size: f.size, url });
  }

  const sent = await email.opsIdDocuments(claim || {
    id: record.claim_id, order_number: record.matched_order, full_name: record.name, email: record.email,
  }, {
    documents,
    missing,
    note: record.note,
    linked,
    matchedOn: record.matched_on,
    uploaderName: record.name,
    uploaderEmail: record.email,
    prefix: `${docs.BUCKET}/${id}/`,
    linkDays: LINK_DAYS,
  });
  if (!sent) console.warn(`id-document: ${id} is stored but the team was not emailed`);

  return res.status(200).json({
    ok: true, received: arrived.length, missing, order: record.matched_order || null,
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  if (!docs.configured()) {
    console.error('id-document: Supabase not configured');
    return res.status(500).json({ error: 'internal error' });
  }

  try {
    const action = String((req.body || {}).action || 'start');
    if (action === 'start') return await start(req, res);
    if (action === 'finish') return await finish(req, res);
    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'internal error' });
  }
};
