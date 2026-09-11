# GST treatment of the DASPA fee

**Status: proposed, awaiting sign-off from James and Chris. The build still
charges GST. Nothing changes until this is signed off.**

Last updated 11 September 2026.

## The proposed position

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

## What changes if this is signed off

1. `gst_treatment` defaults to `gst_free` rather than `taxable`, in
   `supabase/2026-09-09-gst-declaration.sql`. The per-claim override stays.
2. The invoice drops the GST line and the ex-GST subtotal, and is titled
   **Invoice**, not **Tax invoice**. A tax invoice is the document for a
   taxable sale.
3. The **"Are you in Australia right now?"** question comes off `claim.html`.
   It exists only to decide GST and is two radio buttons plus an explanatory
   paragraph of friction. `in_australia_declared`, `edge_country` and
   `client_ip` stay in the table as evidence on historical claims.
4. Every page advertising **"$163.90 incl. GST"** has to change. That is a
   consumer representation under the Australian Consumer Law, not just a tax
   label, so it moves at the same time as the treatment, not after.
5. Someone decides whether the price falls to $149.00 or stays at $163.90 with
   ARO keeping the $14.90. The tax position does not decide this.

## The four historical claims

The three not refunded were invoiced as taxable, so $44.70 of GST was charged
and would have been remitted on a treatment that this note says does not apply.
Small, and correctable, but it should be corrected deliberately rather than
discovered later.

## Sources

- GST Act s38-190(1), item 2
- GSTR 2004/7, on when a non-resident is "not in Australia when the thing
  supplied is done"
- ATO DASP eligibility conditions (departed, visa ceased)

Retrieved 10 to 11 September 2026. The ATO blocks automated retrieval of parts
of its legal database, so the ruling was read via its published summary and
should be confirmed against the full text before sign-off.
