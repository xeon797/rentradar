import {
  VerificationSubmissionRecord,
  VerificationTier,
  UtilityProviderCode,
  PropertyListing,
  EmailDispatchRecord,
} from "@/types/rentradar";
import {
  createPropertyListing,
  updatePropertyVerificationTier,
} from "@/lib/repositories/property-repository";
import {
  dispatchVerificationEmail,
  getEmailDispatchLedger,
} from "@/lib/email/resend-dispatcher";
import { binaryToHexHash } from "@/lib/crypto/dhash-utils";

export const INITIAL_VERIFICATION_SUBMISSIONS: VerificationSubmissionRecord[] = [
  {
    id: "ver-sub-101",
    submissionCode: "VER-2026-101",
    propertyDocketId: "RR-SYL-012",
    propertyTitle: "Akhalia / SUST Gate Student-Friendly 3BHK Flat",
    city: "Sylhet",
    neighborhood: "Akhalia / SUST Gate",
    applicantName: "Prof. Anisur Rahman",
    applicantEmail: "anisur.rahman.sust@gmail.com",
    utilityProvider: "BPDB_SYLHET",
    meterNumberMasked: "BPDB-SYL-8821-****-90",
    holdingTaxIdMasked: "SCC-W08-****-14",
    claimedAddressOnBill: "Holding 42, Road 2, Akhalia, Sylhet-3114",
    addressMatchScore: 96,
    photoDhashHex: "0011-0101-1010-1100",
    photoCollisionDetected: false,
    llmZeroLeakConfirmed: true,
    reviewStatus: "PENDING",
    grantedTier: "PHONE_CONFIRMED",
    reviewerNotes:
      "Awaiting auditor review of BPDB Sylhet meter payment receipt and SCC Ward 08 holding tax certificate.",
    createdAt: "2026-02-22T11:20:00Z",
    updatedAt: "2026-02-22T11:20:00Z",
  },
  {
    id: "ver-sub-102",
    submissionCode: "VER-2026-102",
    propertyDocketId: "RR-DHK-045",
    propertyTitle: "Uttara Sector 7 South-Facing 3BHK Family Flat",
    city: "Dhaka",
    neighborhood: "Uttara",
    applicantName: "Mst. Shireen Akhter",
    applicantEmail: "shireen.akhter.uttara@yahoo.com",
    utilityProvider: "DESCO",
    meterNumberMasked: "DESCO-7102-****-331",
    holdingTaxIdMasked: "DNCC-W01-****-88",
    claimedAddressOnBill: "House 14, Road 9, Sector 7, Uttara, Dhaka-1230",
    addressMatchScore: 94,
    photoDhashHex: "0101-0101-1111-0000",
    photoCollisionDetected: false,
    llmZeroLeakConfirmed: true,
    reviewStatus: "PENDING",
    grantedTier: "PHONE_CONFIRMED",
    reviewerNotes: "Awaiting DESCO prepaid meter reconciliation against municipal records.",
    createdAt: "2026-02-23T08:45:00Z",
    updatedAt: "2026-02-23T08:45:00Z",
  },
  {
    id: "ver-sub-103",
    submissionCode: "VER-2026-103",
    propertyDocketId: "RR-DHK-043",
    propertyTitle: "Bashundhara R/A Block D Luxury 3BHK Flat",
    city: "Dhaka",
    neighborhood: "Bashundhara R/A",
    applicantName: "Syed Tanvir (Claimed Expat)",
    applicantEmail: "tanvir.scam.test@mailinator.com",
    utilityProvider: "DESCO",
    meterNumberMasked: "DESCO-9912-****-001",
    holdingTaxIdMasked: "GCC-W04-****-99",
    claimedAddressOnBill: "Station Road, Tongi, Gazipur-1710",
    addressMatchScore: 31,
    photoDhashHex: "1101-0010-1011-0001",
    photoCollisionDetected: true,
    llmZeroLeakConfirmed: true,
    reviewStatus: "FLAGGED",
    grantedTier: "UNVERIFIED",
    reviewerNotes:
      "CRITICAL DISCREPANCY: Utility bill is registered in Tongi Gazipur, but listing advertises Bashundhara R/A Block D. Photographic collision (98.4% identity) flagged with Gulshan RR-DHK-041.",
    reviewedByBadge: "RR-AUD-007 (Farhana Yasmin)",
    createdAt: "2026-02-20T09:10:00Z",
    updatedAt: "2026-02-20T09:15:00Z",
  },
  {
    id: "ver-sub-104",
    submissionCode: "VER-2026-104",
    propertyDocketId: "RR-DHK-041",
    propertyTitle: "Gulshan-2 Diplomatic Zone Luxury 3BHK Apartment",
    city: "Dhaka",
    neighborhood: "Gulshan",
    applicantName: "Engr. Kamal Uddin",
    applicantEmail: "engr.kamal@dhanmondi-holdings.bd",
    utilityProvider: "DESCO",
    meterNumberMasked: "DESCO-1094-****-772",
    holdingTaxIdMasked: "DNCC-W19-****-04",
    claimedAddressOnBill: "Road 54, Block NW(J), Gulshan-2, Dhaka-1212",
    addressMatchScore: 100,
    photoDhashHex: "1101-0010-1011-0001",
    photoCollisionDetected: false,
    llmZeroLeakConfirmed: true,
    reviewStatus: "VERIFIED",
    grantedTier: "VERIFIED_LANDLORD",
    reviewerNotes:
      "Audited and verified by Farhana Yasmin (RR-AUD-007). DESCO prepaid meter active and holding tax ownership confirmed.",
    reviewedByBadge: "RR-AUD-007 (Farhana Yasmin)",
    createdAt: "2026-02-18T14:30:00Z",
    updatedAt: "2026-02-18T14:32:00Z",
  },
];

