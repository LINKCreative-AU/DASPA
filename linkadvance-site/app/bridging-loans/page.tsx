import type { Metadata } from "next";
import { LoanPage } from "@/components/LoanPage";
import { LOAN_PAGES } from "@/lib/loans";

const data = LOAN_PAGES["bridging-loans"];

export const metadata: Metadata = {
  title: { absolute: "Bridging Loans | Buy Before You Sell, Explained Properly | LINK Advance" },
  description:
    "How bridging finance actually works: peak debt, end debt, capitalised interest and a worked example, plus when bridging is the wrong tool. Compared across the lenders that do it well, by Brisbane brokers.",
  alternates: { canonical: data.path },
  openGraph: {
    title: data.h1,
    description:
      "Peak debt, end debt and capitalised interest explained with a worked example, plus the honest risks.",
    url: data.path,
  },
};

export default function Page() {
  return <LoanPage data={data} />;
}
