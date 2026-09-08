// Readiness check. Answers "is this actually configured" without anyone having
// to open the Vercel dashboard and squint at which scope a variable landed in.
//
// It reports whether each variable is SET. It never returns a value, never a
// prefix, never a length. The most it will say about a secret is true.
//
//   /api/health              what is set, in the scope serving this URL
//   /api/health?deep=1       also calls Resend, Stripe (account + Identity
//                            permission) and Supabase to prove
//                            the keys work, not just that they exist
//
// Access. Preview and development are open, because a preview deployment on
// this project sits behind Vercel Authentication already. Production answers
// only when HEALTH_KEY is set and the request carries it as ?key=, and 404s
// otherwise, so daspa.com.au never serves a configuration listing.
//
// Scope is half the point. A variable set for Production only is missing here
// on a preview URL, which is exactly the mistake this exists to catch. Vercel
// resolves variables when a deployment is created, so a change made after the
// last build shows up on the NEXT deployment, not on the one already running:
// set a variable, then redeploy, then read this.
//
// Ported from the same endpoint on abnassist-site so the two sites can be
// checked the same way before a launch.

'use strict';

const config = require('./_lib/config');
const { stripeHeaders } = require('./_lib/stripe');

const set = (name) => !!(process.env[name] && String(process.env[name]).trim());

// Which of several accepted spellings actually carries a value.
const nameOf = (...names) => names.find(set) || null;

// Values get pasted, and pasting carries passengers. A byte order mark or a
// trailing newline in an API key is invisible in the Vercel dashboard and fatal
// at the request: the Authorization header cannot be built, so the call throws
// before it is sent and the only symptom is silence. Report the shape without
// reporting the value. Found exactly this on abnassist-site in August 2026.
function malformed() {
  const bad = [];
  const watched = [
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PUBLISHABLE_KEY',
    'RESEND_API_KEY', 'EMAIL_FROM', 'OPS_EMAIL',
    'AC_API_URL', 'AC_API_KEY', 'ACTIVECAMPAIGN_API_URL', 'ACTIVECAMPAIGN_API_KEY',
    'WHATSAPP_NUMBER', 'INVOICE_SECRET', 'SITE_URL', 'CRON_SECRET', 'HEALTH_KEY',
  ];
  for (const name of watched) {
    const v = process.env[name];
    if (!v) continue;
    const why = [];
    if (/^\uFEFF/.test(v)) why.push('starts with a byte order mark');
    if (/[\u200B-\u200D\u2060]/.test(v)) why.push('contains a zero-width character');
    if (v !== v.trim()) why.push('has leading or trailing whitespace');
    if (/[\r\n]/.test(v)) why.push('contains a line break');
    if (why.length) bad.push({ name, problem: why.join(', ') });
  }
  return bad;
}

// Asks Resend which domains it will send from. This is the check that matters
// before go-live: a valid key with an unverified domain sends nothing, silently,
// and every email in this flow carries either a payment or a next step.
async function resendDomains() {
  const key = String(process.env.RESEND_API_KEY || '').replace(/^\uFEFF/, '').trim();
  if (!key) return { checked: false, reason: 'no api key' };
  try {
    const r = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return { checked: true, ok: false, error: `resend ${r.status}` };
    const body = await r.json();
    const domains = (body.data || []).map((d) => ({ name: d.name, status: d.status }));

    // The question behind the question: can the address we send FROM actually
    // send? A verified account with a DIFFERENT domain verified is still a
    // silent failure.
    const from = process.env.EMAIL_FROM || 'DASPA <hello@daspa.com.au>';
    const at = from.lastIndexOf('@');
    const sendingDomain = at === -1 ? '' : from.slice(at + 1).replace(/[>\s].*$/, '').toLowerCase();
    const match = domains.find((d) => String(d.name).toLowerCase() === sendingDomain);

    return {
      checked: true, ok: true, domains,
      sending_domain: sendingDomain,
      sending_domain_verified: !!match && match.status === 'verified',
      sending_domain_status: match ? match.status : 'not added to this Resend account',
    };
  } catch (e) {
    return { checked: true, ok: false, error: e.message };
  }
}

