-- DASPA — Supabase schema. Run once in the Supabase SQL editor.
-- One claims table + an append-only audit log. The team works the queue from
-- the Supabase dashboard for now (no admin UI in this phase).

-- ---------------------------------------------------------------- enum
create type claim_status as enum (
  'new',
  'paid',
  'verification_pending',
  'ready_for_lodgement',
  'needs_review',
  'lodged',
  'paid_out',
  'on_hold'
);

-- ---------------------------------------------------------------- claims
create table public.claims (
  id uuid primary key,                -- generated client-side (RLS is insert-only, so the browser can't read the row back)
  created_at timestamptz not null default now(),

  -- about the client
  full_name text not null,
  date_of_birth date not null,
  email text not null,
  phone text not null,

  -- passport & visa
  passport_number text not null,
  passport_country text not null,
  visa_subclass text not null,
  date_departed date,
  visa_status text check (visa_status in ('expired','cancelled','active','unsure')),

  -- tax & super
  tfn text,                           -- optional; collected under taxation law
  fund_unknown boolean not null default false,
  fund_name text,
  fund_member_number text,

  -- payout account
  bank_type text check (bank_type in ('australian','international')),
  bank_account_name text,
  bank_name text,
  bank_swift text,
  bank_bsb text,
  bank_account_number text,

  -- current overseas address
  address_line text,
  address_city text,
  address_region text,
  address_postcode text,
  address_country text,

  -- consents (timestamps captured at submission)
  authority_accepted_at timestamptz,  -- written authority appointing ARO Pty Ltd (RTA 26076969)
  didit_consent_at timestamptz,       -- Didit biometric verification consent

  -- workflow
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  paid_at timestamptz,
  stripe_session_id text,
  verification_status text not null default 'not_started' check (verification_status in ('not_started','pending','verified','needs_review')),
  didit_session_id text,
  claim_status claim_status not null default 'new',

  -- email bookkeeping (cron dispatcher)
  nudge_email_sent_at timestamptz,
  lodged_email_sent_at timestamptz,

  -- team scratch space (dashboard)
  internal_notes text
);

-- ---------------------------------------------------------------- audit log
create table public.claim_audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  claim_id uuid references public.claims(id),
  event text not null,
  detail text
);

-- status changes append to the audit log automatically
create or replace function public.log_claim_status_change()
returns trigger language plpgsql security definer as $$
begin
  if (tg_op = 'UPDATE' and new.claim_status is distinct from old.claim_status) then
    insert into public.claim_audit_log (claim_id, event, detail)
    values (new.id, 'status_change', old.claim_status || ' → ' || new.claim_status);
  elsif (tg_op = 'INSERT') then
    insert into public.claim_audit_log (claim_id, event, detail)
    values (new.id, 'claim_created', new.email);
  end if;
  return new;
end $$;

create trigger claims_status_audit
  after insert or update on public.claims
  for each row execute function public.log_claim_status_change();

-- ---------------------------------------------------------------- RLS
-- The site's anon key may INSERT a claim and do nothing else — no select,
-- update or delete. The serverless functions use the service-role key, which
-- bypasses RLS. The audit log is not writable or readable by anon at all.
alter table public.claims enable row level security;
alter table public.claim_audit_log enable row level security;

create policy "anon can insert claims"
  on public.claims for insert
  to anon
  with check (true);

-- (no select/update/delete policies for anon or authenticated: denied by default)
