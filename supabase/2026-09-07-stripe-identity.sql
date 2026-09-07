-- Move identity verification from Didit to Stripe Identity.
-- Run in the Supabase SQL editor. Safe to re-run: every statement is guarded,
-- so a second run is a no-op rather than an error.
--
-- WHY THIS IS ADDITIVE AND NOT A RENAME. A rename looks tidier and is wrong
-- here. daspa.com.au is live and taking real orders. The deployed claim.html
-- sends didit_consent_at on every insert, and PostgREST rejects an insert
-- naming a column that does not exist with a 400. So a rename breaks the live
-- form the moment it runs, and deploying the new front end first breaks it the
-- other way round. Both columns therefore coexist until the new front end is
-- deployed and verified, and step 2 (a separate file, run later, by hand) drops
-- the old pair.
--
-- didit_session_id was never populated: the Didit credentials were never set in
-- Vercel, so /api/didit-session never reached Didit. didit_consent_at WAS
-- populated on every claim by claim.html, so its values are copied across.

-- --------------------------------------------------- step 1: add the new pair
alter table public.claims add column if not exists identity_session_id text;
alter table public.claims add column if not exists identity_consent_at timestamptz;

comment on column public.claims.identity_session_id is
  'Stripe Identity VerificationSession id (vs_...). The session URL is single-use and expires in 48h, so it is deliberately never stored.';
comment on column public.claims.identity_consent_at is
  'When the client consented to identity verification, captured at form submission.';

-- ------------------------------------------- step 1b: carry the old data over
-- Guarded on the old columns still existing, so this file stays runnable after
-- step 2 has dropped them.
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'claims'
               and column_name = 'didit_consent_at') then
    execute 'update public.claims
                set identity_consent_at = didit_consent_at
              where identity_consent_at is null
                and didit_consent_at is not null';
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'claims'
               and column_name = 'didit_session_id') then
    execute 'update public.claims
                set identity_session_id = didit_session_id
              where identity_session_id is null
                and didit_session_id is not null';
  end if;
end $$;

-- --------------------------------------------------------------- verify
-- Expect two rows. If you get none, step 1 did not apply.
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'claims'
  and column_name in ('identity_session_id', 'identity_consent_at')
order by column_name;

-- Every claim that had a consent timestamp should now have one under the new
-- name, so these two counts should match. They will keep matching only while
-- both front ends are in play; once the new one is the only one deployed, run
-- step 2.
select count(*) as claims,
       count(didit_consent_at) as with_didit_consent,
       count(identity_consent_at) as with_identity_consent
from public.claims;

-- ------------------------- step 1c: the ABN Assist identity pattern
-- Added 7 September 2026, when DASPA's identity flow was rebuilt on the shape
-- abnassist-site already runs. Both are additive and safe to re-run.
--
-- stripe_customer_id is the load-bearing one. Stripe Identity attaches a
-- verification to a customer (related_customer), and that is what lets the
-- server ask Stripe "is this person verified?" long after the fact, instead of
-- trusting a webhook that may never have arrived. api/create-checkout.js now
-- sets customer_creation:'always' so a Customer object exists to record here;
-- the three claims already paid have none, so the repair path skips them and
-- they are reconciled by hand.
alter table public.claims add column if not exists stripe_customer_id text;
alter table public.claims add column if not exists identity_verified_at timestamptz;

comment on column public.claims.stripe_customer_id is
  'Stripe Customer (cus_...) created by Checkout. Used as related_customer on the Identity session, which is what makes a missed webhook recoverable.';
comment on column public.claims.identity_verified_at is
  'When the identity check passed. Written by whichever of the webhook, a status read or the cron claimed the row first.';

-- Looked up by customer on the repair path and by the reconcile sweep.
create index if not exists claims_stripe_customer_id
  on public.claims (stripe_customer_id)
  where stripe_customer_id is not null;

-- Expect four rows.
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'claims'
  and column_name in ('identity_session_id', 'identity_consent_at',
                      'stripe_customer_id', 'identity_verified_at')
order by column_name;
