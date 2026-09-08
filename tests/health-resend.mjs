// Tests /api/health's real-send proof, ?deep=1&send=1.
//
// This check is the only one in the codebase that has an effect in the world:
// it puts a message in an inbox. So the branches worth testing are not the
// happy path, they are the ones where it must NOT send, and the ones where a
// wrong diagnosis would send someone to the wrong dashboard screen for an hour.
//
// Covered here and reachable no other way:
//   - deep without send=1 sends nothing at all
//   - a missing OPS_EMAIL sends nothing rather than inventing a recipient
//   - 401 and 403 give DIFFERENT advice (bad key vs unverified domain); these
//     were briefly the same branch, so 403 advice was unreachable
//   - a 200 carrying no message id is not treated as proof of sending
//   - the API key never appears in the response
//
// Run: node tests/health-resend.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let assertions = 0, failed = 0;
const eq = (name, got, want) => {
  assertions++;
  if (got !== want) { failed++; console.log(`FAIL  ${name}\n  got  ${got}\n  want ${want}`); }
  else console.log(`PASS  ${name}`);
};

process.env.RESEND_API_KEY = 're_fake';
process.env.EMAIL_FROM = 'DASPA <hello@daspa.com.au>';
process.env.OPS_EMAIL = 'claims@daspa.com.au';
process.env.SUPABASE_URL = 'https://x.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'x';
process.env.STRIPE_SECRET_KEY = 'rk_live_x';
process.env.SITE_URL = 'https://daspa.com.au';

const handler = require(new URL('../api/health.js', import.meta.url).pathname);

function run(stub, query) {
  global.fetch = stub;
  let payload = null;
  const res = {
    setHeader() {}, status() { return this; },
    json(p) { payload = p; return this; }, end() { return this; },
  };
  return handler({ method: 'GET', query, headers: {} }, res).then(() => payload);
}

// Every non-resend deep call gets a benign answer; only /emails varies.
const stubFor = (emailsResponse) => async (url, opts) => {
  const u = String(url);
  if (u === 'https://api.resend.com/emails') return emailsResponse();
  return { ok: false, status: 500, json: async () => ({}), text: async () => '' };
};

const J = (status, body) => () => ({
  ok: status >= 200 && status < 300, status,
  json: async () => body, text: async () => JSON.stringify(body),
});

// 1. Not requested -> no send happens at all.
let sawEmails = false;
let p = await run(async (url) => {
  if (String(url) === 'https://api.resend.com/emails') sawEmails = true;
  return { ok: false, status: 500, json: async () => ({}), text: async () => '' };
}, { deep: '1' });
eq('deep without send -> checked false', p.deep.resend_send.checked, false);
eq('deep without send -> nothing sent', sawEmails, false);

// 2. Accepted.
p = await run(stubFor(J(200, { id: 'abc-123' })), { deep: '1', send: '1' });
eq('202 with id -> ok', p.deep.resend_send.ok, true);
eq('202 with id -> accepted', p.deep.resend_send.accepted, true);
eq('reports the to address', p.deep.resend_send.to, 'claims@daspa.com.au');

// 3. 401 -> conclusive bad key.
p = await run(stubFor(J(401, { message: 'API key is invalid' })), { deep: '1', send: '1' });
eq('401 -> not ok', p.deep.resend_send.ok, false);
eq('401 -> error', p.deep.resend_send.error, 'resend 401');
eq('401 -> conclusive wording', /conclusive/.test(p.deep.resend_send.means), true);
eq('401 -> surfaces resend message', p.deep.resend_send.resend_says, 'API key is invalid');
eq('401 -> fix names API Keys', /API Keys/.test(p.deep.resend_send.fix), true);

// 4. 403 -> domain, NOT the bad-key wording (the bug just fixed).
p = await run(stubFor(J(403, { message: 'The daspa.com.au domain is not verified' })), { deep: '1', send: '1' });
eq('403 -> domain wording', /not verified on this account/.test(p.deep.resend_send.means), true);
eq('403 -> not the bad-key wording', /conclusive/.test(p.deep.resend_send.means || ''), false);
eq('403 -> fix names Domains', /Domains/.test(p.deep.resend_send.fix), true);

// 5. 422 -> message rejected, not the key.
p = await run(stubFor(J(422, { message: 'from is not a valid address' })), { deep: '1', send: '1' });
eq('422 -> message-not-key wording', /not the key/.test(p.deep.resend_send.means), true);

// 6. 429 -> rate limit, explicitly not a misconfiguration.
p = await run(stubFor(J(429, { message: 'Too many requests' })), { deep: '1', send: '1' });
eq('429 -> rate limited', /Rate limited/.test(p.deep.resend_send.means), true);

// 7. 200 with no id -> must NOT be reported as proof.
p = await run(stubFor(J(200, {})), { deep: '1', send: '1' });
eq('200 without id -> not ok', p.deep.resend_send.ok, false);

// 8. Network throw -> reported, never thrown.
p = await run(stubFor(() => { throw new Error('getaddrinfo ENOTFOUND'); }), { deep: '1', send: '1' });
eq('throw -> reported not thrown', p.deep.resend_send.error, 'getaddrinfo ENOTFOUND');

// 9. No OPS_EMAIL -> refuses to invent a recipient.
delete process.env.OPS_EMAIL;
sawEmails = false;
p = await run(async (url) => {
  if (String(url) === 'https://api.resend.com/emails') sawEmails = true;
  return { ok: false, status: 500, json: async () => ({}), text: async () => '' };
}, { deep: '1', send: '1' });
eq('no OPS_EMAIL -> not checked', p.deep.resend_send.checked, false);
eq('no OPS_EMAIL -> sends nothing', sawEmails, false);
process.env.OPS_EMAIL = 'claims@daspa.com.au';

// 10. Never leaks the key.
p = await run(stubFor(J(401, { message: 'x' })), { deep: '1', send: '1' });
eq('never leaks the key', JSON.stringify(p).includes('re_fake'), false);

console.log(`\n${assertions} assertions, ${failed} failed`);
process.exit(failed ? 1 : 0);
