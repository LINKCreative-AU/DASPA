"use client";

import { useCallback, useEffect, useState } from "react";

// The FHOG QLD eligibility checker - the house wizard pattern (one question
// per screen, auto-advance, keyboard keys) applied to the seven tests the
// grant actually turns on. This page already ranks #1 for the eligibility
// cluster; the SERP is static explainers, so an interactive checker is the
// union play. General information only - the verdict says "likely", names
// qld.gov.au, and routes to a broker for the real check.

type Q = {
  key: string;
  label: string;
  hint?: string;
  options: { label: string; pass: boolean | null; why?: string }[];
};

const QUESTIONS: Q[] = [
  {
    key: "age",
    label: "Are you 18 or older, applying as a person (not a company or trust)?",
    options: [
      { label: "Yes", pass: true },
      { label: "No", pass: false, why: "The grant is only available to natural persons aged 18+ - companies and trusts can't apply." },
    ],
  },
  {
    key: "resident",
    label: "Is at least one applicant an Australian citizen or permanent resident?",
    options: [
      { label: "Yes", pass: true },
      { label: "No", pass: false, why: "At least one applicant must be an Australian citizen or permanent resident." },
    ],
  },
  {
    key: "priorGrant",
    label: "Have you or your spouse ever received a First Home Owner Grant anywhere in Australia?",
    options: [
      { label: "No, never", pass: true },
      { label: "Yes", pass: false, why: "A previous FHOG (yours or your spouse's, in any state) rules the grant out." },
    ],
  },
  {
    key: "priorHome",
    label: "Have you or your spouse ever owned AND lived in a property in Australia?",
    hint: "Owning an investment property you never lived in may still be OK.",
    options: [
      { label: "No - never owned, or only an investment we never lived in", pass: true },
      { label: "Yes - owned and lived in one", pass: false, why: "Having owned and occupied a home before rules the grant out - though investment-only ownership can survive the test; worth checking properly." },
    ],
  },
  {
    key: "newHome",
    label: "Is the home brand new, off the plan, a new build, or substantially renovated?",
    hint: "Cosmetic work (paint, sanded floors) doesn't count as substantial renovation.",
    options: [
      { label: "Yes - new, off the plan, building, or substantially renovated", pass: true },
      { label: "No - an established home", pass: false, why: "The QLD grant only applies to new or substantially renovated homes - but established-home buyers still get stamp duty concessions, which can be worth even more." },
    ],
  },
  {
    key: "value",
    label: "Will the total value - home plus land - be $750,000 or less?",
    options: [
      { label: "Yes, $750k or under", pass: true },
      { label: "No, over $750k", pass: false, why: "The grant caps total value (home + land) at $750,000." },
      { label: "Not sure yet", pass: null },
    ],
  },
  {
    key: "live",
    label: "Will you live in the home for at least 6 months within the first year?",
    options: [
      { label: "Yes", pass: true },
      { label: "No / not sure", pass: null, why: "The residence requirement is six continuous months within the first year - if that's uncertain, it's worth a conversation before you commit." },
    ],
  },
];

