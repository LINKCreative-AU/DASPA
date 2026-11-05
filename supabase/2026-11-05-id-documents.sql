-- The manual ID upload's link to the claim it belongs to, and the record that
-- the documents were destroyed.
--
-- /id-verification takes passport photos into the private `id-documents-daspa`
-- storage bucket, for clients whose Stripe Identity check will not complete and
-- for those Stripe is not allowed to verify at all (China, Hong Kong, Macau and
-- Russia). The team downloads them and runs the check by hand in Stripe. When
-- Stripe marks that check verified, the same webhook fires as for a check the
-- client did themselves, _lib/identity-verified.js records it, and the images
-- are deleted there and then. These columns are what lets it find them.
--
-- Ported from abnassist-site/supabase/2026-08-25-id-documents.sql, 5 November
-- 2026.
--
-- WHY A PATH AND NOT A BOOLEAN. The bucket is keyed by a dated uuid, not by
-- order number, so the claim has to carry where its documents actually are. It
-- doubles as the "documents waiting on review" flag, which is what the partial
-- index is for.
--
-- WHY THE PATH IS CLEARED AND THE TIMESTAMPS ARE NOT. id_documents_path is the
-- live pointer and goes to null when the images are destroyed; the other two are
-- the record of the identity check, and they survive it. What has to be kept is
-- that a check was done and when the documents were destroyed, not photographs
-- of a passport. Holding copies of client ID raises the practice's own identity
-- theft exposure; confirm the retention reading against TPB(GS) 42/2022.
--
-- Service-role only. None of these is on anon's INSERT grant, and must not be:
-- they are written by api/id-document.js, never by the browser.
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
  add column if not exists id_documents_path text,
  add column if not exists id_documents_at timestamptz,
  add column if not exists id_documents_deleted_at timestamptz;

create index if not exists claims_id_documents_pending_idx
  on public.claims (id_documents_at desc)
  where id_documents_path is not null;

comment on column public.claims.id_documents_path is
  'Prefix in the private id-documents-daspa bucket while manually uploaded ID is still held, e.g. 2026-11-05/<uuid>. Null once the images are destroyed. Not null means somebody still has to run the check.';
comment on column public.claims.id_documents_at is
  'When the client uploaded ID documents through /id-verification. Kept after the images are destroyed, as the record of the identity check.';
comment on column public.claims.id_documents_deleted_at is
  'When those images were destroyed: by _lib/identity-verified.js once the claim is verified, or by the 30-day sweep.';
