"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Cpu,
  FileText,
  Copy,
  Check,
  Calculator,
  Scale,
  ShieldCheck,
  AlertOctagon,
  GitCompare,
} from "lucide-react";
import DhashBitMatrixCard from "@/components/inspector/DhashBitMatrixCard";
import {
  compressAndHashImageOnClient,
  renderSyntheticToLetPosterDataUrl,
  dataUrlToFile,
  CompressedClientImage,
} from "@/lib/image/client-compressor";
import {
  JUDGE_INSPECTION_PRESETS,
  JudgeInspectionPreset,
} from "@/lib/data/judge-presets";
import { InspectionDocketResult } from "@/types/rentradar";

function InspectorWorkspace() {
  const searchParams = useSearchParams();
  const urlDocket = searchParams.get("docket");
  const urlPreset = searchParams.get("preset");

  // Input states
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-01-bashundhara-scam");
  const [rawText, setRawText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<CompressedClientImage | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [simulateStolenCollision, setSimulateStolenCollision] = useState(false);

  // Active Tab in Docket view
  const [activeTab, setActiveTab] = useState<"claims" | "collision" | "anomalies" | "checklist">("claims");

  // Analysis & Pipeline progress state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [docketResult, setDocketResult] = useState<InspectionDocketResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gulshan-2 Stolen dHash for collision testing
  const GULSHAN_VERIFIED_DHASH =
    "1101001010110001010101101100101010101100110011010101001011010011";

  // Execute Forensic Audit Pipeline
  const handleAnalyze = useCallback(
    async (params: {
      presetId?: string;
      docketId?: string;
      imageBase64?: string;
      rawText?: string;
      overrideDhash?: string;
    }) => {
      setIsAnalyzing(true);
      setErrorMessage(null);

      // Simulate real pipeline stages for UX transparency
      setAnalysisStage("STAGE 1: SHARP 9×8 NORMALIZATION & EXIF SANITIZATION...");
      await new Promise((r) => setTimeout(r, 220));

      setAnalysisStage("STAGE 2: GEMINI 2.5 FLASH MULTIMODAL OCR TRANSCRIPTION...");
      await new Promise((r) => setTimeout(r, 260));

      setAnalysisStage("STAGE 3: 64-BIT dHASH HAMMING DISTANCE COLLISION SCAN...");
      await new Promise((r) => setTimeout(r, 240));

      setAnalysisStage("STAGE 4: 1991 RENT ACT & STATUTORY SCAM RULES...");

      try {
        const payload: Record<string, unknown> = { ...params };

        if (!payload.presetId && !payload.docketId) {
          payload.rawText = rawText;
          if (uploadedImage) {
            payload.imageBase64 = uploadedImage.base64DataUrl;
          }
          if (simulateStolenCollision) {
            payload.overrideDhash = GULSHAN_VERIFIED_DHASH;
          }
        }

        const res = await fetch("/api/inspector/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Inspection pipeline failed");
        }

        setDocketResult(data.result);
      } catch (err) {
        console.error("[Inspector] Audit failed:", err);
        setErrorMessage(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setIsAnalyzing(false);
        setAnalysisStage("");
      }
    },
    [rawText, uploadedImage, simulateStolenCollision]
  );

  // Initial auto-load based on URL params or default preset
  useEffect(() => {
    if (urlDocket) {
      handleAnalyze({ docketId: urlDocket });
    } else if (urlPreset) {
      setSelectedPresetId(urlPreset);
      handleAnalyze({ presetId: urlPreset });
    } else {
      // Load preset 1 by default
      handleAnalyze({ presetId: "preset-01-bashundhara-scam" });
    }
  }, [urlDocket, urlPreset, handleAnalyze]);

  // Handle Judge Preset Click
  function handleSelectPreset(preset: JudgeInspectionPreset) {
    setSelectedPresetId(preset.id);
    setRawText(preset.adTextRaw);
    setImagePreviewUrl(preset.sampleImageUrl);
    setUploadedImage(null);
    setSimulateStolenCollision(false);
    handleAnalyze({ presetId: preset.id });
  }

  // Handle Client-Side File Upload with Pre-Compression
  async function handleFileUpload(file: File) {
    try {
      const compressed = await compressAndHashImageOnClient(file, 1400, 0.82);
      setUploadedImage(compressed);
      setImagePreviewUrl(compressed.base64DataUrl);
      setSelectedPresetId("");
    } catch (err) {
      console.error("[Inspector] Client compression failed:", err);
    }
  }

  // Handle 1-Click Synthetic To-Let Poster Generation
  function handleGenerateSyntheticAd() {
    const isScam = true;
    const dataUrl = renderSyntheticToLetPosterDataUrl({
      title: "Bashundhara R/A Luxury 3BHK Flat To-Let",
      titleBn: "বসুন্ধরা আবাসিক এলাকা লাক্সারি ৩ বেডরুম ফ্ল্যাট ভাড়া",
      rentText: "৳11,500/মাস",
      advanceText: "অগ্রিম ১ মাস (বিকাশে ৩০০০ টাকা ভিজিটিং ফি আবশ্যক)",
      phoneText: "+880 1712-984XXX",
      badgeText: "URGENT TO-LET // 24 HRS",
      isScamStyle: isScam,
    });

    const file = dataUrlToFile(dataUrl, "synthetic-bashundhara-bait-ad.jpg");
    handleFileUpload(file);
    setRawText(
      "জরুরী বসুন্ধরা আবাসিক এলাকায় ৩ রুমের ফুল ফার্নিশড লাক্সারি ফ্ল্যাট ভাড়া হবে মাত্র ১১,৫০০ টাকায়। তবে ফ্ল্যাট ভিজিট করার জন্য বিকাশে ৩,০০০ টাকা ভিজিটিং কার্ড ফি না দিলে বাসা দেখানো হবে না। বিকাশ করুন: 01712-984XXX।"
    );
    setSimulateStolenCollision(true);
  }

  // Copy Markdown Audit Report to Clipboard
  function handleCopyAuditReport() {
    if (!docketResult) return;
    const report = `
# RENTRADAR FORENSIC AUDIT DOCKET // ${docketResult.docketNumber}
Generated: ${new Date(docketResult.analyzedAt).toLocaleString()}
Engine: ${docketResult.engineUsed || "GEMINI 2.5 FLASH + SHARP 64-BIT dHASH"}

## RISK VERDICT
Risk Score: ${docketResult.overallRiskScore}/100 (${docketResult.overallRiskSeverity})
Summary: ${docketResult.summaryVerdict}

## EXTRACTED AD CLAIMS
- Claimed Location: ${docketResult.extractedData.claimedLocation}
- Monthly Rent: ৳${docketResult.extractedData.claimedRentBdt?.toLocaleString() || "N/A"}
- Advance Deposit: ${docketResult.extractedData.claimedAdvanceMonths || "N/A"} month(s)
- Contact Numbers: ${docketResult.extractedData.contactNumbers.join(", ")}
- Pre-Visit Mobile Money Demand: ${
      docketResult.extractedData.advancePaymentRequestedBeforeVisit ? "YES (FLAGGED)" : "NO"
    }

## EVIDENCE FLAGS (${docketResult.evidenceFlags.length})
${docketResult.evidenceFlags
  .map(
    (ef, i) =>
      `${i + 1}. [${ef.severity}] ${ef.title}\n   ${ef.explanation}\n   Quote: "${
        ef.evidenceQuote || "N/A"
      }"`
  )
  .join("\n")}

