import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["business-car-and-equipment-loans"];

export const metadata: Metadata = {
  title: { absolute: 'Car & Equipment Finance Brisbane | Business Vehicle Loans - LINK Advance' },
  description: 'Vehicle and equipment finance approved in days: chattel mortgage, lease or personal loan matched to your tax position, new/used/private sales, dealer rates compared honestly.',
  alternates: { canonical: data.path },
  openGraph: { title: data.h1, description: 'Vehicle and equipment finance approved in days: chattel mortgage, lease or personal loan matched to your tax position, new/used/private sales, dealer rates compared honestly.', url: data.path },
};

export default function Page() {
  return <LoanPage data={data} />;
}
