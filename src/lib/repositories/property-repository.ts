import { PropertyListing, VerificationTier } from "@/types/rentradar";
import { SEED_PROPERTIES } from "@/lib/data/seed-properties";
import {
  calculateHammingDistance,
  calculateHashSimilarityPercent,
  normalizeBinaryHash,
} from "@/lib/crypto/dhash-utils";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface PropertyFilterInput {
  city?: string;
  neighborhood?: string;
  minRent?: number;
  maxRent?: number;
  minBeds?: number;
  tenantType?: string;
  verifiedOnly?: boolean;
  q?: string;
}

export type PropertyDataSource = "SUPABASE_LIVE" | "LOCAL_SEED_LEDGER";

// In-memory runtime cache for demo submissions when offline
const RUNTIME_PROPERTIES_STORE: PropertyListing[] = [];

/**
 * Maps PostgreSQL snake_case row to domain PropertyListing interface.
 */
function mapDbRowToListing(row: Record<string, unknown>): PropertyListing {
  return {
    id: String(row.id),
    docketId: String(row.docket_id),
    title: String(row.title),
    titleBn: row.title_bn ? String(row.title_bn) : undefined,
    city: row.city as PropertyListing["city"],
    neighborhood: String(row.neighborhood),
    address: String(row.address),
    coordinates: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
    monthlyRentBdt: Number(row.monthly_rent_bdt),
    advanceMonths: Number(row.advance_months ?? 2),
    serviceChargeBdt: Number(row.service_charge_bdt ?? 0),
    utilitiesIncluded: Boolean(row.utilities_included),
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    sqft: Number(row.sqft),
    floorLevel: String(row.floor_level),
    tenantType: row.tenant_type as PropertyListing["tenantType"],
    description: String(row.description),
    descriptionBn: row.description_bn ? String(row.description_bn) : undefined,
    imageUrl: String(row.image_url),
    imageDhash: String(row.image_dhash),
    contactPhoneMasked: String(row.contact_phone_masked),
    verificationTier: row.verification_tier as VerificationTier,
    riskScore: Number(row.risk_score ?? 15),
    flaggedReasons: Array.isArray(row.flagged_reasons)
      ? (row.flagged_reasons as string[])
      : [],
    createdAt: String(row.created_at),
  };
}

/**
 * Retrieves all properties from Supabase when configured, or from the seed ledger.
 */
export async function getAllProperties(
  filters?: PropertyFilterInput
): Promise<{ properties: PropertyListing[]; dataSource: PropertyDataSource }> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    try {
      let query = supabase.from("properties").select("*");

      if (filters?.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters?.neighborhood) {
        query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
      }
      if (filters?.maxRent) {
        query = query.lte("monthly_rent_bdt", filters.maxRent);
      }
      if (filters?.minBeds) {
        query = query.gte("bedrooms", filters.minBeds);
      }
      if (filters?.tenantType && filters.tenantType !== "ANY") {
        query = query.eq("tenant_type", filters.tenantType);
      }
      if (filters?.verifiedOnly) {
        query = query.in("verification_tier", ["UTILITY_DOC_MATCHED", "VERIFIED_LANDLORD"]);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return {
          properties: data.map(mapDbRowToListing),
          dataSource: "SUPABASE_LIVE",
        };
      }
    } catch (err) {
      console.warn("[PropertyRepository] Supabase query failed, falling back to seed ledger:", err);
    }
  }

  // Fallback: Local Seed Ledger + Runtime Memory Store
  let combined = [...SEED_PROPERTIES, ...RUNTIME_PROPERTIES_STORE];

  if (filters) {
    if (filters.city) {
      const c = filters.city.toLowerCase();
      combined = combined.filter((p) => p.city.toLowerCase().includes(c));
    }
    if (filters.neighborhood) {
      const n = filters.neighborhood.toLowerCase();
      combined = combined.filter((p) => p.neighborhood.toLowerCase().includes(n));
    }
    if (filters.maxRent) {
      combined = combined.filter((p) => p.monthlyRentBdt <= filters.maxRent!);
    }
    if (filters.minBeds) {
      combined = combined.filter((p) => p.bedrooms >= filters.minBeds!);
    }
    if (filters.tenantType && filters.tenantType !== "ANY") {
      combined = combined.filter((p) => p.tenantType === filters.tenantType || p.tenantType === "ANY");
    }
    if (filters.verifiedOnly) {
      combined = combined.filter(
        (p) => p.verificationTier === "UTILITY_DOC_MATCHED" || p.verificationTier === "VERIFIED_LANDLORD"
      );
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      combined = combined.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleBn && p.titleBn.includes(q)) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
  }

  return {
    properties: combined,
    dataSource: "LOCAL_SEED_LEDGER",
  };
}

/**
 * Finds a single listing by either its UUID or its alphanumeric Docket ID (e.g. 'RR-DHK-041').
 */
export async function getPropertyByDocketOrId(idOrDocket: string): Promise<PropertyListing | null> {
  if (!idOrDocket) return null;
  const target = idOrDocket.trim().toUpperCase();

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .or(`docket_id.eq.${target},id.eq.${idOrDocket}`)
        .maybeSingle();

      if (!error && data) {
        return mapDbRowToListing(data);
      }
    } catch {
      // Fall through to seed ledger
    }
  }

  const all = [...SEED_PROPERTIES, ...RUNTIME_PROPERTIES_STORE];
  return (
    all.find(
      (p) => p.docketId.toUpperCase() === target || p.id.toLowerCase() === idOrDocket.toLowerCase()
    ) ?? null
  );
}

