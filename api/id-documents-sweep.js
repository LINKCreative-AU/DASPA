/* GET /api/id-documents-sweep   (Vercel cron, daily)

   Deletes ID documents that nothing else is going to delete.

   PORTED FROM abnassist-site/api/id-documents-sweep.js on 5 November 2026,
   with the manual ID upload. DASPA differences: the claims table instead of
   abn_orders, and an upload here is only ever accepted for a paid claim, so
   case 1 below is rarer than on ABN Assist (it is a claim whose pointer could
   not be written), but the sweep handles both the same way.

   /id-verification takes government photo ID into a private bucket and
   _lib/identity-verified.js destroys each submission the moment its claim is
   confirmed verified. That covers the case where everything goes to plan, and
   only that case. Two others are left, and both end with a driver licence
   sitting in storage indefinitely:

     1. THE SUBMISSION MATCHED NO ORDER. api/id-document.js links an upload to a
        paid order by order number, or by email address when the number is not
        given. Neither always works. Somebody pays with one address and uploads
        from another, mistypes the order number, uploads before the order exists,
        or is not a customer at all. There is nothing to hang a deletion on, so
        the team email tells the reviewer to remove those by hand, and this is
        what happens when nobody does.

     2. THE ORDER NEVER GETS VERIFIED. Not "we never got round to it": the
        verification is what the customer is waiting on, so somebody chases it.
        The real case is the customer going quiet. They upload a licence that is
        expired or unreadable, we ask for another, and they never reply, or they
        ask for a refund, or they simply stop. id_verified_at stays null forever,
        the delete-on-verify trigger never fires, and holding their ID is the one
        thing we should not be doing while they have walked away.

   So this sweeps by AGE, which is the one thing every submission has. Anything
   older than the window goes, verified or not, matched or not.

   THE WINDOW IS A JUDGEMENT, not a rule: 30 days. Long enough that a document
   is never destroyed while a check is realistically still moving, short enough
   that a licence is not sitting in a bucket months after the person forgot they
   sent it. The cost of it being too short is asking a customer for a fresh
   photo; the cost of it being too long is holding identity documents nobody is
   using. The first is an inconvenience, the second is the risk the TPB warns
   about.

   WHAT SURVIVES, as everywhere else in this feature: the images go,
   submission.json stays with the deletion stamped on it. What has to be kept is
   the record that a check happened, not the photographs.

   Safe to run twice, and safe to miss a run. Vercel's cron delivery is best
   effort in both directions, so nothing here depends on having run yesterday: it
   works off the state in the bucket, and a submission already purged is skipped
   rather than re-deleted.

   Env: CRON_SECRET (required, and it fails closed without it), SUPABASE_URL,
   SUPABASE_SERVICE_ROLE_KEY. */

'use strict';

const docs = require('./_lib/id-documents');

const AGE_DAYS = 30;

/* One page of dates is 1000 days of submissions, and the list comes back oldest
   first, so a truncated page keeps exactly the folders this job is looking for. */
const PAGE = 1000;

const DATE_DIR = /^\d{4}-\d{2}-\d{2}$/;
const UUID_DIR = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

async function rest(path, opts) {
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      ...(opts && opts.headers),
    },
  });
  if (!r.ok) throw new Error(`supabase ${r.status}: ${await r.text().catch(() => '')}`);
  const text = await r.text();
  return text ? JSON.parse(text) : [];
}

/* Clears the order's pointer, if the order still points at what we just deleted.
   The `id_documents_path=eq.` filter is the guard: if the customer has since
   uploaded again, the row points at the newer submission and must be left alone,
   or the sweep would orphan documents that are still needed. */
