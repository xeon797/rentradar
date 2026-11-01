# RentRadar BD (রেন্টরাডার) // Civic Rental Intelligence System
### Built for AIgnite 2026 • Bangladesh Housing Transparency & Tenant Protection Platform

![RentRadar Built for AIgnite 2026](/public/built-for-aignite-2026.png)

> **"AI is an Evidence Collector, Never an Arbitrary Judge."**  
> RentRadar combines **Google Gemini 2.5 Flash Multimodal AI** with **Sharp 9×8 Perceptual Gradient dHash**, **Deterministic Bangladesh Scam Rules**, and the statutory corpus of **The Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১)** to dismantle rental fraud, expose hidden move-in utility shocks, and empower tenants across Dhaka, Sylhet, and Chattogram.

---

## ⚡ 2-Minute Judge Evaluation Guide (5-Stop Proof Sequence)

RentRadar features a built-in **Judge 2-Minute Proof HUD** accessible from any page via the `[ ⚡ JUDGE GUIDE ]` button in the top navigation bar. Click each stop to jump directly to its calibrated proof state:

| Stop | Module & Route | What It Proves (Core Technical Differentiator) |
|---|---|---|
| **STOP 01** | **[Hero Scam Demo](/inspector?preset=preset-01-bashundhara-scam)** | **Sharp 9×8 dHash** catches a luxury Gulshan photo (`RR-DHK-041`) reused in a cheap Bashundhara ad (**98.4% similarity / 1-bit difference**). **Gemini 2.5 Flash** transcribes Bangla text, and deterministic rules flag the `৳3,000` bKash visiting-fee scam. |
| **STOP 02** | **[Bilingual Geospatial Radar](/discover)** | Imperative SSR-safe Leaflet map across Dhaka, Sylhet & Chattogram with **Fuse.js** instant search and **Gemini Natural Language search** (*"সিলেটে ২০ হাজারের নিচে ফ্যামিলি বাসা"*). |
| **STOP 03** | **[Zero-LLM Verification Vault](/verify)** | Landlords submit holding/DESCO bill proof with client-side canvas compression. Switch to Auditor Farhana Yasmin to approve filing `VER-2026-101` (`RR-SYL-012`) and inspect the local/Resend MIME receipt. **Holding documents never touch external LLM APIs.** |
| **STOP 04** | **[True-Cost & Move-In Shock](/calculator?docket=RR-SYL-014)** | Exposes how hidden service charges, `৳16/unit` sub-meter electricity markups, and LPG cylinders inflate advertised base rent by **+40%+**, visualized via **Recharts** with **50/30/20 budget stress testing**. |
| **STOP 05** | **[1991 Rent Control Act Auditor](/assistant)** | Audits predatory lease agreements against Sections 7, 10, 13, 18 & 21 of the 1991 Act, provides 1-click **copyable Bangla WhatsApp counter-clauses**, and prints official **Section 13 Dual-Slip Rent Receipts (`ভাড়ার রশিদ`)**. |

---

## 🏛️ Platform Architecture: 5 Core Modules

```
                                  RENTRADAR BD PLATFORM
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    │                                                                               │
[MODULE 01] DISCOVER                   [MODULE 02] INSPECTOR                   [MODULE 03] VERIFY
• Geospatial Radar Map                 • Multimodal Gemini 2.5 Flash           • Zero-LLM Privacy Vault
• Leaflet + OpenStreetMap              • Sharp 9×8 64-bit dHash Engine         • Canvas Pre-Compression
• Bilingual NL Query Parser            • Hamming Bitwise Distance < 10         • Local & Cloud Email Ledger
• Neighborhood Benchmarks              • 6 Deterministic Scam Rules            • Municipal Auditor Dashboard
    │                                                                               │
    └───────────────────────────────────────┬───────────────────────────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               │                                                         │
     [MODULE 04] CALCULATOR                                   [MODULE 05] ASSISTANT
     • BERC & DESCO Progressive Slabs                         • Premises Rent Control Act, 1991
     • Sub-Meter Annual Overcharge Audit                      • Gemini 2.5 Flash Legal Auditor
     • Pipeline Gas vs LPG Exposure                           • 1-Click WhatsApp Bangla Counter-Drafts
     • Recharts 12-Month Shock Schedule                       • Section 13 Dual-Slip Receipt Generator
```

---

## 🔍 The 6-Stage Forensic Inspection Pipeline

