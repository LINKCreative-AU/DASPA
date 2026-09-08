-- DASPA -- recover the four claims that were paid for but never recorded as paid.
--
-- WHAT HAPPENED
--
-- The site took payment, Stripe collected it, and nothing wrote the result back
-- to Supabase. There was no webhook destination, so checkout.session.completed
-- was never delivered and payment_status stayed 'unpaid' on every row. The
-- clients then hit /api/didit-session, which answered 402 (unpaid) against a row
-- that said unpaid while their money had in fact cleared. No email was sent, no
-- verification could start, and nothing anywhere raised a flag.
--
-- Four people, $655.60 taken:
--
--   27 Aug  7:28 pm  Stephane Dartois              $163.90
--   28 Aug 12:41 am  Taylor McDonough              $163.90
--    2 Sep 10:03 am  Khrystea Ames-Booth Myrie     $163.90
--    8 Sep  9:32 pm  Alessia Cittadini             $163.90
--
-- Scott Tuite's 2 Sep attempt was Cancelled by the bank (insufficient funds).
-- Nothing was taken and nothing is owed, so he is deliberately not in this file.
--
-- Alessia submitted the form twice, four minutes apart. BOTH rows carry a
-- stripe_session_id, because create-checkout writes it when the session is
-- created rather than when it is paid, so the later row is not identifiable by
-- timestamp. The paid row below was taken from the Checkout Session JSON's
-- client_reference_id, which names the claim Stripe actually charged for. The
-- other row (f2ee8143...) is an abandoned duplicate and must stay unpaid.
--
-- RUN THIS ONLY AFTER the branch is merged and production is verified. Marking
-- these paid makes them eligible for the verification flow, which needs to be
-- the working one, not the flow that produced this mess.
--
-- Safe to run twice. Every statement is guarded, so a second run changes zero
-- rows rather than overwriting a client who has since made progress.
--
-- Not taken on trust: this was run against a local Postgres loaded with
-- schema.sql and seeded with these rows in their current state, plus Alessia's
-- abandoned duplicate and an unrelated unpaid claim. First run touched 4 rows
-- and wrote 4 audit entries; second run touched 0 and wrote 0; the duplicate
-- and the unrelated claim stayed unpaid; and the offsets landed where they
-- should (Taylor's 28 Aug 00:41 Brisbane correctly becomes 27 Aug 14:41 UTC,
-- which is the kind of thing that goes wrong silently).

-- ------------------------------------------------------------------ 0. before
-- Read this first and keep it. It is the only record of the prior state.
select id, full_name, email, payment_status, paid_at, claim_status,
       verification_status, stripe_payment_intent_id, nudge_email_sent_at
from public.claims
where id in (
  '30c2583a-4170-48e9-acf9-c994015742bc',
  '8b02f9ce-dbf5-416a-bdc9-93fa0de479da',
  'a1df5189-90da-4297-9820-3ace21a7982a',
  '9ea18e38-fd62-4199-b437-efd93dcd5ec5'
)
order by created_at;

-- ------------------------------------------------------- 1. record the payment
--
-- paid_at is written with an explicit +10 offset so nobody has to do conversion
-- arithmetic: these are the times shown in the Stripe dashboard, which displays
-- in Brisbane time. Minute precision, straight off the payments list -- the
-- authoritative timestamp lives on the PaymentIntent, and to the hour these are
-- for is the same either way.
--
-- claim_status becomes 'verification_pending', not 'ready_for_lodgement'. They
-- have paid; they have not verified. Nothing about this fix asserts otherwise.
--
-- nudge_email_sent_at is set to now() to SUPPRESS the 6-hourly automated nudge
-- for these four specifically. They are owed an apology from a person before
-- they are chased by a cron job, and a nudge arriving first would read as the
-- system working normally when it has not been. Per-claim, so the nudge keeps
-- running for everyone else. Clear it once the apologies have gone out and you
-- want the automated follow-up to resume.

update public.claims set
  payment_status            = 'paid',
  paid_at                   = '2026-08-27 19:28+10',
  stripe_payment_intent_id  = coalesce(stripe_payment_intent_id, 'pi_3U8zbXPKEqtYM9zM0PRHTJm4'),
  claim_status              = 'verification_pending',
  nudge_email_sent_at       = coalesce(nudge_email_sent_at, now())
where id = '30c2583a-4170-48e9-acf9-c994015742bc'
  and payment_status = 'unpaid';

update public.claims set
  payment_status            = 'paid',
  paid_at                   = '2026-08-28 00:41+10',
  stripe_payment_intent_id  = coalesce(stripe_payment_intent_id, 'pi_3U94V9PKEqtYM9zM0y6uJLZJ'),
  claim_status              = 'verification_pending',
  nudge_email_sent_at       = coalesce(nudge_email_sent_at, now())
