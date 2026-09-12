/**
 * Privacy-preserving analytics (§66, §82). Self-hostable, no paid SaaS, no cookies, no
 * personal data. Events are conversion-funnel signals only. Honours Do-Not-Track.
 * Sending is best-effort and never blocks the UI.
 *
 * Each event declares exactly which properties it may carry, and they are all bounded
 * enums, counts or flags. The previous version accepted any primitive under any key,
 * and the search box sent the visitor's raw query — which is free text a person can type
 * a customer name, a project code or an unreleased part into. "It's only a string" is not
 * the same as "it contains no personal or confidential information".
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

/**
 * The allowed shape of each event. Anything not listed is dropped before sending — and
 * dropped again at the endpoint, which does not trust the browser.
 */
export type EventProps = Record<string, string | number | boolean>;

type FieldRule = { type: "enum"; values: readonly string[] } | { type: "count" } | { type: "flag" };

/** Free text is never an option here. Categories, counts and flags only. */
export const EVENT_SCHEMA: Record<AnalyticsEvent, Record<string, FieldRule>> = {
  // What kind of thing was searched for and whether it landed — never the words typed.
  search_performed: {
    kind: { type: "enum", values: ["part-code", "term"] },
    length: { type: "count" },
    results: { type: "count" },
  },
  search_no_result: {
    kind: { type: "enum", values: ["part-code", "term"] },
    length: { type: "count" },
  },
  product_view: { product: { type: "enum", values: [] }, family: { type: "enum", values: [] } },
  family_view: { family: { type: "enum", values: [] } },
  rfq_start: { mode: { type: "enum", values: MODES() } },
  rfq_submit: { mode: { type: "enum", values: MODES() }, items: { type: "count" }, files: { type: "count" } },
  resource_download: { resource: { type: "enum", values: [] } },
  contact_click: { channel: { type: "enum", values: ["email", "phone", "whatsapp", "map"] } },
  cta_click: { cta: { type: "enum", values: [] } },
};

function MODES(): readonly string[] {
  return ["quote", "requirement", "alternative", "bom", "custom", "engineer"];
}

/**
 * An empty `values` list means "an identifier from our own catalogue", which is site
 * content rather than visitor input. It is still bounded in length and character set so a
 * caller cannot smuggle free text through it.
 */
const ID_PATTERN = /^[A-Za-z0-9._/-]{1,64}$/;

const MAX_PROPS = 6;

export function sanitizeProps(event: AnalyticsEvent, props: EventProps): EventProps {
  const schema = EVENT_SCHEMA[event];
  if (!schema) return {};
  const out: EventProps = {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = props[key];
    if (value === undefined || value === null) continue;
    if (Object.keys(out).length >= MAX_PROPS) break;
    if (rule.type === "flag") {
      if (typeof value === "boolean") out[key] = value;
      continue;
    }
    if (rule.type === "count") {
      const n = Number(value);
      if (Number.isFinite(n) && n >= 0) out[key] = Math.min(Math.floor(n), 100_000);
      continue;
    }
    const s = String(value);
    if (rule.values.length) {
      if (rule.values.includes(s)) out[key] = s;
    } else if (ID_PATTERN.test(s)) {
      out[key] = s;
    }
  }
  return out;
}

/** Classify a query without retaining it, so search demand is still measurable. */
export function classifyQuery(query: string): "part-code" | "term" {
  return /\d/.test(query) && /^[A-Za-z0-9\s.\-/]+$/.test(query) ? "part-code" : "term";
}

function dntEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const dnt =
    (navigator as unknown as { doNotTrack?: string }).doNotTrack ||
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

/** Query strings can carry what the visitor typed, so only the path is ever sent. */
function safePath(): string {
  try {
    return window.location.pathname.slice(0, 200);
  } catch {
    return "";
  }
}

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined" || dntEnabled()) return;
  try {
    const body = JSON.stringify({ event, props: sanitizeProps(event, props), path: safePath(), ts: Date.now() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics must never break the page */
  }
}
