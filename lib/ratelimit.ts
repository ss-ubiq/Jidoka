/**
 * Best-effort flood control for the public endpoints.
 *
 * Be clear about what this is: a fixed-size, in-memory, per-instance counter. Netlify runs
 * these functions across instances that do not share state, so a determined attacker can
 * spread load and defeat it. It is here because it costs nothing and stops the common case
 * — one script hammering one endpoint — not because it is a security control.
 *
 * Durable rate limiting needs shared state (a KV store or the platform's own edge rate
 * limiting). That is provisioning, not code, so it is recorded as an owner action rather
 * than pretended at here.
 *
 * No IP address is ever stored: the key is a short hash, entries expire, and the map is
 * capped so it cannot grow into a memory leak of its own.
 */
import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_KEYS = 5_000;
const buckets = new Map<string, Bucket>();

/** A short, salted digest — enough to count repeats, not enough to identify anyone. */
function keyFor(req: Request, scope: string): string {
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return createHash("sha256").update(`${scope}:${ip}`).digest("base64url").slice(0, 16);
}

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  // Still full of live entries: drop the oldest rather than grow without bound.
  if (buckets.size >= MAX_KEYS) {
    const oldest = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt).slice(0, MAX_KEYS / 2);
    for (const [k] of oldest) buckets.delete(k);
  }
}

export type RateVerdict = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function rateLimit(req: Request, scope: string, limit: number, windowMs = WINDOW_MS): RateVerdict {
  const now = Date.now();
  sweep(now);
  const key = keyFor(req, scope);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { allowed: true };
}

/** Test seam — the counters are process-global by design. */
export function resetRateLimits(): void {
  buckets.clear();
}
