import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["first-home-buyers-loan"];

export const metadata: Metadata = {
  title: { absolute: 'First Home Buyers Loan Brisbane | 5% Deposit Paths | LINK Advance' },
  description: 'First home buyer broking in Brisbane: 5% deposit via the First Home Guarantee, the $30k FHOG QLD, stamp duty concessions and pre-approval. One broker from first chat to settlement.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'First home buyer broking in Brisbane: 5% deposit via the First Home Guarantee, the $30k FHOG QLD, stamp duty concessions and pre-approval. One broker from first chat to settlement.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
