import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["commercial-property-loans"];

export const metadata: Metadata = {
  title: { absolute: 'Commercial Property Loans | Premises, Investment & SMSF | LINK Advance' },
  description: 'Commercial property finance for Brisbane businesses: owner-occupied premises, commercial investment and SMSF commercial lending, structured for commercial credit teams. Typical LVRs 65-80%.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Commercial property finance for Brisbane businesses: owner-occupied premises, commercial investment and SMSF commercial lending, structured for commercial credit teams. Typical LVRs 65-80%.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
