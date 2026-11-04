"use client";

import * as React from "react";
import {
  Scale,
  Shield,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  Printer,
  HelpCircle,
  CheckCircle2,
  Send,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PREMISES_RENT_CONTROL_ACT_1991_SECTIONS,
  SAMPLE_LEASE_AUDIT_PRESETS,
  SampleLeaseAuditPreset,
  LeaseAuditResult,
  TenantQAResult,
  auditLeaseAgreementDeterministically,
  answerTenantQuestionDeterministically,
} from "@/lib/legal/bd-rent-act-1991";

const QUICK_QUESTIONS = [
  {
    label: "ভাড়ার রশিদ না দিলে করণীয় কী?",
    query: "বাড়িওয়ালা ভাড়ার রশিদ না দিলে আইন অনুযায়ী করণীয় কী?",
  },
  {
    label: "Can landlord cut off water or electricity?",
    query: "Can a landlord cut off water or electricity during a dispute under Section 21?",
  },
  {
    label: "What is legal advance limit under Sec 10?",
    query: "What is the legal limit on advance rent under Section 10 of the Premises Rent Control Act?",
  },
  {
    label: "How to challenge unfair ৳16/unit sub-meter?",
    query: "How do I challenge an unfair ৳16/unit landlord sub-meter rate under BERC rules?",
  },
  {
    label: "২৪ ঘণ্টার নোটিশে কি উচ্ছেদ করা যায়?",
    query: "বাড়িওয়ালা কি আমাকে ২৪ ঘণ্টার মৌখিক নোটিশে বাসা থেকে উচ্ছেদ করতে পারেন?",
  },
  {
    label: "বাড়িওয়ালা কি ৬ মাস পর পর ভাড়া বাড়াতে পারেন?",
    query: "ধারা ৭ অনুযায়ী বাড়িওয়ালা কি ৬ মাস বা ১ বছর পর পর ভাড়া বাড়াতে পারেন?",
  },
];

