// Transactional email via the Resend REST API (no SDK, plain fetch).
// Env: RESEND_API_KEY, EMAIL_FROM (e.g. "DASPA <hello@daspa.com.au>"), OPS_EMAIL.
// If RESEND_API_KEY is unset the send is skipped and logged, so the claim
// flow never fails because of email.

const config = require('./config');
const H = require('./email-html');
const invoice = require('./invoice');
const invoicePdf = require('./invoice-pdf');

const firstName = (c) => (c.full_name || 'there').trim().split(/\s+/)[0];

/* Every client subject LEADS with the order number, because the inbox is where
   a client looks first and a bare "Your payment is confirmed" gives them
   nothing to quote back at us. The brand is in there too: these go to people
   overseas who bought once, weeks ago, and "DASPA" in the first two words is
   what stops the message reading as a phish.

   Leading, not trailing. A subject line is truncated from the right on every
   phone, so anything appended is the first thing lost, which is the half worth
   keeping. Set 18 September 2026.

   Falls back to the bare subject when there is no order number, which should
   not happen on a paid claim but is not worth failing a send over. */
const subjectFor = (base, c) => (c && c.order_number ? `DASPA order ${c.order_number} - ${base}` : base);
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
async function notifyOps(subject, lines, opts = {}) {
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
    return await send(to, subject, body, opts);
  } catch (e) {
    // An ops alert must never be the reason a claim or a webhook fails.
    console.error('ops notify failed:', subject, e && e.message, '\n' + body);
    return false;
  }
}

/* ------------------------------------------------------------ team alerts

   EVERYTHING THE CLIENT SUBMITTED, INCLUDING THE SENSITIVE FIELDS.

   Juan, 5 November 2026: the team alert must carry every field from the form,
   TFN, passport and bank details included, laid out like ABN Assist's "New paid
   order" alert. It goes to OPS_EMAIL, a private mailbox only the team reads.
   This replaces two earlier positions: the TFN went in on 10 September 2026,
   and bank details, which were held back then, now go in as well.

   What follows from that, and it is load-bearing:
     - OPS_EMAIL must stay a small internal list. Every address on it can read
       a TFN, a passport number and a bank account.
     - every alert says DO NOT FORWARD, top and bottom, because the usual leak
       is a well-meaning forward to someone who needed one other fact;
     - none of this goes to ActiveCampaign or any CRM when that is wired up;
     - Resend keeps a copy of every message it sends, so Resend's dashboard is
       now also somewhere these values live. Restrict who can log in there.

   One builder, two renderings: opsSections() produces the content once, and
   the HTML table and the plain-text part are both drawn from it, so the two
   can never disagree about what the client submitted. */

const VISAS = {
  417: 'Working Holiday (417)', 462: 'Work and Holiday (462)',
  482: 'Skilled, TSS / Skills in Demand (482)', 500: 'Student (500)',
  485: 'Temporary Graduate (485)', 600: 'Visitor (600)', other: 'Other / not sure',
};
const EARLIER = { ...VISAS, other: 'Another visa', none: 'No other visa', unsure: 'Not sure' };

// 2026-03-15 -> 15/03/2026. Anything else is shown as it came.
function auDate(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || ''));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (d || null);
}
/* A timestamp in Brisbane time, the way ABN Assist prints it:
   "05/11/2026 at 12:20 pm AEST". Brisbane has no daylight saving, so AEST is
   always right for it. */