// Proves the Stripe key works and, more usefully, says whether it is a LIVE or
// TEST key. Shipping a test key to production takes payments that do not exist;
// shipping a live key to a preview takes real money during a test run. Neither
// is visible in the dashboard listing. No account id or business detail is
// returned, only the three facts that decide go/no-go.
async function stripeAccount() {
  const key = String(process.env.STRIPE_SECRET_KEY || '').replace(/^\uFEFF/, '').trim();
  if (!key) return { checked: false, reason: 'no secret key' };
  const mode = key.startsWith('sk_live_') || key.startsWith('rk_live_') ? 'live'
    : key.startsWith('sk_test_') || key.startsWith('rk_test_') ? 'test'
    : 'unrecognised key prefix';
  /* Restricted or standard, from the prefix alone. Reported because it is the
     one thing about this key you cannot read anywhere else without revealing
     the value: Stripe's dashboard shows which keys EXIST, not which one this
     deployment is holding. A standard sk_ works for everything here, including
     Identity, so nothing breaks, but Stripe's own guidance is to use a
     restricted key and it is worth being able to see which one is live. */
  const kind = key.startsWith('rk_') ? 'restricted'
    : key.startsWith('sk_') ? 'standard, prefer a restricted key'
    : 'unrecognised';
  try {
    const r = await fetch('https://api.stripe.com/v1/account', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!r.ok) return { checked: true, ok: false, mode, kind, error: `stripe ${r.status}` };
    const a = await r.json();
    return {
      checked: true, ok: true, mode, kind,
      charges_enabled: !!a.charges_enabled,
      country: a.country || null,
      default_currency: a.default_currency || null,
      // The fee is charged in AUD. An account defaulting to something else is
      // not fatal, but it is worth seeing before the first live order.
      currency_matches_fee: String(a.default_currency || '').toLowerCase() === config.CURRENCY,
    };
  } catch (e) {
    return { checked: true, ok: false, mode, error: e.message };
  }
}

/* Proves STRIPE_SECRET_KEY can actually create a Stripe Identity session.

   This is the one permission on the key that no other check can reach. A key
   scoped to Checkout processes every payment perfectly and fails only here, so
   the symptom in normal operation is a single 502 from /api/identity-session
   with nothing in the client's experience explaining it. A restricted key
   starts with Identity Verification Results at None, so the default state of a
   brand new key is the broken one.

   IT CLEANS UP AFTER ITSELF. The session is cancelled immediately, which per
   Stripe's API reference disables future submission attempts, so nothing is
   left behind that a person could stumble into. Creating and cancelling costs
   nothing: Stripe bills per successful verification, and this one can never be
   completed. The url and client_secret are never returned or logged.

   The cancel is best-effort. An uncancelled session expires on its own, so a
   failure there is worth reporting but is not worth failing the check over. */
async function identityWrite() {
  const key = String(process.env.STRIPE_SECRET_KEY || '').replace(/^\uFEFF/, '').trim();
  if (!key) return { checked: false, reason: 'no secret key' };
  const API = 'https://api.stripe.com/v1/identity/verification_sessions';

  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: stripeHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      body: new URLSearchParams({
        type: 'document',
        'options[document][allowed_types][0]': 'passport',
        'options[document][require_matching_selfie]': 'true',
        'metadata[health_check]': 'true',
      }).toString(),
    });
    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      const msg = (j.error && j.error.message) || `stripe ${r.status}`;
      const permissions = r.status === 403 || /permission|scope/i.test(msg);
      return {
        checked: true, ok: false, error: msg,
        /* Stripe's error body names the permission it wanted, so it is passed
           through verbatim rather than summarised. */
        fix: permissions
          ? 'Stripe, Developers, API keys, edit this key: set Identity Verification Results to Write, '
            + 'and leave both Detailed Verification Results rows at None.'
          : undefined,
      };
    }

    let cancelled = false;
    if (j.id) {
      const c = await fetch(`${API}/${encodeURIComponent(j.id)}/cancel`, {
        method: 'POST', headers: stripeHeaders(),
      }).catch(() => null);
      cancelled = !!(c && c.ok);
    }
    // Deliberately no url and no client_secret in this response.
    return { checked: true, ok: true, checks: 'passport + matching selfie', test_session_cancelled: cancelled };
  } catch (e) {
    return { checked: true, ok: false, error: e.message };
  }
}