// In-memory verification submissions runtime store
const VERIFICATION_SUBMISSIONS_STORE: VerificationSubmissionRecord[] = [
  ...INITIAL_VERIFICATION_SUBMISSIONS,
];

import { maskCredentialString, calculateAddressTokenSimilarity } from "@/lib/utils";
export { maskCredentialString, calculateAddressTokenSimilarity };

/**
 * Retrieves all verification submissions and the transactional email ledger.
 */
export async function getVerificationSubmissions(): Promise<{
  submissions: VerificationSubmissionRecord[];
  emailLedger: EmailDispatchRecord[];
}> {
  return {
    submissions: [...VERIFICATION_SUBMISSIONS_STORE],
    emailLedger: getEmailDispatchLedger(),
  };
}

export interface LandlordPublishAndVerifyInput {
  title: string;
  titleBn?: string;
  city: "Dhaka" | "Sylhet" | "Chattogram";
  neighborhood: string;
  address: string;
  monthlyRentBdt: number;
  advanceMonths: number;
  serviceChargeBdt: number;
  utilitiesIncluded: boolean;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  floorLevel: string;
  tenantType: "FAMILY" | "BACHELOR" | "SUBLET" | "ANY";
  description: string;
  imageUrl: string;
  imageDhash: string;
  contactPhoneMasked: string;
  applicantName: string;
  applicantEmail: string;
  utilityProvider: UtilityProviderCode;
  rawMeterNumber: string;
  rawHoldingTaxId: string;
  claimedAddressOnBill: string;
}

/**
 * Publishes a new property listing to the platform catalog and registers a verification dossier.
 * Dispatches an automated filing receipt email via Resend.
 */
