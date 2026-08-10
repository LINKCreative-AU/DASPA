import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LINK V1.5 master brand = monochrome base. Wealth mint is the ONLY
        // division accent on this site (this IS the Wealth division's site).
        // The amber is too light to carry text on white, so a deepened gold
        // tone does the text-weight work.
        ink: "#000000",
        cloud: "#f4f5f6",
        line: "#e7e9ec",
        advance: {
          DEFAULT: "#e0a500", // kit brand register: the working gold, itself deepened once from palette yellow #f7dd57 - never deepen twice
          bright: "#f7dd57", // the V1.5 palette yellow - accents on dark backgrounds, highlights
          mid: "#c99200", // hover, one shade deeper
          light: "#fff6cc", // kit register light tint
          dark: "#4d451f", // kit register dark tone
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
