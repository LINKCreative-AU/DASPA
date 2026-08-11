/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { CtaBand } from "@/components/CtaBand";
import { ReviewStrip } from "@/components/ReviewStrip";
import { TextLink } from "@/components/v2";
import { SITE, TEAM, GROUP_TEAMS } from "@/lib/site";
import { ALL_REVIEWS, PRAISES, brokersIn } from "@/lib/reviews";

// Rebuilt August 2026, then reordered after James read it.
//
// The order is deliberate and it is not the order a company would naturally
// write in. Most visitors reach this page from the "Meet the brokers" item in
// the nav, so the brokers come second, straight after the hero, rather than
// fourth behind the firm's history. Story, proof and the group follow, in the
// order a reader earns the right to care about them.
//
// Every claim is sourced or counted. "Broking since 2016" comes from LINK
// Advance's own published article. The review numbers are computed from
// lib/reviews.ts, so they cannot drift from the reviews page.

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

const mentions = (first: string) =>
  ALL_REVIEWS.filter((r) => brokersIn(r.text).includes(first as "Hugh" | "Callum" | "Jacob")).length;

// What clients actually single out, counted from the reviews rather than
// chosen by us. This is the payoff for the heading below it: the earlier
// version promised "the same three words" and then never said what they were.
const PRAISE_COUNT = PRAISES.map((p) => ({
  label: p,
  n: ALL_REVIEWS.filter((r) => r.praise.includes(p)).length,
})).sort((a, b) => b.n - a.n);

