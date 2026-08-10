import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { FAQ } from "@/components/ServicePage";
import { CtaBand } from "@/components/CtaBand";
import { DataTable } from "@/components/DataTable";
import { TextLink } from "@/components/v2";
import { BizCheck } from "./BizCheck";
import { BANDS, SCORED } from "./model";

// The commercial score engine - the fact-find a credit desk runs, as the
// house wizard. Conversion engine for the commercial bolt-on; the lead
// carries the whole profile so Jacob opens the call informed.

const PATH = "/business-borrowing-health-check";

export const metadata: Metadata = {
  title: { absolute: "Business Borrowing Health Check | Is Your Business Fundable?" },
  description:
    "Score your business's borrowing position out of 10 in 3 minutes: structure, financials, profit, add-backs, ATO position, facilities and security. The same markers commercial credit teams read, on screen, no email wall.",
  alternates: { canonical: PATH },
};

// Band actions and area explanations are keyed to the same model the tool
// scores with, so the tables and the tool cannot drift apart.
const BAND_ACTIONS: Record<string, string> = {
  Bankable: "Run a competitive process: two or three lenders, priced against each other",
  Fundable: "Close the one or two gaps before applying, not after the first decline",
  Preparable: "Book the accountant conversation first, the lender conversation second",
  "Groundwork first": "Fix the file before anyone sees it: numbers, then the ATO position",
};

const AREA_WHY: Record<string, string> = {
  Structure: "Who the borrower is, and what a lender can take security over. Sole trader, company or trust changes the lender pool, the guarantees required and how tax-effectively the debt sits.",
  Numbers: "How current and how credible the financials are. Stale numbers are the most common reason a commercial deal stalls, ahead of anything about the business itself.",
  Profit: "The trend, not the last figure. Credit teams read two years and price volatility as risk, so a bumpy but profitable business needs the bumps explained in the file.",
  "Add-backs": "The gap between taxable profit and maintainable earnings. Documented add-backs are what serviceability is actually calculated on, and undocumented ones simply do not exist.",
  ATO: "Whether tax is current, on a plan, or a surprise waiting in the bank statements. Disclosed arrears on a plan are fundable; discovered arrears are not.",
  Facilities: "What debt already exists, at what rate, on what terms. Facilities roll over at last year's margin unless someone reviews them, and stacked short-term debt reads badly and prices badly.",
  Security: "What is available, what is already pledged, and who has personally guaranteed what. Security is the pricing lever most business owners have never mapped.",
};

