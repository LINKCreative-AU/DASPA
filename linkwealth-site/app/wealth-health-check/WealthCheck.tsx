"use client";

import { useRef, useState } from "react";
import {
  QUESTIONS,
  SCORED,
  BANDS,
  qScore,
  type Question,
  type Selections,
} from "./questions";

// The LINK Wealth Check - the V2 tool pattern: no splash and no Start gate,
// every question on screen from the first paint as tap-chip cards, beside a
// sticky ink panel where the score, radar, flags and pathways build live.
//
// Question set v3 (8 Aug, per James): built from the adviser fact-find, the
// firm's actual value and what's commercial. Two unscored context questions
// open the check the way a discovery meeting does (who you are; where super
// sits - the ~$200k mark is the firm's own SMSF viability line). Protection
// is deepened to the four cover types (life, TPD, income protection,
// trauma) because insurance reviews are a signature LINK Wealth service and
// the FSC puts the national income-protection gap at ~3.4m people. The
// results add "where this usually leads" pathway cards - SMSF premises for
// business owners with the super for it, the extraction workshop, the
// equity workshop, retirement funding, an insurance review - and the whole
// profile travels with the lead. General-advice safe throughout: pathways
// are "people in this position often...", never "you should". No email
// wall - the score shows before any form.

// ---- the commercial routing: profile -> "where this usually leads" ----
type Pathway = { title: string; body: string; href: string; linkLabel: string };

function buildPathways(sel: Selections): Pathway[] {
  const goals = new Set(sel["goals"] ?? []);
  const goalKids = goals.has(1);
  const goalRetire = goals.has(3);
  const goalBiz = goals.has(4);
  const ctx = new Set(sel["context"] ?? []);
  const biz = ctx.has(0) || goalBiz;
  const home = ctx.has(1);
  const retire10 = ctx.has(2) || goalRetire;
  const deps = ctx.has(3);
  const bandIdx = (sel["superband"] ?? [])[0];
  const superOver200k = bandIdx === 2 || bandIdx === 3;
  const protectQ = QUESTIONS.find((q) => q.key === "protect")!;
  const protectLow = (qScore(protectQ, sel["protect"]) ?? 0) < 0.8;

  const out: Pathway[] = [];
  if (biz && superOver200k) {
    out.push({
      title: "Your premises, owned by your super.",
      body: "Business owners with around $200k+ in super often use an SMSF to buy the premises they already rent, so the rent builds their retirement instead of a landlord's.",
      href: "/smsf",
      linkLabel: "How SMSF commercial property works",
    });
  } else if (biz) {
    out.push({
      title: "Profits into personal wealth.",
      body: "The gap between a good business and a wealthy owner is usually structure: how profit gets out of the company and into your name, tax-effectively.",
      href: "/business-owner-wealth-extraction-workshop-link-wealth",
      linkLabel: "The Business Owner Wealth Extraction Workshop",
    });
  }
  if ((deps || protectLow) && protectLow) {
    out.push({
      title: "Protection first: it's the part most people under-do.",
      body: deps
        ? "With people depending on your income, cover sized to your actual debts and dependants matters more than any investment choice, and part of the advice fee is now often tax-deductible."
        : "Cover sized to your actual debts and situation (not the default in super) is usually the quickest gap to close, and part of the advice fee is now often tax-deductible.",
      href: "/insights/you-can-now-claim-a-tax-deduction-on-personal-insurance-advice-fees",
      linkLabel: "What changed with insurance advice fees",
    });
  }
  if (retire10) {
    out.push({
      title: "The next ten years decide the shape of retirement.",
      body: "Inside a decade of retiring, sequencing matters as much as saving: contribution strategy, tax and when to de-risk. This is when a funding plan earns its keep.",
      href: "/retirement-funding-workshop-link-wealth",
      linkLabel: "The Retirement Funding Workshop",
    });
  }
  if (goalKids) {
    out.push({
      title: "Wealth that includes the kids.",
      body: "Education and investment bonds are a tax-effective way to build school fees and first-home head starts, one of the most-used tools in family wealth plans.",
      href: "/family-wealth-management",
      linkLabel: "How family wealth management works",
    });
  }
  if (home && !biz) {
    out.push({
      title: "The equity in your home can work harder.",
      body: "Homeowners often have more strategy options than they realise: offsets, splits, debt recycling and equity redeployed into investments, modelled against your own numbers.",
      href: "/home-equity-long-term-wealth-strategy",
      linkLabel: "The Equity Strategy Workshop",
    });
  }
  return out.slice(0, 3);
}

