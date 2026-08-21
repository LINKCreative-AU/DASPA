// GET /wa -> 302 to the WhatsApp deep link.
//
// Every WhatsApp call to action on this site used to be built in the browser from
// a constant in assets/site.js, and that constant shipped to production still
// holding its placeholder value. That put 62 dead wa.me links across 29 live
// pages, including three inside the paid claim flow, and nothing anywhere could
// catch it because a static site has no build step to fail.
//
// Resolving the number server-side means it comes from Vercel env rather than a
// committed file, and an unset number degrades to a page that can still help
// instead of a broken link. scripts/check.py fails if the placeholder ever
// reappears in shipped assets.
//
// Env: WHATSAPP_NUMBER (digits with country code, e.g. 61400000000).

const DEFAULT_MESSAGE = 'Hi, I have a question about claiming my super';

module.exports = (req, res) => {
  const digits = String(process.env.WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');

  if (!digits) {
    // No number configured. Send them somewhere useful and make the gap loud in
    // the logs rather than handing a visitor a link that goes nowhere.
    console.warn('WHATSAPP_NUMBER not set: /wa fell back to the FAQ');
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 302;
    res.setHeader('Location', '/faq');
    return res.end();
  }

  const text = typeof req.query?.text === 'string' && req.query.text
    ? req.query.text.slice(0, 300)
    : DEFAULT_MESSAGE;

  // Short cache only: the number is stable, but a wrong one should not be
  // pinned into every visitor's browser for a day.
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.statusCode = 302;
  res.setHeader('Location', `https://wa.me/${digits}?text=${encodeURIComponent(text)}`);
  return res.end();
};
