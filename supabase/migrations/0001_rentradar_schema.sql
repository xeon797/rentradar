-- RentRadar: Supabase PostgreSQL + pgvector Migration Schema
-- Version: 0001_rentradar_schema.sql
-- Civic-Utilitarian Rental Discovery, Multimodal Inspection & Tenant Defense Platform

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop existing tables if re-running migration cleanly
DROP FUNCTION IF EXISTS public.find_duplicate_property_images(BIT(64), INTEGER);
DROP TABLE IF EXISTS public.verification_submissions CASCADE;
DROP TABLE IF EXISTS public.inspection_dockets CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;

-- 3. Create Properties Table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  docket_id TEXT UNIQUE NOT NULL, -- e.g. 'RR-DHK-041'
  title TEXT NOT NULL,
  title_bn TEXT,
  city TEXT NOT NULL CHECK (city IN ('Dhaka', 'Sylhet', 'Chattogram')),
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  monthly_rent_bdt INTEGER NOT NULL,
  advance_months INTEGER NOT NULL DEFAULT 2,
  service_charge_bdt INTEGER NOT NULL DEFAULT 0,
  utilities_included BOOLEAN NOT NULL DEFAULT FALSE,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  sqft INTEGER NOT NULL,
  floor_level TEXT NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('FAMILY', 'BACHELOR', 'SUBLET', 'ANY')),
  description TEXT NOT NULL,
  description_bn TEXT,
  image_url TEXT NOT NULL,
  image_dhash BIT(64) NOT NULL, -- 64-bit perceptual difference hash for <~> Hamming comparison
  embedding VECTOR(768), -- Optional Gemini text-embedding vector
  contact_phone_masked TEXT NOT NULL,
  verification_tier TEXT NOT NULL DEFAULT 'UNVERIFIED' 
    CHECK (verification_tier IN ('UNVERIFIED', 'PHONE_CONFIRMED', 'UTILITY_DOC_MATCHED', 'VERIFIED_LANDLORD')),
  risk_score INTEGER NOT NULL DEFAULT 15 CHECK (risk_score >= 0 AND risk_score <= 100),
  flagged_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Inspection Dockets Table (AI Listing Inspector Audits)
CREATE TABLE public.inspection_dockets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  docket_number TEXT UNIQUE NOT NULL, -- e.g. 'RR-INSP-2026-088'
  extracted_text_raw TEXT NOT NULL,
  detected_language TEXT NOT NULL CHECK (detected_language IN ('BN', 'EN', 'MIXED')),
  extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_dhash BIT(64) NOT NULL,
  duplicate_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  overall_risk_severity TEXT NOT NULL 
    CHECK (overall_risk_severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
  overall_risk_score INTEGER NOT NULL CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  summary_verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Verification Submissions Table (Landlord Utility Bill Audits)
CREATE TABLE public.verification_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  docket_id TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  utility_provider TEXT NOT NULL 
    CHECK (utility_provider IN ('DESCO', 'DPDC', 'BPDB_SYLHET', 'TITAS', 'JALALABAD_GAS', 'WASA', 'HOLDING_TAX')),
  meter_or_account_no_masked TEXT NOT NULL,
  document_storage_path TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (review_status IN ('PENDING', 'VERIFIED', 'FLAGGED')),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for High-Velocity Geospatial and Filter Queries
CREATE INDEX IF NOT EXISTS idx_properties_city_neighborhood ON public.properties(city, neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_verification_tier ON public.properties(verification_tier);
CREATE INDEX IF NOT EXISTS idx_properties_rent_bdt ON public.properties(monthly_rent_bdt);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspection_dockets_number ON public.inspection_dockets(docket_number);

-- 7. Hamming Distance RPC Function for Photo Duplicate Detection
-- Uses PostgreSQL / pgvector bit Hamming distance operator (<~>)
CREATE OR REPLACE FUNCTION public.find_duplicate_property_images(
  target_dhash BIT(64),
  max_hamming_distance INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  docket_id TEXT,
  title TEXT,
  city TEXT,
  neighborhood TEXT,
  monthly_rent_bdt INTEGER,
  image_url TEXT,
  image_dhash_text TEXT,
  verification_tier TEXT,
  hamming_distance DOUBLE PRECISION,
  similarity_percent NUMERIC
)
LANGUAGE sql STABLE AS $$
  SELECT 
    p.id,
    p.docket_id,
    p.title,
    p.city,
    p.neighborhood,
    p.monthly_rent_bdt,
    p.image_url,
    p.image_dhash::text AS image_dhash_text,
    p.verification_tier,
    (p.image_dhash <~> target_dhash)::DOUBLE PRECISION AS hamming_distance,
    ROUND(((64.0 - (p.image_dhash <~> target_dhash)::DOUBLE PRECISION) / 64.0) * 100.0, 1) AS similarity_percent
  FROM public.properties p
  WHERE (p.image_dhash <~> target_dhash) <= max_hamming_distance
  ORDER BY hamming_distance ASC
  LIMIT 5;
$$;

-- 8. Row Level Security (RLS) Configuration
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_dockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_submissions ENABLE ROW LEVEL SECURITY;

-- Properties Policies: Anyone can view listings, authenticated users can insert/update
CREATE POLICY "Public Read Access for Properties" 
  ON public.properties FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated Users Can Insert Properties" 
  ON public.properties FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Owners Can Update Own Properties" 
  ON public.properties FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Inspection Dockets Policies: Anyone can read anonymous or generated dockets
CREATE POLICY "Public Read Access for Inspection Dockets" 
  ON public.inspection_dockets FOR SELECT 
  USING (true);

CREATE POLICY "Public & Authenticated Can Insert Inspection Dockets" 
  ON public.inspection_dockets FOR INSERT 
  WITH CHECK (true);

-- Verification Submissions Policies: Public submission allowed, reviewer read
CREATE POLICY "Users Can Insert Verification Submissions" 
  ON public.verification_submissions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users Can View Own Verification Submissions" 
  ON public.verification_submissions FOR SELECT 
  TO authenticated 
  USING (applicant_email = auth.jwt()->>'email');
