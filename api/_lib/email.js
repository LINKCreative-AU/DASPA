// Transactional email via the Resend REST API (no SDK — plain fetch).
// Env: RESEND_API_KEY, EMAIL_FROM (e.g. "DASPA <hello@daspa.com.au>").
// If RESEND_API_KEY is unset the send is skipped and logged, so the claim
// flow never fails because of email.

const config = require('./config');

async function send(to, subject, text) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email:', subject, '->', to);
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
      to: [to],
      subject,
      text,
    }),
  });
  if (!r.ok) console.error('email send failed:', r.status, await r.text());
  return r.ok;
}

const firstName = (c) => (c.full_name || 'there').trim().split(/\s+/)[0];
const wa = () => `Questions any time — just message us on WhatsApp: ${config.whatsappLink()}`;
const sig = 'The DASPA team\nAustralian Registration Office Pty Ltd · Registered Tax Agent 26076969\nhttps://daspa.com.au';

const lodgementLine = () =>
  config.LODGEMENT_LIVE
    ? 'we lodge directly with the ATO, who typically process DASP claims within 28 days'
    : 'your claim is prepared and held at "in review" — we complete every search and preparation step now, and lodge the moment our direct ATO channel opens (we\'ll email you when it goes in)';

module.exports = {
  send,

  formReceived(c) {
    return send(
      c.email,
      'We have your super claim ✓',
      `Hi ${firstName(c)},

Your claim form just arrived safely — thanks for trusting us with it.

Nothing more is needed right now. Once your payment and identity check are done, our registered agents review everything, find every super account in your name (including money already at the ATO), and ${lodgementLine()}.

Your super is paid by your fund or the ATO directly to your bank — we never hold your money. And it's no-win-no-fee: if we can't recover any super for you, your fee is refunded in full.

${wa()}

${sig}`
    );
  },

  paymentConfirmed(c) {
    return send(
      c.email,
      'Payment received — one step to go',
      `Hi ${firstName(c)},

Payment received: $163.90, the flat fee, all inclusive. That's the only thing you'll ever pay us — and if we can't recover any super for you, it comes straight back (no super, no fee).

One step left: verify your identity with your passport and a quick selfie (about two minutes, from your phone):

${config.SITE_URL}/verify?cid=${c.id}

The law requires it before a registered tax agent can lodge for you — and once it's done, we take it entirely from there.

${wa()}

${sig}`
    );
  },

  verified(c) {
    return send(
      c.email,
      'Identity verified — your claim is in review',
      `Hi ${firstName(c)},

Your identity check is done and dusted. ✓

Our registered agents are now reviewing your claim and locating every super account held in your name — including ATO-held money most people don't know exists. From here ${lodgementLine()}.

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

What happens now: the ATO and your fund(s) process the claim — typically within 28 days — and pay your super directly to the bank account you gave us. We keep watch and chase anything that stalls.

${wa()}

${sig}`
    );
  },

  verificationNudge(c) {
    return send(
      c.email,
      'Your super claim is waiting on one thing (2 minutes)',
      `Hi ${firstName(c)},

Your claim and payment are safely in — but we can't lodge until your identity is verified, and it looks like that step didn't get finished.

It takes about two minutes on your phone with your passport:

${config.SITE_URL}/verify?cid=${c.id}

Camera acting up, passport renewed, or anything else in the way? Reply to this email or message us on WhatsApp and a human will sort it out with you.

${wa()}

${sig}`
    );
  },
};
