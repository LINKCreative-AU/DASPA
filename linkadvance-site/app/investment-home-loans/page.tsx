import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["investment-home-loans"];

export const metadata: Metadata = {
  title: { absolute: 'Investment Property Loan Broker Brisbane | LINK Advance' },
  description: 'Investment loans structured for the portfolio: interest-only vs P&I modelled, equity release, clean deductible debt and lenders picked for investor policy. Brisbane based, Australia wide.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Investment loans structured for the portfolio: interest-only vs P&I modelled, equity release, clean deductible debt and lenders picked for investor policy. Brisbane based, Australia wide.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
