/**
 * Bangladesh True Rental Cost & Move-In Shock Calculation Engine
 * Grounded in official BERC, DESCO, DPDC, Jalalabad Gas, and WASA tariff schedules.
 */

export type GasType = "PIPELINE_FIXED_1080" | "PIPELINE_PREPAID" | "LPG_CYLINDER";
export type ElectricityBillingMode = "OFFICIAL_RESIDENTIAL_SLAB" | "LANDLORD_FLAT_SUBMETER";

export interface TrueCostInput {
  city: "Dhaka" | "Sylhet" | "Chattogram";
  neighborhood: string;
  monthlyBaseRentBdt: number;
  advanceMonths: number;
  serviceChargeBdt: number;
  gasType: GasType;
  lpgCylindersPerMonth: number; // e.g. 1 to 2
  electricityMode: ElectricityBillingMode;
  monthlyKwhUsage: number; // e.g. 250 standard, 450 with AC
  submeterRateBdt: number; // e.g. 16 BDT/unit when flat submeter
  wasaWaterBdt: number;
  internetAndTrashBdt: number;
  brokerFeePercent: number; // 0%, 50%, or 100% of 1 month base rent
  movingAndSetupBdt: number;
  monthlyHouseholdIncomeBdt: number;
}

export interface CostBreakdownItem {
  name: string;
  labelBn: string;
  amountBdt: number;
  fill: string;
}

export interface TwelveMonthTimelinePoint {
  month: string;
  monthLabel: string;
  advertisedBaseRent: number;
  trueCashOutflow: number;
  cumulativeAdvertised: number;
  cumulativeTrue: number;
  differenceBdt: number;
}

export interface TrueCostCalculationResult {
  input: TrueCostInput;
  officialElectricityBdt: number;
  actualElectricityBdt: number;
  monthlySubmeterOverchargeBdt: number;
  annualSubmeterOverchargeBdt: number;
  monthlyGasBdt: number;
  annualGasCostBdt: number;
  totalHiddenMonthlyAddonsBdt: number;
  trueMonthlyOutflowBdt: number;
  hiddenOverheadPercent: number;
  advanceDepositBdt: number;
  statutory1MonthDepositBdt: number;
  excessAdvanceLockedBdt: number;
  brokerFeeBdt: number;
  dayOneMoveInCashRequiredBdt: number;
  annualTotalOccupancyCostBdt: number;
  annualAdvertisedBaseRentBdt: number;
  annualTrueCostDifferenceBdt: number;
  rentToIncomeRatioPercent: number;
  affordabilityVerdict: "HEALTHY (<30%)" | "STRETCHED (30-42%)" | "SEVERE BURDEN (>42%)";
  affordabilityVerdictBn: string;
  needsBudgetBdt: number;
  wantsBudgetBdt: number;
  savingsBudgetBdt: number;
  percentOfNeedsTakenByHousing: number;
  chartBreakdownData: CostBreakdownItem[];
  twelveMonthTimeline: TwelveMonthTimelinePoint[];
  statutorySection10Warning: boolean;
  submeterOverchargeWarning: boolean;
}

/**
 * Calculates official DESCO / DPDC / BPDB progressive residential tariff:
 * - 0–75 kWh   @ ৳5.26
 * - 76–200 kWh @ ৳7.20
 * - 201–300 kWh @ ৳7.59
 * - 301–400 kWh @ ৳8.02
 * - 401+ kWh    @ ৳12.67
 * Demand / meter charge: ৳120
 */
export function calculateOfficialResidentialElectricity(kwh: number): number {
  if (kwh <= 0) return 0;
  let cost = 0;
  const demandCharge = 120; // BERC minimum residential meter & demand fee

  const slab1 = Math.min(kwh, 75);
  cost += slab1 * 5.26;

  if (kwh > 75) {
    const slab2 = Math.min(kwh - 75, 125);
    cost += slab2 * 7.20;
  }

  if (kwh > 200) {
    const slab3 = Math.min(kwh - 200, 100);
    cost += slab3 * 7.59;
  }

  if (kwh > 300) {
    const slab4 = Math.min(kwh - 300, 100);
    cost += slab4 * 8.02;
  }

  if (kwh > 400) {
    const slab5 = kwh - 400;
    cost += slab5 * 12.67;
  }

  return Math.round(cost + demandCharge);
}