const FAQS = [
  { q: "What makes a business 'fundable'?", a: "Commercial lenders read the same file every time: current financials, a clear profit story (including add-backs), a clean or managed ATO position, sensible structure, and security they can understand. The check scores those markers because they're fixable, and fixing them changes both approval odds and pricing." },
  { q: "What are add-backs?", a: "Adjustments that show a business's true earning power: directors' wages above or below market, one-off costs, personal expenses run through the business. Lenders assess 'maintainable earnings' (profit after the story is understood), and documented add-backs can substantially lift what a file supports." },
  { q: "Will an ATO debt stop us borrowing?", a: "Not by itself. An ATO debt on a payment plan, disclosed up front, is routinely fundable. The deal-killer is the undisclosed version a lender finds in the bank statements. If there's tax debt, the move is a plan plus honesty, both of which we help arrange." },
  { q: "Is this credit advice?", a: "No. It weighs seven general markers of borrowing readiness and returns general observations. It doesn't know your revenue, industry or circumstances. The free review with Jacob is where the real assessment happens; structure and tax questions belong with your accountant (LINK Advisors, if you'd like ours)." },
  { q: "How much can a business borrow?", a: "There is no income multiple the way there is in home lending. Commercial capacity is set by what the security supports and what the earnings service. Against commercial property, lenders typically go to 65% to 80% of value depending on the asset and the tenant, and an SMSF buying its own premises typically sits at 60% to 80%. Buying a business rather than a building, funding is commonly 50% to 70% of maintainable earnings. Development finance is usually sized at 65% to 80% of total development cost. Which of those applies to you is the first question worth answering." },
  { q: "What deposit do I need to buy commercial property?", a: "Plan on 20% to 35% of value in cash or other security, since commercial LVRs typically run 65% to 80% and the stronger end usually requires a strong tenant, a standard asset type and a strong borrower. Duty, legal costs and any GST treatment sit on top of that, and lenders will often want to see working capital left in the business afterwards rather than every spare dollar in the deposit. Buying premises through an SMSF is a separate structure with its own rules and typically a similar or larger deposit." },
  { q: "How long does commercial finance take?", a: "The honest answer is that the timeline is mostly set by your paperwork, not the lender. With current financials, tax lodgements up to date, an ATO position that is either clean or on a documented plan, and clear security, a straightforward commercial deal moves in weeks. Missing financials or a surprise in the statements turns the same deal into months, because every question restarts the credit queue. That is exactly what this check is scoring." },
  { q: "Will I have to give a personal guarantee?", a: "Almost always, for a small or medium business. Lenders take directors' guarantees as standard, and where the guarantee is supported by a property they will often want a mortgage over it as well. What is negotiable is the scope: whether the guarantee is limited to an amount, whether both directors' spouses are required, and whether it can be released once a covenant is met. Those are worth negotiating at term sheet stage, because they are far harder to change afterwards." },
];

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Business Borrowing Health Check", path: PATH },
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
            name: "LINK Advance Business Borrowing Health Check",
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
            eyebrow="Free tool · 3 minutes · no email needed"
            title="Is your business fundable? Score the file out of 10."
            mark="out of 10."
            intro="Commercial lenders don't price businesses; they price files. Seven quick questions across the markers a credit desk actually reads: structure, numbers, profit, add-backs, the ATO, facilities and security. Your score and the groundwork show up immediately."
            accent
          />
        </div>
        <div className="mt-10">
          <BizCheck />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What your score means, band by band.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The check scores {SCORED.length} areas out of 10 each and averages them, so every
            area carries {weight}% of the result. The bands describe how a credit desk would
            receive the file today, and each one has a different next move.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Business borrowing health check score bands and the next move at each"
              head={["Score", "Band", "Next move"]}
              rows={BANDS.map((b, i) => {
                const upper = i === 0 ? "10" : BANDS[i - 1].min.toString();
                return [`${b.min} to ${upper}`, b.name, BAND_ACTIONS[b.name] ?? ""];
              })}
              note="The same bands the tool applies. General information only: the score weighs general markers of borrowing readiness and knows nothing about your revenue, industry or security."
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
            What a commercial credit team actually weights.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Home lending is largely a formula: income in, buffer applied, capacity out.
            Commercial lending is a judgement, made by a person reading a file, and the seven
            areas below are what that person looks for. They are scored equally here because the
            tool cannot see your numbers; in a real assessment their weight moves with the deal.
          </p>
          <div className="mt-8">
            <DataTable
              caption="The seven areas scored in the business borrowing health check and what each one measures"
              head={["Area", "Weight", "What a credit team reads into it"]}
              rows={SCORED.map((q) => [q.area, `${weight}%`, AREA_WHY[q.area] ?? q.label])}
              note="Areas and weights read directly from the model the tool scores with. Each area contributes equally to the average."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Underneath those seven, a credit team is answering three questions in order. Can the
            business service the debt from earnings it can evidence? If it stops, what is the
            security worth and how quickly can it be realised? And is the borrower the kind of
            operator who tells you about problems before you find them? The first is arithmetic,
            the second is valuation, and the third is the one that quietly decides pricing.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The numbers a credit desk sizes a deal with.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Commercial capacity is not a multiple of income. It is whichever of two limits binds
            first: what the earnings can service, and what the security supports. The typical
            security limits differ a lot by what you are buying, which is why the same business
            can be told two completely different numbers depending on the question it asked.
          </p>
          <div className="mt-8">
            <DataTable
              caption="Typical commercial lending limits by transaction type"
              head={["What you're funding", "Typical limit", "What moves it"]}
              rows={[
                [
                  "Commercial property",
                  "65% to 80% of value",
                  "Asset type, lease term and tenant quality, location, and whether you occupy it yourself",
                ],
                [
                  "Premises bought through an SMSF",
                  "Typically 60% to 80%",
                  "Fund balance and contributions, the limited recourse structure, and lender appetite",
                ],
                [
                  "Buying a business or a franchise",
                  "50% to 70% of maintainable earnings",
                  "Evidence quality of the add-backs, franchise system, and whether property security backs it",
                ],
                [
                  "Property development",
                  "65% to 80% of total development cost",
                  "Presales, builder and contract type, planning risk, and the developer's track record",
                ],
              ]}
              note="Indicative market ranges as at August 2026, not any single lender's policy and not an offer of credit. Every lender publishes its own credit policy and revises it. Serviceability is assessed separately and is often the binding constraint before the security limit is reached."
            />
          </div>
          <p className="mt-6 text-lg leading-[1.4] text-ink/80">
            Serviceability on the commercial side is usually tested as a coverage ratio rather
            than a surplus: earnings before interest and tax, or net operating income on a
            property, measured against the loan&apos;s interest and principal commitments. Which
            is why add-backs are not a technicality. Every documented dollar of maintainable
            earnings you can evidence lifts the coverage ratio and therefore the loan. Every
            undocumented one is worth nothing at all, no matter how real it is.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Where each of those sits in practice:{" "}
            <TextLink href="/commercial-property-loans">commercial property loans</TextLink> for
            premises and investment,{" "}
            <TextLink href="/smsf-mortgage-broker">SMSF lending</TextLink> if the fund is buying
            the premises your business rents,{" "}
            <TextLink href="/business-acquisition-loans">acquisition and franchise funding</TextLink>{" "}
            for buying a business, and{" "}
            <TextLink href="/development-finance">development finance</TextLink> for projects.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            Add-backs: what counts, and what evidence they need.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            A tax return is prepared to minimise tax. A credit assessment is trying to find the
            earnings the business genuinely produces. Add-backs are the bridge between the two,
            and they are the single biggest swing factor in what a small business file supports.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The ones lenders commonly accept: depreciation and amortisation, interest on debt
            being refinanced or repaid, directors&apos; wages and superannuation above a market
            salary for the role, one-off costs that will not repeat (a legal dispute, a
            relocation, a failed project), personal expenses run through the business, and rent
            paid to a related party where the property is part of the transaction. The ones they
            usually will not: optimistic forecasts, revenue that has not happened yet, and
            &quot;savings we will make once the loan settles&quot;.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Evidence is what separates the two lists. An add-back a credit team will use is one
            it can trace: a line in the financials, an invoice, a director&apos;s minute, or an
            accountant&apos;s letter that identifies the item and confirms it will not recur.
            Turning up with a number and no paper trail is worse than not raising it, because it
            invites the assessor to discount everything else you have said. This is the part
            where your accountant earns their fee, and it is why the preparation should start
            well before the deal.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            The ATO position, said plainly.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Tax debt is the most misunderstood item on a commercial file. Lenders fund businesses
            with ATO arrears every week, provided the arrears are disclosed, on a documented
            payment plan, and being met. What ends a deal is discovery: an assessor finds ATO
            payments in the bank statements that were not mentioned, and the question stops being
            about the debt and starts being about the disclosure.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            There is a second reason to deal with it early. The ATO can report business tax debts
            above a threshold to credit reporting bureaus where the business has not engaged with
            it, which turns a private problem into a credit file problem visible to every lender.
            Engaging, agreeing a plan and keeping to it is the difference. If cash flow is what
            caused the arrears in the first place, the facility, not the tax, is usually the
            thing to fix, and{" "}
            <TextLink href="/working-capital-finance">working capital finance</TextLink> is the
            conversation about matching the right facility to the actual gap.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            What to do with a low score.
          </h2>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Nothing in this check is permanent. Most low scores are three or four months of
            preparation, and the order matters more than the effort: numbers first, because
            nothing else can be assessed without them; then the ATO position, because it decides
            which lenders can look at you at all; then add-backs and security, because those set
            the price rather than the answer.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            Two moves are worth considering regardless of score. If you rent your premises, the
            rent you are already paying reliably is evidence you could service a loan on the same
            building, and{" "}
            <TextLink href="/commercial-property-loans">buying the premises</TextLink> changes
            where that money ends up. And if the existing debt has never been reviewed, an annual
            facility review is the commercial version of a repricing call: rates, fees, terms and
            covenants across every facility, compared rather than rolled over. Our{" "}
            <TextLink href="/commercial-lending">commercial lending page</TextLink> covers how
            that works, and{" "}
            <TextLink href="/business-loans">business loans</TextLink> covers the unsecured and
            cash-flow end of the market.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            If you also have a mortgage in your own name, it is worth running the{" "}
            <TextLink href="/home-loan-health-check">home loan health check</TextLink> alongside
            this one: personal debt and card limits sit in a commercial assessment too, and
            directors are usually guaranteeing both sides. The full set of tools, including{" "}
            <TextLink href="/borrowing-power-calculator">personal borrowing power</TextLink>, is
            on the <TextLink href="/calculators">calculators and checks hub</TextLink>.
          </p>
        </div>
      </section>

      <FAQ
        title="Frequently asked questions."
        faqs={FAQS}
        related={[
          { label: "Commercial lending", href: "/commercial-lending" },
          { label: "Commercial property loans", href: "/commercial-property-loans" },
          { label: "Working capital finance", href: "/working-capital-finance" },
          { label: "All calculators and checks", href: "/calculators" },
        ]}
      />
      <CtaBand
        heading="A score is a start. A funded deal is the point."
        intro="Bring your result to a free review. Jacob turns the flags into a fundable file and takes it to the lenders who want it."
        subject="Business Borrowing Health Check"
      />
    </main>
  );
}
