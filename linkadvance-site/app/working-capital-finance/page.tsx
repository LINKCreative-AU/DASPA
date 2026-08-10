import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["working-capital-finance"];

export const metadata: Metadata = {
  title: { absolute: 'Working Capital Finance | Overdrafts, Invoice Finance & Trade | LINK Advance' },
  description: 'Working capital lending matched to your cash-flow gap: invoice finance, overdrafts, trade facilities and short-term loans - with the honest pricing conversation before anything is signed.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Working capital lending matched to your cash-flow gap: invoice finance, overdrafts, trade facilities and short-term loans - with the honest pricing conversation before anything is signed.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
