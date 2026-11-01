"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import type { PropertyListing } from "@/types/rentradar";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";
import { BD_NEIGHBORHOOD_BENCHMARKS } from "@/lib/data/bd-neighborhood-benchmarks";
import {
  calculateHammingDistance,
  binaryToHexHash,
} from "@/lib/crypto/dhash-utils";
import type { StructuredRentalQuery } from "@/lib/ai/nl-search-parser";
import { useCivicAuth } from "@/lib/auth/auth-context";
import { VerificationStamp } from "@/components/ui/verification-stamp";
import PropertyDocketModal from "@/components/discover/PropertyDocketModal";
import {
  Search,
  Sparkles,
  MapPin,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
} from "lucide-react";

// SSR-Safe Dynamic Import of Leaflet Map Component
const RentalRadarMap = dynamic(
  () => import("@/components/discover/RentalRadarMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] bg-paper border border-carbon flex flex-col items-center justify-center p-6 space-y-3 font-mono text-xs text-muted-ink">
        <div className="w-6 h-6 border-2 border-carbon border-t-radar animate-spin" />
        <span className="uppercase tracking-wider">
          Initializing Spatial Leaflet Radar...
        </span>
      </div>
    ),
  }
);

// Sample natural language benchmark queries for judges & users
const SAMPLE_QUERIES = [
  {
    label: "সিলেটে ২০ হাজারের নিচে ফ্যামিলি বাসা",
    query: "সিলেটে ২০ হাজারের নিচে ফ্যামিলি বাসা",
    city: "Sylhet",
  },
  {
    label: "Bachelor flat near SUST Gate Akhalia under 15k",
    query: "Bachelor flat near SUST Gate Akhalia under 15k",
    city: "Sylhet",
  },
  {
    label: "Verified 3BHK in Dhanmondi or Gulshan",
    query: "Verified 3BHK in Dhanmondi or Gulshan",
    city: "Dhaka",
  },
  {
    label: "Show suspicious bait listings with duplicate photos",
    query: "Show suspicious bait listings with duplicate photos",
    city: "ALL",
  },
];

