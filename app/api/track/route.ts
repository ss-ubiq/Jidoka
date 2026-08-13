import { NextResponse } from "next/server";

/**
 * Analytics intake (§66). Validates against an event allow-list, drops anything else, and
 * either logs the event or forwards it to a self-hostable sink (ANALYTICS_FORWARD_URL — e.g.
 * a Plausible/Umami/self-hosted endpoint). No cookies, no personal data, no IP persistence.
 */
export const runtime = "nodejs";

const ALLOWED = new Set([
  "search_performed",
  "search_no_result",
  "product_view",
  "family_view",
  "rfq_start",
  "rfq_submit",
  "resource_download",
  "contact_click",
  "cta_click",
]);

export async function POST(req: Request) {
  let payload: { event?: string; props?: Record<string, unknown>; path?: string; ts?: number };
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (!payload?.event || !ALLOWED.has(payload.event)) {
    return new NextResponse(null, { status: 204 });
  }

  // Keep only primitive, non-identifying props.
  const props: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload.props ?? {})) {
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      props[k] = typeof v === "string" ? v.slice(0, 120) : v;
    }
  }

  const record = { event: payload.event, path: String(payload.path ?? "").slice(0, 200), props, ts: payload.ts ?? Date.now() };

  const sink = process.env.ANALYTICS_FORWARD_URL;
  if (sink) {
    try {
      await fetch(sink, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record) });
    } catch (err) {
      console.error("[track] forward failed:", err);
    }
  } else {
    console.info("[track]", JSON.stringify(record));
  }

  return new NextResponse(null, { status: 204 });
}
