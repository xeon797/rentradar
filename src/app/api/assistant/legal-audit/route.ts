import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  PREMISES_RENT_CONTROL_ACT_1991_SECTIONS,
  SAMPLE_LEASE_AUDIT_PRESETS,
  auditLeaseAgreementDeterministically,
  answerTenantQuestionDeterministically,
  LeaseAuditResult,
  TenantQAResult,
} from "@/lib/legal/bd-rent-act-1991";
import {
  checkFreeTierRateLimit,
  getRateLimitHeaders,
} from "@/lib/security/rate-limiter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkFreeTierRateLimit(request, "legal-audit", 25);
    const body = await request.json().catch(() => ({}));
    const { mode = "LEASE_AUDIT", text = "", presetId } = body as {
      mode?: "LEASE_AUDIT" | "LEGAL_QA";
      text?: string;
      presetId?: string;
    };

    let targetText = text;
    if (presetId) {
      const matched = SAMPLE_LEASE_AUDIT_PRESETS.find((p) => p.id === presetId);
      if (matched) {
        targetText = matched.leaseText;
      }
    }

    if (!targetText.trim()) {
      return NextResponse.json(
        { ok: false, error: "Text content is required for legal audit or Q&A." },
        { status: 400, headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC") }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // =========================================================================
    // MODE 1: LEASE AGREEMENT & CLAUSE AUDIT
    // =========================================================================
    if (mode === "LEASE_AUDIT") {
      // 1. Always compute deterministic audit as baseline / fallback
      const deterministicResult: LeaseAuditResult =
        auditLeaseAgreementDeterministically(targetText);

      // Circuit Breaker: Fall back immediately to deterministic engine if rate limit exceeded
      if (!rateLimit.allowed) {
        console.warn(
          `[RateLimiter] Circuit breaker active for legal-audit (${rateLimit.clientIp}). Serving deterministic engine.`
        );
        return NextResponse.json(
          {
            ok: true,
            mode: "LEASE_AUDIT",
            source: "CIRCUIT_BREAKER_DETERMINISTIC",
            data: deterministicResult,
            circuitBreakerActive: true,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "CIRCUIT_BREAKER_DETERMINISTIC"),
          }
        );
      }

      if (!apiKey) {
        return NextResponse.json(
          {
            ok: true,
            mode: "LEASE_AUDIT",
            source: "DETERMINISTIC_STATUTORY_ENGINE",
            data: deterministicResult,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC"),
          }
        );
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const statutoryContext = PREMISES_RENT_CONTROL_ACT_1991_SECTIONS.map(
          (s) =>
            `[${s.sectionNumber}: ${s.titleEn} / ${s.titleBn}]\n- Rule: ${s.statutoryRuleSummary}\n- Violation Pattern: ${s.commonViolationPattern}\n- Counter Clause (EN): ${s.recommendedCounterClauseEn}\n- Counter Clause (BN): ${s.recommendedCounterClauseBn}`
        ).join("\n\n");

        const prompt = `You are RentRadar's Lead LegalTech Auditor specializing in Bangladesh Tenancy Law and The Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১).
Analyze the following lease agreement or mess rule text against Bangladesh statutory law:

=== STATUTORY CORPUS ===
${statutoryContext}

=== LEASE TEXT TO AUDIT ===
"${targetText}"

Output strict JSON with this exact structure:
{
  "overallComplianceStatus": "COMPLIANT" | "CAUTION_CLAUSES_FOUND" | "SEVERE_STATUTORY_VIOLATIONS",
  "complianceScore": <number 0 to 100>,
  "summaryOverview": "<Concise 2-sentence summary in English>",
  "summaryOverviewBn": "<Concise 2-sentence summary in Bangla>",
  "auditedClauses": [
    {
      "clauseTitle": "<Short title of clause>",
      "extractedQuote": "<Verbatim Bangla/English quote from the text>",
      "status": "VIOLATION" | "WARNING" | "COMPLIANT",
      "statutorySectionRef": "<e.g. Section 10, Section 13, Section 18, Section 21, or BERC Tariff Code>",
      "legalExplanation": "<Clear explanation of why this violates or complies with Bangladesh law>",
      "counterDraftEn": "<A polite, professional English counter-proposal clause citing the 1991 Act>",
      "counterDraftBn": "<A polite, professional Bangla counter-proposal clause citing the 1991 Act>"
    }
  ],
  "tenantActionPlan": ["<Step 1>", "<Step 2>", "<Step 3>"],
  "flaggedSectionNumbers": ["<Section names e.g. Section 10, Section 13>"]
}
Do not enclose in markdown code fences. Return valid JSON only.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const rawJson = response.text?.trim() || "";
        const parsed = JSON.parse(rawJson) as LeaseAuditResult;

        return NextResponse.json(
          {
            ok: true,
            mode: "LEASE_AUDIT",
            source: "GEMINI_2_5_FLASH_STATUTORY_INJECTED",
            data: parsed,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "LIVE_LLM"),
          }
        );
      } catch (geminiErr) {
        console.warn(
          "[RentRadar Legal Audit] Gemini API error, falling back to deterministic engine:",
          geminiErr
        );
        return NextResponse.json(
          {
            ok: true,
            mode: "LEASE_AUDIT",
            source: "DETERMINISTIC_STATUTORY_ENGINE_FALLBACK",
            data: deterministicResult,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC"),
          }
        );
      }
    }

    // =========================================================================
    // MODE 2: TENANT LEGAL RIGHTS Q&A
    // =========================================================================
    if (mode === "LEGAL_QA") {
      const deterministicQA: TenantQAResult =
        answerTenantQuestionDeterministically(targetText);

      // Circuit Breaker: Fall back immediately to deterministic engine if rate limit exceeded
      if (!rateLimit.allowed) {
        console.warn(
          `[RateLimiter] Circuit breaker active for legal-qa (${rateLimit.clientIp}). Serving deterministic engine.`
        );
        return NextResponse.json(
          {
            ok: true,
            mode: "LEGAL_QA",
            source: "CIRCUIT_BREAKER_DETERMINISTIC",
            data: deterministicQA,
            circuitBreakerActive: true,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "CIRCUIT_BREAKER_DETERMINISTIC"),
          }
        );
      }

      if (!apiKey) {
        return NextResponse.json(
          {
            ok: true,
            mode: "LEGAL_QA",
            source: "DETERMINISTIC_STATUTORY_ENGINE",
            data: deterministicQA,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC"),
          }
        );
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const statutoryContext = PREMISES_RENT_CONTROL_ACT_1991_SECTIONS.map(
          (s) =>
            `[${s.sectionNumber}: ${s.titleEn} / ${s.titleBn}]\n- Rule: ${s.statutoryRuleSummary}\n- Right: ${s.tenantProtectionRight}\n- Penalty: ${s.penaltySummary}`
        ).join("\n\n");

        const prompt = `You are RentRadar's Tenant Protection Assistant grounded in Bangladesh law (The Premises Rent Control Act, 1991 - বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১).
Answer the tenant's inquiry accurately, with authoritative statutory citations and practical negotiation counter-clauses.

=== STATUTORY CORPUS ===
${statutoryContext}

=== TENANT QUESTION ===
"${targetText}"

Output strict JSON with this exact structure:
{
  "questionTopic": "<Short title of topic>",
  "statutorySection": "<e.g. Section 13, Premises Rent Control Act, 1991 (ধারা ১৩)>",
  "legalSummary": "<Authoritative explanation in English with specific section reference>",
  "legalSummaryBn": "<Authoritative explanation in Bangla with specific section reference>",
  "tenantRightsPoints": ["<Point 1 in English>", "<Point 2 in English>", "<Point 3 in English>"],
  "practicalNextSteps": ["<Actionable step 1>", "<Actionable step 2>", "<Actionable step 3>"],
  "counterClauseProposal": {
    "en": "<Ready-to-use negotiation clause in English>",
    "bn": "<Ready-to-use negotiation clause in Bangla>"
  }
}
Do not enclose in markdown code fences. Return valid JSON only.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });

        const rawJson = response.text?.trim() || "";
        const parsed = JSON.parse(rawJson) as TenantQAResult;

        return NextResponse.json(
          {
            ok: true,
            mode: "LEGAL_QA",
            source: "GEMINI_2_5_FLASH_STATUTORY_INJECTED",
            data: parsed,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "LIVE_LLM"),
          }
        );
      } catch (geminiErr) {
        console.warn(
          "[RentRadar Legal QA] Gemini API error, falling back to deterministic engine:",
          geminiErr
        );
        return NextResponse.json(
          {
            ok: true,
            mode: "LEGAL_QA",
            source: "DETERMINISTIC_STATUTORY_ENGINE_FALLBACK",
            data: deterministicQA,
            circuitBreakerActive: false,
          },
          {
            headers: getRateLimitHeaders(rateLimit, "DETERMINISTIC"),
          }
        );
      }
    }

    return NextResponse.json(
      { ok: false, error: "Invalid mode. Use LEASE_AUDIT or LEGAL_QA." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
