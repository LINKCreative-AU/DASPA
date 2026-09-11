// Seven-day retention sweep on unpaid claims. Runs daily on Vercel cron.
//
//   GET /api/claims-sweep            redact everything due
//   GET /api/claims-sweep?dry=1      report what it would do, change nothing
//
// The form writes to Supabase at submit, before payment, so an abandoned
// form-fill leaves a tax file number, a passport number, a date of birth and
// bank details for somebody who never became a client. This is what stops
// those accumulating. Window and reasoning: supabase/2026-09-11-unpaid-retention.sql
//
// FAILS CLOSED, unlike every other guard on this site. Everything else here
// fails open so a broken check never stops a real customer ordering. This one
// destroys data, so the failure directions are reversed: no CRON_SECRET set
// means it refuses to run at all.
//
// Note what that fixes. api/cron-nudge.js guards with `if (cronSecret && ...)`,
// so clearing the variable there does not lock the endpoint, it REMOVES the
// lock. On an endpoint that only sends email that is survivable. On this one
// it would hand anybody a button that wipes fields off live claims.
//
// SAFE TO RUN TWICE, which is not optional. Vercel documents that cron
// delivery is best effort and "can also occasionally invoke the same scheduled
// run more than once", so a job that is not idempotent will eventually do its
// work twice. Here that is free: `redacted_at is null` is in both the select
// filter and the conditional PATCH, so a second delivery finds nothing to do.
// https://vercel.com/docs/cron-jobs/manage-cron-jobs
//
// A missed run is equally harmless. The filter asks "older than seven days"
// rather than "became seven days old yesterday", so the next run catches up on
// anything a skipped one left behind.
//
// Env: CRON_SECRET (required), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Vercel sends the secret as an Authorization header automatically; nothing
// needs to construct it.

'use strict';

const db = require('./_lib/supabase');

// Days an unpaid claim keeps its sensitive fields. See the migration for why
// seven and not three: a Checkout Session expires inside 24 hours and Stripe
// retries webhooks for up to three days, so seven clears both with margin.
const RETAIN_DAYS = 7;

/* The fields cleared. Must stay in step with the list in the migration.
   Everything here is either a government identifier, a bank account, a date of
   birth or a home address. What is NOT here is deliberate: name, email, phone,
   passport country, visa and the timestamps stay, so conversion reporting
   survives and an abandoned-cart follow-up is still possible. */
const REDACT = {
  tfn: null,
  passport_number: null,
  date_of_birth: null,
  bank_type: null,
  bank_account_name: null,
  bank_name: null,
  bank_swift: null,
  bank_bsb: null,
  bank_account_number: null,
  address_line: null,
  address_city: null,
  address_region: null,
  address_postcode: null,
  address_country: null,
  client_ip: null,
};

/* A ceiling on one run. If the cutoff were ever computed wrong, the filter
   would match far more than a day's worth of abandoned forms, and this is what
   stops a bad date wiping the table before anyone noticed. Hitting the cap is
   reported, not silently truncated. */
const MAX_PER_RUN = 200;

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  /* Trimmed: a trailing newline in the Vercel variable would lock Vercel's own
     cron out of its own endpoint, and the only symptom would be the sweep
     quietly never running. Same trap as the webhook secret. */
  const secret = String(process.env.CRON_SECRET || '').trim();
  if (!secret) {
    console.error('claims-sweep: CRON_SECRET is not set, refusing to run. '
      + 'This endpoint destroys data, so an absent secret closes it rather than opening it.');
    return res.status(503).json({ error: 'not configured' });
  }
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const dry = String((req.query && req.query.dry) || '') === '1';
  const cutoff = new Date(Date.now() - RETAIN_DAYS * 86400000).toISOString();

  /* Every precondition is in the filter, not in JavaScript, so a paid claim
     cannot be reached even by a bug in this file:
       payment_status=eq.unpaid   never a paid or refunded claim
       paid_at=is.null            belt and braces on the same thing
       redacted_at=is.null        once only, so a re-run is a no-op
       created_at=lt.<cutoff>     older than the window */
  const filter = 'payment_status=eq.unpaid'
    + '&paid_at=is.null'
    + '&redacted_at=is.null'
    + `&created_at=lt.${encodeURIComponent(cutoff)}`;

  try {
    const due = await db.selectClaims(
      `${filter}&select=id,order_number,created_at,payment_status,paid_at&order=created_at.asc&limit=${MAX_PER_RUN}`
    );
    const rows = Array.isArray(due) ? due : [];

    if (dry) {
      return res.status(200).json({
        dry_run: true,
        retain_days: RETAIN_DAYS,
        cutoff,
        found: rows.length,
        capped: rows.length === MAX_PER_RUN,
        would_clear: Object.keys(REDACT),
        claims: rows.map((r) => ({ order_number: r.order_number, created_at: r.created_at })),
      });
    }

    let redacted = 0;
    const now = new Date().toISOString();
    for (const row of rows) {
      /* Re-asserted per row rather than trusted from the query above. The two
         checks cost nothing and the thing they prevent is unrecoverable: a
         paid client's bank details cleared off a claim we still have to lodge. */
      if (row.payment_status !== 'unpaid' || row.paid_at) {
        console.error(`claims-sweep: refusing ${row.order_number}, it is ${row.payment_status}`);
        continue;
      }
      /* Conditional PATCH on the same preconditions, so a payment that lands
         between the select and this write loses the race and keeps its data.
         Zero rows back means exactly that, and is not an error. */
      const changed = await db.patchClaims(
        `id=eq.${encodeURIComponent(row.id)}&payment_status=eq.unpaid&paid_at=is.null&redacted_at=is.null`,
        { ...REDACT, redacted_at: now }
      );
      if (Array.isArray(changed) && changed.length) {
        redacted++;
        await db.insertAudit(row.id, 'redacted_unpaid', `unpaid for ${RETAIN_DAYS} days`);
      } else {
        console.warn(`claims-sweep: ${row.order_number} changed under us, left alone`);
      }
    }

    if (redacted) {
      console.warn(`claims-sweep: redacted ${redacted} unpaid claim(s) older than ${RETAIN_DAYS} days`);
    }
    return res.status(200).json({
      retain_days: RETAIN_DAYS,
      cutoff,
      found: rows.length,
      redacted,
      capped: rows.length === MAX_PER_RUN,
    });
  } catch (e) {
    console.error('claims-sweep failed:', e.message);
    return res.status(500).json({ error: 'sweep failed' });
  }
};
