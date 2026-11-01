import Link from "next/link";
import { AlertTriangle, Compass, Radar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-surface border-4 border-carbon p-6 sm:p-10 shadow-docket space-y-6">
        {/* Docket Header */}
        <div className="border-b-2 border-carbon pb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.2">
                CIVIC EXCEPTION
              </span>
              <span className="text-carbon font-bold">// DOCKET_404_NOT_FOUND</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Unregistered Docket Path
            </h1>
          </div>

          <div className="border-2 border-carbon bg-radar/30 px-3 py-1 font-mono text-xs font-bold text-carbon shrink-0 flex items-center gap-1.5 shadow-docket-sm">
            <AlertTriangle className="h-4 w-4 text-carbon" />
            <span>404 VOID</span>
          </div>
        </div>

        {/* Hazard Stripe */}
        <div className="hazard-stripe w-full h-3" />

        {/* Forensic Body Text */}
        <div className="space-y-3 font-mono text-xs text-carbon leading-relaxed">
          <p>
            The requested municipal path, property docket reference, or inspection dossier could not be located in the active RentRadar registry across Dhaka, Sylhet, or Chattogram.
          </p>
          <div className="bg-paper border border-carbon p-3 space-y-1 text-muted-ink">
            <div><strong className="text-carbon">STATUS CODE:</strong> HTTP_404_RECORD_UNRESOLVED</div>
            <div><strong className="text-carbon">SYSTEM MEMO:</strong> Route is neither an indexed property docket nor an authorized statutory endpoint.</div>
            <div><strong className="text-carbon">SAFEGUARD:</strong> Privacy Vault and Forensic Ledgers remain fully intact.</div>
          </div>
        </div>

        {/* Action Directives */}
        <div className="pt-2 border-t border-carbon/20 flex flex-wrap gap-3">
          <Link href="/">
            <Button className="bg-carbon text-surface hover:bg-carbon/90 font-mono text-xs font-bold gap-2 shadow-docket-sm">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>RETURN TO DASHBOARD</span>
            </Button>
          </Link>

          <Link href="/discover">
            <Button variant="outline" className="font-mono text-xs font-bold gap-2">
              <Compass className="h-3.5 w-3.5" />
              <span>GEOSPATIAL RADAR</span>
            </Button>
          </Link>

          <Link href="/inspector">
            <Button variant="outline" className="font-mono text-xs font-bold gap-2">
              <Radar className="h-3.5 w-3.5" />
              <span>AI SCAM INSPECTOR</span>
            </Button>
          </Link>
        </div>

        {/* Docket Footer */}
        <div className="pt-2 border-t border-carbon/10 flex items-center justify-between font-mono text-[10px] text-muted-ink">
          <span>RentRadar BD // Civic Intelligence System</span>
          <span>Security Clearance: ENFORCED</span>
        </div>
      </div>
    </div>
  );
}
