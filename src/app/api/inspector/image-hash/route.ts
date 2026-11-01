import { NextRequest, NextResponse } from "next/server";
import {
  processImageWithSharpAndComputeDhash,
  generateLuminanceGridFromBinaryHash,
  SharpDhashResult,
} from "@/lib/image/sharp-dhash";
import { findDuplicatePhotosByDhash } from "@/lib/repositories/property-repository";
import { JUDGE_INSPECTION_PRESETS } from "@/lib/data/judge-presets";
import { binaryToHexHash, hashTo8x8Matrix, normalizeBinaryHash } from "@/lib/crypto/dhash-utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let buffer: Buffer | null = null;
    let overrideDhash: string | undefined = undefined;
    let excludeDocketId: string | undefined = undefined;
    let maxHammingDistance = 10;
    let presetId: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const arrayBuf = await (file as Blob).arrayBuffer();
        buffer = Buffer.from(arrayBuf);
      }

      overrideDhash = formData.get("overrideDhash")?.toString() || undefined;
      excludeDocketId = formData.get("excludeDocketId")?.toString() || undefined;
      presetId = formData.get("presetId")?.toString() || undefined;
      const maxDistRaw = formData.get("maxHammingDistance");
      if (maxDistRaw) maxHammingDistance = Number(maxDistRaw);
    } else {
      // JSON Payload
      const body = await request.json().catch(() => ({}));
      overrideDhash = body.overrideDhash;
      excludeDocketId = body.excludeDocketId;
      presetId = body.presetId;
      if (typeof body.maxHammingDistance === "number") {
        maxHammingDistance = body.maxHammingDistance;
      }

      if (typeof body.imageBase64 === "string" && body.imageBase64.trim()) {
        const cleanBase64 = body.imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        buffer = Buffer.from(cleanBase64, "base64");
      }
    }

    // If presetId is supplied and no override was specified, resolve targetImageDhash
    const matchedPreset = presetId
      ? JUDGE_INSPECTION_PRESETS.find((p) => p.id === presetId)
      : undefined;

    if (matchedPreset && !overrideDhash) {
      overrideDhash = matchedPreset.targetImageDhash;
    }

    let fingerprint: SharpDhashResult;

    if (buffer && buffer.length > 0) {
      fingerprint = await processImageWithSharpAndComputeDhash(buffer, overrideDhash);
    } else if (overrideDhash) {
      // Synthetic fallback when testing presets without a raw buffer
      const normHash = normalizeBinaryHash(overrideDhash);
      fingerprint = {
        binaryHash: normHash,
        hexHash: binaryToHexHash(normHash),
        bitMatrix8x8: hashTo8x8Matrix(normHash),
        luminanceGrid9x8: generateLuminanceGridFromBinaryHash(normHash),
        normalizedBase64Mime: matchedPreset?.sampleImageUrl || "",
        originalWidth: 800,
        originalHeight: 600,
        processedBytes: 0,
        engine: "FALLBACK_SEED",
      };
    } else {
      return NextResponse.json(
        {
          ok: false,
          error: "No image file, imageBase64, or presetId provided for perceptual dHash audit",
        },
        { status: 400 }
      );
    }

    // Query property catalog for visual dHash duplicate collisions
    const duplicateMatches = await findDuplicatePhotosByDhash(
      fingerprint.binaryHash,
      maxHammingDistance,
      excludeDocketId
    );

    const hasCriticalCollision = duplicateMatches.some((m) => m.hammingDistance <= 6);

    return NextResponse.json({
      ok: true,
      fingerprint,
      duplicateMatches,
      hasCriticalCollision,
    });
  } catch (error) {
    console.error("[POST /api/inspector/image-hash] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to normalize image or compute perceptual dHash",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
