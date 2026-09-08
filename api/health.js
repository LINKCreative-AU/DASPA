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
//   /api/health?deep=1&send=1  additionally SENDS ONE REAL EMAIL to OPS_EMAIL.
//                            The only conclusive proof that mail leaves this
//                            site, because a sending-scoped Resend key is
//                            refused by every read endpoint. Opt-in for that
//                            reason: it is the one check with an effect.
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
    'PAYMENTS_LIVE', 'LODGEMENT_LIVE',
  ];
  for (const name of watched) {
    const v = process.env[name];
    if (!v) continue;
    const why = [];
    if (/^\uFEFF/.test(v)) why.push('starts with a byte order mark');
    if (/[\u200B-\u200D\u2060]/.test(v)) why.push('contains a zero-width character');
    if (v !== v.trim()) why.push('has leading or trailing whitespace');
    /* The two flags are compared against the exact string 'true', so anything
       else is off. Called out by name because "True" or "1" reads as on to a
       human and as off to the code, and for PAYMENTS_LIVE the consequence of
       that gap is a shop that looks open in the dashboard and is shut. */
    if ((name === 'PAYMENTS_LIVE' || name === 'LODGEMENT_LIVE')
        && v.trim() !== 'true' && v.trim() !== 'false') {
      why.push(`is "${v.trim().slice(0, 12)}", which is neither "true" nor "false", `
        + 'so it counts as false. Only the exact lower-case string "true" turns this on');
    }
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
    if (r.status === 401 || r.status === 403) {
      /* Not necessarily a bad key. Resend keys carry a permission, and a
         "Sending access" key cannot list domains at all, which is the correct
         scope for this site: it only ever sends. So this endpoint is unusable
         with the key we want to be holding, and reporting a flat failure here
         would be the check crying wolf about a correct configuration.

         A wrong key gives the same status, so this cannot be resolved from
         here. Say what it means and where to settle it. */
      return {
        checked: true, ok: false, error: `resend ${r.status}`,
        means: 'Either this key is Sending access, which cannot list domains and is the '
          + 'right scope for this site, or the key is wrong. Check the key\'s permission in '
          + 'the Resend dashboard. If it says Sending access, this line is expected and the '
          + 'sending domain has to be confirmed verified there instead. The real proof is a '
          + 'test claim: if the client email arrives, sending works.',
      };
    }
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

// The only check that actually proves email works.
//
// resendDomains() above cannot settle it: a Sending-access key -- the correct
// scope for this site -- is refused by /domains, and a wrong key is refused
// identically, so 401 means nothing either way. Every other credential here can
// be proven with a read. Sending cannot. Resend has no dry run and no
// permissions endpoint; posting a message is the only call a sending key is
// allowed to make, so the only way to learn whether mail leaves this site is to
// make mail leave this site.
//
// So this is opt-in, ?deep=1&send=1, and never runs on a plain deep check. It
// sends one real message to OPS_EMAIL, which we own, and says nothing about the
// claim flow -- nobody outside gets mail from a health check.
//
// Worth the intrusion because it is on the critical path. Verification can work
// perfectly and a client still hears nothing, which is the failure this site
// already had once: a payment taken, no email, no next step, and no signal
// anywhere that anything was wrong.
async function resendSend() {
  const key = String(process.env.RESEND_API_KEY || '').replace(/^\uFEFF/, '').trim();
  if (!key) return { checked: false, reason: 'no api key' };

  const from = String(process.env.EMAIL_FROM || '').trim();
  const to = String(process.env.OPS_EMAIL || '').trim();
  if (!from) return { checked: false, reason: 'EMAIL_FROM not set' };
  if (!to) {
    // Deliberately not falling back to a hardcoded address. A test send has to
    // go somewhere we chose on purpose.
    return { checked: false, reason: 'OPS_EMAIL not set, nowhere safe to send' };
  }

  const stamp = new Date().toISOString();
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `DASPA health check ${stamp}`,
        text: 'Sent by /api/health?deep=1&send=1 to prove the Resend key can send.\n\n'
          + `From: ${from}\nSent: ${stamp}\n\n`
          + 'If you are reading this, email works. No client received it.',
      }),
    });

    const body = await r.json().catch(() => ({}));
    if (r.ok && body && body.id) {
      return {
        checked: true, ok: true, accepted: true, from, to,
        note: 'Resend ACCEPTED the message. That proves the key can send and the '
          + 'from-domain is verified. It does not prove delivery: check the '
          + 'inbox, and if it is not there check Resend\'s Emails log for a '
          + 'bounce before assuming this endpoint lied.',
      };
    }

    /* Resend puts the useful part in the message, and it is safe to surface:
       it names the domain or the address, never the key. */
    const msg = (body && (body.message || (body.error && body.error.message))) || '';
    const out = { checked: true, ok: false, error: `resend ${r.status}`, from, to };
    if (msg) out.resend_says = String(msg).slice(0, 300);

    if (r.status === 401) {
      out.means = 'The key is wrong, revoked, or belongs to another Resend account. A '
        + 'Sending-access key is REFUSED BY /domains BUT ALLOWED HERE, so unlike the '
        + 'resend block above, this status is conclusive: fix the key.';
      out.fix = 'Resend dashboard, API Keys: create a key with Sending access, put it in '
        + 'RESEND_API_KEY on the scope you are testing, then REDEPLOY. Vercel resolves '
        + 'variables when a deployment is created, so the running build still holds the old one.';
    } else if (r.status === 403 || /domain/i.test(msg)) {
      /* Resend returns 403 for a key that may not send from this address, which
         in practice means the from-domain is not verified on the account. Kept
         apart from 401 because the fix is in a different dashboard screen. */
      out.means = 'The key is accepted but it may not send from this address, which almost '
        + 'always means the from-domain is not verified on this account. That is the '
        + 'silent failure this check exists to catch.';
      out.fix = 'Resend dashboard, Domains: add and verify the domain in EMAIL_FROM, then retry.';
    } else if (r.status === 422) {
      out.means = 'Resend rejected the message itself, not the key. Usually EMAIL_FROM is not '
        + 'a valid address or its domain is not on this account.';
    } else if (r.status === 429) {
      out.means = 'Rate limited, not misconfigured. Retry in a moment.';
    }
    return out;
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
    if (r.status === 403) {
      /* The key authenticated and was refused this endpoint. Stripe answers a
         bad key with 401, so a 403 here is proof the key is GOOD and simply has
         no Account read permission, which is exactly what a restricted key
         built from the one-time-payments template looks like. Reporting that as
         a failure would push somebody toward widening a key that is correctly
         scoped. Not ok:false. */
      return {
        checked: true, ok: true, mode, kind,
        account_details: 'not readable with this key, which is expected for a restricted key. '
          + 'Stripe answers an invalid key with 401, so a 403 confirms the key is valid.',
      };
    }
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
    const expected = String(process.env.HEALTH_KEY || '').trim();
    if (!expected || String(key).trim() !== expected) return res.status(404).end();
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
      /* First thing to check if orders stop arriving. Absent means CLOSED
         (see api/_lib/config.js), so a deployment created without the variable
         shuts checkout with no other symptom. */
      PAYMENTS_LIVE: config.PAYMENTS_LIVE,
      checkout: config.PAYMENTS_LIVE
        ? 'OPEN, taking real payments'
        : 'CLOSED, /api/create-checkout refuses and claim.html hides the button',
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

    /* Separate flag, not part of deep, because this one has an effect in the
       world: it puts a message in an inbox. Everything else above only reads. */
    if (req.query.send) out.deep.resend_send = await resendSend();
    else out.deep.resend_send = { checked: false, reason: 'add &send=1 to send one real test email to OPS_EMAIL' };
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(out);
};
