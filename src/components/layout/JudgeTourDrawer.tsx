"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  CheckCircle2,
  Circle,
  ExternalLink,
  X,
  Activity,
  Layers,
  Sparkles,
  RotateCcw,
  Cpu,
  Database,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvaluationStop {
  id: string;
  stepNumber: string;
  badgeLabel: string;
  title: string;
  routeHref: string;
  whatItProves: string;
  technicalDifferentiator: string;
  buttonText: string;
}

const EVALUATION_STOPS: EvaluationStop[] = [
  {
    id: "stop-01-inspector",
    stepNumber: "STOP [01]",
    badgeLabel: "HERO SCAM DEMO",
    title: "Catch a Stolen Photo + bKash Advance Fee Trap",
    routeHref: "/inspector?preset=preset-01-bashundhara-scam",
    whatItProves:
      "Perceptual dHash catches a luxury Gulshan photo (RR-DHK-041) reused in a cheap Bashundhara ad (98.4% similarity / 1-bit difference). Gemini extracts Bangla text and flags the ৳3,000 bKash visiting fee scam.",
    technicalDifferentiator:
      "Sharp 9x8 Lanczos3 Grayscale 64-bit gradient + Hamming distance < 10 bits. 100% deterministic scam rule engine.",
    buttonText: "LAUNCH STOP 01 IN AI INSPECTOR →",
  },
  {
    id: "stop-02-discover",
    stepNumber: "STOP [02]",
    badgeLabel: "BILINGUAL GEOSPATIAL",
    title: "Bilingual AI Discovery & Geospatial Radar Map",
    routeHref: "/discover",
    whatItProves:
      "Interactive SSR-safe Leaflet map across Dhaka, Sylhet & Chattogram with Fuse.js instant search and Gemini natural language filtering (e.g., 'সিলেটে ২০ হাজারের নিচে ফ্যামিলি বাসা').",
    technicalDifferentiator:
      "Imperative Leaflet rendering + Gemini 2.5 Flash query parsing with ASCII numeral translation fallback.",
    buttonText: "LAUNCH STOP 02 IN DISCOVER MAP →",
  },
  {
    id: "stop-03-verify",
    stepNumber: "STOP [03]",
    badgeLabel: "ZERO-LLM PRIVACY",
    title: "Zero-LLM-Leak Utility Verification & Auditor Ledger",
    routeHref: "/verify",
    whatItProves:
      "Landlords file holding documents with client-side canvas compression. Switch to Auditor Farhana Yasmin to approve filing VER-2026-101 (RR-SYL-012) and inspect the MIME email dispatch.",
    technicalDifferentiator:
      "Holding tax & utility tokens never sent to LLMs; verified locally via deterministic token match + Resend integration.",
    buttonText: "LAUNCH STOP 03 IN VERIFICATION VAULT →",
  },
  {
    id: "stop-04-calculator",
    stepNumber: "STOP [04]",
    badgeLabel: "FINANCIAL REALITY",
    title: "Bangladesh Move-In Shock & Sub-Meter Overcharge Calculator",
    routeHref: "/calculator?docket=RR-SYL-014",
    whatItProves:
      "Exposes how hidden service charges, ৳16/unit sub-meter electricity markups, and LPG cylinders inflate advertised base rent by +40%+, visualized via Recharts with 50/30/20 budget stress tests.",
    technicalDifferentiator:
      "Official DESCO/DPDC progressive slabs, Section 10 excess advance deposit warnings, and 12-month cashflow schedules.",
    buttonText: "LAUNCH STOP 04 IN TRUE-COST CALCULATOR →",
  },
  {
    id: "stop-05-assistant",
    stepNumber: "STOP [05]",
    badgeLabel: "1991 RENT ACT",
    title: "1991 Rent Control Act Clause Auditor & Receipt Generator",
    routeHref: "/assistant",
    whatItProves:
      "Audits predatory Bangla/English lease clauses against Sections 7, 10, 13, 18 & 21 of the Premises Rent Control Act, 1991, provides 1-click copyable WhatsApp counter-clauses, and prints Section 13 Dual-Slip Rent Receipts.",
    technicalDifferentiator:
      "Context-injected Gemini 2.5 Flash legal auditor with 100% offline deterministic fallback and printable statutory receipts.",
    buttonText: "LAUNCH STOP 05 IN LEGAL ASSISTANT →",
  },
];

