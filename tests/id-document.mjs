/* The manual passport upload: /api/id-document, the deletion on verification
   in _lib/identity-verified.js, and the 30-day /api/id-documents-sweep.

   Ported in spirit from abnassist-site/tests/id-document.mjs, 5 November 2026,
   and focused on what DASPA does differently: an upload is refused unless it
   belongs to a paid claim, it is linked to that claim, the team alert carries
   download links rather than attachments, and the images are destroyed when
   Stripe marks the claim verified.

   Supabase (PostgREST and Storage) and Resend are an in-memory double. It keeps
   what it is given, so 'finish' is tested against what actually arrived, and
   deletion against what is actually left.

   Run: node tests/id-document.mjs */

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

process.env.SUPABASE_URL = 'https://project.supabase.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
process.env.RESEND_API_KEY = 're_test';
process.env.OPS_EMAIL = 'claims@daspa.com.au';
process.env.EMAIL_FROM = 'DASPA <claims@daspa.com.au>';
process.env.SITE_URL = 'https://daspa.com.au';
process.env.CRON_SECRET = 'cron-test-secret';

let n = 0, failed = 0;
const ok = (name, cond) => { n++; if (!cond) failed++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`); };

/* ---------- the double ---------- */

const BASE = process.env.SUPABASE_URL;
const store = new Map();   // bucket/path -> { body, size }
const claims = new Map();  // id -> row
const audits = [];
const emails = [];

function reset() { store.clear(); claims.clear(); audits.length = 0; emails.length = 0; }

const seedClaim = (id, extra) => {
  claims.set(id, {
    id, order_number: 'DASP00020200', full_name: 'Sample Person', email: 'Sample@Example.com',
    payment_status: 'paid', paid_at: '2026-11-05T01:00:00Z', verification_status: 'not_started',
    stripe_customer_id: 'cus_Sample', id_documents_path: null, id_documents_at: null,
    id_documents_deleted_at: null, ...extra,
  });
  return claims.get(id);
};

function filterClaims(qs) {
  const q = new URLSearchParams(qs);
  let rows = [...claims.values()];
  for (const [k, v] of q) {
    if (['select', 'limit', 'order'].includes(k)) continue;
    const [op, ...rest] = v.split('.');
    const val = rest.join('.');
    if (op === 'eq') rows = rows.filter((r) => String(r[k]) === val);
    if (op === 'neq') rows = rows.filter((r) => String(r[k]) !== val);
    if (op === 'ilike') rows = rows.filter((r) => String(r[k]).toLowerCase() === val.toLowerCase());
    if (op === 'is' && val === 'null') rows = rows.filter((r) => r[k] === null || r[k] === undefined);
  }
  const limit = Number(q.get('limit') || 0);
  return limit ? rows.slice(0, limit) : rows;
}

const res = (body, status = 200) => ({
  ok: status >= 200 && status < 300, status,
  json: async () => body, text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
});

global.fetch = async (url, opts = {}) => {
  url = String(url);
  const method = opts.method || 'GET';
  const body = opts.body;

  if (url.startsWith('https://api.resend.com')) { emails.push(JSON.parse(body)); return res({ id: 'em_1' }); }

  if (url.startsWith(`${BASE}/rest/v1/rate_limit_hits`)) return res('missing', 404);
  if (url.startsWith(`${BASE}/rest/v1/claim_audit_log`)) {
    if (method === 'POST') { const a = JSON.parse(body); audits.push(Array.isArray(a) ? a[0] : a); return res([]); }
    return res([]);
  }
  if (url.startsWith(`${BASE}/rest/v1/claims`)) {
    const qs = url.split('?')[1] || '';
    const rows = filterClaims(qs);
    if (method === 'GET') return res(rows);
    if (method === 'PATCH') {
      const patch = JSON.parse(body);
      rows.forEach((r) => Object.assign(r, patch));
      return res(rows);
    }
  }

  if (url === `${BASE}/storage/v1/bucket` && method === 'POST') return res({ name: 'ok' });

  let m = url.match(/\/storage\/v1\/object\/upload\/sign\/([^/]+)\/(.+)$/);
  if (m) return res({ url: `/object/upload/sign/${m[1]}/${m[2]}?token=up` });
  m = url.match(/\/storage\/v1\/object\/sign\/([^/]+)\/(.+)$/);
  if (m) return res({ signedURL: `/object/sign/${m[1]}/${m[2]}?token=${'x'.repeat(380)}` });
  m = url.match(/\/storage\/v1\/object\/list\/([^/]+)$/);
  if (m) {
    const { prefix } = JSON.parse(body);
    const out = new Map();
    for (const [key, v] of store) {
      if (!key.startsWith(`${m[1]}/${prefix}`)) continue;
      const restPath = key.slice(`${m[1]}/${prefix}`.length);
      const [head, ...tail] = restPath.split('/');
      if (tail.length) out.set(head, { name: head, id: null, metadata: null });
      else out.set(head, { name: head, id: 'obj', metadata: { size: v.size } });
    }
    return res([...out.values()].sort((a, b) => (a.name < b.name ? -1 : 1)));
  }
  m = url.match(/\/storage\/v1\/object\/([^/]+)$/);
  if (m && method === 'DELETE') {
    for (const p of JSON.parse(body).prefixes) store.delete(`${m[1]}/${p}`);
    return res([]);
  }
  m = url.match(/\/storage\/v1\/object\/([^/]+)\/(.+)$/);
  if (m) {
    const key = `${m[1]}/${m[2]}`;
    if (method === 'PUT' || method === 'POST') { store.set(key, { body: String(body), size: String(body).length }); return res({}); }
    if (method === 'GET') return store.has(key) ? res(store.get(key).body) : res('not found', 404);
  }
  throw new Error(`unexpected fetch ${method} ${url}`);
};

const docs = require('../api/_lib/id-documents.js');
const handler = require('../api/id-document.js');
const verified = require('../api/_lib/identity-verified.js');
const sweep = require('../api/id-documents-sweep.js');
const B = docs.BUCKET;

/* Each call from its own address, so the rate limit (5 a minute per address,
   which is the point of it) does not trip on a test file that makes dozens. */
let ipSeq = 0;
async function call(fn, { method = 'POST', body = {}, headers = {}, query = {} } = {}) {
  let code = 200, payload = null;
  headers = { 'x-forwarded-for': `198.51.100.${++ipSeq % 250}`, ...headers };
  const r = {
    status(c) { code = c; return this; }, json(p) { payload = p; return this; }, setHeader() {},
  };
  await fn({ method, body, query, headers: { origin: 'https://daspa.com.au', ...headers }, socket: {} }, r);
  return { code, payload };
}
const startBody = (extra) => ({
  action: 'start', company_website: '', elapsed_ms: 9000, name: 'Sample Person',
  email: 'sample@example.com', files: [{ name: 'passport.jpg', size: 2048 }], ...extra,
});
// The browser's PUT to the signed URL, done here by writing what it would.
const browserPuts = (id, names) => names.forEach((nm) => store.set(`${B}/${id}/${nm}`, { body: 'img', size: 2048 }));

/* ---------- start: only for a paid claim ---------- */
{
  reset();
  const r = await call(handler, { body: startBody() });
  ok('no paid claim -> refused with 404', r.code === 404 && r.payload.reason === 'no_paid_claim');
  ok('and nothing is stored', store.size === 0);
  ok('and nobody is emailed', emails.length === 0);
}
{
  reset();
  seedClaim('c-unpaid', { payment_status: 'unpaid', paid_at: null });
  const r = await call(handler, { body: startBody() });
  ok('an unpaid claim does not count', r.code === 404);
}
{
  reset();
  seedClaim('c-1');
  const r = await call(handler, { body: startBody() });
  ok('a paid claim matched by email (any case) -> upload URLs', r.code === 200 && r.payload.uploads.length === 1);
  ok('the id is a dated uuid', docs.ID_RE.test(r.payload.id));
  ok('the record is written before the files', store.has(`${B}/${r.payload.id}/${docs.RECORD}`));
  const rec = JSON.parse(store.get(`${B}/${r.payload.id}/${docs.RECORD}`).body);
  ok('the record names the claim', rec.claim_id === 'c-1' && rec.matched_on === 'email address');
}
{
  reset();
  seedClaim('c-2', { email: 'someone-else@example.com' });
  const r = await call(handler, { body: startBody({ order: 'dasp00020200' }) });
  ok('matched by order number when the email differs', r.code === 200);
}
{
  reset();
  seedClaim('c-3', { verification_status: 'verified' });
  const r = await call(handler, { body: startBody({ order: 'DASP00020200' }) });
  ok('an already verified claim -> 409, nothing to upload', r.code === 409 && r.payload.reason === 'already_verified');
}
{
  reset();
  seedClaim('c-4');
  const r = await call(handler, { body: startBody({ files: [{ name: 'passport.exe', size: 10 }] }) });
  ok('a file that is not a photo or PDF is refused', r.code === 400 && store.size === 0);
  const h = await call(handler, { body: startBody({ files: [{ name: 'IMG_0001.HEIC', size: 10 }] }) });
  ok('an iPhone HEIC is accepted', h.code === 200);
}
{
  reset();
  seedClaim('c-5');
  const r = await call(handler, { body: startBody({ company_website: 'spam.example' }) });
  ok('a filled honeypot is told ok and stores nothing', r.code === 200 && !r.payload.uploads && store.size === 0);
  const f = await call(handler, { body: startBody({ elapsed_ms: 500 }) });
  ok('a form filled in half a second is refused', f.code === 429);
  const x = await call(handler, { body: startBody(), headers: { origin: 'https://evil.example' } });
  ok('another site cannot post to it', x.code === 403);
}

/* ---------- finish ---------- */
{
  reset();
  seedClaim('c-6');
  const s = await call(handler, { body: startBody({ files: [{ name: 'passport.jpg', size: 2048 }, { name: 'page2.jpg', size: 2048 }] }) });
  const empty = await call(handler, { body: { action: 'finish', id: s.payload.id } });
  ok('nothing arrived -> 409, not a thank you', empty.code === 409);
  ok('and nobody is emailed', emails.length === 0);
  ok('and the claim is not stamped', claims.get('c-6').id_documents_path === null);

  browserPuts(s.payload.id, ['1-passport.jpg']);
  const r = await call(handler, { body: { action: 'finish', id: s.payload.id } });
  ok('one of two arrived -> ok, with the missing one named', r.code === 200 && r.payload.received === 1 && r.payload.missing[0] === 'page2.jpg');
  ok('the claim points at the documents', claims.get('c-6').id_documents_path === s.payload.id);
  ok('the upload is in the claim history', audits.some((a) => a.event === 'id_documents_uploaded'));

  const mail = emails[0];
  ok('the team is emailed', !!mail && mail.to[0] === 'claims@daspa.com.au');
  ok('the subject says what to do', mail.subject.startsWith('[DASPA] ID DOCUMENTS TO CHECK DASP00020200'));
  ok('the passport is a Download link, not an attachment', mail.html.includes('Download &rarr;') && !mail.attachments);
  ok('the 400-character URL sits in the href, not printed as text',
    (mail.html.match(/token=x{380}/g) || []).length === 1 && mail.html.includes(`href="${BASE}/storage/v1/object/sign/`));
  ok('the missing file is called out', mail.text.includes('Did not arrive: page2.jpg'));
  ok('the Stripe customer is named, so the check lands on this claim', mail.text.includes('cus_Sample'));
  ok('the full claim follows', mail.text.includes('PASSPORT AND VISA'));
  ok('a reply goes to the client', mail.reply_to === 'Sample@Example.com');

  const bad = await call(handler, { body: { action: 'finish', id: '../../other' } });
  ok('finish cannot be pointed at another folder', bad.code === 400);
}

