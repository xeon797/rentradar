"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Scan,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocketCard } from "@/components/ui/docket-card";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";
import { BD_NEIGHBORHOOD_BENCHMARKS } from "@/lib/data/bd-neighborhood-benchmarks";

// Pre-seeded Bangladesh Rental Ad Scenarios for Instant Hero Demo
type ScenarioKey = "A" | "B" | "C";

interface HeroScenario {
  key: ScenarioKey;
  tag: string;
  badgeLabel: string;
  severity: "CRITICAL" | "MODERATE" | "LOW";
  score: number;
  docketNumber: string;
  postSource: string;
  location: string;
  claimedRent: string;
  adTextRaw: string;
  adLanguage: "Bangla" | "Bangla / English" | "English";
  summary: string;
  flags: Array<{
    code: string;
    title: string;
    severity: "CRITICAL" | "MODERATE" | "LOW";
    detail: string;
    quote?: string;
  }>;
  specs: {
    beds: string;
    advance: string;
    serviceCharge: string;
    paymentTrap: string;
    dhashCollision: string;
  };
}

const SCENARIOS: Record<ScenarioKey, HeroScenario> = {
  A: {
    key: "A",
    tag: "SCENARIO A // BASHUNDHARA FAKE TO-LET",
    badgeLabel: "CRITICAL FRAUD SIGNALS",
    severity: "CRITICAL",
    score: 88,
    docketNumber: "RR-INSP-2026-088",
    postSource: "Facebook Group: বসুন্ধরা আবাসিক এলাকা ফ্ল্যাট ও সাবলেট",
    location: "Bashundhara R/A, Block C, Dhaka",
    claimedRent: "৳11,500 / month",
    adLanguage: "Bangla",
    adTextRaw:
      "জরুরী বসুন্ধরা আবাসিক এলাকায় ৩ রুমের লাক্সারি ফুল ফার্নিশড ফ্ল্যাট ভাড়া হবে মাত্র ১১,৫০০ টাকায়। সরাসরি ওনার দেশের বাইরে থাকায় কম ভাড়ায় দেওয়া হবে। বাসা দেখতে যাওয়ার পূর্বে বিকাশে ৩০০০ টাকা ভিজিটিং গেটপাস বুকিং ফি দিতে হবে। এই নম্বরে সেন্ড মানি করুন: 01712-984XXX। বুকিং ছাড়া কাউকে ঠিকানা বা ফ্ল্যাট দেখানো হবে না।",
    summary:
      "CRITICAL RISK: Advance booking fee demand via mobile money before in-person inspection. Stolen photo matches existing Gulshan luxury apartment listing.",
    flags: [
      {
        code: "FLAG_01: PRE_VISIT_BKASH_DEMAND",
        title: "Advance bKash Visiting Fee Trap",
        severity: "CRITICAL",
        detail:
          "Advertiser explicitly demands ৳3,000 personal bKash transfer as a condition to reveal exact flat address or grant building entry.",
        quote: '"বাসা দেখতে যাওয়ার পূর্বে বিকাশে ৩০০০ টাকা ভিজিটিং গেটপাস বুকিং ফি দিতে হবে"',
      },
      {
        code: "FLAG_02: DHASH_IMAGE_COLLISION",
        title: "Perceptual Photo Match: Gulshan-2 Listing",
        severity: "CRITICAL",
        detail:
          "64-bit dHash collision with Hamming distance = 1 (98.4% visual identity match) with listing RR-DHK-041 located in Gulshan-2.",
      },
      {
        code: "FLAG_03: SEVERE_PRICE_ANOMALY",
        title: "Price Anomaly: -66.2% Below Market Median",
        severity: "CRITICAL",
        detail:
          "Claimed 3BHK rent of ৳11,500/mo is statistically anomalous against the Bashundhara R/A median of ৳34,000/mo.",
      },
    ],
    specs: {
      beds: "3 BHK (Claimed Furnished)",
      advance: "৳3,000 Mobile Money First",
      serviceCharge: "Not Disclosed / Vague",
      paymentTrap: "bKash Personal Send-Money Required",
      dhashCollision: "98.4% Match (Gulshan RR-DHK-041)",
    },
  },
  B: {
    key: "B",
    tag: "SCENARIO B // SYLHET UPOSHAHAR SUBLET",
    badgeLabel: "MODERATE RISK ANOMALIES",
    severity: "MODERATE",
    score: 46,
    docketNumber: "RR-INSP-2026-042",
    postSource: "Street Signboard Photo: শাহজালাল উপশহর মেইন রোড",
    location: "Shahjalal Uposhahar, Block D, Sylhet",
    claimedRent: "৳8,500 / month",
    adLanguage: "Bangla / English",
    adTextRaw:
      "To-Let for Executive Bachelor or Small Family in Uposhahar Block D. 1 Master Bed + Attached Bath with separate entrance. Base Rent ৳8,500 only. Advance 3 months. Gas, WASA, Lift & guard service charge will be split among tenants each month dynamically.",
    summary:
      "MODERATE ANOMALIES: Unitemized floating utility clause exposes tenant to unregulated monthly bill shocks. Advance deposit requirement (3 months) exceeds standard norms.",
    flags: [
      {
        code: "FLAG_01: HIDDEN_SERVICE_TRAP",
        title: "Unmetered Utility Surcharge Exposure",
        severity: "MODERATE",
        detail:
          "Base rent of ৳8,500 excludes unitemized dynamic bill sharing. Real monthly cost projected at ৳12,000+ without individual sub-meters.",
      },
      {
        code: "FLAG_02: STATUTORY_DEPOSIT_SCRUTINY",
        title: "Advance Deposit Terms Exceed Norms",
        severity: "MODERATE",
        detail:
          "3 months cash advance requested without clear provision for statutory rent receipt as prescribed under Sec 13 of Premises Rent Control Act 1991.",
      },
    ],
    specs: {
      beds: "1 Bed Sublet Unit",
      advance: "3 Months (৳25,500 upfront)",
      serviceCharge: "Dynamic / Floating (Unitemized)",
      paymentTrap: "No Sub-meter, Shared Overhead",
      dhashCollision: "0 Collisions Detected",
    },
  },
  C: {
    key: "C",
    tag: "SCENARIO C // DHANMONDI ROAD 9 VERIFIED",
    badgeLabel: "VERIFIED STATUTORY COMPLIANT",
    severity: "LOW",
    score: 12,
    docketNumber: "RR-INSP-2026-012",
    postSource: "Landlord Direct Document Submission",
    location: "Road 9/A, Dhanmondi, Dhaka",
    claimedRent: "৳38,000 / month",
    adLanguage: "English",
    adTextRaw:
      "Dhanmondi 9/A, 1450 sqft 3-bed flat with dedicated car parking. Base Rent: ৳38,000, Fixed Service Charge: ৳5,500 (Generator, 24/7 Security, Lift). DESCO prepaid meter installed. Advance: 2 months. Formal written agreement with official rent receipts provided.",
    summary:
      "VERIFIED COMPLIANT: Validated DESCO electricity bill matching owner NID and physical premises. 0 duplicate image collisions. Terms fully comply with 1991 Rent Act.",
    flags: [
      {
        code: "EVIDENCE_01: DESCO_DOC_VERIFIED",
        title: "Prepaid Electric Meter & Deed Match",
        severity: "LOW",
        detail:
          "Owner submitted official DESCO meter account statement matching property address and cadastral plot number.",
      },
      {
        code: "EVIDENCE_02: STATUTORY_COMPLIANCE",
        title: "Advance & Service Charges Transparent",
        severity: "LOW",
        detail:
          "2 months advance strictly within Dhaka residential norms. Service charge is explicitly itemized with formal written receipts.",
      },
    ],
    specs: {
      beds: "3 Bed + 3 Bath (1450 sqft)",
      advance: "2 Months (Standard Deposit)",
      serviceCharge: "৳5,500 (Itemized Fixed)",
      paymentTrap: "None — Official Bank Transfer",
      dhashCollision: "0 Collisions (Unique Original Photos)",
    },
  },
};

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
  const [selectedScenario, setSelectedScenario] = React.useState<ScenarioKey>("A");
  const [showAllBenchmarks, setShowAllBenchmarks] = React.useState(false);
  const scenario = SCENARIOS[selectedScenario];

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

            {/* Primary Action Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

            {/* Streamlined Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-carbon bg-surface divide-y sm:divide-y-0 sm:divide-x divide-carbon shadow-docket-sm mt-8">
              <div className="p-3 space-y-1">
                <div className="font-mono text-[10px] text-muted-ink uppercase font-semibold">
                  64-BIT dHASH
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Stolen Photo Collision
                </div>
                <div className="text-[11px] font-mono text-muted-ink">
                  Catches recycled listing photos
                </div>
              </div>

              <div className="p-3 space-y-1">
                <div className="font-mono text-[10px] text-muted-ink uppercase font-semibold">
                  BILINGUAL OCR
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Multimodal Extraction
                </div>
                <div className="text-[11px] font-mono text-muted-ink">
                  Bangla &amp; English claim parsing
                </div>
              </div>

              <div className="p-3 space-y-1">
                <div className="font-mono text-[10px] text-muted-ink uppercase font-semibold">
                  1991 RENT ACT
                </div>
                <div className="font-display font-bold text-xs uppercase text-carbon leading-snug">
                  Statutory Protection
                </div>
                <div className="text-[11px] font-mono text-muted-ink font-bangla">
                  আইন অনুযায়ী অগ্রিম ও উচ্ছেদ রক্ষা
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols on lg): Interactive "Live Inspection Docket Preview" */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Clean Live Radar Header */}
            <div className="flex items-center justify-between border-2 border-carbon bg-surface p-2.5 shadow-docket-sm">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-carbon">
                <span className="h-2.5 w-2.5 bg-radar border border-carbon" />
                <span>LIVE RADAR FORENSIC PREVIEW</span>
              </div>
              <div className="font-mono text-[11px] text-muted-ink">
                <span>{SEED_PROPERTIES.length} DOCKETS INDEXED</span>
              </div>
            </div>

            {/* Interactive Scenario Switcher Header */}
            <div className="border border-carbon bg-paper p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-carbon uppercase">// SELECT JUDGE SCENARIO:</span>
                <span className="text-muted-ink text-[10px]">1-CLICK LIVE AUDIT</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                {(["A", "B", "C"] as ScenarioKey[]).map((key) => {
                  const s = SCENARIOS[key];
                  const isCurrent = selectedScenario === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedScenario(key)}
                      className={`p-2 border text-left transition-all ${
                        isCurrent
                          ? "bg-carbon text-surface border-carbon shadow-docket-sm font-bold"
                          : "bg-surface text-carbon border-carbon/40 hover:border-carbon hover:bg-paper"
                      }`}
                    >
                      <div className="text-[10px] flex items-center justify-between">
                        <span>CASE {key}</span>
                        <span
                          className={`h-2 w-2 rounded-none ${
                            s.severity === "CRITICAL"
                              ? "bg-evidence-red"
                              : s.severity === "MODERATE"
                              ? "bg-evidence-amber"
                              : "bg-evidence-green"
                          }`}
                        />
                      </div>
                      <div className="truncate text-[11px] mt-0.5">
                        {key === "A" ? "Bashundhara" : key === "B" ? "Sylhet Sublet" : "Dhanmondi"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forensic Inspection Docket Container */}
            <DocketCard
              hazardStripe={scenario.severity === "CRITICAL"}
              shadow="default"
              docketId={scenario.docketNumber}
              docketTitle={scenario.tag}
              headerAction={
                <VerificationStamp
                  riskSeverity={scenario.severity}
                  label={scenario.badgeLabel}
                  size="sm"
                />
              }
              className="bg-surface"
            >
              <div className="space-y-4">
                {/* Score & Anomaly Summary Bar */}
                <div className="flex items-center justify-between border border-carbon bg-paper p-3">
                  <div>
                    <div className="text-[10px] font-mono text-muted-ink uppercase">
                      Risk Anomaly Score
                    </div>
                    <div className="font-mono text-2xl font-bold tracking-tight text-carbon">
                      {scenario.score}
                      <span className="text-xs text-muted-ink font-normal"> / 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-muted-ink uppercase">
                      Claimed Rent
                    </div>
                    <div className="font-mono text-sm font-bold text-carbon">
                      {scenario.claimedRent}
                    </div>
                    <div className="text-[10px] font-mono text-muted-ink">
                      {scenario.location}
                    </div>
                  </div>
                </div>

                {/* Raw Claim Preview Box */}
                <div className="border border-carbon/60 bg-paper/40 p-2.5 text-xs space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-muted-ink">
                    <span className="font-bold uppercase">// CAPTURED TO-LET TEXT</span>
                    <span>{scenario.postSource.split(":")[0]}</span>
                  </div>
                  <p className="font-bilingual text-carbon leading-snug text-[11px] italic line-clamp-2">
                    &ldquo;{scenario.adTextRaw}&rdquo;
                  </p>
                </div>

                {/* Forensic Evidence Flags */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold uppercase text-carbon tracking-wider flex items-center justify-between">
                    <span>EVIDENCE FLAGS ({scenario.flags.length})</span>
                    <span className="text-[10px] text-muted-ink">DETERMINISTIC</span>
                  </div>
                  <div className="space-y-1.5">
                    {scenario.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`border p-2 text-xs font-mono transition-colors ${
                          flag.severity === "CRITICAL"
                            ? "border-evidence-red bg-red-50/70 text-carbon"
                            : flag.severity === "MODERATE"
                            ? "border-evidence-amber bg-amber-50/70 text-carbon"
                            : "border-evidence-green bg-emerald-50/70 text-carbon"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span className="truncate">{flag.title}</span>
                          <span
                            className={`text-[9px] uppercase px-1 py-0.2 border ${
                              flag.severity === "CRITICAL"
                                ? "bg-evidence-red text-surface border-evidence-red"
                                : flag.severity === "MODERATE"
                                ? "bg-evidence-amber text-surface border-evidence-amber"
                                : "bg-evidence-green text-surface border-evidence-green"
                            }`}
                          >
                            {flag.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-ink mt-0.5 font-sans leading-tight">
                          {flag.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Extraction Metadata Specs */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-carbon/20 pt-2.5">
                  <div className="bg-paper p-1.5 border border-carbon/20">
                    <span className="text-muted-ink text-[10px] block">PHOTO COLLISION:</span>
                    <span className="font-bold text-carbon truncate block">
                      {scenario.specs.dhashCollision}
                    </span>
                  </div>
                  <div className="bg-paper p-1.5 border border-carbon/20">
                    <span className="text-muted-ink text-[10px] block">PAYMENT SECURITY:</span>
                    <span className="font-bold text-carbon truncate block">
                      {scenario.specs.paymentTrap}
                    </span>
                  </div>
                </div>

                {/* Callout Link to Full Inspector */}
                <Link
                  href="/inspector"
                  className="flex items-center justify-between bg-radar text-carbon border border-carbon p-2 font-mono text-xs font-bold shadow-docket-sm hover:bg-radar-hover transition-colors"
                >
                  <span>TEST CUSTOM TO-LET SCREENSHOT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </DocketCard>
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
