import { NextRequest, NextResponse } from "next/server";
import {
  parseNaturalLanguageRentalQuery,
  parseQueryDeterministically,
} from "@/lib/ai/nl-search-parser";
import {
  checkFreeTierRateLimit,
  getRateLimitHeaders,
} from "@/lib/security/rate-limiter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkFreeTierRateLimit(request, "nl-search", 25);
    const body = await request.json().catch(() => ({}));
    const query = typeof body?.query === "string" ? body.query : "";

    if (!query.trim()) {
      return NextResponse.json(
        {
          error: "Query string is required",
          result: null,
        },
        {
          status: 400,
          headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC"),
        }
      );
    }

    // Circuit Breaker: Fallback directly to deterministic regex parser if rate limit hit
    if (!rateLimit.allowed) {
      console.warn(
        `[RateLimiter] Circuit breaker active for nl-search (${rateLimit.clientIp}). Serving deterministic engine.`
      );
      const fallbackResult = parseQueryDeterministically(query);
      return NextResponse.json(
        {
          success: true,
          query,
          result: fallbackResult,
          circuitBreakerActive: true,
        },
        {
          headers: getRateLimitHeaders(rateLimit, "CIRCUIT_BREAKER_DETERMINISTIC"),
        }
      );
    }

    const structured = await parseNaturalLanguageRentalQuery(query);
    const activeEngine =
      structured.engineUsed === "GEMINI_FLASH_LIVE" ? "LIVE_LLM" : "DETERMINISTIC";

    return NextResponse.json(
      {
        success: true,
        query,
        result: structured,
        circuitBreakerActive: false,
      },
      {
        headers: getRateLimitHeaders(rateLimit, activeEngine),
      }
    );
  } catch (error) {
    console.error("[POST /api/search/nl-filter] Error parsing rental query:", error);
    return NextResponse.json(
      {
        error: "Failed to parse natural language rental query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
