import { NextResponse } from "next/server";
import { EVENT_SCHEMA, sanitizeProps, type AnalyticsEvent, type EventProps } from "@/lib/analytics";
import { rateLimit } from "@/lib/ratelimit";

/**
 * Analytics intake (§66). Validates against the per-event schema in lib/analytics.ts,
 * drops anything else, and either logs the event or forwards it to a self-hostable sink
 * (ANALYTICS_FORWARD_URL — e.g. a Plausible/Umami endpoint). No cookies, no personal
 * data, no IP persistence.
 *
 * The schema is applied here as well as in the browser, because this endpoint is public:
 * anyone can POST to it. It previously accepted any primitive value under any key, which
 * made it a general-purpose way to write arbitrary strings into JIDOKA's log stream.
 */
export const runtime = "nodejs";

/** An analytics beacon is tiny; anything larger is not one. */
const MAX_BODY_BYTES = 2_000;
const MAX_PATH = 200;
const ok = () => new NextResponse(null, { status: 204 });

export async function POST(req: Request) {
  // A beacon endpoint is the easiest thing on the site to flood. Generous, since a real
  // visit fires several events a minute.
  if (!rateLimit(req, "track", 120).allowed) return ok();

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return ok(); // silently dropped: never argue with a beacon

  let payload: { event?: string; props?: EventProps; path?: string; ts?: number };
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return ok();
    payload = JSON.parse(text);
  } catch {
    return ok();
  }

  const event = payload?.event;
  if (typeof event !== "string" || !(event in EVENT_SCHEMA)) return ok();

  // Paths are site routes; a query string can contain what the visitor typed, so it is
  // stripped here even if a caller managed to include one.
  const path = String(payload.path ?? "").split(/[?#]/)[0].slice(0, MAX_PATH);

  const record = {
    event,
    path,
    props: sanitizeProps(event as AnalyticsEvent, (payload.props ?? {}) as EventProps),
    ts: Number.isFinite(payload.ts) ? payload.ts : Date.now(),
  };

  const sink = process.env.ANALYTICS_FORWARD_URL;
  if (sink) {
    // Bounded, and never allowed to hold the response open.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2_000);
    try {
      await fetch(sink, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
        signal: controller.signal,
      });
    } catch {
      console.error("[track] forward failed");
    } finally {
      clearTimeout(timer);
    }
  } else {
    console.info("[track]", JSON.stringify(record));
  }

  return ok();
}
