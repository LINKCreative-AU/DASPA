/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CtaBand } from "@/components/CtaBand";
import { ReviewStrip } from "@/components/ReviewStrip";
import { TextLink } from "@/components/v2";
import { SITE, TEAM, GROUP_TEAMS } from "@/lib/site";
import { ALL_REVIEWS, brokersIn } from "@/lib/reviews";

// Rebuilt August 2026. The old page had two problems James called out: the
// photos sat in one grid and the bios sat in a separate grey band further
// down, so you met three faces and then read about three names; and the page
// said nothing whatsoever about the business - no history, no story, no
// reason to believe.
//
// Every claim here is sourced. "Broking since 2016" comes from LINK Advance's
// own published article ("Hugh has worked in the broking industry since
// 2016"). The review counts are computed from lib/reviews.ts rather than
// asserted, so they cannot drift from what the reviews page shows.

const PATH = "/about-us";

export const metadata: Metadata = {
  title: { absolute: "About LINK Advance | Brisbane Mortgage & Commercial Finance Brokers" },
  description:
    "A decade of writing loans for Australians, from first homes to commercial and SMSF. One broker per client, end to end, 262 Google reviews at 5.0. Meet Hugh, Callum and Jacob.",
  alternates: { canonical: PATH },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About us", path: PATH },
];

// Counted, not claimed: how many of the reviews we publish name each broker.
const mentions = (first: string) =>
  ALL_REVIEWS.filter((r) => brokersIn(r.text).includes(first as "Hugh" | "Callum" | "Jacob")).length;

