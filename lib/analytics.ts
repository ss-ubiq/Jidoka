/**
 * Privacy-preserving analytics (§66, §82). Self-hostable, no paid SaaS, no cookies, no
 * personal data. Events are conversion-funnel signals only. Honours Do-Not-Track. Sending
 * is best-effort and never blocks the UI.
 */

export type AnalyticsEvent =
  | "search_performed"
  | "search_no_result"
  | "product_view"
  | "family_view"
  | "rfq_start"
  | "rfq_submit"
  | "resource_download"
  | "contact_click"
  | "cta_click";

/** Only non-identifying props should ever be passed here. */
export type EventProps = Record<string, string | number | boolean>;

function dntEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const dnt =
    (navigator as unknown as { doNotTrack?: string }).doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined" || dntEnabled()) return;
  try {
    const body = JSON.stringify({ event, props, path: window.location.pathname, ts: Date.now() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics must never break the page */
  }
}
