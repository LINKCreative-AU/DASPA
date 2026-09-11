// Transactional email via the Resend REST API (no SDK, plain fetch).
// Env: RESEND_API_KEY, EMAIL_FROM (e.g. "DASPA <hello@daspa.com.au>"), OPS_EMAIL.
// If RESEND_API_KEY is unset the send is skipped and logged, so the claim
// flow never fails because of email.

const config = require('./config');
const H = require('./email-html');
const invoice = require('./invoice');
const invoicePdf = require('./invoice-pdf');

const firstName = (c) => (c.full_name || 'there').trim().split(/\s+/)[0];
/* The address a client should write to, taken out of EMAIL_FROM so there is one
   variable to keep right rather than two that can disagree. EMAIL_FROM is either
   "Name <addr>" or a bare address, so both shapes are handled. */
const contactAddress = () => {
  const from = process.env.EMAIL_FROM || 'DASPA <hello@daspa.com.au>';
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim();
};

/* One sender for everything.
   send(to, subject, text)                         plain text only
   send(to, subject, text, { html, attachments })  multipart, with files

   TEXT IS ALWAYS REQUIRED, even when html is given. Resend will synthesise a
   text part from the HTML if it is omitted, but the result reads like stripped
   markup. A hand-written one is what a client on a text-only client actually
   reads, and its absence is something spam filters notice.

   Attachments are Resend's shape: { filename, content (base64), content_type }.
   The cap is 40MB per message after encoding, which an invoice will never
   trouble. https://resend.com/docs/api-reference/emails/send-email */
async function send(to, subject, text, opts = {}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email:', subject, '->', to);
    return false;
  }
  const payload = {
    from: process.env.EMAIL_FROM || 'DASPA <hello@daspa.com.au>',
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
  };
  if (opts.html) payload.html = opts.html;
  /* So a reply reaches a person. Without it a reply goes to EMAIL_FROM, which
     is the same inbox today but need not stay that way. */
  payload.reply_to = opts.replyTo || contactAddress();
  if (opts.attachments && opts.attachments.length) {
    payload.attachments = opts.attachments.map((a) => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
      content_type: a.contentType || 'application/octet-stream',
    }));
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) console.error('email send failed:', r.status, await r.text());
  return r.ok;
}

// Every sender below writes to the CLIENT. Nobody on our side was told anything,
// so a paying customer could complete the whole flow with no human alerted and
// the only record a Supabase row nobody watches. notifyOps is the other half.
//
// OPS_EMAIL takes one address or a comma-separated list. When it is unset the
// alert still goes to the function log rather than vanishing, which is the
// fallback the kit's "leads never dropped" standard asks for.
async function notifyOps(subject, lines) {
  /* Drops null and undefined, KEEPS empty strings. filter(Boolean) used to be
     here, which removed the deliberate blank lines too and ran the whole alert
     into one block: the do-not-lodge banner, the link and the claim details
     with nothing between them. Callers use null for "omit this line" and '' for
     "break here". */
  const body = lines.filter((l) => l !== null && l !== undefined).join('\n');
  const to = (process.env.OPS_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!to.length) {
    console.warn('OPS_EMAIL not set. Unsent ops alert:', subject, '\n' + body);
    return false;
  }
  try {
    return await send(to, subject, body);
  } catch (e) {
    // An ops alert must never be the reason a claim or a webhook fails.
    console.error('ops notify failed:', subject, e && e.message, '\n' + body);
    return false;
  }
}

/* Reference block for an ops alert.
 *
 * THE TFN IS HERE IN FULL, AND THAT WAS A DECISION.
 *
 * It used to be excluded, with a comment saying it had no business sitting in
 * an inbox. Juan overruled that on 10 September 2026, and the reason holds: the
 * team needs it to lodge, and the alternative is every lodgement starting with
 * somebody opening Supabase to copy a number across, which is slower and no
 * more private, because the number is on their screen either way.
 *
 * What follows from that:
 *   - OPS_EMAIL must stay a small internal list. Every address on it can read
 *     a tax file number.
 *   - the alert carries a do-not-forward line, because the usual way this
 *     leaks is a well-meaning forward to somebody who needed one other fact
 *     out of the same email;
 *   - it stays OUT of ActiveCampaign when that is wired up. A marketing
 *     platform has broad staff access, app integrations and export tooling,
 *     which is a different exposure from a restricted inbox, and nothing in a
 *     CRM needs a TFN.
 *
 * Bank details stay excluded. The team does not key them to lodge, and they can
 * be read off the claim when they are actually needed. */
