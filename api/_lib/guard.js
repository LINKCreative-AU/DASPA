/* Form guards: origin, honeypot, timing, rate limit.
   Ported from abnassist-site/lib/guard.js. Only the host allowlist differs;
   keep the rest in step with that file so a fix in one lands in both.

   Four cheap layers in front of every endpoint that writes something, sends
   something, or spends someone else's quota. None of them is a wall on its
   own. Together they stop commodity spam, which is what actually turns up:
   scripted POSTs from a list of endpoints, with no browser behind them.

   What each one catches, and what it does not:

   - ORIGIN. A browser cannot forge Origin on a cross-site POST, so this stops
     anything curl-shaped outright. It does not stop a headless browser driving
     the real form, and it must never be applied to server-to-server callers
     like the Stripe webhook, which legitimately send no Origin.
   - HONEYPOT. A decoy field, hidden from people and from screen readers, that
     naive bots fill because it looks like a real input. Costs a real user
     nothing.
   - TIMING. Real people take seconds to fill a form. The client reports how
     long it had the form open; anything implausibly fast is refused. The value
     is client-supplied and therefore forgeable, which is exactly why it sits
     behind the other three rather than carrying weight on its own.
   - RATE LIMIT. The only layer that helps against a determined attacker, and
     the only one that protects the ABR quota, where the real risk is not spam
     but losing the lookup that every order form depends on.

   Everything here FAILS OPEN. A guard that breaks must never stop a real
   customer ordering: on any internal error the request is allowed and the
   reason is logged. The one deliberate exception is a positively-identified
   bad origin or a filled honeypot, which are refused.
*/

'use strict';

const ALLOWED_HOSTS = [
  'daspa.com.au',
  'www.daspa.com.au',
];

/* Vercel deployment URLs, so the pages stay testable on a preview deployment.

   THE PROJECT IS CALLED daspa-site, NOT daspa. Taken from the Vercel API on
   7 September 2026 rather than guessed, because getting it wrong here 403s
   every verification attempt on a preview and the symptom looks like a broken
   Stripe integration. Real hostnames observed on live deployments:

     daspa-site-<hash>-online-services.vercel.app
     daspa-site-git-<branch>-online-services.vercel.app   (branch truncated + hashed)
     daspa-site.vercel.app
     daspa.vercel.app                                      (older alias, still serving)

   ANCHORED, deliberately. An endsWith() check here is a hole: it accepts
   evil-daspa-site.vercel.app, and anyone can register that subdomain on Vercel
   in a minute and post at us with a passing Origin. It reads fine and is wrong. */
const ALLOWED_PATTERNS = [
  /^daspa-site(-[a-z0-9-]+)?-online-services\.vercel\.app$/,
  /^daspa-site\.vercel\.app$/,
  /^daspa\.vercel\.app$/,
];

function hostAllowed(host) {
  if (!host) return false;
  const h = String(host).toLowerCase().replace(/:\d+$/, '');
  if (ALLOWED_HOSTS.includes(h)) return true;
  if (ALLOWED_PATTERNS.some((re) => re.test(h))) return true;
  // localhost, for the test suite and local development
  if (h === 'localhost' || h === '127.0.0.1') return true;
  return false;
}

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return null; }
}

/* Origin first, Referer as the fallback: some privacy tooling strips Referer,
   and a few older browsers omit Origin on same-origin POSTs. Requiring at
   least one to be present and correct is the line that stops scripted posts
   without turning away real traffic. */
function checkOrigin(req) {
  const h = (req && req.headers) || {};
  const origin = h.origin || h.Origin;
  const referer = h.referer || h.referrer || h.Referer;

  if (origin) return hostAllowed(hostOf(origin)) ? null : 'bad origin';
  if (referer) return hostAllowed(hostOf(referer)) ? null : 'bad referer';
  return 'no origin';
}

/* The decoy. Named so it reads as a real field to a bot filling everything it
   finds. Any value at all means the submitter was not a person. */
const HONEYPOT_FIELD = 'company_website';

function checkHoneypot(body) {
  const v = body && body[HONEYPOT_FIELD];
  if (v === undefined || v === null || String(v).trim() === '') return null;
  return 'honeypot filled';
}

/* The client reports elapsed milliseconds it measured itself, rather than a
   timestamp, so a wrong clock on the visitor's machine cannot lock them out. */
const MIN_FILL_MS = 3000;

function checkTiming(body, minMs) {
  const raw = body && body.elapsed_ms;
  if (raw === undefined || raw === null || raw === '') return 'no timing';
  const ms = Number(raw);
  if (!Number.isFinite(ms) || ms < 0) return 'bad timing';
  return ms < (minMs || MIN_FILL_MS) ? 'too fast' : null;
}

