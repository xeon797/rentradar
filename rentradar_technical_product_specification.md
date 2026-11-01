# RentRadar — Technical & Product Specification (`spec.md`)

## 1. Product Vision & Scope
**RentRadar** is a free-tier-first B2C rental discovery, verification, and AI-powered scam inspection platform tailored for the Bangladesh urban housing market (Dhaka, Sylhet, Chittagong). 

### Core Architectural Philosophy
1. **AI as an Evidence Collector, Never a Judge:** Gemini never labels a person a "scammer." Instead, it extracts claims from unstructured Bangla/English rental ads, cross-references them against deterministic market baselines and perceptual image hashes, and presents verifiable discrepancy evidence to the tenant.
2. **Zero Paid API Dependency:** Built strictly on free-tier infrastructure (Supabase Free, Google AI Studio Free Tier, OpenStreetMap, Resend Free, Vercel Hobby).
3. **Demo-First Reliability:** Every AI feature includes deterministic fallbacks and pre-seeded "1-Click Judge Demo Samples" so live evaluations never fail due to missing sample files or rate limits.

---

## 2. Finalized Tech Stack

| Layer | Technology | Rationale & Constraints |
| :--- | :--- | :--- |
| **IDE / Agent Environment** | Google Antigravity | Driven via modular, sequential prompts using `agents.md` and `design.md`. |
| **Framework** | Next.js 15 (App Router) + TypeScript | Unified frontend and serverless API routes / Server Actions. |
| **Styling & UI** | Tailwind CSS + `shadcn/ui` + Lucide Icons | Customized strictly to the White, Radar Yellow, and Carbon Black brutalist-editorial theme. |
| **Database & Vector** | Supabase PostgreSQL + `pgvector` | Stores relational data + `bit(64)` dHash values for SQL-level Hamming distance photo comparison. |
| **Authentication** | Supabase Auth | Email/Password + Magic Link (No paid SMS OTP). |
| **File Storage** | Supabase Storage | Stores compressed property images and verification utility documents. |
| **Primary AI Engine** | Google Gemini API (`@google/genai`) | Uses `gemini-2.5-flash` for multimodal OCR (Bangla/English), structured JSON extraction, NL search filters, and legal assistance. |
| **Image Processing** | `Sharp` (Server) + HTML5 Canvas (Client) | Client compresses uploads `<800KB` (bypassing Vercel's 4.5MB limit); `Sharp` normalizes images and computes 64-bit `dHash`. |
| **Search & Filtering** | Gemini NL-to-JSON + `Fuse.js` | Natural language queries convert to structured filters; `Fuse.js` handles instant client-side fuzzy matching. |
| **Maps** | `Leaflet.js` + OpenStreetMap | SSR-disabled (`next/dynamic`) interactive maps using pre-seeded coordinates to respect Nominatim's 1 req/sec limit. |
| **Data Visualization** | `Recharts` | High-contrast black/yellow bar and stacked charts for the Rental Cost Calculator. |
| **Validation** | `Zod` + Gemini `responseSchema` | Enforces 100% type-safe AI responses and API payloads. |
| **Transactional Email** | `Resend` | Sends verification status updates (capped at 100/day free tier). |

---

## 3. Database Schema & Storage Architecture

### 3.1 PostgreSQL Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

### 3.2 Core Tables

#### `profiles`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | References `auth.users.id` |
| `full_name` | `text` | User or Landlord display name |
| `role` | `text` | `'tenant' \| 'landlord' \| 'reviewer'` |
| `is_identity_verified` | `boolean` | Default `false` (tied to document verification, not just phone) |
| `created_at` | `timestamptz` | Default `now()` |

#### `properties`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `uuid_generate_v4()` |
| `owner_id` | `uuid` (FK) | References `profiles.id` |
| `title` | `text` | Listing title (Bangla or English) |
| `description` | `text` | Full listing description |
| `city` | `text` | `'Dhaka' \| 'Sylhet' \| 'Chittagong'` |
| `neighborhood` | `text` | e.g., `'Dhanmondi'`, `'Mirpur'`, `'Uttara'`, `'Zindabazar'` |
| `address_line` | `text` | Street/block details |
| `lat` | `double precision` | Pre-seeded or geocoded latitude |
| `lng` | `double precision` | Pre-seeded or geocoded longitude |
| `rent_bdt` | `integer` | Monthly base rent in BDT |
| `advance_months` | `integer` | Security deposit / advance in months (typically 1-3) |
| `service_charge_bdt` | `integer` | Monthly maintenance/guard/lift fee |
| `bedrooms` | `integer` | Number of bedrooms |
| `bathrooms` | `integer` | Number of bathrooms |
| `sqft` | `integer` | Approximate floor area |
| `tenant_type` | `text` | `'family' \| 'bachelor' \| 'any'` |
| `contact_phone` | `text` | Masked or formatted BD phone number |
| `verification_tier` | `text` | `'unverified' \| 'document_submitted' \| 'verified_ownership'` |
| `risk_score` | `integer` | `0` to `100` (lower is safer) |
| `created_at` | `timestamptz` | Default `now()` |

#### `property_images`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `uuid_generate_v4()` |
| `property_id` | `uuid` (FK) | References `properties.id` ON DELETE CASCADE |
| `image_url` | `text` | Public URL in Supabase Storage |
| `dhash` | `bit(64)` | 64-bit difference hash computed via `Sharp` |
| `created_at` | `timestamptz` | Default `now()` |

#### `inspection_reports`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `uuid_generate_v4()` |
| `user_id` | `uuid` (FK, nullable) | Allows anonymous demo inspections by judges |
| `uploaded_image_url` | `text` | Optional stored screenshot URL |
| `computed_dhash` | `bit(64)` | 64-bit dHash of the inspected advertisement |
| `extracted_json` | `jsonb` | Structured fields extracted by Gemini |
| `flags_json` | `jsonb` | Array of evidence-backed risk flags |
| `overall_risk_level` | `text` | `'LOW' \| 'MEDIUM' \| 'HIGH'` |
| `created_at` | `timestamptz` | Default `now()` |

#### `verification_submissions`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Default `uuid_generate_v4()` |
| `property_id` | `uuid` (FK) | References `properties.id` |
| `submitter_id` | `uuid` (FK) | References `profiles.id` |
| `document_type` | `text` | `'desco_bill' \| 'wasa_bill' \| 'holding_tax' \| 'deed_summary'` |
| `document_url` | `text` | Private Supabase Storage path (never sent to free-tier LLM) |
| `status` | `text` | `'pending' \| 'approved' \| 'rejected'` |
| `reviewer_notes` | `text` | Audit explanation |
| `created_at` | `timestamptz` | Default `now()` |

---

## 4. Core Functional Modules & Pipelines

### Module 1: Smart Rental Discovery
* **Split-Screen Explorer:** Left pane displays structured property cards with verification badges and true monthly cost; right pane renders an interactive Leaflet map with custom black/yellow price pins.
* **Bilingual Natural Language Filter:** Users can type `"ধানমন্ডিতে ২০ হাজার টাকার নিচে ২ বেডরুম ফ্যামিলি বাসা"` or `"2 bed in Banani under 35k with low advance"`. Gemini parses this into a strict JSON filter object (`Neighborhood`, `MaxRent`, `Beds`, `TenantType`).

### Module 2: AI Listing Inspector (Hero Buildathon Feature)
1. **Client Pre-Processing:** User uploads a screenshot of a Facebook rental post or photo of a physical "To-Let" signboard (or clicks one of 3 **Judge Demo Presets**). Client compresses image to `<800KB`.
2. **Server `Sharp` Normalization & 64-bit `dHash`:**
   * Resizes image to `9x8` grayscale pixels via `Sharp` `.raw().toBuffer()`.
   * Compares adjacent horizontal pixels (`col[x] > col[x+1]`) to produce a 64-character binary string (`010110...`).
3. **Database Duplicate Query:**
   * Executes a PostgreSQL query checking `bit_count(dhash # $1::bit(64)) <= 10` (Hamming distance $\le 10$ bits) against `property_images`.
4. **Gemini Multimodal Extraction:**
   * Passes image + prompt to `gemini-2.5-flash` with a strict `responseSchema` to extract: `rawTextBanglaOrEnglish`, `claimedNeighborhood`, `claimedRentBdt`, `claimedBedrooms`, `advanceRequirement`, `requiresPreVisitBkash`, `hiddenChargesMentioned`, and `inconsistencies[]`.
5. **Deterministic Bangladesh Scam Rule Engine:**
   * **Rule A (Pre-Visit Mobile Money Trap):** If `requiresPreVisitBkash == true` (e.g., mentions sending bKash/Nagad for "booking" or "gate pass" before viewing) $\rightarrow$ **CRITICAL FLAG**.
   * **Rule B (Cross-Listing Photo Collision):** If `dHash` Hamming distance $\le 10$ on a listing in a *different* neighborhood or with a *different* phone number $\rightarrow$ **HIGH FLAG** (renders side-by-side visual comparison).
   * **Rule C (Neighborhood Price Anomaly):** Compares `claimedRentBdt / claimedBedrooms` against hardcoded Dhaka/Sylhet neighborhood median baselines. If $>45\%$ below market median $\rightarrow$ **MEDIUM/HIGH FLAG**.
   * **Rule D (Vague Utility / Service Charge Trap):** If base rent is advertised without specifying service charge, gas type (prepaid vs. cylinder), or electricity type $\rightarrow$ **LOW/MEDIUM FLAG**.

### Module 3: Property Verification Workflow
* Landlords submit utility bills (DESCO/NESCO/WASA/Holding Tax) matching the property address.
* **Privacy Guardrail:** Sensitive documents are stored in a private Supabase bucket for human/admin checklist verification and are **never** transmitted to the free-tier Gemini API.

### Module 4: True Rental Cost Calculator
* Computes the **Real Move-In Cost** vs. **True Monthly Burn Rate** in Bangladesh:
  $$\text{Move-In Cost} = (\text{Base Rent} \times \text{Advance Months}) + \text{First Month Total} + \text{Moving/Broker Estimate}$$
  $$\text{True Monthly Cost} = \text{Base Rent} + \text{Service Charge} + \text{Gas (Cylinder vs. Titas)} + \text{Estimated Electricity} + \text{Water/Trash}$$

### Module 5: Tenant Protection & Agreement Assistant
* Uses `gemini-2.5-flash` injected with a curated summary of Bangladesh's **Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)** (covering standard receipts, advance limits, eviction notice periods, and maintenance duties).
* Users can paste clauses from a draft rental agreement (চুক্তিপত্র) or ask questions in Bangla/English to receive plain-language explanations and red-flag checklists.