const opsRef = (c) =>
  [`Claim id:  ${c.id}`,
   c.order_number ? `Order:     ${c.order_number}` : null,
   `Name:      ${c.full_name || '(not given)'}`,
   `Email:     ${c.email || '(not given)'}`,
   c.phone ? `Phone:     ${c.phone}` : null,
   c.date_of_birth ? `Born:      ${c.date_of_birth}` : null,
   /* Spelled out rather than abbreviated, so a skim of the inbox cannot mistake
      it for a reference number and quote it to somebody. */
   c.tfn ? `Tax file number: ${c.tfn}`
         : 'Tax file number: NOT PROVIDED, so the ATO may review this claim manually',
   c.passport_number ? `Passport:  ${c.passport_number} (${c.passport_country || 'country not given'})` : null,
   c.visa_subclass ? `Visa:      ${c.visa_subclass}${c.visa_status ? `, ${c.visa_status}` : ''}` : null,
   c.date_departed ? `Departed:  ${c.date_departed}` : null,
   c.fund_unknown ? 'Fund:      unknown, needs the all-accounts search'
     : (c.fund_name ? `Fund:      ${c.fund_name}${c.fund_member_number ? ` (member ${c.fund_member_number})` : ''}` : null),
   '',
   'Bank details are on the claim in Supabase, not in this email.',
   'DO NOT FORWARD. This email contains a tax file number.'].filter((l) => l !== null);

/* Was a WhatsApp line until 8 September 2026. WHATSAPP_NUMBER has never been
   set, so config.whatsappLink() resolved to /wa, which redirects to /faq: every
   client email was inviting them to message a channel that did not exist. */
const wa = () => `Questions any time, just reply to this email or write to ${contactAddress()}.`;
const sig = 'The DASPA team\nAustralian Registration Office Pty Ltd \u00b7 Registered Tax Agent 26076969\nhttps://daspa.com.au';

/* The durable verification link, the same two-id shape ABN Assist uses, so it
   survives being emailed and reopened weeks later.

   Returns null when either id is missing, and every caller checks. Half a link
   is worse than none: it 404s, and a client who follows one concludes their
   claim has been lost. A guest checkout leaves stripe_customer_id null, which
   is the case that actually produces it. */
function verifyUrl(c) {
  if (!c || !c.stripe_customer_id || !c.order_number) return null;
  return `${config.SITE_URL}/verify-id`
    + `?c=${encodeURIComponent(c.stripe_customer_id)}`
    + `&o=${encodeURIComponent(c.order_number)}`;
}

const lodgementLine = () =>
  config.LODGEMENT_LIVE
    ? 'we lodge directly with the ATO, who typically process DASP claims within 28 days'
    : 'your claim is prepared and held at "in review", we complete every search and preparation step now, and lodge the moment our direct ATO channel opens (we\'ll email you when it goes in)';