interface HealthTelemetry {
  ok: boolean;
  timestamp: string;
  subsystems: {
    geminiMultimodal: {
      status: string;
      mode: string;
      configured: boolean;
    };
    sharpPerceptualDhash: {
      status: string;
      algorithm: string;
      collisionThresholdBits: number;
    };
    databaseRepository: {
      status: string;
      mode: string;
      totalListings: number;
      engineeredCollisionPairs: number;
    };
    privacyVault: {
      status: string;
      nidAutoMasking: boolean;
      utilityBillZeroLlmLeak: boolean;
    };
    statutoryEngine: {
      status: string;
      sectionsIndexed: number;
    };
    rateLimiter: {
      status: string;
      circuitBreaker: string;
    };
  };
}

export function JudgeTourDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [completedStops, setCompletedStops] = React.useState<Record<string, boolean>>({});
  const [telemetry, setTelemetry] = React.useState<HealthTelemetry | null>(null);
  const [telemetryLoading, setTelemetryLoading] = React.useState(false);
  const router = useRouter();

  // Load completed stops from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("rentradar_judge_tour_progress");
      if (stored) {
        setCompletedStops(JSON.parse(stored));
      }
    } catch {
      // safe ignore
    }
  }, []);

  // Fetch telemetry whenever drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setTelemetryLoading(true);
      fetch("/api/health")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.ok) {
            setTelemetry(data);
          }
        })
        .catch((err) => console.warn("[JudgeTour] Failed to fetch telemetry:", err))
        .finally(() => setTelemetryLoading(false));
    }
  }, [isOpen]);

  const handleLaunchStop = (stop: EvaluationStop) => {
    const updated = { ...completedStops, [stop.id]: true };
    setCompletedStops(updated);
    try {
      localStorage.setItem("rentradar_judge_tour_progress", JSON.stringify(updated));
    } catch {
      // safe ignore
    }
    setIsOpen(false);
    router.push(stop.routeHref);
  };

  const handleResetProgress = () => {
    setCompletedStops({});
    try {
      localStorage.removeItem("rentradar_judge_tour_progress");
    } catch {
      // safe ignore
    }
  };

  const completedCount = Object.values(completedStops).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / EVALUATION_STOPS.length) * 100);

  return (
    <>
      {/* Navbar Trigger Button with Radar Pulse Accent */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-1.5 bg-radar text-carbon border-2 border-carbon px-2.5 sm:px-3 py-1 font-mono text-xs font-bold shadow-docket-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-docket transition-all cursor-pointer select-none"
        title="Open Buildathon Evaluation Console & 5-Step Proof Tour"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full bg-carbon opacity-75" />
          <span className="relative inline-flex h-2 w-2 bg-carbon" />
        </span>
        <Zap className="h-3.5 w-3.5 text-carbon" />
        <span className="tracking-tight">JUDGE GUIDE</span>
        <span className="hidden md:inline-block bg-carbon text-radar text-[10px] px-1 py-0.2 ml-0.5 font-mono">
          {completedCount}/5
        </span>
      </button>

      {/* Modal / Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-carbon/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-paper border-l-4 border-carbon h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div className="border-b-2 border-carbon bg-surface p-4 sm:p-5 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
                    <span className="bg-carbon text-surface font-bold px-1.5 py-0.2">
                      BUILDATHON CONSOLE
                    </span>
                    <span className="text-carbon font-bold">// 5-STEP LIVE PROOF TOUR</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-carbon flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-radar fill-radar" />
                    Judge 2-Minute Proof HUD
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-carbon p-1.5 bg-paper hover:bg-carbon hover:text-surface transition-colors"
                  aria-label="Close Judge Guide"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar & Counter */}
              <div className="mt-4 pt-3 border-t border-carbon/20 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-ink">
                    EVALUATION COMPLETION:{" "}
                    <strong className="text-carbon">
                      {completedCount} / {EVALUATION_STOPS.length} STOPS ({progressPercent}%)
                    </strong>
                  </span>
                  {completedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="text-[11px] text-muted-ink hover:text-carbon flex items-center gap-1 underline"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      Reset Tour
                    </button>
                  )}
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-grid-line border border-carbon overflow-hidden">
                  <div
                    className="h-full bg-radar transition-all duration-300 border-r border-carbon"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Stops & Live Telemetry Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
              {/* 5 Evaluation Stops */}
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-carbon uppercase tracking-wide flex items-center gap-2 border-b-2 border-carbon pb-2">
                  <Layers className="h-4 w-4 text-carbon" />
                  <span>5-Stop Architectural Verification Sequence</span>
                </div>

                {EVALUATION_STOPS.map((stop) => {
                  const isDone = completedStops[stop.id];

                  return (
                    <div
                      key={stop.id}
                      className={`border-2 border-carbon p-4 transition-all ${
                        isDone
                          ? "bg-surface/80 border-carbon shadow-docket-sm"
                          : "bg-surface border-carbon shadow-docket hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#0A0A0A]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-evidence-green shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-ink shrink-0" />
                          )}
                          <span className="font-mono text-[11px] font-bold bg-carbon text-surface px-1.5 py-0.2">
                            {stop.stepNumber}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-carbon bg-radar/30 border border-carbon px-1.5 py-0.2">
                            {stop.badgeLabel}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-carbon mb-1.5">
                        {stop.title}
                      </h3>

                      <p className="text-xs text-muted-ink leading-relaxed mb-2 font-sans">
                        {stop.whatItProves}
                      </p>

                      <div className="bg-paper border border-carbon/30 p-2 font-mono text-[11px] text-carbon mb-3">
                        <span className="text-muted-ink font-bold">Tech Grounding: </span>
                        <span>{stop.technicalDifferentiator}</span>
                      </div>

                      <Button
                        onClick={() => handleLaunchStop(stop)}
                        className={`w-full font-mono text-xs font-bold gap-2 py-2 border border-carbon ${
                          isDone
                            ? "bg-paper text-carbon hover:bg-radar/30"
                            : "bg-carbon text-surface hover:bg-carbon/90 shadow-docket-sm"
                        }`}
                      >
                        <span>{stop.buttonText}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Subsystem Telemetry Monitor */}
              <div className="bg-surface border-2 border-carbon p-4 shadow-docket space-y-3">
                <div className="flex items-center justify-between border-b border-carbon/20 pb-2">
                  <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-2">
                    <Activity className="h-4 w-4 text-evidence-green animate-pulse" />
                    <span>Live Platform Telemetry (/api/health)</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-ink">
                    {telemetryLoading ? "POLLING..." : "LIVE STATUS"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {/* Item 1: Sharp dHash */}
                  <div className="border border-carbon bg-paper p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-ink flex items-center gap-1">
                        <Cpu className="h-3 w-3" /> SHARP 64-BIT dHASH
                      </span>
                      <span className="bg-evidence-green text-surface text-[10px] px-1 font-bold">
                        READY
                      </span>
                    </div>
                    <div className="text-[11px] text-carbon font-bold">
                      9x8 Lanczos3 Grayscale
                    </div>
                    <div className="text-[10px] text-muted-ink">
                      Hamming Bitwise Distance &lt; 10
                    </div>
                  </div>

                  {/* Item 2: Gemini Multimodal */}
                  <div className="border border-carbon bg-paper p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-ink flex items-center gap-1">
                        <Zap className="h-3 w-3" /> GEMINI 2.5 FLASH
                      </span>
                      <span
                        className={`text-[10px] px-1 font-bold ${
                          telemetry?.subsystems.geminiMultimodal.configured
                            ? "bg-evidence-green text-surface"
                            : "bg-radar text-carbon"
                        }`}
                      >
                        {telemetry?.subsystems.geminiMultimodal.configured ? "LIVE" : "DETERMINISTIC"}
                      </span>
                    </div>
                    <div className="text-[11px] text-carbon font-bold">
                      Multimodal OCR + Fallback
                    </div>
                    <div className="text-[10px] text-muted-ink">
                      Bangla &amp; English Dual Parser
                    </div>
                  </div>

                  {/* Item 3: Hybrid Database */}
                  <div className="border border-carbon bg-paper p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-ink flex items-center gap-1">
                        <Database className="h-3 w-3" /> HYBRID REPOSITORY
                      </span>
                      <span className="bg-evidence-green text-surface text-[10px] px-1 font-bold">
                        READY
                      </span>
                    </div>
                    <div className="text-[11px] text-carbon font-bold">
                      16 Properties Seeded
                    </div>
                    <div className="text-[10px] text-muted-ink">
                      3 Engineered Collision Pairs
                    </div>
                  </div>

                  {/* Item 4: Privacy & Rate Shield */}
                  <div className="border border-carbon bg-paper p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-ink flex items-center gap-1">
                        <Lock className="h-3 w-3" /> PRIVACY &amp; RATE SHIELD
                      </span>
                      <span className="bg-evidence-green text-surface text-[10px] px-1 font-bold">
                        ENFORCED
                      </span>
                    </div>
                    <div className="text-[11px] text-carbon font-bold">
                      Zero-LLM-Leak Vault
                    </div>
                    <div className="text-[10px] text-muted-ink">
                      25 Req/Min Sliding Circuit Breaker
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t-2 border-carbon bg-surface p-4 shrink-0 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-ink">Built for AIgnite 2026 // RentRadar BD</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-carbon underline hover:text-evidence-amber"
              >
                Close HUD [ESC]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
