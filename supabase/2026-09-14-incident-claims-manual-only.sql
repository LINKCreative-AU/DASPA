-- The four September incident claims are handled by hand, and nothing
-- automated may email them. Also removes GST from their invoices.
--
-- WHY
--
-- Between 27 August and 8 September 2026 four clients paid with no webhook
-- destination configured. Nothing recorded the payment, no email went out, and
-- the rows were repaired afterwards by hand. The team is contacting these four
-- personally and issuing their invoices manually.
--
-- That decision has a technical consequence that is easy to miss: the site
-- would otherwise still email them, and one of those paths is live right now.
-- DASP00020151 is mid-verification. The moment that client finishes,
-- api/_lib/identity-verified.js calls email.verified() and an automated
-- "Identity verified" lands in their inbox in the middle of a conversation the
-- team is having with them by hand. Two more paths do the same thing if
-- /api/cron-nudge is ever added to the crons block: the 24-hour verification
-- nudge and the lodged email, both of which select on exactly the state these
-- claims are in.
--
-- So "we will handle them manually" is not a process note. It has to be
-- enforced in the data, because the alternative is remembering it forever.
--
-- WHAT IT DOES NOT SUPPRESS. Ops alerts still fire. The team needs to know a
-- client verified even when, especially when, the client hears nothing
-- automatic. Only the four client-facing senders are gated.
--
-- GST. On 14 September 2026 Juan confirmed no GST on the old invoices,
-- extending the position in docs/gst-position.md back over the incident sales.
-- amount_paid_cents stays 16390, because that is what was actually charged and
-- an invoice must say what was paid. The change is the treatment, so an invoice
-- generated from these rows reads INVOICE rather than TAX INVOICE and shows no
-- GST line.
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

-- ------------------------------------------------------- 1. the flag
alter table public.claims
  add column if not exists suppress_automated_email boolean not null default false;

comment on column public.claims.suppress_automated_email is
  'True means no client-facing email is sent for this claim by any automated path: payment confirmation, identity verified, verification nudge, lodged. Ops alerts are unaffected. Set on the four September 2026 incident claims, which the team contacts by hand.';

-- ------------------------------------------------------- 2. the four claims
-- Selected by what they are, not by a list of ids: paid or refunded, and
-- created before the webhook destination existed. A row that does not exist in
-- this project is simply not matched, so a re-run is a no-op.
update public.claims
   set suppress_automated_email = true
 where payment_status in ('paid', 'refunded')
   and created_at < timestamptz '2026-09-09 00:00:00+10'
   and suppress_automated_email = false;

-- ------------------------------------------------------- 3. no GST on those
update public.claims
   set gst_treatment = 'gst_free'
 where suppress_automated_email = true
   and gst_treatment is distinct from 'gst_free';

-- ------------------------------------------------------- 4. what happened
select order_number,
       payment_status,
       claim_status,
       verification_status,
       suppress_automated_email,
       gst_treatment,
       amount_paid_cents
  from public.claims
 where payment_status in ('paid', 'refunded')
 order by created_at;