export interface DuplicateImageMatchResult {
  listing: PropertyListing;
  hammingDistance: number;
  similarityPercent: number;
}

/**
 * Searches the catalog for visually colliding photos using 64-bit dHash Hamming distance.
 * When Supabase is configured with pgvector, executes the `<~>` RPC function.
 * Seamlessly falls back to pure-TypeScript math against seed properties if offline or unseeded.
 */
export async function findDuplicatePhotosByDhash(
  targetDhash: string,
  maxDistance = 10,
  excludeDocketId?: string
): Promise<DuplicateImageMatchResult[]> {
  const normTarget = normalizeBinaryHash(targetDhash);
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("find_duplicate_property_images", {
        target_dhash: normTarget,
        max_hamming_distance: maxDistance,
      });

      if (!error && data && data.length > 0) {
        const matches: DuplicateImageMatchResult[] = [];
        for (const row of data) {
          if (excludeDocketId && row.docket_id === excludeDocketId) continue;
          const listing = await getPropertyByDocketOrId(row.docket_id);
          if (listing) {
            matches.push({
              listing,
              hammingDistance: Number(row.hamming_distance),
              similarityPercent: Number(row.similarity_percent),
            });
          }
        }
        if (matches.length > 0) {
          return matches;
        }
      }
    } catch (err) {
      console.warn("[PropertyRepository] Supabase RPC duplicate search error:", err);
    }
  }

  // Fallback: Pure TypeScript Hamming Distance calculation across SEED + RUNTIME
  const allListings = [...SEED_PROPERTIES, ...RUNTIME_PROPERTIES_STORE];
  const candidates: DuplicateImageMatchResult[] = [];

  for (const listing of allListings) {
    if (excludeDocketId && listing.docketId === excludeDocketId) continue;

    const distance = calculateHammingDistance(normTarget, listing.imageDhash);
    if (distance <= maxDistance) {
      const similarity = calculateHashSimilarityPercent(normTarget, listing.imageDhash);
      candidates.push({
        listing,
        hammingDistance: distance,
        similarityPercent: similarity,
      });
    }
  }

  // Sort by smallest Hamming distance (highest visual identity match)
  candidates.sort((a, b) => a.hammingDistance - b.hammingDistance);
  return candidates.slice(0, 5);
}

/**
 * Creates a new property listing. Persists to Supabase if available,
 * otherwise stores in the in-memory runtime ledger.
 */
export async function createPropertyListing(
  input: Omit<PropertyListing, "id" | "createdAt">
): Promise<PropertyListing> {
  const newId = `prop-${Date.now()}`;
  const now = new Date().toISOString();

  const newListing: PropertyListing = {
    ...input,
    id: newId,
    createdAt: now,
  };

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .insert({
          docket_id: newListing.docketId,
          title: newListing.title,
          title_bn: newListing.titleBn,
          city: newListing.city,
          neighborhood: newListing.neighborhood,
          address: newListing.address,
          lat: newListing.coordinates.lat,
          lng: newListing.coordinates.lng,
          monthly_rent_bdt: newListing.monthlyRentBdt,
          advance_months: newListing.advanceMonths,
          service_charge_bdt: newListing.serviceChargeBdt,
          utilities_included: newListing.utilitiesIncluded,
          bedrooms: newListing.bedrooms,
          bathrooms: newListing.bathrooms,
          sqft: newListing.sqft,
          floor_level: newListing.floorLevel,
          tenant_type: newListing.tenantType,
          description: newListing.description,
          description_bn: newListing.descriptionBn,
          image_url: newListing.imageUrl,
          image_dhash: newListing.imageDhash,
          contact_phone_masked: newListing.contactPhoneMasked,
          verification_tier: newListing.verificationTier,
          risk_score: newListing.riskScore,
          flagged_reasons: newListing.flaggedReasons,
        })
        .select()
        .single();

      if (!error && data) {
        return mapDbRowToListing(data);
      }
    } catch (err) {
      console.warn("[PropertyRepository] Supabase insert failed, storing in local runtime:", err);
    }
  }

  RUNTIME_PROPERTIES_STORE.unshift(newListing);
  return newListing;
}

/**
 * Updates the verification tier and risk score of a property listing.
 * Updates both the in-memory runtime/seed store and Supabase if configured.
 */
export async function updatePropertyVerificationTier(
  docketId: string,
  tier: VerificationTier,
  riskScore?: number
): Promise<PropertyListing | null> {
  const target = docketId.trim().toUpperCase();

  // 1. Supabase update if configured
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const updatePayload: Record<string, unknown> = {
        verification_tier: tier,
      };
      if (riskScore !== undefined) {
        updatePayload.risk_score = riskScore;
      }

      const { data, error } = await supabase
        .from("properties")
        .update(updatePayload)
        .eq("docket_id", target)
        .select()
        .single();

      if (!error && data) {
        return mapDbRowToListing(data);
      }
    } catch (err) {
      console.warn("[PropertyRepository] Supabase tier update failed, applying locally:", err);
    }
  }

  // 2. In-Memory Runtime & Seed Store update
  const allListings = [...RUNTIME_PROPERTIES_STORE, ...SEED_PROPERTIES];
  const listing = allListings.find((p) => p.docketId.toUpperCase() === target);

  if (listing) {
    listing.verificationTier = tier;
    if (riskScore !== undefined) {
      listing.riskScore = riskScore;
    }
    return listing;
  }

  return null;
}
