import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, firmSchema } from "@/components/Schema";

const elza = localFont({
  src: [
    { path: "../public/fonts/ElzaText-Light.woff2", weight: "300" },
    { path: "../public/fonts/ElzaText-Regular.woff2", weight: "400" },
    { path: "../public/fonts/ElzaText-Medium.woff2", weight: "500" },
    { path: "../public/fonts/Elza-Semibold.woff2", weight: "600" },
    { path: "../public/fonts/Elza-Bold.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wealth.link.com.au"),
  title: {
    default: "Financial Advisor Brisbane | LINK Wealth Advisors",
    template: "%s | LINK Wealth",
  },
  description:
    "LINK Wealth's Brisbane financial advisors help business owners and professionals grow their personal wealth: retirement planning, property, SMSF and tax-smart investing. 5.0 Google rating.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    siteName: "LINK Wealth",
    type: "website",
    locale: "en_AU",
  },
  alternates: { canonical: "./" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={elza.variable}>
      <body className="font-sans">
        <JsonLd data={firmSchema()} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