function auWhen(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${parts.day}/${parts.month}/${parts.year} at ${parts.hour}:${parts.minute} `
    + `${String(parts.dayPeriod || '').toLowerCase()} AEST`;
}
const money = (cents) => (Number.isFinite(cents) ? `$${(cents / 100).toFixed(2)}` : null);
const tfnSpaced = (t) => {
  const d = String(t || '').replace(/\D/g, '');
  return d.length === 9 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : (t || null);
};
const VERIFICATION = {
  not_started: 'Not started', pending: 'Started, not finished',
  verified: 'Verified', needs_review: 'Needs review',
};

function opsSections(c, amountCents) {
  const intl = c.bank_type === 'international';
  const paidCents = Number.isFinite(amountCents) ? amountCents : c.amount_paid_cents;
  const gst = c.gst_treatment === 'taxable' ? 'inc GST' : c.gst_treatment === 'gst_free' ? 'GST-free' : null;
  const prevAu = c.au_prev_address_line || c.au_prev_address_suburb
    || c.au_prev_address_state || c.au_prev_address_postcode;
  let paid = 'Not paid yet';
  if (c.payment_status === 'refunded') paid = 'Refunded';
  else if (c.payment_status === 'paid' || c.paid_at) paid = [money(paidCents) || 'Paid', gst].filter(Boolean).join(', ');

  return [
    ['Order', [
      ['Service', 'DASP claim'],
      ['Paid', paid],
      ['Order / invoice number', c.order_number],
      ['Form submitted', auWhen(c.created_at)],
      ['Paid at', auWhen(c.paid_at)],
      ['Identity check', VERIFICATION[c.verification_status] || c.verification_status],
      ['Claim status', c.claim_status],
      ['Claim id', c.id],
      ['Stripe session', c.stripe_session_id],
      ['Stripe payment', c.stripe_payment_intent_id],
      ['Stripe customer', c.stripe_customer_id],
    ]],
    ['Client', [
      ...(c.family_name
        ? [['Given names', c.given_names || '(none, single-name passport)'], ['Family name', c.family_name]]
        : [['Full name', c.full_name]]),
      ['Other names used', c.other_names],
      ['Date of birth', auDate(c.date_of_birth)],
      ['Email', c.email],
      ['Phone', c.phone],
    ]],
    ['Passport and visa', [
      ['Passport number', c.passport_number],
      ['Country of issue', c.passport_country],
      ['Visa when they left', VISAS[c.visa_subclass] || c.visa_subclass],
      ['Visa status', c.visa_status],
      ['Earlier visas', Array.isArray(c.other_visas) && c.other_visas.length
        ? c.other_visas.map((v) => EARLIER[v] || v).join(', ') : null],
      /* The client's answer, to set against the ATO visa screen, which shows
         Home Affairs' answer to the same question. If they disagree, do not
         submit: email DASPmail@ato.gov.au. */
      ['Ever held a 417 or 462',
        { yes: 'YES', no: 'No', unsure: 'Not sure, check with the client' }[c.whm_ever_held] || c.whm_ever_held],
      ['Left Australia', auDate(c.date_departed)],
    ]],
    ['Tax and super', [
      /* Spelled out rather than abbreviated, so a skim of the inbox cannot
         mistake it for a reference number and quote it to somebody. */
      ['Tax file number', c.tfn ? tfnSpaced(c.tfn) : 'NOT PROVIDED, so the ATO may review this claim manually'],
      ['Fund', c.fund_unknown ? 'Unknown, run the all-accounts search' : c.fund_name],
      ['Member number', c.fund_unknown ? null : c.fund_member_number],
      ['Employers and dates', c.employment_history],
    ]],
    ['Payout account', intl ? [
      ['Account type', 'Outside Australia (international transfer)'],
      ['Account name', c.bank_account_name],
      ['Bank', c.bank_name],
      ['SWIFT / BIC', c.bank_swift],
      ['Account number or IBAN', c.bank_account_number],
      ['Bank address', c.bank_address],
      ['Currency', c.bank_currency],
    ] : [
      ['Account type', c.bank_type === 'australian' ? 'Australian account (EFT)' : c.bank_type],
      ['Account name', c.bank_account_name],
      ['BSB', c.bank_bsb],
      ['Account number', c.bank_account_number],
    ]],
    ['Current address (outside Australia)', [
      ['Street', c.address_line],
      ['Apartment, unit, floor', c.address_line2],
      ['City / town', c.address_city],
      ['State / region', c.address_region],
      ['Postcode', c.address_postcode],
      ['Country', c.address_country],
    ]],
    ['Last address in Australia', [
      ['Street', c.au_address_line],
      ['Suburb / town', c.au_address_suburb],
      ['State', c.au_address_state],
      ['Postcode', c.au_address_postcode],
      ...(prevAu ? [
        ['Previous street', c.au_prev_address_line],
        ['Previous suburb', c.au_prev_address_suburb],
        ['Previous state', c.au_prev_address_state],
        ['Previous postcode', c.au_prev_address_postcode],
      ] : [['Previous address', 'None given']]),
    ]],
    ['Authority and consent', [
      ['Written authority accepted', auWhen(c.authority_accepted_at)],
      ['Identity check consent', auWhen(c.identity_consent_at)],
    ]],
    ['Where it came from', [
      ['IP address', c.client_ip],
      ['Country (from the connection)', c.edge_country],
    ]],
  ];
}

const DO_NOT_FORWARD = 'DO NOT FORWARD. Contains a tax file number, passport and bank details.';
const blankOr = (v) => {
  if (v === null || v === undefined || v === '') return 'Not given';
  // A link value prints as its label and the URL, since a text part has no anchors.
  if (typeof v === 'object' && v.href) return `${v.label || 'Download'} ${v.href}`;
  return v;
};

/* Renders and sends one team alert about a claim.
   banner:  { kind: 'stop'|'go'|'alert'|'info', title, text?, url? }
   summary: the one-line chip, e.g. "DASP claim · $150.00 paid · DASP00020165"
   notes:   extra plain sentences under the banner (refund reason, due date) */
function notifyOpsClaim(subject, c, { heading, banner, summary, summaryTone, amountCents, notes = [], leadSections = [] }) {
  /* leadSections go above the claim, for an alert whose news is not the claim
     itself: the uploaded ID documents, say. */
  const sections = [...leadSections, ...opsSections(c, amountCents)];
  const who = c.full_name || 'the client';
  const text = [
    DO_NOT_FORWARD,
    '',
    `*** ${banner.title} ***`,
    banner.text || null,
    banner.url || null,
    ...notes,
    '',
    summary,
    '',
    ...sections.flatMap(([title, rows]) => [
      String(title).toUpperCase(),
      ...rows.map(([k, v]) => `${k}: ${blankOr(v)}`),
      '',
    ]),
    `Reply to this email to answer ${who} directly.`,
    DO_NOT_FORWARD,
  ];

  const html = H.shell({
    title: subject,
    preheader: `${banner.title} ${summary}`,
    footerNote: `Internal alert for the DASPA team. ${DO_NOT_FORWARD}`,
    body: [
      H.h1(heading),
      H.banner(banner),
      ...notes.map((n) => H.small(n)),
      H.summary(summary, summaryTone),
      ...sections.map(([title, rows]) => H.section(title, rows)),
      H.small(`Reply to this email to answer ${who} directly.`),
    ].join('\n'),
  });

  return notifyOps(subject, text, { html, replyTo: c.email || undefined });
}

/* "[DASPA] New DASP claim DASP00020165, $150.00, 05/11/2026 at 12:20 pm AEST,
   ID not verified": the ABN Assist subject shape. The order number comes right
   after what happened, because that is what the team searches the inbox for. */
const opsSubject = (what, c, tail) =>
  `[DASPA] ${[what, c.order_number].filter(Boolean).join(' ')}`
  + (tail && tail.filter(Boolean).length ? `, ${tail.filter(Boolean).join(', ')}` : '');

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

/* Some claims must never receive an automated client email.

   The four clients caught in the September 2026 incident are contacted by hand
   and invoiced by hand, decided by Juan on 14 September 2026. Without this
   check that decision survives only as long as somebody remembers it, and one
   of the paths is live right now: DASP00020151 is mid-verification, so the
   moment that client finishes, identity-verified.js calls verified() and an
   automated email lands in the middle of a conversation the team is having
   with them personally.

   The check lives here rather than at each caller because there are four
   callers across three files and a fifth will be added by someone who has
   never heard of this. A sender that refuses is the only version that stays
   true.

   It gates the CLIENT senders only. Ops alerts still fire: the team needs to
   know a client verified, especially when the client hears nothing automatic.

   Returns false, which is what a send that did not happen returns everywhere
   else on this site, so cron-nudge does not stamp nudge_email_sent_at and the
   claim is not quietly marked as having been told something it was not. */
const suppressed = (c, what) => {
  if (!c || c.suppress_automated_email !== true) return false;
  console.log(`email: ${what} suppressed for ${c.order_number || c.id}, this claim is handled manually`);
  return true;
};

module.exports = {
  send,
  notifyOps,
  suppressed,

  // ---- alerts to us, not to the client ----------------------------------
  /* There is no alert for an unpaid claim, deliberately. opsNewClaim used to
     fire when a payment link was issued and was removed on 5 November 2026:
     unpaid orders send no email to anyone. opsPaid below is the first. */

  /* Arrives BEFORE the team is cleared to lodge, and its whole purpose is to
     hand them everything needed to lodge. So the subject says so: the go-ahead
     is a second email, and without the distinction in the subject line the two
     look alike and habit wins. Same reasoning as ABN Assist. */
  opsPaid(c, amountCents) {
    const vUrl = verifyUrl(c);
    const paid = money(Number.isFinite(amountCents) ? amountCents : c.amount_paid_cents);
    return notifyOpsClaim(
      opsSubject('New DASP claim', c, [paid, auWhen(c.paid_at || new Date()), 'ID not verified']), c, {
        heading: 'New paid claim',
        amountCents,
        banner: { kind: 'stop', title: 'ID not verified yet. Do not lodge.',
          text: 'A second alert arrives when the client verifies. That one is the go-ahead.'
            + (vUrl ? ' Send them this link if they need it:' : ''),
          url: vUrl },
        summary: ['DASP claim', paid ? `${paid} paid` : 'paid', c.order_number].filter(Boolean).join(' \u00b7 '),
      });
  },

  opsVerified(c) {
    return notifyOpsClaim(opsSubject('READY TO LODGE', c, ['ID verified']), c, {
      heading: 'Ready to lodge',
      banner: { kind: 'go', title: 'Identity verified. Cleared for an agent to lodge.',
        text: config.LODGEMENT_LIVE ? null
          : 'NOTE: LODGEMENT_LIVE is off, so nothing can be lodged yet. This one waits.' },
      summary: ['DASP claim', 'paid and verified', c.order_number].filter(Boolean).join(' \u00b7 '),
    });
  },

  opsNeedsReview(c, status) {
    return notifyOpsClaim(opsSubject('NEEDS REVIEW', c, [String(status)]), c, {
      heading: 'Needs review',
      banner: { kind: 'alert', title: 'This claim needs a human before it can go further.',
        text: `The identity check came back "${status}".` },
      summary: ['DASP claim', 'on hold', c.order_number].filter(Boolean).join(' \u00b7 '),
      summaryTone: 'muted',
    });
  },

  /* A refund landed. Loud on purpose: a refunded claim must not be lodged, and
     the team works the queue by status, so somebody has to know the status
     changed under them. */
  opsRefunded(c, { amountCents, full, reason }) {
    const amt = money(amountCents) || 'An unstated amount';
    return notifyOpsClaim(opsSubject(full ? 'REFUNDED' : 'PARTIAL REFUND', c, [money(amountCents)]), c, {
      heading: full ? 'Refunded' : 'Partial refund',
      banner: { kind: 'alert',
        title: full ? 'Refunded in full. Do NOT lodge.' : 'Partly refunded. On hold.',
        text: full
          ? `${amt} refunded in full. The claim is on hold and must NOT be lodged.`
          : `${amt} refunded, which is less than the fee, so the claim is still marked paid `
            + 'and is on hold pending a decision. Check whether this was intended.' },
      notes: reason ? [`Stripe reason: ${reason}`] : [],
      summary: ['DASP claim', 'on hold', c.order_number].filter(Boolean).join(' \u00b7 '),
      summaryTone: 'muted',
    });
  },

  /* A chargeback, which is not a refund: the money has not gone back yet and
     there is a deadline to respond. Nothing is marked refunded here. */
  opsDispute(c, { amountCents, reason, dueBy }) {
    const amt = money(amountCents) || 'An unstated amount';
    return notifyOpsClaim(opsSubject('DISPUTE OPENED', c, [money(amountCents), dueBy ? `due ${dueBy}` : null]), c, {
      heading: 'Dispute opened',
      banner: { kind: 'alert', title: 'Card dispute opened. On hold.',
        text: `${amt} disputed with the cardholder's bank. This needs a response in Stripe: `
          + 'see the Online Services Stripe dispute process.' },
      notes: [reason ? `Reason given: ${reason}` : null, dueBy ? `Evidence due by: ${dueBy}` : null].filter(Boolean),
      summary: ['DASP claim', 'disputed', c.order_number].filter(Boolean).join(' \u00b7 '),
      summaryTone: 'muted',
    });
  },

  /* Passport photos uploaded through /id-verification. AMBER, because it is a
     task: somebody has to download them and run the check by hand in Stripe.
     The full claim follows the documents, so the check can be done from this
     one email. Ported from ABN Assist's teamIdDocuments, 5 November 2026. */
  opsIdDocuments(c, { documents = [], missing = [], note, linked, matchedOn, uploaderName, uploaderEmail, prefix, linkDays = 7 }) {
    const count = documents.length;
    const mb = (b) => (b < 1048576 ? `${Math.max(1, Math.round(b / 1024))}KB` : `${(b / 1048576).toFixed(1)}MB`);
    const docRows = documents.map((d, i) => [
      `${i + 1}. ${d.name} (${mb(d.size || 0)})`,
      d.url ? { href: d.url, label: 'Download' } : 'Link failed, open the storage bucket',
    ]);
    return notifyOpsClaim(opsSubject('ID DOCUMENTS TO CHECK', c, [`${count} file${count === 1 ? '' : 's'}`]), c, {
      heading: 'ID documents to check',
      banner: { kind: 'stop', title: 'Run the identity check by hand in Stripe.',
        text: `${uploaderName || c.full_name || 'The client'} uploaded ${count === 1 ? 'a document' : `${count} documents`} `
          + 'because the automatic check would not work for them. Run it in Stripe against their Stripe customer '
          + `(${c.stripe_customer_id || 'see the order section'}), so the verification lands on this claim.` },
      notes: [
        missing.length ? `Did not arrive: ${missing.join(', ')}. Ask them to send ${missing.length === 1 ? 'it' : 'those'} again.` : null,
        linked
          ? `These files are deleted automatically once Stripe marks ${c.order_number || 'this claim'} verified, and within 30 days either way.`
          : 'NOT linked to the claim, so they will not be deleted on verification. The 30-day sweep still catches them.',
      ].filter(Boolean),
      summary: ['ID documents', `${count} file${count === 1 ? '' : 's'}`, c.order_number].filter(Boolean).join(' \u00b7 '),
      summaryTone: 'muted',
      leadSections: [
        [`Documents (links expire in ${linkDays} days)`, docRows],
        ['Upload', [
          ['Uploaded by', uploaderName],
          ['Their email', uploaderEmail],
          ['Matched to the claim by', matchedOn],
          ['What went wrong for them', note],
          ['Stored at', prefix],
        ]],
      ],
    });
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
    if (suppressed(c, 'payment confirmation')) return false;
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
${/* Null on a GST-free sale, where elements 6 and 7 do not apply. Interpolating
      it raw printed the word "null" into the client's plain-text part, which
      the HTML guard did not catch because it only covered the HTML. */
  [model.gst_statement, model.taxable_extent].filter(Boolean).join(' ')}
The same invoice is attached as a PDF.
` : ''}
${wa()}

${sig}`;

    return send(c.email, subjectFor('Your payment is confirmed', c), text, {
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
    /* Promise.resolve, not a bare false: this sender is not async and
       identity-verified.js calls .then() on what it returns. */
    if (suppressed(c, 'identity verified')) return Promise.resolve(false);
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

    return send(c.email, subjectFor('Identity verified, your claim is in review', c),
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
    /* Promise.resolve, not a bare false: this sender is not async and
       identity-verified.js calls .then() on what it returns. */
    if (suppressed(c, 'lodged')) return Promise.resolve(false);
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

    return send(c.email, subjectFor('Your claim is lodged with the ATO', c),
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
    /* Promise.resolve, not a bare false: this sender is not async and
       identity-verified.js calls .then() on what it returns. */
    if (suppressed(c, 'verification nudge')) return Promise.resolve(false);
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

    return send(c.email, subjectFor('Your super claim is waiting on one thing', c),
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
