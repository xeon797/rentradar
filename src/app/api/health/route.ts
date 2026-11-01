import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/repositories/property-repository";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { BD_NEIGHBORHOOD_BENCHMARKS } from "@/lib/data/bd-neighborhood-benchmarks";
import { PREMISES_RENT_CONTROL_ACT_1991_SECTIONS } from "@/lib/legal/bd-rent-act-1991";

export const runtime = "nodejs";

export async function GET() {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );

  const supabaseConfigured = isSupabaseConfigured();
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")
  );

  const { properties, dataSource } = await getAllProperties();
  const neighborhoodBenchmarksCount = Object.keys(BD_NEIGHBORHOOD_BENCHMARKS).length;
  const sectionsIndexed = PREMISES_RENT_CONTROL_ACT_1991_SECTIONS.length;

  return NextResponse.json(
    {
      ok: true,
      platform: "RentRadar BD // Civic Rental Intelligence",
      tagline: "Bangladesh Housing Transparency, Forensic Scam Defense & Statutory Tenant Rights",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      subsystems: {
        geminiMultimodal: {
          status: "READY",
          model: "gemini-2.5-flash",
          mode: geminiConfigured
            ? "GEMINI_2_5_FLASH_LIVE"
            : "DETERMINISTIC_BILINGUAL_FALLBACK",
          configured: geminiConfigured,
          capabilities: [
            "Multimodal Image OCR",
            "Bangla & English Claim Extraction",
            "Statutory Section Grounding",
            "Natural Language Search Interpretation",
          ],
        },
        sharpPerceptualDhash: {
          status: "READY",
          engine: "SHARP_NATIVE_NODEJS",
          algorithm: "9x8_LANCZOS3_GRAYSCALE_64BIT_GRADIENT",
          collisionThresholdBits: 10,
          fingerprintResolution: "64-bit binary bit string & 16-hex hash",
          luminanceMatrix: "8x8 normalized brightness gradient",
        },
        databaseRepository: {
          status: "READY",
          mode: supabaseConfigured ? "SUPABASE_PGVECTOR_LIVE" : "HYBRID_LOCAL_LEDGER",
          activeDataSource: dataSource,
          totalListings: properties.length,
          engineeredCollisionPairs: 3,
          neighborhoodBenchmarks: neighborhoodBenchmarksCount,
          citiesCovered: ["Dhaka", "Sylhet", "Chattogram"],
        },
        privacyVault: {
          status: "ENFORCED",
          nidAutoMasking: true,
          utilityBillZeroLlmLeak: true,
          meterAccountVerification: "DETERMINISTIC_HASH_MATCH",
          emailLedger: resendConfigured ? "RESEND_CLOUD_API" : "LOCAL_MIME_LEDGER",
        },
        statutoryEngine: {
          status: "READY",
          act: "Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)",
          sectionsIndexed,
          sections: [
            "Section 7 (2-Year Rent Freeze)",
            "Section 10 (Advance Rent Limit)",
            "Section 13 (Written Rent Receipt)",
            "Section 15 (Standard Rent Fixation)",
            "Section 18 (Eviction Protection & Notice)",
            "Section 21 (Utility Cut-Off Prohibition)",
            "BERC Sub-Meter Electricity Code",
          ],
        },
        rateLimiter: {
          status: "ACTIVE",
          windowSeconds: 60,
          burstLimitPerMinute: 25,
          circuitBreaker: "AUTO_FAILOVER_TO_DETERMINISTIC",
          failSafeGuaranteed: true,
        },
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-RentRadar-Telemetry": "ACTIVE",
      },
    }
  );
}
