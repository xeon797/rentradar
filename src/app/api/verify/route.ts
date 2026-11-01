import { NextRequest, NextResponse } from "next/server";
import {
  getVerificationSubmissions,
  submitPropertyAndVerificationDossier,
  reviewVerificationSubmission,
  LandlordPublishAndVerifyInput,
} from "@/lib/repositories/verification-repository";
import { processImageWithSharpAndComputeDhash } from "@/lib/image/sharp-dhash";
import { findDuplicatePhotosByDhash } from "@/lib/repositories/property-repository";
import { evaluateNeighborhoodPriceAnomaly } from "@/lib/data/bd-neighborhood-benchmarks";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { submissions, emailLedger } = await getVerificationSubmissions();

    const stats = {
      total: submissions.length,
      pending: submissions.filter((s) => s.reviewStatus === "PENDING").length,
      verified: submissions.filter((s) => s.reviewStatus === "VERIFIED").length,
      flagged: submissions.filter((s) => s.reviewStatus === "FLAGGED").length,
    };

    return NextResponse.json({
      ok: true,
      submissions,
      emailLedger,
      stats,
    });
  } catch (error) {
    console.error("[GET /api/verify] Error fetching verification queue:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to retrieve verification submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as string;

    // =========================================================================
    // ACTION 1: CREATE LISTING AND VERIFY (LANDLORD WORKFLOW)
    // =========================================================================
    if (action === "CREATE_LISTING_AND_VERIFY") {
      let imageDhash = body.imageDhash || "1010101011001100111100000101010100110011110011001010101001010101";
      let imageUrl = body.imageUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80";

      // If user uploaded a raw image buffer/base64, process through Sharp
      if (typeof body.imageBase64 === "string" && body.imageBase64.trim()) {
        const cleanB64 = body.imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        const buffer = Buffer.from(cleanB64, "base64");
        const sharpResult = await processImageWithSharpAndComputeDhash(buffer, body.overrideDhash);
        imageDhash = sharpResult.binaryHash;
        imageUrl = sharpResult.normalizedBase64Mime;
      }

      // Pre-screen for duplicate photo collisions across the catalog
      const duplicateMatches = await findDuplicatePhotosByDhash(imageDhash, 10);
      const photoCollisionDetected = duplicateMatches.length > 0;

      // Price anomaly sanity evaluation
      const priceAnomaly = evaluateNeighborhoodPriceAnomaly(
        body.neighborhood || "Dhanmondi",
        Number(body.monthlyRentBdt) || 25000,
        Number(body.bedrooms) || 2,
        Number(body.sqft) || undefined
      );

      const payload: LandlordPublishAndVerifyInput = {
        title: String(body.title || "Modern Bangladesh Family Apartment"),
        titleBn: body.titleBn ? String(body.titleBn) : undefined,
        city: body.city || "Dhaka",
        neighborhood: body.neighborhood || "Dhanmondi",
        address: String(body.address || "Road 9/A, Dhanmondi, Dhaka"),
        monthlyRentBdt: Number(body.monthlyRentBdt) || 25000,
        advanceMonths: Number(body.advanceMonths) || 2,
        serviceChargeBdt: Number(body.serviceChargeBdt) || 3500,
        utilitiesIncluded: Boolean(body.utilitiesIncluded),
        bedrooms: Number(body.bedrooms) || 2,
        bathrooms: Number(body.bathrooms) || 2,
        sqft: Number(body.sqft) || 1200,
        floorLevel: String(body.floorLevel || "3rd Floor"),
        tenantType: body.tenantType || "FAMILY",
        description: String(body.description || "Well-ventilated flat with 24/7 security."),
        imageUrl,
        imageDhash,
        contactPhoneMasked: String(body.contactPhoneMasked || "+880 1711-XXXXXX"),
        applicantName: String(body.applicantName || "Property Owner"),
        applicantEmail: String(body.applicantEmail || "owner@rentradar.bd"),
        utilityProvider: body.utilityProvider || "DESCO",
        rawMeterNumber: String(body.rawMeterNumber || "44910284"),
        rawHoldingTaxId: String(body.rawHoldingTaxId || "DNCC-W19-204"),
        claimedAddressOnBill: String(body.claimedAddressOnBill || body.address || ""),
      };

      const result = await submitPropertyAndVerificationDossier(payload);

      return NextResponse.json({
        ok: true,
        property: result.property,
        submission: result.submission,
        emailDispatch: result.emailDispatch,
        duplicateCollision: {
          detected: photoCollisionDetected,
          matches: duplicateMatches,
        },
        priceAnomaly,
      });
    }

    // =========================================================================
    // ACTION 2: AUDITOR REVIEW DECISION (AUDITOR WORKFLOW)
    // =========================================================================
    if (action === "AUDITOR_REVIEW_DECISION") {
      const { submissionId, decision, reviewerNotes, reviewerBadge } = body as {
        submissionId: string;
        decision: "APPROVE_UTILITY_MATCH" | "APPROVE_VERIFIED_LANDLORD" | "FLAG_DISCREPANCY";
        reviewerNotes: string;
        reviewerBadge: string;
      };

      if (!submissionId || !decision) {
        return NextResponse.json(
          { ok: false, error: "submissionId and decision are required" },
          { status: 400 }
        );
      }

      const reviewResult = await reviewVerificationSubmission({
        submissionId,
        decision,
        reviewerNotes: reviewerNotes || "Auditor verification decision processed.",
        reviewerBadge: reviewerBadge || "RR-AUD-007",
      });

      return NextResponse.json({
        ok: true,
        submission: reviewResult.submission,
        updatedProperty: reviewResult.updatedProperty,
        emailDispatch: reviewResult.emailDispatch,
      });
    }

    return NextResponse.json(
      { ok: false, error: `Invalid action "${action}"` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[POST /api/verify] Handler error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to process verification workflow action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