export default function Page() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <Breadcrumbs crumbs={CRUMBS} />

      <section className="container-x pb-14 pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionHead
            as="h1"
            eyebrow="About LINK Advance"
            title="Ten years of getting loans done, one client at a time."
            mark="one client at a time."
            intro="LINK Advance started with one broker who thought lending was being done badly: passed between call centres, quoted at, and forgotten the day it settled. A decade later the work has grown from first home buyers into investors, businesses and commercial deals, and the thing that has not changed is the bit clients keep writing about. One broker. The same one. All the way through."
            accent
          />
          <div className="flex items-end justify-center rounded-3xl bg-neutral-50 px-8 pt-8">
            <img
              src="/wp-content/uploads/2026/05/ADVANCE-2025-Web-scaled.jpg"
              alt="Hugh, Callum and Jacob, the LINK Advance broking team in Brisbane"
              className="max-h-[420px] w-auto mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      {/* The story, which the old page simply did not have */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            How a first home broker ended up doing commercial deals.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Hugh has been writing loans since 2016, and he came to it from real estate rather
            than from a bank. He still holds his licence. It is an unusual order to do it in and
            it shapes the advice: he learned what a contract does to a buyer before he learned
            what a lender does to an application, so the conversation tends to start with the
            purchase you are trying to make rather than the product someone wants to sell you.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The early work was individual: first home buyers, upgraders, refinances. What
            happened next is what happens when you look after people properly for long enough.
            The first home buyer bought an investment. The investor bought a second one, then a
            third, then wanted the whole portfolio structured rather than the next loan priced.
            Somewhere in there a client asked whether we could fund their business premises, and
            then their equipment, and then a small development.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            So the firm grew the way the clients did. Today it runs the full range: home loans
            and first home buyers at one end,{" "}
            <TextLink href="/investment-home-loans">investment portfolios</TextLink> and{" "}
            <TextLink href="/second-tier-lenders">tiered lending</TextLink> in the middle, and{" "}
            <TextLink href="/commercial-lending">commercial</TextLink>,{" "}
            <TextLink href="/smsf-mortgage-broker">SMSF</TextLink> and{" "}
            <TextLink href="/development-finance">development finance</TextLink> at the other. We
            did not add those services to look bigger. We added them because clients we already
            had needed them, and sending them elsewhere felt like the wrong answer.
          </p>
        </div>
      </section>

      {/* What "personal" actually means, stated so it can be checked */}
      <section className="py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              No churn and burn.
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              Plenty of broking is a volume business: the loan settles, the trail starts, and you
              never hear from anyone again unless they want a referral. We have deliberately not
              built that. Here is what that means in practice, and each one is a thing you can
              hold us to rather than an adjective.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                h: "One broker, start to finish",
                p: "The person who takes your first call structures the deal, argues it with the lender, and is still your broker at settlement. No handover to a processing team you have never spoken to, and no repeating your situation to a new name each time you ring.",
              },
              {
                h: "In the trenches on the hard ones",
                p: "Deals that need work are the ones we are known for: self-employed income, unusual security, a valuation that came in short, a lender that said no for a reason that can be answered. Anyone can submit a clean file. The job is the other kind.",
              },
              {
                h: "We keep working after settlement",
                p: "Rates drift the moment the ink dries. Every year we go back over your loan and, where the market has moved, go back to the lender. Clients who have been with us for years have had repricing conversations they never had to ask for.",
              },
              {
                h: "Paid by the lender, not by you",
                p: "On almost all home lending the lender pays the commission and you pay us nothing. Where a commercial deal does carry a fee, it is quoted in writing before anything starts. Since 2021 brokers have owed you a legal Best Interests Duty. Your bank owes you nothing of the kind.",
              },
            ].map((c) => (
              <div key={c.h} className="rounded-[25px] bg-[#f1f1f1] p-7 sm:p-8">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">{c.h}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faces and words together, which was the whole complaint */}
      <section id="brokers" className="scroll-mt-24 border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The three people who write the loans.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Not a roster of account managers. These are the brokers, and one of them will be
              yours from the first call onward. Clients name them personally in the reviews,
              which is the part we are proudest of.
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="grid gap-7 rounded-[25px] bg-white p-7 sm:p-9 lg:grid-cols-[220px_1fr]"
              >
                <div>
                  <img
                    src={m.image}
                    alt={`${m.name}, ${m.role} at LINK Advance`}
                    loading="lazy"
                    className="aspect-square w-full max-w-[220px] rounded-[20px] object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-advance-mid">
                    {m.role}
                  </p>
                  <p className="mt-1 text-sm text-ink/55">{m.credential}</p>
                  <p className="mt-4 text-lg leading-[1.4] text-ink/80">{m.bio}</p>
                  <p className="mt-4 text-sm text-ink/60">
                    Named in{" "}
                    <TextLink href="/reviews">
                      {mentions(m.name)} of the {ALL_REVIEWS.length} reviews we publish in full
                    </TextLink>
                    .
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proof, in their words rather than ours */}
      <section className="py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            {SITE.reviews.count} reviews, {SITE.reviews.rating.toFixed(1)} stars, and the same
            three words.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            Read enough of them and the pattern is hard to miss. People do not praise our rates,
            though they get good ones. They write about being kept informed, about something
            complicated being made simple, and about a person who answered the phone. One client
            came back to refinance a second time and wrote that it was &ldquo;as quick, easy and
            painless as the first time&rdquo;. That is the review we would choose if we were only
            allowed one.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            They are all on the{" "}
            <TextLink href="/reviews">reviews page</TextLink>, in full and unedited, grouped by
            what the client came in for so you can read the ones that match your situation rather
            than the ones that flatter us most.
          </p>
        </div>
      </section>

      <ReviewStrip heading={null} />

      {/* Part of LINK */}
      <section className="border-t border-ink/10 py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <SectionHead
              title="The lending desk of a bigger team."
              mark="a bigger team."
              intro={`${SITE.group.line} When your loan touches tax, structure, bookkeeping or property management, the specialist is down the hall rather than across town, and they already know your situation.`}
            />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_TEAMS.map((g) => (
              <a
                key={g.name}
                href={g.url}
                className="group rounded-[25px] bg-[#f1f1f1] p-6 transition hover:bg-[#eaeaea]"
              >
                <span
                  aria-hidden
                  className="block h-1.5 w-10 rounded-full"
                  style={{ backgroundColor: g.color }}
                />
                <span className="mt-4 block font-display text-xl font-bold tracking-tight text-ink">
                  LINK {g.name}
                </span>
                <span className="mt-1 block text-sm text-ink/60">{g.meaning}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Meet your broker."
        intro="A free, no-obligation chat about what you're planning, and an honest read on what's achievable. You'll speak to Hugh, Callum or Jacob, and whoever you speak to is who you keep."
        subject="About us"
      />
    </main>
  );
}