async function clearOrder(claimId, prefix, at) {
  try {
    await rest(
      `claims?id=eq.${encodeURIComponent(claimId)}`
      + `&id_documents_path=eq.${encodeURIComponent(prefix)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ id_documents_path: null, id_documents_deleted_at: at }),
      },
    );
  } catch (e) {
    /* The images are gone either way, so this is bookkeeping rather than
       retention. Loud, because a row pointing at an empty folder reads like
       documents are still held. */
    console.error(`sweep: deleted ${prefix} but could not clear ${claimId}:`, e.message);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  /* Fails closed, unlike everything else on this site. The usual rule here is
     that a broken guard must never stop a customer ordering; this endpoint has
     no customer and deletes files, so an unset secret means it does not run at
     all rather than running unauthenticated.

     TRIMMED, and ABN Assist's lib/email.js explains why at length: environment variables get
     pasted, and pasting carries passengers. A trailing newline, a leading space
     or a byte order mark picked up from a document all survive into the stored
     value, all are invisible in the Vercel dashboard, and any of them makes this
     comparison fail forever while both sides look identical to a human. That
     exact thing cost time here once already, on RESEND_API_KEY in August. Vercel
     builds the header from the same stored value, so trimming both sides keeps a
     padded secret working rather than 401ing every night in silence. */
  const clean = (v) => String(v == null ? '' : v).replace(/^\uFEFF/, '').trim();

  const secret = clean(process.env.CRON_SECRET);
  if (!secret) {
    console.error('sweep: CRON_SECRET is not set, refusing to run');
    return res.status(401).json({ error: 'unauthorised' });
  }

  const offered = clean(req.headers.authorization);
  if (offered !== `Bearer ${secret}`) {
    /* Says enough to diagnose a refusal and nothing that helps defeat it.
       Lengths and shape only, never the values: a length mismatch is a wrong or
       truncated secret, an equal length that still fails is a different string,
       and "no header" is a caller that forgot it. This is the log line to read
       when a manual curl comes back unauthorised. */
    console.warn(
      'sweep: unauthorised.'
      + ` Configured secret ${secret.length} chars.`
      + (offered
        ? ` Offered header ${offered.length} chars, ${offered.startsWith('Bearer ') ? 'with' : 'WITHOUT'} the "Bearer " prefix.`
        : ' No Authorization header was sent.')
    );
    return res.status(401).json({ error: 'unauthorised' });
  }
  if (!docs.configured()) {
    console.error('sweep: Supabase not configured');
    return res.status(500).json({ error: 'internal error' });
  }

  /* ?dry=1 reports what it would delete and deletes nothing. Worth having for
     the first run against real data, and for answering "what is in there" later
     without opening the dashboard. */
  const dry = String((req.query && req.query.dry) || '') === '1';

  const cutoff = new Date(Date.now() - AGE_DAYS * 86400000).toISOString().slice(0, 10);
  const report = { cutoff, dry, submissions: 0, purged: 0, documents: 0, skipped: 0, failed: 0 };

  try {
    const dates = (await docs.list('', { limit: PAGE }))
      .filter((o) => o.folder && DATE_DIR.test(o.name) && o.name < cutoff);

    for (const date of dates) {
      const subs = (await docs.list(`${date.name}/`, { limit: PAGE }))
        .filter((o) => o.folder && UUID_DIR.test(o.name));

      for (const sub of subs) {
        const prefix = `${date.name}/${sub.name}`;
        report.submissions++;

        /* Read the record first. It says whether this one has already been
           purged, which is the common case on a bucket that keeps its records
           forever, and it is where the matched order id lives. */
        let record = null;
        try { record = await docs.getJson(`${prefix}/${docs.RECORD}`); }
        catch (e) { console.warn(`sweep: could not read the record for ${prefix}:`, e.message); }

        if (record && record.documents_deleted_at) { report.skipped++; continue; }
        if (dry) { report.purged++; continue; }

        let result;
        try {
          result = await docs.purge(prefix);
        } catch (e) {
          report.failed++;
          console.error(`sweep: could not purge ${prefix}:`, e.message);
          continue;
        }

        if (!result.deleted) { report.skipped++; continue; }
        report.purged++;
        report.documents += result.deleted;

        if (record && record.claim_id) {
          await clearOrder(record.claim_id, prefix, result.at);
        }
      }
    }
  } catch (e) {
    console.error('sweep: failed', e);
    return res.status(500).json({ error: 'internal error', report });
  }

  /* One line per run, whether or not it did anything. A retention job that goes
     quiet is indistinguishable from one that is working until somebody looks in
     the bucket. */
  console.log(`sweep: ${JSON.stringify(report)}`);
  return res.status(200).json(report);
};