/**
 * Deterministic calculation engine for Bangladesh rental costs.
 */
export function calculateBangladeshTrueRentalCost(
  input: TrueCostInput
): TrueCostCalculationResult {
  const baseRent = Math.max(0, input.monthlyBaseRentBdt);
  const kwh = Math.max(0, input.monthlyKwhUsage);

  // 1. Electricity calculation
  const officialElectricityBdt = calculateOfficialResidentialElectricity(kwh);
  const actualElectricityBdt =
    input.electricityMode === "LANDLORD_FLAT_SUBMETER"
      ? Math.round(kwh * (input.submeterRateBdt || 16))
      : officialElectricityBdt;

  const monthlySubmeterOverchargeBdt =
    input.electricityMode === "LANDLORD_FLAT_SUBMETER"
      ? Math.max(0, actualElectricityBdt - officialElectricityBdt)
      : 0;
  const annualSubmeterOverchargeBdt = monthlySubmeterOverchargeBdt * 12;

  // 2. Gas calculation
  let monthlyGasBdt = 1080;
  if (input.gasType === "PIPELINE_FIXED_1080") {
    monthlyGasBdt = 1080;
  } else if (input.gasType === "PIPELINE_PREPAID") {
    monthlyGasBdt = 650;
  } else if (input.gasType === "LPG_CYLINDER") {
    const count = Math.max(0.5, input.lpgCylindersPerMonth || 1);
    monthlyGasBdt = Math.round(count * 1450); // BERC average 12kg cylinder ceiling
  }
  const annualGasCostBdt = monthlyGasBdt * 12;

  // 3. Total monthly addons
  const totalHiddenMonthlyAddonsBdt =
    Math.max(0, input.serviceChargeBdt) +
    actualElectricityBdt +
    monthlyGasBdt +
    Math.max(0, input.wasaWaterBdt) +
    Math.max(0, input.internetAndTrashBdt);

  const trueMonthlyOutflowBdt = baseRent + totalHiddenMonthlyAddonsBdt;

  const hiddenOverheadPercent =
    baseRent > 0
      ? Math.round((totalHiddenMonthlyAddonsBdt / baseRent) * 1000) / 10
      : 0;

  // 4. Move-in Day 1 cash shock & deposits
  const advanceDepositBdt = baseRent * Math.max(0, input.advanceMonths);
  const statutory1MonthDepositBdt = baseRent * 1;
  const excessAdvanceLockedBdt = Math.max(
    0,
    advanceDepositBdt - baseRent * 2
  );
  const brokerFeeBdt = Math.round(
    baseRent * (Math.max(0, input.brokerFeePercent) / 100)
  );
  const movingAndSetupBdt = Math.max(0, input.movingAndSetupBdt);

  const dayOneMoveInCashRequiredBdt =
    advanceDepositBdt +
    trueMonthlyOutflowBdt +
    brokerFeeBdt +
    movingAndSetupBdt;

  const annualTotalOccupancyCostBdt =
    trueMonthlyOutflowBdt * 12 + brokerFeeBdt + movingAndSetupBdt;
  const annualAdvertisedBaseRentBdt = baseRent * 12;
  const annualTrueCostDifferenceBdt =
    annualTotalOccupancyCostBdt - annualAdvertisedBaseRentBdt;

  // 5. Affordability & 50/30/20 Stress Test
  const income = Math.max(1, input.monthlyHouseholdIncomeBdt);
  const rentToIncomeRatioPercent =
    Math.round((trueMonthlyOutflowBdt / income) * 1000) / 10;

  let affordabilityVerdict: "HEALTHY (<30%)" | "STRETCHED (30-42%)" | "SEVERE BURDEN (>42%)" =
    "HEALTHY (<30%)";
  let affordabilityVerdictBn = "সহনশীল ও স্বাস্থ্যকর (<৩০%)";

  if (rentToIncomeRatioPercent > 42) {
    affordabilityVerdict = "SEVERE BURDEN (>42%)";
    affordabilityVerdictBn = "মারাত্মক আর্থিক চাপ ও ঝুঁকি (>৪২%)";
  } else if (rentToIncomeRatioPercent >= 30) {
    affordabilityVerdict = "STRETCHED (30-42%)";
    affordabilityVerdictBn = "সীমা অতিক্রমকারী / টানাটানির বাজেট (৩০-৪২%)";
  }

  const needsBudgetBdt = Math.round(income * 0.5);
  const wantsBudgetBdt = Math.round(income * 0.3);
  const savingsBudgetBdt = Math.round(income * 0.2);
  const percentOfNeedsTakenByHousing =
    needsBudgetBdt > 0
      ? Math.round((trueMonthlyOutflowBdt / needsBudgetBdt) * 100)
      : 100;

  // 6. Chart breakdown for Recharts
  const chartBreakdownData: CostBreakdownItem[] = [
    {
      name: "Base Rent",
      labelBn: "মূল ভাড়া",
      amountBdt: baseRent,
      fill: "#0A0A0A", // carbon
    },
    {
      name: "Service Charge",
      labelBn: "সার্ভিস চার্জ",
      amountBdt: Math.max(0, input.serviceChargeBdt),
      fill: "#FACC15", // radar yellow
    },
    {
      name: "Electricity",
      labelBn: "বিদ্যুৎ বিল",
      amountBdt: actualElectricityBdt,
      fill: "#EA580C", // evidence amber/orange
    },
    {
      name: "Gas Utility",
      labelBn: "গ্যাস সরবরাহ",
      amountBdt: monthlyGasBdt,
      fill: "#2563EB", // civic blue
    },
    {
      name: "Water & Civic",
      labelBn: "পানি ও পৌরসেবা",
      amountBdt:
        Math.max(0, input.wasaWaterBdt) + Math.max(0, input.internetAndTrashBdt),
      fill: "#15803D", // evidence green
    },
  ];

  // 7. Twelve-month cumulative timeline
  const twelveMonthTimeline: TwelveMonthTimelinePoint[] = [];
  let cumulativeAdvertised = 0;
  let cumulativeTrue = 0;

  for (let m = 1; m <= 12; m++) {
    const isMoveInMonth = m === 1;
    const advertisedMonthAmount = baseRent;
    const trueMonthAmount = isMoveInMonth
      ? dayOneMoveInCashRequiredBdt
      : trueMonthlyOutflowBdt;

    cumulativeAdvertised += advertisedMonthAmount;
    cumulativeTrue += trueMonthAmount;

    twelveMonthTimeline.push({
      month: isMoveInMonth ? "M1 (Move-In)" : `M${m}`,
      monthLabel: isMoveInMonth ? "১ম মাস (অগ্রিম ও শিফটিং)" : `${m}ম মাস`,
      advertisedBaseRent: advertisedMonthAmount,
      trueCashOutflow: trueMonthAmount,
      cumulativeAdvertised,
      cumulativeTrue,
      differenceBdt: cumulativeTrue - cumulativeAdvertised,
    });
  }

  // Warnings
  const statutorySection10Warning = input.advanceMonths > 2;
  const submeterOverchargeWarning =
    input.electricityMode === "LANDLORD_FLAT_SUBMETER" &&
    input.submeterRateBdt > 10.5;

  return {
    input,
    officialElectricityBdt,
    actualElectricityBdt,
    monthlySubmeterOverchargeBdt,
    annualSubmeterOverchargeBdt,
    monthlyGasBdt,
    annualGasCostBdt,
    totalHiddenMonthlyAddonsBdt,
    trueMonthlyOutflowBdt,
    hiddenOverheadPercent,
    advanceDepositBdt,
    statutory1MonthDepositBdt,
    excessAdvanceLockedBdt,
    brokerFeeBdt,
    dayOneMoveInCashRequiredBdt,
    annualTotalOccupancyCostBdt,
    annualAdvertisedBaseRentBdt,
    annualTrueCostDifferenceBdt,
    rentToIncomeRatioPercent,
    affordabilityVerdict,
    affordabilityVerdictBn,
    needsBudgetBdt,
    wantsBudgetBdt,
    savingsBudgetBdt,
    percentOfNeedsTakenByHousing,
    chartBreakdownData,
    twelveMonthTimeline,
    statutorySection10Warning,
    submeterOverchargeWarning,
  };
}

