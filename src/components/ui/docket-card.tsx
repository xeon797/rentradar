import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  docketId?: string;
  docketTitle?: string;
  hazardStripe?: boolean;
  shadow?: "none" | "sm" | "default" | "yellow";
  headerAction?: React.ReactNode;
}

export const DocketCard = React.forwardRef<HTMLDivElement, DocketCardProps>(
  (
    {
      className,
      docketId,
      docketTitle,
      hazardStripe = false,
      shadow = "default",
      headerAction,
      children,
      ...props
    },
    ref
  ) => {
    const shadowClass =
      shadow === "default"
        ? "shadow-docket"
        : shadow === "sm"
        ? "shadow-docket-sm"
        : shadow === "yellow"
        ? "shadow-docket-yellow"
        : "";

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface border border-carbon rounded-none transition-all",
          shadowClass,
          className
        )}
        {...props}
      >
        {hazardStripe && <div className="hazard-stripe w-full" />}
        {(docketId || docketTitle || headerAction) && (
          <div className="flex items-center justify-between border-b border-carbon bg-paper/60 px-3.5 py-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              {docketId && (
                <span className="font-mono font-bold tracking-wider text-carbon bg-radar/30 border border-carbon/40 px-1.5 py-0.5 text-[11px]">
                  {docketId}
                </span>
              )}
              {docketTitle && (
                <span className="font-display font-semibold uppercase tracking-tight text-carbon truncate text-[11px] sm:text-xs">
                  {docketTitle}
                </span>
              )}
            </div>
            {headerAction && <div className="shrink-0 ml-2">{headerAction}</div>}
          </div>
        )}
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    );
  }
);

DocketCard.displayName = "DocketCard";
