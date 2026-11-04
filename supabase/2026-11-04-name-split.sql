-- Given names and family name, as separate fields.
--
-- The ATO's DASP application asks for them separately, and splitting a single
-- "full name" afterwards is guesswork: is "Maria del Carmen Ruiz Lopez" two
-- given names and two family names, or one and three? Only the client knows,
-- so the claim form now asks for each, as printed in the passport.
--
-- full_name is NOT replaced. The form still writes it (given names then family
-- name, joined with a space) because the invoice, every email and the team
-- alert read it, and older claims only have it.
--
-- given_names is nullable on purpose: some passports carry a single name, and
-- the form tells those clients to put it under family name.
--
-- Additive. Run BEFORE deploying the claim.html that sends these fields, for
-- the same reason as 2026-11-04-ato-lodgement-fields.sql: PostgREST refuses an
-- insert naming a column that does not exist or that anon may not write.
--
-- Run in the Supabase SQL editor. Safe to run twice.

do $$
begin
  if to_regclass('public.claims') is null then
    raise exception
      'Wrong Supabase project. This belongs to DASPA: "Online Services Combined" (ufsnmrqenedpyqyviwne). No public.claims here, nothing changed. Switch project and run again.';
  end if;
end $$;

alter table public.claims
  add column if not exists given_names text,
  add column if not exists family_name text;

comment on column public.claims.given_names is
  'Given names exactly as in the passport. Null when the passport shows one '
  'name only, which is then in family_name.';
comment on column public.claims.family_name is
  'Family name exactly as in the passport. Null on claims made before '
  '4 November 2026, which only have full_name.';

-- Restated in full: a column grant REPLACES the list. This is the list from
-- 2026-11-04-ato-lodgement-fields.sql plus given_names and family_name.
revoke insert on public.claims from anon;
grant insert (
  id, created_at,
  full_name, given_names, family_name, date_of_birth, email, phone,
  passport_number, passport_country, visa_subclass, date_departed, visa_status,
  tfn, fund_unknown, fund_name, fund_member_number,
  bank_type, bank_account_name, bank_name, bank_swift, bank_bsb, bank_account_number,
  address_line, address_city, address_region, address_postcode, address_country,
  authority_accepted_at, identity_consent_at,
  whm_ever_held, other_visas, other_names, address_line2,
  au_address_line, au_address_suburb, au_address_state, au_address_postcode,
  au_prev_address_line, au_prev_address_suburb, au_prev_address_state, au_prev_address_postcode,
  employment_history, bank_address, bank_currency
) on public.claims to anon;

do $$
begin
  if to_regclass('public.claim_order_seq') is not null then
    execute 'grant usage on sequence public.claim_order_seq to anon';
  end if;
end $$;

-- Expect 45: the 43 from before plus these two.
select count(*) as anon_insert_columns
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'claims'
  and grantee = 'anon' and privilege_type = 'INSERT';
