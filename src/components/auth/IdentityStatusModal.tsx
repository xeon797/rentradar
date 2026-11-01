"use client";

import * as React from "react";
import Link from "next/link";
import {
  Key,
  Mail,
  CheckCircle2,
  X,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import { useCivicAuth, DEMO_PERSONAS } from "@/lib/auth/auth-context";
import { UserRole } from "@/types/rentradar";

export function IdentityStatusModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    user,
    isSupabaseLive,
    switchDemoPersona,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  } = useCivicAuth();

  // Form states
  const [mode, setMode] = React.useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("LANDLORD");
  const [authStatusMessage, setAuthStatusMessage] = React.useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthStatusMessage({ type: "error", text: "Please provide an email address." });
      return;
    }

    setIsSubmitting(true);
    setAuthStatusMessage(null);

    if (mode === "SIGN_IN") {
      const res = await signInWithEmail(email, password);
      setAuthStatusMessage({
        type: res.ok ? "success" : "error",
        text: res.message,
      });
      if (res.ok && !password) {
        setEmail("");
      }
    } else {
      const res = await signUpWithEmail(email, password, fullName || "Civic Landlord", selectedRole);
      setAuthStatusMessage({
        type: res.ok ? "success" : "error",
        text: res.message,
      });
    }

    setIsSubmitting(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setAuthStatusMessage({ type: "error", text: "Please enter your email for Magic Link." });
      return;
    }
    setIsSubmitting(true);
    setAuthStatusMessage(null);
    const res = await signInWithEmail(email);
    setAuthStatusMessage({
      type: res.ok ? "success" : "error",
      text: res.message,
    });
    setIsSubmitting(false);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "LANDLORD":
        return {
          led: "bg-evidence-green",
          text: "text-evidence-green",
          border: "border-evidence-green",
          label: "VERIFIED LANDLORD",
        };
      case "AUDITOR":
        return {
          led: "bg-evidence-amber",
          text: "text-evidence-amber",
          border: "border-evidence-amber",
          label: "EVIDENCE AUDITOR",
        };
      case "TENANT":
      default:
        return {
          led: "bg-radar",
          text: "text-carbon",
          border: "border-carbon",
          label: "PROSPECTIVE TENANT",
        };
    }
  };

  const currentStyle = getRoleBadgeStyle(user.role);

  return (
    <>
      {/* Navbar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-carbon bg-paper px-2.5 py-1 text-xs font-mono transition-all hover:bg-surface hover:shadow-docket-sm focus:outline-none select-none"
        title="Open Identity &amp; Persona Switcher"
      >
        <span className={`h-2.5 w-2.5 rounded-none shrink-0 border border-carbon ${currentStyle.led}`} />
        <div className="flex items-center gap-1.5 text-left">
          <span className="font-bold text-carbon tracking-tight">[{user.role}]</span>
          <span className="hidden md:inline text-muted-ink text-[11px] truncate max-w-[120px]">
            {user.badgeCode}
          </span>
        </div>
      </button>

      {/* Modal / Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon/60 backdrop-blur-none animate-in fade-in-0">
          <div
            className="w-full max-w-2xl border-2 border-carbon bg-surface shadow-docket flex flex-col max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Header Strip */}
            <div className="border-b-2 border-carbon bg-carbon text-surface px-4 py-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 font-bold tracking-wider">
                <span className="h-2.5 w-2.5 bg-radar border border-surface" />
                <span>CIVIC IDENTITY &amp; CLEARANCE LEDGER // DUAL-MODE AUTH</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-surface hover:text-radar focus:outline-none"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs font-mono">
              
              {/* Active Identity Summary Banner */}
              <div className="border border-carbon bg-paper p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-ink uppercase font-bold">// CURRENTLY ACTIVE</span>
                    <span className="bg-carbon text-surface px-1.5 py-0.2 text-[10px] font-bold">
                      {user.authMode === "SUPABASE_SESSION" ? "CLOUD SUPABASE SESSION" : "DEMO PERSONA"}
                    </span>
                  </div>
                  <div className="font-display font-bold text-base text-carbon">
                    {user.fullName}
                  </div>
                  <div className="text-muted-ink text-[11px]">
                    {user.email} • {user.city} Metro • Badge: <span className="text-carbon font-bold">{user.badgeCode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5">
                  <VerificationStamp
                    tier={user.utilityBillVerified ? "VERIFIED_LANDLORD" : "PHONE_CONFIRMED"}
                    label={user.role === "LANDLORD" ? "VERIFIED OWNER" : user.role === "AUDITOR" ? "BOARD AUDITOR" : "ACTIVE TENANT"}
                    size="sm"
                  />
                  {user.authMode === "SUPABASE_SESSION" && (
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="text-evidence-red hover:underline text-[11px] font-bold flex items-center gap-1 pt-1"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>SIGN OUT SESSION</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION A: 1-Click Judge Demo Persona Switcher */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-carbon pb-1.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-carbon" />
                    <span className="font-bold text-carbon uppercase text-xs">
                      1-Click Buildathon Judge Personas (Zero-Friction Testing)
                    </span>
                  </div>
                  <span className="text-muted-ink text-[10px]">NO EMAIL NEEDED</span>
                </div>

                <p className="text-muted-ink font-sans text-xs leading-relaxed">
                  Click any role below to immediately evaluate role-gated landlord verification workflows, municipal audit queues, or tenant protections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["TENANT", "LANDLORD", "AUDITOR"] as UserRole[]).map((r) => {
                    const p = DEMO_PERSONAS[r];
                    const isCurrent = user.role === r && user.authMode === "DEMO_PERSONA";
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchDemoPersona(r);
                          setAuthStatusMessage({
                            type: "info",
                            text: `Switched identity to ${p.fullName} [${r}].`,
                          });
                        }}
                        className={`text-left p-3 border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                          isCurrent
                            ? "border-carbon bg-carbon text-surface shadow-docket-sm font-bold"
                            : "border-carbon/40 bg-surface text-carbon hover:border-carbon hover:bg-paper"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              [{r}]
                            </span>
                            {isCurrent && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-radar" />
                            )}
                          </div>
                          <div className="font-display font-bold text-xs mt-1 leading-snug">
                            {p.fullName}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${isCurrent ? "text-zinc-300" : "text-muted-ink"}`}>
                            {p.city} • {p.badgeCode}
                          </div>
                        </div>

                        <div className="pt-1 border-t border-carbon/20 text-[10px]">
                          {r === "LANDLORD"
                            ? "DESCO utility doc verified"
                            : r === "AUDITOR"
                            ? "Review board clearance"
                            : "Standard discovery access"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: Live Supabase Cloud Authentication */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-carbon pb-1.5">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-carbon" />
                    <span className="font-bold text-carbon uppercase text-xs">
                      Live Cloud Authentication (Supabase Auth)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`h-2 w-2 ${isSupabaseLive ? "bg-evidence-green" : "bg-radar"}`} />
                    <span className="text-muted-ink">
                      {isSupabaseLive ? "SUPABASE CONFIGURED" : "LOCAL DEMO MODE"}
                    </span>
                  </div>
                </div>

                {!isSupabaseLive ? (
                  <div className="border border-carbon/60 bg-paper p-3 text-[11px] text-muted-ink space-y-1">
                    <div className="text-carbon font-bold">// ENVIRONMENT NOTE FOR EVALUATION</div>
                    <p className="font-sans leading-tight">
                      Supabase keys are currently in local demo fallback. You can use the 3 <strong>1-Click Personas</strong> above without any credentials, or configure <code className="bg-surface px-1 border border-carbon/30 text-carbon font-mono">NEXT_PUBLIC_SUPABASE_URL</code> in <code className="bg-surface px-1 border border-carbon/30 text-carbon font-mono">.env.local</code> for live cloud authentication.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordAuth} className="space-y-3 border border-carbon bg-paper p-4">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-carbon/20">
                      <span className="font-bold text-carbon">
                        {mode === "SIGN_IN" ? "SIGN IN TO CLOUD ACCOUNT" : "CREATE NEW ACCOUNT"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN");
                          setAuthStatusMessage(null);
                        }}
                        className="text-carbon underline hover:text-muted-ink text-[11px]"
                      >
                        {mode === "SIGN_IN" ? "Switch to Sign Up" : "Switch to Sign In"}
                      </button>
                    </div>

                    {mode === "SIGN_UP" && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-ink font-bold block">
                          FULL NAME / ORGANIZATION:
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Engr. Kamal Uddin"
                          className="w-full border border-carbon p-2 text-carbon bg-surface focus:outline-none"
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-ink font-bold block">
                        EMAIL ADDRESS:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@domain.com"
                        className="w-full border border-carbon p-2 text-carbon bg-surface focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-ink font-bold block">
                        PASSWORD:
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full border border-carbon p-2 text-carbon bg-surface focus:outline-none"
                      />
                    </div>

                    {mode === "SIGN_UP" && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-ink font-bold block">
                          CIVIC ROLE:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRole("LANDLORD")}
                            className={`p-1.5 border text-center font-bold text-[10px] ${
                              selectedRole === "LANDLORD"
                                ? "bg-carbon text-surface border-carbon"
                                : "bg-surface text-carbon border-carbon/40"
                            }`}
                          >
                            LANDLORD (VERIFIER)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRole("TENANT")}
                            className={`p-1.5 border text-center font-bold text-[10px] ${
                              selectedRole === "TENANT"
                                ? "bg-carbon text-surface border-carbon"
                                : "bg-surface text-carbon border-carbon/40"
                            }`}
                          >
                            TENANT (DISCOVERY)
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <Button
                        type="submit"
                        variant="carbon"
                        size="sm"
                        disabled={isSubmitting}
                        className="flex-1 font-bold"
                      >
                        {mode === "SIGN_IN" ? "SIGN IN (PASSWORD)" : "REGISTER ACCOUNT"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={handleMagicLink}
                        className="flex-1 font-bold flex items-center justify-center gap-1.5"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>SEND MAGIC LINK</span>
                      </Button>
                    </div>
                  </form>
                )}

                {/* Status Message Box */}
                {authStatusMessage && (
                  <div
                    className={`p-2.5 border text-[11px] leading-tight ${
                      authStatusMessage.type === "error"
                        ? "border-evidence-red bg-red-50 text-evidence-red font-bold"
                        : authStatusMessage.type === "success"
                        ? "border-evidence-green bg-emerald-50 text-evidence-green font-bold"
                        : "border-carbon bg-paper text-carbon"
                    }`}
                  >
                    {authStatusMessage.text}
                  </div>
                )}

                {/* Link to Dedicated Portal */}
                <div className="flex items-center justify-between pt-2 border-t border-carbon/20 text-[11px]">
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="text-carbon font-bold hover:underline flex items-center gap-1"
                  >
                    <span>OPEN FULL CIVIC IDENTITY PORTAL PAGE</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-muted-ink hover:text-carbon font-mono"
                  >
                    [ CLOSE LEDGER ]
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
