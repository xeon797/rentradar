"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Scan,
  ArrowRight,
  ArrowUpRight,
  Camera,
  AlertTriangle,
  ShieldCheck,
  Zap,
  FileText,
  Scale,
  Radar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";
import { BD_NEIGHBORHOOD_BENCHMARKS } from "@/lib/data/bd-neighborhood-benchmarks";
import { cn } from "@/lib/utils";

const BENCHMARK_ROWS = Object.values(BD_NEIGHBORHOOD_BENCHMARKS).map((b) => {
  const realMedian = `৳${b.typical3BedMin.toLocaleString()} – ৳${Math.round(b.typical3BedMin * 1.35).toLocaleString()}`;
  const scamBaitPrice = Math.round(b.typical3BedMin * 0.35);
  const scamBait = `৳${scamBaitPrice.toLocaleString()}`;
  const anomalyPct = `-${Math.round(((b.typical3BedMin - scamBaitPrice) / b.typical3BedMin) * 100)}%`;
  const trapType =
    b.city === "Dhaka"
      ? "Stolen Photos + Pre-visit bKash Gatepass Trap"
      : b.city === "Sylhet"
      ? "Expat Recycled Pic + Unmetered Surcharge Trap"
      : "Phantom Medical/Port Officer Transfer Deposit";

  return {
    city: b.city,
    neighborhood: `${b.neighborhood} (${b.neighborhoodBn})`,
    typicalBeds: "3 BHK (1,300+ sqft)",
    realMedian,
    scamBait,
    anomalyPct,
    trapType,
  };
});