export function WealthCheck() {
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
      {/* LEFT: every question on screen from the first paint, ready to answer */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-1">
          <p className="font-display text-lg font-bold tracking-tight text-ink">
            2 minutes. 9 scored areas. One real score.
          </p>
          <p className="text-sm text-ink/50">Free. No sign-up. No email wall.</p>
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
              className="rounded-[25px] bg-[#f1f1f1] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.14em]">
                  <span className="text-ink/40">{q.stage}</span>
                  <span className="mx-1.5 text-ink/25">·</span>
                  <span className="text-wealth">{q.area}</span>
                </p>
                <span
                  className={`inline-flex h-6 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-bold ${
                    done ? "bg-wealth-light text-ink" : "bg-white text-ink/45"
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
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-ink/15 bg-white text-ink/70 hover:border-ink"
                      }`}
                    >
                      {q.type === "multi" && (
                        <span className="mr-1.5 text-xs opacity-60">{active ? "✓" : "+"}</span>
                      )}
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT: the live score panel, answering from the first tap */}
      <LivePanel
        sel={sel}
        answeredCount={answeredCount}
        complete={complete}
        panelRef={panelRef}
        onRestart={restart}
      />
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
      ? (scoredAnswered.reduce((a, q) => a + (qScore(q, sel[q.key]) ?? 0), 0) /
          scoredAnswered.length) *
        10
      : null;
  const band = score != null ? BANDS.find((b) => score >= b.min)! : null;
  const flags = complete ? buildFlags(sel) : [];
  const pathways = complete ? buildPathways(sel) : [];

  return (
    <div
      ref={panelRef}
      className="rounded-[25px] bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
          Your shape, live
        </p>
        <span className="shrink-0 text-xs font-semibold text-white/60">
          {answeredCount} of {QUESTIONS.length} answered
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-wealth-bright transition-all duration-300"
          style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex items-center gap-5">
        <ScoreRing value={score} />
        <div className="min-w-0">
          {band ? (
            <>
              <h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tight">
                {band.name}.
              </h3>
              <p className="mt-1 text-xs font-semibold text-white/55">
                {complete
                  ? `Your score across all ${SCORED.length} scored areas.`
                  : `Based on ${scoredAnswered.length} of ${SCORED.length} scored areas so far.`}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tight">
                Your score builds here.
              </h3>
              <p className="mt-1 text-xs font-semibold text-white/55">
                Tap an answer on any question to begin.
              </p>
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
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Where this usually leads
              </p>
              <div className="mt-4 space-y-5">
                {pathways.map((p) => (
                  <div key={p.href}>
                    <h4 className="font-display text-lg font-bold tracking-tight">{p.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{p.body}</p>
                    <a
                      href={p.href}
                      className="mt-2 inline-block text-sm font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright"
                    >
                      {p.linkLabel} →
                    </a>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                General pathways people in similar positions often explore, not a recommendation.
                Whether any of them fit you is exactly what a discovery meeting works out.
              </p>
            </div>
          )}

          {flags.length > 0 && (
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-wealth-bright">
                Your first moves
              </p>
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
                        className="mt-2 inline-block text-sm font-semibold text-wealth-bright underline decoration-wealth-bright/30 underline-offset-2 hover:decoration-wealth-bright"
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
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
              The breakdown
            </p>
            <div className="mt-4 space-y-3">
              {SCORED.map((q) => {
                const v = (qScore(q, sel[q.key]) ?? 0) * 10;
                return (
                  <div key={q.key} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3">
                    <span className="truncate text-sm font-semibold text-white">{q.area}</span>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-wealth-bright"
                        style={{ width: `${v * 10}%` }}
                      />
                    </div>
                    <span className="text-right font-display text-sm font-bold text-white">
                      {v.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {score != null && band && (
            <SnapshotForm
              score={score}
              band={band.name}
              flags={flags}
              profile={profileSummary(sel)}
            />
          )}

          <p className="mt-6 text-xs leading-relaxed text-white/45">
            The score weighs nine general markers of financial health equally. It doesn&apos;t
            know your income, age or goals, so treat it as a conversation starter, not a verdict.
            General information only, not personal advice.
          </p>
        </>
      )}

      {answeredCount > 0 && (
        <button onClick={onRestart} className="mt-4 text-sm font-semibold text-white/50 hover:text-white">
          ↺ Start again
        </button>
      )}
    </div>
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
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#95e5cb"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset .4s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold tracking-tight text-white">
          {value == null ? "?" : value.toFixed(1)}
        </span>
        <span className="text-xs font-semibold text-white/50">out of 10</span>
      </div>
    </div>
  );
}

// ---- the radar - the scored axes, drawn on the ink panel ----
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
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto mt-2 w-full max-w-[300px]" aria-hidden>
      {[2.5, 5, 7.5, 10].map((ring) => (
        <polygon
          key={ring}
          points={SCORED.map((_, i) => pt(i, (ring / 10) * R).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
      ))}
      {SCORED.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />;
      })}
      <polygon points={poly(() => 8)} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />
      <polygon
        points={poly(val)}
        fill="#95e5cb"
        fillOpacity="0.16"
        stroke="#95e5cb"
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transition: "all .4s" }}
      />
      {SCORED.map((q, i) => {
        if (qScore(q, sel[q.key]) == null) return null;
        const [x, y] = pt(i, (Math.max(0.4, val(q)) / 10) * R);
        return <circle key={q.key} cx={x} cy={y} r="4.5" fill="#95e5cb" style={{ transition: "all .4s" }} />;
      })}
      {SCORED.map((q, i) => {
        const [x, y] = pt(i, R + 18);
        return (
          <text key={q.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-white/60" fontSize="10.5" fontWeight="600">
            {q.area}
          </text>
        );
      })}
    </svg>
  );
}

// ---- flags and the profile that travels with the lead ----
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
      flags.push({
        q,
        score: s,
        sub: noneOpt ? noneOpt.label : `${inPlace} of ${scorable} in place`,
        tip: q.lowTip ?? "",
      });
    }
  }
  return flags.sort((a, z) => a.score - z.score);
}

function profileSummary(sel: Selections): string {
  const goalsQ = QUESTIONS.find((q) => q.key === "goals")!;
  const ctxQ = QUESTIONS.find((q) => q.key === "context")!;
  const bandQ = QUESTIONS.find((q) => q.key === "superband")!;
  const goals = (sel["goals"] ?? []).map((i) => goalsQ.options[i].label).join(", ") || "-";
  const ctx = (sel["context"] ?? []).map((i) => ctxQ.options[i].label).join(", ") || "-";
  const band = bandQ.options[(sel["superband"] ?? [])[0]]?.label ?? "-";
  return `Goals: ${goals}. Profile: ${ctx}. Super band: ${band}`;
}


// ---- snapshot lead form: score, flags AND profile travel with the enquiry ----
function SnapshotForm({
  score,
  band,
  flags,
  profile,
}: {
  score: number;
  band: string;
  flags: Flag[];
  profile: string;
}) {
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
          variant: "discovery",
          subject: "Wealth Health Check",
          message: `Wealth Check result: ${score.toFixed(1)}/10 (${band}). ${profile}. Flags: ${
            flags.map((f) => `${f.q.area} - ${f.sub}`).join("; ") || "none"
          }`,
          age: "-",
          postcode: "-",
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
      <div className="mt-6 rounded-[25px] bg-ink p-8 text-center text-white">
        <h3 className="font-display text-2xl font-bold tracking-tight">Speak soon.</h3>
        <p className="mx-auto mt-2 max-w-md text-white/70">
          Your result is with the team. An adviser will be in touch within a few business hours
          to talk it through. No cost, no obligation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-[25px] bg-ink p-8 text-white sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
        Talk the result through
      </p>
      <h3 className="mt-2 max-w-2xl font-display text-2xl font-normal tracking-tight sm:text-3xl">
        Turn the flags into a sequence. Free, with a licensed adviser.
      </h3>
      <p className="mt-2 max-w-xl text-white/65">
        Your score, flags and context travel with the enquiry, so the conversation starts at
        the answer, not the form. In the FAAA&apos;s Value of Advice research, 88% of advised
        Australians are confident they&apos;ll have enough for retirement, against 62% of the
        unadvised.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DarkField label="First name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required autoComplete="given-name" />
        <DarkField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} required autoComplete="family-name" />
        <DarkField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required autoComplete="email" />
        <DarkField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required autoComplete="tel" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn bg-white text-ink hover:bg-neutral-100 disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Book my free discovery meeting"}
        </button>
        <span className="text-sm text-white/50">
          Your score: <strong className="text-white">{score.toFixed(1)}/10</strong>
        </span>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          That didn&apos;t send, so nothing has reached us. Please call{" "}
          <a href="tel:0721014377" className="font-semibold underline">
            (07) 2101 4377
          </a>{" "}
          or try again in a moment.
        </p>
      )}
    </form>
  );
}

function DarkField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-white/50">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-0 border-b-2 border-white/20 bg-transparent py-2 text-white outline-none transition focus:border-white"
      />
    </label>
  );
}