/* ---------- deleted when Stripe marks the claim verified ---------- */
{
  reset();
  seedClaim('c-7');
  const s = await call(handler, { body: startBody() });
  browserPuts(s.payload.id, ['1-passport.jpg']);
  await call(handler, { body: { action: 'finish', id: s.payload.id } });
  ok('the image is in storage before verification', store.has(`${B}/${s.payload.id}/1-passport.jpg`));

  // What the webhook does when the team's manual check passes in Stripe:
  // a session created by hand carries no claim id, only the related customer.
  const v = await verified.markVerified({ customerId: 'cus_Sample', sessionId: 'vs_manual' });
  ok('the claim is verified', v.claimed && claims.get('c-7').verification_status === 'verified');
  ok('the image is destroyed', !store.has(`${B}/${s.payload.id}/1-passport.jpg`));
  ok('the record of the check survives', store.has(`${B}/${s.payload.id}/${docs.RECORD}`));
  const rec = JSON.parse(store.get(`${B}/${s.payload.id}/${docs.RECORD}`).body);
  ok('and says when the images were destroyed', !!rec.documents_deleted_at);
  ok('the claim pointer is cleared and the deletion stamped',
    claims.get('c-7').id_documents_path === null && !!claims.get('c-7').id_documents_deleted_at);
  ok('the deletion is in the claim history', audits.some((a) => a.event === 'id_documents_deleted'));
}
{
  reset();
  seedClaim('c-8');
  const v = await verified.markVerified({ claimId: 'c-8', sessionId: 'vs_normal' });
  ok('a normal verification with no upload deletes nothing and still verifies',
    v.claimed && v.purged && v.purged.skipped === 'none held');
}

