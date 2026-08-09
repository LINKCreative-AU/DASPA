# linkadvance-site

The LINK Advance website (linkadvance.com.au) - Brisbane mortgage and finance
brokers - rebuilt on the LINK house stack: Next.js 15 App Router, React 19,
Tailwind 3, zero CMS, typed data modules. Full playbook from the Wealth /
Advisors / Books rebuilds applied (kit v3.15 rules).

## The build
- 69 routes: home, 8 loan service pages, FHOG QLD + First Home Guarantee,
  5 tools, about/reviews/contact, 32 posts at their exact /blog/<cat>/<slug>
  URLs, legal + loan-journey utility pages (noindex).
- Engines: FHOG QLD eligibility checker (wizard), Home Loan Health Check
  (wizard, 6 scored areas + context, pathway routing), borrowing power
  estimator (APRA buffer + card-limit rule), repayments calculator (+stress
  test, extra repayments), LMI calculator (+avoid-LMI paths), stamp duty QLD
  calculator (post-May-2025 first-home rules).
- Compliance: the Connective credit-licence chain renders in the footer of
  every page, verbatim; calculators are indicative-only with disclaimers;
  privacy policy and e-mail disclaimer carried verbatim.

## Dev
npm install && npm run dev

## Deploy
This repo (LINKCreative-AU/linkadvance-site, main) is the source of truth.
Vercel project: link-hq/linkadvance-site. Connect the repo in Vercel
Settings > Git and clear the temporary tarball install command override
(Settings > Build & Development) - after that every push to main deploys.
Attach linkadvance.com.au last: the domain is go-live.

## Human items before go-live
- Confirm the LEADS_TO env (Advance Slack leads channel address) + RESEND_API_KEY on Vercel; test a lead
- Supply the LINK Advance GBP place ID (lib/site.ts reviews.placeId) to deep-link the review count
- Licensee sign-off: footer credit text, calculator disclaimers, FHOG/Guarantee/stamp-duty figures (dated mid-2026), health-check wording
- GSC + Bing verification, submit sitemap
- Domain cutover last - attaching linkadvance.com.au is go-live
