import { RiskSeverity } from "@/types/rentradar";

export interface JudgeInspectionPreset {
  id: string;
  name: string;
  metro: "Dhaka" | "Sylhet" | "Chattogram";
  docketNumber: string;
  badgeLabel: string;
  riskSeverity: RiskSeverity;
  riskScore: number;
  adTextRaw: string;
  detectedLanguage: "BN" | "EN" | "MIXED";
  targetImageDhash: string;
  sampleImageUrl: string;
  matchedListingDocketId?: string;
  extractedData: {
    claimedLocation: string;
    claimedRentBdt: number | null;
    claimedAdvanceMonths: number | null;
    claimedBedrooms: number | null;
    contactNumbers: string[];
    advancePaymentRequestedBeforeVisit: boolean;
    tenantRestriction: string;
    hiddenChargesMentioned?: string;
  };
  evidenceFlags: Array<{
    code: string;
    title: string;
    severity: RiskSeverity;
    explanation: string;
    evidenceQuote?: string;
  }>;
  summaryVerdict: string;
  statutoryReference: string;
}

export const JUDGE_INSPECTION_PRESETS: JudgeInspectionPreset[] = [
  // ==========================================
  // PRESET 1: BASHUNDHARA STOLEN PHOTO SCAM (DHAKA)
  // ==========================================
  {
    id: "preset-01-bashundhara-scam",
    name: "Bashundhara R/A Stolen-Photo & bKash Advance Trap",
    metro: "Dhaka",
    docketNumber: "RR-INSP-2026-001",
    badgeLabel: "CRITICAL FRAUD DETECTED",
    riskSeverity: "CRITICAL",
    riskScore: 91,
    adTextRaw:
      "জরুরী বসুন্ধরা আবাসিক এলাকায় ৩ রুমের ফুল ফার্নিশড লাক্সারি ফ্ল্যাট ভাড়া হবে মাত্র ১১,৫০০ টাকায়। সরাসরি ফ্ল্যাট মালিক বিদেশে থাকেন বিধায় কম ভাড়ায় দেওয়া হবে। তবে ফ্ল্যাট ভিজিট করার জন্য বিকাশে ৩,০০০ টাকা ভিজিটিং কার্ড ফি না দিলে বাসা দেখানো হবে না। আগ্রহী ব্যক্তিরা বিকাশ করুন: 01712-984XXX। বুকিং নিশ্চিত হলে ঠিকানার গুগল ম্যাপ লোকেশন পাঠানো হবে।",
    detectedLanguage: "BN",
    // Matches RR-DHK-041 (1 bit difference)
    targetImageDhash: "1101001010110001010101101100101010101100110011010101001011010010",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    matchedListingDocketId: "RR-DHK-041",
    extractedData: {
      claimedLocation: "Bashundhara R/A, Dhaka",
      claimedRentBdt: 11500,
      claimedAdvanceMonths: 1,
      claimedBedrooms: 3,
      contactNumbers: ["01712-984XXX"],
      advancePaymentRequestedBeforeVisit: true,
      tenantRestriction: "ANY (Urgent Expat Tenancy)",
      hiddenChargesMentioned: "Not disclosed / vague utilities",
    },
    evidenceFlags: [
      {
        code: "RULE_01: PRE_VISIT_BKASH_DEMAND",
        title: "Pre-Visit Mobile Money Demand",
        severity: "CRITICAL",
        explanation:
          "Advertiser explicitly conditions physical viewing or disclosing the exact building address on a ৳3,000 personal bKash transfer. Classic advance-fee syndicate signature.",
        evidenceQuote:
          '"বিকাশে ৩,০০০ টাকা ভিজিটিং কার্ড ফি না দিলে বাসা দেখানো হবে না"',
      },
      {
        code: "RULE_02: DHASH_IMAGE_COLLISION",
        title: "Perceptual Image Hash Match with Gulshan-2 Listing",
        severity: "CRITICAL",
        explanation:
          "The uploaded interior photo has a 98.4% visual hash match (Hamming distance: 1 bit) with verified luxury listing RR-DHK-041 in Gulshan-2, priced at ৳65,000/mo.",
      },
      {
        code: "RULE_03: SEVERE_PRICE_ANOMALY",
        title: "Severe Price Anomaly (-68% vs. Market Median)",
        severity: "CRITICAL",
        explanation:
          "Bashundhara R/A 3-bed residential median is ৳30,000/mo. Claimed rent of ৳11,500 violates mathematical feasibility and indicates bait pricing.",
      },
    ],
    summaryVerdict:
      "CRITICAL FRAUD ALERT: High-confidence advance-fee scam. Do NOT send money via bKash or Nagad. Photo is stolen from a luxury Gulshan listing.",
    statutoryReference:
      "Penal Code Sec 420 (Cheating by Impersonation) & Premises Rent Control Act 1991",
  },

  // ==========================================
  // PRESET 2: AKHALIA / SUST GATE MESS BAIT (SYLHET)
  // ==========================================
  {
    id: "preset-02-sust-mess-bait",
    name: "Akhalia / SUST Gate Student Mess Bait & Meter Manipulation",
    metro: "Sylhet",
    docketNumber: "RR-INSP-2026-002",
    badgeLabel: "HIGH RISK ANOMALY",
    riskSeverity: "HIGH",
    riskScore: 72,
    adTextRaw:
      "To-Let for SUST University students in Akhalia. 3-bed apartment near gate. Rent ৳13,500. Advance 4 months non-refundable deposit required upon agreement. Sub-meter electricity will be charged at commercial rate ৳16 per unit plus common water pump surcharge.",
    detectedLanguage: "EN",
    // Matches RR-SYL-011 (2 bit difference)
    targetImageDhash: "0011010110101100110011010101010010101110010101011010110011010001",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    matchedListingDocketId: "RR-SYL-011",
    extractedData: {
      claimedLocation: "Akhalia / SUST Gate, Sylhet",
      claimedRentBdt: 13500,
      claimedAdvanceMonths: 4,
      claimedBedrooms: 3,
      contactNumbers: ["01823-774XXX"],
      advancePaymentRequestedBeforeVisit: false,
      tenantRestriction: "BACHELOR (SUST Students)",
      hiddenChargesMentioned: "Commercial electricity markup + non-refundable deposit",
    },
    evidenceFlags: [
      {
        code: "RULE_04: METER_RATE_MANIPULATION",
        title: "Commercial Electricity Tariff Markup",
        severity: "HIGH",
        explanation:
          "Charging ৳16/unit on a residential sub-meter exceeds BPDB residential slab tariffs by over 70%, violating standard BERC electricity resale guidelines.",
        evidenceQuote:
          '"Sub-meter electricity will be charged at commercial rate ৳16 per unit"',
      },
      {
        code: "RULE_05: STATUTORY_DEPOSIT_VIOLATION",
        title: "Excessive Non-Refundable Deposit Demand",
        severity: "HIGH",
        explanation:
          "Demanding 4 months 'non-refundable' advance deposit violates standard tenancy protection under Section 10 of the Premises Rent Control Act 1991.",
        evidenceQuote: '"Advance 4 months non-refundable deposit required"',
      },
      {
        code: "RULE_02: DHASH_IMAGE_COLLISION",
        title: "Photo Collision with Uposhahar Listing",
        severity: "HIGH",
        explanation:
          "Image shares 96.9% perceptual hash match with RR-SYL-011 located across town in Shahjalal Uposhahar.",
      },
    ],
    summaryVerdict:
      "HIGH REGULATORY ANOMALY: Advertised listing recycles photos and imposes unlawful electricity markups and non-refundable deposits.",
    statutoryReference:
      "BERC Residential Tariff Orders & Premises Rent Control Act 1991, Sec 10",
  },

  // ==========================================
  // PRESET 3: SHAHJALAL UPOSHAHAR SURCHARGE TRAP (SYLHET)
  // ==========================================
  {
    id: "preset-03-uposhahar-surcharge",
    name: "Shahjalal Uposhahar Unitemized Service Charge Trap",
    metro: "Sylhet",
    docketNumber: "RR-INSP-2026-003",
    badgeLabel: "MODERATE RISK ANOMALIES",
    riskSeverity: "MODERATE",
    riskScore: 46,
    adTextRaw:
      "To-Let for Executive Bachelor or Small Family in Uposhahar Block D. 1 Master Bed + Attached Bath with separate entrance. Base Rent ৳8,500 only. Security and maintenance charge ৳3,800 mandatory. Gas, WASA & common generator bill split equally among all tenants without meter.",
    detectedLanguage: "MIXED",
    targetImageDhash: "0011010110101100110011010101010010101110010101011010110011010001",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    matchedListingDocketId: "RR-SYL-011",
    extractedData: {
      claimedLocation: "Shahjalal Uposhahar, Block D, Sylhet",
      claimedRentBdt: 8500,
      claimedAdvanceMonths: 2,
      claimedBedrooms: 1,
      contactNumbers: ["01912-881XXX"],
      advancePaymentRequestedBeforeVisit: false,
      tenantRestriction: "SUBLET / BACHELOR",
      hiddenChargesMentioned: "৳3,800 unitemized service fee + shared unmetered gas/water",
    },
    evidenceFlags: [
      {
        code: "RULE_06: UNITEMIZED_SERVICE_TRAP",
        title: "Disproportionate Service Overhead (+44.7%)",
        severity: "MODERATE",
        explanation:
          "Service charge of ৳3,800 is 44.7% of the base rent (৳8,500) and lacks itemization for lift, guard, or generator maintenance.",
        evidenceQuote:
          '"Security and maintenance charge ৳3,800 mandatory"',
      },
      {
        code: "RULE_07: FLOATING_UTILITY_EXPOSURE",
        title: "Unmetered Utility Apportionment Risk",
        severity: "MODERATE",
        explanation:
          "Splitting gas and water equally without sub-meters exposes single-occupant tenants to inflated commercial or shared usage costs.",
      },
    ],
    summaryVerdict:
      "MODERATE ANOMALIES FOUND: True monthly cost is at least ৳12,300+ instead of the advertised ৳8,500. Insist on itemized maintenance breakdown.",
    statutoryReference:
      "Premises Rent Control Act 1991, Sec 13 (Receipts & Utility Disclosures)",
  },

  // ==========================================
  // PRESET 4: DHANMONDI ROAD 9/A VERIFIED (DHAKA)
  // ==========================================
  {
    id: "preset-04-dhanmondi-verified",
    name: "Dhanmondi Road 9/A Verified Family Apartment",
    metro: "Dhaka",
    docketNumber: "RR-INSP-2026-004",
    badgeLabel: "VERIFIED STATUTORY COMPLIANT",
    riskSeverity: "LOW",
    riskScore: 12,
    adTextRaw:
      "Dhanmondi 9/A, 1450 sqft 3-bed flat with dedicated car parking. Base Rent: ৳38,000, Fixed Service Charge: ৳5,000 (Generator, 24/7 Security, Lift). DESCO prepaid meter installed. Advance: 2 months. Formal written agreement with official rent receipts provided upon signing.",
    detectedLanguage: "EN",
    targetImageDhash: "1010101011001100111100000101010100110011110011001010101001010101",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    matchedListingDocketId: "RR-DHK-042",
    extractedData: {
      claimedLocation: "Road 9/A, Dhanmondi, Dhaka",
      claimedRentBdt: 38000,
      claimedAdvanceMonths: 2,
      claimedBedrooms: 3,
      contactNumbers: ["+880 1712-550XXX"],
      advancePaymentRequestedBeforeVisit: false,
      tenantRestriction: "FAMILY",
      hiddenChargesMentioned: "None (Transparent fixed service charge)",
    },
    evidenceFlags: [
      {
        code: "DOC_01: DESCO_DOC_VERIFIED",
        title: "DESCO Prepaid Account Verified",
        severity: "LOW",
        explanation:
          "Dedicated individual prepaid meter protects tenant from shared bill shocks. Ownership verified against municipal records.",
      },
      {
        code: "DOC_02: STATUTORY_COMPLIANCE",
        title: "Deposit & Written Receipt Compliant",
        severity: "LOW",
        explanation:
          "2-month advance deposit complies with standard residential practice. Written receipt stipulated under Section 13 of the 1991 Act.",
      },
    ],
    summaryVerdict:
      "VERIFIED SAFE LISTING: Zero duplicate image collisions, realistic neighborhood median price, and verified utility documentation.",
    statutoryReference:
      "Premises Rent Control Act 1991, Sec 13 & 14 (Standard Agreement Compliant)",
  },
];
