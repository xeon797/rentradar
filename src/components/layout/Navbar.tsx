"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IdentityStatusModal } from "@/components/auth/IdentityStatusModal";
import { JudgeTourDrawer } from "@/components/layout/JudgeTourDrawer";

const NAV_LINKS = [
  { href: "/discover", label: "[01] DISCOVER" },
  {
    href: "/inspector",
    label: "[02] AI INSPECTOR",
    highlight: "HERO",
  },
  { href: "/verify", label: "[03] VERIFY & LIST" },
  { href: "/calculator", label: "[04] TRUE-COST" },
  { href: "/assistant", label: "[05] TENANT LAW" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-surface border-b-2 border-carbon">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Top-Left: Official RentRadar Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none shrink-0"
          title="RentRadar BD — Home"
        >
          <div className="relative h-9 sm:h-10 w-auto flex items-center">
            <Image
              src="/rentradar-logo.png"
              alt="RentRadar"
              width={160}
              height={36}
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </div>
        </Link>

        {/* Center: Streamlined Module Switcher (Desktop) */}
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
                        : "bg-radar/40 text-carbon border-carbon/50"
                    )}
                  >
                    {link.highlight}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Top-Right: Prominent Built for AIgnite 2026 Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center h-11 sm:h-12 border-2 border-carbon bg-white px-3 py-1 shadow-docket-sm hover:border-carbon transition-all"
            title="Official Buildathon Entry — Built for AIgnite 2026"
          >
            <Image
              src="/built-for-aignite-2026.png"
              alt="Built for AIgnite 2026"
              width={160}
              height={48}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
          </div>

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
          <div className="flex items-center justify-between pb-2 border-b border-carbon/20">
            <Image
              src="/rentradar-logo.png"
              alt="RentRadar"
              width={120}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <Image
              src="/built-for-aignite-2026.png"
              alt="Built for AIgnite 2026"
              width={100}
              height={28}
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="hazard-stripe w-full my-1" />

          <div className="flex items-center justify-between p-2 bg-paper border border-carbon/30">
            <span className="text-[10px] font-mono uppercase text-muted-ink">IDENTITY CLEARANCE:</span>
            <IdentityStatusModal />
          </div>

          <div className="flex items-center justify-between p-2 bg-radar/20 border border-carbon">
            <span className="text-[10px] font-mono uppercase font-bold text-carbon">BUILDATHON EVALUATION:</span>
            <JudgeTourDrawer />
          </div>

          <div className="text-[10px] font-mono uppercase text-muted-ink px-1 tracking-wider pt-1">
            // MODULE DIRECTORY
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

          <div className="mt-2 pt-3 border-t border-carbon/20">
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