/* ---------- the 30-day sweep ---------- */
{
  reset();
  seedClaim('c-9', { id_documents_path: '2026-09-01/11111111-1111-4111-8111-111111111111' });
  store.set(`${B}/2026-09-01/11111111-1111-4111-8111-111111111111/1-passport.jpg`, { body: 'img', size: 3 });
  store.set(`${B}/2026-09-01/11111111-1111-4111-8111-111111111111/${docs.RECORD}`,
    { body: JSON.stringify({ claim_id: 'c-9' }), size: 10 });
  const today = new Date().toISOString().slice(0, 10);
  store.set(`${B}/${today}/22222222-2222-4222-8222-222222222222/1-passport.jpg`, { body: 'img', size: 3 });

  const no = await call(sweep, { method: 'GET', headers: {} });
  ok('the sweep refuses without the cron secret', no.code === 401 && store.size === 3);

  const r = await call(sweep, { method: 'GET', headers: { authorization: 'Bearer cron-test-secret' } });
  ok('an upload older than 30 days is deleted', r.code === 200 && !store.has(`${B}/2026-09-01/11111111-1111-4111-8111-111111111111/1-passport.jpg`));
  ok('its record stays', store.has(`${B}/2026-09-01/11111111-1111-4111-8111-111111111111/${docs.RECORD}`));
  ok('and its claim pointer is cleared', claims.get('c-9').id_documents_path === null);
  ok('a fresh upload is left alone', store.has(`${B}/${today}/22222222-2222-4222-8222-222222222222/1-passport.jpg`));
}

console.log(`\n${n - failed}/${n} passed`);
process.exit(failed ? 1 : 0);
