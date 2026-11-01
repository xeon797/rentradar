"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IdentityStatusModal } from "@/components/auth/IdentityStatusModal";
import { JudgeTourDrawer } from "@/components/layout/JudgeTourDrawer";

const NAV_LINKS = [
  { href: "/discover", label: "[01] DISCOVER", desc: "Interactive Map & NL Search" },
  {
    href: "/inspector",
    label: "[02] AI INSPECTOR",
    desc: "Multimodal Gemini + dHash",
    highlight: "HERO DEMO",
  },
  { href: "/verify", label: "[03] VERIFY & LIST", desc: "Utility Bill Proof Audit" },
  { href: "/calculator", label: "[04] TRUE-COST CALC", desc: "Move-In & Utility Exposure" },
  { href: "/assistant", label: "[05] TENANT LAW", desc: "1991 Rent Control Guard" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-surface border-b-2 border-carbon">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left Brand Block */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center bg-radar border border-carbon shadow-docket-sm transition-transform group-hover:scale-105">
            <Radar className="h-5 w-5 text-carbon animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-carbon uppercase">
              RentRadar
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-muted-ink border border-carbon/30 bg-paper px-1 py-0.2">
              BD // v1.0
            </span>
          </div>
        </Link>

        {/* Center Module Switcher (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[11px] xl:text-xs font-semibold tracking-wide transition-colors border",
                  isActive
                    ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                    : "text-carbon border-transparent hover:border-carbon/30 hover:bg-paper"
                )}
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span
                    className={cn(
                      "text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 border",
                      isActive
                        ? "bg-radar text-carbon border-radar"
                        : "bg-radar/30 text-carbon border-carbon/60"
                    )}
                  >
                    {link.highlight}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action & Telemetry Strip */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live System Telemetry Badge */}
          <div className="hidden xl:flex items-center gap-1.5 border border-carbon/40 bg-paper px-2.5 py-1 text-[11px] font-mono text-carbon">
            <span className="h-2 w-2 rounded-none bg-evidence-green animate-ping" />
            <span className="font-bold">ENGINE:</span>
            <span className="text-muted-ink">GEMINI MULTIMODAL + dHASH</span>
          </div>

          {/* Interactive Identity & Persona Switcher */}
          <IdentityStatusModal />

          {/* Interactive Judge 2-Minute Proof HUD */}
          <JudgeTourDrawer />

          {/* Primary CTA */}
          <Link href="/inspector" className="hidden sm:inline-flex">
            <Button
              variant="primary"
              size="sm"
              className="font-mono text-xs flex items-center gap-1 tracking-normal font-bold"
            >
              <span>INSPECT AD</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center border border-carbon bg-surface p-1.5 text-carbon lg:hidden hover:bg-paper active:bg-grid-line"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-surface border-b-2 border-carbon shadow-docket p-4 z-50 flex flex-col gap-2 bg-paper/95 backdrop-none">
          <div className="hazard-stripe w-full mb-2" />
          <div className="flex items-center justify-between p-2 bg-paper border border-carbon/30">
            <span className="text-[10px] font-mono uppercase text-muted-ink">IDENTITY CLEARANCE:</span>
            <IdentityStatusModal />
          </div>
          <div className="flex items-center justify-between p-2 bg-radar/20 border border-carbon">
            <span className="text-[10px] font-mono uppercase font-bold text-carbon">BUILDATHON EVALUATION:</span>
            <JudgeTourDrawer />
          </div>
          <div className="text-[10px] font-mono uppercase text-muted-ink px-1 tracking-wider">
            // CIVIC PLATFORM MODULE DIRECTORY
          </div>
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2.5 font-mono text-xs border transition-all",
                    isActive
                      ? "bg-carbon text-surface border-carbon shadow-docket-sm font-bold"
                      : "bg-surface text-carbon border-carbon/30 hover:border-carbon hover:bg-paper"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="bg-radar text-carbon font-bold text-[9px] px-1 py-0.2 border border-carbon">
                        {link.highlight}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-3 border-t border-carbon/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-ink px-1">
              <span>ACTIVE ENGINE</span>
              <span className="font-bold text-carbon">GEMINI 2.5 + 64-BIT dHASH</span>
            </div>
            <Link
              href="/inspector"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full justify-center">
                LAUNCH AD INSPECTOR →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
