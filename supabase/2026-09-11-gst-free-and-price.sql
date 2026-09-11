-- GST-free treatment, the $150 price, and the amount actually paid.
--
-- James and Chris confirmed the position on 11 September 2026: the DASPA fee
-- is a GST-free export under item 2 of s38-190(1). A DASP cannot be paid until
-- the claimant has left Australia and their visa has ceased, and the ATO
-- enforces that against Home Affairs at lodgement, so the recipient cannot be
-- in Australia when the thing supplied is done. docs/gst-position.md.
--
-- SELF-SUFFICIENT ON PURPOSE. It does not assume any earlier migration ran.
-- The first version of this file did, and died on a column that
-- 2026-09-09-gst-declaration.sql was supposed to have added but never had,
-- because nobody had a reliable record of what production actually carried.
-- Every column it needs is created here if missing, every grant is restated
-- in full, and everything that depends on an object existing is guarded. Run
-- it on a database at any point in the migration history and it converges.
--
-- Run in the Supabase SQL editor. Safe to run twice.

-- ------------------------------------------------------- 0. right database?
--
-- Two Supabase projects with similar names. DASPA is "Online Services
-- Combined" (ufsnmrqenedpyqyviwne), the project hardcoded in claim.html and
-- set as SUPABASE_URL in Vercel. "Online Services Platform"
-- (makuifpcxwrwdhwaettc) holds the portal and marketing tables and has no
-- claims table, so running this there fails with a bare 42P01 that says
-- nothing about what to do next.
do $$
begin
  if to_regclass('public.claims') is null then
    raise exception
      'Wrong Supabase project. This belongs to DASPA: "Online Services Combined" (ufsnmrqenedpyqyviwne). No public.claims here, nothing changed. Switch project and run again.';
  end if;
end $$;

-- --------------------------------------------- 1. columns this file depends on
--
-- Adding rather than assuming. Each of these belongs to an earlier migration;
-- if that one ran, these are no-ops.

-- from 2026-09-09-gst-declaration.sql
alter table public.claims
  add column if not exists in_australia_declared boolean,
  add column if not exists edge_country text,
  add column if not exists client_ip text,
  add column if not exists gst_treatment text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.claims'::regclass and conname = 'claims_gst_treatment_check'
  ) then
    alter table public.claims
      add constraint claims_gst_treatment_check
      check (gst_treatment in ('taxable', 'gst_free'));
  end if;
end $$;

-- new here: what Stripe actually charged
alter table public.claims
  add column if not exists amount_paid_cents integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.claims'::regclass and conname = 'claims_amount_paid_cents_check'
  ) then
    alter table public.claims
      add constraint claims_amount_paid_cents_check
      check (amount_paid_cents is null or amount_paid_cents >= 0);
  end if;
end $$;

comment on column public.claims.amount_paid_cents is
  'What Stripe actually charged, from checkout.session.completed amount_total. '
  'The invoice is built from this, never from the current price, so a price '
  'change cannot restate a document already issued. Null on rows predating the '
  'column; the invoice falls back to config.FEE_CENTS for those.';

comment on column public.claims.gst_treatment is
  'What the invoice states. GST-free for every sale from 11 September 2026 '
  '(docs/gst-position.md). Overridable by hand for one claim.';

-- --------------------------------------------------- 2. what was already paid
--
-- Every claim paid before today paid $163.90 including GST. Recorded now,
-- while that is still knowable without reading Stripe, and the invoice for
-- those has to keep reproducing the document that was actually sent.
update public.claims
   set amount_paid_cents = 16390
 where payment_status in ('paid', 'refunded')
   and amount_paid_cents is null;

update public.claims
   set gst_treatment = 'taxable'
 where payment_status in ('paid', 'refunded')
   and gst_treatment is null;

-- ------------------------------------------------------- 3. the new default
--
-- Only the default for new claims moves. A correction entered by the team
-- survives, and the historical rows keep the 'taxable' set above.
create or replace function public.claims_set_gst_treatment()
returns trigger language plpgsql as $$
begin
  if new.gst_treatment is null then
    /* GST-free is now the position for every claim, not an inference from a
       declaration. in_australia_declared is no longer collected: the form
       question came off when the treatment stopped depending on the answer.
       A row that still carries one keeps it as evidence and is not treated
       differently. */
    new.gst_treatment := 'gst_free';
  end if;
  return new;
end $$;

drop trigger if exists claims_gst_treatment on public.claims;
create trigger claims_gst_treatment
  before insert or update of in_australia_declared, gst_treatment
  on public.claims
  for each row execute function public.claims_set_gst_treatment();

-- Backfill anything the trigger has not seen, then hold the invariant.
update public.claims set gst_treatment = 'gst_free' where gst_treatment is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'claims'
       and column_name = 'gst_treatment' and is_nullable = 'YES'
  ) then
    alter table public.claims alter column gst_treatment set not null;
  end if;
end $$;

-- ------------------------------------------------ 4. the anon column grant
--
-- Restated in full. A grant on one column REPLACES the list rather than
-- extending it, and the claim form dies for every customer if this is written
-- as a delta. Found the hard way on 9 September.
--
-- in_australia_declared is off the list: the form no longer asks.
-- amount_paid_cents is deliberately NOT on it: written server-side from
-- Stripe, and a browser that could set what it paid could invoice itself any
-- amount. Same for edge_country, client_ip, gst_treatment and every
-- payment or verification column.
revoke insert on public.claims from anon;
grant insert (
  id, created_at,
  full_name, date_of_birth, email, phone,
  passport_number, passport_country, visa_subclass, date_departed, visa_status,
  tfn, fund_unknown, fund_name, fund_member_number,
  bank_type, bank_account_name, bank_name, bank_swift, bank_bsb, bank_account_number,
  address_line, address_city, address_region, address_postcode, address_country,
  authority_accepted_at, identity_consent_at
) on public.claims to anon;

-- The order-number sequence belongs to 2026-09-09-order-numbers.sql. If that
-- has not run, the column default that calls it does not exist either, so
-- there is nothing to grant and nothing is broken by skipping it. Guarded
-- rather than assumed, because granting on a missing sequence aborts the
-- whole script and leaves the form without its INSERT grant.
do $$
begin
  if to_regclass('public.claim_order_seq') is not null then
    execute 'grant usage on sequence public.claim_order_seq to anon';
  else
    raise warning 'claim_order_seq is missing, so 2026-09-09-order-numbers.sql has not been applied. Claims will insert without an order number, and an invoice cannot be built without one. Apply that migration next.';
  end if;
end $$;

-- ------------------------------------------------------------------ 5. check
select gst_treatment,
       count(*)                                             as claims,
       count(*) filter (where amount_paid_cents is not null) as with_amount,
       min(amount_paid_cents)                                as min_paid,
       max(amount_paid_cents)                                as max_paid
  from public.claims
 group by 1
 order by 1;
