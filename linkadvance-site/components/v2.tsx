// V2 design-language primitives, ported from the link.com.au build
// (measured from Anoushka's Figma there). Buttons: 44px pill with the
// trailing arrow-in-circle. Eyebrow: 35px bordered pill, uppercase.
// Advance carries them with the register gold as the only accent.

import type { CSSProperties, ReactNode } from "react";

export function ArrowCircle({
  bg = "#ffffff",
  fg = "#000000",
  size = 23,
}: {
  bg?: string;
  fg?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5"
          stroke={fg}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

type PillVariant = "solid" | "ghost" | "gold" | "onDark" | "ghostDark";

const PILL_STYLES: Record<
  PillVariant,
  { wrap: string; style?: CSSProperties; circleBg: string; circleFg: string }
> = {
  solid: { wrap: "bg-ink text-white", circleBg: "#ffffff", circleFg: "#000000" },
  ghost: { wrap: "border border-ink bg-white text-ink", circleBg: "#000000", circleFg: "#ffffff" },
  gold: { wrap: "bg-advance text-ink", circleBg: "#101820", circleFg: "#ffffff" },
  onDark: { wrap: "bg-white text-ink", circleBg: "#000000", circleFg: "#ffffff" },
  ghostDark: { wrap: "border border-white text-white", circleBg: "#ffffff", circleFg: "#000000" },
};

export function Pill({
  href,
  children,
  variant = "solid",
  small = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: PillVariant;
  small?: boolean;
  className?: string;
}) {
  const v = PILL_STYLES[variant];
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full font-semibold transition hover:opacity-85 ${
        small ? "h-10 pl-4 pr-2 text-[15px]" : "h-11 pl-5 pr-2.5 text-lg"
      } ${v.wrap} ${className}`}
    >
      <span className="whitespace-nowrap">{children}</span>
      <ArrowCircle bg={v.circleBg} fg={v.circleFg} size={small ? 20 : 23} />
    </a>
  );
}

export function EyebrowPill({
  children,
  tint = false,
  onDark = false,
}: {
  children: ReactNode;
  tint?: boolean; // register light gold fill instead of the bordered pill
  onDark?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-[35px] items-center rounded-full px-4 text-[13px] font-medium uppercase tracking-[0.12em] ${
        tint
          ? "bg-advance-light text-ink"
          : onDark
            ? "border border-white text-white"
            : "border border-ink text-ink"
      }`}
    >
      {children}
    </span>
  );
}
