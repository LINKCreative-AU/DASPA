// Thin Supabase PostgREST client using the service-role key (server only, // bypasses RLS; never expose this key to a page). Env: SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY.

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers(extra) {
  return {
    'Content-Type': 'application/json',
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    ...extra,
  };
}

async function getClaim(id) {
  const r = await fetch(`${BASE}/rest/v1/claims?id=eq.${encodeURIComponent(id)}&limit=1`, {
    headers: headers(),
  });
  if (!r.ok) throw new Error(`supabase select failed: ${r.status}`);
  const rows = await r.json();
  return rows[0] || null;
}

async function updateClaim(id, patch) {
  const r = await fetch(`${BASE}/rest/v1/claims?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`supabase update failed: ${r.status} ${await r.text()}`);
  const rows = await r.json();
  return rows[0] || null;
}

/* Conditional update: patches every claim matching an arbitrary PostgREST
   filter and returns the rows it actually changed.

   This is how a race is settled without a lock. Put the precondition in the
   filter (`verification_status=neq.verified`) rather than reading first and
   writing second, and PostgREST tells you how many rows you claimed. Zero rows
   means somebody else got there first, so the caller knows not to send the
   email twice. Ported from the pattern in abnassist-site.

   updateClaim above is the unconditional version and stays for callers that
   genuinely just want to write. */
async function patchClaims(query, patch) {
  const r = await fetch(`${BASE}/rest/v1/claims?${query}`, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`supabase conditional update failed: ${r.status} ${await r.text()}`);
  return r.json();
}

/* The claim a Stripe charge belongs to.

   Refund and dispute events carry a charge, whose only usable link back to us
   is its payment_intent, so this is how those events find their claim. Returns
   null rather than throwing on no match: a charge on this account that is not
   one of our claims is a normal thing, not a fault. */
async function getClaimByPaymentIntent(pi) {
  if (!pi) return null;
  const rows = await selectClaims(
    `stripe_payment_intent_id=eq.${encodeURIComponent(pi)}&limit=1`
  );
  return (Array.isArray(rows) && rows[0]) || null;
}

async function selectClaims(query) {
  const r = await fetch(`${BASE}/rest/v1/claims?${query}`, { headers: headers() });
  if (!r.ok) throw new Error(`supabase select failed: ${r.status}`);
  return r.json();
}

// claim_status changes are audited by a DB trigger (see supabase/schema.sql);
// use this for extra events worth a paper trail (webhooks received, emails sent).
async function insertAudit(claimId, event, detail) {
  await fetch(`${BASE}/rest/v1/claim_audit_log`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify({ claim_id: claimId, event, detail: detail || null }),
  }).catch(() => {});
}

/* "Has this already happened to this claim?" The audit log is the only
   append-only record we have, so it doubles as the once-only marker for events
   that have no column of their own. Returns false on any failure, which means
   a broken read sends a duplicate notification rather than swallowing the
   first one: telling the team twice is recoverable, never telling them is not. */
async function hasAudit(claimId, event) {
  if (!claimId || !event) return false;
  try {
    const r = await fetch(
      `${BASE}/rest/v1/claim_audit_log?claim_id=eq.${encodeURIComponent(claimId)}`
      + `&event=eq.${encodeURIComponent(event)}&select=id&limit=1`,
      { headers: headers() },
    );
    if (!r.ok) return false;
    const rows = await r.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

module.exports = {
  getClaim, getClaimByPaymentIntent, updateClaim, patchClaims, selectClaims,
  insertAudit, hasAudit,
};
