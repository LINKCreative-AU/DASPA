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
        // The mint is too light to carry text on white, so the live site's
        // deep teal does the text-weight work.
        ink: "#000000",
        cloud: "#f4f5f6",
        line: "#e7e9ec",
        wealth: {
          DEFAULT: "#95e5cb", // the V1.5 Wealth mint - backgrounds, highlights, accents on dark
          mid: "#84d1b8", // hover tint from the live palette
          light: "#daf2eb",
          dark: "#204347", // live-site deep teal - text, buttons, links
          deep: "#26494d",
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