export default function HomePage() {
  const [heroDemoMode, setHeroDemoMode] = React.useState<"SCAM" | "VERIFIED">("SCAM");
  const [showAllBenchmarks, setShowAllBenchmarks] = React.useState(false);

  const displayedBenchmarks = showAllBenchmarks
    ? BENCHMARK_ROWS
    : BENCHMARK_ROWS.slice(0, 6);

  return (
    <div className="w-full bg-paper">
      {/* Top Architectural Notice Bar */}
      <div className="border-b border-carbon/20 bg-carbon text-surface px-4 py-2 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-radar" />
          <span className="font-bold uppercase tracking-wider">
            CIVIC FORENSIC PLATFORM // BANGLADESH URBAN RENTAL INTELLIGENCE
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            {Object.keys(BD_NEIGHBORHOOD_BENCHMARKS).length} METRO REGIONS • {SEED_PROPERTIES.length} SEED DOCKETS
          </span>
          <span className="hidden sm:inline border-l border-zinc-700 pl-4 text-radar font-bold">
            ZERO PAID API OVERHEAD
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: SPLIT-SCREEN HERO — "BEFORE YOU SEND BKASH, RUN THE RADAR"
         ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 border-b-2 border-carbon">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 border border-carbon bg-surface px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-carbon shadow-docket-sm">
              <span className="h-2 w-2 bg-evidence-red animate-pulse" />
              <span>// FORENSIC SCAM DEFENSE &amp; TENANT RIGHTS</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight leading-[1.02] text-carbon">
              Don&apos;t Pay Advance <br />
              <span className="bg-radar px-2 py-0.5 border border-carbon inline-block mt-1 shadow-docket-sm">
                On A Stolen Photo.
              </span>
            </h1>

            {/* Concise Subheadline */}
            <p className="text-base sm:text-lg text-muted-ink font-bilingual leading-relaxed max-w-2xl">
              Upload any Facebook To-Let screenshot or street signboard photo.
              RentRadar uses Gemini 2.5 Flash and 64-bit perceptual image hashing (dHash) to expose
              stolen photos, calculate true monthly expenses, and enforce your statutory rights under Bangladesh law.
            </p>

            {/* Visual 3-Step Process Flow Graphic */}
            <div className="border border-carbon bg-surface p-3 shadow-docket-sm space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-ink uppercase">
                <span className="font-bold text-carbon">// HOW RENTRADAR PROTECTS YOU IN 3 STEPS</span>
                <span className="text-[10px] bg-paper px-1.5 py-0.5 border border-carbon/30">ZERO COST</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <div className="flex items-center gap-2.5 border border-carbon/20 bg-paper p-2.5">
                  <div className="h-8 w-8 rounded-none bg-carbon text-surface flex items-center justify-center shrink-0">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-carbon text-[11px]">1. Snap / Upload</div>
                    <div className="text-[10px] text-muted-ink">To-Let ad or signboard</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border border-carbon/20 bg-paper p-2.5">
                  <div className="h-8 w-8 rounded-none bg-radar text-carbon flex items-center justify-center shrink-0 border border-carbon">
                    <Radar className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-carbon text-[11px]">2. 64-Bit Scan</div>
                    <div className="text-[10px] text-muted-ink">dHash &amp; Gemini OCR</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border border-carbon/20 bg-paper p-2.5">
                  <div className="h-8 w-8 rounded-none bg-evidence-green text-surface flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-carbon text-[11px]">3. Instant Verdict</div>
                    <div className="text-[10px] text-muted-ink">Scam alert &amp; law guard</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/inspector">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-mono text-xs sm:text-sm font-bold shadow-docket hover:shadow-docket-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
                >
                  <Scan className="h-4 w-4" />
                  <span>[ RUN AI LISTING INSPECTOR ]</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/discover">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mono text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-surface border-carbon shadow-docket-sm"
                >
                  <Search className="h-4 w-4" />
                  <span>[ EXPLORE VERIFIED MAP ]</span>
                </Button>
              </Link>
            </div>

            {/* Streamlined Feature Pills with Graphic Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-carbon bg-surface divide-y sm:divide-y-0 sm:divide-x divide-carbon shadow-docket-sm mt-6">
              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-carbon font-bold uppercase">
                  <div className="h-5 w-5 bg-radar text-carbon flex items-center justify-center border border-carbon">
                    <Camera className="h-3 w-3" />
                  </div>
                  <span>64-BIT dHASH</span>
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Stolen Photo Radar
                </div>
                <div className="text-[11px] font-mono text-muted-ink leading-tight">
                  Detects recycled listing photos across Dhaka, Sylhet &amp; Chattogram.
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-carbon font-bold uppercase">
                  <div className="h-5 w-5 bg-carbon text-surface flex items-center justify-center">
                    <Zap className="h-3 w-3" />
                  </div>
                  <span>BILINGUAL OCR</span>
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Gemini Vision
                </div>
                <div className="text-[11px] font-mono text-muted-ink leading-tight">
                  Extracts Bangla &amp; English To-Let claims in under 800ms.
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-carbon font-bold uppercase">
                  <div className="h-5 w-5 bg-evidence-green text-surface flex items-center justify-center">
                    <Scale className="h-3 w-3" />
                  </div>
                  <span>1991 RENT ACT</span>
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Statutory Defense
                </div>
                <div className="text-[11px] font-mono text-muted-ink font-bangla leading-tight">
                  অগ্রিম ভাড়া ও উচ্ছেদ বিরোধী নাগরিক সুরক্ষা।
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols on lg): Clean Graphic Visual Showcase */}
          <div className="lg:col-span-5 space-y-3">
            {/* 2-Mode Interactive Showcase Switcher */}
            <div className="border-2 border-carbon bg-paper p-1.5 shadow-docket-sm">
              <div className="grid grid-cols-2 gap-1.5 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHeroDemoMode("SCAM")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-3 border transition-all text-center",
                    heroDemoMode === "SCAM"
                      ? "bg-evidence-red text-white border-evidence-red shadow-docket-sm"
                      : "bg-surface text-carbon border-carbon/30 hover:border-carbon hover:bg-paper"
                  )}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>[ 🚨 CAUGHT SCAM AD ]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroDemoMode("VERIFIED")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-3 border transition-all text-center",
                    heroDemoMode === "VERIFIED"
                      ? "bg-evidence-green text-white border-evidence-green shadow-docket-sm"
                      : "bg-surface text-carbon border-carbon/30 hover:border-carbon hover:bg-paper"
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>[ 🛡️ VERIFIED LISTING ]</span>
                </button>
              </div>
            </div>

            {/* Main Visual Showcase Frame */}
            <div className="border-2 border-carbon bg-surface shadow-docket overflow-hidden">
              {/* Graphic Photography & Radar Scanner HUD */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-carbon border-b-2 border-carbon">
                <Image
                  src={
                    heroDemoMode === "SCAM"
                      ? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={heroDemoMode === "SCAM" ? "Scammed Property Photo" : "Verified Rental Property"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover opacity-90 transition-all duration-300"
                  priority
                />

                {/* Animated Laser Scanning Line */}
                <div
                  className={cn(
                    "absolute inset-x-0 h-1 z-10 animate-scanline pointer-events-none",
                    heroDemoMode === "SCAM"
                      ? "bg-gradient-to-r from-transparent via-evidence-red to-transparent shadow-[0_0_8px_#DC2626]"
                      : "bg-gradient-to-r from-transparent via-radar to-transparent shadow-[0_0_8px_#FACC15]"
                  )}
                />

                {/* Radar Targeting Reticle Corner Brackets */}
                <div className="absolute inset-2 pointer-events-none z-10 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm font-bold text-radar">┌──</span>
                    <span className="font-mono text-sm font-bold text-radar">──┐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm font-bold text-radar">└──</span>
                    <span className="font-mono text-sm font-bold text-radar">──┘</span>
                  </div>
                </div>

                {/* Top Badge: Detection Status Stamp */}
                <div className="absolute top-3 left-3 z-20">
                  {heroDemoMode === "SCAM" ? (
                    <div className="flex items-center gap-1.5 bg-evidence-red text-white border border-carbon px-2.5 py-1 font-mono text-[11px] font-bold shadow-docket-sm">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>STOLEN PHOTO DETECTED (98.4% MATCH)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-evidence-green text-white border border-carbon px-2.5 py-1 font-mono text-[11px] font-bold shadow-docket-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>MUNICIPAL AUDIT PASSED</span>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Pill: Location & Photo Origin */}
                <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between bg-carbon/90 text-surface backdrop-blur-sm border border-carbon px-2.5 py-1.5 font-mono text-[11px]">
                  <div className="truncate">
                    {heroDemoMode === "SCAM" ? (
                      <span>📍 Bashundhara R/A (Reused Gulshan Photo)</span>
                    ) : (
                      <span>📍 Dhanmondi Road 9/A, Dhaka</span>
                    )}
                  </div>
                  <div className="shrink-0 font-bold text-radar">
                    {heroDemoMode === "SCAM" ? "Hamming Diff: 1" : "DESCO Meter: Valid"}
                  </div>
                </div>
              </div>

              {/* Price Reality Comparison Bar */}
              <div className="p-3 bg-paper border-b border-carbon">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="border border-carbon bg-surface p-2 shadow-docket-sm">
                    <div className="text-[10px] font-mono text-muted-ink uppercase">
                      {heroDemoMode === "SCAM" ? "Claimed Bait Rent" : "Verified Base Rent"}
                    </div>
                    <div className="font-mono text-lg font-bold text-carbon">
                      {heroDemoMode === "SCAM" ? "৳11,500/mo" : "৳28,000/mo"}
                    </div>
                    <div className="text-[10px] font-mono text-muted-ink">
                      {heroDemoMode === "SCAM" ? "3 Bed Furnished Flat" : "3 Bed Fair Market Rate"}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "border p-2 shadow-docket-sm",
                      heroDemoMode === "SCAM"
                        ? "border-evidence-red bg-red-50 text-carbon"
                        : "border-evidence-green bg-emerald-50 text-carbon"
                    )}
                  >
                    <div className="text-[10px] font-mono uppercase font-semibold">
                      {heroDemoMode === "SCAM" ? "Area Market Median" : "Estimated Total Outflow"}
                    </div>
                    <div
                      className={cn(
                        "font-mono text-lg font-bold",
                        heroDemoMode === "SCAM" ? "text-evidence-red" : "text-evidence-green"
                      )}
                    >
                      {heroDemoMode === "SCAM" ? "৳34,000/mo" : "৳33,500/mo"}
                    </div>
                    <div className="text-[10px] font-mono font-bold">
                      {heroDemoMode === "SCAM" ? "🚨 -66% Fake Price Anomaly" : "✓ 0 Hidden Utility Surprises"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Visual Forensic Findings Badges */}
              <div className="p-3 space-y-2 bg-surface">
                <div className="text-[10px] font-mono font-bold uppercase text-muted-ink flex items-center justify-between">
                  <span>{heroDemoMode === "SCAM" ? "// FORENSIC ANOMALY PROOFS" : "// CIVIC TRUST SIGNALS"}</span>
                  <span className="text-carbon font-bold">
                    {heroDemoMode === "SCAM" ? "3 CRITICAL FLAGS" : "100% COMPLIANT"}
                  </span>
                </div>

                {heroDemoMode === "SCAM" ? (
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-start gap-2 border border-evidence-red bg-red-50/70 p-2 text-carbon">
                      <Camera className="h-4 w-4 text-evidence-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-red">
                          Stolen Listing Photography
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Photo identical to Gulshan-2 listing RR-DHK-041 (64-bit dHash collision).
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border border-evidence-red bg-red-50/70 p-2 text-carbon">
                      <AlertTriangle className="h-4 w-4 text-evidence-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-red">
                          Advance bKash Gatepass Trap
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Demands ৳3,000 send-money before revealing address or scheduling in-person visit.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border border-evidence-red bg-red-50/70 p-2 text-carbon">
                      <Scale className="h-4 w-4 text-evidence-red shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-red">
                          1991 Rent Control Act Breach
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Violates Section 10 (unlawful premium demand prior to lease execution).
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-start gap-2 border border-evidence-green bg-emerald-50/70 p-2 text-carbon">
                      <Zap className="h-4 w-4 text-evidence-green shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-green">
                          DESCO Utility Billing Verified
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Official meter account # matched with registered land deed and National ID.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border border-evidence-green bg-emerald-50/70 p-2 text-carbon">
                      <FileText className="h-4 w-4 text-evidence-green shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-green">
                          Statutory Rent Receipt Guaranteed
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Landlord issues Section 13 dual-slip legal rent receipts (ভাড়ার রশিদ).
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 border border-evidence-green bg-emerald-50/70 p-2 text-carbon">
                      <ShieldCheck className="h-4 w-4 text-evidence-green shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[11px] text-evidence-green">
                          Zero Advance Escrow Risk
                        </div>
                        <div className="text-[11px] text-muted-ink font-sans">
                          Guaranteed in-person inspection before any security deposit or token payment.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Action Deep Link */}
                <div className="pt-1">
                  {heroDemoMode === "SCAM" ? (
                    <Link
                      href="/inspector?preset=preset-bashundhara-scam"
                      className="flex items-center justify-between bg-radar text-carbon border-2 border-carbon p-2.5 font-mono text-xs font-bold shadow-docket-sm hover:bg-radar-hover transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Scan className="h-4 w-4" />
                        <span>TEST THIS SCAM IN AI INSPECTOR</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href="/discover"
                      className="flex items-center justify-between bg-carbon text-surface border-2 border-carbon p-2.5 font-mono text-xs font-bold shadow-docket-sm hover:bg-zinc-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span>EXPLORE VERIFIED DHAKA PROPERTIES</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 2: THE 5-STAGE EVIDENCE PIPELINE MATRIX
         ========================================================================= */}
      <section className="border-b-2 border-carbon bg-surface py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-carbon pb-4">
            <div>
              <div className="font-mono text-xs text-muted-ink font-bold uppercase tracking-wider">
                // SYSTEM ARCHITECTURE &amp; FORENSIC RUNTIME
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-carbon">
                The 5-Stage Evidence Pipeline
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-ink font-mono">
              Deterministic verification engineering designed for zero paid API reliance and zero SaaS hallucinations.
            </p>
          </div>

          {/* 5 Architectural Pipeline Columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 border border-carbon bg-paper divide-y md:divide-y-0 md:divide-x divide-carbon shadow-docket">
            
            {/* Stage 1 */}
            <div className="p-4 sm:p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="bg-radar text-carbon font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                  STAGE 01
                </span>
                <span className="text-muted-ink text-[10px]">GEMINI 2.5</span>
              </div>
              <div className="font-display font-bold text-sm uppercase text-carbon leading-snug">
                Multimodal OCR
              </div>
              <p className="text-xs text-muted-ink font-sans leading-relaxed">
                Extracts structured claims from Bangla &amp; English To-Let posts, detecting deposits and unitemized utility terms.
              </p>
              <div className="border border-carbon/30 bg-paper p-1.5 font-mono text-[10px] text-muted-ink">
                Output: Verified Zod JSON
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-4 sm:p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="bg-carbon text-surface font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                  STAGE 02
                </span>
                <span className="text-muted-ink text-[10px]">SHARP</span>
              </div>
              <div className="font-display font-bold text-sm uppercase text-carbon leading-snug">
                64-Bit dHash
              </div>
              <p className="text-xs text-muted-ink font-sans leading-relaxed">
                Generates 64-bit gradient barcodes to identify recycled flat photos across cities regardless of crops or filters.
              </p>
              <div className="border border-carbon/30 bg-paper p-1.5 font-mono text-[10px] text-muted-ink">
                Hamming Distance &le; 10
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-4 sm:p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="bg-radar text-carbon font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                  STAGE 03
                </span>
                <span className="text-muted-ink text-[10px]">DETERMINISTIC</span>
              </div>
              <div className="font-display font-bold text-sm uppercase text-carbon leading-snug">
                Scam Rules Engine
              </div>
              <p className="text-xs text-muted-ink font-sans leading-relaxed">
                Zero AI hallucinations. Flags pre-visit bKash demands, WhatsApp-only contacts, and anomalous price deviations.
              </p>
              <div className="border border-carbon/30 bg-paper p-1.5 font-mono text-[10px] text-muted-ink">
                Pre-visit bKash = CRITICAL
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-4 sm:p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="bg-carbon text-surface font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                  STAGE 04
                </span>
                <span className="text-muted-ink text-[10px]">FINANCIAL</span>
              </div>
              <div className="font-display font-bold text-sm uppercase text-carbon leading-snug">
                True-Cost Engine
              </div>
              <p className="text-xs text-muted-ink font-sans leading-relaxed">
                Reveals the true move-in shock: base rent, advance months, LPG cylinders, and illegal sub-meter overcharges.
              </p>
              <div className="border border-carbon/30 bg-paper p-1.5 font-mono text-[10px] text-muted-ink">
                12-Mo Cashflow Schedule
              </div>
            </div>

            {/* Stage 5 */}
            <div className="p-4 sm:p-5 space-y-2 bg-surface">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="bg-radar text-carbon font-bold px-1.5 py-0.5 border border-carbon text-[10px]">
                  STAGE 05
                </span>
                <span className="text-muted-ink text-[10px]">LEGAL</span>
              </div>
              <div className="font-display font-bold text-sm uppercase text-carbon leading-snug">
                1991 Rent Act Guard
              </div>
              <p className="text-xs text-muted-ink font-sans leading-relaxed">
                Audits lease terms against Bangladesh&apos;s Premises Rent Control Act, 1991, generating polite counter-drafts.
              </p>
              <div className="border border-carbon/30 bg-paper p-1.5 font-mono text-[10px] text-muted-ink font-bangla">
                ধারা ৭, ১০, ১৩ ও ২১ সুরক্ষা
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BANGLADESH NEIGHBORHOOD RENT & ANOMALY BENCHMARK TICKER
         ========================================================================= */}
      <section className="border-b-2 border-carbon bg-paper py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-muted-ink font-bold uppercase tracking-wider">
                // CIVIC REAL ESTATE BENCHMARKS // DHAKA, SYLHET, CHATTOGRAM
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-carbon">
                Neighborhood Anomaly Threshold Ticker
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-ink font-mono">
              Listings priced &gt;45% below municipal medians trigger automatic scam investigation flags.
            </p>
          </div>

          {/* Ledger Table Container */}
          <div className="border-2 border-carbon bg-surface shadow-docket overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-carbon bg-carbon text-surface uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Metro Zone</th>
                  <th className="py-3 px-4">Neighborhood</th>
                  <th className="py-3 px-4">Unit Profile</th>
                  <th className="py-3 px-4">Market Median</th>
                  <th className="py-3 px-4 text-evidence-red">Scam Bait Price</th>
                  <th className="py-3 px-4">Anomaly Deviation</th>
                  <th className="py-3 px-4">Detected Syndicate Trap Pattern</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon/20">
                {displayedBenchmarks.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-paper/80 transition-colors tabular-nums"
                  >
                    <td className="py-3 px-4 font-bold text-carbon">
                      {row.city}
                    </td>
                    <td className="py-3 px-4 font-semibold text-carbon">
                      {row.neighborhood}
                    </td>
                    <td className="py-3 px-4 text-muted-ink">
                      {row.typicalBeds}
                    </td>
                    <td className="py-3 px-4 font-bold text-carbon">
                      {row.realMedian}
                    </td>
                    <td className="py-3 px-4 font-bold text-evidence-red bg-red-50/50">
                      {row.scamBait}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-red-100 text-evidence-red border border-evidence-red px-1.5 py-0.2 font-bold text-[10px]">
                        {row.anomalyPct}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-ink font-sans text-xs">
                      {row.trapType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted-ink border border-carbon/40 bg-surface p-3 gap-3">
            <div>
              [HOTSPOTS]: Showing {displayedBenchmarks.length} of {BENCHMARK_ROWS.length} municipal zones
            </div>
            <button
              type="button"
              onClick={() => setShowAllBenchmarks(!showAllBenchmarks)}
              className="bg-carbon text-surface px-3 py-1.5 font-bold hover:bg-radar hover:text-carbon transition-colors border border-carbon shadow-docket-sm"
            >
              {showAllBenchmarks ? "SHOW TOP 6 REGIONS ▲" : "SHOW ALL 16 REGIONS ▼"}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CORE MODULE DIRECTORY GRID
         ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-carbon pb-4">
            <div>
              <div className="font-mono text-xs text-muted-ink font-bold uppercase tracking-wider">
                // SYSTEM MODULE SUITE // ARCHITECTURAL ROUTE SCAFFOLD
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-carbon">
                RentRadar Module Directory
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-muted-ink font-mono">
              Explore the five integrated pillars engineered to protect tenants and streamline rental discovery.
            </p>
          </div>

          {/* 5-Card Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Discovery */}
            <div className="border border-carbon bg-paper p-5 shadow-docket hover:shadow-docket-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-carbon text-surface font-bold px-2 py-0.5 border border-carbon text-[10px]">
                    MODULE [01]
                  </span>
                  <span className="text-muted-ink text-[10px]">SPLIT EXPLORER</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-carbon">
                  Smart Rental Discovery
                </h3>
                <p className="text-xs text-muted-ink font-sans leading-relaxed">
                  Interactive Leaflet map with tactile price pins and natural language Bangla/English filters like &ldquo;ধানমন্ডিতে ২০ হাজারের নিচে ২ বেড&rdquo;.
                </p>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">LEAFLET MAP</span>
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">NL SEARCH</span>
                </div>
              </div>
              <Link href="/discover" className="pt-2">
                <Button variant="carbon" size="sm" className="w-full flex items-center justify-between font-bold">
                  <span>EXPLORE LISTINGS</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Card 2: AI Inspector (Featured) */}
            <div className="border-2 border-carbon bg-surface p-5 shadow-docket-yellow hover:shadow-docket transition-all flex flex-col justify-between space-y-4 relative">
              <div className="hazard-stripe absolute top-0 inset-x-0 w-full" />
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-radar text-carbon font-bold px-2 py-0.5 border border-carbon text-[10px]">
                    MODULE [02] — HERO
                  </span>
                  <span className="text-evidence-red font-bold text-[10px]">MULTIMODAL AI</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-carbon">
                  AI Advertisement Inspector
                </h3>
                <p className="text-xs text-muted-ink font-sans leading-relaxed">
                  Upload a Facebook screenshot or To-Let poster. Gemini transcribes claims while Sharp identifies stolen photo collisions across neighborhoods.
                </p>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="bg-radar/40 border border-carbon px-1.5 py-0.5 font-bold">GEMINI 2.5 FLASH</span>
                  <span className="bg-paper border border-carbon/40 px-1.5 py-0.5">64-BIT dHASH</span>
                </div>
              </div>
              <Link href="/inspector" className="pt-2">
                <Button variant="primary" size="sm" className="w-full flex items-center justify-between font-bold">
                  <span>RUN AI INSPECTOR</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Card 3: Verification */}
            <div className="border border-carbon bg-paper p-5 shadow-docket hover:shadow-docket-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-carbon text-surface font-bold px-2 py-0.5 border border-carbon text-[10px]">
                    MODULE [03]
                  </span>
                  <span className="text-muted-ink text-[10px]">ZERO-LLM PRIVACY</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-carbon">
                  Property Verification
                </h3>
                <p className="text-xs text-muted-ink font-sans leading-relaxed">
                  Encrypted utility bill audits (DESCO, DPDC, WASA). Real citizen IDs are masked locally with zero document transmission to 3rd-party LLMs.
                </p>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">PRIVATE VAULT</span>
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">NID MASKING</span>
                </div>
              </div>
              <Link href="/verify" className="pt-2">
                <Button variant="carbon" size="sm" className="w-full flex items-center justify-between font-bold">
                  <span>VERIFY PROPERTY</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Card 4: Calculator */}
            <div className="border border-carbon bg-paper p-5 shadow-docket hover:shadow-docket-sm transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-carbon text-surface font-bold px-2 py-0.5 border border-carbon text-[10px]">
                    MODULE [04]
                  </span>
                  <span className="text-muted-ink text-[10px]">TRUE CASHFLOW</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-carbon">
                  True Cost Calculator
                </h3>
                <p className="text-xs text-muted-ink font-sans leading-relaxed">
                  Recharts cashflow engine computing advance deposit shock, LPG cylinder costs, and sub-meter markup overcharges against BERC tariffs.
                </p>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">MOVE-IN SHOCK</span>
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">RECHARTS ENGINE</span>
                </div>
              </div>
              <Link href="/calculator" className="pt-2">
                <Button variant="carbon" size="sm" className="w-full flex items-center justify-between font-bold">
                  <span>CALCULATE CASHFLOW</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Card 5: Tenant Law Assistant */}
            <div className="border border-carbon bg-paper p-5 shadow-docket hover:shadow-docket-sm transition-all flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-2">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="bg-carbon text-surface font-bold px-2 py-0.5 border border-carbon text-[10px]">
                    MODULE [05]
                  </span>
                  <span className="text-muted-ink text-[10px]">1991 PREMISES RENT ACT</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-carbon">
                  Tenant Protection &amp; Legal Guard
                </h3>
                <p className="text-xs text-muted-ink font-sans leading-relaxed">
                  Bilingual legal assistant grounded in the Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১). Audits draft leases, checks illegal rent hikes, and generates printable Section 13 rent receipts (ভাড়ার রশিদ).
                </p>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">1991 RENT ACT</span>
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">CLAUSE AUDITOR</span>
                  <span className="bg-surface border border-carbon/40 px-1.5 py-0.5">RECEIPT PRINTER</span>
                </div>
              </div>
              <Link href="/assistant" className="pt-2">
                <Button variant="carbon" size="sm" className="w-full flex items-center justify-between font-bold">
                  <span>AUDIT LEASE CLAUSES</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
