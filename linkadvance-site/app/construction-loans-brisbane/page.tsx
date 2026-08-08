import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["construction-loans-brisbane"];

export const metadata: Metadata = {
  title: { absolute: 'Construction Loans Brisbane | Progress-Payment Lending | LINK Advance' },
  description: 'Construction loan broking for new builds and knock-down rebuilds: progress payments staged to the build, interest-only while you build, and the $30k FHOG QLD claimed when it applies.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Construction loan broking for new builds and knock-down rebuilds: progress payments staged to the build, interest-only while you build, and the $30k FHOG QLD claimed when it applies.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
