import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["business-car-and-equipment-loans"];

// Was "finance approved in days", an unqualified promise of both an outcome
// and a timeframe, neither of which is ours to give. Now the tax-structure
// angle leads (it is the real differentiator anyway) and the speed line is a
// qualified statement about lender turnaround, not a promise of approval.
export const metadata: Metadata = {
  title: { absolute: 'Car & Equipment Finance Brisbane | Business Vehicle Loans - LINK Advance' },
  description: 'Vehicle and equipment finance matched to your tax position: chattel mortgage, lease or personal loan, new/used/private sales, dealer rates compared honestly. Many decisions come back in days.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Vehicle and equipment finance matched to your tax position: chattel mortgage, lease or personal loan, new/used/private sales, dealer rates compared honestly. Many decisions come back in days.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