export interface CalculatorPreset {
  id: string;
  name: string;
  nameBn: string;
  docketRef?: string;
  badgeLabel: string;
  input: TrueCostInput;
}

export const CALCULATOR_PRESETS: CalculatorPreset[] = [
  {
    id: "preset-dhaka-family",
    name: "Dhaka Family Flat (Dhanmondi / Mirpur)",
    nameBn: "ঢাকা ফ্যামিলি ফ্ল্যাট (ধানমন্ডি / মিরপুর)",
    docketRef: "RR-DHK-042",
    badgeLabel: "STANDARD FAMILY",
    input: {
      city: "Dhaka",
      neighborhood: "Dhanmondi",
      monthlyBaseRentBdt: 38000,
      advanceMonths: 2,
      serviceChargeBdt: 5000,
      gasType: "PIPELINE_FIXED_1080",
      lpgCylindersPerMonth: 1,
      electricityMode: "OFFICIAL_RESIDENTIAL_SLAB",
      monthlyKwhUsage: 320,
      submeterRateBdt: 12,
      wasaWaterBdt: 1600,
      internetAndTrashBdt: 1400,
      brokerFeePercent: 50,
      movingAndSetupBdt: 15000,
      monthlyHouseholdIncomeBdt: 110000,
    },
  },
  {
    id: "preset-sylhet-sust-bachelor",
    name: "Sylhet SUST Bachelor Mess (Akhalia Gate)",
    nameBn: "সিলেট শাবিপ্রবি ব্যাচেলর মেস (আখালিয়া গেট)",
    docketRef: "RR-SYL-012",
    badgeLabel: "STUDENT MESS TRAP",
    input: {
      city: "Sylhet",
      neighborhood: "Akhalia / SUST Gate",
      monthlyBaseRentBdt: 12000,
      advanceMonths: 2,
      serviceChargeBdt: 1500,
      gasType: "LPG_CYLINDER",
      lpgCylindersPerMonth: 1,
      electricityMode: "LANDLORD_FLAT_SUBMETER",
      monthlyKwhUsage: 180,
      submeterRateBdt: 16,
      wasaWaterBdt: 600,
      internetAndTrashBdt: 800,
      brokerFeePercent: 0,
      movingAndSetupBdt: 4000,
      monthlyHouseholdIncomeBdt: 26000,
    },
  },
  {
    id: "preset-uposhahar-hidden-trap",
    name: "Uposhahar Hidden-Fee Sublet (Sylhet)",
    nameBn: "উপশহর হিডেন-ফি সাবলেট ট্র্যাপ (সিলেট)",
    docketRef: "RR-SYL-014",
    badgeLabel: "HIGH OVERHEAD SHOCK",
    input: {
      city: "Sylhet",
      neighborhood: "Shahjalal Uposhahar",
      monthlyBaseRentBdt: 14500,
      advanceMonths: 3,
      serviceChargeBdt: 4200,
      gasType: "LPG_CYLINDER",
      lpgCylindersPerMonth: 1.5,
      electricityMode: "LANDLORD_FLAT_SUBMETER",
      monthlyKwhUsage: 290,
      submeterRateBdt: 17,
      wasaWaterBdt: 1200,
      internetAndTrashBdt: 1100,
      brokerFeePercent: 100,
      movingAndSetupBdt: 8500,
      monthlyHouseholdIncomeBdt: 36000,
    },
  },
  {
    id: "preset-gulshan-luxury",
    name: "Gulshan-2 Diplomatic Luxury 3BHK (Dhaka)",
    nameBn: "গুলশান-২ লাক্সারি ৩ বেডরুম ফ্ল্যাট (ঢাকা)",
    docketRef: "RR-DHK-041",
    badgeLabel: "DIPLOMATIC ZONE",
    input: {
      city: "Dhaka",
      neighborhood: "Gulshan",
      monthlyBaseRentBdt: 65000,
      advanceMonths: 2,
      serviceChargeBdt: 8500,
      gasType: "PIPELINE_FIXED_1080",
      lpgCylindersPerMonth: 1,
      electricityMode: "OFFICIAL_RESIDENTIAL_SLAB",
      monthlyKwhUsage: 550,
      submeterRateBdt: 12,
      wasaWaterBdt: 2500,
      internetAndTrashBdt: 2200,
      brokerFeePercent: 50,
      movingAndSetupBdt: 28000,
      monthlyHouseholdIncomeBdt: 220000,
    },
  },
];
