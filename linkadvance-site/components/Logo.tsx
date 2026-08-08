import Image from "next/image";
import logo from "@/public/link-logo.png";

// LINK master wordmark + "Advance" descriptor in the division amber (deepened
// itself is too light to read as text on white). Per V1.5 naming: the LINK
// logo carries the group name, the team is its descriptor.
export function Logo({
  onDark = false,
  height = 24,
  className = "",
}: {
  onDark?: boolean;
  height?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-0.5 ${className}`}>
      <Image
        src={logo}
        alt="LINK"
        height={height}
        width={Math.round((height * 1780) / 543)}
        priority
        className={onDark ? "brightness-0 invert" : ""}
      />
      <span
        className={onDark ? "font-display font-bold tracking-tight text-advance-bright" : "font-display font-bold tracking-tight text-advance"}
        style={{ fontSize: height * 0.92, lineHeight: 1 }}
      >
        Advance
      </span>
    </span>
  );
}
