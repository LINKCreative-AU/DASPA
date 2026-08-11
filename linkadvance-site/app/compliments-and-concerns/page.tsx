import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

// Connective requires a published "Compliments and Concerns" procedure on a
// credit representative's website (Advertising requirements: websites). The
// external escalation path is fixed by law: an ACL holder must be a member of
// the Australian Financial Complaints Authority, and AFCA's contact details
// below are AFCA's own published details. The internal timeframes are the
// NCCP/RG 165 standard ones (acknowledge promptly, respond within 30 days).
//
// On the AFCA membership number: there is nothing to add. Connective's own
// published Compliments and Concerns page does not quote one either, and AFCA's
// consumer path is a firm-name search (my.afca.org.au/ff-search), not a member
// number. The AFCA contact block below matches Connective's page field for
// field, including the time-limits warning, which is a real consumer point and
// not boilerplate: leave it in.

export const metadata: Metadata = {
  title: "Compliments & Concerns | LINK Advance",
  description:
    "How to give LINK Advance feedback or make a complaint, what happens next, the timeframes we work to, and how to escalate to AFCA if you are not satisfied.",
  alternates: { canonical: "/compliments-and-concerns" },
};

const STEPS = [
  {
    n: "1",
    title: "Tell us",
    body: (
      <>
        Call{" "}
        <a href={SITE.phoneHref} className="font-semibold text-ink underline underline-offset-4">
          {SITE.phone}
        </a>{" "}
        and ask for the broker you have been dealing with, or use the{" "}
        <Link href="/contact-us" className="font-semibold text-ink underline underline-offset-4">
          contact form
        </Link>{" "}
        and say up front that it is a complaint so it is not treated as a new enquiry. You can
        also write to us at {SITE.address.street}, {SITE.address.suburb} {SITE.address.state}{" "}
        {SITE.address.postcode}. You do not have to put it in writing if you would rather not.
      </>
    ),
  },
  {
    n: "2",
    title: "We acknowledge it",
    body: (
      <>
        We will acknowledge your complaint promptly, and in any case within one business day of
        receiving it where we can reach you. At that point we will tell you who is handling it and
        what we need from you, if anything.
      </>
    ),
  },
  {
    n: "3",
    title: "We investigate and respond",
    body: (
      <>
        We aim to resolve most things within five business days, because most of what goes wrong
        is a communication problem that can be fixed the same week. Where a complaint needs a
        proper investigation we will give you a written response no later than 30 calendar days
        after you raised it, setting out our decision and the reasons for it.
      </>
    ),
  },
  {
    n: "4",
    title: "If you are not satisfied",
    body: (
      <>
        You can escalate to our credit licensee, Connective Credit Services Pty Ltd (Australian
        Credit Licence 389328), on 1300 65 66 37, and beyond that to the Australian Financial
        Complaints Authority. AFCA is free to consumers and its determinations bind us. You can
        go to AFCA if we have not resolved your complaint within 30 days, or sooner if you are
        unhappy with our response.
      </>
    ),
  },
];

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Compliments & concerns", path: "/compliments-and-concerns" },
        ]}
      />
      <article className="container-x max-w-3xl pb-20 pt-8">
        <h1 className="font-display text-[40px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[50px]">
          Compliments and <span className="marker">concerns.</span>
        </h1>
        <p className="mt-6 text-lg leading-[1.4] text-ink/80">
          If we have done something well, tell us: it is how we work out what to keep doing. If we
          have got something wrong, tell us that too, and tell us early. A complaint handled in the
          first week is usually still a fixable problem. One that surfaces at settlement usually
          is not.
        </p>
        <p className="mt-4 text-lg leading-[1.4] text-ink/80">
          Nothing on this page limits your rights. Using our process does not stop you going to
          AFCA, and it does not affect anything else available to you at law.
        </p>

        <h2 className="mt-14 font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          How a complaint runs.
        </h2>
        <ol className="mt-8 space-y-5">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[25px] bg-[#f1f1f1] p-7">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-2xl font-bold tabular-nums text-advance-mid">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 leading-[1.5] text-ink/80">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          Contacting AFCA.
        </h2>
        <p className="mt-4 leading-[1.5] text-ink/80">
          The Australian Financial Complaints Authority is the external dispute resolution scheme
          for credit. It is independent of us and of our licensee, and it costs you nothing to
          use. Time limits apply to complaints made to AFCA, so act promptly rather than waiting,
          and check the AFCA website for the limits that apply to your situation.
        </p>
        <div className="mt-6 rounded-[25px] bg-[#f1f1f1] p-7">
          <dl className="space-y-3 text-ink/80">
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Online</dt>
              <dd>
                <a
                  href="https://www.afca.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-advance-mid"
                >
                  afca.org.au
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Phone</dt>
              <dd>
                <a href="tel:1800931678" className="underline underline-offset-4 hover:text-advance-mid">
                  1800 931 678
                </a>{" "}
                <span className="text-ink/55">(free call)</span>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Email</dt>
              <dd>info@afca.org.au</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 font-semibold text-ink">Mail</dt>
              <dd>
                Australian Financial Complaints Authority
                <br />
                GPO Box 3, Melbourne VIC 3001
              </dd>
            </div>
          </dl>
        </div>

        <h2 className="mt-14 font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink sm:text-[44px]">
          Who you are dealing with.
        </h2>
        <p className="mt-4 leading-[1.5] text-ink/80">{SITE.legal.identity}</p>
        <p className="mt-2 leading-[1.5] text-ink/80">{SITE.legal.licence}</p>
        <p className="mt-2 leading-[1.5] text-ink/80">
          Our{" "}
          <Link
            href={SITE.legal.privacyPath}
            className="font-semibold text-ink underline underline-offset-4"
          >
            privacy policy
          </Link>{" "}
          sets out how we handle your personal information, including how to ask for access to it
          or have it corrected.
        </p>
      </article>
    </main>
  );
}
