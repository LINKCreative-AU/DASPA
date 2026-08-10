"use client";

import { useState } from "react";
import { Icon } from "./Icons";

// The "what are you here for" switch. Personal and commercial lending are two
// different conversations, so the page asks once and shows the right set.
//
// Both panels are always in the DOM and the inactive one is hidden, never
// conditionally rendered: every lane link stays crawlable from the homepage,
// which is the whole point of having them here.

type Lane = { label: string; href: string; note: string; icon: React.ReactNode };

const PERSONAL: Lane[] = [
  { label: "Home loans", href: "/home-loans-brisbane", note: "The big one, done properly", icon: <Icon.home /> },
  { label: "First home buyers", href: "/first-home-buyers-loan", note: "5% deposit paths and the $30k grant", icon: <Icon.key /> },
  { label: "Refinancing", href: "/refinancing-brisbane", note: "Or we make your lender price-match", icon: <Icon.tag /> },
  { label: "Investment loans", href: "/investment-home-loans", note: "Structure for the portfolio", icon: <Icon.trendingUp /> },
  { label: "Bridging loans", href: "/bridging-loans", note: "Buy the next one before this one sells", icon: <Icon.clock /> },
  { label: "Construction loans", href: "/construction-loans-brisbane", note: "Staged like the build", icon: <Icon.wrench /> },
  { label: "SMSF loans", href: "/smsf-mortgage-broker", note: "Property inside super", icon: <Icon.shieldCheck /> },
  { label: "Doctors & professionals", href: "/home-loans-for-doctors", note: "LMI waived for eligible professions", icon: <Icon.star /> },
];

const COMMERCIAL: Lane[] = [
  { label: "Commercial property", href: "/commercial-property-loans", note: "Premises, investment, or through your SMSF", icon: <Icon.home /> },
  { label: "Working capital", href: "/working-capital-finance", note: "Overdrafts, invoice finance, trade", icon: <Icon.dollar /> },
  { label: "Business acquisition", href: "/business-acquisition-loans", note: "Buy the business, funded properly", icon: <Icon.trophy /> },
  { label: "Development finance", href: "/development-finance", note: "Site to settlement, in stages", icon: <Icon.wrench /> },
  { label: "Business loans", href: "/business-loans", note: "Growth and cash-flow lending", icon: <Icon.trendingUp /> },
  { label: "Equipment & vehicles", href: "/business-car-and-equipment-loans", note: "Often approved in days", icon: <Icon.rocket /> },
];

function Grid({ lanes, hidden }: { lanes: Lane[]; hidden: boolean }) {
  return (
    // `display:grid` from Tailwind beats the [hidden] UA rule, so the class
    // list itself has to switch, not just the attribute.
    <div
      hidden={hidden}
      className={hidden ? "hidden" : "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}
    >
      {lanes.map((s) => (
        <a
          key={s.href}
          href={s.href}
          className="group rounded-[25px] bg-[#f1f1f1] p-6 transition hover:bg-advance-light"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ink">
            {s.icon}
          </span>
          <p className="font-display text-lg font-bold tracking-tight text-ink">
            {s.label}
            <span className="text-advance">.</span>
          </p>
          <p className="mt-1.5 text-sm text-ink/60">{s.note}</p>
          <p className="mt-4 text-sm font-semibold text-ink/40 transition group-hover:text-ink">
            Learn more →
          </p>
        </a>
      ))}
    </div>
  );
}

export function LaneChooser() {
  const [lane, setLane] = useState<"personal" | "commercial">("personal");

  const Tab = ({ id, label, sub }: { id: "personal" | "commercial"; label: string; sub: string }) => {
    const on = lane === id;
    return (
      <button
        onClick={() => setLane(id)}
        aria-pressed={on}
        className={`flex-1 rounded-[25px] px-6 py-5 text-left transition ${
          on ? "bg-ink text-white" : "bg-[#f1f1f1] text-ink hover:bg-advance-light"
        }`}
      >
        <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          {label}
          <span className={on ? "text-advance-bright" : "text-advance"}>.</span>
        </span>
        <span className={`mt-1 block text-sm ${on ? "text-white/65" : "text-ink/60"}`}>{sub}</span>
      </button>
    );
  };

  return (
    <div>
      <div
        className="flex flex-col gap-3 sm:flex-row"
        role="group"
        aria-label="Choose personal or commercial lending"
      >
        <Tab id="personal" label="For you" sub="Home, first home, refinance, investment" />
        <Tab id="commercial" label="For your business" sub="Premises, working capital, acquisition" />
      </div>

      <Grid lanes={PERSONAL} hidden={lane !== "personal"} />
      <Grid lanes={COMMERCIAL} hidden={lane !== "commercial"} />

      <p className="mt-8 text-sm font-semibold text-ink/60">
        {lane === "personal" ? (
          <a href="/home-loans-brisbane" className="text-ink/75 underline-offset-4 hover:text-ink hover:underline">
            All personal lending →
          </a>
        ) : (
          <a href="/commercial-lending" className="text-ink/75 underline-offset-4 hover:text-ink hover:underline">
            The commercial lending desk →
          </a>
        )}
      </p>
    </div>
  );
}
