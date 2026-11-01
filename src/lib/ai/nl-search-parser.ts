import { GoogleGenAI, Type } from "@google/genai";

export interface StructuredRentalQuery {
  rawQuery: string;
  city: "ALL" | "Dhaka" | "Sylhet" | "Chattogram";
  neighborhood: string | "ALL";
  maxRentBdt: number | null;
  minRentBdt: number | null;
  minBedrooms: number | null;
  tenantType: "ALL" | "FAMILY" | "BACHELOR" | "SUBLET";
  verifiedOnly: boolean;
  hideHighRisk: boolean;
  keywords: string[];
  parsedExplanation: string;
  engineUsed: "GEMINI_FLASH_LIVE" | "DETERMINISTIC_BILINGUAL_PARSER";
}

/**
 * Converts Bangla numerals (০-৯) to standard Western digits (0-9).
 */
export function convertBanglaDigitsToAscii(str: string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  let result = str;
  banglaDigits.forEach((bd, idx) => {
    result = result.replaceAll(bd, String(idx));
  });
  return result;
}

/**
 * Deterministic bilingual Bangla/English regex & keyword extractor.
 * Serves as a rock-solid offline fallback and validation baseline.
 */
export function parseQueryDeterministically(rawQuery: string): StructuredRentalQuery {
  const qClean = rawQuery.trim();
  const qAscii = convertBanglaDigitsToAscii(qClean.toLowerCase());

  // 1. Detect City
  let city: StructuredRentalQuery["city"] = "ALL";
  if (
    qAscii.includes("sylhet") ||
    qClean.includes("সিলেট") ||
    qAscii.includes("uposhahar") ||
    qClean.includes("উপশহর") ||
    qAscii.includes("amberkhana") ||
    qClean.includes("আম্বরখানা") ||
    qAscii.includes("sust") ||
    qClean.includes("শাবিপ্রবি") ||
    qClean.includes("আখালিয়া") ||
    qAscii.includes("akhalia") ||
    qClean.includes("জিন্দাবাজার") ||
    qAscii.includes("zindabazar") ||
    qClean.includes("টিলাগড়") ||
    qAscii.includes("tilagor")
  ) {
    city = "Sylhet";
  } else if (
    qAscii.includes("chattogram") ||
    qAscii.includes("chittagong") ||
    qClean.includes("চট্টগ্রাম") ||
    qAscii.includes("khulshi") ||
    qClean.includes("খুলশী") ||
    qAscii.includes("nasirabad") ||
    qClean.includes("নাসিরাবাদ") ||
    qAscii.includes("panchlaish") ||
    qClean.includes("পাঁচলাইশ") ||
    qAscii.includes("agrabad") ||
    qClean.includes("আগ্রাবাদ")
  ) {
    city = "Chattogram";
  } else if (
    qAscii.includes("dhaka") ||
    qClean.includes("ঢাকা") ||
    qAscii.includes("gulshan") ||
    qClean.includes("গুলশান") ||
    qAscii.includes("banani") ||
    qClean.includes("বনানী") ||
    qAscii.includes("dhanmondi") ||
    qClean.includes("ধানমন্ডি") ||
    qAscii.includes("bashundhara") ||
    qClean.includes("বসুন্ধরা") ||
    qAscii.includes("uttara") ||
    qClean.includes("উত্তরা") ||
    qAscii.includes("mirpur") ||
    qClean.includes("মিরপুর") ||
    qAscii.includes("mohammadpur") ||
    qClean.includes("মোহাম্মদপুর")
  ) {
    city = "Dhaka";
  }

  // 2. Detect Neighborhood
  let neighborhood: string | "ALL" = "ALL";
  const neighborhoodMap: Record<string, string[]> = {
    Gulshan: ["gulshan", "গুলশান"],
    Banani: ["banani", "বনানী"],
    Dhanmondi: ["dhanmondi", "ধানমন্ডি"],
    "Bashundhara R/A": ["bashundhara", "বসুন্ধরা"],
    Uttara: ["uttara", "উত্তরা"],
    Mirpur: ["mirpur", "মিরপুর"],
    Mohammadpur: ["mohammadpur", "মোহাম্মদপুর"],
    "Shahjalal Uposhahar": ["uposhahar", "উপশহর", "shahjalal uposhahar"],
    Amberkhana: ["amberkhana", "আম্বরখানা"],
    Zindabazar: ["zindabazar", "জিন্দাবাজার"],
    "Akhalia / SUST Gate": ["akhalia", "sust", "শাবিপ্রবি", "আখালিয়া"],
    Tilagor: ["tilagor", "টিলাগড়"],
    Khulshi: ["khulshi", "খুলশী"],
    Nasirabad: ["nasirabad", "নাসিরাবাদ"],
    Panchlaish: ["panchlaish", "পাঁচলাইশ"],
    Agrabad: ["agrabad", "আগ্রাবাদ"],
  };

  for (const [canonical, aliases] of Object.entries(neighborhoodMap)) {
    if (aliases.some((alias) => qAscii.includes(alias) || qClean.includes(alias))) {
      neighborhood = canonical;
      break;
    }
  }

  // 3. Extract Rent Ceiling
  let maxRentBdt: number | null = null;
  // Matches "under 20k", "under 25000", "< 30k", "below 15k", "max 40k"
  const underKMatch = qAscii.match(/(?:under|below|max|<|less than)\s*(\d{1,3})\s*k/);
  if (underKMatch) {
    maxRentBdt = parseInt(underKMatch[1], 10) * 1000;
  }

  if (!maxRentBdt) {
    // Matches "২০ হাজার", "20 hazar", "20k"
    const hazarMatch = qAscii.match(/(\d{1,3})\s*(?:হাজার|hazar|k)/);
    if (hazarMatch) {
      maxRentBdt = parseInt(hazarMatch[1], 10) * 1000;
    }
  }

  if (!maxRentBdt) {
    // Matches raw numerals like "under 20000", "20000 tk", "২৫০০০ টাকার নিচে"
    const rawNumMatch = qAscii.match(/(?:under|<|নিচে|মধ্যে)?\s*(\d{4,6})\s*(?:tk|টাকা|bdt)?/);
    if (rawNumMatch && parseInt(rawNumMatch[1], 10) >= 3000) {
      maxRentBdt = parseInt(rawNumMatch[1], 10);
    }
  }

  // 4. Extract Bedrooms
  let minBedrooms: number | null = null;
  const bedMatch = qAscii.match(/(\d)\s*(?:bed|bhk|bedroom|রুম|বেড)/);
  if (bedMatch) {
    minBedrooms = parseInt(bedMatch[1], 10);
  }

  // 5. Extract Tenant Type
  let tenantType: StructuredRentalQuery["tenantType"] = "ALL";
  if (
    qAscii.includes("family") ||
    qClean.includes("ফ্যামিলি") ||
    qClean.includes("পরিবার")
  ) {
    tenantType = "FAMILY";
  } else if (
    qAscii.includes("bachelor") ||
    qClean.includes("ব্যাচেলর") ||
    qAscii.includes("student") ||
    qClean.includes("ছাত্র") ||
    qAscii.includes("mess") ||
    qClean.includes("মেস")
  ) {
    tenantType = "BACHELOR";
  } else if (
    qAscii.includes("sublet") ||
    qClean.includes("সাবলেট")
  ) {
    tenantType = "SUBLET";
  }

  // 6. Extract Trust & Safety Filters
  const verifiedOnly =
    qAscii.includes("verified") ||
    qClean.includes("ভেরিফাইড") ||
    qClean.includes("যাচাই") ||
    qAscii.includes("safe");

  const hideHighRisk =
    qAscii.includes("scam free") ||
    qAscii.includes("no fraud") ||
    qAscii.includes("no scam") ||
    qClean.includes("নিরাপদ") ||
    qClean.includes("ভুয়া বাদ");

  // Explanation building
  const parts: string[] = [];
  if (city !== "ALL") parts.push(`City: ${city}`);
  if (neighborhood !== "ALL") parts.push(`Neighborhood: ${neighborhood}`);
  if (maxRentBdt) parts.push(`Max Rent: ৳${maxRentBdt.toLocaleString()}`);
  if (minBedrooms) parts.push(`Min Beds: ${minBedrooms}+`);
  if (tenantType !== "ALL") parts.push(`Type: ${tenantType}`);
  if (verifiedOnly) parts.push("Verified Docs Only");
  if (hideHighRisk) parts.push("High-Risk Filtered");

  const parsedExplanation = parts.length > 0 ? parts.join(" • ") : "Broad discovery across all verified units";

  return {
    rawQuery: qClean,
    city,
    neighborhood,
    maxRentBdt,
    minRentBdt: null,
    minBedrooms,
    tenantType,
    verifiedOnly,
    hideHighRisk,
    keywords: qClean.split(/\s+/).filter((w) => w.length > 2),
    parsedExplanation,
    engineUsed: "DETERMINISTIC_BILINGUAL_PARSER",
  };
}

