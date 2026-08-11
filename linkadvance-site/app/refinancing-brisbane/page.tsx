import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["refinancing-brisbane"];

export const metadata: Metadata = {
  title: { absolute: 'Refinance Home Loan Brisbane | No-Cost Loan Review - LINK Advance' },
  description: 'Refinance your home loan with a review against 35+ lenders, or we make your current lender price-match. Rate, consolidation and equity-out options with the break costs calculated first.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Refinance your home loan with a review against 35+ lenders, or we make your current lender price-match. Rate, consolidation and equity-out options with the break costs calculated first.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
