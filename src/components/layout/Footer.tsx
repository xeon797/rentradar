import * as React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface border-t-2 border-carbon mt-16 font-mono text-xs">
      <div className="hazard-stripe w-full" />

      {/* Main Ledger Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-carbon/20">
          {/* Col 1: Municipal Ledger Header */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-radar border border-carbon" />
              <span className="font-display font-bold uppercase tracking-tight text-sm text-carbon">
                RentRadar Bangladesh
              </span>
            </div>
            <p className="text-muted-ink text-[11px] font-sans leading-relaxed">
              Civic rental intelligence, multimodal advertisement inspection docket, and tenant protection countermeasure engineered for urban housing markets across Bangladesh.
            </p>
            <div className="border border-carbon/40 bg-paper p-2.5 text-[10px] space-y-1">
              <div className="text-carbon font-bold uppercase">// MUNICIPAL RECORD REF</div>
              <div className="text-muted-ink">ACT NO. III OF 1991</div>
              <div className="text-muted-ink font-bangla">বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১</div>
            </div>
          </div>

          {/* Col 2: Core Engineering Modules */}
          <div>
            <div className="text-carbon font-bold uppercase text-[11px] mb-3 tracking-wider border-b border-carbon pb-1">
              Platform Modules
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/discover" className="hover:underline flex items-center justify-between text-muted-ink hover:text-carbon">
                  <span>[01] Smart Discovery</span>
                  <span className="text-[10px] text-carbon/60">SPLIT MAP</span>
                </Link>
              </li>
              <li>
                <Link href="/inspector" className="hover:underline flex items-center justify-between text-muted-ink hover:text-carbon">
                  <span className="font-bold text-carbon">[02] AI Ad Inspector</span>
                  <span className="bg-radar text-carbon px-1 text-[9px] border border-carbon">DEMO</span>
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:underline flex items-center justify-between text-muted-ink hover:text-carbon">
                  <span>[03] Landlord Verification</span>
                  <span className="text-[10px] text-carbon/60">UTILITY</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:underline flex items-center justify-between text-muted-ink hover:text-carbon">
                  <span>[04] True-Cost Breakdown</span>
                  <span className="text-[10px] text-carbon/60">CASHFLOW</span>
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:underline flex items-center justify-between text-muted-ink hover:text-carbon">
                  <span>[05] Tenant Legal Guard</span>
                  <span className="text-[10px] text-carbon/60">1991 ACT</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Forensic & Evidence Guardrails */}
          <div>
            <div className="text-carbon font-bold uppercase text-[11px] mb-3 tracking-wider border-b border-carbon pb-1">
              Forensic Guardrails
            </div>
            <ul className="space-y-2 text-[11px] text-muted-ink">
              <li className="flex items-start gap-1.5">
                <span className="text-evidence-green font-bold">✓</span>
                <span>64-Bit Difference Image Hashing (dHash) to flag recycled Facebook To-Let photos.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-evidence-green font-bold">✓</span>
                <span>Gemini 2.5 Flash Multimodal OCR for bilingual advance & booking traps.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-evidence-green font-bold">✓</span>
                <span>Zero AI SaaS Slop: No purple gradients, no blurry blobs, no fabricated hallucinations.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-evidence-green font-bold">✓</span>
                <span>Deterministic neighborhood median sq.ft. price anomaly thresholds.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Data & Open Attribution */}
          <div>
            <div className="text-carbon font-bold uppercase text-[11px] mb-3 tracking-wider border-b border-carbon pb-1">
              Civic Attribution
            </div>
            <div className="space-y-2 text-[11px] text-muted-ink">
              <p>
                Geographic coordinates & baselines powered by OpenStreetMap contributors under ODbL.
              </p>
              <div className="bg-paper p-2 border border-carbon/30 text-[10px] space-y-1">
                <div className="text-carbon font-bold">// COVERAGE ZONES</div>
                <div>DHAKA: Dhanmondi, Mirpur, Uttara, Gulshan, Banani, Bashundhara, Mohammadpur</div>
                <div>SYLHET: Uposhahar, Amberkhana, Zindabazar, SUST Gate</div>
                <div>CHATTOGRAM: Khulshi, Nasirabad, Agrabad, GEC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ledger Verification Bar */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-ink">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-evidence-green" />
            <span>CIVIC SYSTEM STATUS: OPERATIONAL // ZERO PAID API OVERHEAD</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 RENTRADAR BANGLADESH</span>
            <span className="text-carbon font-bold border-l border-carbon/40 pl-4">
              BUILT FOR BANGLADESH URBAN TENANTS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
