-- GST-free treatment, the $150 price, and the amount actually paid.
--
-- James and Chris confirmed the position on 11 September 2026: the DASPA fee
-- is a GST-free export under item 2 of s38-190(1). A DASP cannot be paid until
-- the claimant has left Australia and their visa has ceased, and the ATO
-- enforces that against Home Affairs at lodgement, so the recipient cannot be
-- in Australia when the thing supplied is done. Reasoning in
-- docs/gst-position.md. The price moves to $150 with no GST component.
--
-- Three changes, and the third is the one that matters most.
--
-- Run in the Supabase SQL editor. Safe to run twice.

-- ------------------------------------------------------- 0. right database?
--
-- There are two Supabase projects with confusingly similar names, and this ran
-- against the wrong one on the first attempt: "Online Services Platform"
-- (makuifpcxwrwdhwaettc) holds the portal and marketing-reporting tables and
-- has no claims table, so the first statement failed with a bare
-- 42P01 relation does not exist, which says nothing about what to do next.
--
-- DASPA is "Online Services Combined", ufsnmrqenedpyqyviwne, the project
-- hardcoded in claim.html and set as SUPABASE_URL in Vercel.
do $$
begin
  if to_regclass('public.claims') is null then
    raise exception
      'Wrong Supabase project. This migration belongs to DASPA: "Online Services Combined" (ufsnmrqenedpyqyviwne). There is no public.claims table here, so nothing has been changed. Switch project in the breadcrumb and run it again.';
  end if;
end $$;

-- ------------------------------------------------- 1. what was actually paid
--
-- The invoice was building its figures from config.FEE_CENTS, which is the
-- price TODAY. That was survivable only while the price had never moved. The
-- moment it does, regenerating an old invoice restates it at the new price and
-- the document disagrees with the customer's card statement.
--
-- An invoice records a sale that happened. It has to be built from what was
-- charged, so the amount is stored on the claim from the Stripe session.
alter table public.claims
  add column if not exists amount_paid_cents integer
  check (amount_paid_cents is null or amount_paid_cents >= 0);

comment on column public.claims.amount_paid_cents is
  'What Stripe actually charged, from checkout.session.completed amount_total. '
  'The invoice is built from this, never from the current price. Null on rows '
  'that predate the column; the invoice falls back to config.FEE_CENTS for '
  'those, which is correct only because they all paid the old price.';

-- Every claim paid before today paid $163.90 including GST. Recorded now,
-- while that is still knowable without reading Stripe.
update public.claims
   set amount_paid_cents = 16390
 where payment_status in ('paid', 'refunded')
   and amount_paid_cents is null;

-- ------------------------------------------------------- 2. the new default
--
-- gst_treatment stays correctable per claim, and the historical rows keep the
-- 'taxable' they were invoiced under. Only the default for new claims moves.
create or replace function public.claims_set_gst_treatment()
returns trigger language plpgsql as $$
begin
  /* Only fills a gap, so a correction entered by the team survives. */
  if new.gst_treatment is null then
    /* GST-free is now the position for every claim, not an inference from a
       declaration. in_australia_declared is no longer collected: the form
       question came off when the treatment stopped depending on the answer.
       A row that still carries a declaration keeps it as evidence and is not
       treated differently. */
    new.gst_treatment := 'gst_free';
  end if;
  return new;
end $$;

-- The trigger no longer needs to fire on in_australia_declared, but leaving it
-- listed costs nothing and keeps the trigger working if that column is ever
-- written again by hand.
drop trigger if exists claims_gst_treatment on public.claims;
create trigger claims_gst_treatment
  before insert or update of in_australia_declared, gst_treatment
  on public.claims
  for each row execute function public.claims_set_gst_treatment();

-- ------------------------------------------------ 3. the anon column grant
--
-- Restated in full, for the reason recorded in the GST migration: a grant on
-- one column REPLACES the list rather than extending it, and the claim form
-- dies for every customer if this is written as a delta.
--
-- Two changes from the previous list. in_australia_declared comes off, because
-- the form no longer asks. amount_paid_cents is deliberately NOT added: it is
-- written server-side from Stripe, and a browser that could set what it paid
-- could issue itself an invoice for any amount.
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
grant usage on sequence public.claim_order_seq to anon;

-- ------------------------------------------------------------------ 4. check
select gst_treatment,
       count(*)                                        as claims,
       count(*) filter (where amount_paid_cents is not null) as with_amount,
       min(amount_paid_cents), max(amount_paid_cents)
  from public.claims
 group by 1 order by 1;
