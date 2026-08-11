"use client";

import { useRef, useState } from "react";

import { BANDS, QUESTIONS, SCORED, qScore, type Question, type Selections } from "./model";


// The Business Borrowing Health Check, reworked as a standalone
// answer-anywhere tool: every question on screen as a compact card (tap
// chips, tick-all where several answers are true at once), with a sticky
// live results panel that rescores on every answer. No splash, no start
// button. The seven markers a commercial credit desk actually reads:
// structure, numbers, profit, add-backs, the ATO, facilities and security.
// The lead still carries the whole profile so Jacob opens the call informed.

type Pathway = { title: string; body: string; href: string; linkLabel: string };

function buildPathways(sel: Selections): Pathway[] {
  const ctx = new Set(sel["context"] ?? []);
  const rents = ctx.has(0);
  const buying = ctx.has(2);
  const tight = ctx.has(3);
  const shortDebt = ctx.has(4);

  const out: Pathway[] = [];
  if (rents) {
    out.push({
      title: "The rent could be buying your premises.",
      body: "Businesses that pay rent reliably can usually pay a loan instead, including through an SMSF, where the rent goes to your own retirement. The premises conversation is Jacob's favourite.",
      href: "/commercial-property-loans",
      linkLabel: "How premises lending works",
    });
  }
  if (buying) {
    out.push({
      title: "A purchase reads best when the file is ready first.",
      body: "Whether it's property, a business or equipment, the funding terms are set by the file you bring. Preparing it before the deal beats explaining it after.",
      href: "/business-acquisition-loans",
      linkLabel: "How acquisition funding works",
    });
  }
  if (tight || shortDebt) {
    out.push({
      title: "Cash-flow lending, structured instead of stacked.",
      body: shortDebt
        ? "Stacked short-term loans are the most expensive debt in mainstream lending. Consolidating them into one properly structured facility is often the fastest money a broker can save you."
        : "The right facility for the gap (invoice finance, overdraft or trade) costs a fraction of the wrong one.",
      href: "/working-capital-finance",
      linkLabel: "Match the facility to the gap",
    });
  }
  return out.slice(0, 3);
}

type Flag = { q: Question; score: number; sub: string; tip: string };

function buildFlags(sel: Selections): Flag[] {
  const flags: Flag[] = [];
  for (const q of SCORED) {
    const s = qScore(q, sel[q.key]);
    if (s == null || s >= 0.8) continue;
    if (q.type === "single") {
      const opt = q.options[(sel[q.key] ?? [])[0]];
      flags.push({ q, score: s, sub: opt.label, tip: opt.tip ?? "" });
    } else {
      const picked = sel[q.key] ?? [];
      const noneOpt = picked.map((i) => q.options[i]).find((o) => o.none);
      const scorable = q.options.filter((o) => !o.none && o.points > 0).length;
      const inPlace = picked.filter((i) => !q.options[i].none && q.options[i].points > 0).length;
      flags.push({ q, score: s, sub: noneOpt ? noneOpt.label : `${inPlace} of ${scorable} in place`, tip: q.lowTip ?? "" });
    }
  }
  return flags.sort((a, z) => a.score - z.score);
}

function profileSummary(sel: Selections): string {
  const ctxQ = QUESTIONS.find((q) => q.key === "context")!;
  const ctx = (sel["context"] ?? []).map((i) => ctxQ.options[i].label).join(", ") || "-";
  return `Context: ${ctx}`;
}

