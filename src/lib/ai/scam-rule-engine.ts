import { PropertyListing, EvidenceFlag, RiskSeverity } from "@/types/rentradar";
import {
  evaluateNeighborhoodPriceAnomaly,
  AnomalyEvaluationResult,
} from "@/lib/data/bd-neighborhood-benchmarks";

export interface ScamRuleEvaluationInput {
  extractedTextRaw: string;
  claimedCity: "Dhaka" | "Sylhet" | "Chattogram";
  claimedNeighborhood: string;
  claimedRentBdt: number | null;
  claimedAdvanceMonths: number | null;
  claimedServiceChargeBdt: number | null;
  claimedBedrooms: number | null;
  claimedSqft: number | null;
  advancePaymentRequestedBeforeVisit: boolean;
  preVisitPaymentQuote?: string;
  submeterRateBdtPerUnit?: number | null;
  utilitiesDisclosed: boolean;
  duplicateMatches: Array<{
    listing: PropertyListing;
    hammingDistance: number;
    similarityPercent: number;
  }>;
  aiDetectedInconsistencies?: Array<{
    title: string;
    explanation: string;
    quote?: string;
    severity?: RiskSeverity;
  }>;
}

export interface ScamRuleEvaluationResult {
  evidenceFlags: EvidenceFlag[];
  overallRiskScore: number; // 5 to 98
  overallRiskSeverity: RiskSeverity;
  priceAnomaly: AnomalyEvaluationResult;
  summaryVerdict: string;
  verificationChecklist: string[];
}

/**
 * Deterministic Bangladesh Scam & Statutory Rule Engine.
 * Evaluates extracted ad claims, 64-bit dHash collisions, and neighborhood benchmarks
 * against 6 concrete forensic rules and the Premises Rent Control Act, 1991.
 */
