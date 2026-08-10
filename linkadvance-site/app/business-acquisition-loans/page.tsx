import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["business-acquisition-loans"];

export const metadata: Metadata = {
  title: { absolute: 'Business Acquisition Loans | Buy a Business or Franchise | LINK Advance' },
  description: 'Acquisition finance for buying a business, franchise or partner buyout: lenders fund 50-70% against maintainable earnings. Add-backs, vendor finance and structure done properly.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Acquisition finance for buying a business, franchise or partner buyout: lenders fund 50-70% against maintainable earnings. Add-backs, vendor finance and structure done properly.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
