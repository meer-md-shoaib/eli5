/**
 * Best-effort, in-memory, fixed-window rate limiter.
 *
 * This is intentionally simple: serverless functions don't share memory
 * across instances, so under real horizontal scale this only limits traffic
 * that happens to land on the same warm instance. That's fine for a side
 * project or a low-traffic deployment. For anything that actually needs a
 * durable limit across instances, swap this module for Vercel KV, Upstash
 * Redis, or similar — the call site (app/api/explain/route.ts) doesn't care
 * how `checkRateLimit` is implemented.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_BUCKETS = 5000;

function getLimit(): number {
  const fromEnv = Number(process.env.RATE_LIMIT_PER_MINUTE);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : 20;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const limit = getLimit();

  // Cheap eviction so this Map can't grow unbounded on a long-lived instance.
  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (now - bucket.windowStart > WINDOW_MS) {
        buckets.delete(bucketKey);
      }
    }
  }

  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count < limit) {
    existing.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.ceil((existing.windowStart + WINDOW_MS - now) / 1000);
  return { allowed: false, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
}

/** Best-effort extraction of a client identifier from standard proxy headers. */
export function getClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
