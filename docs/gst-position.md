# GST treatment of the DASPA fee

**Status: CONFIRMED by James and Chris, 11 September 2026, and APPLIED.**
The fee is $150 with no GST. Code on branch claude/verify-id;
`supabase/2026-09-11-gst-free-and-price.sql` was run against production
("Online Services Combined", ufsnmrqenedpyqyviwne) on 11 September 2026 and
reported:

| gst_treatment | claims | with_amount | min_paid | max_paid |
|---|---|---|---|---|
| gst_free | 11 | 0 | null | null |
| taxable | 4 | 4 | 16390 | 16390 |

The four paid claims keep `taxable` at $163.90, so their invoices still
reproduce what was issued. The eleven are unpaid form-fills, which now default
to GST-free and will stay that way if any of them ever pays. See "The eleven
unpaid rows" below.

Last updated 11 September 2026.

## The position

The DASPA service fee is a **GST-free export of services** under item 2 of the
table in s38-190(1) of the A New Tax System (Goods and Services Tax) Act 1999.

## Why

Item 2 makes a supply of something other than goods or real property GST-free
where it is made to a **non-resident** who is **not in Australia when the thing
supplied is done**, and the supply is neither work physically performed on
goods in Australia nor directly connected with Australian real property.

Our supply is the lodgement of a DASP claim. It is neither of the excluded
kinds, so the question is only about the recipient.

**The recipient cannot be in Australia when the thing supplied is done.** A DASP
cannot be paid until the claimant has left Australia and their visa has ceased
to be in effect. This is not an assumption about our clients, it is a condition
of the payment itself.

**And it is enforced by a system control, not by us.** When the claim is lodged
through the ATO's intermediary channel, the ATO checks the claimant's status
with Home Affairs. An ineligible claimant cannot be submitted. So there is no
path by which the supply completes for somebody who is still here on a live
visa: either they are eligible and therefore offshore with a ceased visa, or
the lodgement is blocked.

Where a claim is paid but never becomes lodgeable, the supply is not completed
at all and the fee is refunded, so no GST question arises on that claim either.

The timing is the point that makes this work. GSTR 2004/7 confirms the supply
is provided as and when the thing supplied is done, not when it is agreed or
paid for. A client who orders from Bondi and is lodged six weeks after flying
home is still a client who was outside Australia when the thing supplied was
done.

## What we are not testing, and why that is accepted

Item 2 also requires the recipient to be a **non-resident**. We do not ask, and
we do not propose to. A person who has permanently departed with a ceased visa
will be a non-resident in substantially every case, and asking a backpacker to
self-assess their tax residency would produce a worse answer than the one we
already infer from the facts we collect.

The form already captures `visa_status` (expired, cancelled, active, unsure)
and `date_departed`. Those two fields are the evidence, and they are better
evidence than a self-assessed residency answer.

**The GST liability is ARO's, not the client's.** A declaration by the claimant
would not shift a shortfall if the position were wrong. It is worth capturing
as evidence of reasonable care for penalty purposes, which the two fields above
already do.

## What changed, all of it done

1. **Price $163.90 to $150.** `FEE_CENTS` is 15000. Not $149: a round number
   was preferred to the old ex-GST figure.
2. **`gst_treatment` defaults to `gst_free`**, in the new migration. The
   per-claim override stays, and rows invoiced before today keep `taxable` so
   reissuing one reproduces the document that was actually sent.
3. **The invoice** is titled *Invoice*, carries no GST row at all (not a nil
   one, which would read as though GST applied and came to nothing), states
   "No GST has been charged on this sale", and the PDF filename says invoice
   rather than tax invoice.
4. **The "Are you in Australia right now?" question is off the form**, with its
   validation and its submitted field. `in_australia_declared`, `edge_country`
   and `client_ip` stay in the table as evidence on historical claims, and
   `edge_country` is still recorded as a fact about the order.
5. **Every "$163.90 incl. GST" on the site is now "$150"**, across 57 files
   including the Japanese, Korean and Chinese pages. The calculator matrix,
   the worked examples and the estimator defaults were recomputed, because
   they are arithmetic on the fee and the text sweep would not have touched
   them.

## The defect this exposed

The invoice was building its figures from `config.FEE_CENTS`, the price
**today**. That survived only because the price had never moved. Regenerating
any invoice after this change would have restated it at $150 and the document
would have stopped agreeing with the client's card statement.

`claims.amount_paid_cents` now records what Stripe actually charged, written by
the webhook from `amount_total`, and the invoice is built from it. Existing paid
rows are backfilled to 16390 by the migration. `config.FEE_CENTS` survives only
as the fallback for rows written before the column existed.

## The four historical claims, still open

The three not refunded were invoiced as taxable at $163.90, so $44.70 of GST
was charged on a treatment this note says does not apply. They keep
`gst_treatment = 'taxable'` in the database, so their invoices still reproduce
what was issued.

**This needs a deliberate decision from James**, not a code change: whether to
refund the GST component to those three clients, reissue their invoices, or
leave them and remit. Nothing in the build assumes an answer.

## The eleven unpaid rows

The check turned up **11 unpaid claims**. Those are abandoned form-fills, and
under the current order (the form inserts to Supabase before payment) each one
carries a full payload: tax file number, passport number, date of birth and
bank details, for somebody who never became a client.

Nothing in the codebase deletes them. This is the same gap the ABN Assist
review flagged, and it is no longer hypothetical here: the rows exist now.

**Both resolved on 11 September 2026.**

Juan set the window at **seven days**, and confirmed unpaid rows may live in
Supabase for that long and then be cleared. That settles the pre-payment
storage question too: the form keeps writing at submit, and the sweep is what
stops the pile growing, so no holding pen or encrypted metadata is needed.

Built as `api/claims-sweep.js` plus
`supabase/2026-09-11-unpaid-retention.sql`. It **redacts rather than deletes**,
because `claim_audit_log` has a foreign key to `claims.id`, because deleting
the row destroys the conversion numbers, and because name, email and visa are
exactly what an abandoned-cart follow-up needs and are a far easier privacy
conversation than a TFN. The first run catches the eleven.

## Sources

- GST Act s38-190(1), item 2
- GSTR 2004/7, on when a non-resident is "not in Australia when the thing
  supplied is done"
- ATO DASP eligibility conditions (departed, visa ceased)

Retrieved 10 to 11 September 2026. The ATO blocks automated retrieval of parts
of its legal database, so the ruling was read via its published summary and
should be confirmed against the full text before sign-off.
