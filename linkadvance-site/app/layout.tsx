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
  metadataBase: new URL("https://linkadvance.com.au"),
  title: {
    default: "Mortgage Broker Brisbane | LINK Advance Finance Brokers",
    template: "%s | LINK Advance",
  },
  description:
    "Brisbane mortgage and commercial finance brokers. One broker from your first call to settlement, then a look at your loan every year after it. Home loans, refinancing, first home buyers, investment, construction, SMSF and business finance across 35+ lenders. 5.0 from 262 Google reviews.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    siteName: "LINK Advance",
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
