import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["home-loans-brisbane"];

export const metadata: Metadata = {
  title: { absolute: 'Brisbane Home Loans | Brisbane Home Loan Broker - LINK Advance' },
  description: 'Brisbane home loan broking across 35+ lenders: one broker end to end, discretionary pricing negotiated, and your rate repriced every six months after settlement. The lender pays us, not you.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Brisbane home loan broking across 35+ lenders: one broker end to end, discretionary pricing negotiated, and your rate repriced every six months after settlement. The lender pays us, not you.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
