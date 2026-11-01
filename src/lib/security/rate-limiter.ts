/**
 * Free-Tier Circuit-Breaker Rate Limiter
 *
 * Protects Gemini API and Resend free-tier allowances from burst exhaustion
 * using an in-memory sliding-window token bucket.
 *
 * Fail-Safe Design:
 * When quota is exhausted, this does NOT reject or return 429 errors.
 * Instead, it reports allowed: false so caller routes seamlessly switch
 * to RentRadar's 100% deterministic engines with zero user disruption.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInSeconds: number;
  fallbackToDeterministic: boolean;
  clientIp: string;
}

interface WindowBucket {
  timestamps: number[];
}

const RATE_LIMIT_STORE = new Map<string, WindowBucket>();
const WINDOW_MS = 60 * 1000; // 60-second sliding window
const DEFAULT_LIMIT = 25; // 25 requests per minute

/**
 * Extracts client IP safely from request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Sliding-window rate limit checker.
 */
export function checkFreeTierRateLimit(
  request: Request,
  namespace: "nl-search" | "inspector-analyze" | "legal-audit" | "verify-submit" | string,
  limitPerMinute = DEFAULT_LIMIT
): RateLimitResult {
  const clientIp = getClientIp(request);
  const key = `${clientIp}:${namespace}`;
  const now = Date.now();

  // Prune any legacy keys if store grows large (memory safety guard)
  if (RATE_LIMIT_STORE.size > 2000) {
    for (const [k, v] of RATE_LIMIT_STORE.entries()) {
      if (!v.timestamps.length || v.timestamps[v.timestamps.length - 1] < now - WINDOW_MS) {
        RATE_LIMIT_STORE.delete(k);
      }
    }
  }

  const bucket = RATE_LIMIT_STORE.get(key) || { timestamps: [] };

  // Remove timestamps outside current 60s sliding window
  bucket.timestamps = bucket.timestamps.filter((t) => t > now - WINDOW_MS);

  if (bucket.timestamps.length >= limitPerMinute) {
    const oldestTimestamp = bucket.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000));

    return {
      allowed: false,
      remaining: 0,
      limit: limitPerMinute,
      resetInSeconds,
      fallbackToDeterministic: true,
      clientIp,
    };
  }

  // Record current request timestamp
  bucket.timestamps.push(now);
  RATE_LIMIT_STORE.set(key, bucket);

  const remaining = Math.max(0, limitPerMinute - bucket.timestamps.length);
  const resetInSeconds = 60;

  return {
    allowed: true,
    remaining,
    limit: limitPerMinute,
    resetInSeconds,
    fallbackToDeterministic: false,
    clientIp,
  };
}

/**
 * Helper to generate standard rate-limit & circuit-breaker response headers.
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
  activeEngine: "LIVE_LLM" | "CIRCUIT_BREAKER_DETERMINISTIC" | "DETERMINISTIC"
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetInSeconds),
    "X-RentRadar-Circuit": activeEngine,
  };
}
