import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["smsf-mortgage-broker"];

export const metadata: Metadata = {
  title: { absolute: 'SMSF Mortgage Broker | SMSF Property Loans - LINK Advance' },
  description: "SMSF lending (LRBA) for residential and commercial property, including business owners buying their premises through super. Specialist lender panel; strategy with LINK Wealth's licensed advisers.",
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: "SMSF lending (LRBA) for residential and commercial property, including business owners buying their premises through super. Specialist lender panel; strategy with LINK Wealth's licensed advisers.", url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