export default function DiscoverPage() {
  const { isDocketSaved, toggleSavedDocket } = useCivicAuth();

  // All listings loaded in memory
  const [properties] = useState<PropertyListing[]>(SEED_PROPERTIES);

  // Search & NL states
  const [nlInputText, setNlInputText] = useState("");
  const [isNlParsing, setIsNlParsing] = useState(false);
  const [activeNlResult, setActiveNlResult] = useState<StructuredRentalQuery | null>(null);

  // Multi-facet filter controls
  const [selectedCity, setSelectedCity] = useState<"ALL" | "Dhaka" | "Sylhet" | "Chattogram">("ALL");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("ALL");
  const [maxRentFilter, setMaxRentFilter] = useState<number | "ALL">("ALL");
  const [minBedroomsFilter, setMinBedroomsFilter] = useState<number | "ALL">("ALL");
  const [tenantTypeFilter, setTenantTypeFilter] = useState<"ALL" | "FAMILY" | "BACHELOR" | "SUBLET">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [hideHighRisk, setHideHighRisk] = useState<boolean>(false);
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"default" | "rent-asc" | "rent-desc" | "risk-asc" | "risk-desc">("default");

  // View Layout
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");

  // Interaction & Modal
  const [selectedDocketId, setSelectedDocketId] = useState<string | null>(null);
  const [inspectingProperty, setInspectingProperty] = useState<PropertyListing | null>(null);

  // Pre-calculate collision set for instant warning tags on cards
  const collisionDocketSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < properties.length; i++) {
      for (let j = i + 1; j < properties.length; j++) {
        if (
          calculateHammingDistance(properties[i].imageDhash, properties[j].imageDhash) <= 10
        ) {
          set.add(properties[i].docketId);
          set.add(properties[j].docketId);
        }
      }
    }
    return set;
  }, [properties]);

  // Available neighborhoods for current city filter
  const availableNeighborhoods = useMemo(() => {
    const all = Object.values(BD_NEIGHBORHOOD_BENCHMARKS);
    if (selectedCity === "ALL") {
      return Array.from(new Set(all.map((b) => b.neighborhood))).sort();
    }
    return all.filter((b) => b.city === selectedCity).map((b) => b.neighborhood).sort();
  }, [selectedCity]);

  // Execute Gemini / Deterministic Natural-Language Parser
  async function handleRunNlParser(queryToRun?: string) {
    const q = (queryToRun || nlInputText).trim();
    if (!q) return;

    setIsNlParsing(true);
    try {
      const res = await fetch("/api/search/nl-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error(`Parser returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.result) {
        const parsed: StructuredRentalQuery = data.result;
        setActiveNlResult(parsed);

        // Apply extracted filters
        if (parsed.city) setSelectedCity(parsed.city);
        if (parsed.neighborhood && parsed.neighborhood !== "ALL") {
          setSelectedNeighborhood(parsed.neighborhood);
        } else {
          setSelectedNeighborhood("ALL");
        }
        if (parsed.maxRentBdt) setMaxRentFilter(parsed.maxRentBdt);
        if (parsed.minBedrooms) setMinBedroomsFilter(parsed.minBedrooms);
        if (parsed.tenantType) setTenantTypeFilter(parsed.tenantType);
        if (parsed.verifiedOnly !== undefined) setVerifiedOnly(parsed.verifiedOnly);
        if (parsed.hideHighRisk !== undefined) setHideHighRisk(parsed.hideHighRisk);
      }
    } catch (err) {
      console.warn("[Discover] NL search API call failed:", err);
    } finally {
      setIsNlParsing(false);
    }
  }

  // Clear Natural Language query and restore filters
  function handleClearNlFilter() {
    setActiveNlResult(null);
    setNlInputText("");
    resetAllFilters();
  }

  function resetAllFilters() {
    setSelectedCity("ALL");
    setSelectedNeighborhood("ALL");
    setMaxRentFilter("ALL");
    setMinBedroomsFilter("ALL");
    setTenantTypeFilter("ALL");
    setVerifiedOnly(false);
    setHideHighRisk(false);
    setSavedOnly(false);
    setSortBy("default");
  }

  // Fuse.js client-side fuzzy search instance
  const fuse = useMemo(() => {
    return new Fuse(properties, {
      keys: [
        { name: "title", weight: 0.35 },
        { name: "titleBn", weight: 0.3 },
        { name: "neighborhood", weight: 0.2 },
        { name: "docketId", weight: 0.25 },
        { name: "city", weight: 0.15 },
        { name: "description", weight: 0.1 },
        { name: "descriptionBn", weight: 0.1 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
    });
  }, [properties]);

  // Compute filtered & sorted listing results
  const filteredListings = useMemo(() => {
    let result = [...properties];

    // 1. Keyword search if keywords present in active NL result or direct input
    const keywordsToSearch = activeNlResult?.keywords?.join(" ") || "";
    if (keywordsToSearch.trim()) {
      const searchHits = fuse.search(keywordsToSearch).map((hit) => hit.item);
      if (searchHits.length > 0) {
        result = searchHits;
      }
    }

    // 2. City Filter
    if (selectedCity !== "ALL") {
      result = result.filter((p) => p.city === selectedCity);
    }

    // 3. Neighborhood Filter
    if (selectedNeighborhood !== "ALL") {
      result = result.filter((p) =>
        p.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())
      );
    }

    // 4. Max Rent Filter
    if (maxRentFilter !== "ALL") {
      result = result.filter((p) => p.monthlyRentBdt <= maxRentFilter);
    }

    // 5. Min Bedrooms Filter
    if (minBedroomsFilter !== "ALL") {
      result = result.filter((p) => p.bedrooms >= minBedroomsFilter);
    }

    // 6. Tenant Type Filter
    if (tenantTypeFilter !== "ALL") {
      result = result.filter((p) => p.tenantType === tenantTypeFilter || p.tenantType === "ANY");
    }

    // 7. Verified Only
    if (verifiedOnly) {
      result = result.filter((p) => p.verificationTier !== "UNVERIFIED");
    }

    // 8. Hide High-Risk
    if (hideHighRisk) {
      result = result.filter((p) => p.riskScore < 60);
    }

    // 9. Saved / Bookmarked Only
    if (savedOnly) {
      result = result.filter((p) => isDocketSaved(p.docketId));
    }

    // 10. Sort
    if (sortBy === "rent-asc") {
      result.sort((a, b) => a.monthlyRentBdt - b.monthlyRentBdt);
    } else if (sortBy === "rent-desc") {
      result.sort((a, b) => b.monthlyRentBdt - a.monthlyRentBdt);
    } else if (sortBy === "risk-asc") {
      result.sort((a, b) => a.riskScore - b.riskScore);
    } else if (sortBy === "risk-desc") {
      result.sort((a, b) => b.riskScore - a.riskScore);
    }

    return result;
  }, [
    properties,
    fuse,
    activeNlResult,
    selectedCity,
    selectedNeighborhood,
    maxRentFilter,
    minBedroomsFilter,
    tenantTypeFilter,
    verifiedOnly,
    hideHighRisk,
    savedOnly,
    sortBy,
    isDocketSaved,
  ]);

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)]">
      {/* Top Editorial Architectural Docket Banner */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.5">
                MODULE [01]
              </span>
              <span>// SPATIAL DISCOVERY ENGINE</span>
              <span className="text-carbon font-bold">// DHAKA • SYLHET • CHATTOGRAM</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              Smart Rental Discovery &amp; Geospatial Radar
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <div className="border border-carbon bg-paper px-3 py-1.5 flex items-center gap-2 shadow-docket-sm">
              <span className="h-2 w-2 bg-evidence-green" />
              <span className="text-muted-ink">INDEX:</span>
              <span className="font-bold text-carbon">
                {properties.length} DOCKETS ARCHIVED
              </span>
            </div>

            <div className="border border-carbon bg-paper px-3 py-1.5 flex items-center gap-2 shadow-docket-sm">
              <span className="h-2 w-2 bg-radar" />
              <span className="text-muted-ink">COLLISIONS:</span>
              <span className="font-bold text-carbon">
                {collisionDocketSet.size / 2} PAIRS FLAGGED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bilingual Natural Language Search Engine Section */}
      <div className="border-b border-carbon bg-paper px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunNlParser();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon" />
              <input
                type="text"
                value={nlInputText}
                onChange={(e) => setNlInputText(e.target.value)}
                placeholder='Search naturally in Bangla or English (e.g., "সিলেটে ২০ হাজারের নিচে ফ্যামিলি বাসা" or "Verified 3BHK Dhanmondi")'
                className="w-full border-2 border-carbon bg-surface pl-10 pr-4 py-2.5 font-mono text-xs text-carbon placeholder:text-muted-ink focus:outline-none focus:ring-0 shadow-docket-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isNlParsing}
              className="px-4 py-2.5 text-xs font-mono font-bold bg-radar text-carbon border-2 border-carbon hover:bg-radar-hover shadow-docket-sm transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {isNlParsing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-carbon border-t-transparent animate-spin" />
                  <span>PARSING WITH GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-carbon" />
                  <span>RUN NL PARSER</span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Judge & User Query Chips */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="text-muted-ink font-bold uppercase mr-1">
              // 1-CLICK PRESETS:
            </span>
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNlInputText(sample.query);
                  handleRunNlParser(sample.query);
                }}
                className="px-2 py-1 bg-surface border border-carbon hover:bg-radar transition-colors text-carbon flex items-center gap-1 shadow-[1px_1px_0px_0px_#0A0A0A]"
              >
                <span>✨</span>
                <span>{sample.label}</span>
              </button>
            ))}
          </div>

          {/* Active NL Breakdown Alert Pill */}
          {activeNlResult && (
            <div className="bg-surface border-2 border-carbon p-3 shadow-docket-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold bg-carbon text-radar px-1.5 py-0.5">
                    {activeNlResult.engineUsed === "GEMINI_FLASH_LIVE"
                      ? "⚡ GEMINI 2.5 FLASH PARSER"
                      : "⚡ DETERMINISTIC BILINGUAL PARSER"}
                  </span>
                  <span className="font-mono text-xs font-bold text-carbon">
                    STRUCTURED QUERY EXTRACTED
                  </span>
                </div>
                <p className="text-xs text-muted-ink font-mono">
                  {activeNlResult.parsedExplanation}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearNlFilter}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-paper border border-carbon hover:bg-carbon hover:text-surface transition-colors flex items-center gap-1 shrink-0 self-start sm:self-center"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLEAR NL FILTER</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Facet Filter Toolbar & View Layout Switcher */}
      <div className="border-b border-carbon bg-surface px-4 py-3 sm:px-6 lg:px-8 sticky top-16 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          {/* Left Facets: City, Neighborhood, Rent, Bed, Type */}
          <div className="flex flex-wrap items-center gap-2">
            {/* City */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value as "ALL" | "Dhaka" | "Sylhet" | "Chattogram");
                setSelectedNeighborhood("ALL");
              }}
              className="bg-paper border border-carbon px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none"
            >
              <option value="ALL">City: All BD</option>
              <option value="Dhaka">City: Dhaka</option>
              <option value="Sylhet">City: Sylhet</option>
              <option value="Chattogram">City: Chattogram</option>
            </select>

            {/* Neighborhood */}
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="bg-paper border border-carbon px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none max-w-[160px]"
            >
              <option value="ALL">Zone: All Zones</option>
              {availableNeighborhoods.map((nb) => (
                <option key={nb} value={nb}>
                  {nb}
                </option>
              ))}
            </select>

            {/* Max Rent */}
            <select
              value={maxRentFilter}
              onChange={(e) =>
                setMaxRentFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
              }
              className="bg-paper border border-carbon px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none"
            >
              <option value="ALL">Max Rent: Any</option>
              <option value="15000">Max: ৳15,000</option>
              <option value="25000">Max: ৳25,000</option>
              <option value="40000">Max: ৳40,000</option>
              <option value="60000">Max: ৳60,000</option>
              <option value="100000">Max: ৳1,00,000</option>
            </select>

            {/* Min Beds */}
            <select
              value={minBedroomsFilter}
              onChange={(e) =>
                setMinBedroomsFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
              }
              className="bg-paper border border-carbon px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none"
            >
              <option value="ALL">Beds: Any</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>

            {/* Tenant Type */}
            <select
              value={tenantTypeFilter}
              onChange={(e) =>
                setTenantTypeFilter(
                  e.target.value as "ALL" | "FAMILY" | "BACHELOR" | "SUBLET"
                )
              }
              className="bg-paper border border-carbon px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none"
            >
              <option value="ALL">Tenant: Any</option>
              <option value="FAMILY">Family</option>
              <option value="BACHELOR">Bachelor</option>
              <option value="SUBLET">Sublet</option>
            </select>

            {/* Quick Check Toggles */}
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-2.5 py-1.5 border transition-colors flex items-center gap-1 ${
                verifiedOnly
                  ? "bg-carbon text-radar border-carbon font-bold"
                  : "bg-paper text-carbon border-carbon hover:bg-surface"
              }`}
            >
              <span>{verifiedOnly ? "✓" : "○"}</span>
              <span>Verified Only</span>
            </button>

            <button
              type="button"
              onClick={() => setHideHighRisk(!hideHighRisk)}
              className={`px-2.5 py-1.5 border transition-colors flex items-center gap-1 ${
                hideHighRisk
                  ? "bg-evidence-red text-white border-carbon font-bold"
                  : "bg-paper text-carbon border-carbon hover:bg-surface"
              }`}
            >
              <span>{hideHighRisk ? "✓" : "○"}</span>
              <span>Hide High-Risk</span>
            </button>

            <button
              type="button"
              onClick={() => setSavedOnly(!savedOnly)}
              className={`px-2.5 py-1.5 border transition-colors flex items-center gap-1 ${
                savedOnly
                  ? "bg-radar text-carbon border-carbon font-bold"
                  : "bg-paper text-carbon border-carbon hover:bg-surface"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved</span>
            </button>
          </div>

          {/* Right Controls: Sort & Layout Mode Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "default"
                    | "rent-asc"
                    | "rent-desc"
                    | "risk-asc"
                    | "risk-desc"
                )
              }
              className="bg-paper border border-carbon px-2 py-1.5 text-xs font-mono font-bold text-carbon focus:outline-none"
            >
              <option value="default">Sort: Recommended</option>
              <option value="rent-asc">Rent: Low to High</option>
              <option value="rent-desc">Rent: High to Low</option>
              <option value="risk-asc">Risk: Cleanest First</option>
              <option value="risk-desc">Risk: Highest Anomaly First</option>
            </select>

            <button
              type="button"
              onClick={resetAllFilters}
              title="Reset Filters"
              className="p-1.5 border border-carbon bg-paper hover:bg-surface text-carbon"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Layout Mode Switcher (Desktop) */}
            <div className="hidden md:flex items-center border border-carbon bg-paper p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2 py-1 text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                  viewMode === "split"
                    ? "bg-carbon text-surface"
                    : "text-carbon hover:bg-surface"
                }`}
                title="Split View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>SPLIT</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-2 py-1 text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-carbon text-surface"
                    : "text-carbon hover:bg-surface"
                }`}
                title="List Only"
              >
                <List className="w-3.5 h-3.5" />
                <span>LIST</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`px-2 py-1 text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                  viewMode === "map"
                    ? "bg-carbon text-surface"
                    : "text-carbon hover:bg-surface"
                }`}
                title="Map Only"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>MAP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Property Card Ledger */}
          {(viewMode === "split" || viewMode === "list") && (
            <div
              className={`${
                viewMode === "list" ? "lg:col-span-12" : "lg:col-span-7"
              } space-y-4`}
            >
              {/* Header Status Bar */}
              <div className="flex items-center justify-between border-b border-carbon pb-2 font-mono text-xs">
                <div className="font-bold text-carbon uppercase flex items-center gap-2">
                  <span>SHOWING {filteredListings.length} OF {properties.length} DOCKETS</span>
                  {selectedCity !== "ALL" && (
                    <span className="bg-radar text-carbon px-1.5 py-0.2">
                      ZONE: {selectedCity.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-muted-ink">
                  CLICK DOCKET TO INSPECT
                </div>
              </div>

              {/* No Results Fallback */}
              {filteredListings.length === 0 && (
                <div className="border-2 border-dashed border-carbon p-8 text-center space-y-3 bg-surface">
                  <div className="font-mono text-base font-bold text-carbon">
                    NO DOCKETS MATCHING ACTIVE CRITERIA
                  </div>
                  <p className="font-mono text-xs text-muted-ink max-w-md mx-auto">
                    Try broadening your rent parameters, switching city focus, or clearing the
                    natural-language filter.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 bg-carbon text-surface font-mono text-xs font-bold hover:bg-radar hover:text-carbon border border-carbon"
                  >
                    RESET ALL CRITERIA
                  </button>
                </div>
              )}

              {/* Property Cards Grid */}
              <div
                className={`grid gap-4 ${
                  viewMode === "list"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredListings.map((property) => {
                  const isSelected = property.docketId === selectedDocketId;
                  const isSaved = isDocketSaved(property.docketId);
                  const isCollision = collisionDocketSet.has(property.docketId);
                  const isHighRisk = property.riskScore >= 60;
                  const advanceTotal = property.monthlyRentBdt * property.advanceMonths;

                  return (
                    <div
                      key={property.id}
                      onClick={() => {
                        setSelectedDocketId(property.docketId);
                        setInspectingProperty(property);
                      }}
                      onMouseEnter={() => setSelectedDocketId(property.docketId)}
                      className={`border-2 border-carbon bg-surface p-4 transition-all duration-100 cursor-pointer space-y-3 relative group ${
                        isSelected
                          ? "shadow-[6px_6px_0px_0px_#0A0A0A] bg-paper/50"
                          : "shadow-docket hover:shadow-[6px_6px_0px_0px_#0A0A0A]"
                      }`}
                    >
                      {/* Duplicate Photo Collision Warning Banner */}
                      {isCollision && (
                        <div className="bg-red-50 border border-evidence-red px-2 py-1 flex items-center justify-between font-mono text-[11px] text-evidence-red font-bold">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>PHOTO COLLISION // DUPLICATE DETECTED</span>
                          </span>
                          <span className="text-[10px] bg-evidence-red text-white px-1">
                            {property.docketId.includes("043") ||
                            property.docketId.includes("014") ||
                            property.docketId.includes("023")
                              ? "SUSPECT BAIT"
                              : "ORIGINAL RECORD"}
                          </span>
                        </div>
                      )}

                      {/* Card Top Row: Docket ID, Verification, Bookmark */}
                      <div className="flex items-start justify-between gap-2 border-b border-grid-line pb-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold bg-carbon text-surface px-1.5 py-0.5">
                              {property.docketId}
                            </span>
                            <VerificationStamp
                              tier={property.verificationTier}
                              riskSeverity={
                                isHighRisk
                                  ? "CRITICAL"
                                  : property.riskScore >= 35
                                  ? "MODERATE"
                                  : "LOW"
                              }
                              size="sm"
                            />
                            <span className="font-mono text-[10px] text-muted-ink border border-grid-line px-1 py-0.5">
                              {property.city}
                            </span>
                          </div>

                          <h2 className="font-bold text-base text-carbon leading-snug group-hover:text-carbon">
                            {property.title}
                          </h2>
                          {property.titleBn && (
                            <div className="text-xs text-muted-ink font-bangla font-medium">
                              {property.titleBn}
                            </div>
                          )}
                        </div>

                        {/* Price & Action */}
                        <div className="text-right shrink-0">
                          <div className="font-mono text-lg font-bold text-carbon">
                            ৳{property.monthlyRentBdt.toLocaleString()}
                            <span className="text-xs text-muted-ink font-normal">/mo</span>
                          </div>
                          <div className="font-mono text-[10px] text-muted-ink">
                            Adv: {property.advanceMonths} mo (৳{advanceTotal.toLocaleString()})
                          </div>
                        </div>
                      </div>

                      {/* Photo Thumbnail + Specs Matrix */}
                      <div className="flex gap-3">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 border border-carbon bg-paper overflow-hidden">
                          <Image
                            src={property.imageUrl}
                            alt={property.title}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-carbon/80 text-[8px] font-mono text-center text-surface py-0.5">
                            {binaryToHexHash(property.imageDhash).slice(0, 9)}...
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                            <div className="bg-paper p-1.5 border border-grid-line">
                              <span className="text-muted-ink text-[9px] block uppercase">Space</span>
                              <span className="font-bold text-carbon">{property.sqft} sqft</span>
                            </div>
                            <div className="bg-paper p-1.5 border border-grid-line">
                              <span className="text-muted-ink text-[9px] block uppercase">Beds / Baths</span>
                              <span className="font-bold text-carbon">
                                {property.bedrooms}B / {property.bathrooms}B
                              </span>
                            </div>
                            <div className="bg-paper p-1.5 border border-grid-line">
                              <span className="text-muted-ink text-[9px] block uppercase">Floor</span>
                              <span className="font-bold text-carbon truncate">{property.floorLevel}</span>
                            </div>
                            <div className="bg-paper p-1.5 border border-grid-line">
                              <span className="text-muted-ink text-[9px] block uppercase">Tenant</span>
                              <span className="font-bold text-carbon">{property.tenantType}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-muted-ink flex items-center gap-1 font-mono">
                            <MapPin className="w-3 h-3 text-carbon shrink-0" />
                            <span className="truncate">{property.neighborhood}, {property.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Forensic Bar */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-grid-line font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold border border-carbon ${
                              isHighRisk
                                ? "bg-evidence-red text-white"
                                : property.riskScore >= 35
                                ? "bg-evidence-amber text-carbon"
                                : "bg-evidence-green text-white"
                            }`}
                          >
                            RISK {property.riskScore}/100
                          </span>

                          <span className="text-muted-ink text-[11px] hidden sm:inline">
                            Charge: ৳{property.serviceChargeBdt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavedDocket(property.docketId);
                            }}
                            className={`p-1 border border-carbon transition-colors ${
                              isSaved
                                ? "bg-radar text-carbon"
                                : "bg-surface text-carbon hover:bg-paper"
                            }`}
                            title={isSaved ? "Saved" : "Save Docket"}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDocketId(property.docketId);
                              setInspectingProperty(property);
                            }}
                            className="px-2.5 py-1 text-xs font-mono font-bold bg-carbon text-surface hover:bg-radar hover:text-carbon border border-carbon transition-colors"
                          >
                            INSPECT DOCKET →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Column: Sticky Imperative Leaflet Radar Map */}
          {(viewMode === "split" || viewMode === "map") && (
            <div
              className={`${
                viewMode === "map" ? "lg:col-span-12" : "lg:col-span-5"
              } sticky top-32 space-y-4`}
            >
              <div className="flex items-center justify-between border-b border-carbon pb-2 font-mono text-xs">
                <div className="font-bold text-carbon uppercase flex items-center gap-2">
                  <span className="h-2 w-2 bg-radar" />
                  <span>GEOSPATIAL RADAR (OSM TILES)</span>
                </div>
                <div className="text-muted-ink">
                  {filteredListings.length} PINS IN RADAR
                </div>
              </div>

              {/* Leaflet Map Component */}
              <div className="h-[560px] w-full">
                <RentalRadarMap
                  properties={filteredListings}
                  selectedDocketId={selectedDocketId}
                  onSelectProperty={(prop) => {
                    setSelectedDocketId(prop.docketId);
                    setInspectingProperty(prop);
                  }}
                  activeCity={selectedCity}
                  onCityChange={(city) => {
                    setSelectedCity(city);
                    setSelectedNeighborhood("ALL");
                  }}
                />
              </div>

              {/* Quick AI Inspector Link Banner */}
              <div className="border border-carbon bg-surface p-3 font-mono text-xs text-muted-ink flex items-center justify-between shadow-docket-sm">
                <span>WANT TO VERIFY AN ADVERT FROM SOCIAL MEDIA?</span>
                <Link
                  href="/inspector"
                  className="text-carbon font-bold underline hover:text-evidence-amber"
                >
                  OPEN AI INSPECTOR →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Property Docket Modal */}
      <PropertyDocketModal
        property={inspectingProperty}
        allProperties={properties}
        isOpen={Boolean(inspectingProperty)}
        onClose={() => setInspectingProperty(null)}
      />
    </div>
  );
}