export function evaluateDeterministicScamRules(
  input: ScamRuleEvaluationInput
): ScamRuleEvaluationResult {
  const flags: EvidenceFlag[] = [];
  let score = 8; // Baseline clean score

  const textLower = (input.extractedTextRaw || "").toLowerCase();

  // =========================================================================
  // RULE 1: ADVANCE BKASH / NAGAD PRE-VISIT PAYMENT DEMAND (CRITICAL +45 pts)
  // =========================================================================
  const mobileMoneyKeywords = [
    "বিকাশ",
    "নগদ",
    "রকেট",
    "bkash",
    "nagad",
    "rocket",
    "ভিজিটিং কার্ড",
    "বাসা দেখার আগে",
    "বুকিং ফি",
    "visiting fee",
    "visiting card",
    "send advance before visit",
    "অগ্রিম বিকাশ",
    "অগ্রিম বুকিং",
    "বিকাশ করুন",
  ];

  const hasMobileMoneyPhrase = mobileMoneyKeywords.some((kw) => textLower.includes(kw));
  const isPreVisitTrap = input.advancePaymentRequestedBeforeVisit || hasMobileMoneyPhrase;

  if (isPreVisitTrap) {
    // Extract quote context
    let quote = input.preVisitPaymentQuote;
    if (!quote && input.extractedTextRaw) {
      const sentences = input.extractedTextRaw.split(/[।.\n]/);
      const match = sentences.find((s) =>
        mobileMoneyKeywords.some((kw) => s.toLowerCase().includes(kw))
      );
      if (match) quote = match.trim();
    }

    flags.push({
      code: "ADVANCE_BKASH_DEMAND",
      title: "Pre-Visit Mobile Money Demand (bKash/Nagad Trap)",
      severity: "CRITICAL",
      explanation:
        "The advertisement demands a mobile banking transfer (bKash/Nagad) or visiting card fee prior to physical inspection. In Bangladesh urban rentals, legitimate landlords never demand advance fees before a prospective tenant physically inspects the flat and confirms ownership documents.",
      evidenceQuote: quote || "Demands mobile money advance before property visit.",
    });
    score += 45;
  }

  // =========================================================================
  // RULE 2: PERCEPTUAL IMAGE COLLISION WITH EXISTING DOCKET (CRITICAL/HIGH +35 pts)
  // =========================================================================
  if (input.duplicateMatches && input.duplicateMatches.length > 0) {
    const topMatch = input.duplicateMatches[0];
    const isExact = topMatch.hammingDistance <= 2;
    const severity: RiskSeverity = isExact ? "CRITICAL" : "HIGH";

    const isDifferentNeighborhood =
      input.claimedNeighborhood &&
      topMatch.listing.neighborhood.toLowerCase() !== input.claimedNeighborhood.toLowerCase();

    flags.push({
      code: "DUPLICATE_IMAGE_COLLISION",
      title: `Perceptual Photo Collision (${topMatch.similarityPercent}% Identity with ${topMatch.listing.docketId})`,
      severity,
      explanation: `The advertisement photograph visually matches registered listing ${topMatch.listing.docketId} (${topMatch.listing.neighborhood}, ৳${topMatch.listing.monthlyRentBdt.toLocaleString()}/mo) with ${topMatch.similarityPercent}% perceptual identity (${topMatch.hammingDistance} bit diff). ${
        isDifferentNeighborhood
          ? `Ad claims to be in ${input.claimedNeighborhood}, but registered photo origin is ${topMatch.listing.neighborhood}.`
          : ""
      } A duplicate photo is a strong warning signal of a recycled or cloned advertisement—request a live video call or physical inspection.`,
      evidenceQuote: `64-bit dHash collision with docket ${topMatch.listing.docketId}: ${topMatch.hammingDistance} differing bits.`,
    });
    score += isExact ? 40 : 30;
  }

  // =========================================================================
  // RULE 3: SEVERE BELOW-MARKET PRICE ANOMALY (HIGH +25 pts)
  // =========================================================================
  const priceAnomaly = evaluateNeighborhoodPriceAnomaly(
    input.claimedNeighborhood,
    input.claimedRentBdt || 0,
    input.claimedBedrooms || 2,
    input.claimedSqft || undefined
  );

  if (priceAnomaly.isAnomaly && priceAnomaly.deviationPercent <= -38) {
    flags.push({
      code: "PRICE_ANOMALY_LOW",
      title: `Severe Below-Market Price Anomaly (${priceAnomaly.deviationPercent}% vs Median)`,
      severity: "HIGH",
      explanation: `Advertised rent of ৳${(input.claimedRentBdt || 0).toLocaleString()} is ${Math.abs(
        priceAnomaly.deviationPercent
      )}% below the calibrated baseline for ${input.claimedNeighborhood} (expected ৳${priceAnomaly.benchmark?.typical2BedMin.toLocaleString() || "typical"}). Statistically steep underpricing is the primary lure deployed by advance-fee scammers.`,
      evidenceQuote: `Claimed ৳${input.claimedRentBdt?.toLocaleString()} vs ${input.claimedNeighborhood} median ৳${priceAnomaly.benchmark?.typical2BedMin.toLocaleString()}`,
    });
    score += 25;
  }

  // =========================================================================
  // RULE 4: STATUTORY EXCESSIVE ADVANCE RENT (MODERATE/HIGH +18 pts)
  // =========================================================================
  if (input.claimedAdvanceMonths && input.claimedAdvanceMonths > 2) {
    const isExtreme = input.claimedAdvanceMonths >= 4;
    flags.push({
      code: "STATUTORY_ADVANCE_WARNING",
      title: `Excessive Advance Rent Demand (${input.claimedAdvanceMonths} Months)`,
      severity: isExtreme ? "HIGH" : "MODERATE",
      explanation: `The ad stipulates an advance deposit of ${input.claimedAdvanceMonths} months. Under Section 10 of the Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১), landlords are restricted from demanding or accepting advance rent exceeding one month without explicit written adjustment terms.`,
      evidenceQuote: `Stipulated advance: ${input.claimedAdvanceMonths} months (৳${((input.claimedRentBdt || 0) * input.claimedAdvanceMonths).toLocaleString()})`,
    });
    score += isExtreme ? 22 : 16;
  }

  // =========================================================================
  // RULE 5: DISPROPORTIONATE SERVICE CHARGE TRAP (MODERATE +18 pts)
  // =========================================================================
  if (
    input.claimedServiceChargeBdt &&
    input.claimedRentBdt &&
    input.claimedServiceChargeBdt / input.claimedRentBdt > 0.3
  ) {
    const ratioPercent = Math.round(
      (input.claimedServiceChargeBdt / input.claimedRentBdt) * 100
    );
    flags.push({
      code: "HIDDEN_SERVICE_TRAP",
      title: `Disproportionate Building Service Charge (${ratioPercent}% of Base Rent)`,
      severity: "MODERATE",
      explanation: `Building service charge of ৳${input.claimedServiceChargeBdt.toLocaleString()} represents ${ratioPercent}% of the base rent (Bangladesh market standard is 10–18%). Demand an itemized statement for generator diesel, security, and lift maintenance before signing.`,
      evidenceQuote: `Service charge ৳${input.claimedServiceChargeBdt} against base rent ৳${input.claimedRentBdt}`,
    });
    score += 18;
  }

  // =========================================================================
  // RULE 6: INFLATED SUB-METER ELECTRICITY TARIFF (HIGH +22 pts)
  // =========================================================================
  let submeterRate = input.submeterRateBdtPerUnit;
  if (!submeterRate) {
    // Check text for unit rates: e.g. ৳14/unit, 16 টাকা ইউনিট
    const unitMatch = input.extractedTextRaw.match(/(\d{1,2})\s*(?:টাকা|\/|-)?\s*(?:unit|ইউনিট)/i);
    if (unitMatch && Number(unitMatch[1]) >= 13) {
      submeterRate = Number(unitMatch[1]);
    }
  }

  if (submeterRate && submeterRate >= 13) {
    flags.push({
      code: "METER_TARIFF_MANIPULATION",
      title: `Inflated Sub-Meter Electricity Tariff (৳${submeterRate}/kWh)`,
      severity: "HIGH",
      explanation: `The advertisement stipulates a sub-meter electricity rate of ৳${submeterRate}/unit. Official residential retail tariffs from BPDB/DESCO range between ৳5.26 and ৳11.46 per unit. Sub-meter commercial markups violate BERC guidelines and surreptitiously inflate monthly costs by ৳2,000–৳5,000.`,
      evidenceQuote: `Sub-meter rate: ৳${submeterRate} per unit.`,
    });
    score += 22;
  }

  // =========================================================================
  // AI-DETECTED INCONSISTENCIES MERGE (Deduplicated against triggered rules)
  // =========================================================================
  if (input.aiDetectedInconsistencies) {
    for (const inc of input.aiDetectedInconsistencies) {
      const titleLower = inc.title.toLowerCase();
      const isAlreadyCovered = flags.some((f) => {
        const fTitle = f.title.toLowerCase();
        return (
          (fTitle.includes("collision") || fTitle.includes("photo")) &&
          (titleLower.includes("collision") || titleLower.includes("photo") || titleLower.includes("image"))
        ) || (
          fTitle.includes("advance") && titleLower.includes("advance")
        ) || (
          fTitle.includes("mobile") && (titleLower.includes("mobile") || titleLower.includes("bkash"))
        ) || (
          fTitle.includes("price") && titleLower.includes("price")
        );
      });

      if (!isAlreadyCovered) {
        flags.push({
          code: `AI_DETECTED_${flags.length + 1}`,
          title: inc.title,
          severity: inc.severity || "MODERATE",
          explanation: inc.explanation,
          evidenceQuote: inc.quote,
        });
        score += inc.severity === "CRITICAL" ? 25 : inc.severity === "HIGH" ? 18 : 10;
      }
    }
  }

  // Clamp risk score strictly between 5 and 98
  const overallRiskScore = Math.max(5, Math.min(98, score));

  // Determine overall risk severity classification
  let overallRiskSeverity: RiskSeverity = "LOW";
  if (overallRiskScore >= 80) {
    overallRiskSeverity = "CRITICAL";
  } else if (overallRiskScore >= 55) {
    overallRiskSeverity = "HIGH";
  } else if (overallRiskScore >= 25) {
    overallRiskSeverity = "MODERATE";
  }

  // Synthesize evidence-based summary verdict
  let summaryVerdict = "";
  if (overallRiskSeverity === "CRITICAL") {
    summaryVerdict =
      "CRITICAL FRAUD SIGNALS DETECTED: This advertisement exhibits severe indicators of an advance-fee rental scam, including demands for mobile money payment prior to inspection and/or duplicated imagery from another listing. Under no circumstances send bKash or Nagad transfers before a physical visit.";
  } else if (overallRiskSeverity === "HIGH") {
    summaryVerdict =
      "HIGH RISK ANOMALIES IDENTIFIED: Notable discrepancies detected, such as abnormal below-market rent pricing, sub-meter electricity tariff markups, or recycled advertisement photos. Exercise caution and demand verification of utility bills and owner NID.";
  } else if (overallRiskSeverity === "MODERATE") {
    summaryVerdict =
      "MODERATE CIVIC CAUTION ADVISED: Advertised terms require statutory clarification. Verify service charge itemization, advance payment adjustment terms under Section 10 of the Premises Rent Control Act, and separate meter arrangements.";
  } else {
    summaryVerdict =
      "CIVIC AUDIT PASSED (LOW RISK): No critical deceptive patterns, mobile banking traps, or duplicate photo collisions were detected. Advertised pricing aligns with neighborhood benchmark baselines.";
  }

  // Bangladesh-specific actionable verification checklist
  const verificationChecklist = [
    "Never send bKash, Nagad, or Rocket visiting or booking fees before physically entering the flat.",
    "Verify the DESCO/DPDC/BPDB prepaid electric meter number matches the property holding number.",
    "Demand a written rent receipt (ভাড়ার রশিদ) under Section 13 of the Premises Rent Control Act, 1991.",
    "Inspect water supply during peak morning and evening hours (WASA pipeline pressure test).",
    "Cross-check the landlord's holding tax or utility bill name with their National ID card before paying security deposit.",
  ];

  return {
    evidenceFlags: flags,
    overallRiskScore,
    overallRiskSeverity,
    priceAnomaly,
    summaryVerdict,
    verificationChecklist,
  };
}
