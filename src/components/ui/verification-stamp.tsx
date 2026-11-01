import * as React from "react";
import { cn } from "@/lib/utils";
import { VerificationTier, RiskSeverity } from "@/types/rentradar";

export interface VerificationStampProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: VerificationTier;
  riskSeverity?: RiskSeverity;
  label?: string;
  size?: "sm" | "default" | "lg";
}

export const VerificationStamp: React.FC<VerificationStampProps> = ({
  tier,
  riskSeverity,
  label,
  size = "default",
  className,
  ...props
}) => {
  // Determine color theme based on tier or riskSeverity
  let text = label;
  let bgClass = "bg-surface";
  let borderClass = "border-carbon";
  let textClass = "text-carbon";
  let dotClass = "bg-carbon";

  if (riskSeverity === "CRITICAL" || riskSeverity === "HIGH") {
    text = text || (riskSeverity === "CRITICAL" ? "CRITICAL RISK SIGNAL" : "HIGH RISK ANOMALY");
    bgClass = "bg-red-50";
    borderClass = "border-evidence-red border-2";
    textClass = "text-evidence-red font-bold";
    dotClass = "bg-evidence-red animate-pulse";
  } else if (riskSeverity === "MODERATE") {
    text = text || "MODERATE RISK SIGNALS";
    bgClass = "bg-amber-50";
    borderClass = "border-evidence-amber border";
    textClass = "text-evidence-amber font-bold";
    dotClass = "bg-evidence-amber";
  } else if (tier === "VERIFIED_LANDLORD" || tier === "UTILITY_DOC_MATCHED") {
    text = text || (tier === "VERIFIED_LANDLORD" ? "VERIFIED LANDLORD" : "UTILITY DOC MATCHED");
    bgClass = "bg-emerald-50";
    borderClass = "border-evidence-green border-2";
    textClass = "text-evidence-green font-bold";
    dotClass = "bg-evidence-green";
  } else if (tier === "PHONE_CONFIRMED") {
    text = text || "PHONE CONFIRMED";
    bgClass = "bg-amber-50/60";
    borderClass = "border-evidence-amber border";
    textClass = "text-evidence-amber font-semibold";
    dotClass = "bg-evidence-amber";
  } else if (tier === "UNVERIFIED") {
    text = text || "UNVERIFIED AD";
    bgClass = "bg-paper";
    borderClass = "border-muted-ink/40 border dashed";
    textClass = "text-muted-ink";
    dotClass = "bg-muted-ink";
  } else if (!text) {
    text = "UNVERIFIED";
  }

  const sizeClasses = {
    sm: "text-[10px] py-0.5 px-1.5 gap-1",
    default: "text-xs py-1 px-2.5 gap-1.5",
    lg: "text-sm py-1.5 px-3.5 gap-2 font-bold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center uppercase tracking-wider font-mono select-none rounded-none transition-all",
        sizeClasses[size],
        bgClass,
        borderClass,
        textClass,
        className
      )}
      {...props}
    >
      <span className={cn("inline-block rounded-none shrink-0", size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2", dotClass)} />
      <span className="truncate">{text}</span>
    </div>
  );
};