module.exports = {
  send,
  notifyOps,

  // ---- alerts to us, not to the client ----------------------------------
  opsNewClaim(c) {
    return notifyOps(`New DASP claim: ${c.full_name || 'unnamed'}`, [
      'A claim form was submitted and a payment link issued.',
      '',
      ...opsRef(c),
    ]);
  },

  /* Arrives BEFORE the team is cleared to lodge, and its whole purpose is to
     hand them everything needed to lodge. So the subject says so: the go-ahead
     is a second email, and without the distinction in the subject line the two
     look alike and habit wins. Same reasoning as ABN Assist. */
  opsPaid(c, amountCents) {
    const vUrl = verifyUrl(c);
    return notifyOps(
      `PAID, ID NOT VERIFIED: ${c.full_name || 'unnamed'}`
        + `${amountCents ? `, $${(amountCents / 100).toFixed(2)}` : ''}`,
      [
        '*** ID NOT VERIFIED YET. DO NOT LODGE. ***',
        'A second alert arrives when the client verifies. That one is the go-ahead.',
        vUrl ? `Send them this link if they say it never arrived:\n${vUrl}` : null,
        '',
        ...opsRef(c),
      ].filter((l) => l !== null)
    );
  },

  opsVerified(c) {
    return notifyOps(`READY TO LODGE: ${c.full_name || 'unnamed'}`, [
      'Identity verified. Paid and verified, so this claim is cleared for an agent.',
      config.LODGEMENT_LIVE ? null
        : 'NOTE: LODGEMENT_LIVE is off, so nothing can be lodged yet. This one waits.',
      '',
      ...opsRef(c),
    ].filter((l) => l !== null));
  },

  opsNeedsReview(c, status) {
    return notifyOps(`Needs review: ${c.full_name || 'unnamed'}`, [
      `The identity check came back "${status}", so this one needs a human before it can proceed.`,
      '',
      ...opsRef(c),
    ]);
  },

  /* A refund landed. Loud on purpose: a refunded claim must not be lodged, and
     the team works the queue by status, so somebody has to know the status
     changed under them. */
  opsRefunded(c, { amountCents, full, reason }) {
    const money = amountCents ? `$${(amountCents / 100).toFixed(2)}` : 'an unstated amount';
    return notifyOps(`${full ? 'REFUNDED' : 'PARTIAL REFUND'}: ${c.full_name || 'unnamed'}`, [
      full
        ? `${money} refunded in full. The claim is on hold and must NOT be lodged.`
        : `${money} refunded, which is less than the fee, so the claim is still marked paid `
          + 'and is on hold pending a decision. Check whether this was intended.',
      reason ? `Stripe reason: ${reason}` : null,
      '',
      ...opsRef(c),
    ].filter(Boolean));
  },

  /* A chargeback, which is not a refund: the money has not gone back yet and
     there is a deadline to respond. Nothing is marked refunded here. */
  opsDispute(c, { amountCents, reason, dueBy }) {
    const money = amountCents ? `$${(amountCents / 100).toFixed(2)}` : 'an unstated amount';
    return notifyOps(`DISPUTE OPENED: ${c.full_name || 'unnamed'}`, [
      `${money} disputed with the cardholder's bank. The claim is on hold.`,
      reason ? `Reason given: ${reason}` : null,
      dueBy ? `Evidence due by: ${dueBy}` : null,
      'This needs a response in Stripe. See the Online Services Stripe dispute process.',
      '',
      ...opsRef(c),
    ].filter(Boolean));
  },

  opsPaperForm(name, from, phone, note) {
    return notifyOps(`Paper form received: ${name || 'unnamed'}`, [
      'A completed paper application arrived through /upload-form.',
      'It is in storage and has no claim record yet, so it needs keying in and a payment link.',
      '',
      `Name:  ${name || '(not given)'}`,
      `Email: ${from || '(not given)'}`,
      phone ? `Phone: ${phone}` : null,
      note ? `Note:  ${note}` : null,
    ]);
  },

  /* THE ONE EMAIL THAT MATTERS. First contact, because nothing is sent before
     payment any more: a client who has not paid has not ordered anything and
     does not need a receipt for it.

     Carries four things, in the order a client wants them: that the money
     arrived, their reference, the one thing still to do, and the invoice. The
     invoice goes in twice, rendered in the body from the same model that
     builds the PDF and attached as that PDF, because some clients forward the
     body to an accountant and others want the file.

     Never throws. An invoice that cannot be built must not stop the
     verification link reaching the client, so the invoice half degrades and
     the message still goes. */
  async paymentConfirmed(c) {
    const name = H.esc(firstName(c));
    const vUrl = verifyUrl(c);

    let model = null;
    let pdf = null;
    try {
      model = invoice.build(c);
      pdf = invoicePdf.render(model);
    } catch (e) {
      console.error(`email: invoice for ${c.order_number || c.id} could not be built, `
        + `sending the confirmation without it: ${e.message}`);
    }

    const steps = [
      vUrl
        ? 'Once your identity is verified, our registered agents review your claim and locate every super account in your name, including money already transferred to the ATO.'
        : 'Our registered agents review your claim and locate every super account in your name, including money already transferred to the ATO.',
      config.LODGEMENT_LIVE
        ? 'We lodge directly with the ATO through the registered tax agent system, covering every fund in one claim.'
        : 'Your claim is prepared and held at "in review". We complete every search and preparation step now, and lodge the moment our direct ATO channel opens.',
      'The ATO or your fund pays your super straight to the bank account you gave us, anywhere in the world. We never hold your money.',
      'If we cannot recover any super for you, your fee is refunded in full.',
    ];

    const body = [
      H.h1('Your payment is confirmed'),
      H.p(`${name}, thanks. Your payment went through and your claim is with our registered tax agents.`),
      c.order_number ? H.chip(c.order_number) : '',
      vUrl ? H.callout({
        text: 'If you have not verified your identity yet, please use the link below. We are '
          + 'required by the Tax Practitioners Board to confirm who you are before lodging on '
          + 'your behalf, and we cannot proceed with your claim until this is done. It takes '
          + 'about two minutes with your passport and a selfie.',
        buttonLabel: 'Verify my identity',
        buttonUrl: vUrl,
      }) : '',
      H.h2('What happens next'),
      H.steps(steps),
      model ? H.invoiceBlock(model) : '',
      model ? H.p(`<span style="font-size:14px;color:${H.C.muted}">The same invoice is attached to this email as a PDF for your records.</span>`) : '',
      H.p(`Questions? Reply to this email or call ${H.link('tel:1800546526', '1800 546 526')} from inside Australia, or ${H.link('tel:+61721014373', '+61 7 2101 4373')} from overseas.`),
    ].filter(Boolean).join('\n');

    const text = `Hi ${firstName(c)},

Thanks. Your payment went through and your claim is with our registered tax agents.
${c.order_number ? `\nYour reference is ${c.order_number}. Quote it if you call.\n` : ''}${vUrl ? `
NEXT STEP, VERIFY YOUR IDENTITY
We are required by the Tax Practitioners Board to confirm who you are before
lodging on your behalf, and we cannot proceed until this is done. It takes about
two minutes with your passport and a selfie:

${vUrl}
` : ''}
WHAT HAPPENS NEXT
${steps.map((t, i) => `${i + 1}. ${t}`).join('\n')}
${model ? `
${model.document_type} ${model.invoice_number}
${model.lines.map((l) => `${l.description}  ${l.amount}`).join('\n')}
${model.gst_treatment === 'taxable' ? `GST  ${model.gst_amount}\n` : ''}${model.total_label}  ${model.total} ${model.currency}
${model.taxable_extent}
The same invoice is attached as a PDF.
` : ''}
${wa()}

${sig}`;

    return send(c.email, 'Your payment is confirmed', text, {
      html: H.shell({
        title: 'Your payment is confirmed',
        /* The grey line next to the subject in the inbox. Left empty, most
           clients show the first words of the body, which here is the phone
           number in the header. */
        preheader: `Payment received.${c.order_number ? ` Reference ${c.order_number}.` : ''}`
          + `${vUrl ? ' One step left: verify your identity.' : ''}`,
        body,
      }),
      attachments: pdf ? [{
        filename: invoicePdf.filename(model),
        content: pdf,
        contentType: 'application/pdf',
      }] : [],
    });
  },

  verified(c) {
    const name = H.esc(firstName(c));
    const body = [
      H.h1('Your identity is verified'),
      H.done('Identity verified. Nothing further is needed from you.'),
      H.p(`${name}, your verification came back clear. It was processed by Stripe Identity using your passport and biometric matching, so your claim is now linked to your identity.`),
      H.h2('What happens next'),
      H.steps([
        'Our registered agents review your claim and locate every super account in your name, including money already transferred to the ATO.',
        config.LODGEMENT_LIVE
          ? 'We lodge directly with the ATO through the registered tax agent system.'
          : 'Your claim is prepared and held at "in review", and lodged the moment our direct ATO channel opens.',
        'The ATO or your fund pays your super straight to your nominated bank account. We email you at every milestone.',
      ]),
      c.order_number ? H.p(`<span style="font-size:14px;color:${H.C.muted}">Your reference is <b>${H.esc(c.order_number)}</b>.</span>`) : '',
      H.p(`Questions? Reply to this email or write to ${H.mailto()}.`),
    ].filter(Boolean).join('\n');

    return send(c.email, 'Identity verified, your claim is in review',
      `Hi ${firstName(c)},

Your identity check is done. It was processed by Stripe Identity using your
passport and biometric matching, so your claim is now linked to your identity
and nothing further is needed from you.

Our registered agents are now reviewing your claim and locating every super
account held in your name, including ATO-held money most people do not know
exists. From here ${lodgementLine()}.
${c.order_number ? `\nYour reference is ${c.order_number}.\n` : ''}
${wa()}

${sig}`,
      { html: H.shell({
        title: 'Your identity is verified',
        preheader: 'Verified. Your claim is with our registered tax agents, nothing further needed.',
        body,
      }) });
  },

  lodged(c) {
    const name = H.esc(firstName(c));
    const body = [
      H.h1('Your claim is lodged with the ATO'),
      H.done('Lodged. The waiting is with the ATO now, not with us.'),
      H.p(`${name}, your DASP claim has been lodged through the registered tax agent system, covering every fund we found in your name.`),
      H.h2('What happens next'),
      H.steps([
        'The ATO and your fund process the claim, typically within 28 days.',
        'Your super is paid straight to the bank account you gave us. We never hold your money.',
        'We keep watch and chase anything that stalls. You do not need to do anything.',
      ]),
      c.order_number ? H.p(`<span style="font-size:14px;color:${H.C.muted}">Your reference is <b>${H.esc(c.order_number)}</b>.</span>`) : '',
      H.p(`Questions? Reply to this email or write to ${H.mailto()}.`),
    ].filter(Boolean).join('\n');

    return send(c.email, 'Your claim is lodged with the ATO',
      `Hi ${firstName(c)},

Your DASP claim has been lodged with the ATO through the registered tax agent
system, covering every fund we found in your name.

The ATO and your fund now process the claim, typically within 28 days, and pay
your super directly to the bank account you gave us. We keep watch and chase
anything that stalls.
${c.order_number ? `\nYour reference is ${c.order_number}.\n` : ''}
${wa()}

${sig}`,
      { html: H.shell({
        title: 'Your claim is lodged with the ATO',
        preheader: 'Lodged. The ATO typically processes DASP claims within 28 days.',
        body,
      }) });
  },

  verificationNudge(c) {
    const name = H.esc(firstName(c));
    const vUrl = verifyUrl(c);
    const body = [
      H.h1('Your claim is waiting on one thing'),
      H.p(`${name}, your claim and payment are safely in, but we cannot lodge until your identity is verified, and it looks like that step did not get finished.`),
      vUrl ? H.callout({
        text: 'It takes about two minutes on your phone, with your passport and a selfie.',
        buttonLabel: 'Verify my identity',
        buttonUrl: vUrl,
      }) : '',
      H.p(`Camera playing up, passport renewed, or something else in the way? Reply to this email and a person will sort it out with you. There is no deadline on a DASP claim, so nothing is lost.`),
    ].filter(Boolean).join('\n');

    return send(c.email, 'Your super claim is waiting on one thing',
      `Hi ${firstName(c)},

Your claim and payment are safely in, but we cannot lodge until your identity is
verified, and it looks like that step did not get finished.

It takes about two minutes on your phone with your passport:
${vUrl ? `\n${vUrl}\n` : '\nReply to this email and we will send you a fresh link.\n'}
Camera playing up, passport renewed, or something else in the way? Reply to this
email and a person will sort it out with you. There is no deadline on a DASP
claim, so nothing is lost.

${wa()}

${sig}`,
      { html: H.shell({
        title: 'Your claim is waiting on one thing',
        preheader: 'Two minutes with your passport and we can lodge your claim.',
        body,
      }) });
  },
};