/**
 * Parses user query using Google Gemini 2.5 Flash structured JSON when GEMINI_API_KEY is available.
 * Gracefully falls back to deterministic parsing if offline, rate-limited, or unconfigured.
 */
export async function parseNaturalLanguageRentalQuery(
  rawQuery: string
): Promise<StructuredRentalQuery> {
  const fallback = parseQueryDeterministically(rawQuery);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("your-google-ai-studio") || apiKey.length < 10) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are RentRadar's Natural Language Search Parser for Bangladesh urban housing.
Given a user query in Bangla, English, or mixed Banglish, extract structured rental criteria.
Valid Cities: "ALL", "Dhaka", "Sylhet", "Chattogram".
Valid Neighborhoods: "ALL", "Gulshan", "Banani", "Dhanmondi", "Bashundhara R/A", "Uttara", "Mirpur", "Mohammadpur", "Shahjalal Uposhahar", "Amberkhana", "Zindabazar", "Akhalia / SUST Gate", "Tilagor", "Khulshi", "Nasirabad", "Panchlaish", "Agrabad".
Valid Tenant Types: "ALL", "FAMILY", "BACHELOR", "SUBLET".
Respond strictly in JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `User Rental Query: "${rawQuery}"\nParse this into search criteria.` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: {
              type: Type.STRING,
              enum: ["ALL", "Dhaka", "Sylhet", "Chattogram"],
            },
            neighborhood: { type: Type.STRING },
            maxRentBdt: { type: Type.INTEGER, nullable: true },
            minBedrooms: { type: Type.INTEGER, nullable: true },
            tenantType: {
              type: Type.STRING,
              enum: ["ALL", "FAMILY", "BACHELOR", "SUBLET"],
            },
            verifiedOnly: { type: Type.BOOLEAN },
            hideHighRisk: { type: Type.BOOLEAN },
            parsedExplanation: { type: Type.STRING },
          },
          required: [
            "city",
            "neighborhood",
            "tenantType",
            "verifiedOnly",
            "hideHighRisk",
            "parsedExplanation",
          ],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);

      return {
        rawQuery,
        city: (parsed.city as StructuredRentalQuery["city"]) || fallback.city,
        neighborhood: parsed.neighborhood || fallback.neighborhood,
        maxRentBdt: parsed.maxRentBdt ?? fallback.maxRentBdt,
        minRentBdt: null,
        minBedrooms: parsed.minBedrooms ?? fallback.minBedrooms,
        tenantType: (parsed.tenantType as StructuredRentalQuery["tenantType"]) || fallback.tenantType,
        verifiedOnly: Boolean(parsed.verifiedOnly || fallback.verifiedOnly),
        hideHighRisk: Boolean(parsed.hideHighRisk || fallback.hideHighRisk),
        keywords: fallback.keywords,
        parsedExplanation: parsed.parsedExplanation || fallback.parsedExplanation,
        engineUsed: "GEMINI_FLASH_LIVE",
      };
    }
  } catch (error) {
    console.warn("[NL Search Parser] Gemini call failed/fallback triggered:", error);
  }

  return fallback;
}
