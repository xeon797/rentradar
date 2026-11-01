import * as React from "react";
import { cn } from "@/lib/utils";

export interface BilingualTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "radar" | "carbon" | "outline" | "danger" | "success";
  size?: "sm" | "default";
  icon?: React.ReactNode;
}

export const BilingualTag: React.FC<BilingualTagProps> = ({
  variant = "default",
  size = "default",
  icon,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-surface text-carbon border border-carbon",
    radar: "bg-radar text-carbon border border-carbon font-semibold",
    carbon: "bg-carbon text-surface border border-carbon",
    outline: "bg-transparent text-carbon border border-carbon/60",
    danger: "bg-red-50 text-evidence-red border border-evidence-red font-semibold",
    success: "bg-emerald-50 text-evidence-green border border-evidence-green font-semibold",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    default: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium tracking-tight rounded-none select-none tabular-nums",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="font-bilingual leading-tight">{children}</span>
    </span>
  );
};
