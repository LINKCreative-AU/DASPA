"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { NAV, SITE, type NavItem } from "@/lib/site";

// Services/Workshops open dropdowns, the rest are plain links. Dropdowns open
// on hover and on keyboard focus (focus-within), so the menu works without a
// mouse. The old Elementor site's mobile menu was two duplicated nav blocks;
// this is one accessible one.

function Chevron() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
      <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  const trigger = (
    <a
      href={item.href ?? item.children?.[0]?.href}
      className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-ink underline-offset-4 transition hover:underline"
    >
      {item.label}
      {(item.children || item.columns) && <Chevron />}
    </a>
  );

  if (item.columns) {
    return (
      <div className="group relative">
        {trigger}
        <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="flex gap-7 rounded-2xl border border-line bg-white p-7 shadow-lg">
            {item.columns.map((col) => (
              <div key={col.heading} className="min-w-[11rem]">
                <p className="eyebrow mb-3 whitespace-nowrap !text-[10px]">{col.heading}</p>
                <ul className="space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="block whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-medium text-ink/75 transition hover:bg-neutral-50 hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (item.children) {
    return (
      <div className="group relative">
        {trigger}
        <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="min-w-64 rounded-2xl border border-line bg-white p-2 shadow-lg">
            {item.children.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium text-ink/75 transition hover:bg-neutral-50 hover:text-ink"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return trigger;
}

// One mobile section open at a time. The old mobile menu did two things wrong:
// it flattened item.columns with flatMap, throwing away the Personal /
// Commercial / First home headings that are the only reason 19 lending links
// are navigable on desktop, and it rendered every section expanded, so the
// menu opened onto roughly 32 undifferentiated links and About was a long
// scroll away. Closed accordions put the four top-level choices on one screen,
// and opening one restores the headings the desktop panel has.
//
// Every hub page is already inside its own child list (Lending -> Home loans,
// Tools -> All calculators, About -> Meet the brokers), so making the row a
// toggle rather than a link loses no destination.
function MobileSection({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const id = `m-${item.label.toLowerCase().replace(/\W+/g, "-")}`;
  const groups = item.columns ?? (item.children ? [{ heading: "", links: item.children }] : null);

  if (!groups) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className="block border-b border-ink/5 py-4 text-[15px] font-semibold text-ink"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="border-b border-ink/5">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-ink"
      >
        {item.label}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <Chevron />
        </span>
      </button>
      {open && (
        <div id={id} className="pb-3">
          {groups.map((col, gi) => (
            <div key={col.heading || gi} className={gi > 0 ? "mt-4" : ""}>
              {col.heading && <p className="eyebrow mb-1.5 !text-[10px]">{col.heading}</p>}
              {col.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={onNavigate}
                  className="block py-2 text-[15px] font-medium text-ink/80"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <a href="/" aria-label="LINK Advance home" className="shrink-0">
          <Logo />
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          <nav className="flex items-center gap-7" aria-label="Main">
            {NAV.map((n) => (
              <DesktopItem key={n.label} item={n} />
            ))}
          </nav>
          <a
            href={SITE.phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-ink/75 hover:text-ink xl:block"
          >
            {SITE.phone}
          </a>
          <a href="/contact-us" className="btn btn-advance whitespace-nowrap">
            Book a call
          </a>
        </div>

        <button
          className="lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav
          className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-6 pb-6 pt-2 lg:hidden"
          aria-label="Main"
        >
          {NAV.map((n) => (
            <MobileSection
              key={n.label}
              item={n}
              open={section === n.label}
              onToggle={() => setSection((s) => (s === n.label ? null : n.label))}
              onNavigate={() => setOpen(false)}
            />
          ))}
          <div className="mt-4 flex items-center gap-3">
            <a href="/contact-us" onClick={() => setOpen(false)} className="btn btn-primary flex-1">
              Book a call
            </a>
            <a href={SITE.phoneHref} className="btn btn-ghost whitespace-nowrap">
              {SITE.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
