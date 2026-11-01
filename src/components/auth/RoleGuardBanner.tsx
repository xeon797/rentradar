"use client";

import * as React from "react";
import { ShieldAlert, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCivicAuth, DEMO_PERSONAS } from "@/lib/auth/auth-context";
import { UserRole } from "@/types/rentradar";

interface RoleGuardBannerProps {
  requiredRoles: UserRole[];
  moduleTitle: string;
  description: string;
  actionCta?: string;
  onClearanceGrantedAction?: () => void;
}

export function RoleGuardBanner({
  requiredRoles,
  moduleTitle,
  description,
  actionCta,
  onClearanceGrantedAction,
}: RoleGuardBannerProps) {
  const { user, switchDemoPersona } = useCivicAuth();
  const hasClearance = requiredRoles.includes(user.role);

  // If user has clearance, render authoritative approval strip
  if (hasClearance) {
    return (
      <div className="border-2 border-carbon bg-emerald-50 p-3 sm:p-4 shadow-docket-sm font-mono text-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-evidence-green border border-carbon shrink-0" />
            <span className="font-bold text-carbon uppercase tracking-wider">
              CIVIC CLEARANCE GRANTED // {moduleTitle.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-muted-ink">ACTIVE IDENTITY:</span>
            <span className="font-bold text-carbon bg-surface border border-carbon px-1.5 py-0.2">
              {user.fullName} [{user.role}]
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-carbon/20 pt-2 text-[11px]">
          <p className="text-muted-ink font-sans">
            You hold verified authorization for this municipal review desk. (Badge: <span className="font-mono font-bold text-carbon">{user.badgeCode}</span>)
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => switchDemoPersona("TENANT")}
              className="text-muted-ink hover:text-carbon underline text-[10px]"
            >
              [ Test As Tenant ]
            </button>
            {onClearanceGrantedAction && actionCta && (
              <Button
                variant="carbon"
                size="sm"
                onClick={onClearanceGrantedAction}
                className="font-mono text-xs font-bold"
              >
                {actionCta}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If user lacks clearance, show zero-friction 1-click clearance switcher
  const primaryRequiredRole = requiredRoles[0];
  const targetPersona = DEMO_PERSONAS[primaryRequiredRole];

  return (
    <div className="border-2 border-carbon bg-surface shadow-docket font-mono text-xs overflow-hidden">
      <div className="hazard-stripe w-full" />
      <div className="p-4 sm:p-5 space-y-3 bg-amber-50/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-carbon/30 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-evidence-amber" />
            <span className="font-bold text-carbon uppercase tracking-wide">
              ROLE CLEARANCE REQUIRED // {moduleTitle.toUpperCase()}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-ink">
            <span>CURRENT IDENTITY:</span>
            <span className="font-bold text-carbon bg-paper border border-carbon px-1.5 py-0.2">
              {user.fullName} [{user.role}]
            </span>
          </div>
        </div>

        <p className="font-sans text-xs text-carbon leading-relaxed">
          {description} This action is restricted to verified <strong>{requiredRoles.join(" or ")}</strong> accounts.
        </p>

        {/* 1-Click Persona Clearance Switcher */}
        <div className="border border-carbon bg-surface p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-carbon uppercase">// INSTANT JUDGE DEMO OVERRIDE:</span>
            <span className="text-evidence-green font-bold text-[10px]">ZERO REGISTRATION FRICTION</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[11px] font-sans text-muted-ink">
              Switch directly to <strong>{targetPersona.fullName}</strong> ({primaryRequiredRole} persona with pre-validated utility docs).
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => switchDemoPersona(primaryRequiredRole)}
              className="font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-docket-sm shrink-0"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>SWITCH TO {primaryRequiredRole} ({targetPersona.fullName}) →</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
