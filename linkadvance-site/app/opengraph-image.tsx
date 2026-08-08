import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "LINK Advance - mortgage brokers Brisbane";

export default function OpengraphImage() {
  return ogImage("We make lending easy.");
}
