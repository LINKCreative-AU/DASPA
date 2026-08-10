import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["development-finance"];

export const metadata: Metadata = {
  title: { absolute: 'Development Finance Brisbane | Site, Construction & Residual Stock' },
  description: 'Development funding for small to mid-scale projects: 65-80% of TDC in staged drawdowns, capitalised interest, presale and no-presale paths compared across bank, non-bank and private lenders.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Development funding for small to mid-scale projects: 65-80% of TDC in staged drawdowns, capitalised interest, presale and no-presale paths compared across bank, non-bank and private lenders.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
