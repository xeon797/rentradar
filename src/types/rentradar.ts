export type VerificationTier =
  | 'UNVERIFIED'
  | 'PHONE_CONFIRMED'
  | 'UTILITY_DOC_MATCHED'
  | 'VERIFIED_LANDLORD';

export type RiskSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 'TENANT' | 'LANDLORD' | 'AUDITOR';

export interface CivicUserProfile {
  id: string;
  email: string;
  fullName: string;
  fullNameBn: string;
  role: UserRole;
  city: 'Dhaka' | 'Sylhet' | 'Chattogram';
  phoneVerified: boolean;
  utilityBillVerified: boolean;
  authMode: 'SUPABASE_SESSION' | 'DEMO_PERSONA';
  badgeCode: string; // e.g. 'RR-TEN-204', 'RR-LND-041', 'RR-AUD-007'
}

export interface PropertyListing {
  id: string;
  docketId: string; // e.g. "RR-SYL-014" or "RR-DHK-102"
  title: string;
  titleBn?: string;
  city: 'Dhaka' | 'Sylhet' | 'Chattogram';
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  monthlyRentBdt: number;
  advanceMonths: number;
  serviceChargeBdt: number;
  utilitiesIncluded: boolean;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  floorLevel: string;
  tenantType: 'FAMILY' | 'BACHELOR' | 'SUBLET' | 'ANY';
  description: string;
  descriptionBn?: string;
  imageUrl: string;
  imageDhash: string; // 64-char binary string '010011...' or 16-char hex
  contactPhoneMasked: string;
  verificationTier: VerificationTier;
  riskScore: number; // 0 to 100
  flaggedReasons: string[];
  createdAt: string;
}

export interface EvidenceFlag {
  code: string; // e.g., 'ADVANCE_BKASH_DEMAND' | 'PRICE_ANOMALY_LOW' | 'DUPLICATE_IMAGE_COLLISION' | 'HIDDEN_SERVICE_TRAP' | 'VAGUE_ADDRESS'
  title: string;
  severity: RiskSeverity;
  explanation: string;
  evidenceQuote?: string;
}

export interface ExtractedInspectionData {
  claimedLocation: string;
  claimedCity?: "Dhaka" | "Sylhet" | "Chattogram";
  claimedNeighborhood?: string;
  claimedRentBdt: number | null;
  claimedAdvanceMonths: number | null;
  claimedServiceChargeBdt?: number | null;
  claimedBedrooms: number | null;
  claimedSqft?: number | null;
  contactNumbers: string[];
  advancePaymentRequestedBeforeVisit: boolean;
  preVisitPaymentQuote?: string;
  tenantRestriction: string;
  submeterRateBdtPerUnit?: number | null;
  utilitiesDisclosed?: boolean;
}

export interface DuplicateImageMatch {
  listing: PropertyListing;
  hammingDistance: number;
  similarityPercent: number;
}

export interface BenchmarkSummary {
  city: "Dhaka" | "Sylhet" | "Chattogram";
  neighborhood: string;
  neighborhoodBn?: string;
  typical2BedMin: number;
  typical3BedMin: number;
  utilityProvider: string;
}

export interface InspectionDocketResult {
  docketNumber: string;
  analyzedAt: string;
  extractedTextRaw: string;
  detectedLanguage: 'BN' | 'EN' | 'MIXED';
  extractedData: ExtractedInspectionData;
  imageHash: string;
  duplicateMatches: DuplicateImageMatch[];
  evidenceFlags: EvidenceFlag[];
  overallRiskSeverity: RiskSeverity;
  overallRiskScore: number;
  summaryVerdict: string;
  verificationChecklist: string[];
  fingerprint?: {
    binaryHash: string;
    hexHash: string;
    bitMatrix8x8: number[][];
    luminanceGrid9x8: number[][];
    engine: string;
    originalWidth?: number;
    originalHeight?: number;
    processedBytes?: number;
  };
  priceAnomaly?: {
    isAnomaly: boolean;
    deviationPercent: number;
    benchmark: BenchmarkSummary | null;
    explanation: string;
  } | null;
  engineUsed?: string;
}

export type UtilityProviderCode =
  | 'DESCO'
  | 'DPDC'
  | 'BPDB_SYLHET'
  | 'BPDB_CTG'
  | 'TITAS_GAS'
  | 'JALALABAD_GAS'
  | 'DWASA';

export type VerificationReviewStatus = 'PENDING' | 'VERIFIED' | 'FLAGGED';

export interface VerificationSubmissionRecord {
  id: string;
  submissionCode: string; // e.g., 'VER-2026-089'
  propertyDocketId: string;
  propertyTitle: string;
  city: 'Dhaka' | 'Sylhet' | 'Chattogram';
  neighborhood: string;
  applicantName: string;
  applicantEmail: string;
  utilityProvider: UtilityProviderCode;
  meterNumberMasked: string; // e.g., 'DESCO-4409-****-812'
  holdingTaxIdMasked: string; // e.g., 'DNCC-W19-****-04'
  claimedAddressOnBill: string;
  addressMatchScore: number; // 0 to 100 token similarity
  photoDhashHex: string;
  photoCollisionDetected: boolean;
  llmZeroLeakConfirmed: true;
  reviewStatus: VerificationReviewStatus;
  grantedTier: VerificationTier;
  reviewerNotes: string;
  reviewedByBadge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailDispatchRecord {
  id: string;
  timestamp: string;
  to: string;
  from: string;
  subject: string;
  eventType: 'SUBMISSION_RECEIVED' | 'BADGE_UPGRADED' | 'DISCREPANCY_FLAGGED';
  docketRef: string;
  deliveryMode: 'RESEND_CLOUD_API' | 'LOCAL_MIME_LEDGER';
  bodyPreview: string;
  htmlPreview?: string;
}