export function BizCheck() {
  const [sel, setSel] = useState<Selections>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  const answeredCount = QUESTIONS.filter((x) => (sel[x.key] ?? []).length > 0).length;
  const complete = answeredCount === QUESTIONS.length;

  const scrollOn = (next: Selections) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nextQ = QUESTIONS.find((x) => (next[x.key] ?? []).length === 0);
    if (nextQ) cardRefs.current[nextQ.key]?.scrollIntoView({ behavior: "smooth", block: "center" });
    else panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const pickSingle = (q: Question, i: number) => {
    const next = { ...sel, [q.key]: [i] };
    setSel(next);
    scrollOn(next);
  };

  const toggle = (q: Question, i: number) => {
    setSel((s) => {
      const cur = s[q.key] ?? [];
      if (cur.includes(i)) return { ...s, [q.key]: cur.filter((x) => x !== i) };
      if (q.options[i].none) return { ...s, [q.key]: [i] };
      return { ...s, [q.key]: [...cur.filter((x) => !q.options[x].none), i] };
    });
  };

  const restart = () => setSel({});

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* LEFT: every question, ready to answer */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-1">
          <p className="font-display text-lg font-bold tracking-tight text-ink">3 minutes. 7 areas. One real score.</p>
          <p className="text-sm text-ink/50">No sign-up. No email wall.</p>
        </div>
        {QUESTIONS.map((q, qi) => {
          const picked = sel[q.key] ?? [];
          const done = picked.length > 0;
          return (
            <div
              key={q.key}
              ref={(el) => {
                cardRefs.current[q.key] = el;
              }}
              className="rounded-3xl border border-ink/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.14em]">
                  <span className="text-ink/40">{q.stage}</span>
                  <span className="mx-1.5 text-ink/25">·</span>
                  <span className="text-advance">{q.area}</span>
                </p>
                <span
                  className={`inline-flex h-6 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-bold ${
                    done ? "bg-advance-light text-ink" : "bg-neutral-100 text-ink/45"
                  }`}
                  aria-hidden
                >
                  {done ? "✓" : `${qi + 1} of ${QUESTIONS.length}`}
                </span>
              </div>
              <p className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                {q.label}
              </p>
              {q.hint && <p className="mt-1.5 text-sm text-ink/55">{q.hint}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {q.options.map((o, oi) => {
                  const active = picked.includes(oi);
                  return (
                    <button
                      key={o.label}
                      onClick={() => (q.type === "single" ? pickSingle(q, oi) : toggle(q, oi))}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-left text-sm font-semibold transition ${
                        active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                      }`}
                    >
                      {q.type === "multi" && <span className="mr-1.5 text-xs opacity-60">{active ? "✓" : "+"}</span>}
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: the live score panel */}
      <LivePanel sel={sel} answeredCount={answeredCount} complete={complete} panelRef={panelRef} onRestart={restart} />
    </div>
  );
}

function LivePanel({
  sel,
  answeredCount,
  complete,
  panelRef,
  onRestart,
}: {
  sel: Selections;
  answeredCount: number;
  complete: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onRestart: () => void;
}) {
  const scoredAnswered = SCORED.filter((q) => qScore(q, sel[q.key]) != null);
  const score =
    scoredAnswered.length > 0
      ? (scoredAnswered.reduce((a, q) => a + (qScore(q, sel[q.key]) ?? 0), 0) / scoredAnswered.length) * 10
      : null;
  const band = score != null ? BANDS.find((b) => score >= b.min)! : null;
  const flags = complete ? buildFlags(sel) : [];
  const pathways = complete ? buildPathways(sel) : [];

  return (
    <div
      ref={panelRef}
      className="rounded-3xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Your file&apos;s shape, live</p>
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

      <div className="mt-6 flex items-center gap-5">
        <ScoreRing value={score} />
        <div className="min-w-0">
          {band ? (
            <>
              <h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tight">{band.name}.</h3>
              <p className="mt-1 text-xs font-semibold text-white/55">
                {complete ? "Your score across all 7 areas." : `Based on ${scoredAnswered.length} of ${SCORED.length} scored areas so far.`}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold leading-[1.15] tracking-tight">Your score builds here.</h2>
              <p className="mt-1 text-xs font-semibold text-white/55">Tap an answer on any question to begin.</p>
            </>
          )}
        </div>
      </div>

      {complete && band && <p className="mt-4 text-sm leading-relaxed text-white/70">{band.blurb}</p>}

      <Radar sel={sel} size={250} />
      <p className="mt-1 text-center text-xs text-white/45">
        Each scored answer pulls the shape outward. The dashed ring is the strong mark.
      </p>

      {complete && (
        <>
          {pathways.length > 0 && (
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Where this usually leads</p>
              <div className="mt-4 space-y-5">
                {pathways.map((p) => (
                  <div key={p.title}>
                    <h4 className="font-display text-lg font-bold tracking-tight">{p.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{p.body}</p>
                    <a
                      href={p.href}
                      className="mt-2 inline-block text-sm font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2 hover:decoration-advance-bright"
                    >
                      {p.linkLabel} →
                    </a>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                General pathways people in similar positions often explore, not a recommendation.
                Whether any fit you is what the review works out.
              </p>
            </div>
          )}

          {flags.length > 0 && (
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-advance-bright">Your first moves</p>
              <div className="mt-4 space-y-3">
                {flags.slice(0, 6).map(({ q, sub, tip }, i) => (
                  <div key={q.key} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-bold">
                      <span className="mr-2 text-white/40">{i + 1}</span>
                      {q.area}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white/50">{sub}</p>
                    {tip && <p className="mt-2 text-sm leading-snug text-white/75">{tip}</p>}
                    {q.tool && (
                      <a
                        href={q.tool.href}
                        className="mt-2 inline-block text-sm font-semibold text-advance-bright underline decoration-advance-bright/30 underline-offset-2 hover:decoration-advance-bright"
                      >
                        {q.tool.label} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">The breakdown</p>
            <div className="mt-4 space-y-3">
              {SCORED.map((q) => {
                const v = (qScore(q, sel[q.key]) ?? 0) * 10;
                return (
                  <div key={q.key} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3">
                    <span className="truncate text-sm font-semibold text-white">{q.area}</span>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                      <div className="h-full rounded-full bg-advance-bright" style={{ width: `${v * 10}%` }} />
                    </div>
                    <span className="text-right font-display text-sm font-bold text-white">{v.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {score != null && band && (
            <SnapshotForm score={score} band={band.name} flags={flags} profile={profileSummary(sel)} />
          )}

          <p className="mt-6 text-xs leading-relaxed text-white/45">
            The score weighs seven general markers of business borrowing readiness equally. It doesn&apos;t know your
            rate, balance or circumstances, so treat it as a conversation starter, not a verdict.
            General information only, not credit, tax or financial advice.
          </p>
        </>
      )}

      {answeredCount > 0 && (
        <button onClick={onRestart} className="mt-4 text-sm font-semibold text-white/50 hover:text-white">
          ↺ Retake the check
        </button>
      )}
    </div>
  );
}

function Radar({ sel, size = 280 }: { sel: Selections; size?: number }) {
  const c = size / 2;
  const R = c - 34;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / SCORED.length - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const val = (q: Question) => (qScore(q, sel[q.key]) ?? 0) * 10;
  const poly = (f: (q: Question) => number) =>
    SCORED.map((q, i) => pt(i, (Math.max(0.4, f(q)) / 10) * R).join(",")).join(" ");

  return (
    <svg viewBox={`-16 0 ${size + 32} ${size}`} className="mx-auto mt-4 w-full max-w-[290px]" aria-hidden>
      {[2.5, 5, 7.5, 10].map((ring) => (
        <polygon key={ring} points={SCORED.map((_, i) => pt(i, (ring / 10) * R).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      ))}
      {SCORED.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />;
      })}
      <polygon points={poly(() => 8)} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
      <polygon points={poly(val)} fill="#f7dd57" fillOpacity="0.12" stroke="#f7dd57" strokeWidth="2" strokeLinejoin="round" style={{ transition: "all .4s" }} />
      {SCORED.map((q, i) => {
        if (qScore(q, sel[q.key]) == null) return null;
        const [x, y] = pt(i, (Math.max(0.4, val(q)) / 10) * R);
        return <circle key={q.key} cx={x} cy={y} r="4.5" fill="#f7dd57" style={{ transition: "all .4s" }} />;
      })}
      {SCORED.map((q, i) => {
        const [x, y] = pt(i, R + 18);
        return (
          <text key={q.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.6)" fontSize="10.5" fontWeight="600">
            {q.area}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreRing({ value }: { value: number | null }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = value == null ? 0 : Math.max(0, Math.min(1, value / 10));
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f7dd57" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset .4s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold tracking-tight text-white">{value == null ? "?" : value.toFixed(1)}</span>
        <span className="text-xs font-semibold text-white/50">out of 10</span>
      </div>
    </div>
  );
}

function SnapshotForm({ score, band, flags, profile }: { score: number; band: string; flags: Flag[]; profile: string }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variant: "contact",
          subject: "Business Borrowing Health Check",
          message: `Health check result: ${score.toFixed(1)}/10 (${band}). ${profile}. Flags: ${
            flags.map((f) => `${f.q.area} - ${f.sub}`).join("; ") || "none"
          }`,
          newsletter: true,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="mt-7 border-t border-white/10 pt-6 text-center">
        <h3 className="font-display text-2xl font-bold tracking-tight">Speak soon.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Your result is with the team. A broker will be in touch within a few business hours
          to talk it through. No cost, no obligation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 border-t border-white/10 pt-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">Talk the result through</p>
      <h3 className="mt-2 font-display text-xl font-normal tracking-tight sm:text-2xl">
        Turn the flags into a fundable file, with Jacob.
      </h3>
      <p className="mt-2 text-sm text-white/65">
        Your score, flags and context travel with the enquiry, so the conversation starts at
        the answer: what to fix, what it unlocks, and which lenders want the deal.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DarkField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required autoComplete="given-name" />
        <DarkField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required autoComplete="family-name" />
        <DarkField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <DarkField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn bg-white text-ink hover:bg-neutral-100 disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Get my lending review"}
        </button>
        <span className="text-sm text-white/50">
          Your score: <strong className="text-white">{score.toFixed(1)}/10</strong>
        </span>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          That didn&apos;t send, so nothing has reached us. Please call{" "}
          <a href="tel:0721014374" className="font-semibold underline">07 2101 4374</a>{" "}
          or try again in a moment.
        </p>
      )}
    </form>
  );
}

function DarkField({
  label, value, onChange, type = "text", required = false, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type} required={required} autoComplete={autoComplete} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white"
      />
    </label>
  );
}
