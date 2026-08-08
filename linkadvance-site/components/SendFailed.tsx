import { SITE } from "@/lib/site";

// Shown when a form submission did not reach us. The phone number is the point
// of this component: a failed enquiry is only lost if the person walks away, so
// the fallback route has to be right there and obviously usable.
export function SendFailed() {
  return (
    <p
      role="alert"
      className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
    >
      That didn&apos;t send. Nothing has reached us, so please call{" "}
      <a href={SITE.phoneHref} className="font-semibold underline">
        {SITE.phone}
      </a>{" "}
      or try again in a moment.
    </p>
  );
}