where id = '8b02f9ce-dbf5-416a-bdc9-93fa0de479da'
  and payment_status = 'unpaid';

update public.claims set
  payment_status            = 'paid',
  paid_at                   = '2026-09-02 10:03+10',
  stripe_payment_intent_id  = coalesce(stripe_payment_intent_id, 'pi_3UB1eXPKEqtYM9zM01P06FoQ'),
  claim_status              = 'verification_pending',
  nudge_email_sent_at       = coalesce(nudge_email_sent_at, now())
where id = 'a1df5189-90da-4297-9820-3ace21a7982a'
  and payment_status = 'unpaid';

-- Alessia. Her payment intent was NOT covered by the earlier backfill in
-- 2026-09-07-stripe-identity.sql, because she paid after that file was written.
update public.claims set
  payment_status            = 'paid',
  paid_at                   = '2026-09-08 21:32+10',
  stripe_payment_intent_id  = coalesce(stripe_payment_intent_id, 'pi_3UDNGnPKEqtYM9zM09KQALpj'),
  claim_status              = 'verification_pending',
  nudge_email_sent_at       = coalesce(nudge_email_sent_at, now())
where id = '9ea18e38-fd62-4199-b437-efd93dcd5ec5'
  and payment_status = 'unpaid';

-- ------------------------------------------------------------ 2. leave a trace
-- The status trigger logs claim_status changes on its own, but it cannot record
-- WHY, and in six months "why did four rows change together on 8 September" is
-- the question somebody will ask.
insert into public.claim_audit_log (claim_id, event, detail)
select id, 'manual_recovery',
       'Payment confirmed in Stripe but never written back (no webhook destination existed). '
       || 'Marked paid by hand from the Stripe payments list. Verification not attempted. '
       || 'Automated nudge suppressed pending an apology from the team.'
from public.claims
where id in (
  '30c2583a-4170-48e9-acf9-c994015742bc',
  '8b02f9ce-dbf5-416a-bdc9-93fa0de479da',
  'a1df5189-90da-4297-9820-3ace21a7982a',
  '9ea18e38-fd62-4199-b437-efd93dcd5ec5'
)
  and payment_status = 'paid'
  and not exists (
    select 1 from public.claim_audit_log l
    where l.claim_id = public.claims.id and l.event = 'manual_recovery'
  );

-- --------------------------------------------------------------- 3. after
-- Expect four rows, all paid, all verification_pending, each with a pi_, each
-- with nudge_email_sent_at set.
select id, full_name, email, payment_status, paid_at, claim_status,
       verification_status, stripe_customer_id, stripe_payment_intent_id,
       nudge_email_sent_at
from public.claims
where id in (
  '30c2583a-4170-48e9-acf9-c994015742bc',
  '8b02f9ce-dbf5-416a-bdc9-93fa0de479da',
  'a1df5189-90da-4297-9820-3ace21a7982a',
  '9ea18e38-fd62-4199-b437-efd93dcd5ec5'
)
order by paid_at;

-- Confirms Alessia's abandoned duplicate was not touched. Expect exactly one
-- row, unpaid.
select id, full_name, payment_status, created_at
from public.claims
where email = 'cittadinialessia.ac@gmail.com'
  and id <> '9ea18e38-fd62-4199-b437-efd93dcd5ec5';

-- Confirms nothing else got swept up. Expect zero rows: no claim should be
-- 'paid' without a payment intent recorded against it.
select id, full_name, paid_at
from public.claims
where payment_status = 'paid' and stripe_payment_intent_id is null;

-- ------------------------------------------------- WHAT THIS DOES NOT FIX
--
-- stripe_customer_id stays null on all four, and cannot be backfilled: the old
-- code did not send customer_creation:'always', so Stripe never created a
-- Customer object for these payments. There is nothing to point at.
--
-- That has one concrete consequence. Verification for these four will be
-- recorded by the WEBHOOK path, which matches on the claim_id in the
-- VerificationSession metadata, and that works. It will NOT be recorded by the
-- self-repair in /api/claim-status, which asks Stripe "is this customer
-- verified" and needs a customer to ask about; it skips a null and moves on. So
-- the safety net that covers every future client does not cover these four. If
-- one of them verifies and their row does not update, that is the reason, and
-- the fix is to set verification_status by hand after checking the Identity
-- session in the Stripe dashboard.
--
-- Clients who paid AGAIN through the fixed flow would get a Customer and fall
-- back under the net, but they must not have to pay twice, so this stands.
