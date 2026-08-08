/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { TeamGrid } from "@/components/TeamGrid";
import { CtaBand } from "@/components/CtaBand";
import { SITE, TEAM } from "@/lib/site";

// NEW page - every sibling site fronts a named person (Chris on Advisors,
// Emma on Books, Brad on Living). Richard fronts Wealth: this page carries
// the Person schema, AR number and FSG that E-E-A-T wants on a YMYL site.

const PATH = "/team";

export const metadata: Metadata = {
  title: "Meet the Team | Richard Leal & LINK Wealth",
  description:
    "Meet your financial force: Richard Leal (Managing Director, AR 327265) and the LINK Wealth team in Fortitude Valley, Brisbane. Licensed financial advisers backed by the LINK group.",
  alternates: { canonical: PATH },
};

function richardSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/team#richard-leal`,
    name: "Richard Leal",
    jobTitle: "Managing Director",
    worksFor: { "@id": `${SITE.url}/#firm` },
    image: `${SITE.url}/wp-content/uploads/2026/06/Richard-Wealth-1024-x-1024-Grey-Square-768x768.jpg`,
    description:
      "Richard Leal (AR 327265) is the Managing Director of LINK Wealth and an authorised representative of Millennium 3 Financial Services Pty Ltd (AFSL 244252), advising business owners and professionals on retirement, SMSF, property and investment strategy.",
    knowsAbout: [
      "Financial planning",
      "Retirement planning",
      "SMSF commercial property",
      "Debt recycling",
      "Personal insurance",
    ],
    identifier: {
      "@type": "PropertyValue",
      propertyID: "ASIC Authorised Representative Number",
      value: "327265",
    },
  };
}

export default function Team() {
  return (
    <main>
      <JsonLd
        data={[
          richardSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The team", path: PATH },
          ]),
        ]}
      />
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "The team", path: PATH }]} />

      {/* Richard */}
      <section className="container-x grid items-center gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <SectionHead
            as="h1"
            eyebrow="The team"
            title="Meet your financial force."
            mark="financial force."
            intro="Get expert guidance when you need it most with one-on-one collaboration an agile, responsive advisory team who adapts as your goals and circumstances evolve."
            accent
          />
          <div className="mt-8 rounded-3xl border border-ink/10 bg-neutral-50 p-7">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Richard Leal · Managing Director
            </h2>
            <p className="mt-3 text-ink/70">
              Richard leads the advice team and runs every LINK Wealth strategy workshop. He
              is an authorised representative (AR 327265) of Millennium 3 Financial Services
              Pty Ltd (AFSL 244252), and specialises in integrated strategies that connect
              property, tax, investments and superannuation - the big-picture approach the
              whole firm is built on.
            </p>
            <p className="mt-3 text-sm text-ink/55">
              Credentials and how we&apos;re paid:{" "}
              <a
                href={SITE.legal.fsgPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-wealth underline decoration-wealth/30 underline-offset-2 hover:decoration-wealth"
              >
                Advisor Profile &amp; Financial Services Guide
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/contact" className="btn btn-primary">
                Book a call with Richard
              </a>
              <a href="/case-studies" className="btn btn-ghost">
                See client outcomes
              </a>
            </div>
          </div>
        </div>
        <img
          src="/wp-content/uploads/2026/06/Richard-Wealth-1024-x-1024-Grey-Square-768x768.jpg"
          alt="Richard Leal, Managing Director of LINK Wealth"
          className="hidden aspect-square w-full rounded-3xl object-cover lg:block"
        />
      </section>

      <TeamGrid heading="The whole team." eyebrow="Everyone you'll deal with" members={TEAM} />

      {/* The group behind the team */}
      <section className="border-t border-ink/10 py-20">
        <div className="container-x max-w-3xl">
          <SectionHead
            eyebrow="Behind the advice"
            title="One connected group."
            intro={`${SITE.group.line} When your strategy needs an accountant, a broker or a property manager, the specialist is one warm introduction away - with your consent, working from the same picture of your finances.`}
          />
        </div>
      </section>

      <CtaBand subject="Team page" />
    </main>
  );
}
