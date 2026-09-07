-- Shared rate limiting for the public API endpoints.
-- Ported from abnassist-site/supabase/2026-08-16-rate-limits.sql.
--
-- api/_lib/guard.js keeps an in-memory count per warm instance, which is instant and
-- free but blind to other instances. This table is the shared view. Until it
-- exists the guard logs a warning once and falls back to in-memory only, so
-- applying this migration is an upgrade rather than a prerequisite.
--
-- Safe to re-run.

create table if not exists public.rate_limit_hits (
  id bigserial primary key,
  bucket_key text not null,          -- "<endpoint>:<ip>"
  created_at timestamptz not null default now()
);

-- The only query the guard makes is "how many hits for this key since T", so
-- the index carries both columns in that order.
create index if not exists rate_limit_hits_key_time
  on public.rate_limit_hits (bucket_key, created_at desc);

-- Service role only. The browser must never read or write this: the anon key is
-- public, and a table anyone can insert into is not a rate limit.
alter table public.rate_limit_hits enable row level security;

-- No policies are created deliberately. With RLS on and no policy, anon and
-- authenticated get nothing, while the service role bypasses RLS entirely,
-- which is exactly the access the guard needs and nothing more.

comment on table public.rate_limit_hits is
  'One row per guarded request. Written by api/_lib/guard.js with the service role. Prune with the job below.';

-- Rows are only ever read within a short window, so anything older than a day
-- is dead weight. Run this on a schedule, or by hand now and then; nothing
-- breaks if it is skipped, the table just grows.
--
--   delete from public.rate_limit_hits where created_at < now() - interval '1 day';
--
-- With pg_cron available:
--   select cron.schedule('prune-rate-limit-hits', '17 3 * * *',
--     $$delete from public.rate_limit_hits where created_at < now() - interval '1 day'$$);
--
-- Not yet scheduled on the DASPA project. Do it when the migration is applied.

-- ---------------------------------------------------------------------------
-- Checking it worked
--
-- One query rather than four, because the SQL editor shows only the last
-- statement's result when several are run together, and three of these
-- returning nothing visible looks identical to three of them failing.
--
--   select
--     to_regclass('public.rate_limit_hits') as table_exists,
--     (select relrowsecurity from pg_class
--        where oid = 'public.rate_limit_hits'::regclass) as rls_enabled,
--     (select count(*) from pg_policies
--        where schemaname = 'public' and tablename = 'rate_limit_hits') as policy_count,
--     (select count(*) from pg_indexes
--        where schemaname = 'public' and tablename = 'rate_limit_hits') as index_count;
--
-- Wanted: rate_limit_hits / true / 0 / 2. The zero is correct and deliberate:
-- with RLS on and no policy, anon gets nothing while the service role bypasses
-- RLS entirely, which is the only access the guard needs. The two indexes are
-- the primary key and rate_limit_hits_key_time.
--
-- Then, from outside, with the anon key from claim.html:
--
--   insert -> 401, "violates row-level security policy"
--   select -> 200 and an empty array
--
-- The second is the locked-down answer, not a failure. RLS filters rows on a
-- select rather than rejecting the query. Verify both ways after applying this.
