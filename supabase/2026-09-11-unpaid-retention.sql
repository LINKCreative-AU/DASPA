-- Seven-day retention on unpaid claims.
--
-- The form writes to Supabase at submit, before payment, so an abandoned
-- form-fill leaves a complete payload: tax file number, passport number, date
-- of birth, bank details and address for somebody who never became a client.
-- Nothing deleted them, and on 11 September 2026 there were eleven such rows.
--
-- WHY SEVEN DAYS, and why it is a judgement rather than a rule.
--
-- Two clocks have to run out before a row can safely be touched. A Stripe
-- Checkout Session expires within 24 hours, so nobody can pay against a link
-- attached to an older row. Stripe retries webhooks for up to three days, so a
-- checkout.session.completed delayed to the limit has still arrived by day
-- three. Seven clears both with margin. Anything under about four days starts
-- gambling on the second one.
--
-- The cost of it being too short is a returning customer filling the form
-- again. The cost of it being too long is holding strangers' tax file numbers
-- for no reason, which is what the OAIC guidance on TFN information is about.
-- The first is an inconvenience. Agreed with Juan, 11 September 2026.
--
-- REDACTION, NOT DELETION. Three independent reasons:
--   1. claim_audit_log has a foreign key to claims.id, so a delete either
--      fails or takes the audit trail with it;
--   2. deleting the row destroys the conversion numbers (four of fifteen
--      form-fills paid) permanently;
--   3. name, email and visa are exactly what an abandoned-cart follow-up
--      would need, and are a far easier privacy conversation than a TFN.
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

-- -------------------------------------------------------------- 1. the stamp
alter table public.claims
  add column if not exists redacted_at timestamptz;

comment on column public.claims.redacted_at is
  'When the seven-day sweep cleared the sensitive fields off this unpaid '
  'claim. Also the once-only marker: the sweep skips any row that has it, so '
  'a re-run is a no-op. Never set on a paid or refunded claim.';

-- ------------------------------------------ 2. make the redactable ones null
--
-- Two of the fields the sweep has to clear are NOT NULL, so redaction is
-- impossible without this. Harmless: the claim form has always sent both, and
-- api/_lib/invoice.js does not read either, so nothing downstream depends on
-- them being present. The alternative was writing a sentinel date into
-- date_of_birth, which would be a lie stored in a date column.
alter table public.claims alter column passport_number drop not null;
alter table public.claims alter column date_of_birth   drop not null;

-- ------------------------------------------------------------- 3. the index
--
-- The sweep runs daily over a growing table and its filter is three
-- predicates. Partial, because it only ever asks about unredacted unpaid rows
-- and there is no reason to index the paid ones it must never touch.
create index if not exists claims_sweep_idx
  on public.claims (created_at)
  where payment_status = 'unpaid' and redacted_at is null;

-- --------------------------------------------------------- 4. what it clears
--
-- Recorded here as the definition of record, because the endpoint and this
-- file have to agree and the endpoint is the one that runs.
--
--   tfn, passport_number, date_of_birth,
--   bank_type, bank_account_name, bank_name, bank_swift, bank_bsb,
--   bank_account_number,
--   address_line, address_city, address_region, address_postcode,
--   address_country,
--   client_ip
--
-- KEPT: full_name, email, phone, passport_country, visa_subclass,
-- visa_status, date_departed, fund_*, order_number, timestamps. Enough for
-- conversion reporting and for an abandoned-cart follow-up, and none of it is
-- a government identifier or a bank account.

-- ------------------------------------------------------------------ 5. check
select payment_status,
       count(*)                                          as claims,
       count(*) filter (where redacted_at is not null)     as redacted,
       count(*) filter (where tfn is not null)             as still_holding_tfn,
       count(*) filter (where created_at < now() - interval '7 days'
                          and payment_status = 'unpaid'
                          and redacted_at is null)         as due_for_sweep
  from public.claims
 group by 1
 order by 1;
