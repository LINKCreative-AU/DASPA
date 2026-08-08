import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["business-loans"];

export const metadata: Metadata = {
  title: { absolute: 'Small Business Loans Brisbane | Commercial Finance Broker - LINK Advance' },
  description: 'Business lending for growth, cash flow, premises and acquisitions: one broker, your numbers, and the lenders who actually want your industry. Financials lender-ready with LINK Advisors.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Business lending for growth, cash flow, premises and acquisitions: one broker, your numbers, and the lenders who actually want your industry. Financials lender-ready with LINK Advisors.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
