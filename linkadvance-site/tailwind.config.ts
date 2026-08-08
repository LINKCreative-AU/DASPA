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
          DEFAULT: "#997000", // kit register: deepened from palette amber #e0a500 for legibility on white
          bright: "#e0a500", // the V1.5 palette amber - accents on dark backgrounds, highlights
          mid: "#c49b1f", // hover tint
          light: "#f8efd2", // light tint panels
          dark: "#3d3000", // dark tone
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
