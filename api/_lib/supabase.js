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

module.exports = { getClaim, updateClaim, selectClaims, insertAudit };
