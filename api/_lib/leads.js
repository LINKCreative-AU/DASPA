// LINK Leads push. Files under api/_lib are not deployed as functions.
//
// LINK Leads (leads.link.com.au) is the group's central lead desk. It is a
// different question from the Online Services portal: the portal is where the
// registration office team WORKS a claim, reading this project's `claims` table
// directly with a service-role key, and the lead desk is where the group sees
// what marketing is producing across every site at once. Both are wanted, and
// neither replaces the other. Nothing here writes to Supabase.
//
// WHAT IS SENT, AND WHAT IS DELIBERATELY NOT. The lead desk is a sales tool
// with broad staff access across the whole LINK group. So it gets the enquiry
// and the shape of the claim — visa subclass, passport country, whether the
// fund is known — and never the identity documents. No tax file number, no
// passport number, no bank account, BSB, IBAN or SWIFT, no date of birth, no
// street address. Same call as `lib/activecampaign.js` on the ABN Assist site,
// for the same reason: those exist so a claim can be lodged, and lodgement
// happens in the portal, against Supabase, by the people cleared to see them.
// Adding a field here is one line, and it should be a decision rather than a
// default.
//
// Env: LEADS_INGEST_KEY (the daspa half of LEADS_INGEST_KEYS over there),
// LEADS_INGEST_URL (optional; defaults to production).
// Unset means skipped with a log line — the same fail-open shape as Resend and
// the invoice call. Losing a lead-desk copy must never cost a claim, and this
// runs inside the checkout call and the Stripe webhook, where a throw would.

const config = require('./config');

// Env values arrive pasted, and a byte order mark or a stray newline in a key
// is invisible in a dashboard and fatal at the Authorization header.
const cleanEnv = (name) => String(process.env[name] || '').replace(/^\uFEFF/, '').trim();

const ENDPOINT = () => cleanEnv('LEADS_INGEST_URL') || 'https://leads.link.com.au/api/ingest';
const KEY = () => cleanEnv('LEADS_INGEST_KEY');

async function push(body, what) {
  const key = KEY();
  if (!key) {
    console.warn('LEADS_INGEST_KEY not set, LINK Leads push skipped for', what);
    return { skipped: 'not configured' };
  }
  try {
    /* Bounded, because this call sits inside the customer's path to Stripe.
       Everything else in that path has to happen; this one is a copy for a
       sales dashboard. A lead desk that stops answering must cost three
       seconds and a log line, not a checkout. */
    const r = await fetch(ENDPOINT(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ site: 'daspa', ...body }),
      signal: AbortSignal.timeout(3000),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`${r.status} ${out.error || ''}`.trim());
    return out;
  } catch (e) {
    console.error(`LINK Leads push failed for ${what} (continuing):`, e.message);
    return { error: e.message };
  }
}

/* The claim as submitted. `context` is the attribution the browser read at the
   moment of submit and posted to /api/create-checkout — the query string and
   the referrer are both gone by the time any later request runs, so anything
   not carried from there is not recoverable afterwards. */
function claimSubmitted(claim, context) {
  const c = context || {};
  return push({
    form: 'dasp-claim',
    external_id: claim.id,
    name: claim.full_name,
    email: claim.email,
    phone: claim.phone,
    message: `DASP claim submitted, awaiting payment${claim.visa_subclass ? ` · visa ${claim.visa_subclass}` : ''}`,
    details: {
      visa_subclass: claim.visa_subclass || null,
      visa_status: claim.visa_status || null,
      passport_country: claim.passport_country || null,
      date_departed: claim.date_departed || null,
      fund_known: !claim.fund_unknown,
      fund_name: claim.fund_unknown ? null : (claim.fund_name || null),
      bank_type: claim.bank_type || null,
      country_now: claim.address_country || null,
      fee_cents: config.FEE_CENTS,
      // The Online Services portal's own tracker session, so the visitor
      // journey can be found where it actually lives. Not `session_id`: that
      // column joins to LINK Leads' own usage_events, and this site carries
      // registrationoffice.com.au/t.js rather than leads.link.com.au/t.js, so
      // filling it in would point at rows that do not exist.
      ro_session_id: c.ro_session_id || null,
    },
    page_url: c.page_url || null,
    referrer: c.referrer || null,
    utm: {
      source: c.utm_source || null, medium: c.utm_medium || null,
      campaign: c.utm_campaign || null, term: c.utm_term || null, content: c.utm_content || null,
    },
    session_id: c.session_id || null,
  }, `claim ${claim.id}`);
}

/* Payment confirmed. Updates the lead the submission created rather than
   making a second one — see external_id in LINK Leads' api/ingest.js. Carries
   almost nothing on purpose: the lead already has the application. */
function claimPaid(claim, amountCents) {
  const cents = Number.isFinite(Number(amountCents)) ? Number(amountCents) : config.FEE_CENTS;
  return push({
    form: 'dasp-claim',
    external_id: claim.id,
    email: claim.email,
    name: claim.full_name,
    value_cents: cents,
    note: `Payment received — $${(cents / 100).toFixed(2)}`,
  }, `payment for claim ${claim.id}`);
}

module.exports = { claimSubmitted, claimPaid, push };
