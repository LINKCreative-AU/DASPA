import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Shared branded OG image: V1.5 editorial look - white field, LINK + Advance
// wordmark, big ink headline with a full stop, Advance-gold guide line.
export const OG_SIZE = { width: 1200, height: 630 };

// The default eyebrow was "Financial advisors Brisbane", left over from the
// Advisors scaffold this file was copied from. Advance holds a credit
// authorisation, not an AFSL, so it cannot describe itself as a financial
// adviser - and this string was stamped on every share image the site serves.
export function ogImage(title: string, eyebrow = "Mortgage brokers Brisbane") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#000000", letterSpacing: -1 }}>
            LINK
          </span>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#1f9e84", letterSpacing: -1 }}>
            Advisors
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 64,
              height: 5,
              background: "#1f9e84",
              marginBottom: 22,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: title.length > 45 ? 56 : 68,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "flex",
                background: "#1f9e84",
                color: "#ffffff",
                borderRadius: 999,
                padding: "6px 18px",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {SITE.reviews.rating} / 5
            </span>
            <span style={{ fontSize: 24, fontWeight: 600, color: "#000000" }}>
              from {SITE.reviews.count}+ Google reviews
            </span>
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#9ca3af" }}>
            linkadvisors.com.au
          </span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
