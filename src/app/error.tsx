"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[RentRadar System Error Caught]:", error);
  }, [error]);

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-surface border-4 border-carbon p-6 sm:p-10 shadow-docket space-y-6">
        {/* Docket Header */}
        <div className="border-b-2 border-carbon pb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-evidence-red text-surface font-bold px-1.5 py-0.2">
                CRITICAL INTERRUPT
              </span>
              <span className="text-carbon font-bold">// SYSTEM_INTERRUPTION_RECOVERY</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Civic Pipeline Interrupted
            </h1>
          </div>

          <div className="border-2 border-carbon bg-evidence-red text-surface px-3 py-1 font-mono text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-docket-sm">
            <AlertOctagon className="h-4 w-4" />
            <span>INTERRUPT</span>
          </div>
        </div>

        {/* Hazard Stripe */}
        <div className="hazard-stripe w-full h-3" />

        {/* Forensic Body Text */}
        <div className="space-y-3 font-mono text-xs text-carbon leading-relaxed">
          <p>
            An unexpected runtime interruption occurred while processing civic telemetry or rendering rental docket data. The circuit breaker prevented cascading state corruption.
          </p>

          <div className="bg-paper border border-carbon p-3 space-y-1 text-muted-ink">
            <div>
              <strong className="text-carbon">ERROR DIGEST:</strong>{" "}
              {error.digest || "ERR-CIVIC-RUNTIME-HALT"}
            </div>
            <div>
              <strong className="text-carbon">INCIDENT MESSAGE:</strong>{" "}
              {error.message || "Unspecified client pipeline interruption."}
            </div>
            <div>
              <strong className="text-carbon">FAIL-SAFE:</strong> Deterministic repositories and local seed ledgers remain intact.
            </div>
          </div>
        </div>

        {/* Action Directives */}
        <div className="pt-2 border-t border-carbon/20 flex flex-wrap gap-3">
          <Button
            onClick={() => reset()}
            className="bg-carbon text-surface hover:bg-carbon/90 font-mono text-xs font-bold gap-2 shadow-docket-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-radar" />
            <span>RETRY SYSTEM EXECUTION</span>
          </Button>

          <Link href="/">
            <Button variant="outline" className="font-mono text-xs font-bold gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>RETURN TO DASHBOARD</span>
            </Button>
          </Link>
        </div>

        {/* Docket Footer */}
        <div className="pt-2 border-t border-carbon/10 flex items-center justify-between font-mono text-[10px] text-muted-ink">
          <span>RentRadar BD // Circuit Breaker Active</span>
          <span>Zero-LLM-Leak Vault: SECURE</span>
        </div>
      </div>
    </div>
  );
}
