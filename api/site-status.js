// GET → { payments_live } and nothing else.
//
// Exists because this repo has no build step. There is no template pass that
// could bake the flag into claim.html at deploy time, so the page has to ask at
// runtime. /api/health already knows the answer but is key-protected on the
// live domain, correctly, since it lists which credentials are configured.
// This is the one fact a public page is allowed to know.
//
// Deliberately returns no credential state, no counts, no environment name and
// no reason for the closure. A visitor learns only whether the button should
// work, which they would discover by pressing it anyway.

'use strict';

const config = require('./_lib/config');

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  /* no-store, not a short max-age. A flip of the flag has to take effect on the
     next page load, and this response is one boolean: there is nothing to gain
     by caching it and a closed shop that still shows an open button to anyone
     with a warm cache is the failure this endpoint exists to prevent. */
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ payments_live: config.PAYMENTS_LIVE });
};
