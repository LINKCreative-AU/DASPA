-- The fields the ATO's DASP intermediary system asks for and the claim form
-- did not collect.
--
-- WHY
--
-- The first claim keyed into the ATO's online intermediary system on
-- 4 November 2026 (DASP00020151) stopped on screens the form had never asked
-- about:
--
--   * Most recent Australian postal address. Required on the ATO's contact
--     screen (line 1, state, postcode). We had no column for it, so the team
--     had to go back to the client for it.
--   * Previous Australian address and other names. Optional on the same
--     screen, and both help the fund match the applicant to their account.
--   * A second overseas address line (unit, apartment). The ATO has one. We
--     had a single street line, so "Appartement 701" had nowhere to go.
--   * Whether the client has EVER held a Working Holiday (417) or Work and
--     Holiday (462) visa. The ATO's visa screen reports Home Affairs' answer
--     to that question, across the client's whole visa history, not only the
--     last visa. The form's visa dropdown records one visa, so a client who
--     arrived on a 417 and left on a 482 says "482" and the team cannot tell
--     whether Home Affairs' "never held a WHM visa" is right. If it is wrong
--     the ATO says do not submit: the fund sets the tax rate from that answer
--     (65% for WHM, 35% otherwise on the taxed element), and lodging on visa
--     information we know to be wrong is a reasonable-care problem for a
--     registered tax agent.
--   * Employers and employment dates. The fund search screen asks for them,
--     and says not to apply to a fund the applicant gave no information about.
--     That bites hardest on "I don't know my fund", the most common answer,
--     where employer history is the only thing the client can tell us.
--   * For international money transfer: the bank's address and the currency
--     the client wants to be paid in. Both on the ATO's IMT section.
--
-- Additive only. Every new column is nullable, so rows that predate the form
-- change are untouched and nothing downstream has to cope with a new NOT NULL.
-- The form makes the Australian address and the WHM question required; the
-- database does not, for the same reason.
--
-- ORDER MATTERS. Run this BEFORE deploying the claim.html that sends these
-- fields. PostgREST refuses an insert naming a column that does not exist, or
-- one anon has no INSERT grant on, and the form would fail for every client.
-- The current claim.html does not name any of them, so running this first is
-- safe against the live form.
--
-- Run in the Supabase SQL editor. Safe to run twice.

-- ------------------------------------------------------- 0. right database?
do $$
begin
  if to_regclass('public.claims') is null then
    raise exception
      'Wrong Supabase project. This belongs to DASPA: "Online Services Combined" (ufsnmrqenedpyqyviwne). No public.claims here, nothing changed. Switch project and run again.';
  end if;
end $$;

-- ------------------------------------------------------------- 1. columns
alter table public.claims
  add column if not exists whm_ever_held text,
  add column if not exists other_names text,
  add column if not exists address_line2 text,
  add column if not exists au_address_line text,
  add column if not exists au_address_suburb text,
  add column if not exists au_address_state text,
  add column if not exists au_address_postcode text,
  add column if not exists au_prev_address_line text,
  add column if not exists au_prev_address_suburb text,
  add column if not exists au_prev_address_state text,
  add column if not exists au_prev_address_postcode text,
  add column if not exists employment_history text,
  add column if not exists bank_address text,
  add column if not exists bank_currency text;

alter table public.claims drop constraint if exists claims_whm_ever_held_check;
alter table public.claims
  add constraint claims_whm_ever_held_check
  check (whm_ever_held in ('yes', 'no', 'unsure'));

alter table public.claims drop constraint if exists claims_au_address_state_check;
alter table public.claims
  add constraint claims_au_address_state_check
  check (au_address_state in ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'));

alter table public.claims drop constraint if exists claims_au_prev_address_state_check;
alter table public.claims
  add constraint claims_au_prev_address_state_check
  check (au_prev_address_state in ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'));

comment on column public.claims.whm_ever_held is
  'The client''s own answer to "have you ever held a 417 or 462 visa", across '
  'their whole visa history. Compare with the ATO visa screen, which reports '
  'Home Affairs'' answer to the same question. If they disagree, do not '
  'submit: email DASPmail@ato.gov.au.';
comment on column public.claims.au_address_line is
  'Most recent Australian postal address, line 1. Required by the ATO DASP '
  'contact screen together with state and postcode.';
comment on column public.claims.employment_history is
  'Free text from the client: employers in Australia with rough dates. What '
  'the ATO fund search screen asks for, and the only fund evidence a client '
  'who does not know their fund can give.';

-- ------------------------------------------------------ 2. the INSERT grant
-- Restated in full. A grant on one column REPLACES the list rather than
-- extending it, and the claim form dies for every customer if this is written
-- as a delta. Found the hard way on 9 September. The list below is the one from
-- 2026-09-11-gst-free-and-price.sql with the new columns appended; every
-- payment, verification and server-side column stays off it.
revoke insert on public.claims from anon;
grant insert (
  id, created_at,
  full_name, date_of_birth, email, phone,
  passport_number, passport_country, visa_subclass, date_departed, visa_status,
  tfn, fund_unknown, fund_name, fund_member_number,
  bank_type, bank_account_name, bank_name, bank_swift, bank_bsb, bank_account_number,
  address_line, address_city, address_region, address_postcode, address_country,
  authority_accepted_at, identity_consent_at,
  whm_ever_held, other_names, address_line2,
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

-- ------------------------------------------------------------------ 3. check
-- Expect 42 columns, the 28 from before plus the 14 above.
select count(*) as anon_insert_columns
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'claims'
  and grantee = 'anon' and privilege_type = 'INSERT';
