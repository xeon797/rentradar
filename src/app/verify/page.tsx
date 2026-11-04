"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Sparkles,
  RefreshCw,
  Send,
  Check,
  Building2,
  AlertOctagon,
  Cpu,
} from "lucide-react";
import { RoleGuardBanner } from "@/components/auth/RoleGuardBanner";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import { useCivicAuth } from "@/lib/auth/auth-context";
import {
  VerificationSubmissionRecord,
  EmailDispatchRecord,
  UtilityProviderCode,
  PropertyListing,
} from "@/types/rentradar";
import { BD_NEIGHBORHOOD_BENCHMARKS } from "@/lib/data/bd-neighborhood-benchmarks";
import { evaluateNeighborhoodPriceAnomaly } from "@/lib/data/bd-neighborhood-benchmarks";
import {
  maskCredentialString,
  calculateAddressTokenSimilarity,
} from "@/lib/utils";
import { compressAndHashImageOnClient } from "@/lib/image/client-compressor";

const SAMPLE_PHOTO_VERIFIED =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80";
const SAMPLE_PHOTO_STOLEN =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
const STOLEN_GULSHAN_DHASH =
  "1101001010110001010101101100101010101100110011010101001011010011";

export default function VerifyPage() {
  const { user, switchDemoPersona } = useCivicAuth();

  // Tab State: 'publish' | 'auditor' | 'email-ledger'
  const [activeTab, setActiveTab] = useState<"publish" | "auditor" | "email-ledger">(
    user.role === "AUDITOR" ? "auditor" : "publish"
  );

  // Submissions & Email Ledger State from API
  const [submissions, setSubmissions] = useState<VerificationSubmissionRecord[]>([]);
  const [emailLedger, setEmailLedger] = useState<EmailDispatchRecord[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [auditorFilter, setAuditorFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "FLAGGED">("ALL");

  // Auditor Review Processing State
  const [processingSubmissionId, setProcessingSubmissionId] = useState<string | null>(null);
  const [auditorNotesInput, setAuditorNotesInput] = useState<Record<string, string>>({});
  const [reviewSuccessBanner, setReviewSuccessBanner] = useState<string | null>(null);

  // Landlord Listing Creation Form State
  const [title, setTitle] = useState("Shahjalal Uposhahar Block D Modern 3BHK Apartment");
  const [titleBn, setTitleBn] = useState("শাহজালাল উপশহর ব্লক ডি আধুনিক ৩ বেডরুম ফ্ল্যাট");
  const [city, setCity] = useState<"Dhaka" | "Sylhet" | "Chattogram">("Sylhet");
  const [neighborhood, setNeighborhood] = useState("Shahjalal Uposhahar");
  const [address, setAddress] = useState("House 24, Road 7, Block D, Shahjalal Uposhahar, Sylhet");
  const [monthlyRentBdt, setMonthlyRentBdt] = useState<number>(22000);
  const [advanceMonths, setAdvanceMonths] = useState<number>(2);
  const [serviceChargeBdt, setServiceChargeBdt] = useState<number>(3000);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [sqft, setSqft] = useState<number>(1400);
  const [floorLevel, setFloorLevel] = useState("3rd Floor (Lift 1)");
  const [tenantType, setTenantType] = useState<"FAMILY" | "BACHELOR" | "SUBLET" | "ANY">("FAMILY");
  const [description, setDescription] = useState(
    "Spacious south-facing apartment with generator backup, Jalalabad gas pipeline, and dedicated car parking."
  );
  const [applicantName, setApplicantName] = useState(user.fullName || "Engr. Kamal Uddin");
  const [applicantEmail, setApplicantEmail] = useState(user.email || "engr.kamal@dhanmondi-holdings.bd");
  const [utilityProvider, setUtilityProvider] = useState<UtilityProviderCode>("JALALABAD_GAS");
  const [rawMeterNumber, setRawMeterNumber] = useState("JGAS-8819024");
  const [rawHoldingTaxId, setRawHoldingTaxId] = useState("SCC-W21-409");
  const [claimedAddressOnBill, setClaimedAddressOnBill] = useState(
    "House 24, Road 7, Block D, Shahjalal Uposhahar, Sylhet"
  );
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTO_VERIFIED);
  const [photoDhash, setPhotoDhash] = useState(
    "0011010110101100110011010101010010101110010101011010110011010001"
  );
  const [photoDhashHex, setPhotoDhashHex] = useState("35AC-CD54-AE55-ACD1");
  const [isPhotoColliding, setIsPhotoColliding] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [filingReceipt, setFilingReceipt] = useState<{
    property: PropertyListing;
    submission: VerificationSubmissionRecord;
    emailDispatch: EmailDispatchRecord;
  } | null>(null);

  // Fetch Verification Submissions Queue
  async function loadVerificationQueue() {
    setIsLoadingQueue(true);
    try {
      const res = await fetch("/api/verify");
      const data = await res.json();
      if (data.ok) {
        setSubmissions(data.submissions || []);
        setEmailLedger(data.emailLedger || []);
      }
    } catch (err) {
      console.warn("[Verify] Failed to load queue:", err);
    } finally {
      setIsLoadingQueue(false);
    }
  }

  useEffect(() => {
    loadVerificationQueue();
  }, []);

  // Update applicant info when persona changes
  useEffect(() => {
    if (user.fullName) {
      setApplicantName(user.fullName);
    }
    if (user.email) {
      setApplicantEmail(user.email);
    }
  }, [user]);

  // Live Real-Time Neighborhood Price Sanity Evaluation
  const priceSanity = useMemo(() => {
    return evaluateNeighborhoodPriceAnomaly(neighborhood, monthlyRentBdt, bedrooms, sqft);
  }, [neighborhood, monthlyRentBdt, bedrooms, sqft]);

  // Live Token Match for Address
  const liveAddressMatchScore = useMemo(() => {
    return calculateAddressTokenSimilarity(address, claimedAddressOnBill);
  }, [address, claimedAddressOnBill]);

  // Available Neighborhoods for Selected City
  const availableNeighborhoods = useMemo(() => {
    const all = Object.values(BD_NEIGHBORHOOD_BENCHMARKS);
    return all.filter((b) => b.city === city).map((b) => b.neighborhood).sort();
  }, [city]);

  // 1-Click Auto-Fill Landlord Preset
  function handleAutoFillSylhet() {
    setTitle("Shahjalal Uposhahar Block D Modern 3BHK Apartment");
    setTitleBn("শাহজালাল উপশহর ব্লক ডি আধুনিক ৩ বেডরুম ফ্ল্যাট");
    setCity("Sylhet");
    setNeighborhood("Shahjalal Uposhahar");
    setAddress("House 24, Road 7, Block D, Shahjalal Uposhahar, Sylhet");
    setMonthlyRentBdt(22000);
    setAdvanceMonths(2);
    setServiceChargeBdt(3000);
    setUtilitiesIncluded(false);
    setBedrooms(3);
    setBathrooms(3);
    setSqft(1400);
    setFloorLevel("3rd Floor (Lift 1)");
    setTenantType("FAMILY");
    setDescription(
      "Spacious south-facing apartment with generator backup, Jalalabad gas pipeline, and dedicated car parking."
    );
    setUtilityProvider("JALALABAD_GAS");
    setRawMeterNumber("JGAS-8819024");
    setRawHoldingTaxId("SCC-W21-409");
    setClaimedAddressOnBill("House 24, Road 7, Block D, Shahjalal Uposhahar, Sylhet");
    setPhotoUrl(SAMPLE_PHOTO_VERIFIED);
    setPhotoDhash("0011010110101100110011010101010010101110010101011010110011010001");
    setPhotoDhashHex("35AC-CD54-AE55-ACD1");
    setIsPhotoColliding(false);
  }

  // Pre-Screen Live Photo through Client Compressor & Sharp dHash API
  async function handlePhotoUpload(file: File) {
    try {
      const compressed = await compressAndHashImageOnClient(file, 1400, 0.82);
      setPhotoUrl(compressed.base64DataUrl);
      setPhotoDhash(compressed.clientDhashBinary);
      setPhotoDhashHex(compressed.clientDhashHex);

      // Check collision via API
      const hashRes = await fetch("/api/inspector/image-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: compressed.base64DataUrl }),
      });
      const hashData = await hashRes.json();
      if (hashData.ok) {
        setIsPhotoColliding(hashData.hasCriticalCollision || hashData.duplicateMatches?.length > 0);
      }
    } catch (err) {
      console.warn("[Verify] Photo compression/dHash error:", err);
    }
  }

  // Simulate Stolen Photo Collision Gate
  function handleSimulateStolenPhoto() {
    setPhotoUrl(SAMPLE_PHOTO_STOLEN);
    setPhotoDhash(STOLEN_GULSHAN_DHASH);
    setPhotoDhashHex("D2B1-56CA-ACCD-52D3");
    setIsPhotoColliding(true);
  }

  // Submit Listing & Verification Filing
  async function handlePublishListing(e: React.FormEvent) {
    e.preventDefault();
    setIsPublishing(true);
    setFilingReceipt(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_LISTING_AND_VERIFY",
          title,
          titleBn,
          city,
          neighborhood,
          address,
          monthlyRentBdt,
          advanceMonths,
          serviceChargeBdt,
          utilitiesIncluded,
          bedrooms,
          bathrooms,
          sqft,
          floorLevel,
          tenantType,
          description,
          imageUrl: photoUrl,
          imageDhash: photoDhash,
          contactPhoneMasked: "+880 1711-482XXX",
          applicantName,
          applicantEmail,
          utilityProvider,
          rawMeterNumber,
          rawHoldingTaxId,
          claimedAddressOnBill,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to publish listing and filing");
      }

      setFilingReceipt({
        property: data.property,
        submission: data.submission,
        emailDispatch: data.emailDispatch,
      });

      // Reload queue to reflect new submission
      loadVerificationQueue();
    } catch (err) {
      console.error("[Verify] Publishing error:", err);
    } finally {
      setIsPublishing(false);
    }
  }

  // Auditor Review Decision Handler
  async function handleAuditorDecision(
    submissionId: string,
    decision: "APPROVE_UTILITY_MATCH" | "APPROVE_VERIFIED_LANDLORD" | "FLAG_DISCREPANCY"
  ) {
    setProcessingSubmissionId(submissionId);
    setReviewSuccessBanner(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "AUDITOR_REVIEW_DECISION",
          submissionId,
          decision,
          reviewerNotes:
            auditorNotesInput[submissionId] ||
            (decision === "FLAG_DISCREPANCY"
              ? "Discrepancy flagged: Service address on utility bill does not reconcile with cadastral holding."
              : "Municipal verification confirmed. Meter and holding tax credentials match."),
          reviewerBadge: user.badgeCode || "RR-AUD-007",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to process auditor decision");
      }

      setReviewSuccessBanner(
        `DECISION RECORDED: ${data.submission.submissionCode} (${data.submission.propertyDocketId}) updated to ${data.submission.reviewStatus} [${data.submission.grantedTier}]. Transactional email dispatched via Resend!`
      );

      // Refresh queue
      await loadVerificationQueue();
    } catch (err) {
      console.error("[Verify] Auditor decision error:", err);
    } finally {
      setProcessingSubmissionId(null);
    }
  }

  // Filtered Submissions for Tab 2
  const filteredSubmissions = useMemo(() => {
    if (auditorFilter === "ALL") return submissions;
    return submissions.filter((s) => s.reviewStatus === auditorFilter);
  }, [submissions, auditorFilter]);

  const pendingCount = useMemo(
    () => submissions.filter((s) => s.reviewStatus === "PENDING").length,
    [submissions]
  );
  const verifiedCount = useMemo(
    () => submissions.filter((s) => s.reviewStatus === "VERIFIED").length,
    [submissions]
  );
  const flaggedCount = useMemo(
    () => submissions.filter((s) => s.reviewStatus === "FLAGGED").length,
    [submissions]
  );

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)]">
      {/* Top Docket Banner */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.5 text-[10px]">
                MODULE 03
              </span>
              <span>// UTILITY PROOF &amp; AUDITOR QUEUE</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Listing Creation &amp; Utility Proof Desk
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <div className="border border-carbon bg-paper px-2.5 py-1 text-muted-ink text-[11px] shadow-docket-sm flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-evidence-green" />
              <span><strong className="text-carbon">Zero-LLM</strong> Privacy Vault</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Role Guard Clearance Banner */}
        <RoleGuardBanner
          requiredRoles={["LANDLORD", "AUDITOR"]}
          moduleTitle="Landlord Property Verification & Audit Desk"
          description="Publishing verified listings and approving utility meter credentials requires Landlord or Municipal Auditor credentials."
          actionCta="AUTHORIZE CIVIC IDENTITY"
        />

        {/* Zero-LLM-Leak Privacy Guarantee Bar */}
        <div className="bg-carbon text-surface border border-carbon p-3 shadow-docket-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-radar shrink-0" />
            <span>
              <strong>ZERO-LLM-LEAK ARCHITECTURE:</strong> Utility bills (DESCO/DPDC/BPDB/Jalalabad Gas)
              &amp; Municipal Holding Tax IDs are masked on ingestion and NEVER transmitted to external LLM APIs.
            </span>
          </div>
          <span className="bg-radar text-carbon font-bold px-2 py-0.5 text-[10px] shrink-0 self-start sm:self-auto">
            DETERMINISTIC TOKEN MATCH
          </span>
        </div>

        {/* 3-Tab Interactive Switcher */}
        <div className="border-b-2 border-carbon flex flex-wrap gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("publish")}
            className={`px-4 py-2.5 font-bold transition-all border-t-2 border-l-2 border-r-2 flex items-center gap-2 ${
              activeTab === "publish"
                ? "bg-surface border-carbon text-carbon shadow-docket -mb-[2px] z-10"
                : "bg-paper border-transparent text-muted-ink hover:text-carbon"
            }`}
          >
            <Building2 className="w-4 h-4 text-carbon" />
            <span>[01] PUBLISH &amp; VERIFY LISTING (LANDLORD)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auditor")}
            className={`px-4 py-2.5 font-bold transition-all border-t-2 border-l-2 border-r-2 flex items-center gap-2 ${
              activeTab === "auditor"
                ? "bg-surface border-carbon text-carbon shadow-docket -mb-[2px] z-10"
                : "bg-paper border-transparent text-muted-ink hover:text-carbon"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-carbon" />
            <span>
              [02] MUNICIPAL AUDITOR REVIEW QUEUE ({pendingCount} PENDING)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email-ledger")}
            className={`px-4 py-2.5 font-bold transition-all border-t-2 border-l-2 border-r-2 flex items-center gap-2 ${
              activeTab === "email-ledger"
                ? "bg-surface border-carbon text-carbon shadow-docket -mb-[2px] z-10"
                : "bg-paper border-transparent text-muted-ink hover:text-carbon"
            }`}
          >
            <Mail className="w-4 h-4 text-carbon" />
            <span>[03] RESEND TRANSACTIONAL EMAIL LEDGER ({emailLedger.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PUBLISH LISTING & SUBMIT UTILITY PROOF (LANDLORD WORKFLOW) */}
        {/* ========================================================================= */}
        {activeTab === "publish" && (
          <div className="space-y-6">
            {/* Quick Preset Banner */}
            <div className="border border-carbon bg-surface p-4 shadow-docket-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-mono text-xs font-bold text-carbon uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-radar" />
                  <span>Buildathon 1-Click Test Fixture</span>
                </div>
                <p className="text-xs text-muted-ink font-mono">
                  Populate a realistic Sylhet Shahjalal Uposhahar 3BHK flat + Jalalabad Gas utility proof in 1 click.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoFillSylhet}
                className="px-3.5 py-2 bg-radar hover:bg-radar-hover text-carbon font-mono text-xs font-bold border border-carbon shadow-docket-sm transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>⚡</span>
                <span>AUTO-FILL SAMPLE VERIFIED LISTING</span>
              </button>
            </div>

            {/* Filing Receipt Banner upon publication */}
            {filingReceipt && (
              <div className="border-2 border-evidence-green bg-emerald-50 p-5 shadow-docket space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-evidence-green">
                    <CheckCircle2 className="w-5 h-5 text-evidence-green" />
                    <span>PROPERTY PUBLISHED &amp; SUBMISSION DISPATCHED TO AUDITOR QUEUE!</span>
                  </div>
                  <span className="font-mono text-xs bg-carbon text-surface px-2 py-0.5">
                    {filingReceipt.submission.submissionCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs pt-2">
                  <div className="bg-surface p-2.5 border border-carbon">
                    <span className="text-muted-ink text-[10px] block">NEW DOCKET ID</span>
                    <span className="font-bold text-carbon text-sm">
                      {filingReceipt.property.docketId}
                    </span>
                  </div>
                  <div className="bg-surface p-2.5 border border-carbon">
                    <span className="text-muted-ink text-[10px] block">INITIAL STATUS</span>
                    <span className="font-bold text-evidence-amber">
                      {filingReceipt.submission.reviewStatus} [PHONE_CONFIRMED]
                    </span>
                  </div>
                  <div className="bg-surface p-2.5 border border-carbon">
                    <span className="text-muted-ink text-[10px] block">RESEND EMAIL RECEIPT</span>
                    <span className="font-bold text-carbon">
                      {filingReceipt.emailDispatch.deliveryMode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/discover"
                    className="px-3 py-1.5 bg-carbon text-surface hover:bg-radar hover:text-carbon font-mono text-xs font-bold border border-carbon inline-flex items-center gap-1.5"
                  >
                    <span>VIEW LIVE ON /discover MAP →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setActiveTab("auditor")}
                    className="px-3 py-1.5 bg-surface text-carbon hover:bg-paper font-mono text-xs font-bold border border-carbon inline-flex items-center gap-1.5"
                  >
                    <span>SWITCH TO AUDITOR BOARD TO APPROVE →</span>
                  </button>
                </div>
              </div>
            )}

            {/* Landlord Input Form */}
            <form onSubmit={handlePublishListing} className="space-y-6">
              {/* STEP A: PROPERTY & PRICING SPECIFICATIONS */}
              <div className="border-2 border-carbon bg-surface p-5 shadow-docket space-y-4">
                <div className="flex items-center justify-between border-b border-carbon pb-2">
                  <span className="font-mono text-xs font-bold text-carbon uppercase flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-carbon" />
                    <span>Step A: Property Details &amp; Pricing Architecture</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-ink">CIVIC STANDARDS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Listing Title (English):</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Listing Title (Bangla বাংলা):</label>
                    <input
                      type="text"
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-bangla text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">City Focus:</label>
                    <select
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value as "Dhaka" | "Sylhet" | "Chattogram")
                      }
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Chattogram">Chattogram</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Neighborhood / Area:</label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    >
                      {availableNeighborhoods.map((nb) => (
                        <option key={nb} value={nb}>
                          {nb}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="font-bold text-carbon uppercase">Physical Property Address:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pricing & 1991 Act Advance Compliance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Monthly Base Rent (BDT):</label>
                    <input
                      type="number"
                      value={monthlyRentBdt}
                      onChange={(e) => setMonthlyRentBdt(Number(e.target.value))}
                      required
                      min={1000}
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-carbon uppercase">Advance Months:</label>
                      <span
                        className={`text-[10px] font-bold ${
                          advanceMonths <= 2 ? "text-evidence-green" : "text-evidence-red"
                        }`}
                      >
                        {advanceMonths <= 2
                          ? "✓ 1991 Act Compliant"
                          : "⚠ Sec 10 Warning (>2 Mo)"}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={advanceMonths}
                      onChange={(e) => setAdvanceMonths(Number(e.target.value))}
                      required
                      min={1}
                      max={6}
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Monthly Service Charge (BDT):</label>
                    <input
                      type="number"
                      value={serviceChargeBdt}
                      onChange={(e) => setServiceChargeBdt(Number(e.target.value))}
                      min={0}
                      className="w-full border border-carbon p-2 bg-paper text-carbon font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Real-time Neighborhood Price Sanity Meter */}
                <div
                  className={`border p-3 font-mono text-xs flex items-center justify-between gap-2 ${
                    priceSanity.isAnomaly
                      ? "border-evidence-red bg-red-50 text-evidence-red"
                      : "border-evidence-green bg-emerald-50 text-evidence-green"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {priceSanity.isAnomaly ? (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    <span>{priceSanity.explanation}</span>
                  </div>
                  <span className="font-bold uppercase text-[10px] shrink-0">
                    {priceSanity.isAnomaly ? "FLAGGED ANOMALY" : "BENCHMARK APPROVED"}
                  </span>
                </div>

                {/* Structural Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Bedrooms:</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      min={1}
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Bathrooms:</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      min={1}
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">SqFt:</label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(Number(e.target.value))}
                      min={100}
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Tenant Type:</label>
                    <select
                      value={tenantType}
                      onChange={(e) =>
                        setTenantType(
                          e.target.value as "FAMILY" | "BACHELOR" | "SUBLET" | "ANY"
                        )
                      }
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    >
                      <option value="FAMILY">Family</option>
                      <option value="BACHELOR">Bachelor</option>
                      <option value="SUBLET">Sublet</option>
                      <option value="ANY">Any</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP B: PHOTO & LIVE 64-BIT dHASH PRE-SCREEN */}
              <div className="border-2 border-carbon bg-surface p-5 shadow-docket space-y-4">
                <div className="flex items-center justify-between border-b border-carbon pb-2">
                  <span className="font-mono text-xs font-bold text-carbon uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-carbon" />
                    <span>Step B: Real Image Normalization &amp; 64-Bit dHash Screening</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-ink">SHARP 9×8 GATE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Photo Display / Upload */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="relative h-44 w-full border-2 border-carbon bg-paper overflow-hidden">
                      <Image
                        src={photoUrl}
                        alt="Property preview"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <label className="flex-1 px-3 py-2 bg-paper border border-carbon hover:bg-surface text-center cursor-pointer font-bold text-xs">
                        <span>UPLOAD NEW PHOTO</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePhotoUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleSimulateStolenPhoto}
                        className="px-3 py-2 bg-red-100 border border-evidence-red text-evidence-red font-bold text-xs hover:bg-evidence-red hover:text-white transition-colors"
                      >
                        SIMULATE STOLEN PHOTO
                      </button>
                    </div>
                  </div>

                  {/* 64-Bit dHash Telemetry Preview */}
                  <div className="border border-carbon bg-paper p-3 space-y-2 font-mono text-xs">
                    <div className="font-bold text-carbon uppercase border-b border-grid-line pb-1 flex items-center justify-between">
                      <span>PRE-PUBLISH dHASH TELEMETRY</span>
                      <span className="text-[10px] text-muted-ink">64-BIT GRADIENT</span>
                    </div>

                    <div>
                      <span className="text-muted-ink text-[10px] block">HEX FINGERPRINT:</span>
                      <span className="font-bold text-carbon">{photoDhashHex}</span>
                    </div>

                    <div className="pt-1">
                      {isPhotoColliding ? (
                        <div className="bg-red-50 border border-evidence-red p-2 text-evidence-red font-bold text-xs flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 shrink-0" />
                          <span>
                            COLLISION DETECTED: This photo matches an existing Gulshan listing in the registry. Listing will be flagged upon audit.
                          </span>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-evidence-green p-2 text-evidence-green font-bold text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            PERCEPTUAL HASH CLEAN: No duplicate collision found in existing database catalog.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP C: UTILITY EVIDENCE & HOLDING TAX (ZERO-LLM-LEAK) */}
              <div className="border-2 border-carbon bg-surface p-5 shadow-docket space-y-4">
                <div className="flex items-center justify-between border-b border-carbon pb-2">
                  <span className="font-mono text-xs font-bold text-carbon uppercase flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-evidence-green" />
                    <span>Step C: Utility Meter &amp; Holding Tax Proof (Zero-LLM-Leak)</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-ink">PRIVACY MASKED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Utility Provider:</label>
                    <select
                      value={utilityProvider}
                      onChange={(e) =>
                        setUtilityProvider(e.target.value as UtilityProviderCode)
                      }
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    >
                      <option value="DESCO">DESCO (Dhaka Electric Supply)</option>
                      <option value="DPDC">DPDC (Dhaka Power Distribution)</option>
                      <option value="BPDB_SYLHET">BPDB Sylhet Metro</option>
                      <option value="BPDB_CTG">BPDB Chattogram Metro</option>
                      <option value="TITAS_GAS">Titas Gas Transmission</option>
                      <option value="JALALABAD_GAS">Jalalabad Gas T&amp;D System</option>
                      <option value="DWASA">Dhaka WASA</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Meter / Account ID:</label>
                    <input
                      type="text"
                      value={rawMeterNumber}
                      onChange={(e) => setRawMeterNumber(e.target.value)}
                      required
                      placeholder="e.g. 44910284"
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                    <div className="text-[10px] text-muted-ink">
                      Masked on Ingestion:{" "}
                      <span className="font-bold text-carbon">
                        {maskCredentialString(rawMeterNumber, utilityProvider)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Municipal Holding Tax / Ward ID:</label>
                    <input
                      type="text"
                      value={rawHoldingTaxId}
                      onChange={(e) => setRawHoldingTaxId(e.target.value)}
                      required
                      placeholder="e.g. SCC-W21-409"
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                    <div className="text-[10px] text-muted-ink">
                      Masked Token:{" "}
                      <span className="font-bold text-carbon">
                        {maskCredentialString(rawHoldingTaxId, "TAX")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Service Address on Utility Bill:</label>
                    <input
                      type="text"
                      value={claimedAddressOnBill}
                      onChange={(e) => setClaimedAddressOnBill(e.target.value)}
                      required
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                    <div className="text-[10px] text-muted-ink">
                      Address Token Match:{" "}
                      <span
                        className={`font-bold ${
                          liveAddressMatchScore >= 80 ? "text-evidence-green" : "text-evidence-red"
                        }`}
                      >
                        {liveAddressMatchScore}% Similarity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Applicant Name:</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-carbon uppercase">Notification Email (Resend):</label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      required
                      className="w-full border border-carbon p-2 bg-paper text-carbon text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3.5 bg-radar hover:bg-radar-hover text-carbon font-mono text-sm font-bold border-2 border-carbon shadow-docket flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-carbon" />
                    <span>PUBLISHING LISTING &amp; DISPATCHING RESEND RECEIPT...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-carbon" />
                    <span>PUBLISH PROPERTY &amp; DISPATCH TO MUNICIPAL AUDITOR QUEUE →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MUNICIPAL AUDITOR REVIEW QUEUE (AUDITOR WORKFLOW) */}
        {/* ========================================================================= */}
        {activeTab === "auditor" && (
          <div className="space-y-5">
            {/* Review Success Confirmation Alert */}
            {reviewSuccessBanner && (
              <div className="bg-emerald-50 border-2 border-evidence-green p-4 font-mono text-xs text-evidence-green font-bold flex items-center justify-between gap-2 shadow-docket-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{reviewSuccessBanner}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewSuccessBanner(null)}
                  className="text-carbon hover:underline"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Filter Pills & Switcher Banner */}
            <div className="border border-carbon bg-surface p-4 shadow-docket-sm flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-carbon uppercase mr-1">FILTER QUEUE:</span>
                {(["ALL", "PENDING", "VERIFIED", "FLAGGED"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setAuditorFilter(filter)}
                    className={`px-3 py-1 font-bold border transition-colors ${
                      auditorFilter === filter
                        ? "bg-carbon text-surface border-carbon"
                        : "bg-paper text-carbon border-carbon hover:bg-surface"
                    }`}
                  >
                    {filter === "ALL"
                      ? `ALL (${submissions.length})`
                      : filter === "PENDING"
                      ? `PENDING (${pendingCount})`
                      : filter === "VERIFIED"
                      ? `VERIFIED (${verifiedCount})`
                      : `FLAGGED (${flaggedCount})`}
                  </button>
                ))}
              </div>

              {/* Persona switch button if user is not auditor */}
              {user.role !== "AUDITOR" && (
                <button
                  type="button"
                  onClick={() => switchDemoPersona("AUDITOR")}
                  className="px-3 py-1.5 bg-radar text-carbon font-bold border border-carbon shadow-docket-sm hover:bg-radar-hover transition-colors flex items-center gap-1 self-start md:self-auto"
                >
                  <span>⚡</span>
                  <span>SWITCH TO AUDITOR FARHANA YASMIN</span>
                </button>
              )}
            </div>

            {/* Submissions List */}
            {isLoadingQueue ? (
              <div className="border border-carbon bg-surface p-12 text-center font-mono text-xs text-muted-ink">
                LOADING MUNICIPAL AUDITOR QUEUE...
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="border border-carbon bg-surface p-12 text-center font-mono text-xs text-muted-ink">
                NO SUBMISSIONS MATCHING ACTIVE FILTER
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredSubmissions.map((sub) => {
                  const isPending = sub.reviewStatus === "PENDING";
                  const isVerified = sub.reviewStatus === "VERIFIED";
                  const isFlagged = sub.reviewStatus === "FLAGGED";
                  const isProcessing = processingSubmissionId === sub.id;

                  return (
                    <div
                      key={sub.id}
                      className={`border-2 p-5 shadow-docket space-y-4 ${
                        isFlagged
                          ? "border-evidence-red bg-red-50/40"
                          : isVerified
                          ? "border-evidence-green bg-emerald-50/30"
                          : "border-carbon bg-surface"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-grid-line pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                            <span className="font-bold bg-carbon text-surface px-1.5 py-0.5">
                              {sub.submissionCode}
                            </span>
                            <span className="font-bold text-carbon">
                              DOCKET: {sub.propertyDocketId}
                            </span>
                            <span className="text-muted-ink border border-grid-line px-1 py-0.2">
                              {sub.city} • {sub.neighborhood}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-carbon">{sub.propertyTitle}</h3>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <VerificationStamp
                            tier={sub.grantedTier}
                            riskSeverity={isFlagged ? "CRITICAL" : "LOW"}
                          />
                        </div>
                      </div>

                      {/* Evidence Metrics Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                        <div className="bg-paper p-2.5 border border-grid-line space-y-1">
                          <span className="text-muted-ink text-[10px] block uppercase">
                            APPLICANT CLAIM
                          </span>
                          <span className="font-bold text-carbon text-xs block truncate">
                            {sub.applicantName}
                          </span>
                          <span className="text-[10px] text-muted-ink truncate block">
                            {sub.applicantEmail}
                          </span>
                        </div>

                        <div className="bg-paper p-2.5 border border-grid-line space-y-1">
                          <span className="text-muted-ink text-[10px] block uppercase">
                            UTILITY PROVIDER &amp; METER
                          </span>
                          <span className="font-bold text-carbon text-xs block">
                            {sub.utilityProvider}
                          </span>
                          <span className="text-[10px] text-muted-ink font-bold block">
                            {sub.meterNumberMasked}
                          </span>
                        </div>

                        <div className="bg-paper p-2.5 border border-grid-line space-y-1">
                          <span className="text-muted-ink text-[10px] block uppercase">
                            ADDRESS TOKEN MATCH
                          </span>
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-sm ${
                                sub.addressMatchScore >= 80
                                  ? "text-evidence-green"
                                  : "text-evidence-red"
                              }`}
                            >
                              {sub.addressMatchScore}% Match
                            </span>
                            <span className="text-[10px] text-muted-ink">
                              {sub.addressMatchScore >= 80 ? "PASS" : "FLAG"}
                            </span>
                          </div>
                          <div className="w-full bg-grid-line h-1.5">
                            <div
                              style={{ width: `${sub.addressMatchScore}%` }}
                              className={`h-full ${
                                sub.addressMatchScore >= 80 ? "bg-evidence-green" : "bg-evidence-red"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="bg-paper p-2.5 border border-grid-line space-y-1">
                          <span className="text-muted-ink text-[10px] block uppercase">
                            64-BIT dHASH STATUS
                          </span>
                          <span className="font-bold text-carbon text-[11px] block">
                            {sub.photoDhashHex}
                          </span>
                          <span
                            className={`text-[10px] font-bold block ${
                              sub.photoCollisionDetected
                                ? "text-evidence-red"
                                : "text-evidence-green"
                            }`}
                          >
                            {sub.photoCollisionDetected
                              ? "⚠ CRITICAL COLLISION FLAGGED"
                              : "✓ 0 PHOTO COLLISIONS"}
                          </span>
                        </div>
                      </div>

                      {/* Bill Service Address & Reviewer Notes */}
                      <div className="bg-paper p-3 border border-grid-line font-mono text-xs space-y-1">
                        <div>
                          <strong className="text-muted-ink">SERVICE ADDRESS ON BILL:</strong>{" "}
                          <span className="text-carbon font-bold">{sub.claimedAddressOnBill}</span>
                        </div>
                        <div>
                          <strong className="text-muted-ink">AUDITOR REMARKS:</strong>{" "}
                          <span className="text-carbon">{sub.reviewerNotes}</span>
                        </div>
                        {sub.reviewedByBadge && (
                          <div className="text-[10px] text-muted-ink pt-1">
                            Audited by: <span className="font-bold text-carbon">{sub.reviewedByBadge}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Auditor Decision Controls */}
                      {isPending && (
                        <div className="border-t border-grid-line pt-3 space-y-2">
                          <div className="font-mono text-xs font-bold text-carbon uppercase flex items-center justify-between">
                            <span>MUNICIPAL AUDITOR ACTION DESK</span>
                            <span className="text-[10px] text-muted-ink">
                              ACTIVE BADGE: {user.badgeCode} ({user.fullName})
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              placeholder="Auditor memo / remarks (optional)..."
                              value={auditorNotesInput[sub.id] || ""}
                              onChange={(e) =>
                                setAuditorNotesInput((prev) => ({
                                  ...prev,
                                  [sub.id]: e.target.value,
                                }))
                              }
                              className="w-full border border-carbon px-2.5 py-1.5 bg-paper text-carbon font-mono text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleAuditorDecision(sub.id, "APPROVE_VERIFIED_LANDLORD")
                              }
                              className="px-3.5 py-2 bg-evidence-green hover:bg-emerald-700 text-white font-mono text-xs font-bold border border-carbon shadow-docket-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                              <span>[ ✓ STAMP: VERIFIED LANDLORD ]</span>
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handleAuditorDecision(sub.id, "APPROVE_UTILITY_MATCH")
                              }
                              className="px-3 py-2 bg-surface hover:bg-paper text-carbon font-mono text-xs font-bold border border-carbon shadow-docket-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4 text-evidence-green" />
                              <span>[ ✓ STAMP: UTILITY DOC MATCHED ]</span>
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleAuditorDecision(sub.id, "FLAG_DISCREPANCY")}
                              className="px-3 py-2 bg-evidence-red hover:bg-red-700 text-white font-mono text-xs font-bold border border-carbon shadow-docket-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              <span>[ ⚠ FLAG DISCREPANCY ]</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RESEND TRANSACTIONAL EMAIL DISPATCH LEDGER */}
        {/* ========================================================================= */}
        {activeTab === "email-ledger" && (
          <div className="space-y-4">
            <div className="border border-carbon bg-surface p-4 shadow-docket-sm flex items-center justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-carbon uppercase flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-carbon" />
                  <span>Resend Transactional Email Dispatch Vault</span>
                </div>
                <p className="font-mono text-xs text-muted-ink">
                  Every filing confirmation, verification approval, and discrepancy alert is recorded in this telemetry dossier.
                </p>
              </div>

              <span className="font-mono text-xs font-bold bg-carbon text-surface px-2.5 py-1">
                {emailLedger.length} DISPATCHES
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {emailLedger.map((email) => (
                <div
                  key={email.id}
                  className="border-2 border-carbon bg-surface p-4 shadow-docket-sm space-y-3 font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-grid-line pb-2">
                    <div className="space-y-0.5">
                      <div className="font-bold text-carbon text-sm">{email.subject}</div>
                      <div className="text-[11px] text-muted-ink">
                        To: <span className="font-bold text-carbon">{email.to}</span> | From:{" "}
                        <span>{email.from}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold border border-carbon ${
                          email.deliveryMode === "RESEND_CLOUD_API"
                            ? "bg-evidence-green text-white"
                            : "bg-paper text-carbon"
                        }`}
                      >
                        {email.deliveryMode}
                      </span>
                      <span className="text-[10px] text-muted-ink">
                        {new Date(email.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-paper p-3 border border-grid-line text-xs whitespace-pre-line text-carbon leading-relaxed">
                    {email.bodyPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
