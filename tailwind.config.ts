import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F6F2",
        surface: "#FFFFFF",
        carbon: "#0A0A0A",
        charcoal: "#141413",
        radar: "#FACC15",
        "radar-hover": "#EAB308",
        "muted-ink": "#52525B",
        "grid-line": "#E4E2DD",
        "evidence-green": "#15803D",
        "evidence-amber": "#EA580C",
        "evidence-red": "#DC2626",
      },
      boxShadow: {
        docket: "4px 4px 0px 0px #0A0A0A",
        "docket-sm": "2px 2px 0px 0px #0A0A0A",
        "docket-yellow": "4px 4px 0px 0px #FACC15",
      },
      fontFamily: {
        display: ["var(--font-satoshi)", "var(--font-bangla)", "sans-serif"],
        sans: ["var(--font-satoshi)", "var(--font-bangla)", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        bangla: ["var(--font-bangla)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