export default function AssistantPage() {
  const [activeTab, setActiveTab] = React.useState<"AUDITOR" | "QA" | "STATUTES_RECEIPT">("AUDITOR");

  // Tab 1: Lease Auditor State
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>("preset-a-predatory-dhaka");
  const [leaseInputText, setLeaseInputText] = React.useState<string>(
    SAMPLE_LEASE_AUDIT_PRESETS[0].leaseText
  );
  const [isAuditing, setIsAuditing] = React.useState<boolean>(false);
  const [auditResult, setAuditResult] = React.useState<LeaseAuditResult | null>(() =>
    auditLeaseAgreementDeterministically(SAMPLE_LEASE_AUDIT_PRESETS[0].leaseText)
  );
  const [auditSource, setAuditSource] = React.useState<string>("DETERMINISTIC_STATUTORY_ENGINE");

  // Tab 2: Legal Q&A State
  const [qaInput, setQaInput] = React.useState<string>("");
  const [isAnswering, setIsAnswering] = React.useState<boolean>(false);
  const [qaResult, setQaResult] = React.useState<TenantQAResult | null>(() =>
    answerTenantQuestionDeterministically(QUICK_QUESTIONS[0].query)
  );
  const [qaSource, setQaSource] = React.useState<string>("DETERMINISTIC_STATUTORY_ENGINE");

  // Tab 3: Receipt Form State
  const [receiptData, setReceiptData] = React.useState({
    receiptNumber: "RR-REC-2026-084",
    tenantName: "মোহাম্মদ রফিকুল ইসলাম (Md. Rafiqul Islam)",
    landlordName: "হাজী এ. কে. এম. সামসুল হক (Haji A.K.M. Shamsul Haque)",
    premisesAddress: "ফ্ল্যাট ৪-বি, বাড়ি #১২, রোড #৯/এ, ধানমন্ডি আ/এ, ঢাকা-১২০৯",
    rentalMonthYear: "মার্চ ২০২৬ (March 2026)",
    paymentDate: "২০২৬-০৩-০৫",
    baseRentBdt: 35000,
    electricityBdt: 2800,
    gasBdt: 1080,
    waterBdt: 1200,
    serviceChargeBdt: 4500,
    advanceAdjustmentBdt: 0,
    paymentMethod: "Bank Transfer / BEFTN (City Bank A/C ...882)",
    notes: "ধার্যকৃত সময়ের মধ্যে সকল বকেয়া পরিশোধিত হইয়াছে। ধারা ১৩ অনুসারে সংগৃহীত।",
  });

  // Copied toast state
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Run Lease Audit
  const handleRunAudit = async (presetIdToUse?: string, textToUse?: string) => {
    const text = textToUse !== undefined ? textToUse : leaseInputText;
    const presetId = presetIdToUse !== undefined ? presetIdToUse : selectedPresetId;
    if (!text.trim()) return;

    setIsAuditing(true);
    try {
      const res = await fetch("/api/assistant/legal-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "LEASE_AUDIT",
          text,
          presetId,
        }),
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setAuditResult(data.data);
        setAuditSource(data.source || "GEMINI_2_5_FLASH");
      } else {
        // Fallback locally
        setAuditResult(auditLeaseAgreementDeterministically(text));
        setAuditSource("DETERMINISTIC_STATUTORY_ENGINE_FALLBACK");
      }
    } catch {
      setAuditResult(auditLeaseAgreementDeterministically(text));
      setAuditSource("DETERMINISTIC_STATUTORY_ENGINE_FALLBACK");
    } finally {
      setIsAuditing(false);
    }
  };

  // Switch Preset
  const handleSelectPreset = (preset: SampleLeaseAuditPreset) => {
    setSelectedPresetId(preset.id);
    setLeaseInputText(preset.leaseText);
    handleRunAudit(preset.id, preset.leaseText);
  };

  // Run Legal QA
  const handleRunQA = async (queryText?: string) => {
    const target = (queryText !== undefined ? queryText : qaInput).trim();
    if (!target) return;

    setIsAnswering(true);
    try {
      const res = await fetch("/api/assistant/legal-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "LEGAL_QA",
          text: target,
        }),
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setQaResult(data.data);
        setQaSource(data.source || "GEMINI_2_5_FLASH");
      } else {
        setQaResult(answerTenantQuestionDeterministically(target));
        setQaSource("DETERMINISTIC_STATUTORY_ENGINE_FALLBACK");
      }
    } catch {
      setQaResult(answerTenantQuestionDeterministically(target));
      setQaSource("DETERMINISTIC_STATUTORY_ENGINE_FALLBACK");
    } finally {
      setIsAnswering(false);
    }
  };

  const totalReceiptOutflow =
    receiptData.baseRentBdt +
    receiptData.electricityBdt +
    receiptData.gasBdt +
    receiptData.waterBdt +
    receiptData.serviceChargeBdt -
    receiptData.advanceAdjustmentBdt;

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)] pb-20">
      {/* Top Banner & Header */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.5 text-[10px]">
                MODULE 05
              </span>
              <span>// STATUTORY TENANT DEFENSE</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Tenant Protection AI &amp; 1991 Act Auditor
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="border border-carbon bg-paper px-2.5 py-1 text-muted-ink text-[11px] shadow-docket-sm">
              <span className="text-evidence-green font-bold">●</span> Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন)
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Notice */}
      <div className="border-b border-carbon/20 bg-carbon text-surface px-4 py-2 sm:px-6 lg:px-8 font-mono text-xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-radar">
            <Scale className="h-3.5 w-3.5 shrink-0" />
            <span className="font-bold text-[11px]">
              ACT NO. III OF 1991 STATUTORY REPOSITORY // SECTIONS 7, 10, 13, 15, 18, 21 &amp; BERC SUB-METER CODE
            </span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Automated legal information &amp; polite negotiation counter-clauses.
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="border-b-2 border-carbon bg-surface px-4 sm:px-6 lg:px-8 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl flex gap-2 sm:gap-4 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab("AUDITOR")}
            className={`px-3 py-2 text-xs sm:text-sm font-mono font-bold tracking-wide border transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "AUDITOR"
                ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-radar" />
            <span>[01] LEASE &amp; MESS CLAUSE AUDITOR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("QA")}
            className={`px-3 py-2 text-xs sm:text-sm font-mono font-bold tracking-wide border transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "QA"
                ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
            }`}
          >
            <HelpCircle className="h-4 w-4 text-evidence-green" />
            <span>[02] BILINGUAL TENANT RIGHTS Q&amp;A</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("STATUTES_RECEIPT")}
            className={`px-3 py-2 text-xs sm:text-sm font-mono font-bold tracking-wide border transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "STATUTES_RECEIPT"
                ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
            }`}
          >
            <Printer className="h-4 w-4 text-evidence-amber" />
            <span>[03] STATUTORY DOSSIER &amp; SEC 13 RENT RECEIPT</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* TAB 1: RENTAL AGREEMENT & MESS RULE AUDITOR */}
        {/* ========================================================================= */}
        {activeTab === "AUDITOR" && (
          <div className="space-y-6">
            {/* Presets Bar */}
            <div className="bg-surface border-2 border-carbon p-4 shadow-docket space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-carbon/20 pb-2">
                <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-2">
                  <FileText className="h-4 w-4 text-carbon" />
                  <span>Test with 4 Realistic 1-Click Lease Agreements:</span>
                </div>
                <span className="font-mono text-[11px] text-muted-ink">
                  Bangla &amp; English Tenancy Contracts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {SAMPLE_LEASE_AUDIT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 text-left border font-mono text-xs transition-all ${
                      selectedPresetId === preset.id
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span
                        className={`px-1 py-0.2 font-bold ${
                          preset.badgeSeverity === "CRITICAL"
                            ? "bg-evidence-red text-surface"
                            : preset.badgeSeverity === "HIGH"
                            ? "bg-evidence-amber text-surface"
                            : "bg-evidence-green text-surface"
                        }`}
                      >
                        {preset.badgeLabel}
                      </span>
                      <span className="opacity-80">~{preset.targetExpectedScore}/100</span>
                    </div>
                    <div className="font-bold text-[11px] truncate">{preset.name}</div>
                    <div className="text-[10px] opacity-80 truncate">{preset.nameBn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Column Auditor Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Input Textarea (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-carbon pb-3">
                    <div className="font-display font-bold text-base uppercase text-carbon">
                      Lease Agreement Text
                    </div>
                    <span className="font-mono text-[11px] text-muted-ink">
                      {leaseInputText.length} chars
                    </span>
                  </div>

                  <p className="font-mono text-xs text-muted-ink">
                    Paste any Bangla or English rental contract, bachelor mess rule-sheet, or landlord WhatsApp message:
                  </p>

                  <textarea
                    rows={15}
                    value={leaseInputText}
                    onChange={(e) => setLeaseInputText(e.target.value)}
                    placeholder="চুক্তিপত্রের শর্তাবলী এখানে পেস্ট করুন..."
                    className="w-full bg-paper border border-carbon p-3 font-mono text-xs text-carbon leading-relaxed focus:outline-none focus:ring-1 focus:ring-carbon"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRunAudit()}
                      disabled={isAuditing || !leaseInputText.trim()}
                      className="w-full bg-carbon text-surface hover:bg-carbon/90 font-mono text-xs font-bold gap-2 py-2.5"
                    >
                      {isAuditing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-radar" />
                          <span>AUDITING AGAINST 1991 ACT...</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-4 w-4 text-radar" />
                          <span>RUN STATUTORY CLAUSE AUDIT →</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="font-mono text-[11px] text-muted-ink pt-1 flex items-center justify-between">
                    <span>ENGINE: {auditSource}</span>
                    <span className="text-evidence-green flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> 100% Deterministic Fallback Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Audit Results & Counter-Drafts (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {auditResult && (
                  <>
                    {/* Score Stamp Header */}
                    <div
                      className={`border-2 border-carbon p-5 shadow-docket flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        auditResult.complianceScore >= 80
                          ? "bg-evidence-green/10"
                          : auditResult.complianceScore >= 45
                          ? "bg-radar/20"
                          : "bg-evidence-red/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-bold uppercase tracking-wider text-muted-ink">
                          STATUTORY COMPLIANCE AUDIT STAMP
                        </div>
                        <div className="font-display font-extrabold text-2xl text-carbon">
                          {auditResult.complianceScore} / 100 — {auditResult.overallComplianceStatus.replace(/_/g, " ")}
                        </div>
                        <p className="text-xs font-mono text-carbon max-w-xl">
                          {auditResult.summaryOverview}
                        </p>
                        <p className="text-xs font-sans text-carbon/80 max-w-xl">
                          {auditResult.summaryOverviewBn}
                        </p>
                      </div>

                      <div
                        className={`border-2 border-carbon px-4 py-2 text-center font-mono font-bold uppercase text-xs shadow-docket-sm ${
                          auditResult.complianceScore >= 80
                            ? "bg-evidence-green text-surface"
                            : auditResult.complianceScore >= 45
                            ? "bg-radar text-carbon"
                            : "bg-evidence-red text-surface"
                        }`}
                      >
                        {auditResult.complianceScore >= 80
                          ? "LEGAL SAFEGUARD"
                          : auditResult.complianceScore >= 45
                          ? "CAUTION ADVISED"
                          : "PREDATORY TERMS"}
                      </div>
                    </div>

                    {/* Action Plan */}
                    {auditResult.tenantActionPlan && auditResult.tenantActionPlan.length > 0 && (
                      <div className="bg-surface border-2 border-carbon p-4 shadow-docket space-y-2">
                        <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-evidence-green" />
                          <span>Tenant Strategic Action Plan:</span>
                        </div>
                        <ul className="space-y-1.5 font-mono text-xs text-muted-ink">
                          {auditResult.tenantActionPlan.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-bold text-carbon">[{idx + 1}]</span>
                              <span className="text-carbon">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Audited Clauses Breakdown */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-carbon pb-2 font-mono text-xs font-bold uppercase text-carbon">
                        <span>Clause-by-Clause Forensic Audit ({auditResult.auditedClauses.length} items)</span>
                        <span>Click to Copy Negotiation Proposal</span>
                      </div>

                      {auditResult.auditedClauses.map((clause, idx) => (
                        <div
                          key={idx}
                          className="bg-surface border-2 border-carbon p-4 shadow-docket space-y-3"
                        >
                          {/* Clause Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-carbon/20 pb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border ${
                                  clause.status === "VIOLATION"
                                    ? "bg-evidence-red text-surface border-carbon"
                                    : clause.status === "WARNING"
                                    ? "bg-radar text-carbon border-carbon"
                                    : "bg-evidence-green text-surface border-carbon"
                                }`}
                              >
                                {clause.status}
                              </span>
                              <h4 className="font-display font-bold text-sm text-carbon">
                                {clause.clauseTitle}
                              </h4>
                            </div>
                            <span className="font-mono text-[11px] font-bold text-evidence-amber">
                              {clause.statutorySectionRef}
                            </span>
                          </div>

                          {/* Extracted Quote */}
                          <div className="bg-paper border border-carbon/40 p-2.5 font-mono text-xs text-carbon italic">
                            &ldquo;{clause.extractedQuote}&rdquo;
                          </div>

                          {/* Legal Explanation */}
                          <p className="text-xs font-sans text-muted-ink leading-relaxed">
                            {clause.legalExplanation}
                          </p>

                          {/* Counter-Draft Proposals (Copyable) */}
                          <div className="bg-radar/10 border border-carbon p-3 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-carbon">
                              <span>RECOMMENDED LEGAL COUNTER-CLAUSE (আইনি পাল্টা ধারা):</span>
                              <span className="text-muted-ink">Ready for WhatsApp / Agreement</span>
                            </div>

                            {/* Bangla Counter-Clause */}
                            <div className="bg-surface border border-carbon/50 p-2.5 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold text-muted-ink">
                                  বাংলা খসড়া (Bangla Proposal):
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(clause.counterDraftBn, `bn-${idx}`)}
                                  className="font-mono text-[10px] font-bold text-carbon hover:text-evidence-green flex items-center gap-1 border border-carbon/40 px-1.5 py-0.5 bg-paper"
                                >
                                  {copiedKey === `bn-${idx}` ? (
                                    <>
                                      <Check className="h-3 w-3 text-evidence-green" />
                                      <span className="text-evidence-green">COPIED!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>COPY BANGLA</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs font-sans font-medium text-carbon leading-relaxed">
                                {clause.counterDraftBn}
                              </p>
                            </div>

                            {/* English Counter-Clause */}
                            <div className="bg-surface border border-carbon/50 p-2.5 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold text-muted-ink">
                                  English Draft:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(clause.counterDraftEn, `en-${idx}`)}
                                  className="font-mono text-[10px] font-bold text-carbon hover:text-evidence-green flex items-center gap-1 border border-carbon/40 px-1.5 py-0.5 bg-paper"
                                >
                                  {copiedKey === `en-${idx}` ? (
                                    <>
                                      <Check className="h-3 w-3 text-evidence-green" />
                                      <span className="text-evidence-green">COPIED!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>COPY ENGLISH</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs font-mono text-carbon leading-relaxed">
                                {clause.counterDraftEn}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BILINGUAL TENANT RIGHTS Q&A */}
        {/* ========================================================================= */}
        {activeTab === "QA" && (
          <div className="space-y-6">
            {/* Quick Questions Chips */}
            <div className="bg-surface border-2 border-carbon p-4 shadow-docket space-y-3">
              <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-evidence-green" />
                <span>Frequently Asked Tenant Rights Queries (Click to Ask):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQaInput(chip.query);
                      handleRunQA(chip.query);
                    }}
                    className="px-3 py-1.5 bg-paper border border-carbon font-mono text-xs font-medium text-carbon hover:bg-radar/30 transition-colors text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q&A Input Bar */}
            <div className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunQA()}
                  placeholder="আপনার আইনি প্রশ্ন বাংলায় বা ইংরেজিতে লিখুন (যেমন: বাড়িওয়ালা কি হঠাৎ নোটিশ ছাড়া উচ্ছেদ করতে পারেন?)..."
                  className="flex-1 bg-paper border border-carbon px-4 py-2.5 font-mono text-xs text-carbon focus:outline-none focus:ring-1 focus:ring-carbon"
                />
                <Button
                  onClick={() => handleRunQA()}
                  disabled={isAnswering || !qaInput.trim()}
                  className="bg-carbon text-surface hover:bg-carbon/90 font-mono text-xs font-bold px-6 py-2.5 gap-2 shrink-0"
                >
                  {isAnswering ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-radar" />
                      <span>ANALYZING STATUTES...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-radar" />
                      <span>ASK ASSISTANT →</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="font-mono text-[11px] text-muted-ink flex items-center justify-between">
                <span>ENGINE: {qaSource}</span>
                <span>Grounded in Sections 7, 10, 13, 15, 18 &amp; 21</span>
              </div>
            </div>

            {/* Q&A Response Card */}
            {qaResult && (
              <div className="bg-surface border-2 border-carbon p-6 shadow-docket space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-muted-ink uppercase">
                      STATUTORY TOPIC ANALYSIS
                    </span>
                    <h3 className="font-display font-bold text-xl text-carbon">
                      {qaResult.questionTopic}
                    </h3>
                  </div>
                  <div className="border border-carbon bg-paper px-3 py-1 font-mono text-xs font-bold text-evidence-amber">
                    {qaResult.statutorySection}
                  </div>
                </div>

                {/* Bilingual Explanations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-paper border border-carbon p-4 space-y-2">
                    <div className="font-mono text-xs font-bold text-carbon uppercase">
                      Legal Explanation (English)
                    </div>
                    <p className="font-sans text-xs text-carbon leading-relaxed">
                      {qaResult.legalSummary}
                    </p>
                  </div>

                  <div className="bg-paper border border-carbon p-4 space-y-2">
                    <div className="font-mono text-xs font-bold text-carbon uppercase">
                      আইনি ব্যাখ্যা (বাংলা)
                    </div>
                    <p className="font-sans text-xs text-carbon leading-relaxed">
                      {qaResult.legalSummaryBn}
                    </p>
                  </div>
                </div>

                {/* Tenant Rights Points */}
                <div className="space-y-2">
                  <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-evidence-green" />
                    <span>Key Tenant Rights &amp; Legal Defenses:</span>
                  </div>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {qaResult.tenantRightsPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-carbon">
                        <span className="text-evidence-green font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Next Steps */}
                <div className="space-y-2 pt-2 border-t border-carbon/10">
                  <div className="font-mono text-xs font-bold uppercase text-carbon flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-radar" />
                    <span>Actionable Immediate Steps for Tenant:</span>
                  </div>
                  <ul className="space-y-1.5 font-mono text-xs">
                    {qaResult.practicalNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-ink">
                        <span className="font-bold text-carbon">[{idx + 1}]</span>
                        <span className="text-carbon">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Counter Clause if provided */}
                {qaResult.counterClauseProposal && (
                  <div className="bg-radar/10 border border-carbon p-4 space-y-3">
                    <div className="font-mono text-xs font-bold text-carbon uppercase">
                      Ready-to-Use Negotiation Counter-Clause:
                    </div>

                    <div className="bg-surface border border-carbon/40 p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-muted-ink">
                          বাংলা খসড়া (WhatsApp / মেসেঞ্জার-এর জন্য):
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(qaResult.counterClauseProposal!.bn, "qa-bn")
                          }
                          className="font-mono text-[10px] font-bold border border-carbon/40 px-2 py-0.5 bg-paper flex items-center gap-1"
                        >
                          {copiedKey === "qa-bn" ? "COPIED!" : "COPY BANGLA"}
                        </button>
                      </div>
                      <p className="text-xs font-sans text-carbon">
                        {qaResult.counterClauseProposal.bn}
                      </p>
                    </div>

                    <div className="bg-surface border border-carbon/40 p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-muted-ink">
                          English Clause:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(qaResult.counterClauseProposal!.en, "qa-en")
                          }
                          className="font-mono text-[10px] font-bold border border-carbon/40 px-2 py-0.5 bg-paper flex items-center gap-1"
                        >
                          {copiedKey === "qa-en" ? "COPIED!" : "COPY ENGLISH"}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-carbon">
                        {qaResult.counterClauseProposal.en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STATUTORY DOSSIER & SECTION 13 RENT RECEIPT GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === "STATUTES_RECEIPT" && (
          <div className="space-y-10">
            {/* Section 1: Section 13 Rent Receipt Generator */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Printer className="h-5 w-5 text-carbon" />
                    <h2 className="font-display font-bold text-xl uppercase tracking-tight text-carbon">
                      Section 13 Official Rent Receipt Generator (ভাড়ার রশিদ)
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-muted-ink">
                    Statutory format under Section 13 of the Premises Rent Control Act, 1991 (With Landlord Counterfoil)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.print();
                      }
                    }}
                    variant="outline"
                    className="font-mono text-xs font-bold gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>PRINT / SAVE PDF</span>
                  </Button>
                </div>
              </div>

              {/* Generator Grid: Form on Left (5 Cols), Live Receipt Preview on Right (7 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Controls */}
                <div className="lg:col-span-5 bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
                  <div className="font-mono text-xs font-bold uppercase text-carbon border-b border-carbon/20 pb-2">
                    Receipt Parameters
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-muted-ink mb-1">Receipt Number:</label>
                      <input
                        type="text"
                        value={receiptData.receiptNumber}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, receiptNumber: e.target.value })
                        }
                        className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-muted-ink mb-1">Tenant Name (ভাড়াটিয়া):</label>
                      <input
                        type="text"
                        value={receiptData.tenantName}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, tenantName: e.target.value })
                        }
                        className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                      />
                    </div>

                    <div>
                      <label className="block text-muted-ink mb-1">Landlord Name (মালিক):</label>
                      <input
                        type="text"
                        value={receiptData.landlordName}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, landlordName: e.target.value })
                        }
                        className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                      />
                    </div>

                    <div>
                      <label className="block text-muted-ink mb-1">Premises Address (ঠিকানা):</label>
                      <input
                        type="text"
                        value={receiptData.premisesAddress}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, premisesAddress: e.target.value })
                        }
                        className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-muted-ink mb-1">Month / Period:</label>
                        <input
                          type="text"
                          value={receiptData.rentalMonthYear}
                          onChange={(e) =>
                            setReceiptData({ ...receiptData, rentalMonthYear: e.target.value })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-ink mb-1">Payment Date:</label>
                        <input
                          type="date"
                          value={receiptData.paymentDate}
                          onChange={(e) =>
                            setReceiptData({ ...receiptData, paymentDate: e.target.value })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-muted-ink mb-1">Base Rent (৳):</label>
                        <input
                          type="number"
                          value={receiptData.baseRentBdt}
                          onChange={(e) =>
                            setReceiptData({
                              ...receiptData,
                              baseRentBdt: Number(e.target.value),
                            })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-ink mb-1">Service Charge (৳):</label>
                        <input
                          type="number"
                          value={receiptData.serviceChargeBdt}
                          onChange={(e) =>
                            setReceiptData({
                              ...receiptData,
                              serviceChargeBdt: Number(e.target.value),
                            })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-muted-ink mb-1">Electricity (৳):</label>
                        <input
                          type="number"
                          value={receiptData.electricityBdt}
                          onChange={(e) =>
                            setReceiptData({
                              ...receiptData,
                              electricityBdt: Number(e.target.value),
                            })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-ink mb-1">Gas (৳):</label>
                        <input
                          type="number"
                          value={receiptData.gasBdt}
                          onChange={(e) =>
                            setReceiptData({
                              ...receiptData,
                              gasBdt: Number(e.target.value),
                            })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                        />
                      </div>
                      <div>
                        <label className="block text-muted-ink mb-1">Water (৳):</label>
                        <input
                          type="number"
                          value={receiptData.waterBdt}
                          onChange={(e) =>
                            setReceiptData({
                              ...receiptData,
                              waterBdt: Number(e.target.value),
                            })
                          }
                          className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-muted-ink mb-1">Payment Method:</label>
                      <input
                        type="text"
                        value={receiptData.paymentMethod}
                        onChange={(e) =>
                          setReceiptData({ ...receiptData, paymentMethod: e.target.value })
                        }
                        className="w-full bg-paper border border-carbon px-2.5 py-1 text-carbon"
                      />
                    </div>
                  </div>
                </div>

                {/* Printable Receipt Preview (7 Cols) */}
                <div className="lg:col-span-7 bg-surface border-2 border-carbon p-6 shadow-docket space-y-6 print:shadow-none print:border">
                  {/* Receipt Header */}
                  <div className="border-b-2 border-carbon pb-4 flex justify-between items-start">
                    <div>
                      <div className="font-mono text-[10px] font-bold text-muted-ink uppercase">
                        GOVERNMENT STATUTORY FORMAT // SECTION 13
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-carbon uppercase">
                        ভাড়ার রসিদ // RENT RECEIPT
                      </h3>
                      <div className="font-mono text-xs text-carbon">
                        The Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-carbon">NO: {receiptData.receiptNumber}</div>
                      <div className="text-muted-ink">Date: {receiptData.paymentDate}</div>
                    </div>
                  </div>

                  {/* Tenant & Property Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs bg-paper p-3 border border-carbon">
                    <div>
                      <span className="text-muted-ink">Tenant (ভাড়াটিয়া): </span>
                      <strong className="text-carbon block">{receiptData.tenantName}</strong>
                    </div>
                    <div>
                      <span className="text-muted-ink">Landlord (বাড়িওয়ালা): </span>
                      <strong className="text-carbon block">{receiptData.landlordName}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted-ink">Premises (ভাড়া দেওয়া বাড়ির বিবরণ): </span>
                      <strong className="text-carbon block">{receiptData.premisesAddress}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted-ink">For Period (ভাড়ার মাস): </span>
                      <strong className="text-carbon">{receiptData.rentalMonthYear}</strong>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="border border-carbon font-mono text-xs">
                    <div className="grid grid-cols-12 bg-carbon text-surface font-bold p-2">
                      <span className="col-span-8">Description (বিবরণ)</span>
                      <span className="col-span-4 text-right">Amount (টাকা)</span>
                    </div>
                    <div className="divide-y divide-carbon/20">
                      <div className="grid grid-cols-12 p-2 bg-surface">
                        <span className="col-span-8">Base Monthly Rent (মূল ভাড়া)</span>
                        <span className="col-span-4 text-right font-bold">
                          ৳{receiptData.baseRentBdt.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-paper/50">
                        <span className="col-span-8">Building Service Charge (সার্ভিস চার্জ)</span>
                        <span className="col-span-4 text-right">
                          ৳{receiptData.serviceChargeBdt.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-surface">
                        <span className="col-span-8">Electricity Bill (বিদ্যুৎ সাব-মিটার)</span>
                        <span className="col-span-4 text-right">
                          ৳{receiptData.electricityBdt.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-paper/50">
                        <span className="col-span-8">Gas Supply (গ্যাস বিল)</span>
                        <span className="col-span-4 text-right">
                          ৳{receiptData.gasBdt.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-surface">
                        <span className="col-span-8">Water &amp; Sewerage (ওয়াসা পানি)</span>
                        <span className="col-span-4 text-right">
                          ৳{receiptData.waterBdt.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 p-2 bg-radar/20 font-bold border-t-2 border-carbon">
                        <span className="col-span-8">NET TOTAL RECEIVED (সর্বমোট প্রাপ্তি)</span>
                        <span className="col-span-4 text-right text-base text-carbon">
                          ৳{totalReceiptOutflow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="font-mono text-xs space-y-1 text-muted-ink">
                    <div>
                      <span>Payment Method: </span>
                      <strong className="text-carbon">{receiptData.paymentMethod}</strong>
                    </div>
                    <div>
                      <span>Statutory Memo: </span>
                      <span className="text-carbon">{receiptData.notes}</span>
                    </div>
                  </div>

                  {/* Dual Signature Blocks (Landlord + Counterfoil) */}
                  <div className="pt-8 border-t border-carbon/20 grid grid-cols-2 gap-8 font-mono text-xs">
                    <div className="text-center">
                      <div className="border-t border-carbon pt-1">
                        ভাড়াটিয়ার স্বাক্ষর / গ্রহণকারীর চিহ্ন
                      </div>
                      <div className="text-[10px] text-muted-ink mt-0.5">Tenant Signature</div>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-carbon pt-1 font-bold text-carbon">
                        বাড়িওয়ালার স্বাক্ষর / সিলমোহর
                      </div>
                      <div className="text-[10px] text-muted-ink mt-0.5">
                        Landlord Signature (Sec 13 Statutory Duty)
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-center text-muted-ink pt-2 border-t border-carbon/10">
                    Generated via RentRadar Bangladesh // Grounded in Section 13, The Premises Rent Control Act, 1991
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Complete 1991 Act Statutory Reference Corpus */}
            <div className="space-y-4 pt-6 border-t-2 border-carbon">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-carbon" />
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight text-carbon">
                      Complete Statutory Dossier: The Premises Rent Control Act, 1991
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-muted-ink">
                    বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১ (Sections 7, 10, 13, 15, 18, 21 and BERC Electricity Directives)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PREMISES_RENT_CONTROL_ACT_1991_SECTIONS.map((sec) => (
                  <div
                    key={sec.sectionCode}
                    className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-carbon/20 pb-2">
                      <div className="font-mono text-xs font-bold text-evidence-amber">
                        {sec.sectionNumber}
                      </div>
                      <span className="font-mono text-[10px] bg-carbon text-surface px-1.5 py-0.2">
                        {sec.sectionCode}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base text-carbon">
                      {sec.titleEn}
                    </h4>
                    <div className="font-sans text-xs font-semibold text-muted-ink">
                      {sec.titleBn}
                    </div>

                    <p className="font-sans text-xs text-carbon leading-relaxed">
                      {sec.statutoryRuleSummary}
                    </p>

                    <div className="bg-paper border border-carbon/30 p-2.5 font-mono text-xs space-y-1">
                      <div className="text-[10px] text-muted-ink uppercase font-bold">
                        Tenant Protection Right:
                      </div>
                      <div className="text-carbon">{sec.tenantProtectionRight}</div>
                    </div>

                    <div className="bg-radar/10 border border-carbon p-2.5 font-mono text-xs space-y-1">
                      <div className="text-[10px] text-carbon uppercase font-bold">
                        Statutory Penalty on Violation:
                      </div>
                      <div className="text-muted-ink">{sec.penaltySummary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