## PHOTO COLLISION MATCHES (${docketResult.duplicateMatches.length})
${
  docketResult.duplicateMatches.length > 0
    ? docketResult.duplicateMatches
        .map(
          (dm) =>
            `- Match Docket: ${dm.listing.docketId} (${dm.listing.neighborhood}) | Similarity: ${dm.similarityPercent}% | Hamming Dist: ${dm.hammingDistance} bits`
        )
        .join("\n")
    : "- No visual photo collisions detected in catalog."
}

---
Verified via RentRadar Civic Infrastructure
https://rentradar.bd
    `.trim();

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  // Highlight suspicious keywords in OCR transcript
  const highlightedTranscript = useMemo(() => {
    if (!docketResult?.extractedTextRaw) return null;
    const text = docketResult.extractedTextRaw;
    const triggerRegex =
      /(বিকাশ|নগদ|রকেট|bkash|nagad|rocket|ভিজিটিং কার্ড(?: ফি)?|বাসা দেখার আগে|বুকিং ফি|visiting fee|visiting card|অগ্রিম ছাড়া বাসা দেখানো যাবে না|1[3-9]\s*(?:টাকা|\/|-)?\s*(?:unit|ইউনিট))/gi;

    const parts = text.split(triggerRegex);
    return parts.map((part, i) => {
      if (part.match(triggerRegex)) {
        return (
          <mark
            key={i}
            className="bg-evidence-red/20 text-evidence-red font-bold px-1 border-b-2 border-evidence-red"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [docketResult?.extractedTextRaw]);

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)]">
      {/* Clean Header Bar */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-radar text-carbon font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                MODULE 02
              </span>
              <span>// FORENSIC AUDIT PIPELINE</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              AI Listing Inspector &amp; Scam Radar
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <div className="border border-carbon bg-paper px-2.5 py-1 text-muted-ink text-[11px] shadow-docket-sm">
              <span className="text-evidence-green font-bold">●</span> <strong className="text-carbon">6</strong> Deterministic Rules
            </div>
            <div className="border border-carbon bg-paper px-2.5 py-1 text-muted-ink text-[11px] shadow-docket-sm">
              <span className="text-radar font-bold">●</span> <strong className="text-carbon">1991</strong> Rent Act
            </div>
          </div>
        </div>
      </div>

      {/* Main Forensic Inspector Grid */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: EVIDENCE INPUT & 1-CLICK JUDGE CONSOLE (5 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1-Click Judge Demo Presets Strip */}
            <div className="border-2 border-carbon bg-surface p-4 shadow-docket space-y-3">
              <div className="flex items-center justify-between border-b border-carbon pb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-carbon flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-radar" />
                  <span>1-Click Buildathon Judge Presets</span>
                </span>
                <span className="text-[10px] font-mono text-muted-ink">SELECT CASE</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {JUDGE_INSPECTION_PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  const isCritical = p.riskSeverity === "CRITICAL";
                  const isHigh = p.riskSeverity === "HIGH";
                  const isModerate = p.riskSeverity === "MODERATE";

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`text-left p-2.5 border transition-all text-xs font-mono flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-paper border-carbon shadow-[3px_3px_0px_0px_#0A0A0A] font-bold"
                          : "bg-surface border-grid-line hover:border-carbon hover:bg-paper/50"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1 py-0.2 text-[9px] font-bold border border-carbon ${
                              isCritical
                                ? "bg-evidence-red text-white"
                                : isHigh
                                ? "bg-evidence-amber text-carbon"
                                : isModerate
                                ? "bg-amber-100 text-carbon"
                                : "bg-evidence-green text-white"
                            }`}
                          >
                            {p.riskSeverity} {p.riskScore}
                          </span>
                          <span className="text-muted-ink text-[10px]">{p.metro}</span>
                        </div>
                        <div className="text-carbon font-sans font-bold text-xs truncate">
                          {p.name}
                        </div>
                      </div>

                      <span className="text-muted-ink text-[11px] shrink-0 font-mono">
                        {isSelected ? "ACTIVE ▶" : "AUDIT →"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multimodal Upload & Synthetic Ad Box */}
            <div className="border-2 border-carbon bg-surface p-4 shadow-docket space-y-3">
              <div className="flex items-center justify-between border-b border-carbon pb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-carbon flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-carbon" />
                  <span>Multimodal Evidence Input</span>
                </span>
                <span className="text-[10px] font-mono text-muted-ink">JPG / PNG / WEBP</span>
              </div>

              {/* Drag & Drop Canvas Box */}
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="relative border-2 border-dashed border-carbon p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper transition-colors group min-h-[140px]"
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                {imagePreviewUrl ? (
                  <div className="space-y-2 w-full">
                    <div className="relative h-28 w-full border border-carbon bg-paper overflow-hidden">
                      <Image
                        src={imagePreviewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    {uploadedImage && (
                      <div className="font-mono text-[10px] text-evidence-green font-bold">
                        Pre-Compressed: {Math.round(uploadedImage.originalSizeBytes / 1024)} KB →{" "}
                        {Math.round(uploadedImage.compressedSizeBytes / 1024)} KB JPEG // Vercel Safe
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-carbon mx-auto group-hover:scale-110 transition-transform" />
                    <div className="font-mono text-xs font-bold text-carbon">
                      DROP RENTAL AD IMAGE OR CLICK TO BROWSE
                    </div>
                    <div className="font-mono text-[10px] text-muted-ink">
                      Client-compressed to ≤ 1400px (400–800 KB) with 9×8 dHash
                    </div>
                  </div>
                )}
              </label>

              {/* 1-Click Synthetic Ad Generator Button */}
              <button
                type="button"
                onClick={handleGenerateSyntheticAd}
                className="w-full px-3 py-1.5 bg-paper border border-carbon text-carbon hover:bg-radar text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 shadow-docket-sm"
              >
                <span>⚡</span>
                <span>GENERATE SAMPLE BANGLA TO-LET POSTER</span>
              </button>

              {/* Raw Text Input */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-carbon uppercase">Or Paste Facebook Post Text:</span>
                  <span className="text-[10px] text-muted-ink">Bangla &amp; English</span>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setSelectedPresetId("");
                  }}
                  rows={4}
                  placeholder='Paste Facebook rental listing caption (e.g., "জরুরী ৩ রুমের ফ্ল্যাট ভাড়া... বিকাশে ৩,০০০ টাকা ভিজিটিং ফি না দিলে বাসা দেখানো হবে না...")'
                  className="w-full border border-carbon p-2 font-mono text-xs text-carbon placeholder:text-muted-ink focus:outline-none focus:ring-0 bg-paper"
                />
              </div>

              {/* Simulation Toggles */}
              <div className="pt-1 border-t border-grid-line">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-carbon select-none">
                  <input
                    type="checkbox"
                    checked={simulateStolenCollision}
                    onChange={(e) => setSimulateStolenCollision(e.target.checked)}
                    className="w-4 h-4 rounded-none border border-carbon text-carbon focus:ring-0"
                  />
                  <span>Simulate Stolen Photo Collision (Gulshan RR-DHK-041)</span>
                </label>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() =>
                  handleAnalyze({
                    presetId: selectedPresetId || undefined,
                  })
                }
                className="w-full py-3 bg-radar hover:bg-radar-hover text-carbon font-mono text-sm font-bold border-2 border-carbon shadow-docket flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-carbon border-t-transparent animate-spin" />
                    <span>RUNNING FORENSIC PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-carbon" />
                    <span>EXECUTE MULTIMODAL FORENSIC AUDIT →</span>
                  </>
                )}
              </button>

              {/* Live Pipeline Scanning Telemetry */}
              {isAnalyzing && (
                <div className="bg-carbon text-radar p-3 font-mono text-xs border border-carbon animate-pulse space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-surface">
                    PIPELINE TELEMETRY:
                  </div>
                  <div className="text-radar font-bold">{analysisStage}</div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-evidence-red p-2.5 font-mono text-xs text-evidence-red font-bold">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: FORENSIC INSPECTION DOCKET (7 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-5">
            {docketResult ? (
              <div className="space-y-5">
                {/* Top Docket Header & High-Contrast Verdict Banner */}
                <div className="border-2 border-carbon bg-surface p-4 shadow-docket space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-carbon">
                        <span className="bg-carbon text-surface px-1.5 py-0.5">
                          {docketResult.docketNumber}
                        </span>
                        <span className="text-muted-ink">
                          {new Date(docketResult.analyzedAt).toLocaleTimeString()} //{" "}
                          {docketResult.engineUsed || "GEMINI 2.5 FLASH"}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-muted-ink">
                        Extracted Language:{" "}
                        <span className="font-bold text-carbon">
                          {docketResult.detectedLanguage}
                        </span>
                      </div>
                    </div>

                    {/* High-Contrast Risk Score Stamp */}
                    <div
                      className={`px-3 py-1.5 border-2 border-carbon font-mono text-sm font-bold flex items-center gap-2 self-start sm:self-auto ${
                        docketResult.overallRiskSeverity === "CRITICAL"
                          ? "bg-evidence-red text-white shadow-docket-sm"
                          : docketResult.overallRiskSeverity === "HIGH"
                          ? "bg-evidence-amber text-carbon shadow-docket-sm"
                          : docketResult.overallRiskSeverity === "MODERATE"
                          ? "bg-amber-100 text-carbon"
                          : "bg-evidence-green text-white shadow-docket-sm"
                      }`}
                    >
                      <span className="text-lg">{docketResult.overallRiskScore}/100</span>
                      <span className="text-xs uppercase">
                        {docketResult.overallRiskSeverity} RISK SIGNALS
                      </span>
                    </div>
                  </div>

                  {/* Summary Verdict Quote */}
                  <div className="bg-paper p-3 border border-carbon font-mono text-xs space-y-1.5">
                    <div className="font-bold text-carbon uppercase text-[10px] text-muted-ink">
                      OFFICIAL AUDIT SUMMARY:
                    </div>
                    <p className="text-carbon leading-relaxed font-sans font-medium text-xs">
                      {docketResult.summaryVerdict}
                    </p>
                  </div>

                  {/* Evidence-First AI Principle Callout */}
                  <div className="text-[10px] font-mono text-muted-ink flex items-center gap-1.5 border-t border-grid-line pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-carbon shrink-0" />
                    <span>
                      EVIDENCE-FIRST AI BOUNDARY: RentRadar never issues arbitrary blacklists. Every
                      flag is rooted in verifiable mathematical, visual, or statutory evidence.
                    </span>
                  </div>
                </div>

                {/* Tab Navigation Strip */}
                <div className="border border-carbon bg-paper p-1 flex flex-wrap gap-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("claims")}
                    className={`px-3 py-1.5 transition-colors font-bold flex items-center gap-1.5 ${
                      activeTab === "claims"
                        ? "bg-carbon text-surface"
                        : "text-carbon hover:bg-surface"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>CLAIMS &amp; TRANSCRIPT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("collision")}
                    className={`px-3 py-1.5 transition-colors font-bold flex items-center gap-1.5 ${
                      activeTab === "collision"
                        ? "bg-carbon text-surface"
                        : "text-carbon hover:bg-surface"
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>
                      PHOTO COLLISION ({docketResult.duplicateMatches.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("anomalies")}
                    className={`px-3 py-1.5 transition-colors font-bold flex items-center gap-1.5 ${
                      activeTab === "anomalies"
                        ? "bg-carbon text-surface"
                        : "text-carbon hover:bg-surface"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>
                      FLAGS ({docketResult.evidenceFlags.length}) &amp; BENCHMARK
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("checklist")}
                    className={`px-3 py-1.5 transition-colors font-bold flex items-center gap-1.5 ${
                      activeTab === "checklist"
                        ? "bg-carbon text-surface"
                        : "text-carbon hover:bg-surface"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SAFETY CHECKLIST</span>
                  </button>
                </div>

                {/* ===================================================================== */}
                {/* TAB 1: EXTRACTED CLAIMS & VERBATIM OCR TRANSCRIPT */}
                {/* ===================================================================== */}
                {activeTab === "claims" && (
                  <div className="space-y-4">
                    {/* 6-Cell Metric Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          CLAIMED LOCATION
                        </span>
                        <span className="font-bold text-carbon text-xs truncate block">
                          {docketResult.extractedData.claimedLocation}
                        </span>
                      </div>

                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          ADVERTISED RENT
                        </span>
                        <span className="font-bold text-carbon text-sm">
                          ৳
                          {docketResult.extractedData.claimedRentBdt
                            ? docketResult.extractedData.claimedRentBdt.toLocaleString()
                            : "Undisclosed"}
                        </span>
                      </div>

                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          ADVANCE DEMAND
                        </span>
                        <span className="font-bold text-carbon text-xs">
                          {docketResult.extractedData.claimedAdvanceMonths
                            ? `${docketResult.extractedData.claimedAdvanceMonths} Months`
                            : "Standard"}
                        </span>
                      </div>

                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          SERVICE CHARGE
                        </span>
                        <span className="font-bold text-carbon text-xs">
                          {docketResult.extractedData.claimedServiceChargeBdt
                            ? `৳${docketResult.extractedData.claimedServiceChargeBdt}`
                            : "Not Mentioned"}
                        </span>
                      </div>

                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          CONTACT NUMBERS
                        </span>
                        <span className="font-bold text-carbon text-xs truncate block">
                          {docketResult.extractedData.contactNumbers.length > 0
                            ? docketResult.extractedData.contactNumbers.join(", ")
                            : "None Extracted"}
                        </span>
                      </div>

                      <div className="border border-carbon bg-surface p-2.5 space-y-1">
                        <span className="text-[10px] text-muted-ink uppercase block">
                          PRE-VISIT bKASH FEE
                        </span>
                        <span
                          className={`font-bold text-xs ${
                            docketResult.extractedData.advancePaymentRequestedBeforeVisit
                              ? "text-evidence-red uppercase"
                              : "text-evidence-green"
                          }`}
                        >
                          {docketResult.extractedData.advancePaymentRequestedBeforeVisit
                            ? "YES (CRITICAL TRAP)"
                            : "None Detected"}
                        </span>
                      </div>
                    </div>

                    {/* Verbatim OCR Transcript Box */}
                    <div className="border border-carbon bg-surface p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-grid-line pb-1.5 font-mono text-xs">
                        <span className="font-bold text-carbon uppercase flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Verbatim Multimodal OCR Transcript</span>
                        </span>
                        <span className="text-[10px] text-muted-ink">
                          SUSPICIOUS PHRASES HIGHLIGHTED
                        </span>
                      </div>

                      <div className="p-3 bg-paper border border-grid-line font-mono text-xs text-carbon leading-relaxed whitespace-pre-line">
                        {highlightedTranscript || docketResult.extractedTextRaw}
                      </div>
                    </div>
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 2: SIDE-BY-SIDE DUPLICATE PHOTO COLLISION */}
                {/* ===================================================================== */}
                {activeTab === "collision" && (
                  <div className="space-y-5">
                    {/* Visual Comparison Card if duplicate exists */}
                    {docketResult.duplicateMatches.length > 0 && (
                      <div className="border-2 border-evidence-red bg-red-50 p-4 shadow-docket space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-evidence-red uppercase flex items-center gap-1.5">
                            <AlertOctagon className="w-4 h-4 text-evidence-red" />
                            <span>CRITICAL FORENSIC ALERT: STOLEN / CLONED PHOTO DETECTED</span>
                          </span>
                          <span className="font-mono text-xs font-bold bg-evidence-red text-white px-2 py-0.5">
                            {docketResult.duplicateMatches[0].similarityPercent}% Visual Match
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Left: Uploaded Ad */}
                          <div className="bg-surface border-2 border-carbon p-3 space-y-2 text-xs font-mono">
                            <div className="font-bold text-carbon uppercase border-b border-grid-line pb-1">
                              CURRENT ADVERTISEMENT CLAIM:
                            </div>
                            <div>
                              Location:{" "}
                              <span className="font-bold">
                                {docketResult.extractedData.claimedLocation}
                              </span>
                            </div>
                            <div>
                              Rent:{" "}
                              <span className="font-bold text-evidence-red">
                                ৳
                                {docketResult.extractedData.claimedRentBdt?.toLocaleString() ||
                                  "11,500"}
                                /mo (Suspicious Low)
                              </span>
                            </div>
                            <div>
                              Status:{" "}
                              <span className="bg-carbon text-radar px-1 text-[10px]">
                                UNVERIFIED ADVERT
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-ink">
                              Photo Hash: {docketResult.imageHash.slice(0, 16)}...
                            </div>
                          </div>

                          {/* Right: Original Verified Listing */}
                          <div className="bg-surface border-2 border-evidence-green p-3 space-y-2 text-xs font-mono">
                            <div className="flex items-center justify-between border-b border-grid-line pb-1">
                              <span className="font-bold text-evidence-green uppercase">
                                REGISTERED ORIGINAL LISTING:
                              </span>
                              <span className="bg-evidence-green text-white px-1 text-[10px] font-bold">
                                {docketResult.duplicateMatches[0].listing.docketId}
                              </span>
                            </div>
                            <div>
                              Location:{" "}
                              <span className="font-bold">
                                {docketResult.duplicateMatches[0].listing.neighborhood},{" "}
                                {docketResult.duplicateMatches[0].listing.city}
                              </span>
                            </div>
                            <div>
                              Recorded Rent:{" "}
                              <span className="font-bold text-carbon">
                                ৳
                                {docketResult.duplicateMatches[0].listing.monthlyRentBdt.toLocaleString()}
                                /mo
                              </span>
                            </div>
                            <div>
                              Owner Verification:{" "}
                              <span className="font-bold text-evidence-green">
                                {docketResult.duplicateMatches[0].listing.verificationTier}
                              </span>
                            </div>
                            <div className="pt-1">
                              <Link
                                href={`/discover`}
                                className="text-carbon underline font-bold hover:text-radar"
                              >
                                View Original Verified Listing in Discover →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dhash Bit Matrix Component */}
                    <DhashBitMatrixCard
                      binaryHash={docketResult.imageHash}
                      luminanceGrid9x8={docketResult.fingerprint?.luminanceGrid9x8}
                      compareWithHash={
                        docketResult.duplicateMatches.length > 0
                          ? docketResult.duplicateMatches[0].listing.imageDhash
                          : undefined
                      }
                      compareListingDocket={
                        docketResult.duplicateMatches.length > 0
                          ? docketResult.duplicateMatches[0].listing.docketId
                          : undefined
                      }
                      engineLabel={docketResult.fingerprint?.engine || "SHARP_NATIVE_9X8"}
                    />
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 3: ANOMALIES & EVIDENCE FLAGS */}
                {/* ===================================================================== */}
                {activeTab === "anomalies" && (
                  <div className="space-y-4">
                    {/* Price Anomaly Meter */}
                    {Boolean(docketResult.priceAnomaly?.benchmark) && docketResult.priceAnomaly?.benchmark && (
                      <div className="border border-carbon bg-surface p-4 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-grid-line pb-1.5">
                          <span className="font-bold text-carbon uppercase">
                            Market Rent Benchmark //{" "}
                            {docketResult.priceAnomaly.benchmark.neighborhood}
                          </span>
                          <span
                            className={`font-bold px-2 py-0.5 border border-carbon ${
                              docketResult.priceAnomaly.deviationPercent <= -38
                                ? "bg-evidence-red text-white"
                                : "bg-paper text-carbon"
                            }`}
                          >
                            {docketResult.priceAnomaly.deviationPercent}% vs Median
                          </span>
                        </div>

                        <p className="text-muted-ink text-xs font-sans">
                          {docketResult.priceAnomaly.explanation}
                        </p>

                        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px]">
                          <div className="bg-paper p-1.5 border border-grid-line">
                            <span className="text-[10px] text-muted-ink block">Typical 2-Bed</span>
                            <span className="font-bold text-carbon">
                              ৳
                              {docketResult.priceAnomaly.benchmark.typical2BedMin.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-paper p-1.5 border border-grid-line">
                            <span className="text-[10px] text-muted-ink block">Typical 3-Bed</span>
                            <span className="font-bold text-carbon">
                              ৳
                              {docketResult.priceAnomaly.benchmark.typical3BedMin.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-paper p-1.5 border border-grid-line">
                            <span className="text-[10px] text-muted-ink block">Utility Provider</span>
                            <span className="font-bold text-carbon truncate block">
                              {docketResult.priceAnomaly.benchmark.utilityProvider}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evidence Flags Dossier */}
                    <div className="space-y-3">
                      <div className="font-mono text-xs font-bold text-carbon uppercase">
                        Evidence Flags Dossier ({docketResult.evidenceFlags.length} Triggered)
                      </div>

                      {docketResult.evidenceFlags.map((ef, idx) => (
                        <div
                          key={idx}
                          className={`border-2 p-3 space-y-1.5 ${
                            ef.severity === "CRITICAL"
                              ? "border-evidence-red bg-red-50/60"
                              : ef.severity === "HIGH"
                              ? "border-evidence-amber bg-amber-50/60"
                              : "border-carbon bg-surface"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-carbon ${
                                  ef.severity === "CRITICAL"
                                    ? "bg-evidence-red text-white"
                                    : ef.severity === "HIGH"
                                    ? "bg-evidence-amber text-carbon"
                                    : "bg-paper text-carbon"
                                }`}
                              >
                                {ef.severity}
                              </span>
                              <span className="font-bold text-carbon text-xs font-sans">
                                {ef.title}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-muted-ink">{ef.code}</span>
                          </div>

                          <p className="text-xs text-carbon leading-relaxed font-sans">
                            {ef.explanation}
                          </p>

                          {ef.evidenceQuote && (
                            <div className="text-[11px] font-mono text-muted-ink bg-paper/80 p-1.5 border-l-2 border-carbon italic">
                              &ldquo;{ef.evidenceQuote}&rdquo;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===================================================================== */}
                {/* TAB 4: TENANT SAFETY CHECKLIST & ACTIONS */}
                {/* ===================================================================== */}
                {activeTab === "checklist" && (
                  <div className="space-y-4">
                    <div className="border border-carbon bg-surface p-4 space-y-3">
                      <div className="font-mono text-xs font-bold text-carbon uppercase border-b border-grid-line pb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-evidence-green" />
                        <span>Statutory &amp; Physical Pre-Payment Verification Checklist</span>
                      </div>

                      <div className="space-y-2">
                        {docketResult.verificationChecklist.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-start gap-2.5 p-2 bg-paper border border-grid-line text-xs font-sans text-carbon cursor-pointer hover:bg-surface transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="mt-0.5 w-4 h-4 rounded-none border border-carbon text-carbon focus:ring-0 shrink-0"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Module Action Bar */}
                    <div className="border-2 border-carbon bg-surface p-4 shadow-docket space-y-3">
                      <div className="font-mono text-xs font-bold text-carbon uppercase">
                        Cross-Module Actions
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/calculator?rent=${
                            docketResult.extractedData.claimedRentBdt || 18000
                          }&advance=${
                            docketResult.extractedData.claimedAdvanceMonths || 2
                          }&service=${
                            docketResult.extractedData.claimedServiceChargeBdt || 2500
                          }&city=${docketResult.extractedData.claimedCity || "Dhaka"}&area=${
                            docketResult.extractedData.claimedNeighborhood || "Dhanmondi"
                          }`}
                          className="px-3 py-2 text-xs font-mono font-bold bg-radar text-carbon border border-carbon hover:bg-radar-hover shadow-docket-sm inline-flex items-center gap-1.5"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>SEND TO TRUE-COST CALCULATOR →</span>
                        </Link>

                        <Link
                          href="/assistant"
                          className="px-3 py-2 text-xs font-mono font-bold bg-surface text-carbon border border-carbon hover:bg-paper shadow-docket-sm inline-flex items-center gap-1.5"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>CONSULT 1991 RENT CONTROL ACT →</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleCopyAuditReport}
                          className="px-3 py-2 text-xs font-mono font-bold bg-carbon text-surface hover:bg-radar hover:text-carbon border border-carbon transition-colors inline-flex items-center gap-1.5 ml-auto"
                        >
                          {copiedReport ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-evidence-green" />
                              <span>COPIED TO CLIPBOARD!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY AUDIT REPORT</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-carbon p-12 text-center space-y-3 bg-surface">
                <ShieldAlert className="w-10 h-10 text-muted-ink mx-auto" />
                <div className="font-mono text-sm font-bold text-carbon">
                  AWAITING EVIDENCE FOR FORENSIC SCAN
                </div>
                <p className="font-mono text-xs text-muted-ink max-w-sm mx-auto">
                  Select a Judge Preset on the left, upload a rental advert photo, or paste a
                  Facebook To-Let post caption to run the multimodal inspection.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InspectorPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-paper min-h-[calc(100vh-4rem)] flex items-center justify-center font-mono text-xs text-muted-ink">
          INITIALIZING FORENSIC INSPECTOR WORKSPACE...
        </div>
      }
    >
      <InspectorWorkspace />
    </Suspense>
  );
}