function clientIp(req) {
  const h = (req && req.headers) || {};
  const fwd = h['x-forwarded-for'] || h['X-Forwarded-For'] || '';
  const first = String(fwd).split(',')[0].trim();
  return first || h['x-real-ip'] || (req && req.socket && req.socket.remoteAddress) || 'unknown';
}

/* ---------- rate limiting ----------

   Two layers, because neither is sufficient alone.

   In-memory is per warm instance, so it catches the common case (one source
   hammering one region) instantly and for free, and survives Supabase being
   unreachable. It does not see across instances and dies with the instance.

   Supabase is shared, so it sees the whole picture, and needs the table in
   supabase/2026-09-07-rate-limits.sql. Until that migration is applied this
   layer no-ops with a warning, and the in-memory layer still works. */

const memory = new Map();

function memoryHits(key, windowMs, now) {
  const cutoff = now - windowMs;
  const hits = (memory.get(key) || []).filter((t) => t > cutoff);
  hits.push(now);
  memory.set(key, hits);
  // Keep the map from growing without bound on a long-lived instance.
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (!v.length || v[v.length - 1] < cutoff) memory.delete(k);
      if (memory.size <= 4000) break;
    }
  }
  return hits.length;
}

const sbConfigured = () =>
  !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function supabaseHits(key, windowMs, now) {
  if (!sbConfigured()) return null;
  const since = new Date(now - windowMs).toISOString();
  const headers = {
    'Content-Type': 'application/json',
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  };
  const base = process.env.SUPABASE_URL;

  const ins = await fetch(`${base}/rest/v1/rate_limit_hits`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ bucket_key: key }),
  });
  // Table not migrated yet: say so once and let the in-memory layer carry it.
  if (ins.status === 404 || ins.status === 400) {
    console.warn('rate_limit_hits table missing, shared rate limiting inactive');
    return null;
  }
  if (!ins.ok) return null;

  const q = await fetch(
    `${base}/rest/v1/rate_limit_hits?bucket_key=eq.${encodeURIComponent(key)}`
      + `&created_at=gte.${encodeURIComponent(since)}&select=id`,
    { headers: { ...headers, Prefer: 'count=exact' } },
  );
  if (!q.ok) return null;
  const rows = await q.json();
  return Array.isArray(rows) ? rows.length : null;
}

async function rateLimit(req, bucket, limit, windowMs) {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();

  const mem = memoryHits(key, windowMs, now);
  if (mem > limit) return { limited: true, layer: 'memory', hits: mem };

  try {
    const shared = await supabaseHits(key, windowMs, now);
    if (shared !== null && shared > limit) return { limited: true, layer: 'shared', hits: shared };
  } catch (e) {
    console.warn('shared rate limit check failed, allowing:', e.message);
  }
  return { limited: false };
}

/* ---------- the wrapper ----------

   Returns null when the request should proceed, or a reason string when it has
   already been answered. Callers return immediately on a non-null result.

   The response is deliberately vague and slightly wrong: a refused bot is told
   the same thing a real error would say, so probing does not reveal which
   guard fired. The specific reason goes to the log, not the body. */
async function guard(req, res, opts) {
  const o = opts || {};
  const label = o.bucket || 'endpoint';

  if (o.origin !== false) {
    const bad = checkOrigin(req);
    if (bad) {
      console.warn(`guard[${label}]: ${bad} from ${clientIp(req)}`);
      res.status(403).json({ error: 'request rejected' });
      return bad;
    }
  }

  if (o.form) {
    const body = req.body || {};
    const hp = checkHoneypot(body);
    if (hp) {
      console.warn(`guard[${label}]: ${hp} from ${clientIp(req)}`);
      // 200 rather than 4xx: a bot that fills a honeypot should believe it
      // succeeded and move on, rather than learn the field is a trap.
      res.status(200).json({ ok: true });
      return hp;
    }
    const t = checkTiming(body, o.minFillMs);
    if (t) {
      console.warn(`guard[${label}]: ${t} from ${clientIp(req)}`);
      res.status(429).json({ error: 'too fast, please try again' });
      return t;
    }
  }

  if (o.limit) {
    let r;
    try {
      r = await rateLimit(req, label, o.limit, o.windowMs || 60000);
    } catch (e) {
      console.warn(`guard[${label}]: rate limit errored, allowing:`, e.message);
      return null;
    }
    if (r.limited) {
      console.warn(`guard[${label}]: rate limited (${r.layer}, ${r.hits}) from ${clientIp(req)}`);
      res.setHeader('Retry-After', Math.ceil((o.windowMs || 60000) / 1000));
      res.status(429).json({ error: 'too many requests, please wait a moment' });
      return 'rate limited';
    }
  }

  return null;
}

module.exports = {
  guard,
  checkOrigin,
  checkHoneypot,
  checkTiming,
  rateLimit,
  clientIp,
  hostAllowed,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
};
