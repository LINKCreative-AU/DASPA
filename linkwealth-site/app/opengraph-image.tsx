import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "LINK Wealth - financial advisors Brisbane";

export default function OpengraphImage() {
  return ogImage("Turn your hard work into lasting financial freedom.");
}