export async function submitPropertyAndVerificationDossier(
  input: LandlordPublishAndVerifyInput
): Promise<{
  property: PropertyListing;
  submission: VerificationSubmissionRecord;
  emailDispatch: EmailDispatchRecord;
}> {
  const cityCode = input.city === "Dhaka" ? "DHK" : input.city === "Sylhet" ? "SYL" : "CTG";
  const docketId = `RR-${cityCode}-${Math.floor(100 + Math.random() * 899)}`;
  const submissionCode = `VER-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`;
  const now = new Date().toISOString();

  // 1. Create live PropertyListing
  const newProperty = await createPropertyListing({
    docketId,
    title: input.title,
    titleBn: input.titleBn,
    city: input.city,
    neighborhood: input.neighborhood,
    address: input.address,
    coordinates: {
      lat: input.city === "Sylhet" ? 24.8949 : input.city === "Chattogram" ? 22.3569 : 23.7806,
      lng: input.city === "Sylhet" ? 91.8687 : input.city === "Chattogram" ? 91.8155 : 90.4070,
    },
    monthlyRentBdt: input.monthlyRentBdt,
    advanceMonths: input.advanceMonths,
    serviceChargeBdt: input.serviceChargeBdt,
    utilitiesIncluded: input.utilitiesIncluded,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    sqft: input.sqft,
    floorLevel: input.floorLevel,
    tenantType: input.tenantType,
    description: input.description,
    descriptionBn: input.titleBn,
    imageUrl: input.imageUrl,
    imageDhash: input.imageDhash,
    contactPhoneMasked: input.contactPhoneMasked,
    verificationTier: "PHONE_CONFIRMED", // Initial tier pending auditor review
    riskScore: 20,
    flaggedReasons: [],
  });

  // 2. Compute Privacy-Preserving Masks and Address Matching
  const meterNumberMasked = maskCredentialString(input.rawMeterNumber, input.utilityProvider);
  const holdingTaxIdMasked = maskCredentialString(input.rawHoldingTaxId, "TAX");
  const addressMatchScore = calculateAddressTokenSimilarity(input.address, input.claimedAddressOnBill);

  const submission: VerificationSubmissionRecord = {
    id: `ver-sub-${Date.now()}`,
    submissionCode,
    propertyDocketId: docketId,
    propertyTitle: input.title,
    city: input.city,
    neighborhood: input.neighborhood,
    applicantName: input.applicantName,
    applicantEmail: input.applicantEmail,
    utilityProvider: input.utilityProvider,
    meterNumberMasked,
    holdingTaxIdMasked,
    claimedAddressOnBill: input.claimedAddressOnBill,
    addressMatchScore,
    photoDhashHex: binaryToHexHash(input.imageDhash),
    photoCollisionDetected: false,
    llmZeroLeakConfirmed: true,
    reviewStatus: "PENDING",
    grantedTier: "PHONE_CONFIRMED",
    reviewerNotes: `Filing received online. Address match score: ${addressMatchScore}%. Awaiting municipal auditor verification.`,
    createdAt: now,
    updatedAt: now,
  };

  VERIFICATION_SUBMISSIONS_STORE.unshift(submission);

  // 3. Dispatch Transactional Confirmation Email via Resend
  const emailDispatch = await dispatchVerificationEmail({
    to: input.applicantEmail,
    applicantName: input.applicantName,
    eventType: "SUBMISSION_RECEIVED",
    docketRef: docketId,
    submissionCode,
    grantedTier: "PHONE_CONFIRMED",
    notes: `Address token match: ${addressMatchScore}%. Queue priority: Standard.`,
  });

  return {
    property: newProperty,
    submission,
    emailDispatch,
  };
}

export interface ReviewSubmissionInput {
  submissionId: string;
  decision: "APPROVE_UTILITY_MATCH" | "APPROVE_VERIFIED_LANDLORD" | "FLAG_DISCREPANCY";
  reviewerNotes: string;
  reviewerBadge: string;
}

/**
 * Processes an Auditor's review decision on a verification filing.
 * Upgrades the linked property's verification tier platform-wide and sends a Resend notification.
 */
export async function reviewVerificationSubmission(
  input: ReviewSubmissionInput
): Promise<{
  submission: VerificationSubmissionRecord;
  updatedProperty: PropertyListing | null;
  emailDispatch: EmailDispatchRecord;
}> {
  const submission = VERIFICATION_SUBMISSIONS_STORE.find(
    (s) => s.id === input.submissionId || s.submissionCode === input.submissionId
  );

  if (!submission) {
    throw new Error(`Verification submission "${input.submissionId}" not found`);
  }

  let grantedTier: VerificationTier = "PHONE_CONFIRMED";
  let reviewStatus: VerificationSubmissionRecord["reviewStatus"] = "PENDING";
  let targetRiskScore = 15;
  let eventType: EmailDispatchRecord["eventType"] = "BADGE_UPGRADED";

  if (input.decision === "APPROVE_VERIFIED_LANDLORD") {
    grantedTier = "VERIFIED_LANDLORD";
    reviewStatus = "VERIFIED";
    targetRiskScore = 6;
  } else if (input.decision === "APPROVE_UTILITY_MATCH") {
    grantedTier = "UTILITY_DOC_MATCHED";
    reviewStatus = "VERIFIED";
    targetRiskScore = 10;
  } else {
    // Flagged Discrepancy
    grantedTier = "UNVERIFIED";
    reviewStatus = "FLAGGED";
    targetRiskScore = 65;
    eventType = "DISCREPANCY_FLAGGED";
  }

  const now = new Date().toISOString();
  submission.reviewStatus = reviewStatus;
  submission.grantedTier = grantedTier;
  submission.reviewerNotes = input.reviewerNotes;
  submission.reviewedByBadge = input.reviewerBadge;
  submission.updatedAt = now;

  // Update linked property in property repository platform-wide
  const updatedProperty = await updatePropertyVerificationTier(
    submission.propertyDocketId,
    grantedTier,
    targetRiskScore
  );

  // Dispatch Resend notification email
  const emailDispatch = await dispatchVerificationEmail({
    to: submission.applicantEmail,
    applicantName: submission.applicantName,
    eventType,
    docketRef: submission.propertyDocketId,
    submissionCode: submission.submissionCode,
    grantedTier,
    notes: input.reviewerNotes,
  });

  return {
    submission,
    updatedProperty,
    emailDispatch,
  };
}
