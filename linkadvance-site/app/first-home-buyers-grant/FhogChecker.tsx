"use client";

import { useRef, useState } from "react";

import { FHOG_AMOUNT, QUESTIONS, fhogMoney } from "./model";

// The FHOG QLD eligibility checker, reworked as a standalone answer-anywhere
// tool: all seven tests on screen as compact cards, a sticky live verdict
// panel that updates on every tap. No splash, no start button; a searcher
// landing from Google answers immediately. General information only, the
// verdict says "likely", names qld.gov.au, and routes to a broker for the
// real check.

export function FhogChecker() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  const answeredCount = QUESTIONS.filter((x) => answers[x.key] != null).length;
  const remaining = QUESTIONS.length - answeredCount;
  const complete = remaining === 0;
  const fails = QUESTIONS.filter((x) => x.options[answers[x.key]]?.pass === false);
  const maybes = QUESTIONS.filter((x) => answers[x.key] != null && x.options[answers[x.key]]?.pass === null);
  const likely = fails.length === 0;

  const pick = (qKey: string, oi: number) => {
    const next = { ...answers, [qKey]: oi };
    setAnswers(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nextQ = QUESTIONS.find((x) => next[x.key] == null);
    if (nextQ) cardRefs.current[nextQ.key]?.scrollIntoView({ behavior: "smooth", block: "center" });
    else panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const restart = () => setAnswers({});

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* LEFT: every question, ready to answer */}
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="font-display text-[34px] font-normal leading-[1.15] tracking-tight text-ink">
            Check your <strong className="font-bold">{fhogMoney(FHOG_AMOUNT)} grant eligibility.</strong>
          </h2>
          <p className="mt-2 max-w-xl text-ink/60">
            Seven quick questions, the same tests the QLD Government applies. Your answer shows
            straight away, no details required.
          </p>
        </div>
        {QUESTIONS.map((q, qi) => {
          const picked = answers[q.key];
          const done = picked != null;
          return (
            <div
              key={q.key}
              ref={(el) => {
                cardRefs.current[q.key] = el;
              }}
              className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-advance-light text-ink" : "bg-neutral-100 text-ink/45"
                  }`}
                  aria-hidden
                >
                  {done ? "✓" : qi + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                    {q.label}
                  </p>
                  {q.hint && <p className="mt-1.5 text-sm text-ink/55">{q.hint}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {q.options.map((o, oi) => (
                      <button
                        key={o.label}
                        onClick={() => pick(q.key, oi)}
                        aria-pressed={picked === oi}
                        className={`rounded-full border px-4 py-2 text-left text-sm font-semibold transition ${
                          picked === oi
                            ? "border-ink bg-ink text-white"
                            : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: the live verdict */}
      <div
        ref={panelRef}
        className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">FHOG QLD check</p>
          <span className="shrink-0 text-xs font-semibold text-white/60">
            {answeredCount} of {QUESTIONS.length} answered
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-advance-bright transition-all duration-300"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h3 className="mt-6 font-display text-2xl font-bold leading-[1.15] tracking-tight">
          {complete
            ? likely
              ? maybes.length > 0
                ? "Likely eligible, with a couple of things to confirm."
                : "You look likely to be eligible."
              : "The grant looks unlikely, but don't stop here."
            : fails.length > 0
              ? "The grant looks unlikely so far."
              : `Answer ${remaining} more to confirm.`}
        </h3>

        {complete ? (
          likely ? (
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              On your answers, you pass the tests the {fhogMoney(FHOG_AMOUNT)} FHOG QLD turns on
              {maybes.length > 0 && ", subject to the items below"}. The formal check happens
              with your application (your broker or lender lodges it, usually so the grant is
              available at settlement), and the official rules live at qld.gov.au.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              One or more answers rule the grant out on the standard tests, but first home
              buyers routinely save more from stamp duty concessions and the 5% deposit First
              Home Guarantee than from the grant itself. Worth five minutes with a broker before
              you write anything off.
            </p>
          )
        ) : fails.length > 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            An answer below rules the grant out on the standard tests. Keep going: the full
            picture (and what still stacks up instead) shows when all seven are answered.
          </p>
        ) : answeredCount > 0 ? (
          <p className="mt-3 text-sm leading-relaxed text-white/70">No blockers in your answers so far.</p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Tap an answer on any question to begin. The verdict updates here as you go.
          </p>
        )}

        {(fails.length > 0 || maybes.length > 0) && (
          <ul className="mt-5 space-y-3">
            {[...fails, ...maybes].map((x) => {
              const opt = x.options[answers[x.key]];
              return (
                <li key={x.key} className="rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/75">
                  <span className={`font-bold ${opt.pass === false ? "text-white" : "text-advance-bright"}`}>
                    {opt.pass === false ? "Rules it out: " : "To confirm: "}
                  </span>
                  {opt.why ?? x.label}
                </li>
              );
            })}
          </ul>
        )}

        {(complete || fails.length > 0) && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn bg-white text-ink hover:bg-neutral-100">
              Get it confirmed for free
            </a>
            <a
              href="/first-home-guarantee"
              className="text-sm font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2 hover:decoration-advance-bright"
            >
              Also check the 5% deposit Guarantee →
            </a>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-white/45">
          General information only, based on the published QLD eligibility tests, not a
          determination. Official rules: qld.gov.au.{" "}
          {answeredCount > 0 && (
            <button onClick={restart} className="font-semibold underline">
              Retake
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
