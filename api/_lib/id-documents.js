/* The private bucket behind /id-verification, in one place.
//
// PORTED FROM abnassist-site/lib/id-documents.js on 5 November 2026, at Juan's
// request, so DASPA offers the same manual ID upload as ABN Assist and GST
// Register instead of "email us". Kept as close to the original as possible so
// a fix in one can be carried to the other; the differences are the bucket name
// and the caller names in these comments.
//
// Everything that knows about the ID document storage lives here, the same way
// _lib/identity.js is the only module that talks to Stripe Identity. Three
// callers need it: api/id-document.js, which takes the upload,
// _lib/identity-verified.js, which destroys the documents once the claim is
// verified, and api/id-documents-sweep.js, which deletes what is left after 30
// days. A copy of the bucket name and the path shape in both would
// drift, and the failure mode of that drift is a purge that silently deletes
// nothing.
//
// PATH SHAPE, which the deletion depends on:
//
//   id-documents-daspa/2026-11-05/<uuid>/1-passport.jpg
//                                       /2-passport-page-2.jpg
//                                       /submission.json
//
// The dated uuid prefix is the submission id, and it is also the capability:
// api/id-document.js hands it to the browser and accepts nothing else, so a
// caller cannot point the second half of the upload at somebody else's folder.
//
// WHAT SURVIVES A PURGE. The images go; submission.json stays, rewritten with
// the deletion timestamp. That split is the point rather than an implementation
// detail: what has to be kept is the record of the identity check (who sent
// what, when, and that it was destroyed), not photographs of a passport.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. */

'use strict';

/* One bucket per service, not one shared across all of them. Juan's call,
   26 August 2026: CGT Clearance and GST Register will want the same page, and a
   single bucket would mix three products' identity documents behind one prefix,
   where every retention decision and every access question then has to be made
   for all of them at once. Suffixed rather than nested for the same reason: a
   bucket is the unit Supabase applies policies and limits to, a folder is not. */
const BUCKET = 'id-documents-daspa';
const RECORD = 'submission.json';

/* Four files, kept from ABN Assist. A DASP claim needs a passport, usually one
   photo of the photo page, and four leaves room for a second page or a retake.
   The original reasoning: front and back of a licence plus
   a passport page and a Medicare card. 25 MiB each is the old WordPress form's
   limit, which displayed as "26.21MB". */
const MAX_FILES = 4;
const MAX_BYTES = 25 * 1024 * 1024;

/* Checked on the EXTENSION, not on the browser's mime type. A HEIC straight off
   an iPhone arrives as image/heic, image/heif, application/octet-stream or an
   empty string depending on the browser, and refusing it on the mime type would
   turn away exactly the person this page exists for. The bucket carries the size
   limit; this list carries the format. */
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'pdf'];

/* A submission id, on shape, before it reaches storage as a path. */
const ID_RE = /^\d{4}-\d{2}-\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const base = () => process.env.SUPABASE_URL;
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = () => !!(base() && key());

const headers = (extra) => Object.assign({
  apikey: key(),
  Authorization: `Bearer ${key()}`,
}, extra || {});

/* Auto-created on first use, like the contact form's bucket: no manual setup
   step that can be forgotten in a new environment. Private, and with the size
   limit set on the bucket itself so a signed URL cannot be used to push
   something enormous even if the client-side check is bypassed. */
async function ensureBucket() {
  const r = await fetch(`${base()}/storage/v1/bucket`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: MAX_BYTES }),
  });
  if (!r.ok && r.status !== 409) {
    const body = await r.text();
    if (!/exists/i.test(body)) throw new Error(`bucket create failed: ${r.status} ${body}`);
  }
}

/* A filename from a phone can be anything, and it is about to become a storage
   path. Directory parts go, everything outside a small safe set becomes a
   hyphen, and the length is capped. "../../secrets.pdf" comes out "secrets.pdf". */
function safeName(raw) {
  const name = String(raw || '').split(/[\\/]/).pop() || 'document';
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^[.-]+/, '').slice(0, 80);
  return cleaned || 'document';
}

const extOf = (name) => {
  const m = String(name || '').match(/\.([A-Za-z0-9]+)$/);
  return m ? m[1].toLowerCase() : '';
};

function checkFiles(files) {
  if (!Array.isArray(files) || !files.length) return 'attach at least one document';
  if (files.length > MAX_FILES) return `attach at most ${MAX_FILES} files`;
  for (const f of files) {
    const name = f && f.name;
    if (!name || !String(name).trim()) return 'every file needs a name';
    if (!ALLOWED_EXT.includes(extOf(name))) return 'files must be JPG, PNG, HEIC, WEBP or PDF';
    const size = Number(f && f.size);
    if (!Number.isFinite(size) || size <= 0) return 'every file needs a size';
    if (size > MAX_BYTES) return `each file must be under ${Math.floor(MAX_BYTES / 1048576)}MB`;
  }
  return null;
}

