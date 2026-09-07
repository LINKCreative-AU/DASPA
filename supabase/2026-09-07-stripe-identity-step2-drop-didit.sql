-- Step 2 of the Stripe Identity move. DO NOT RUN until:
--   1. supabase/2026-09-07-stripe-identity.sql has been run, and
--   2. the front end that sends identity_consent_at is deployed to
--      daspa.com.au (not just to a preview), and
--   3. a real claim has been submitted through the live form and the row shows
--      identity_consent_at populated.
--
-- Until then the deployed claim.html may still be sending didit_consent_at, and
-- dropping the column 400s that insert: the client sees "something went wrong
-- sending your form" and nothing is saved.
--
-- Check before running. with_identity_consent should equal claims:
--   select count(*) as claims, count(identity_consent_at) as with_identity_consent
--   from public.claims;

alter table public.claims drop column if exists didit_consent_at;
alter table public.claims drop column if exists didit_session_id;

select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'claims'
  and column_name like 'didit%';
-- Expect zero rows.
