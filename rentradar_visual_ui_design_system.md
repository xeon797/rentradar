# RentRadar — Design System & Anti-Slop UI Guide (`design.md`)

## 1. Aesthetic Direction: "Civic Utilitarian & Editorial Inspection"
To stand out immediately to buildathon judges, RentRadar **strictly rejects** generic "AI SaaS slop" aesthetics. Instead, it draws inspiration from **architectural blueprints, municipal inspection dockets, physical hazard tags, and financial terminals**.

### The "Anti-AI-Slop" Ban List (NEVER DO THESE)
1. **NO** purple, indigo, cyan, or neon gradients (`bg-gradient-to-r from-purple-500...` is strictly forbidden).
2. **NO** glowing blurred background blobs or floating 3D robot/sparkles illustrations.
3. **NO** glassmorphism (`backdrop-blur` with translucent white borders on dark backgrounds).
4. **NO** overly rounded pill cards (`rounded-3xl` or `rounded-full` on containers).
5. **NO** generic "ChatGPT-style" chat bubbles for the AI Inspector—present AI outputs as structured **Forensic Inspection Reports** with evidence tables, stamps, and side-by-side comparisons.

---

## 2. Color Palette (White, Radar Yellow & Carbon Black)

The interface is strictly high-contrast **Light Mode First** with architectural black gridlines and industrial signal yellow highlights.

| Token | Hex Code | Tailwind Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas White** | `#FFFFFF` | `bg-white` | Primary card surfaces, inspection dockets, modal backgrounds. |
| **Warm Paper** | `#F7F6F2` | `bg-[#F7F6F2]` | Main page background—gives an editorial, tactile blueprint feel without eye strain. |
| **Carbon Black** | `#0A0A0A` | `bg-[#0A0A0A]` / `text-[#0A0A0A]` | Primary typography, structural 1.5px borders, primary CTA buttons, header bar. |
| **Radar Yellow** | `#FACC15` | `bg-yellow-400` (`#FACC15`) | Primary brand accent, active filter states, inspection highlights, price tags, hard offset shadows. |
| **Muted Slate** | `#52525B` | `text-zinc-600` | Secondary labels, metadata, captions. |
| **Grid Hairline** | `#E4E4E7` | `border-zinc-200` | Subtle internal table dividers and form borders. |

### Semantic Evidence Status Colors (Used Only in Badges & Risk Stamps)
* **Verified / Safe:** Deep Forest Ink (`#15803D` text on `#DCFCE7` background, `1px solid #15803D` border).
* **Warning / Caution:** Signal Yellow (`#0A0A0A` text on `#FACC15` background, `1.5px solid #0A0A0A` border).
* **High Risk / Anomaly:** Industrial Crimson (`#B91C1C` text on `#FEE2E2` background, `1.5px solid #B91C1C` border).

---

## 3. Typography System (Bilingual Precision)

RentRadar handles English, Bangla, and numeric BDT figures side-by-side.

* **Display & Headings:** `Space Grotesk` or `Plus Jakarta Sans` (Bold/SemiBold, tight tracking `-0.03em`).
* **Body & UI Controls:** `Inter` (Clean, neutral legibility).
* **Bangla Script Support:** `Hind Siliguri` or `Noto Sans Bengali` loaded via `next/font/google` so Bangla advertisements and extracted text render with crisp, modern proportions.
* **Data, Hashes, Coordinates & BDT Figures:** `JetBrains Mono` (`font-mono`). **Every** rent price (`৳22,500/mo`), dHash value (`01101001...`), risk score (`RISK: 78/100`), and coordinate must use `font-mono` with `tabular-nums`.

---

## 4. Structural & Component Styling Rules

### 4.1 Borders, Corners & Elevation
* **Corner Radius:** Crisp, technical corners: use `rounded-none` or `rounded-sm` (`2px`–`4px` max).
* **Borders:** Primary cards and interactive panels use crisp solid borders: `border border-[#0A0A0A]` or `border-2 border-[#0A0A0A]`.
* **Tactile Offset Shadows:** Instead of soft blurry drop shadows (`shadow-lg` is banned), featured cards and primary buttons use a crisp architectural offset shadow:
  * Standard Card Hover: `shadow-[4px_4px_0px_0px_#0A0A0A]`
  * Highlighted / Active AI Inspector Card: `shadow-[4px_4px_0px_0px_#FACC15]`

### 4.2 Buttons & Interactive Controls
* **Primary Action Button:** Carbon Black background (`bg-[#0A0A0A]`), White text (`text-white`), `border-2 border-[#0A0A0A]`, hover transitions to Radar Yellow background (`hover:bg-[#FACC15] hover:text-[#0A0A0A]`), `font-mono uppercase tracking-wider text-xs font-bold px-4 py-2.5`.
* **Accent Action Button (Hero / Inspect CTA):** Radar Yellow background (`bg-[#FACC15]`), Carbon Black text (`text-[#0A0A0A]`), `border-2 border-[#0A0A0A]`, crisp offset shadow `shadow-[3px_3px_0px_0px_#0A0A0A]`, active press effect `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`.

### 4.3 Signature UI Components

1. **The "Forensic Inspection Docket" (AI Listing Inspector Output):**
   * Styled like an official municipal inspection sheet.
   * Top header bar in Carbon Black with monospaced report ID (`RR-INSP-2026-089`), timestamp, and a bold rectangular risk stamp (`[ HIGH RISK // 3 ANOMALIES FOUND ]`).
   * **Left Column:** Annotated preview of the uploaded To-Let image alongside its computed 64-bit `dHash` barcode visualization.
   * **Right Column:** Structured extraction table (`Claimed Rent`, `Claimed Area`, `Advance Terms`, `Payment Channel`) followed by numbered **Evidence Cards** explaining *why* a rule triggered.

2. **Property Listing Card:**
   * Top bar shows verification tier badge (`[ VERIFIED UTILITY BILL ]` or `[ UNVERIFIED AD ]`) and neighborhood tag in `font-mono`.
   * Bottom footer splits price into **Base Rent** (`৳18,000`) and **Est. True Monthly** (`৳23,400 incl. charges`) in a yellow-tinted callout bar so tenants never get surprised by hidden service charges.

3. **Custom Leaflet Map Pins:**
   * Do not use default blue Leaflet teardrop pins. Use custom `L.divIcon` rectangular price tags (`bg-[#0A0A0A] text-[#FACC15] font-mono text-xs font-bold px-2 py-0.5 border border-[#FACC15]`) that invert to `bg-[#FACC15] text-[#0A0A0A] border-[#0A0A0A]` when hovered or selected.