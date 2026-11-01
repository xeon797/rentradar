"use client";

import React, { useMemo } from "react";
import {
  normalizeBinaryHash,
  binaryToHexHash,
  hashTo8x8Matrix,
  calculateHammingDistance,
  calculateHashSimilarityPercent,
} from "@/lib/crypto/dhash-utils";
import { Cpu, AlertTriangle, CheckCircle2, GitCompare, Eye, Layers } from "lucide-react";

export interface DhashBitMatrixCardProps {
  binaryHash: string;
  luminanceGrid9x8?: number[][];
  compareWithHash?: string;
  compareListingDocket?: string;
  engineLabel?: string;
  className?: string;
}

export default function DhashBitMatrixCard({
  binaryHash,
  luminanceGrid9x8,
  compareWithHash,
  compareListingDocket,
  engineLabel = "SHARP_NATIVE_9X8",
  className = "",
}: DhashBitMatrixCardProps) {
  const normHash = useMemo(() => normalizeBinaryHash(binaryHash), [binaryHash]);
  const hexHash = useMemo(() => binaryToHexHash(normHash), [normHash]);
  const bitMatrix = useMemo(() => hashTo8x8Matrix(normHash), [normHash]);

  const normCompareHash = useMemo(
    () => (compareWithHash ? normalizeBinaryHash(compareWithHash) : null),
    [compareWithHash]
  );

  const hammingDistance = useMemo(() => {
    if (!normCompareHash) return null;
    return calculateHammingDistance(normHash, normCompareHash);
  }, [normHash, normCompareHash]);

  const similarityPercent = useMemo(() => {
    if (!normCompareHash) return null;
    return calculateHashSimilarityPercent(normHash, normCompareHash);
  }, [normHash, normCompareHash]);

  const differingBitIndices = useMemo(() => {
    if (!normCompareHash) return new Set<number>();
    const diffs = new Set<number>();
    for (let i = 0; i < 64; i++) {
      if (normHash[i] !== normCompareHash[i]) {
        diffs.add(i);
      }
    }
    return diffs;
  }, [normHash, normCompareHash]);

  return (
    <div
      className={`border-2 border-carbon bg-surface p-4 shadow-docket space-y-4 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
            <span className="bg-carbon text-radar px-1.5 py-0.5 font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{engineLabel}</span>
            </span>
            <span className="text-muted-ink uppercase font-semibold">
              // 64-Bit Perceptual dHash Fingerprint
            </span>
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-carbon tracking-wider">
            {hexHash}
          </div>
        </div>

        {compareListingDocket && normCompareHash && (
          <div className="bg-red-50 border border-evidence-red px-2.5 py-1 text-xs font-mono text-evidence-red font-bold flex items-center gap-1.5 self-start sm:self-auto">
            <GitCompare className="w-3.5 h-3.5" />
            <span>COMPARING VS {compareListingDocket}</span>
          </div>
        )}
      </div>

      {/* Dual Visual Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: 9x8 Grayscale Receptor Matrix */}
        <div className="bg-paper border border-carbon p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-grid-line pb-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 font-bold text-carbon">
              <Eye className="w-3.5 h-3.5" />
              <span>9×8 GRAYSCALE RECEPTORS</span>
            </div>
            <span className="text-[10px] text-muted-ink">72 SAMPLES</span>
          </div>

          {luminanceGrid9x8 && luminanceGrid9x8.length === 8 ? (
            <div className="flex flex-col items-center justify-center p-2 bg-surface border border-grid-line">
              <div className="grid grid-cols-9 gap-[2px]">
                {luminanceGrid9x8.flatMap((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`lum-${rIdx}-${cIdx}`}
                      style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                      className="w-5 h-5 sm:w-6 sm:h-6 border border-carbon/40 flex items-center justify-center text-[8px] font-mono select-none"
                      title={`Row ${rIdx + 1}, Col ${cIdx + 1} Grayscale: ${val}`}
                    >
                      <span
                        className={
                          val > 130 ? "text-carbon font-bold" : "text-surface font-bold"
                        }
                      >
                        {val}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 text-[10px] font-mono text-muted-ink text-center">
                Downsampled intensity values (0 = Black, 255 = White)
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-carbon/40 font-mono text-xs text-muted-ink">
              <Layers className="w-5 h-5 mb-1 text-carbon" />
              <span>Grayscale receptor buffer populated during live image normalization</span>
            </div>
          )}
        </div>

        {/* Right: 8x8 Binary Bit Matrix (with Diff Highlighting) */}
        <div className="bg-paper border border-carbon p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-grid-line pb-1 font-mono text-xs">
            <div className="flex items-center gap-1.5 font-bold text-carbon">
              <Cpu className="w-3.5 h-3.5 text-radar bg-carbon" />
              <span>8×8 BINARY GRADIENT MATRIX</span>
            </div>
            <span className="text-[10px] text-muted-ink">64 BITS</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 bg-surface border border-grid-line">
            <div className="grid grid-cols-8 gap-[3px]">
              {bitMatrix.flatMap((row, rIdx) =>
                row.map((bit, cIdx) => {
                  const bitIndex = rIdx * 8 + cIdx;
                  const isDiff = differingBitIndices.has(bitIndex);

                  let cellStyle = "bg-paper text-muted-ink border-carbon";
                  if (isDiff) {
                    cellStyle =
                      "bg-evidence-red text-white font-bold border-carbon ring-2 ring-carbon animate-pulse";
                  } else if (bit === 1) {
                    cellStyle = "bg-carbon text-radar font-bold border-carbon";
                  }

                  const compareBit = normCompareHash ? normCompareHash[bitIndex] : null;

                  return (
                    <div
                      key={`bit-${rIdx}-${cIdx}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 border flex items-center justify-center text-[10px] font-mono select-none transition-all ${cellStyle}`}
                      title={
                        isDiff
                          ? `BIT DIFF at [R${rIdx + 1}, C${cIdx + 1}]: Ad=${bit} vs Registry=${compareBit}`
                          : `Bit [R${rIdx + 1}, C${cIdx + 1}]: ${bit}`
                      }
                    >
                      {bit}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-2 flex items-center justify-between w-full text-[10px] font-mono text-muted-ink px-1">
              <span>Bit 1 = Gradient Increase (L &lt; R)</span>
              {differingBitIndices.size > 0 && (
                <span className="text-evidence-red font-bold">
                  {differingBitIndices.size} differing bits flagged
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry & Comparison Strip */}
      {normCompareHash !== null && hammingDistance !== null && similarityPercent !== null ? (
        <div className="border-2 border-carbon bg-paper p-3 font-mono text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-carbon/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-carbon uppercase">Hamming Distance:</span>
              <span
                className={`font-bold px-2 py-0.5 border border-carbon ${
                  hammingDistance <= 2
                    ? "bg-evidence-red text-white"
                    : hammingDistance <= 10
                    ? "bg-evidence-amber text-carbon"
                    : "bg-evidence-green text-white"
                }`}
              >
                {hammingDistance} / 64 bits diff
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-carbon uppercase">Visual Similarity:</span>
              <span className="font-bold text-carbon text-sm">
                {similarityPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {hammingDistance <= 2 ? (
              <div className="text-evidence-red font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  CRITICAL IDENTITY COLLISION (≤ 2 bits diff): Photograph is identical or a direct
                  re-crop of registered listing {compareListingDocket}.
                </span>
              </div>
            ) : hammingDistance <= 10 ? (
              <div className="text-evidence-amber font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  PROBABLE DUPLICATE COLLISION (≤ 10 bits diff): Significant visual similarity
                  detected with {compareListingDocket}.
                </span>
              </div>
            ) : (
              <div className="text-evidence-green font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  DISTINCT IMAGES (&gt; 10 bits diff): Image fingerprint is unique against{" "}
                  {compareListingDocket}.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-paper p-2.5 border border-carbon font-mono text-xs flex items-center justify-between text-muted-ink">
          <span>64-BIT GRADIENT ENCODED // NO DATABASE COMPARISON ACTIVE</span>
          <span className="text-carbon font-bold">READY FOR FORENSIC SCAN</span>
        </div>
      )}
    </div>
  );
}