export function FhogChecker() {
  const [stage, setStage] = useState<"intro" | "q" | "result">("intro");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState(false);
  const q = QUESTIONS[qi];

  const pick = useCallback(
    (oi: number) => {
      if (locked) return;
      setAnswers((a) => ({ ...a, [q.key]: oi }));
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        if (qi + 1 < QUESTIONS.length) setQi(qi + 1);
        else setStage("result");
      }, 320);
    },
    [locked, q, qi]
  );

  useEffect(() => {
    if (stage !== "q") return;
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) pick(n - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [stage, q, pick]);

  const restart = () => {
    setAnswers({});
    setQi(0);
    setStage("intro");
  };

  if (stage === "intro") {
    return (
      <div className="rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-14">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
          Check your <strong className="font-bold">$30,000 grant eligibility.</strong>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">
          Seven quick questions - the same tests the QLD Government applies. Your answer shows
          straight away, no details required.
        </p>
        <button
          onClick={() => setStage("q")}
          className="mt-7 inline-flex h-11 items-center gap-2.5 rounded-full bg-white pl-5 pr-2.5 text-lg font-semibold text-ink transition hover:opacity-85"
        >
          Start the check
          <span className="inline-flex h-[23px] w-[23px] items-center justify-center rounded-full bg-ink">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    );
  }

  if (stage === "result") {
    const fails = QUESTIONS.filter((x) => x.options[answers[x.key]]?.pass === false);
    const maybes = QUESTIONS.filter((x) => x.options[answers[x.key]]?.pass === null);
    const likely = fails.length === 0;
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-8 sm:p-10">
        <p className="eyebrow">
          <span className="text-advance">Your result</span>
        </p>
        <h3 className="mt-3 font-display text-3xl font-normal tracking-tight text-ink">
          {likely
            ? maybes.length > 0
              ? "Likely eligible - with a couple of things to confirm."
              : "You look likely to be eligible."
            : "The grant looks unlikely - but don't stop here."}
        </h3>
        {likely ? (
          <p className="mt-3 max-w-2xl text-ink/65">
            On your answers, you pass the tests the $30,000 FHOG QLD turns on
            {maybes.length > 0 && " - subject to the items below"}. The formal check happens
            with your application (your broker or lender lodges it, usually so the grant is
            available at settlement), and the official rules live at qld.gov.au.
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-ink/65">
            One or more answers rule the grant out on the standard tests - but first home
            buyers routinely save more from stamp duty concessions and the 5% deposit First
            Home Guarantee than from the grant itself. Worth five minutes with a broker before
            you write anything off.
          </p>
        )}
        {(fails.length > 0 || maybes.length > 0) && (
          <ul className="mt-5 space-y-3">
            {[...fails, ...maybes].map((x) => {
              const opt = x.options[answers[x.key]];
              return (
                <li key={x.key} className="rounded-2xl bg-neutral-50 p-4 text-sm text-ink/70">
                  <span className={`font-bold ${opt.pass === false ? "text-ink" : "text-advance"}`}>
                    {opt.pass === false ? "Rules it out: " : "To confirm: "}
                  </span>
                  {opt.why ?? x.label}
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a href="#contact" className="btn btn-primary">
            Get it confirmed - free
          </a>
          <a href="/first-home-guarantee" className="text-sm font-semibold text-advance underline decoration-advance/30 underline-offset-2 hover:decoration-advance">
            Also check the 5% deposit Guarantee →
          </a>
        </div>
        <p className="mt-5 text-xs text-ink/45">
          General information only, based on the published QLD eligibility tests - not a
          determination. Official rules: qld.gov.au. <button onClick={restart} className="font-semibold underline">Retake</button>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
      <style>{`
        @keyframes fcRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .fc-rise { animation: fcRise .45s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .fc-rise { animation: none; } }
      `}</style>
      <div className="h-1.5 bg-neutral-100">
        <div
          className="h-full bg-advance transition-all duration-300"
          style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
        />
      </div>
      <div key={q.key} className="fc-rise flex min-h-[320px] flex-col justify-center px-8 py-10 sm:px-12">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">
            <span className="text-advance">FHOG QLD check</span>
          </p>
          <span className="text-xs font-semibold text-ink/40">
            {qi + 1} of {QUESTIONS.length}
          </span>
        </div>
        <p className="mt-5 max-w-2xl font-display text-[24px] font-semibold leading-tight tracking-tight text-ink sm:text-[30px]">
          {q.label}
        </p>
        {q.hint && <p className="mt-3 max-w-xl text-base text-ink/55">{q.hint}</p>}
        <div className="mt-7 flex flex-col items-start gap-2.5">
          {q.options.map((o, oi) => (
            <button
              key={o.label}
              onClick={() => pick(oi)}
              className={`rounded-full border-2 px-5 py-2.5 text-left text-base font-semibold transition ${
                answers[q.key] === oi
                  ? "border-transparent bg-advance text-white"
                  : "border-ink/15 bg-white text-ink/70 hover:border-ink"
              }`}
            >
              <span className="mr-2 text-xs opacity-50">{oi + 1}</span>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-ink/10 px-8 py-4">
        <button
          onClick={() => (qi > 0 ? setQi(qi - 1) : restart())}
          className="text-sm font-semibold text-ink/50 hover:text-ink"
        >
          ← Back
        </button>
        <span className="text-xs font-semibold text-ink/35">keys 1-{q.options.length} work</span>
      </div>
    </div>
  );
}
