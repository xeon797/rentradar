/**
 * RentRadar: Bangladesh Neighborhood Rent & Utility Benchmark Registry
 * Curated 2026 inflation-adjusted baselines for Dhaka, Sylhet, and Chattogram.
 * Used for deterministic price anomaly detection (flagging >45% below-market scam bait).
 */

export interface NeighborhoodBenchmark {
  city: "Dhaka" | "Sylhet" | "Chattogram";
  neighborhood: string;
  neighborhoodBn: string;
  minBdtPerSqft: number;
  medianBdtPerSqft: number;
  maxBdtPerSqft: number;
  typical2BedMin: number;
  typical3BedMin: number;
  avgServiceCharge: number;
  utilityProvider: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const BD_NEIGHBORHOOD_BENCHMARKS: Record<string, NeighborhoodBenchmark> = {
  // DHAKA METRO
  Gulshan: {
    city: "Dhaka",
    neighborhood: "Gulshan",
    neighborhoodBn: "গুলশান",
    minBdtPerSqft: 32,
    medianBdtPerSqft: 45,
    maxBdtPerSqft: 75,
    typical2BedMin: 38000,
    typical3BedMin: 60000,
    avgServiceCharge: 8500,
    utilityProvider: "DESCO / Titas Gas",
    coordinates: { lat: 23.7925, lng: 90.4078 },
  },
  Banani: {
    city: "Dhaka",
    neighborhood: "Banani",
    neighborhoodBn: "বনানী",
    minBdtPerSqft: 30,
    medianBdtPerSqft: 42,
    maxBdtPerSqft: 68,
    typical2BedMin: 34000,
    typical3BedMin: 52000,
    avgServiceCharge: 7500,
    utilityProvider: "DESCO / Titas Gas",
    coordinates: { lat: 23.7937, lng: 90.4043 },
  },
  Dhanmondi: {
    city: "Dhaka",
    neighborhood: "Dhanmondi",
    neighborhoodBn: "ধানমন্ডি",
    minBdtPerSqft: 24,
    medianBdtPerSqft: 32,
    maxBdtPerSqft: 48,
    typical2BedMin: 24000,
    typical3BedMin: 36000,
    avgServiceCharge: 5000,
    utilityProvider: "DPDC / Titas Gas",
    coordinates: { lat: 23.7461, lng: 90.3742 },
  },
  "Bashundhara R/A": {
    city: "Dhaka",
    neighborhood: "Bashundhara R/A",
    neighborhoodBn: "বসুন্ধরা আ/এ",
    minBdtPerSqft: 20,
    medianBdtPerSqft: 28,
    maxBdtPerSqft: 42,
    typical2BedMin: 20000,
    typical3BedMin: 30000,
    avgServiceCharge: 4500,
    utilityProvider: "DESCO / LP Gas or Titas",
    coordinates: { lat: 23.8151, lng: 90.4255 },
  },
  Uttara: {
    city: "Dhaka",
    neighborhood: "Uttara",
    neighborhoodBn: "উত্তরা",
    minBdtPerSqft: 19,
    medianBdtPerSqft: 26,
    maxBdtPerSqft: 38,
    typical2BedMin: 18000,
    typical3BedMin: 27000,
    avgServiceCharge: 3500,
    utilityProvider: "DESCO / Titas Gas",
    coordinates: { lat: 23.8759, lng: 90.3795 },
  },
  Mirpur: {
    city: "Dhaka",
    neighborhood: "Mirpur",
    neighborhoodBn: "মিরপুর",
    minBdtPerSqft: 14,
    medianBdtPerSqft: 19,
    maxBdtPerSqft: 26,
    typical2BedMin: 13000,
    typical3BedMin: 19000,
    avgServiceCharge: 2000,
    utilityProvider: "DESCO / Titas Gas",
    coordinates: { lat: 23.8223, lng: 90.3654 },
  },
  Mohammadpur: {
    city: "Dhaka",
    neighborhood: "Mohammadpur",
    neighborhoodBn: "মোহাম্মদপুর",
    minBdtPerSqft: 15,
    medianBdtPerSqft: 20,
    maxBdtPerSqft: 28,
    typical2BedMin: 14000,
    typical3BedMin: 21000,
    avgServiceCharge: 2200,
    utilityProvider: "DPDC / Titas Gas",
    coordinates: { lat: 23.7658, lng: 90.3584 },
  },

  // SYLHET METRO
  "Shahjalal Uposhahar": {
    city: "Sylhet",
    neighborhood: "Shahjalal Uposhahar",
    neighborhoodBn: "শাহজালাল উপশহর",
    minBdtPerSqft: 13,
    medianBdtPerSqft: 17,
    maxBdtPerSqft: 24,
    typical2BedMin: 12000,
    typical3BedMin: 17500,
    avgServiceCharge: 1800,
    utilityProvider: "BPDB Sylhet / Jalalabad Gas",
    coordinates: { lat: 24.8872, lng: 91.8794 },
  },
  Amberkhana: {
    city: "Sylhet",
    neighborhood: "Amberkhana",
    neighborhoodBn: "আম্বরখানা",
    minBdtPerSqft: 13,
    medianBdtPerSqft: 18,
    maxBdtPerSqft: 25,
    typical2BedMin: 12500,
    typical3BedMin: 18000,
    avgServiceCharge: 1800,
    utilityProvider: "BPDB Sylhet / Jalalabad Gas",
    coordinates: { lat: 24.9033, lng: 91.8681 },
  },
  Zindabazar: {
    city: "Sylhet",
    neighborhood: "Zindabazar",
    neighborhoodBn: "জিন্দাবাজার",
    minBdtPerSqft: 15,
    medianBdtPerSqft: 20,
    maxBdtPerSqft: 28,
    typical2BedMin: 14000,
    typical3BedMin: 21000,
    avgServiceCharge: 2200,
    utilityProvider: "BPDB Sylhet / Jalalabad Gas",
    coordinates: { lat: 24.8949, lng: 91.8687 },
  },
  "Akhalia / SUST Gate": {
    city: "Sylhet",
    neighborhood: "Akhalia / SUST Gate",
    neighborhoodBn: "আখালিয়া / সাস্ট গেট",
    minBdtPerSqft: 10,
    medianBdtPerSqft: 14,
    maxBdtPerSqft: 19,
    typical2BedMin: 9000,
    typical3BedMin: 13500,
    avgServiceCharge: 1200,
    utilityProvider: "BPDB Sylhet / Jalalabad Gas",
    coordinates: { lat: 24.9202, lng: 91.8322 },
  },
  Tilagor: {
    city: "Sylhet",
    neighborhood: "Tilagor",
    neighborhoodBn: "টিলাগড়",
    minBdtPerSqft: 9,
    medianBdtPerSqft: 13,
    maxBdtPerSqft: 18,
    typical2BedMin: 8500,
    typical3BedMin: 12500,
    avgServiceCharge: 1000,
    utilityProvider: "BPDB Sylhet / Jalalabad Gas",
    coordinates: { lat: 24.8967, lng: 91.8992 },
  },

  // CHATTOGRAM METRO
  Khulshi: {
    city: "Chattogram",
    neighborhood: "Khulshi",
    neighborhoodBn: "খুলশী",
    minBdtPerSqft: 22,
    medianBdtPerSqft: 30,
    maxBdtPerSqft: 45,
    typical2BedMin: 22000,
    typical3BedMin: 34000,
    avgServiceCharge: 4500,
    utilityProvider: "BPDB Ctg / Karnaphuli Gas",
    coordinates: { lat: 22.3654, lng: 91.8021 },
  },
  Nasirabad: {
    city: "Chattogram",
    neighborhood: "Nasirabad",
    neighborhoodBn: "নাসিরাবাদ",
    minBdtPerSqft: 16,
    medianBdtPerSqft: 22,
    maxBdtPerSqft: 32,
    typical2BedMin: 16000,
    typical3BedMin: 24000,
    avgServiceCharge: 2800,
    utilityProvider: "BPDB Ctg / Karnaphuli Gas",
    coordinates: { lat: 22.3688, lng: 91.8214 },
  },
  Panchlaish: {
    city: "Chattogram",
    neighborhood: "Panchlaish",
    neighborhoodBn: "পাঁচলাইশ",
    minBdtPerSqft: 17,
    medianBdtPerSqft: 23,
    maxBdtPerSqft: 33,
    typical2BedMin: 17000,
    typical3BedMin: 25000,
    avgServiceCharge: 3000,
    utilityProvider: "BPDB Ctg / Karnaphuli Gas",
    coordinates: { lat: 22.3601, lng: 91.8315 },
  },
  Agrabad: {
    city: "Chattogram",
    neighborhood: "Agrabad",
    neighborhoodBn: "আগ্রাবাদ",
    minBdtPerSqft: 15,
    medianBdtPerSqft: 20,
    maxBdtPerSqft: 29,
    typical2BedMin: 14500,
    typical3BedMin: 22000,
    avgServiceCharge: 2500,
    utilityProvider: "BPDB Ctg / Karnaphuli Gas",
    coordinates: { lat: 22.3267, lng: 91.8123 },
  },
};

/**
 * Normalizes neighborhood names to match benchmark keys (fuzzy or casing tolerant).
 */
export function findNeighborhoodBenchmark(neighborhoodName: string): NeighborhoodBenchmark | null {
  if (!neighborhoodName) return null;
  const clean = neighborhoodName.trim().toLowerCase();

  for (const [key, b] of Object.entries(BD_NEIGHBORHOOD_BENCHMARKS)) {
    if (
      key.toLowerCase() === clean ||
      clean.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(clean) ||
      clean.includes(b.neighborhoodBn.toLowerCase())
    ) {
      return b;
    }
  }

  return null;
}

export interface AnomalyEvaluationResult {
  isAnomaly: boolean;
  deviationPercent: number;
  benchmark: NeighborhoodBenchmark | null;
  explanation: string;
}

/**
 * Evaluates whether an advertised rent is statistically anomalous against Bangladesh market norms.
 * Triggers an alert if the advertised rent is >45% below expected neighborhood baseline (classic advance scam bait).
 */
export function evaluateNeighborhoodPriceAnomaly(
  neighborhood: string,
  monthlyRentBdt: number,
  bedrooms: number,
  sqft?: number
): AnomalyEvaluationResult {
  const benchmark = findNeighborhoodBenchmark(neighborhood);

  if (!benchmark) {
    return {
      isAnomaly: false,
      deviationPercent: 0,
      benchmark: null,
      explanation: `No calibrated baseline registered for neighborhood "${neighborhood}". Manual verification advised.`,
    };
  }

  // Calculate expected baseline based on sqft or bedroom count
  let expectedRent: number;
  if (sqft && sqft > 300) {
    expectedRent = sqft * benchmark.medianBdtPerSqft;
  } else if (bedrooms >= 3) {
    expectedRent = benchmark.typical3BedMin;
  } else if (bedrooms === 2) {
    expectedRent = benchmark.typical2BedMin;
  } else {
    // 1 bed or sublet unit
    expectedRent = Math.round(benchmark.typical2BedMin * 0.65);
  }

  const deviationPercent = Math.round(((monthlyRentBdt - expectedRent) / expectedRent) * 100);

  // Severe underpricing (>45% below market median) is the hallmark of advance-fee scams
  if (deviationPercent <= -45) {
    return {
      isAnomaly: true,
      deviationPercent,
      benchmark,
      explanation: `Advertised rent of ৳${monthlyRentBdt.toLocaleString()} is ${Math.abs(
        deviationPercent
      )}% below the ${benchmark.neighborhood} median (৳${expectedRent.toLocaleString()}). High probability of advance-fee bait trap.`,
    };
  }

  // Severe overpricing (>85% above market median)
  if (deviationPercent >= 85) {
    return {
      isAnomaly: true,
      deviationPercent,
      benchmark,
      explanation: `Advertised rent is ${deviationPercent}% above neighborhood standard. Verify premium luxury inclusions.`,
    };
  }

  return {
    isAnomaly: false,
    deviationPercent,
    benchmark,
    explanation: `Advertised rent is within acceptable range (${deviationPercent > 0 ? "+" : ""}${deviationPercent}% of median) for ${benchmark.neighborhood}.`,
  };
}