const PRAISE_GLOSS: Record<string, string> = {
  Communication:
    "Being told where things are up to before you have to ask. It is the single most common thing in the pile, and it is also the cheapest thing for a broker to get right and the most common thing to get wrong.",
  "Made it simple":
    "Someone taking a process with thirty moving parts and handing back three decisions. Clients use the words easy, smooth and painless, usually about something that was none of those things underneath.",
  "Knew their stuff":
    "Answers rather than callbacks. Reviews mentioning this tend to be the harder files: unusual income, a complex market, a structure question that needed a real opinion.",
  "Better rate":
    "The outcome everyone assumes they are shopping for, and the thing clients mention least. Worth noticing.",
};

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
            intro="Brisbane brokers for first home buyers, investors and businesses. Whatever you are borrowing for, one broker takes it from the first phone call to settlement and stays your broker afterwards: not a call centre, not a handover, not a new name every time you ring. That model is the whole reason the firm exists, and after a decade and 262 five-star reviews it is still the thing clients write about most."
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

      {/* Brokers first: most people arrive here from "Meet the brokers". */}
      <section id="brokers" className="scroll-mt-24 border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              Meet the brokers.
            </h2>
            <p className="mt-4 text-lg leading-[1.4] text-ink/80">
              Three of them, and one will be yours. They write the loans themselves, which is why
              clients name them personally in the reviews rather than thanking a company.
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

      {/* The promise, in checkable pieces. Previously headed "No churn and
          burn", which is our phrase for the problem, not the client's. */}
      <section className="py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What working with us actually looks like.
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              A lot of broking is a volume business: the loan settles, the trail commission
              starts, and nobody calls you again. Four things we do differently, written so you
              can hold us to them rather than take our word for it.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                h: "The same broker, first call to settlement",
                p: "Whoever takes your first call structures the deal, argues it with the lender and is still your broker on settlement day. No handover to a processing team, and no explaining your situation twice.",
              },
              {
                h: "We take the deals that need work",
                p: "Self-employed income, unusual security, a valuation that came in short, a lender that said no for a reason that can be answered. Anyone can submit a straightforward file. The rest is the job.",
              },
              {
                h: "We keep working after settlement",
                p: "Rates drift the moment the ink dries. Every year we review your loan and, where the market has moved, go back to the lender for you. Clients get repricing conversations they never had to ask for.",
              },
              {
                h: "The lender pays us, not you",
                p: "On almost all home lending the lender pays our commission and you pay nothing. Where a commercial deal carries a fee, it is quoted in writing before anything starts. Since 2021 brokers owe you a legal Best Interests Duty. Your bank owes you nothing of the kind.",
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

      {/* The story, reframed. It used to be headed "How a first home broker
          ended up doing commercial deals", which led on a limitation and
          read as a joke at our own expense. The truth is better: the range
          grew because the clients did. */}
      <section className="border-y border-ink/10 bg-neutral-50 py-20">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
            We grew because our clients did.
          </h2>
          <p className="mt-5 text-lg leading-[1.4] text-ink/80">
            LINK Advance started in residential lending: first home buyers, upgraders,
            refinances. Ten years on we write commercial, SMSF and development finance too, and
            the reason is not a growth plan. It is that the people we looked after kept needing
            more.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            The first home buyer bought an investment. The investor bought a second, then a
            third, then wanted the portfolio structured rather than the next loan priced. A
            client asked whether we could fund their business premises, then their equipment,
            then a small development. Each time the honest options were to learn it properly or
            hand the client to someone else, and handing them on was never really an option.
          </p>
          <p className="mt-4 text-lg leading-[1.4] text-ink/80">
            So the range today runs the whole way:{" "}
            <TextLink href="/first-home-buyers-loan">first home buyers</TextLink> and{" "}
            <TextLink href="/home-loans-brisbane">home loans</TextLink> at one end,{" "}
            <TextLink href="/investment-home-loans">investment portfolios</TextLink> and{" "}
            <TextLink href="/second-tier-lenders">tiered lending</TextLink> through the middle,
            and <TextLink href="/commercial-lending">commercial</TextLink>,{" "}
            <TextLink href="/smsf-mortgage-broker">SMSF</TextLink> and{" "}
            <TextLink href="/development-finance">development finance</TextLink> at the other.
            One team, so a client who started with a $450,000 first home does not need a new
            broker the day they buy a warehouse.
          </p>
        </div>
      </section>

      {/* Proof, and this time the heading pays off: the things clients single
          out are named and counted, not teased. */}
      <section className="py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              What {SITE.reviews.count} clients keep saying.
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              We tagged every review we publish by what the client singled out. The ranking is
              the interesting part: rate comes last, and it is not close.
            </p>
          </div>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {PRAISE_COUNT.map((p) => (
              <div key={p.label} className="rounded-[25px] border border-ink/10 p-7">
                <dt className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl font-bold tracking-tight text-ink">
                    {p.label}
                  </span>
                  <span className="shrink-0 font-display text-2xl font-semibold tabular-nums text-advance">
                    {p.n}
                    <span className="ml-1 text-sm font-normal text-ink/40">
                      /{ALL_REVIEWS.length}
                    </span>
                  </span>
                </dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink/75">
                  {PRAISE_GLOSS[p.label]}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-3xl text-lg leading-[1.4] text-ink/80">
            One client came back to refinance a second time and wrote that it was &ldquo;as
            quick, easy and painless as the first time&rdquo;. Of everything on this page, a
            repeat client is the line we would keep. Every review is on the{" "}
            <TextLink href="/reviews">reviews page</TextLink> in full and unedited, grouped by
            what the client came in for.
          </p>
        </div>
      </section>

      <ReviewStrip heading={null} />

      {/* The dull facts, which belong on an about page: who you are dealing
          with, from where, under whose licence. Anyone comparing brokers
          properly looks for exactly this, and most sites bury it in a footer. */}
      <section className="border-t border-ink/10 py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
              The details, for the record.
            </h2>
            <p className="mt-5 text-lg leading-[1.4] text-ink/80">
              Worth checking on any broker before you hand over your financials, and rarely put
              anywhere you can find it.
            </p>
          </div>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Where we are",
                d: `${SITE.address.street}, ${SITE.address.suburb} ${SITE.address.state} ${SITE.address.postcode}. Meetings in person here, or over a call if that suits you better.`,
              },
              {
                t: "Who we lend for",
                d: "Brisbane based and Queensland focused on property, but the lending itself is written Australia wide. Duty and grants are state by state; serviceability is not.",
              },
              {
                t: "The lender panel",
                d: "35+ lenders across the majors, the non-banks and the private end. Which one suits you is a policy question, not a rate question, and it changes month to month.",
              },
              {
                t: "Our licence",
                d: SITE.legal.publisher,
              },
            ].map((f) => (
              <div key={f.t}>
                <dt className="font-display text-lg font-bold tracking-tight text-ink">{f.t}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/70">{f.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

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