// Proves the service-role key can actually reach the claims table. A wrong key
// or a project that never had schema.sql run reads identically from outside:
// claims insert fine from the browser and every webhook fails afterwards.
async function supabaseReach() {
  const url = String(process.env.SUPABASE_URL || '').replace(/^\uFEFF/, '').trim();
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^\uFEFF/, '').trim();
  if (!url || !key) return { checked: false, reason: 'url or service role key not set' };
  try {
    // HEAD with an exact count, so nothing personal is read back, only a number.
    const r = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/claims?select=id&limit=1`, {
      method: 'HEAD',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' },
    });
    if (!r.ok) return { checked: true, ok: false, error: `supabase ${r.status}` };
    const range = r.headers.get('content-range') || '';
    const total = range.includes('/') ? range.split('/')[1] : null;
    return { checked: true, ok: true, claims_table_reachable: true, claim_count: total };
  } catch (e) {
    return { checked: true, ok: false, error: e.message };
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const env = process.env.VERCEL_ENV || 'development';
  if (env === 'production') {
    const key = (req.query && req.query.key) || '';
    if (!process.env.HEALTH_KEY || key !== process.env.HEALTH_KEY) return res.status(404).end();
  }

  const out = {
    environment: env,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null,

    // The launch gate. Not a secret, and the one flag whose value everyone
    // needs to be able to read back: false holds every confirmation and email
    // at "in review" wording, true says we lodge directly with the ATO.
    // Stays false until the ATO accepts the DASP intermediary agreement in
    // writing (NAT 15478, clause 5.1).
    lodgement: {
      LODGEMENT_LIVE: config.LODGEMENT_LIVE,
      client_wording: config.LODGEMENT_LIVE ? 'live lodgement' : 'held at "in review"',
    },

    database: {
      SUPABASE_URL: set('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: set('SUPABASE_SERVICE_ROLE_KEY'),
    },
    stripe: {
      STRIPE_SECRET_KEY: set('STRIPE_SECRET_KEY'),
      STRIPE_WEBHOOK_SECRET: set('STRIPE_WEBHOOK_SECRET'),
      fee_charged_cents: config.FEE_CENTS,
      currency: config.CURRENCY,
    },
    // Stripe Identity rides STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, both
    // reported above, so there is no credential of its own to be missing. The
    // flow id is optional: unset means /api/identity-session falls back to
    // passport + matching selfie in code.
    // Stripe Identity rides STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, both
    // reported above, so there is no credential of its own to be missing.
    // STRIPE_PUBLISHABLE_KEY is only needed for the embedded modal: without it
    // /verify falls back to Stripe's hosted page, which still works, so it is
    // reported rather than treated as a fault.
    identity: {
      provider: 'stripe',
      checks: 'passport document + matching selfie',
      live_capture: false,          // deliberate, see api/_lib/identity.js
      modal: process.env.STRIPE_PUBLISHABLE_KEY ? 'available' : 'unavailable, /verify will redirect instead',
      STRIPE_PUBLISHABLE_KEY: set('STRIPE_PUBLISHABLE_KEY'),
      // The restricted key needs Identity Verification Results = Write. A key
      // scoped to Checkout only fails when a session is created and nowhere
      // else, so ?deep=1 exercises it rather than guessing from the prefix.
    },

    // Addresses, not booleans. EMAIL_FROM falls back to a working default in
    // _lib/email.js, so "not set" does not mean "unknown", and a bare false
    // reads as a fault when it is not one. Both are on every email that goes
    // out anyway, so there is nothing to withhold.
    email: {
      sends: set('RESEND_API_KEY'),           // the only one that stops mail dead
      RESEND_API_KEY: set('RESEND_API_KEY'),
      from: process.env.EMAIL_FROM || 'DASPA <hello@daspa.com.au>',
      from_source: set('EMAIL_FROM') ? 'EMAIL_FROM' : 'default in api/_lib/email.js',
      // Unset means every new claim, payment and verification is announced to
      // the function log and nowhere else. Nobody reads the function log.
      ops_alerts_to: process.env.OPS_EMAIL || null,
      ops_alerts: set('OPS_EMAIL') ? 'emailed' : 'FUNCTION LOG ONLY, nobody is told',
    },

    // Not wired yet. Reported so the credentials can be set and verified ahead
    // of the integration rather than during it. Both spellings are accepted on
    // abnassist-site because Vercel carries the long ones, so both are watched
    // here too.
    activecampaign: {
      wired_into_this_site: false,
      url_from: nameOf('AC_API_URL', 'ACTIVECAMPAIGN_API_URL') || 'not set under either name',
      key_from: nameOf('AC_API_KEY', 'ACTIVECAMPAIGN_API_KEY') || 'not set under either name',
      AC_FIELD_MAP: set('AC_FIELD_MAP'),
      AC_LIST_MAP: set('AC_LIST_MAP'),
    },

    contact: {
      // Every WhatsApp call to action on the site resolves through /wa. Unset
      // sends all of them to the FAQ instead. This shipped broken once already,
      // across 62 links on 29 pages, which is why /wa exists at all.
      WHATSAPP_NUMBER: set('WHATSAPP_NUMBER'),
      wa_link_target: set('WHATSAPP_NUMBER') ? 'WhatsApp' : 'FALLS BACK TO /faq',
    },

    other: {
      // Tax invoices are requested from the Registration Office portal when
      // this is set, and skipped entirely when it is not. abnassist-site has
      // moved to generating its own invoice and keeps this OFF; DASPA has not,
      // so here it must be ON or paid clients get no tax invoice.
      INVOICE_SECRET: set('INVOICE_SECRET'),
      SITE_URL: set('SITE_URL'),
      site_url_in_use: config.SITE_URL,
      // Protects /api/cron-nudge. Vercel sends it automatically once set.
      CRON_SECRET: set('CRON_SECRET'),
      // Without this, production 404s this endpoint. That is the intended
      // default, so a false here is only a problem if you wanted to read this
      // on the live domain.
      HEALTH_KEY: set('HEALTH_KEY'),
    },
  };

  const bad = malformed();
  if (bad.length) out.malformed_values = bad;

  if (req.query && req.query.deep) {
    const [resend, stripe, identity, supabase] = await Promise.all([
      resendDomains(), stripeAccount(), identityWrite(), supabaseReach(),
    ]);
    out.deep = { resend, stripe, identity, supabase };
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(out);
};
