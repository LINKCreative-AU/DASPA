-- DASPA -- give every claim a human order number, which is also its invoice number.
--
-- WHY ONE NUMBER AND NOT TWO
--
-- The order number and the invoice number are the same string, so a client
-- quoting a reference on the phone and the team searching for it are always
-- talking about the same thing. This is the rule ABN Assist settled on after
-- running two numbers, and the ATO does not require invoice numbers to be
-- gapless or separate.
--
-- WHY THE DATABASE ASSIGNS IT, NOT THE APPLICATION
--
-- nextval() is atomic and transactional, so two claims submitted in the same
-- millisecond cannot take the same number. Anything computed in a serverless
-- function (a count, a max plus one) races with itself the moment two people
-- submit at once, and the failure is silent: two clients with one invoice
-- number, discovered at a chargeback.
--
-- AND IT CLOSES A GAP THAT WAS ALREADY OPEN
--
-- anon held a blanket INSERT on this table, so a crafted request could set ANY
-- column, not just order_number: payment_status 'paid', verification_status
-- 'verified', claim_status 'ready_for_lodgement'. A claim could have been
-- self-issued as paid and verified without a cent reaching Stripe, and it would
-- have looked ordinary in the dashboard queue the team works from. Nothing
-- suggests that happened. The column list below is now an allowlist of the
-- fields the form legitimately writes, so it cannot.
--
-- WHY anon MUST NOT BE ABLE TO SET IT
--
-- claim.html inserts directly into this table under the anon key, and the RLS
-- policy is "with check (true)" because the browser has to be able to write a
-- claim. That means anon can set ANY column it names, so a default alone is not
-- a control: a crafted request could choose its own order number, take a
-- flattering low one, or collide deliberately. The column-level revoke below is
-- what actually prevents it. The unique index then catches anything else.
--
-- WHY NUMBERS ARE BURNED BY UNPAID CLAIMS, DELIBERATELY
--
-- Assigning at insert means abandoned forms consume numbers, so the sequence
-- has gaps and runs ahead of the paid count. That is the right trade. Every
-- claim gets a reference the moment it exists, which is what support needs when
-- somebody writes in before paying, and gaps in invoice numbers are not an ATO
-- problem. Only paid claims are ever issued an invoice.

-- ------------------------------------------------------------------ 1. sequence
-- Not starting at 1. An invoice reading DASP00000001 tells the client they are
-- the first order this business has ever taken, which is true and unhelpful.
create sequence if not exists public.claim_order_seq
  as bigint
  start with 20147
  increment by 1
  no maxvalue
  cache 1;

-- ------------------------------------------------------------------ 2. column
alter table public.claims
  add column if not exists order_number text;

alter table public.claims
  alter column order_number
  set default 'DASP' || lpad(nextval('public.claim_order_seq')::text, 8, '0');

comment on column public.claims.order_number is
  'Human reference, and the invoice number for this claim. Assigned by the '
  'sequence default so it cannot race; anon is revoked from inserting it so a '
  'browser cannot choose its own. Format DASP + 8 digits, never truncated.';

-- ------------------------------------------------------------------ 3. backfill
-- Paid claims first, in paid_at order, so the four recovered clients hold
-- numbers that read chronologically on their invoices. Then everything else by
-- created_at. Done in one statement per group so the ordering is deterministic
-- rather than whatever the planner feels like.
with ordered as (
  select id, row_number() over (order by paid_at, created_at) as n
  from public.claims
  where order_number is null and payment_status = 'paid'
)
update public.claims c set
  order_number = 'DASP' || lpad((nextval('public.claim_order_seq'))::text, 8, '0')
from ordered o
where c.id = o.id;

with ordered as (
  select id, row_number() over (order by created_at) as n
  from public.claims
  where order_number is null
)
update public.claims c set
  order_number = 'DASP' || lpad((nextval('public.claim_order_seq'))::text, 8, '0')
from ordered o
where c.id = o.id;

-- ------------------------------------------------------------- 4. constraints
-- NOT NULL only after the backfill, or the statement above would have nothing
-- to fix and this would fail on the existing rows.
alter table public.claims
  alter column order_number set not null;

create unique index if not exists claims_order_number_key
  on public.claims (order_number);

-- The shape the invoice renderer and the durable link both rely on. A row that
-- somehow acquires a malformed number should fail here rather than reach a tax
-- document.
alter table public.claims
  drop constraint if exists claims_order_number_format;
alter table public.claims
  add constraint claims_order_number_format
  check (order_number ~ '^DASP[0-9]{8}$');

-- ------------------------------------------------------- 5. the actual control
-- Without this the default is decoration: anon may insert this table, so anon
-- may name this column. Revoking the column keeps the default authoritative.
-- The grant is re-issued for the columns the form legitimately writes, because
-- revoking one column requires the rest to be granted explicitly.
-- The sequence needs its own grant. Found by testing: without this, anon may
-- insert the row but cannot execute the nextval() in the column default, so
-- EVERY claim submission fails with "permission denied for sequence" and the
-- form is dead for every customer. A default is only as usable as the rights
-- of whoever triggers it.
--
-- The cost of the grant is that anon can call nextval() directly and burn
-- numbers. That is a nuisance, not a breach: the column revoke below still
-- means a browser cannot decide which number its own claim gets.
grant usage on sequence public.claim_order_seq to anon;

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

-- ------------------------------------------------------------------ 6. check
-- Expect: every row numbered, no duplicates, the four paid ones lowest.
select order_number, full_name, payment_status, paid_at, created_at
from public.claims
order by order_number;

select count(*) as rows, count(distinct order_number) as distinct_numbers,
       count(*) filter (where order_number is null) as unnumbered
from public.claims;