async function putJson(path, value) {
  const r = await fetch(`${base()}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'PUT',
    headers: headers({ 'Content-Type': 'application/json', 'x-upsert': 'true' }),
    body: JSON.stringify(value, null, 2),
  });
  if (!r.ok) throw new Error(`record write failed: ${r.status} ${await r.text()}`);
}

async function getJson(path) {
  const r = await fetch(`${base()}/storage/v1/object/${BUCKET}/${path}`, { headers: headers() });
  if (r.status === 404 || r.status === 400) return null;
  if (!r.ok) throw new Error(`record read failed: ${r.status}`);
  const text = await r.text();
  try { return JSON.parse(text); } catch { return null; }
}

/* One signed upload URL per file. The response's url is relative, so the origin
   goes back on before it reaches the browser. */
async function signUpload(path) {
  const r = await fetch(`${base()}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: '{}',
  });
  if (!r.ok) throw new Error(`sign upload failed: ${r.status} ${await r.text()}`);
  const data = await r.json();
  if (!data || !data.url) throw new Error('sign upload returned no url');
  return `${base()}/storage/v1${data.url}`;
}

/* A signed link the team can open from the email.

   `download` is the part that matters for the workflow: without it Storage
   serves the object inline, so a passport photo opens in a browser tab and has to
   be right-clicked out of it. With it, Storage sends
   Content-Disposition: attachment and the file lands in Downloads ready to
   attach to the manual Stripe Identity check.

   The sanitised, numbered name is used rather than the one the phone supplied:
   it is unique within the submission, so two photos both called image.jpg do not
   overwrite each other in the reviewer's Downloads folder, and nothing from an
   untrusted file name reaches a response header. */
async function signDownload(path, seconds, filename) {
  const r = await fetch(`${base()}/storage/v1/object/sign/${BUCKET}/${path}`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ expiresIn: seconds }),
  });
  if (!r.ok) throw new Error(`sign download failed: ${r.status}`);
  const data = await r.json();
  if (!data || !data.signedURL) return null;
  return `${base()}/storage/v1${data.signedURL}&download=${encodeURIComponent(filename || '')}`;
}

/* What is at a prefix, by name and size. Listing beats fetching each object:
   a caller has to confirm a 25 MB file arrived, not download it. Names come back
   relative to the prefix.

   `folder` is how the retention sweep walks the bucket. Storage lists one level
   at a time, so a prefix of '' returns the date folders and a prefix of
   '2026-08-25/' returns that day's submissions; a folder comes back with a null
   id and no metadata, which is the only thing separating it from a file.

   Ascending by name on purpose. Names here start with a date, so oldest first,
   which means a truncated page keeps the oldest entries: exactly the ones a
   retention sweep needs and the ones a "did my upload arrive" check does not
   care about. */
async function list(prefix, opts) {
  const r = await fetch(`${base()}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      prefix,
      limit: (opts && opts.limit) || 100,
      sortBy: { column: 'name', order: 'asc' },
    }),
  });
  if (!r.ok) throw new Error(`list failed: ${r.status}`);
  const rows = await r.json();
  return (Array.isArray(rows) ? rows : []).map((o) => ({
    name: o.name,
    size: (o.metadata && Number(o.metadata.size)) || 0,
    folder: o.id === null || o.id === undefined,
  }));
}

/* Destroys the documents in one submission and leaves the record of them.
//
// Called when a claim is confirmed verified, from _lib/identity-verified.js.
// The images have done their job at that point: the team has downloaded them,
// put them through the identity check, and the check has passed.
//
// THROWS RATHER THAN SWALLOWING. The caller decides what a failure means, and
// for the caller that matters the answer is "leave the path on the claim row and
// log", so the documents are still findable and a later sweep can finish the
// job. A purge that reports success having deleted nothing is the one outcome
// that must not be possible, so nothing here is best-effort.
//
// Storage has no recursive delete, so the folder is listed and the objects named
// explicitly. Deleting a prefix that no longer exists is not an error: it
// returns { deleted: 0 }, which is the honest answer for a submission already
// purged by something else. */
async function purge(prefix, { at } = {}) {
  if (!configured()) throw new Error('storage not configured');
  const id = String(prefix || '').replace(/\/+$/, '');
  if (!ID_RE.test(id)) throw new Error(`refusing to purge a path that is not a submission id: ${id}`);

  const found = await list(`${id}/`);
  const docs = found.filter((o) => o.name !== RECORD);
  if (!docs.length) return { deleted: 0, kept: found.length };

  const r = await fetch(`${base()}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes: docs.map((o) => `${id}/${o.name}`) }),
  });
  if (!r.ok) throw new Error(`delete failed: ${r.status} ${await r.text()}`);

  /* The record is updated after the images are gone, never before: if the delete
     fails, the record must not claim a destruction that did not happen. */
  const when = (at instanceof Date ? at : new Date()).toISOString();
  const record = await getJson(`${id}/${RECORD}`);
  if (record) {
    record.documents_deleted_at = when;
    record.documents_deleted = docs.map((o) => o.name);
    await putJson(`${id}/${RECORD}`, record);
  } else {
    /* No record to annotate. Worth a line in the log rather than silence: it
       means the images outlived the thing that explains them. */
    console.warn(`id-documents: purged ${id} but found no ${RECORD} to annotate`);
  }

  return { deleted: docs.length, at: when };
}

module.exports = {
  BUCKET, RECORD, MAX_FILES, MAX_BYTES, ALLOWED_EXT, ID_RE,
  configured, ensureBucket, safeName, extOf, checkFiles,
  putJson, getJson, signUpload, signDownload, list, purge,
};
