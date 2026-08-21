// Transactional email via the Resend REST API (no SDK, plain fetch).
// Env: RESEND_API_KEY, EMAIL_FROM (e.g. "DASPA <hello@daspa.com.au>"), OPS_EMAIL.
// If RESEND_API_KEY is unset the send is skipped and logged, so the claim
// flow never fails because of email.

const config = require('./config');

async function send(to, subject, text) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email:', subject, '->', to);
    return false;
  }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'DASPA <hello@daspa.com.au>',
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
    }),
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
  const body = lines.filter(Boolean).join('\n');
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

// Reference block for an ops alert. Deliberately no TFN, no passport number and
// no bank details: those live in the claims table behind RLS and have no business
// sitting in an inbox.
const opsRef = (c) =>
  [`Claim id: ${c.id}`,
   `Name:     ${c.full_name || '(not given)'}`,
   `Email:    ${c.email || '(not given)'}`,
   c.phone ? `Phone:    ${c.phone}` : null,
   c.visa_subclass ? `Visa:     ${c.visa_subclass}` : null,
   c.passport_country ? `Passport: ${c.passport_country}` : null,
   c.fund_unknown ? 'Fund:     unknown, needs the all-accounts search' :
     (c.fund_name ? `Fund:     ${c.fund_name}` : null),
   `Status:   ${config.SITE_URL}/confirmation?cid=${c.id}`];

const firstName = (c) => (c.full_name || 'there').trim().split(/\s+/)[0];
const wa = () => `Questions any time, just message us on WhatsApp: ${config.whatsappLink()}`;
const sig = 'The DASPA team\nAustralian Registration Office Pty Ltd · Registered Tax Agent 26076969\nhttps://daspa.com.au';

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

  opsPaid(c, amountCents) {
    return notifyOps(`PAID: ${c.full_name || 'unnamed'}`, [
      `Payment received${amountCents ? ` ($${(amountCents / 100).toFixed(2)})` : ''}. ` +
        'Waiting on the identity check before lodgement.',
      '',
      ...opsRef(c),
    ]);
  },

  opsVerified(c) {
    return notifyOps(`READY TO LODGE: ${c.full_name || 'unnamed'}`, [
      'Identity verified. Paid and verified, so this claim is ready for an agent.',
      '',
      ...opsRef(c),
    ]);
  },

  opsNeedsReview(c, status) {
    return notifyOps(`Needs review: ${c.full_name || 'unnamed'}`, [
      `The identity check came back "${status}", so this one needs a human before it can proceed.`,
      '',
      ...opsRef(c),
    ]);
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

  formReceived(c) {
    return send(
      c.email,
      'We have your super claim ✓',
      `Hi ${firstName(c)},

Your claim form just arrived safely, thanks for trusting us with it.

Nothing more is needed right now. Once your payment and identity check are done, our registered agents review everything, find every super account in your name (including money already at the ATO), and ${lodgementLine()}.

Your super is paid by your fund or the ATO directly to your bank. We never hold your money. And it's no-win-no-fee: if we can't recover any super for you, your fee is refunded in full.

${wa()}

${sig}`
    );
  },

  paymentConfirmed(c) {
    return send(
      c.email,
      'Payment received, one step to go',
      `Hi ${firstName(c)},

Payment received: $163.90, the flat fee, all inclusive. That's the only thing you'll ever pay us, and if we can't recover any super for you, it comes straight back (no super, no fee).

One step left: verify your identity with your passport and a quick selfie (about two minutes, from your phone):

${config.SITE_URL}/verify?cid=${c.id}

The law requires it before a registered tax agent can lodge for you, and once it's done, we take it entirely from there.

${wa()}

${sig}`
    );
  },

  verified(c) {
    return send(
      c.email,
      'Identity verified. Your claim is in review',
      `Hi ${firstName(c)},

Your identity check is done and dusted. ✓

Our registered agents are now reviewing your claim and locating every super account held in your name, including ATO-held money most people don't know exists. From here ${lodgementLine()}.

You don't need to do anything. We'll email you at every milestone until the money lands.

${wa()}

${sig}`
    );
  },

  lodged(c) {
    return send(
      c.email,
      'Your claim is lodged with the ATO 🎉',
      `Hi ${firstName(c)},

Your DASP claim has been lodged with the ATO through the registered tax agent system.

What happens now: the ATO and your fund(s) process the claim, typically within 28 days, and pay your super directly to the bank account you gave us. We keep watch and chase anything that stalls.

${wa()}

${sig}`
    );
  },

  verificationNudge(c) {
    return send(
      c.email,
      'Your super claim is waiting on one thing (2 minutes)',
      `Hi ${firstName(c)},

Your claim and payment are safely in, but we can't lodge until your identity is verified, and it looks like that step didn't get finished.

It takes about two minutes on your phone with your passport:

${config.SITE_URL}/verify?cid=${c.id}

Camera acting up, passport renewed, or anything else in the way? Reply to this email or message us on WhatsApp and a human will sort it out with you.

${wa()}

${sig}`
    );
  },
};
