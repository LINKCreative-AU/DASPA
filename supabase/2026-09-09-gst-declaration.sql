-- DASPA -- record where the client is, so the invoice can state the GST treatment.
--
-- WHY THIS EXISTS
--
-- GST-free export treatment for a service supplied to a non-resident turns on
-- where the RECIPIENT is, not on where the work is performed (GST Act s38-190,
-- items 2 and 3; read with GSTR 2004/7 on the meaning of "not in Australia").
-- Every DASPA client is a departing or departed temporary resident, so the
-- question is live on most orders and the invoice has to state the answer:
-- "the extent to which each sale is a taxable sale" is one of the seven things
-- the ATO requires on a tax invoice under $1,000.
--
-- THE PRICE DOES NOT CHANGE
--
-- Everyone pays $163.90. The declaration decides what the invoice SAYS and what
-- ARO REMITS, not what the client is charged. That is the whole reason this is
-- safe to ask: if answering "I am overseas" saved the client $14.90, some would
-- answer that way regardless, and ARO carries the GST liability for a wrong
-- answer, not the client. With one price the client gains nothing by
-- misdeclaring, so the answer is usable evidence instead of a discount code.
--
-- A DECLARATION IS NOT A CONCLUSION
--
-- gst_treatment is a stored column set from the declaration by the trigger
-- below, deliberately NOT a generated column, so the team can correct a single
-- claim without fighting the database. It needs to be correctable because the
-- statutory test asks where the client is when the supply is DONE, and a claim
-- paid from Bondi may well be lodged weeks after that person has flown home.
-- Nobody has documented a position on that timing yet. Until they do, the
-- declaration is the best available fact, and the column is where a better one
-- goes.

-- --------------------------------------------------------------- 1. the facts
alter table public.claims
  add column if not exists in_australia_declared boolean;

comment on column public.claims.in_australia_declared is
  'The client''s own answer to "are you currently in Australia" at submission. '
  'Null on claims predating 9 September 2026. Does not affect the price.';

-- What Vercel's edge saw, as a two-letter ISO 3166-1 code from
-- x-vercel-ip-country. Evidence, never an override: VPNs, mobile carriers
-- routing through other countries and Australian SIMs roaming overseas all
-- produce a wrong answer, and a client is better placed than a header to know
-- which country they are standing in.
alter table public.claims
  add column if not exists edge_country text;

comment on column public.claims.edge_country is
  'Two-letter country Vercel''s edge attributed to the checkout request. '
  'Corroboration for in_australia_declared, not a substitute for it.';

-- Kept because a Stripe dispute asks for it, and because it is the only way to
-- tell two submissions from one person apart after the fact.
alter table public.claims
  add column if not exists client_ip text;

-- ---------------------------------------------------------- 2. the conclusion
alter table public.claims
  add column if not exists gst_treatment text
  check (gst_treatment in ('taxable', 'gst_free'));

comment on column public.claims.gst_treatment is
  'What the invoice states. Set from in_australia_declared by '
  'claims_set_gst_treatment, and overridable by hand for one claim when the '
  'team has a better fact than the declaration.';

-- ------------------------------------------------------------- 3. the mismatch
-- Generated, because unlike the treatment this is arithmetic on two facts and
-- there is no legitimate reason to hand-edit it.
--
-- The two directions are NOT symmetrical, which is why this is not a plain
-- "they disagree" flag:
--   declared overseas + edge says AU  -> we would remit NO GST on a sale that
--                                        may be taxable. Under-remitting is the
--                                        ATO's problem to find and ours to pay.
--   declared in AU + edge says abroad -> we remit GST that may not have been
--                                        payable. Costs margin, upsets nobody.
-- Both are flagged so the accounting position can be reviewed either way, but
-- the first is the one to chase.
alter table public.claims
  drop column if exists gst_review_required;
alter table public.claims
  add column gst_review_required boolean
  generated always as (
    in_australia_declared is not null
    and edge_country is not null
    and (in_australia_declared <> (upper(edge_country) = 'AU'))
  ) stored;

comment on column public.claims.gst_review_required is
  'True when the declaration and the edge country disagree. The direction that '
  'matters is declared-overseas with an AU edge, because that is the one where '
  'no GST gets remitted on a sale that might be taxable.';

-- ---------------------------------------------------- 4. keep them consistent
create or replace function public.claims_set_gst_treatment()
returns trigger language plpgsql as $$
begin
  /* Only fills a gap. An explicit value survives, so a correction entered by
     the team is not silently reverted the next time the row is touched. */
  if new.gst_treatment is null then
    if new.in_australia_declared is true then
      new.gst_treatment := 'taxable';
    elsif new.in_australia_declared is false then
      new.gst_treatment := 'gst_free';
    else
      /* No declaration: taxable. Every page on the site advertises
         "$163.90 inc. GST", so taxable is what the client was told and the
         conservative direction if the position is ever revisited. */
      new.gst_treatment := 'taxable';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists claims_gst_treatment on public.claims;
create trigger claims_gst_treatment
  before insert or update of in_australia_declared, gst_treatment
  on public.claims
  for each row execute function public.claims_set_gst_treatment();

-- ------------------------------------------------------------- 5. backfill
-- Existing claims, the four paid ones included, were charged and told
-- "$163.90 inc. GST". Their invoices must say the same.
update public.claims
set gst_treatment = 'taxable'
where gst_treatment is null;

alter table public.claims
  alter column gst_treatment set not null;

-- -------------------------------------------- 6. what the form may now write
-- Requires 2026-09-09-order-numbers.sql to have run first, because that is
-- where order_number and its sequence come from. Fail here rather than leave a
-- half-migrated table behind.
do $$
begin
  /* Checks the SEQUENCE, not the order_number column. The column is declared in
     schema.sql, so it exists on any fresh install whether or not the migration
     has run, and guarding on it passed while the sequence was still missing.
     The sequence is what the grant at the end of this file needs, so it is the
     thing worth checking. */
  if not exists (
    select 1 from pg_sequences
    where schemaname = 'public' and sequencename = 'claim_order_seq'
  ) then
    raise exception 'Run supabase/2026-09-09-order-numbers.sql first: it creates claim_order_seq, which the anon grant at the end of this file needs.';
  end if;
end $$;

-- The FULL allowlist is restated, not extended by one column.
--
-- Found by testing this out of order: "grant insert (in_australia_declared)" on
-- its own does not add to a table-level grant, it becomes the only column anon
-- may write, and the claim form dies for every customer. Restating the whole
-- list makes this file self-sufficient and idempotent, so it cannot depend on
-- what some earlier migration happened to leave behind.
--
-- in_australia_declared is the one new entry. The other three columns added
-- above are written server-side and stay out of anon's reach on purpose: a
-- browser that could tell us which country the edge saw would make the
-- corroboration worthless.
revoke insert on public.claims from anon;
grant insert (
  id, created_at,
  full_name, date_of_birth, email, phone,
  passport_number, passport_country, visa_subclass, date_departed, visa_status,
  tfn, fund_unknown, fund_name, fund_member_number,
  bank_type, bank_account_name, bank_name, bank_swift, bank_bsb, bank_account_number,
  address_line, address_city, address_region, address_postcode, address_country,
  authority_accepted_at, identity_consent_at,
  in_australia_declared
) on public.claims to anon;
grant usage on sequence public.claim_order_seq to anon;

-- ------------------------------------------------------------------ 7. check
select gst_treatment, count(*), count(*) filter (where gst_review_required) as flagged
from public.claims group by 1 order by 1;
