"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PropertyListing } from "@/types/rentradar";
import {
  binaryToHexHash,
  hashTo8x8Matrix,
  calculateHammingDistance,
  calculateHashSimilarityPercent,
} from "@/lib/crypto/dhash-utils";
import { evaluateNeighborhoodPriceAnomaly } from "@/lib/data/bd-neighborhood-benchmarks";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import { useCivicAuth } from "@/lib/auth/auth-context";
import {
  X,
  Bookmark,
  BookmarkCheck,
  Calculator,
  Search,
  AlertOctagon,
  Cpu,
  Coins,
  MapPin,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";

export interface PropertyDocketModalProps {
  property: PropertyListing | null;
  allProperties: PropertyListing[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDocketModal({
  property,
  allProperties,
  isOpen,
  onClose,
}: PropertyDocketModalProps) {
  const { toggleSavedDocket, isDocketSaved } = useCivicAuth();

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 1. Calculate Perceptual 64-bit dHash Matrix and Hex
  const dhashHex = useMemo(() => {
    if (!property?.imageDhash) return "0000-0000-0000-0000";
    return binaryToHexHash(property.imageDhash);
  }, [property?.imageDhash]);

  const bitMatrix = useMemo(() => {
    if (!property?.imageDhash) return [];
    return hashTo8x8Matrix(property.imageDhash);
  }, [property?.imageDhash]);

  // 2. Scan for Duplicate Image Collisions in the dataset
  const collisionMatches = useMemo(() => {
    if (!property?.imageDhash) return [];
    const results: Array<{
      matchingProperty: PropertyListing;
      hammingDistance: number;
      similarityPercent: number;
    }> = [];

    for (const other of allProperties) {
      if (other.docketId === property.docketId) continue;
      const dist = calculateHammingDistance(property.imageDhash, other.imageDhash);
      if (dist <= 10) {
        results.push({
          matchingProperty: other,
          hammingDistance: dist,
          similarityPercent: calculateHashSimilarityPercent(property.imageDhash, other.imageDhash),
        });
      }
    }
    return results.sort((a, b) => a.hammingDistance - b.hammingDistance);
  }, [property, allProperties]);

  // 3. Price Anomaly Evaluation against BD Neighborhood Benchmarks
  const anomalyEvaluation = useMemo(() => {
    if (!property) return null;
    return evaluateNeighborhoodPriceAnomaly(
      property.neighborhood,
      property.monthlyRentBdt,
      property.bedrooms,
      property.sqft
    );
  }, [property]);

  if (!isOpen || !property) return null;

  const isSaved = isDocketSaved(property.docketId);
  const isHighRisk = property.riskScore >= 60;

  // Financial Calculations
  const advanceTotal = property.monthlyRentBdt * property.advanceMonths;
  const initialMoveInCash = advanceTotal + property.monthlyRentBdt + property.serviceChargeBdt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-carbon/80 backdrop-blur-none animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-paper border-2 border-carbon shadow-[8px_8px_0px_0px_#0A0A0A] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="docket-title"
      >
        {/* Civic Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-carbon text-surface border-b-2 border-carbon">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="bg-radar text-carbon font-mono text-xs sm:text-sm font-bold px-2 py-0.5 tracking-wider">
              DOCKET: {property.docketId}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-surface/80 hidden sm:inline">
              Registry Archive // {property.city.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSavedDocket(property.docketId)}
              className={`p-1.5 border border-surface transition-colors flex items-center gap-1 text-xs font-mono font-bold ${
                isSaved ? "bg-radar text-carbon" : "bg-carbon text-surface hover:bg-surface/20"
              }`}
              title={isSaved ? "Remove from Bookmarks" : "Save Docket"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? "SAVED" : "SAVE"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-surface text-carbon border border-surface hover:bg-radar transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Forensic Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* CRITICAL ALERT: Duplicate Photo Collision Detected */}
          {collisionMatches.length > 0 && (
            <div className="bg-red-50 border-2 border-evidence-red p-4 shadow-docket-sm">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-evidence-red shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-mono text-xs font-bold text-evidence-red uppercase tracking-wider bg-evidence-red/10 px-2 py-0.5">
                      CRITICAL FORENSIC ALERT: PERCEPTUAL IMAGE COLLISION
                    </span>
                    <span className="font-mono text-xs font-bold text-carbon">
                      Hamming Distance: {collisionMatches[0].hammingDistance} bits (
                      {collisionMatches[0].similarityPercent}% Identity)
                    </span>
                  </div>
                  <p className="text-xs text-carbon">
                    This property photo is identical or visually near-identical to an existing
                    docket in our registry. In Bangladesh rental markets, copied photos often signal
                    fake advance-fee bait listings or unverified syndicated posts.
                  </p>

                  {/* Side-by-Side Comparison Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-surface p-2.5 border border-carbon text-xs space-y-1">
                      <div className="font-mono font-bold text-carbon">CURRENT DOCKET: {property.docketId}</div>
                      <div className="text-muted-ink">{property.title}</div>
                      <div className="font-mono font-bold text-carbon">
                        Claimed Rent: ৳{property.monthlyRentBdt.toLocaleString()} ({property.neighborhood}, {property.city})
                      </div>
                    </div>

                    <div className="bg-surface p-2.5 border-2 border-evidence-red text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-evidence-red">
                          COLLISION MATCH: {collisionMatches[0].matchingProperty.docketId}
                        </span>
                        <span className="font-mono text-[10px] bg-carbon text-surface px-1">
                          {collisionMatches[0].matchingProperty.verificationTier}
                        </span>
                      </div>
                      <div className="text-muted-ink truncate">
                        {collisionMatches[0].matchingProperty.title}
                      </div>
                      <div className="font-mono font-bold text-carbon">
                        Recorded Rent: ৳{collisionMatches[0].matchingProperty.monthlyRentBdt.toLocaleString()} (
                        {collisionMatches[0].matchingProperty.neighborhood},{" "}
                        {collisionMatches[0].matchingProperty.city})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Info Banner & Titles */}
          <div className="space-y-3 border-b border-carbon pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationStamp
                tier={property.verificationTier}
                riskSeverity={
                  property.riskScore >= 75
                    ? "CRITICAL"
                    : property.riskScore >= 60
                    ? "HIGH"
                    : property.riskScore >= 35
                    ? "MODERATE"
                    : "LOW"
                }
              />
              <span className="font-mono text-xs border border-carbon bg-surface px-2 py-0.5">
                CITY: {property.city.toUpperCase()}
              </span>
              <span className="font-mono text-xs border border-carbon bg-surface px-2 py-0.5">
                TENANT: {property.tenantType}
              </span>
              <span className="font-mono text-xs border border-carbon bg-surface px-2 py-0.5">
                FLOOR: {property.floorLevel}
              </span>
            </div>

            <div className="space-y-1">
              <h1 id="docket-title" className="text-xl sm:text-2xl font-bold text-carbon leading-snug">
                {property.title}
              </h1>
              {property.titleBn && (
                <div className="text-base text-muted-ink font-bangla font-medium">
                  {property.titleBn}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-ink">
              <MapPin className="w-3.5 h-3.5 text-carbon shrink-0" />
              <span>
                {property.address}, {property.neighborhood}, {property.city}
              </span>
              <span className="font-mono text-[11px] text-muted-ink ml-2">
                [{property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}]
              </span>
            </div>
          </div>

          {/* 2-Column Core Evidence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Photo & 64-bit dHash Matrix */}
            <div className="lg:col-span-5 space-y-4">
              {/* Photo Display */}
              <div className="relative border-2 border-carbon bg-carbon h-56 sm:h-64 overflow-hidden">
                <Image
                  src={property.imageUrl}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-carbon/90 text-surface text-[10px] font-mono px-2 py-0.5 border border-surface">
                  REF PHOTO #{property.docketId}
                </div>
              </div>

              {/* 64-Bit Perceptual dHash Audit Box */}
              <div className="bg-surface border border-carbon p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-grid-line pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-carbon">
                    <Cpu className="w-3.5 h-3.5 text-radar bg-carbon" />
                    <span>64-BIT dHASH FINGERPRINT</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-ink uppercase">8x8 Bit Matrix</span>
                </div>

                <div className="font-mono text-xs bg-paper p-1.5 border border-grid-line text-center font-bold tracking-wider text-carbon">
                  {dhashHex}
                </div>

                {/* 8x8 Visual Matrix */}
                <div className="flex flex-col items-center justify-center p-2 bg-paper border border-grid-line">
                  <div className="grid grid-cols-8 gap-[2px]">
                    {bitMatrix.flatMap((row, rIdx) =>
                      row.map((bit, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 border border-carbon text-[7px] font-mono flex items-center justify-center select-none font-bold ${
                            bit === 1 ? "bg-carbon text-surface" : "bg-surface text-carbon"
                          }`}
                          title={`Row ${rIdx + 1}, Col ${cIdx + 1}: ${bit}`}
                        >
                          {bit}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-muted-ink text-center">
                    Computed via 64-bit gradient difference algorithm
                  </div>
                </div>
              </div>

              {/* Risk Audit Score */}
              <div className="bg-surface border border-carbon p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-carbon uppercase">Civic Risk Metric</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 border border-carbon ${
                      isHighRisk
                        ? "bg-evidence-red text-white"
                        : property.riskScore >= 35
                        ? "bg-evidence-amber text-carbon"
                        : "bg-evidence-green text-white"
                    }`}
                  >
                    {property.riskScore} / 100
                  </span>
                </div>

                {property.flaggedReasons.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-evidence-red uppercase">
                      Flagged Forensic Warnings:
                    </span>
                    <ul className="text-xs space-y-1 text-carbon list-disc list-inside">
                      {property.flaggedReasons.map((reason, i) => (
                        <li key={i} className="text-evidence-red font-medium">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-xs text-evidence-green font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No critical anomalies flagged in initial registry scan.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Pricing, Move-In Ledger, Anomaly & Details */}
            <div className="lg:col-span-7 space-y-5">
              {/* Cashflow Breakdown Ledger */}
              <div className="bg-surface border-2 border-carbon p-4 space-y-3 shadow-docket-sm">
                <div className="flex items-center justify-between border-b border-carbon pb-2">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-carbon" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-carbon">
                      Move-In Cashflow Breakdown
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold bg-radar text-carbon px-2 py-0.5 border border-carbon">
                    ৳{property.monthlyRentBdt.toLocaleString()} / month
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-grid-line">
                    <span className="text-muted-ink">First Month Rent</span>
                    <span className="font-bold text-carbon">৳{property.monthlyRentBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-grid-line">
                    <span className="text-muted-ink">
                      Advance Deposit ({property.advanceMonths} month{property.advanceMonths > 1 ? "s" : ""})
                    </span>
                    <span className="font-bold text-carbon">৳{advanceTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-grid-line">
                    <span className="text-muted-ink">Monthly Building Service Charge</span>
                    <span className="font-bold text-carbon">
                      {property.serviceChargeBdt > 0
                        ? `৳${property.serviceChargeBdt.toLocaleString()}`
                        : "Included / None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-grid-line">
                    <span className="text-muted-ink">Utilities (WASA / Gas / Electricity)</span>
                    <span className="font-bold text-carbon">
                      {property.utilitiesIncluded ? "Included in Rent" : "Separate Meter / Actual"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm font-bold bg-paper p-2 border border-carbon">
                    <span className="text-carbon uppercase">Total First-Month Outlay:</span>
                    <span className="text-carbon font-mono text-base">
                      ৳{initialMoveInCash.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Neighborhood Rent Benchmark Comparison */}
              {anomalyEvaluation && anomalyEvaluation.benchmark && (
                <div className="bg-surface border border-carbon p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-carbon uppercase">
                      Market Benchmark // {property.neighborhood}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 border border-carbon ${
                        anomalyEvaluation.deviationPercent <= -45
                          ? "bg-evidence-red text-white"
                          : anomalyEvaluation.deviationPercent >= 50
                          ? "bg-evidence-amber text-carbon"
                          : "bg-paper text-carbon"
                      }`}
                    >
                      {anomalyEvaluation.deviationPercent > 0 ? "+" : ""}
                      {anomalyEvaluation.deviationPercent}% vs Median
                    </span>
                  </div>

                  <p className="text-xs text-muted-ink">{anomalyEvaluation.explanation}</p>

                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-center">
                    <div className="bg-paper p-1.5 border border-grid-line">
                      <div className="text-muted-ink text-[10px]">Typical 2-Bed</div>
                      <div className="font-bold text-carbon">
                        ৳{anomalyEvaluation.benchmark.typical2BedMin.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-paper p-1.5 border border-grid-line">
                      <div className="text-muted-ink text-[10px]">Typical 3-Bed</div>
                      <div className="font-bold text-carbon">
                        ৳{anomalyEvaluation.benchmark.typical3BedMin.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-paper p-1.5 border border-grid-line">
                      <div className="text-muted-ink text-[10px]">Utility Grid</div>
                      <div className="font-bold text-carbon truncate">
                        {anomalyEvaluation.benchmark.utilityProvider}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Property Structural Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="bg-surface p-2 border border-carbon">
                  <div className="text-[10px] text-muted-ink uppercase">Bedrooms</div>
                  <div className="font-bold text-carbon text-sm">{property.bedrooms} Beds</div>
                </div>
                <div className="bg-surface p-2 border border-carbon">
                  <div className="text-[10px] text-muted-ink uppercase">Bathrooms</div>
                  <div className="font-bold text-carbon text-sm">{property.bathrooms} Baths</div>
                </div>
                <div className="bg-surface p-2 border border-carbon">
                  <div className="text-[10px] text-muted-ink uppercase">Floor Area</div>
                  <div className="font-bold text-carbon text-sm">{property.sqft} sqft</div>
                </div>
                <div className="bg-surface p-2 border border-carbon">
                  <div className="text-[10px] text-muted-ink uppercase">Contact Mask</div>
                  <div className="font-bold text-carbon text-sm truncate">
                    {property.contactPhoneMasked}
                  </div>
                </div>
              </div>

              {/* Description Block */}
              <div className="bg-surface border border-carbon p-3.5 space-y-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-carbon block">
                  Listing Description & Conditions
                </span>
                <p className="text-xs text-carbon leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
                {property.descriptionBn && (
                  <p className="text-xs text-muted-ink leading-relaxed font-bangla pt-2 border-t border-grid-line">
                    {property.descriptionBn}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Civic Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface border-t-2 border-carbon">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-ink">
            <Calendar className="w-3.5 h-3.5" />
            <span>Recorded: {new Date(property.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/calculator?docket=${property.docketId}&rent=${property.monthlyRentBdt}`}
              className="px-3 py-2 text-xs font-mono font-bold bg-surface text-carbon border border-carbon hover:bg-paper shadow-docket-sm inline-flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate Affordability</span>
            </Link>

            <Link
              href={`/inspector?docket=${property.docketId}`}
              className="px-4 py-2 text-xs font-mono font-bold bg-radar text-carbon border border-carbon hover:bg-radar-hover shadow-docket inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Open in AI Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
