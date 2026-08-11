import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/v2";
import { LoanCheck } from "./LoanCheck";
import { BANDS, SCORED } from "./model";

// The division's score engine - "home loan health check" is 141/mo at KD 0
// and the firm already owns the concept (Callum's video, two posts, annual
// checks as a service line). Conversion engine first, search legs second.

const PATH = "/home-loan-health-check";

export const metadata: Metadata = {
  title: { absolute: "Home Loan Health Check | Score Your Loan Out of 10" },
  description:
    "Seven quick questions, a score out of 10: rate awareness, review recency, structure, fit, equity and attention. See what your loan's costing you in neglect, on screen, no email wall.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "The Home Loan Health Check - score your loan out of 10",
    description: "Two minutes, a real score, and the flags holding your loan back. No email wall.",
    url: PATH,
  },
};

// The band and area tables are built from the same model the tool scores
// with, so a change to a question or a band shows up in both at once.
const BAND_ACTIONS: Record<string, string> = {
  "Dialled in": "Diarise the next review and pre-position for the next property",
  "Mostly working": "Find the one idle lever and switch it on",
  "Drifting": "Make the repricing call this week, before anything else",
  "On autopilot": "Find out your actual rate today, then compare it",
};

const AREA_WHY: Record<string, string> = {
  Rate: "The price you pay for the same debt everyone else has. Loyalty is priced, and the gap between your rate and a new customer's rate is pure margin.",
  Review: "Whether anyone has tested the rate against the market in the last year. Loans drift because nobody makes the call, not because lenders raise rates on you deliberately.",
  Structure: "Offset, splits, extra and fortnightly repayments. Levers that save money without refinancing, and the ones most commonly paid for and never used.",
  Fit: "Whether the loan still matches the life it was built for. Income, family and plans move; loans do not move by themselves.",
  Equity: "Your share of the property. It sets your LVR band, decides whether LMI ever applies again, and determines what the next move can be funded with.",
  Attention: "Whether anyone is actually managing the loan: a repricing call, a market comparison and a feature check-up each year.",
};