```
  [Stage 1: Pre-Compression]
  Tenant / Landlord uploads rental ad image
  └─► HTML5 Canvas downsamples to max 1280px & <800KB; strips EXIF metadata for privacy.

  [Stage 2: Perceptual Fingerprinting]
  Processed by Sharp (Node.js native backend)
  └─► 9×8 Lanczos3 Grayscale reduction -> Horizontal 64-bit brightness gradient hash.

  [Stage 3: Photographic Collision Search]
  Query existing listing database via bitwise Hamming distance:
  └─► Hamming Distance <= 10 bits flags identical or cropped stolen photos across cities.

  [Stage 4: Multimodal Claim Extraction]
  Google Gemini 2.5 Flash (with strict JSON schema):
  └─► Transcribes Bangla & English text, extracts claimed rent, advance months, contact numbers.
  └─► Privacy Guard: Real NID numbers are automatically masked as [NID_MASKED].

  [Stage 5: Deterministic Bangladesh Scam Rules]
  Evidence analyzed against 6 hard-coded rules:
  ├─ 1. ADVANCE_BKASH_DEMAND: Payment requested before physical inspection.
  ├─ 2. PRICE_ANOMALY_LOW: Rent > 40% below neighborhood benchmark.
  ├─ 3. DUPLICATE_IMAGE_COLLISION: Stolen photos used across different addresses.
  ├─ 4. EXCESS_ADVANCE_DEMAND: Advance > 2 months (violates Section 10).
  ├─ 5. SUBMETER_ELECTRICITY_MARKUP: Sub-meter rate > ৳10.5/unit (violates BERC code).
  └─ 6. VAGUE_UNVERIFIED_LOCATION: Missing road/sector identifiers.

  [Stage 6: Forensic Docket Output]
  Generates immutable inspection docket with risk score (0-100), statutory citations, and action steps.
```

---

## 🛡️ Privacy Engineering & Free-Tier Resilience

1. **Zero-LLM-Leak Utility Vault:** Utility bills, holding tax credentials, and citizen documents are stored in isolated local storage or private Supabase buckets. They are verified using deterministic hash matches and are **NEVER transmitted to external LLM APIs**.
2. **Sliding-Window Token Bucket Rate Limiter (`src/lib/security/rate-limiter.ts`):** Limits burst traffic to **25 requests/minute per IP** across all AI endpoints (`/api/search/nl-filter`, `/api/inspector/analyze`, `/api/assistant/legal-audit`).
3. **Fail-Safe Circuit Breaker:** When rate limits are reached or external API keys are omitted, RentRadar **never throws 429 or 500 errors**. Instead, it triggers an instant circuit-breaker failover to 100% deterministic local engines (`X-RentRadar-Circuit: CIRCUIT_BREAKER_DETERMINISTIC`), ensuring judges experience zero friction.
4. **Live System Telemetry API (`GET /api/health`):** Provides real-time health checks on all 5 platform subsystems.

---

## 💻 Tech Stack & Design System

| Layer | Technologies & Tools |
|---|---|
| **Framework & Runtime** | Next.js 15 (App Router, Turbopack, React 19), Node.js runtime |
| **Language & Typings** | TypeScript 5 (Strict Mode, Zero `any` in production code) |
| **Styling & Design System** | Tailwind CSS 3.4, **Civic Utilitarian** (`#F7F6F2` paper, `#FFFFFF` surface, `#0A0A0A` carbon, `#FACC15` radar yellow, `shadow-docket`, sharp corners) |
| **Typography** | **Satoshi** (display/headings), **Hind Siliguri** (Bangla typography), **JetBrains Mono** (currency, metrics, hashes) |
| **Generative AI** | Google Gemini 2.5 Flash via official `@google/genai` SDK |
| **Image Processing** | `sharp` native C++ bindings for 9×8 Lanczos3 Grayscale perceptual hashing |
| **Geospatial & Mapping** | Imperative `leaflet` 1.9 + OpenStreetMap with custom SVG radar markers |
| **Search & Filtering** | `fuse.js` fuzzy client-side search + Gemini Natural Language query parser |
| **Data Visualization** | `recharts` responsive horizontal cost breakdowns & 12-month cashflow schedules |
| **Database & Storage** | Supabase PostgreSQL + `pgvector` (`bit(64)` Hamming operator `<~>`) with hybrid offline ledger fallback |
| **Validation & Schema** | `zod` for strict JSON extraction and API contract enforcement |
| **Transactional Email** | `resend` cloud dispatcher with fallback local MIME inspection ledger |

---

## 🚀 Local Development Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/rentradar.git
cd rentradar
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
# Google Gemini API Key (Optional: system works 100% deterministically without it)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (Optional: system runs on hybrid local ledger without it)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend Transactional Email (Optional: system captures emails in local MIME ledger)
RESEND_API_KEY=re_your_resend_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Production Build & Verification
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## 📜 Statutory Legal Basis: The Premises Rent Control Act, 1991

RentRadar's legal engine is grounded directly in the statutes of Bangladesh:

- **Section 7 (`ধারা ৭`):** Restriction on arbitrary increase of rent beyond standard rent; statutory 2-year freeze.
- **Section 10 (`ধারা ১০`):** Prohibition on demanding advance deposits exceeding 1 month's rent without Rent Controller sanction.
- **Section 13 (`ধারা ১৩`):** Mandatory statutory duty of landlord to issue signed written rent receipts (*ভাড়ার রশিদ*) with counterfoil.
- **Section 15 (`ধারা ১৫`):** Determination and fixation of fair standard rent by the Rent Controller.
- **Section 18 (`ধারা ১৮`):** Protection against arbitrary eviction; mandatory 30-day statutory notice requirement under Section 106 of the Transfer of Property Act, 1882.
- **Section 21 (`ধারা ২১`):** Prohibition against severing or withholding essential supplies (water, gas, electricity, sanitation) to coerce tenants.
- **BERC Residential Electricity Codes:** Prohibition on unauthorized commercial resale of electricity through uncalibrated sub-meters at inflated flat rates.

---

### Built with pride for AIgnite 2026.
*RentRadar: Illuminating Bangladesh Housing Realities.*
