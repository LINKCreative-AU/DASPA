// Thin-lined icons matching the V1.5 icon style (1.6px stroke, currentColor),
// same convention as the link.com.au set.
type P = { className?: string };
const S = ({ children, className = "h-6 w-6" }: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const Icon = {
  bolt: (p: P) => (
    <S {...p}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </S>
  ),
  shieldCheck: (p: P) => (
    <S {...p}>
      <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
      <path d="m8.5 11.5 2.5 2.5 4.5-4.5" />
    </S>
  ),
  userPhone: (p: P) => (
    <S {...p}>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M18 3.5c1.8.4 3.2 1.8 3.5 3.5M17.5 7a2.6 2.6 0 0 1 2 2" />
    </S>
  ),
  wrench: (p: P) => (
    <S {...p}>
      <path d="M14.2 6.8a4 4 0 0 0-5.4 5.4L3 18l3 3 5.8-5.8a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.5-.8-.8-2.5 2.9-2.4z" />
    </S>
  ),
  trendingUp: (p: P) => (
    <S {...p}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M17 8h4v4" />
    </S>
  ),
  clipboardCheck: (p: P) => (
    <S {...p}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="m9 13 2.2 2.2L15.5 11" />
    </S>
  ),
  home: (p: P) => (
    <S {...p}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </S>
  ),
  key: (p: P) => (
    <S {...p}>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9M17 6l3 3M14 9l2 2" />
    </S>
  ),
  clock: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </S>
  ),
  star: (p: P) => (
    <S {...p}>
      <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3z" />
    </S>
  ),
  calendar: (p: P) => (
    <S {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </S>
  ),
  pin: (p: P) => (
    <S {...p}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </S>
  ),
  users: (p: P) => (
    <S {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" />
    </S>
  ),
  trophy: (p: P) => (
    <S {...p}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5" />
      <path d="M12 13v4M8 21h8M10 17h4v4h-4z" />
    </S>
  ),
  calculator: (p: P) => (
    <S {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 19h.01M12 19h.01M15.5 19h.01" />
    </S>
  ),
  rocket: (p: P) => (
    <S {...p}>
      <path d="M12 15c-1-3 0-7.5 4-10.5 2-1.5 4.5-2 4.5-2s-.5 2.5-2 4.5c-3 4-7.5 5-10.5 4" />
      <path d="M8 11c-2 .5-3.5 2-4.5 5.5C7 15.5 8.5 14 9 12M13 16c-.5 2-2 3.5-5.5 4.5 1-3.5 2.5-5 4.5-5.5" />
      <circle cx="15" cy="9" r="1.4" />
    </S>
  ),
  book: (p: P) => (
    <S {...p}>
      <path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5z" />
      <path d="M4 19a2 2 0 0 1 2-2h14" />
      <path d="M9 7h7M9 10.5h5" />
    </S>
  ),
  cloud: (p: P) => (
    <S {...p}>
      <path d="M7 18a4.5 4.5 0 1 1 .8-8.9A6 6 0 0 1 19.5 11 3.5 3.5 0 0 1 18 18H7z" />
    </S>
  ),
  tag: (p: P) => (
    <S {...p}>
      <path d="M3 3h8l10 10-8 8L3 11V3z" />
      <circle cx="8" cy="8" r="1.5" />
    </S>
  ),
  dollar: (p: P) => (
    <S {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.2 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5" />
      <path d="M12 6.5v11" />
    </S>
  ),
};
