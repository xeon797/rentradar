# RentRadar — AI Coding Agent Instructions (`agents.md`)

> **Purpose:** This file governs how Google Antigravity (and any AI coding assistant) writes, structures, and validates code in this repository. Read and enforce these rules before executing any prompt.

## 1. Core Engineering Mandates
1. **Strict TypeScript:** Never use `any`. Define explicit interfaces or `Zod` schemas for every API request, database row, and Gemini output.
2. **Design System Compliance (`design.md`):**
   * Use ONLY the **White (`#FFFFFF`), Warm Paper (`#F7F6F2`), Carbon Black (`#0A0A0A`), and Radar Yellow (`#FACC15`)** palette.
   * Never introduce purple/blue gradients, blurred glowing backgrounds, or `rounded-2xl`/`rounded-3xl` containers.
   * All numeric values (BDT prices, sq.ft., percentages, dHashes, coordinates) MUST use `font-mono tabular-nums`.
3. **AI Evidence Principle:** Never write UI copy or AI prompts that accuse a person of being a "Confirmed Scammer" or "Fraudster." Always use evidence-oriented terminology: `"High Anomaly Detected"`, `"Advance Payment Risk Flag"`, `"Duplicate Photo Match"`, or `"Unverified Listing"`.

---

## 2. Technical Guardrails (Preventing Runtime & Build Crashes)

### 2.1 Google Gemini SDK (`@google/genai`)
* Always use the official `@google/genai` SDK (do NOT use the legacy `@google/generative-ai` package).
* Initialize on the server only:
  ```ts
  import { GoogleGenAI, Type } from "@google/genai";
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  ```
* Default model: `'gemini-2.5-flash'`.
* Always enforce structured outputs using `config: { responseMimeType: "application/json", responseSchema: ... }` and validate the parsed result with `Zod` before returning to the client.
* Include a graceful fallback handler if `GEMINI_API_KEY` is missing or rate-limited (`429`) so the UI never white-screens during a judge evaluation.

### 2.2 Image Processing & Vercel 4.5MB Payload Limit
* **Client-Side Compression First:** Any file input that accepts user screenshots or property photos MUST compress/resize the image on the client (max dimension `1600px`, JPEG/WebP quality `0.8`, target `<800KB`) *before* sending it to a Next.js API Route or Server Action.
* **Pure-TS `Sharp` dHash (No Native C++ Hash Libraries):**
  Do NOT install `image-hash`, `blockhash`, or `sharp-phash`. Compute the 64-bit difference hash (`dHash`) directly with `sharp` in `src/lib/image-hash.ts`:
  ```ts
  import sharp from "sharp";

  export async function computeDHash64(imageBuffer: Buffer): Promise<string> {
    // Resize to 9 columns x 8 rows in single-channel grayscale
    const { data } = await sharp(imageBuffer)
      .grayscale()
      .resize(9, 8, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let bits = "";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const leftPixel = data[row * 9 + col];
        const rightPixel = data[row * 9 + col + 1];
        bits += leftPixel > rightPixel ? "1" : "0";
      }
    }
    return bits; // 64-char binary string ('0' and '1')
  }
  ```

### 2.3 Leaflet & Next.js SSR Safety
* Never import `leaflet` or `react-leaflet` at the top level of a Server Component or standard Client Component that runs during SSR.
* Always isolate the map inside `src/components/map/PropertyMapInner.tsx` and load it via `next/dynamic`:
  ```ts
  const PropertyMap = dynamic(() => import("@/components/map/PropertyMapInner"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#F7F6F2] border-2 border-[#0A0A0A] animate-pulse flex items-center justify-center font-mono text-xs">INITIALIZING RADAR MAP...</div>,
  });
  ```

### 2.4 Nominatim Geocoding Discipline
* Never trigger live Nominatim requests inside a loop or on every keystroke.
* Use a pre-configured dictionary of major Dhaka, Sylhet, and Chittagong neighborhoods (`Dhanmondi`, `Mirpur`, `Uttara`, `Banani`, `Mohammadpur`, `Bashundhara`, `Zindabazar`, `Amberkhana`, `Agrabad`, etc.) for instant coordinate lookup, falling back to Nominatim only on manual address geocoding with a strict `User-Agent: RentRadar-Buildathon-MVP/1.0` header.

---

## 3. Project Directory Structure
Maintain this exact folder structure across all prompts:
```text
src/
├── app/
│   ├── (main)/
│   │   ├── explore/          # Module 1: Smart Discovery + Split Map
│   │   ├── inspector/        # Module 2: AI Listing Inspector (Hero Feature)
│   │   ├── verify/           # Module 3: Property Creation & Verification
│   │   ├── calculator/       # Module 4: True Rental Cost Calculator
│   │   └── assistant/        # Module 5: Tenant Legal Protection Assistant
│   ├── auth/                 # Supabase Auth pages & callback
│   ├── api/
│   │   ├── inspect/          # Multimodal Gemini + dHash + Scam Rule Engine
│   │   ├── search-nl/        # Natural Language to Filter JSON endpoint
│   │   └── assistant/        # Premises Rent Control Act, 1991 legal assistant
│   ├── layout.tsx
│   └── page.tsx              # High-impact Editorial Landing Page
├── components/
│   ├── ui/                   # shadcn/ui primitives (styled for Black/Yellow/White)
│   ├── layout/               # Navbar, Footer, Status Ticker
│   ├── map/                  # Dynamic Leaflet Map & Custom Price Markers
│   ├── inspector/            # Forensic Docket UI, Judge Presets, dHash Visualizer
│   └── properties/           # Property Cards, Filter Bar, Verification Badges
├── lib/
│   ├── supabase/             # Client, Server, and Middleware helpers + Seed Fallback
│   ├── ai/                   # Gemini client, schemas, BD scam rules, legal context
│   ├── image-hash.ts         # Sharp normalization & 64-bit dHash
│   ├── bd-market-data.ts     # Neighborhood rent baselines, coordinates & sample presets
│   └── utils.ts
└── types/
    └── index.ts              # Shared TypeScript interfaces & Zod schemas
```