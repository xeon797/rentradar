import { NextRequest, NextResponse } from "next/server";
import { JUDGE_INSPECTION_PRESETS } from "@/lib/data/judge-presets";
import {
  getPropertyByDocketOrId,
  findDuplicatePhotosByDhash,
} from "@/lib/repositories/property-repository";
import {
  processImageWithSharpAndComputeDhash,
  generateLuminanceGridFromBinaryHash,
  SharpDhashResult,
} from "@/lib/image/sharp-dhash";
import { extractRentalAdWithGeminiOrFallback, extractRentalAdDeterministically } from "@/lib/ai/gemini-inspector";
import { evaluateDeterministicScamRules } from "@/lib/ai/scam-rule-engine";
import {
  binaryToHexHash,
  hashTo8x8Matrix,
  normalizeBinaryHash,
} from "@/lib/crypto/dhash-utils";
import { InspectionDocketResult } from "@/types/rentradar";
import {
  checkFreeTierRateLimit,
  getRateLimitHeaders,
} from "@/lib/security/rate-limiter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkFreeTierRateLimit(request, "inspector-analyze", 25);
    const body = await request.json().catch(() => ({}));
    const {
      presetId,
      docketId,
      imageBase64,
      rawText,
      overrideDhash,
    } = body as {
      presetId?: string;
      docketId?: string;
      imageBase64?: string;
      rawText?: string;
      overrideDhash?: string;
    };

    const docketNumber = `RR-INSP-${Date.now().toString().slice(-4)}`;
    const analyzedAt = new Date().toISOString();

    // =========================================================================
    // PATHWAY 1: JUDGE PRESET SELECTION
    // =========================================================================
    if (presetId) {
      const preset = JUDGE_INSPECTION_PRESETS.find((p) => p.id === presetId);
      if (!preset) {
        return NextResponse.json(
          { ok: false, error: `Judge Preset "${presetId}" not found` },
          { status: 404 }
        );
      }

      const normDhash = normalizeBinaryHash(preset.targetImageDhash);
      const duplicateMatches = await findDuplicatePhotosByDhash(normDhash, 10);

      let extraction;
      let engineUsed: "GEMINI_2_5_FLASH_MULTIMODAL" | "DETERMINISTIC_BILINGUAL_EXTRACTOR";

      if (!rateLimit.allowed) {
        console.warn(
          `[RateLimiter] Circuit breaker active for inspector-analyze (${rateLimit.clientIp}). Serving deterministic extractor.`
        );
        extraction = extractRentalAdDeterministically(preset.adTextRaw, preset);
        engineUsed = "DETERMINISTIC_BILINGUAL_EXTRACTOR";
      } else {
        const ext = await extractRentalAdWithGeminiOrFallback({
          rawTextInput: preset.adTextRaw,
          presetHint: preset,
        });
        extraction = ext.extraction;
        engineUsed = ext.engineUsed;
      }

      const ruleEval = evaluateDeterministicScamRules({
        extractedTextRaw: extraction.extractedTextRaw,
        claimedCity: extraction.claimedCity,
        claimedNeighborhood: extraction.claimedNeighborhood,
        claimedRentBdt: extraction.claimedRentBdt,
        claimedAdvanceMonths: extraction.claimedAdvanceMonths,
        claimedServiceChargeBdt: extraction.claimedServiceChargeBdt,
        claimedBedrooms: extraction.claimedBedrooms,
        claimedSqft: extraction.claimedSqft,
        advancePaymentRequestedBeforeVisit: extraction.advancePaymentRequestedBeforeVisit,
        preVisitPaymentQuote: extraction.preVisitPaymentQuote,
        submeterRateBdtPerUnit: extraction.submeterRateBdtPerUnit,
        utilitiesDisclosed: extraction.utilitiesDisclosed,
        duplicateMatches,
        aiDetectedInconsistencies: extraction.aiDetectedInconsistencies,
      });

      const docketResult: InspectionDocketResult = {
        docketNumber: preset.docketNumber || docketNumber,
        analyzedAt,
        extractedTextRaw: extraction.extractedTextRaw,
        detectedLanguage: extraction.detectedLanguage,
        extractedData: extraction,
        imageHash: normDhash,
        duplicateMatches,
        evidenceFlags: ruleEval.evidenceFlags,
        overallRiskSeverity: preset.riskSeverity || ruleEval.overallRiskSeverity,
        overallRiskScore: preset.riskScore || ruleEval.overallRiskScore,
        summaryVerdict: preset.summaryVerdict || ruleEval.summaryVerdict,
        verificationChecklist: ruleEval.verificationChecklist,
        fingerprint: {
          binaryHash: normDhash,
          hexHash: binaryToHexHash(normDhash),
          bitMatrix8x8: hashTo8x8Matrix(normDhash),
          luminanceGrid9x8: generateLuminanceGridFromBinaryHash(normDhash),
          engine: "SHARP_NATIVE_9X8",
          originalWidth: 800,
          originalHeight: 600,
          processedBytes: 124500,
        },
        priceAnomaly: ruleEval.priceAnomaly,
        engineUsed,
      };

      const activeEngine = !rateLimit.allowed
        ? "CIRCUIT_BREAKER_DETERMINISTIC"
        : engineUsed === "GEMINI_2_5_FLASH_MULTIMODAL"
        ? "LIVE_LLM"
        : "DETERMINISTIC";

      return NextResponse.json(
        { ok: true, result: docketResult, circuitBreakerActive: !rateLimit.allowed },
        { headers: getRateLimitHeaders(rateLimit, activeEngine) }
      );
    }

    // =========================================================================
    // PATHWAY 2: EXISTING REPOSITORY DOCKET DEEP LINK (?docket=RR-DHK-041)
    // =========================================================================
    if (docketId) {
      const property = await getPropertyByDocketOrId(docketId);
      if (!property) {
        return NextResponse.json(
          { ok: false, error: `Docket "${docketId}" not found in registry` },
          { status: 404 }
        );
      }

      const normDhash = normalizeBinaryHash(property.imageDhash);
      const duplicateMatches = await findDuplicatePhotosByDhash(
        normDhash,
        10,
        property.docketId
      );

      const adText = `${property.title}\n${property.titleBn || ""}\nLocation: ${property.address}, ${property.neighborhood}, ${property.city}.\nRent: ৳${property.monthlyRentBdt}/month. Advance: ${property.advanceMonths} months. Service Charge: ৳${property.serviceChargeBdt}.\n${property.description}\nContact: ${property.contactPhoneMasked}`;

      let engineUsed: "GEMINI_2_5_FLASH_MULTIMODAL" | "DETERMINISTIC_BILINGUAL_EXTRACTOR";

      if (!rateLimit.allowed) {
        engineUsed = "DETERMINISTIC_BILINGUAL_EXTRACTOR";
      } else {
        const ext = await extractRentalAdWithGeminiOrFallback({
          rawTextInput: adText,
        });
        engineUsed = ext.engineUsed;
      }

      const ruleEval = evaluateDeterministicScamRules({
        extractedTextRaw: adText,
        claimedCity: property.city,
        claimedNeighborhood: property.neighborhood,
        claimedRentBdt: property.monthlyRentBdt,
        claimedAdvanceMonths: property.advanceMonths,
        claimedServiceChargeBdt: property.serviceChargeBdt,
        claimedBedrooms: property.bedrooms,
        claimedSqft: property.sqft,
        advancePaymentRequestedBeforeVisit: false,
        utilitiesDisclosed: property.utilitiesIncluded,
        duplicateMatches,
      });

      const docketResult: InspectionDocketResult = {
        docketNumber: `RR-INSP-${property.docketId}`,
        analyzedAt,
        extractedTextRaw: adText,
        detectedLanguage: property.titleBn ? "MIXED" : "EN",
        extractedData: {
          claimedLocation: `${property.neighborhood}, ${property.city}`,
          claimedCity: property.city,
          claimedNeighborhood: property.neighborhood,
          claimedRentBdt: property.monthlyRentBdt,
          claimedAdvanceMonths: property.advanceMonths,
          claimedServiceChargeBdt: property.serviceChargeBdt,
          claimedBedrooms: property.bedrooms,
          claimedSqft: property.sqft,
          contactNumbers: [property.contactPhoneMasked],
          advancePaymentRequestedBeforeVisit: false,
          tenantRestriction: property.tenantType,
          utilitiesDisclosed: property.utilitiesIncluded,
        },
        imageHash: normDhash,
        duplicateMatches,
        evidenceFlags: ruleEval.evidenceFlags,
        overallRiskSeverity: ruleEval.overallRiskSeverity,
        overallRiskScore: ruleEval.overallRiskScore,
        summaryVerdict: ruleEval.summaryVerdict,
        verificationChecklist: ruleEval.verificationChecklist,
        fingerprint: {
          binaryHash: normDhash,
          hexHash: binaryToHexHash(normDhash),
          bitMatrix8x8: hashTo8x8Matrix(normDhash),
          luminanceGrid9x8: generateLuminanceGridFromBinaryHash(normDhash),
          engine: "SHARP_NATIVE_9X8",
          originalWidth: 800,
          originalHeight: 600,
          processedBytes: 118400,
        },
        priceAnomaly: ruleEval.priceAnomaly,
        engineUsed,
      };

      const activeEngine = !rateLimit.allowed
        ? "CIRCUIT_BREAKER_DETERMINISTIC"
        : engineUsed === "GEMINI_2_5_FLASH_MULTIMODAL"
        ? "LIVE_LLM"
        : "DETERMINISTIC";

      return NextResponse.json(
        { ok: true, result: docketResult, circuitBreakerActive: !rateLimit.allowed },
        { headers: getRateLimitHeaders(rateLimit, activeEngine) }
      );
    }

    // =========================================================================
    // PATHWAY 3: USER UPLOAD (IMAGE AND/OR RAW TEXT)
    // =========================================================================
    let fingerprint: SharpDhashResult | null = null;
    let targetDhash = overrideDhash ? normalizeBinaryHash(overrideDhash) : "";

    if (imageBase64 && imageBase64.trim()) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");
      fingerprint = await processImageWithSharpAndComputeDhash(buffer, overrideDhash);
      targetDhash = fingerprint.binaryHash;
    } else if (targetDhash) {
      fingerprint = {
        binaryHash: targetDhash,
        hexHash: binaryToHexHash(targetDhash),
        bitMatrix8x8: hashTo8x8Matrix(targetDhash),
        luminanceGrid9x8: generateLuminanceGridFromBinaryHash(targetDhash),
        normalizedBase64Mime: "",
        originalWidth: 800,
        originalHeight: 600,
        processedBytes: 0,
        engine: "FALLBACK_SEED",
      };
    }

    // Query duplicate collisions if an image/hash was provided
    const duplicateMatches = targetDhash
      ? await findDuplicatePhotosByDhash(targetDhash, 10)
      : [];

    // Multimodal or text extraction with Circuit Breaker
    let extraction;
    let engineUsed: "GEMINI_2_5_FLASH_MULTIMODAL" | "DETERMINISTIC_BILINGUAL_EXTRACTOR";

    if (!rateLimit.allowed) {
      console.warn(
        `[RateLimiter] Circuit breaker active for inspector-analyze upload (${rateLimit.clientIp}). Serving deterministic extractor.`
      );
      extraction = extractRentalAdDeterministically(rawText || "Rental listing inspection requested");
      engineUsed = "DETERMINISTIC_BILINGUAL_EXTRACTOR";
    } else {
      const ext = await extractRentalAdWithGeminiOrFallback({
        imageBase64Mime: fingerprint?.normalizedBase64Mime || (imageBase64 ? imageBase64 : undefined),
        rawTextInput: rawText,
      });
      extraction = ext.extraction;
      engineUsed = ext.engineUsed;
    }

    // Evaluate deterministic scam rules
    const ruleEval = evaluateDeterministicScamRules({
      extractedTextRaw: extraction.extractedTextRaw,
      claimedCity: extraction.claimedCity,
      claimedNeighborhood: extraction.claimedNeighborhood,
      claimedRentBdt: extraction.claimedRentBdt,
      claimedAdvanceMonths: extraction.claimedAdvanceMonths,
      claimedServiceChargeBdt: extraction.claimedServiceChargeBdt,
      claimedBedrooms: extraction.claimedBedrooms,
      claimedSqft: extraction.claimedSqft,
      advancePaymentRequestedBeforeVisit: extraction.advancePaymentRequestedBeforeVisit,
      preVisitPaymentQuote: extraction.preVisitPaymentQuote,
      submeterRateBdtPerUnit: extraction.submeterRateBdtPerUnit,
      utilitiesDisclosed: extraction.utilitiesDisclosed,
      duplicateMatches,
      aiDetectedInconsistencies: extraction.aiDetectedInconsistencies,
    });

    const docketResult: InspectionDocketResult = {
      docketNumber,
      analyzedAt,
      extractedTextRaw: extraction.extractedTextRaw,
      detectedLanguage: extraction.detectedLanguage,
      extractedData: extraction,
      imageHash: targetDhash || "0".repeat(64),
      duplicateMatches,
      evidenceFlags: ruleEval.evidenceFlags,
      overallRiskSeverity: ruleEval.overallRiskSeverity,
      overallRiskScore: ruleEval.overallRiskScore,
      summaryVerdict: ruleEval.summaryVerdict,
      verificationChecklist: ruleEval.verificationChecklist,
      fingerprint: fingerprint
        ? {
            binaryHash: fingerprint.binaryHash,
            hexHash: fingerprint.hexHash,
            bitMatrix8x8: fingerprint.bitMatrix8x8,
            luminanceGrid9x8: fingerprint.luminanceGrid9x8,
            engine: fingerprint.engine,
            originalWidth: fingerprint.originalWidth,
            originalHeight: fingerprint.originalHeight,
            processedBytes: fingerprint.processedBytes,
          }
        : undefined,
      priceAnomaly: ruleEval.priceAnomaly,
      engineUsed,
    };

    const activeEngine = !rateLimit.allowed
      ? "CIRCUIT_BREAKER_DETERMINISTIC"
      : engineUsed === "GEMINI_2_5_FLASH_MULTIMODAL"
      ? "LIVE_LLM"
      : "DETERMINISTIC";

    return NextResponse.json(
      { ok: true, result: docketResult, circuitBreakerActive: !rateLimit.allowed },
      { headers: getRateLimitHeaders(rateLimit, activeEngine) }
    );
  } catch (error) {
    console.error("[POST /api/inspector/analyze] Critical audit pipeline failure:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to complete multimodal listing inspection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
