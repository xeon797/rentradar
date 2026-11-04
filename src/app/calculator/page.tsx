"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DollarSign,
  AlertTriangle,
  Zap,
  Flame,
  Truck,
  Building,
  TrendingUp,
  Scale,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";
import {
  TrueCostInput,
  GasType,
  ElectricityBillingMode,
  calculateBangladeshTrueRentalCost,
  CALCULATOR_PRESETS,
  CalculatorPreset,
} from "@/lib/calculator/bd-cost-engine";

function CalculatorContent() {
  const searchParams = useSearchParams();

  // Initial State derived from URL or default preset
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>("preset-dhaka-family");
  const [loadedDocketId, setLoadedDocketId] = React.useState<string | null>(null);

  // Form State
  const [city, setCity] = React.useState<"Dhaka" | "Sylhet" | "Chattogram">("Dhaka");
  const [neighborhood, setNeighborhood] = React.useState<string>("Dhanmondi");
  const [monthlyBaseRentBdt, setMonthlyBaseRentBdt] = React.useState<number>(38000);
  const [advanceMonths, setAdvanceMonths] = React.useState<number>(2);
  const [serviceChargeBdt, setServiceChargeBdt] = React.useState<number>(5000);
  const [gasType, setGasType] = React.useState<GasType>("PIPELINE_FIXED_1080");
  const [lpgCylindersPerMonth, setLpgCylindersPerMonth] = React.useState<number>(1);
  const [electricityMode, setElectricityMode] =
    React.useState<ElectricityBillingMode>("OFFICIAL_RESIDENTIAL_SLAB");
  const [monthlyKwhUsage, setMonthlyKwhUsage] = React.useState<number>(320);
  const [submeterRateBdt, setSubmeterRateBdt] = React.useState<number>(16);
  const [wasaWaterBdt, setWasaWaterBdt] = React.useState<number>(1600);
  const [internetAndTrashBdt, setInternetAndTrashBdt] = React.useState<number>(1400);
  const [brokerFeePercent, setBrokerFeePercent] = React.useState<number>(50);
  const [movingAndSetupBdt, setMovingAndSetupBdt] = React.useState<number>(15000);
  const [monthlyHouseholdIncomeBdt, setMonthlyHouseholdIncomeBdt] = React.useState<number>(110000);

  // Mounted guard for Recharts SSR
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydrate from searchParams on load
  React.useEffect(() => {
    const docketParam = searchParams.get("docket");
    const rentParam = searchParams.get("rent");
    const advanceParam = searchParams.get("advance");
    const serviceParam = searchParams.get("service");
    const cityParam = searchParams.get("city");
    const areaParam = searchParams.get("area");

    if (docketParam) {
      const found = SEED_PROPERTIES.find(
        (p) => p.docketId.toLowerCase() === docketParam.toLowerCase() || p.id === docketParam
      );
      if (found) {
        setLoadedDocketId(found.docketId);
        setCity(found.city);
        setNeighborhood(found.neighborhood);
        setMonthlyBaseRentBdt(found.monthlyRentBdt);
        setAdvanceMonths(found.advanceMonths);
        setServiceChargeBdt(found.serviceChargeBdt);
        return;
      }
    }

    if (rentParam) {
      const rent = Number(rentParam);
      if (!isNaN(rent) && rent > 0) setMonthlyBaseRentBdt(rent);
      if (advanceParam && !isNaN(Number(advanceParam))) setAdvanceMonths(Number(advanceParam));
      if (serviceParam && !isNaN(Number(serviceParam))) setServiceChargeBdt(Number(serviceParam));
      if (cityParam && (cityParam === "Dhaka" || cityParam === "Sylhet" || cityParam === "Chattogram")) {
        setCity(cityParam);
      }
      if (areaParam) setNeighborhood(areaParam);
    }
  }, [searchParams]);

  // Handle Preset Loader
  const handleApplyPreset = (preset: CalculatorPreset) => {
    setSelectedPresetId(preset.id);
    setLoadedDocketId(preset.docketRef || null);
    const inp = preset.input;
    setCity(inp.city);
    setNeighborhood(inp.neighborhood);
    setMonthlyBaseRentBdt(inp.monthlyBaseRentBdt);
    setAdvanceMonths(inp.advanceMonths);
    setServiceChargeBdt(inp.serviceChargeBdt);
    setGasType(inp.gasType);
    setLpgCylindersPerMonth(inp.lpgCylindersPerMonth);
    setElectricityMode(inp.electricityMode);
    setMonthlyKwhUsage(inp.monthlyKwhUsage);
    setSubmeterRateBdt(inp.submeterRateBdt);
    setWasaWaterBdt(inp.wasaWaterBdt);
    setInternetAndTrashBdt(inp.internetAndTrashBdt);
    setBrokerFeePercent(inp.brokerFeePercent);
    setMovingAndSetupBdt(inp.movingAndSetupBdt);
    setMonthlyHouseholdIncomeBdt(inp.monthlyHouseholdIncomeBdt);
  };

  const handleApplyPropertyFromSeed = (docketId: string) => {
    const prop = SEED_PROPERTIES.find((p) => p.docketId === docketId);
    if (!prop) return;
    setLoadedDocketId(prop.docketId);
    setCity(prop.city);
    setNeighborhood(prop.neighborhood);
    setMonthlyBaseRentBdt(prop.monthlyRentBdt);
    setAdvanceMonths(prop.advanceMonths);
    setServiceChargeBdt(prop.serviceChargeBdt);
  };

  // Run calculation
  const currentInput: TrueCostInput = {
    city,
    neighborhood,
    monthlyBaseRentBdt,
    advanceMonths,
    serviceChargeBdt,
    gasType,
    lpgCylindersPerMonth,
    electricityMode,
    monthlyKwhUsage,
    submeterRateBdt,
    wasaWaterBdt,
    internetAndTrashBdt,
    brokerFeePercent,
    movingAndSetupBdt,
    monthlyHouseholdIncomeBdt,
  };

  const result = calculateBangladeshTrueRentalCost(currentInput);

  // Custom Recharts Tooltip
  interface TooltipPayloadEntry {
    name?: string;
    value?: number;
    color?: string;
    fill?: string;
  }

  const CustomBarTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayloadEntry[];
    label?: string | number;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border-2 border-carbon p-3 shadow-docket font-mono text-xs">
          <div className="font-bold text-carbon border-b border-carbon/20 pb-1 mb-2">
            {label}
          </div>
          {payload.map((entry, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-muted-ink">
                <span
                  className="h-2 w-2 inline-block border border-carbon"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-carbon">
                ৳{Number(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-paper min-h-[calc(100vh-4rem)] pb-16">
      {/* Top Header & Telemetry Bar */}
      <div className="border-b-2 border-carbon bg-surface px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-ink">
              <span className="bg-carbon text-surface font-bold px-1.5 py-0.5 text-[10px]">
                MODULE 04
              </span>
              <span>// FINANCIAL AUDIT &amp; CASHFLOW</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-carbon">
              True-Cost &amp; Move-In Shock Calculator
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="border border-carbon bg-paper px-2.5 py-1 text-muted-ink text-[11px] shadow-docket-sm">
              <strong className="text-carbon">BERC &amp; WASA</strong> 2026 Slabs
            </div>
            <Link href="/assistant">
              <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                <Scale className="h-3.5 w-3.5 text-evidence-amber" />
                <span>1991 RENT ACT</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Preset & Property Loader Bar */}
      <div className="border-b border-carbon/20 bg-paper/80 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-mono text-xs">
          {/* Quick Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-ink uppercase font-bold flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Quick Presets:
            </span>
            {CALCULATOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 text-[11px] font-bold border transition-all ${
                  selectedPresetId === preset.id
                    ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                    : "bg-surface text-carbon border-carbon hover:bg-radar/30"
                }`}
              >
                [{preset.badgeLabel}] {preset.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Seed Property Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-muted-ink whitespace-nowrap">Load Listing:</span>
            <select
              value={loadedDocketId || ""}
              onChange={(e) => handleApplyPropertyFromSeed(e.target.value)}
              className="bg-surface border border-carbon px-2.5 py-1 text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-carbon"
            >
              <option value="" disabled>
                -- Select Seed Property Docket --
              </option>
              {SEED_PROPERTIES.map((prop) => (
                <option key={prop.docketId} value={prop.docketId}>
                  [{prop.docketId}] {prop.neighborhood} - ৳{prop.monthlyRentBdt.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loaded Docket Banner if present */}
        {loadedDocketId && (
          <div className="mx-auto max-w-7xl mt-2 pt-2 border-t border-carbon/10 flex items-center gap-2 font-mono text-xs text-evidence-green">
            <CheckCircle2 className="h-3.5 w-3.5 text-evidence-green" />
            <span>
              LOADED FROM DOCKET <strong>#{loadedDocketId}</strong> // {city} ({neighborhood}) — Base Rent ৳{monthlyBaseRentBdt.toLocaleString()}/mo
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: TACTILE PARAMETER CONSOLE (5 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border-2 border-carbon p-5 sm:p-6 shadow-docket space-y-6">
              <div className="flex items-center justify-between border-b-2 border-carbon pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-radar border border-carbon" />
                  <h2 className="font-display font-bold text-lg uppercase tracking-tight text-carbon">
                    Property Cost Parameters
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-muted-ink">PARAM CONSOLE</span>
              </div>

              {/* 1. Base Rent & Advance */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <label className="font-bold uppercase text-carbon flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-carbon" />
                      Advertised Base Rent
                    </label>
                    <span className="font-bold text-carbon text-sm">
                      ৳{monthlyBaseRentBdt.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="1000"
                    value={monthlyBaseRentBdt}
                    onChange={(e) => setMonthlyBaseRentBdt(Number(e.target.value))}
                    className="w-full accent-carbon cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-muted-ink mt-0.5">
                    <span>৳5,000</span>
                    <span>৳50,000</span>
                    <span>৳1,50,000</span>
                  </div>
                </div>

                {/* Advance Months Selector */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <label className="font-bold uppercase text-carbon flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-carbon" />
                      Advance Deposit
                    </label>
                    <span className="font-bold text-carbon">
                      {advanceMonths} Month{advanceMonths > 1 ? "s" : ""} (৳{(monthlyBaseRentBdt * advanceMonths).toLocaleString()})
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 font-mono text-xs">
                    {[1, 2, 3, 4, 5, 6].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setAdvanceMonths(m)}
                        className={`py-1.5 text-center font-bold border transition-colors ${
                          advanceMonths === m
                            ? "bg-carbon text-surface border-carbon"
                            : "bg-paper text-carbon border-carbon/40 hover:border-carbon"
                        }`}
                      >
                        {m}M
                      </button>
                    ))}
                  </div>
                  {advanceMonths > 2 && (
                    <p className="mt-1.5 text-[11px] font-mono text-evidence-red flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      Section 10 Warning: &gt;1 month deposit exceeds statutory baseline.
                    </p>
                  )}
                </div>

                {/* Building Service Charge */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <label className="font-bold uppercase text-carbon">
                      Building Service Charge
                    </label>
                    <span className="font-bold text-carbon">
                      ৳{serviceChargeBdt.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="18000"
                    step="500"
                    value={serviceChargeBdt}
                    onChange={(e) => setServiceChargeBdt(Number(e.target.value))}
                    className="w-full accent-carbon cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-muted-ink mt-0.5">
                    <span>৳0 (Mess/Sublet)</span>
                    <span>৳5,000 (Standard)</span>
                    <span>৳18,000 (Luxury Lift)</span>
                  </div>
                </div>
              </div>

              {/* 2. Gas Regime Selector (Tactile Cards) */}
              <div className="space-y-2 pt-2 border-t border-carbon/20">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="font-bold uppercase text-carbon flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-radar" />
                    Gas Supply Regime
                  </label>
                  <span className="font-bold text-carbon">
                    ৳{result.monthlyGasBdt.toLocaleString()}/mo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Option 1: Pipeline Fixed */}
                  <button
                    type="button"
                    onClick={() => setGasType("PIPELINE_FIXED_1080")}
                    className={`p-2.5 text-left border transition-all ${
                      gasType === "PIPELINE_FIXED_1080"
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] uppercase">
                      Pipeline Fixed
                    </div>
                    <div className="text-[10px] opacity-80 font-mono">
                      Titas/Jalalabad Dual
                    </div>
                    <div className="text-xs font-bold font-mono mt-1 text-radar">
                      ৳1,080 /mo
                    </div>
                  </button>

                  {/* Option 2: Prepaid Meter */}
                  <button
                    type="button"
                    onClick={() => setGasType("PIPELINE_PREPAID")}
                    className={`p-2.5 text-left border transition-all ${
                      gasType === "PIPELINE_PREPAID"
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] uppercase">
                      Prepaid Gas
                    </div>
                    <div className="text-[10px] opacity-80 font-mono">
                      Smart Metered
                    </div>
                    <div className="text-xs font-bold font-mono mt-1 text-evidence-green">
                      ~৳650 /mo
                    </div>
                  </button>

                  {/* Option 3: LPG Cylinder */}
                  <button
                    type="button"
                    onClick={() => setGasType("LPG_CYLINDER")}
                    className={`p-2.5 text-left border transition-all ${
                      gasType === "LPG_CYLINDER"
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] uppercase">
                      LPG Cylinder
                    </div>
                    <div className="text-[10px] opacity-80 font-mono">
                      12kg Bottle
                    </div>
                    <div className="text-xs font-bold font-mono mt-1 text-evidence-amber">
                      ৳1,450 /cyl
                    </div>
                  </button>
                </div>

                {gasType === "LPG_CYLINDER" && (
                  <div className="bg-paper border border-carbon p-3 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-ink">Monthly Cylinders:</span>
                      <div className="flex gap-1.5">
                        {[1, 1.5, 2, 3].map((cyl) => (
                          <button
                            key={cyl}
                            type="button"
                            onClick={() => setLpgCylindersPerMonth(cyl)}
                            className={`px-2 py-0.5 text-xs font-bold border ${
                              lpgCylindersPerMonth === cyl
                                ? "bg-carbon text-surface border-carbon"
                                : "bg-surface text-carbon border-carbon/40"
                            }`}
                          >
                            {cyl}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[11px] text-evidence-amber">
                      ⚠️ LPG adds <strong>+৳{(result.annualGasCostBdt - 1080 * 12).toLocaleString()}</strong> /year over pipeline Titas gas!
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Electricity Regime Selector */}
              <div className="space-y-3 pt-2 border-t border-carbon/20">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="font-bold uppercase text-carbon flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-evidence-amber" />
                    Electricity Billing Mode
                  </label>
                  <span className="font-bold text-carbon">
                    ৳{result.actualElectricityBdt.toLocaleString()}/mo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setElectricityMode("OFFICIAL_RESIDENTIAL_SLAB")}
                    className={`p-2.5 text-left border transition-all ${
                      electricityMode === "OFFICIAL_RESIDENTIAL_SLAB"
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] uppercase">
                      Official Slab
                    </div>
                    <div className="text-[10px] opacity-80 font-mono">
                      DESCO/DPDC/BPDB
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setElectricityMode("LANDLORD_FLAT_SUBMETER")}
                    className={`p-2.5 text-left border transition-all ${
                      electricityMode === "LANDLORD_FLAT_SUBMETER"
                        ? "bg-carbon text-surface border-carbon shadow-docket-sm"
                        : "bg-paper text-carbon border-carbon/30 hover:border-carbon"
                    }`}
                  >
                    <div className="font-mono font-bold text-[11px] uppercase">
                      Sub-Meter Markup
                    </div>
                    <div className="text-[10px] opacity-80 font-mono">
                      Landlord Flat Rate
                    </div>
                  </button>
                </div>

                {/* kWh Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-muted-ink mb-1">
                    <span>Monthly Consumption (kWh):</span>
                    <span className="font-bold text-carbon">{monthlyKwhUsage} kWh</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="750"
                    step="10"
                    value={monthlyKwhUsage}
                    onChange={(e) => setMonthlyKwhUsage(Number(e.target.value))}
                    className="w-full accent-carbon cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-muted-ink">
                    <span>100 kWh (Basic)</span>
                    <span>250 kWh (Family)</span>
                    <span>500+ kWh (AC)</span>
                  </div>
                </div>

                {electricityMode === "LANDLORD_FLAT_SUBMETER" && (
                  <div className="bg-paper border border-carbon p-3 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-ink">Landlord Unit Rate:</span>
                      <div className="flex items-center gap-1">
                        <span>৳</span>
                        <input
                          type="number"
                          min="10"
                          max="25"
                          value={submeterRateBdt}
                          onChange={(e) => setSubmeterRateBdt(Number(e.target.value))}
                          className="w-16 bg-surface border border-carbon px-2 py-0.5 text-xs font-bold font-mono text-carbon"
                        />
                        <span>/unit</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-evidence-red">
                      🚨 Sub-Meter Overcharge: <strong>+৳{result.monthlySubmeterOverchargeBdt.toLocaleString()}/mo</strong> (+৳{result.annualSubmeterOverchargeBdt.toLocaleString()}/yr) over official BERC tariff!
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Other Utilities & Move-In Costs */}
              <div className="space-y-3 pt-2 border-t border-carbon/20">
                <h3 className="font-mono text-xs font-bold uppercase text-carbon">
                  Water, Civic &amp; Shifting Overheads
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-muted-ink mb-1">
                      WASA Water (BDT)
                    </label>
                    <input
                      type="number"
                      step="100"
                      value={wasaWaterBdt}
                      onChange={(e) => setWasaWaterBdt(Number(e.target.value))}
                      className="w-full bg-paper border border-carbon px-2.5 py-1 text-xs font-mono font-bold text-carbon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-muted-ink mb-1">
                      Net + Trash (BDT)
                    </label>
                    <input
                      type="number"
                      step="100"
                      value={internetAndTrashBdt}
                      onChange={(e) => setInternetAndTrashBdt(Number(e.target.value))}
                      className="w-full bg-paper border border-carbon px-2.5 py-1 text-xs font-mono font-bold text-carbon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-muted-ink mb-1">
                      Media / Broker Fee
                    </label>
                    <div className="flex gap-1 font-mono text-xs">
                      {[0, 50, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setBrokerFeePercent(pct)}
                          className={`flex-1 py-1 text-center font-bold border ${
                            brokerFeePercent === pct
                              ? "bg-carbon text-surface border-carbon"
                              : "bg-paper text-carbon border-carbon/30"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-muted-ink mb-1">
                      Shifting Truck (BDT)
                    </label>
                    <input
                      type="number"
                      step="500"
                      value={movingAndSetupBdt}
                      onChange={(e) => setMovingAndSetupBdt(Number(e.target.value))}
                      className="w-full bg-paper border border-carbon px-2.5 py-1 text-xs font-mono font-bold text-carbon"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-muted-ink mb-1">
                    <span>Monthly Household Income (Stress Test):</span>
                    <span className="font-bold text-carbon">
                      ৳{monthlyHouseholdIncomeBdt.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="350000"
                    step="5000"
                    value={monthlyHouseholdIncomeBdt}
                    onChange={(e) => setMonthlyHouseholdIncomeBdt(Number(e.target.value))}
                    className="w-full accent-carbon cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LIVE FINANCIAL SHOCK DOSSIER & RECHARTS (7 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Telemetry KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Advertised Base Rent */}
              <div className="bg-surface border-2 border-carbon p-4 shadow-docket-sm">
                <div className="flex items-center justify-between text-muted-ink font-mono text-[11px]">
                  <span>ADVERTISED BASE RENT</span>
                  <Building className="h-3.5 w-3.5" />
                </div>
                <div className="font-display font-bold text-2xl text-carbon mt-1">
                  ৳{result.input.monthlyBaseRentBdt.toLocaleString()}
                  <span className="font-mono text-xs font-normal text-muted-ink">/mo</span>
                </div>
                <div className="text-[11px] font-mono text-muted-ink mt-1">
                  What landlords post on Facebook / To-Let
                </div>
              </div>

              {/* Card 2: True Monthly Outflow */}
              <div className="bg-surface border-2 border-carbon p-4 shadow-docket-sm bg-radar/10">
                <div className="flex items-center justify-between text-carbon font-mono text-[11px] font-bold">
                  <span>TRUE MONTHLY OUTFLOW</span>
                  <TrendingUp className="h-3.5 w-3.5 text-evidence-amber" />
                </div>
                <div className="font-display font-bold text-2xl text-carbon mt-1">
                  ৳{result.trueMonthlyOutflowBdt.toLocaleString()}
                  <span className="font-mono text-xs font-normal text-muted-ink">/mo</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-evidence-amber mt-1">
                  +{result.hiddenOverheadPercent}% Hidden Monthly Overhead
                </div>
              </div>

              {/* Card 3: Day-1 Move-In Cash Shock */}
              <div className="bg-surface border-2 border-carbon p-4 shadow-docket-sm">
                <div className="flex items-center justify-between text-muted-ink font-mono text-[11px]">
                  <span>DAY-1 MOVE-IN CASH SHOCK</span>
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div className="font-display font-bold text-2xl text-carbon mt-1">
                  ৳{result.dayOneMoveInCashRequiredBdt.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-muted-ink mt-1">
                  Advance (৳{result.advanceDepositBdt.toLocaleString()}) + M1 + Broker + Truck
                </div>
              </div>

              {/* Card 4: Income Burden Ratio */}
              <div className="bg-surface border-2 border-carbon p-4 shadow-docket-sm">
                <div className="flex items-center justify-between text-muted-ink font-mono text-[11px]">
                  <span>INCOME BURDEN RATIO</span>
                  <Scale className="h-3.5 w-3.5" />
                </div>
                <div className="font-display font-bold text-2xl text-carbon mt-1 flex items-baseline gap-2">
                  <span>{result.rentToIncomeRatioPercent}%</span>
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 border ${
                      result.affordabilityVerdict === "HEALTHY (<30%)"
                        ? "bg-evidence-green/10 text-evidence-green border-evidence-green"
                        : result.affordabilityVerdict === "STRETCHED (30-42%)"
                        ? "bg-radar/30 text-carbon border-carbon"
                        : "bg-evidence-red/10 text-evidence-red border-evidence-red"
                    }`}
                  >
                    {result.affordabilityVerdict.split(" ")[0]}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-muted-ink mt-1">
                  {result.affordabilityVerdictBn}
                </div>
              </div>
            </div>

            {/* Recharts Panel 1: Monthly Cost Composition Breakdown */}
            <div className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 bg-carbon" />
                    <h3 className="font-display font-bold text-base uppercase tracking-tight text-carbon">
                      Monthly Cost Composition Breakdown
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-muted-ink">
                    Base Rent vs. Utility &amp; Building Add-Ons
                  </p>
                </div>
                <div className="font-mono text-xs font-bold text-carbon">
                  TOTAL: ৳{result.trueMonthlyOutflowBdt.toLocaleString()}/mo
                </div>
              </div>

              <div className="w-full h-64">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.chartBreakdownData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DD" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                        stroke="#52525B"
                        fontFamily="monospace"
                        fontSize={11}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#0A0A0A"
                        fontFamily="monospace"
                        fontSize={11}
                        width={95}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="amountBdt" name="Monthly Outflow" radius={[0, 0, 0, 0]}>
                        {result.chartBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0A0A0A" strokeWidth={1} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-ink border border-carbon/20">
                    Loading telemetry chart...
                  </div>
                )}
              </div>

              {/* Legend & Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-carbon/10 font-mono text-[11px]">
                {result.chartBreakdownData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 border border-carbon"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="truncate">
                      <span className="text-muted-ink">{item.name}: </span>
                      <strong className="text-carbon">৳{item.amountBdt.toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts Panel 2: 12-Month Cumulative Outflow & Month-1 Shock */}
            <div className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-carbon pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 bg-radar border border-carbon" />
                    <h3 className="font-display font-bold text-base uppercase tracking-tight text-carbon">
                      12-Month Cashflow Schedule &amp; Month-1 Shock
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-muted-ink">
                    Advertised Base Rent vs. True Outflow (Including Advance &amp; Move-In)
                  </p>
                </div>
                <div className="font-mono text-xs font-bold text-evidence-amber">
                  ANNUAL GAP: +৳{result.annualTrueCostDifferenceBdt.toLocaleString()}
                </div>
              </div>

              <div className="w-full h-64">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={result.twelveMonthTimeline}
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DD" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#52525B"
                        fontFamily="monospace"
                        fontSize={10}
                      />
                      <YAxis
                        tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                        stroke="#52525B"
                        fontFamily="monospace"
                        fontSize={11}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        wrapperStyle={{ fontFamily: "monospace", fontSize: "11px", paddingTop: "8px" }}
                      />
                      <Bar
                        dataKey="advertisedBaseRent"
                        name="Advertised Base Rent"
                        fill="#0A0A0A"
                        stroke="#0A0A0A"
                      />
                      <Bar
                        dataKey="trueCashOutflow"
                        name="True Cash Outflow"
                        fill="#FACC15"
                        stroke="#0A0A0A"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-ink border border-carbon/20">
                    Loading 12-month schedule...
                  </div>
                )}
              </div>

              {/* Callout on 12-Month Reality */}
              <div className="bg-paper border border-carbon p-3 text-xs font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-muted-ink">12-Month Total Advertised: </span>
                  <strong>৳{result.annualAdvertisedBaseRentBdt.toLocaleString()}</strong>
                  <span className="text-muted-ink"> vs True Occupancy: </span>
                  <strong className="text-carbon">৳{result.annualTotalOccupancyCostBdt.toLocaleString()}</strong>
                </div>
                <div className="font-bold text-evidence-amber">
                  Shock Delta: +৳{result.annualTrueCostDifferenceBdt.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 50/30/20 Household Budget Stress Test */}
            <div className="bg-surface border-2 border-carbon p-5 shadow-docket space-y-4">
              <div className="flex items-center justify-between border-b-2 border-carbon pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-carbon" />
                  <h3 className="font-display font-bold text-base uppercase tracking-tight text-carbon">
                    50 / 30 / 20 Household Budget Stress Test
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-carbon">
                  ৳{monthlyHouseholdIncomeBdt.toLocaleString()}/mo Income
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="border border-carbon bg-paper p-3 space-y-1">
                  <div className="flex justify-between text-muted-ink">
                    <span>50% NEEDS</span>
                    <span>৳{result.needsBudgetBdt.toLocaleString()}</span>
                  </div>
                  <div className="text-lg font-bold text-carbon">
                    {result.percentOfNeedsTakenByHousing}%
                  </div>
                  <div className="text-[10px] text-muted-ink">
                    Consumed by rent + utilities alone!
                  </div>
                </div>

                <div className="border border-carbon bg-paper p-3 space-y-1">
                  <div className="flex justify-between text-muted-ink">
                    <span>30% WANTS</span>
                    <span>৳{result.wantsBudgetBdt.toLocaleString()}</span>
                  </div>
                  <div className="text-lg font-bold text-carbon">
                    ৳{Math.max(0, result.wantsBudgetBdt).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-ink">
                    Dining, schooling, transit, personal
                  </div>
                </div>

                <div className="border border-carbon bg-paper p-3 space-y-1">
                  <div className="flex justify-between text-muted-ink">
                    <span>20% SAVINGS</span>
                    <span>৳{result.savingsBudgetBdt.toLocaleString()}</span>
                  </div>
                  <div className="text-lg font-bold text-carbon">
                    ৳{Math.max(0, result.savingsBudgetBdt).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-ink">
                    Emergency fund &amp; family safety net
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Legal Warning Callouts */}
            {(result.statutorySection10Warning || result.submeterOverchargeWarning) && (
              <div className="space-y-3">
                {result.statutorySection10Warning && (
                  <div className="bg-surface border-2 border-evidence-red p-4 shadow-docket space-y-2">
                    <div className="flex items-center gap-2 text-evidence-red font-mono text-xs font-bold">
                      <ShieldAlert className="h-4 w-4" />
                      <span>STATUTORY DEPOSIT VIOLATION // SECTION 10 OF 1991 ACT</span>
                    </div>
                    <p className="text-xs text-carbon">
                      The landlord demands <strong>{advanceMonths} months</strong> of advance deposit (৳{result.advanceDepositBdt.toLocaleString()}). Under <strong>Section 10 of the Premises Rent Control Act, 1991</strong>, demanding more than 1 month advance without written Rent Controller approval is prohibited. You have <strong>৳{result.excessAdvanceLockedBdt.toLocaleString()}</strong> in excess capital locked away!
                    </p>
                    <div className="pt-1">
                      <Link href="/assistant">
                        <Button variant="outline" size="sm" className="font-mono text-xs gap-1 text-evidence-red border-evidence-red hover:bg-evidence-red/10">
                          <span>GET SECTION 10 COUNTER-CLAUSE IN LEGAL ASSISTANT</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {result.submeterOverchargeWarning && (
                  <div className="bg-surface border-2 border-evidence-amber p-4 shadow-docket space-y-2">
                    <div className="flex items-center gap-2 text-evidence-amber font-mono text-xs font-bold">
                      <Zap className="h-4 w-4" />
                      <span>BERC SUB-METER TARIFF OVERCHARGE DETECTED</span>
                    </div>
                    <p className="text-xs text-carbon">
                      Landlord is billing electricity at <strong>৳{submeterRateBdt}/unit</strong> instead of the official progressive residential tariff (average ৳7.50–৳8.02/unit). This results in an illegal annual overcharge of <strong>+৳{result.annualSubmeterOverchargeBdt.toLocaleString()}/year</strong>.
                    </p>
                    <div className="pt-1">
                      <Link href="/assistant">
                        <Button variant="outline" size="sm" className="font-mono text-xs gap-1 text-evidence-amber border-carbon hover:bg-radar/30">
                          <span>AUDIT LEASE CLAUSE IN LEGAL ASSISTANT</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-xs text-muted-ink">
          Loading Bangladesh True-Cost Calculator Engine...
        </div>
      }
    >
      <CalculatorContent />
    </React.Suspense>
  );
}
