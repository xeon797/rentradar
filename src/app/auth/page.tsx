"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Bookmark,
  LogOut,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocketCard } from "@/components/ui/docket-card";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import { useCivicAuth, DEMO_PERSONAS } from "@/lib/auth/auth-context";
import { UserRole } from "@/types/rentradar";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";

export default function AuthPage() {
  const {
    user,
    isSupabaseLive,
    switchDemoPersona,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    savedDocketIds,
  } = useCivicAuth();

  const [mode, setMode] = React.useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("LANDLORD");
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: "error", text: "Please provide an email address." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    if (mode === "SIGN_IN") {
      const res = await signInWithEmail(email, password);
      setStatusMessage({
        type: res.ok ? "success" : "error",
        text: res.message,
      });
      if (res.ok && !password) setEmail("");
    } else {
      const res = await signUpWithEmail(email, password, fullName || "Civic Citizen", selectedRole);
      setStatusMessage({
        type: res.ok ? "success" : "error",
        text: res.message,
      });
    }

    setIsSubmitting(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setStatusMessage({ type: "error", text: "Please enter your email for Magic Link." });
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(null);
    const res = await signInWithEmail(email);
    setStatusMessage({
      type: res.ok ? "success" : "error",
      text: res.message,
    });
    setIsSubmitting(false);
  };

  // Resolve saved dockets details
  const savedPropertyListings = SEED_PROPERTIES.filter((p) =>
    savedDocketIds.includes(p.docketId)
  );

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)]">
      {/* Top Docket Banner */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.2">IDENTITY DESK</span>
              <span>// CIVIC CLEARANCE &amp; AUTHENTICATION PORTAL</span>
              <span className="text-carbon font-bold">// DUAL-MODE ACCESS</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Civic Identity &amp; Role Management
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="border border-carbon bg-paper px-3 py-1.5 flex items-center gap-2">
              <span className={`h-2 w-2 ${isSupabaseLive ? "bg-evidence-green" : "bg-radar"}`} />
              <span className="text-muted-ink">AUTH ENGINE:</span>
              <span className="font-bold text-carbon">
                {isSupabaseLive ? "SUPABASE CLOUD ACTIVE" : "LOCAL DEMO LEDGER ACTIVE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Session Dossier & Privacy Rationale (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Active Identity Dossier Card */}
            <DocketCard
              hazardStripe={false}
              shadow="default"
              docketId={user.badgeCode}
              docketTitle="ACTIVE CIVIC IDENTITY DOSSIER"
              headerAction={
                <VerificationStamp
                  tier={user.utilityBillVerified ? "VERIFIED_LANDLORD" : "PHONE_CONFIRMED"}
                  label={user.role}
                  size="sm"
                />
              }
              className="bg-surface"
            >
              <div className="space-y-4 font-mono text-xs">
                <div className="border border-carbon bg-paper p-3 space-y-1">
                  <div className="text-[10px] text-muted-ink uppercase font-bold">
                    // REGISTERED USER / AUDITOR NAME
                  </div>
                  <div className="font-display text-xl font-bold text-carbon">
                    {user.fullName}
                  </div>
                  <div className="text-muted-ink font-bangla text-xs">
                    {user.fullNameBn}
                  </div>
                </div>

                <div className="divide-y divide-carbon/20 border border-carbon bg-paper/60 text-xs">
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-ink uppercase text-[11px]">Identity Email:</span>
                    <span className="font-bold text-carbon">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-ink uppercase text-[11px]">Primary Metro Zone:</span>
                    <span className="font-bold text-carbon">{user.city} Metro</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-ink uppercase text-[11px]">Authentication Mode:</span>
                    <span className="font-bold text-carbon">
                      {user.authMode === "SUPABASE_SESSION" ? "Live Supabase Cloud Session" : "Local Demo Persona"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-ink uppercase text-[11px]">Utility Bill Clearance:</span>
                    <span className={`font-bold ${user.utilityBillVerified ? "text-evidence-green" : "text-muted-ink"}`}>
                      {user.utilityBillVerified ? "VERIFIED (DESCO/WASA MATCHED)" : "PENDING SUBMISSION"}
                    </span>
                  </div>
                </div>

                {user.authMode === "SUPABASE_SESSION" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full font-bold flex items-center justify-center gap-2 border-evidence-red text-evidence-red hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>SIGN OUT ACTIVE SUPABASE CLOUD SESSION</span>
                  </Button>
                )}
              </div>
            </DocketCard>

            {/* Zero-SMS-OTP & Municipal Proof Architecture */}
            <div className="border-2 border-carbon bg-surface p-5 shadow-docket space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-carbon uppercase border-b border-carbon pb-2">
                <Lock className="h-4 w-4 text-evidence-green" />
                <span>WHY EMAIL &amp; UTILITY BILLS INSTEAD OF PAID SMS OTP?</span>
              </div>
              <p className="font-sans text-xs text-muted-ink leading-relaxed">
                In Bangladesh, phone SIM registration does <strong>not</strong> prove property ownership. Rental syndicates routinely purchase disposable SIM cards to run advance bKash deposit scams.
              </p>
              <p className="font-sans text-xs text-muted-ink leading-relaxed">
                RentRadar anchors landlord trustworthiness to <strong>DESCO / DPDC / Jalalabad Gas utility meter statements and Municipal Holding Tax receipts</strong>, rejecting costly SMS gateways in favor of cryptographic proof.
              </p>
              <div className="border border-carbon/30 bg-paper p-2.5 text-[10px] text-muted-ink space-y-1">
                <div className="text-carbon font-bold">// CIVIC SECURITY MANDATE</div>
                <div>1. Zero monthly paid SMS gateway fee overhead</div>
                <div>2. Utility meter cadastral alignment over mobile phone numbers</div>
                <div>3. Zero personal privacy leakage to 3rd-party brokers</div>
              </div>
            </div>

            {/* Bookmarked Property Dockets */}
            <div className="border border-carbon bg-paper p-4 space-y-3 font-mono text-xs shadow-docket-sm">
              <div className="flex items-center justify-between border-b border-carbon/20 pb-1.5 font-bold text-carbon uppercase">
                <div className="flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>BOOKMARKED DOCKETS ({savedDocketIds.length})</span>
                </div>
                <Link href="/discover" className="text-muted-ink hover:text-carbon underline text-[10px]">
                  Explore Map →
                </Link>
              </div>

              {savedDocketIds.length === 0 ? (
                <div className="p-3 text-center text-muted-ink text-[11px]">
                  No dockets bookmarked yet. Click bookmark buttons on property cards or inspection reports to track them here.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {savedPropertyListings.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-surface border border-carbon/30 p-2 text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-carbon">{p.docketId}: </span>
                        <span>{p.title}</span>
                      </div>
                      <span className="font-bold text-carbon">৳{p.monthlyRentBdt.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: 1-Click Persona Override & Cloud Auth Form (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1-Click Judge Demo Persona Switcher */}
            <div className="border-2 border-carbon bg-surface p-6 shadow-docket space-y-4">
              <div className="border-b border-carbon pb-2 flex items-center justify-between font-mono text-xs">
                <div className="font-bold text-carbon uppercase">
                  // INSTANT BUILDATHON JUDGE OVERRIDE
                </div>
                <span className="bg-radar text-carbon font-bold px-1.5 py-0.2 border border-carbon text-[10px]">
                  1-CLICK
                </span>
              </div>

              <p className="font-sans text-xs text-muted-ink leading-relaxed">
                Click any persona below to instantaneously assume their identity and permissions across the entire platform:
              </p>

              <div className="space-y-3 font-mono text-xs">
                {(["TENANT", "LANDLORD", "AUDITOR"] as UserRole[]).map((r) => {
                  const p = DEMO_PERSONAS[r];
                  const isCurrent = user.role === r && user.authMode === "DEMO_PERSONA";
                  return (
                    <div
                      key={r}
                      className={`border-2 p-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? "border-carbon bg-carbon text-surface shadow-docket-sm"
                          : "border-carbon/40 bg-paper text-carbon hover:border-carbon hover:bg-surface"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-[11px]">
                            [{r}]
                          </span>
                          <span
                            className={`text-[9px] px-1 py-0.2 border ${
                              isCurrent
                                ? "bg-radar text-carbon border-radar font-bold"
                                : "bg-surface text-carbon border-carbon/40"
                            }`}
                          >
                            {p.badgeCode}
                          </span>
                        </div>
                        <div className="font-display font-bold text-sm">
                          {p.fullName}
                        </div>
                        <div className={`text-[10px] ${isCurrent ? "text-zinc-300" : "text-muted-ink"}`}>
                          {p.email} • {p.city} Metro
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant={isCurrent ? "primary" : "outline"}
                        size="sm"
                        disabled={isCurrent}
                        onClick={() => {
                          switchDemoPersona(r);
                          setStatusMessage({
                            type: "info",
                            text: `Switched identity to ${p.fullName} [${r}].`,
                          });
                        }}
                        className="font-bold text-xs shrink-0"
                      >
                        {isCurrent ? "CURRENTLY ACTIVE" : `SWITCH TO ${r} →`}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cloud Supabase Auth Form */}
            <div className="border-2 border-carbon bg-surface p-6 shadow-docket space-y-4">
              <div className="border-b border-carbon pb-2 flex items-center justify-between font-mono text-xs">
                <div className="font-bold text-carbon uppercase">
                  // SUPABASE CLOUD AUTHENTICATION
                </div>
                <span className="text-muted-ink text-[10px]">
                  {isSupabaseLive ? "LIVE CLOUD READY" : "ENV FALLBACK ACTIVE"}
                </span>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-carbon/20">
                  <span className="font-bold text-carbon">
                    {mode === "SIGN_IN" ? "ENTER CLOUD CREDENTIALS" : "REGISTER NEW CIVIC ACCOUNT"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "SIGN_IN" ? "SIGN_UP" : "SIGN_IN");
                      setStatusMessage(null);
                    }}
                    className="text-carbon underline hover:text-muted-ink text-[11px]"
                  >
                    {mode === "SIGN_IN" ? "Switch to Registration" : "Switch to Login"}
                  </button>
                </div>

                {mode === "SIGN_UP" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-ink font-bold block">
                      FULL NAME:
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arifur Rahman"
                      className="w-full border border-carbon p-2 text-carbon bg-paper focus:outline-none"
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
                    placeholder="name@domain.bd"
                    className="w-full border border-carbon p-2 text-carbon bg-paper focus:outline-none"
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
                    className="w-full border border-carbon p-2 text-carbon bg-paper focus:outline-none"
                  />
                </div>

                {mode === "SIGN_UP" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-ink font-bold block">
                      DESIRED CIVIC ROLE:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("LANDLORD")}
                        className={`p-2 border text-center font-bold text-xs ${
                          selectedRole === "LANDLORD"
                            ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                            : "bg-paper text-carbon border-carbon/40"
                        }`}
                      >
                        LANDLORD (VERIFIER)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole("TENANT")}
                        className={`p-2 border text-center font-bold text-xs ${
                          selectedRole === "TENANT"
                            ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                            : "bg-paper text-carbon border-carbon/40"
                        }`}
                      >
                        TENANT (DISCOVERY)
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="carbon"
                    size="sm"
                    disabled={isSubmitting}
                    className="flex-1 font-bold shadow-docket-sm"
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
                    <span>PASSWORDLESS MAGIC LINK</span>
                  </Button>
                </div>
              </form>

              {statusMessage && (
                <div
                  className={`p-3 border font-mono text-xs ${
                    statusMessage.type === "error"
                      ? "border-evidence-red bg-red-50 text-evidence-red font-bold"
                      : statusMessage.type === "success"
                      ? "border-evidence-green bg-emerald-50 text-evidence-green font-bold"
                      : "border-carbon bg-paper text-carbon"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