const FAQS = [
  { q: "What is a home loan health check?", a: "A structured review of whether your loan is still working: is the rate sharp, is the structure (offset, splits, repayments) being used, does the loan still fit your life, and is anyone paying attention to it. This tool scores those markers in two minutes; a broker review then does the real comparison across 35+ lenders." },
  { q: "How often should I review my home loan?", a: "Annually. That doesn't mean refinancing annually. Most reviews end in a repricing call to your existing lender rather than a switch. What matters is that someone makes that call; loans drift precisely because nobody does." },
  { q: "Is the check personal or credit advice?", a: "No. It weighs six general markers of loan health and returns general observations. It doesn't know your rate, balance or circumstances. It's built to start the right conversation; the review with a broker is where your actual loan gets assessed." },
  { q: "What happens if my loan scores badly?", a: "Usually good news, oddly: a low score means idle levers, and idle levers mean recoverable money. The most common fixes (a repricing call, activating an offset, cutting unused card limits) don't even require refinancing." },
  { q: "What is a good home loan health check score?", a: "Anything at 8.5 or above is dialled in: the rate has been tested recently, the structure is being used, and someone is managing the loan. Between 6.5 and 8.5 the bones are good and one lever is idle. Between 4 and 6.5 is where most loans sit. Below 4 the loan is running on autopilot. The score is a prompt, not a verdict, because it deliberately knows nothing about your actual rate or balance." },
  { q: "Does a home loan health check affect my credit score?", a: "No. Nothing here touches your credit file: there is no credit enquiry, no identity check and no data leaves your browser. A credit enquiry is only recorded when a lender formally assesses an application, which is a later and separate step, and part of a broker's job is making sure you do not scatter enquiries across several lenders while shopping." },
  { q: "Should I refinance or just ask my lender for a better rate?", a: "Ask first, in most cases. A repricing request to your existing lender costs nothing, takes days rather than weeks, and often lands within striking distance of the market. It works best when you can name a specific competing offer, which is the part a broker supplies. Refinancing wins when the gap survives the repricing call, when you need a feature or a structure your lender does not offer, or when your equity has moved you into a better LVR band that your lender will not honour." },
  { q: "What does refinancing cost?", a: "Less than most people expect on a standard loan, but it is not nothing. Realistically $800 to $1,300 all in. Expect a discharge fee from the outgoing lender, mortgage registration and release fees payable to the state titles office, possible application or valuation fees at the new lender, and break costs if you are exiting a fixed rate, which can be substantial and are the one item worth pricing before you decide anything. Many lenders waive or absorb parts of this to win the loan. The rule of thumb we use: if the switch does not pay for itself well inside a year, it is not a switch, it is a repricing conversation." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Home Loan Health Check", path: PATH },
];

export default function Page() {
  const weight = (100 / SCORED.length).toFixed(1);
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LINK Advance Home Loan Health Check",
            url: `https://linkadvance.com.au${PATH}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: 0, priceCurrency: "AUD" },
          },
          faqSchema(FAQS),
          breadcrumbSchema(CRUMBS),
        ]}
      />
      <Breadcrumbs crumbs={CRUMBS} />
      <section className="container-x pb-16 pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <SectionHead
            as="h1"
            eyebrow="2 minutes · no email needed"
            title="The Home Loan Health Check: score your loan out of 10."
            mark="out of 10."
            intro="Loans are built to be forgotten, and lenders price that forgetting. Seven quick questions across the things that decide whether your loan is still working, with your score, flags and next steps on screen immediately."
            accent
          />
        </div>
        <div className="mt-10">
          <LoanCheck />
        </div>

        {/* Callum's health-check video. It had its own page on the old site at
            /callum-talks-home-loan-health-checks, which was an orphan: absent
            from the sitemap and linked from nowhere, so neither a sitemap audit
            nor a link crawl could find it. The rebuild redirected that URL here
            but never carried the video across, which is the gap Juan spotted.
            It belongs on this page rather than back on its own - the old page
            held nothing but the video, and this is where someone who has just
            scored their loan is standing. The old URL still points here, so the
            video is what they arrive at. */}
        <div className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Callum on what a health check actually finds.
          </h2>
          <p className="mt-3 text-lg leading-[1.4] text-ink/80">
            Why loans drift, what we look at when we review one, and what usually turns out to
            be costing the most.
          </p>
          <div className="mt-6 overflow-hidden rounded-[25px] bg-[#f1f1f1]">
            <div className="relative aspect-video">
              <iframe
                src="https://player.vimeo.com/video/1212176046?h=b392c58a9d&title=0&byline=0&portrait=0"
                title="Callum talks Home Loan Health Checks"
                loading="lazy"
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What your score means, band by band.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The check scores {SCORED.length} areas out of 10 each and averages them, so every
            area carries the same {weight}% of the result. Four bands come out of that average,
            and each one has a different first move.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Home loan health check score bands and what to do first at each"
              head={["Score", "Band", "Do this first"]}
              rows={BANDS.map((b, i) => {
                const upper = i === 0 ? "10" : BANDS[i - 1].min.toString();
                return [`${b.min} to ${upper}`, b.name, BAND_ACTIONS[b.name] ?? ""];
              })}
              note="The same bands the tool applies. The score is a prompt built on general markers of loan health, not an assessment of your loan: it knows nothing about your rate, balance or circumstances."
            />
          </div>
          <p className="mt-10 text-lg leading-[1.4] text-ink/80">
            What the tool tells you at each band, in full:
          </p>
          <div className="mt-6 space-y-6 text-lg leading-[1.4] text-ink/80">
            {BANDS.map((b) => (
              <p key={b.name}>
                <strong className="text-ink">{b.name}.</strong> {b.blurb}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The {SCORED.length} areas, and why each one is scored.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            These are not arbitrary. They are the six things a broker checks when a client asks
            whether their loan is still any good, in the order the answers usually matter.
          </p>
          <div className="mt-8">
            <DataTable
              caption="The six areas scored in the home loan health check and their weighting"
              head={["Area", "Weight", "What it measures"]}
              rows={SCORED.map((q) => [q.area, `${weight}%`, AREA_WHY[q.area] ?? q.label])}
              note="Areas and weights read directly from the model the tool scores with. Each area contributes equally to the average."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Equal weighting is a deliberate simplification and it is worth saying so. In a real
            review, rate and structure usually carry the most dollars on a large balance, while
            equity carries the most opportunity if you are thinking about a second property. The
            tool weights them evenly because it cannot see your balance; a broker weights them by
            what your file actually shows.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What an annual review actually involves.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Most people picture a refinance. In practice a review is four steps, and three of
            them happen without your loan moving anywhere.
          </p>
          <ol className="mt-6 space-y-5 text-lg leading-[1.4] text-ink/80">
            <li>
              <strong className="text-ink">Find your actual rate.</strong> Not the rate at
              settlement, the rate on this month&apos;s statement. Note the loan type, the
              balance, whether any part is fixed and when that fixed term ends.
            </li>
            <li>
              <strong className="text-ink">Compare it against what the market and your own
              lender offer new customers.</strong> The second half of that sentence is the
              leverage. Lenders routinely advertise sharper rates to new borrowers than the ones
              they charge existing ones, and that gap is the argument.
            </li>
            <li>
              <strong className="text-ink">Make the repricing call.</strong> Ask the retention
              team to match a specific offer. Naming a competitor, a rate and a lender works far
              better than asking whether anything can be done. Most reviews end here.
            </li>
            <li>
              <strong className="text-ink">Refinance only if the gap survives.</strong> If the
              repricing lands close to market, staying is cheaper than switching once costs are
              counted. If it does not, or if you need a feature your lender does not offer, then{" "}
              <TextLink href="/refinancing-brisbane">refinancing</TextLink> is the answer, and it
              is worth doing properly rather than chasing a cashback.
            </li>
          </ol>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Two dates are worth carrying in a calendar rather than a memory: the anniversary of
            your last review, and the day any fixed term ends. Fixed loans roll to a revert rate
            that is rarely the lender&apos;s best, and the two months before expiry is when you
            have the most options and the most leverage. Our note on{" "}
            <TextLink href="/blog/home-loans/annual-home-loan-health-checks-are-essential">
              why annual checks are worth the hour
            </TextLink>{" "}
            is the longer version of this argument.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Where a low score usually turns into money.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            A low score is not a judgement, it is a list of levers nobody has pulled. The three
            that recover the most, in the order we usually reach for them:
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">The rate.</strong> The largest single number, and the
            one that needs no paperwork if repricing works. Put your balance and your current
            rate into the{" "}
            <TextLink href="/home-loan-repayment-calculator">repayments calculator</TextLink>,
            then run it again half a percentage point lower to see what the call is worth per
            month and over the remaining term.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">The structure.</strong> An offset you are paying a
            package fee for and not using, a redraw balance sitting idle, monthly repayments
            where fortnightly would add a thirteenth payment a year. None of these require
            changing lender, and the repayments calculator prices all three.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            <strong className="text-ink">The equity.</strong> If the property has risen or the
            balance has fallen enough to put you under 80% LVR, you have moved into a better
            pricing band and out of{" "}
            <TextLink href="/lenders-mortgage-insurance-calculator">
              lenders mortgage insurance
            </TextLink>{" "}
            territory for good. Usable equity is also what funds a renovation or a deposit on the
            next place, and how much you can borrow against it is a serviceability question the{" "}
            <TextLink href="/borrowing-power-calculator">borrowing power estimator</TextLink>{" "}
            answers. If the next property is the actual plan,{" "}
            <TextLink href="/investment-home-loans">how investors structure it</TextLink> matters
            more than the rate does.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            If you run a business as well as a mortgage, the commercial equivalent of this page
            is the{" "}
            <TextLink href="/business-borrowing-health-check">
              business borrowing health check
            </TextLink>
            , and the rest of the tools sit together on the{" "}
            <TextLink href="/calculators">calculators and checks hub</TextLink>.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Refinancing: the review", href: "/refinancing-brisbane" },
          { label: "Repayments calculator", href: "/home-loan-repayment-calculator" },
          { label: "Borrowing power estimator", href: "/borrowing-power-calculator" },
          { label: "All calculators and checks", href: "/calculators" },
        ]}
      />
      <CtaBand
        heading="A score is a start. Savings are the point."
        intro="Bring your result to a review. Either we find a sharper loan across 35+ lenders, or we make your lender price-match."
        subject="Home Loan Health Check"
      />
    </main>
  );
}
