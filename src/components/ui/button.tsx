import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-carbon disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-radar text-carbon border border-carbon font-display font-bold uppercase tracking-wider shadow-docket-sm hover:bg-radar-hover active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-none",
        carbon:
          "bg-carbon text-surface border border-carbon font-display font-bold uppercase tracking-wider hover:bg-charcoal active:translate-x-[1px] active:translate-y-[1px] transition-all rounded-none",
        outline:
          "bg-surface text-carbon border border-carbon font-mono text-xs uppercase tracking-wider hover:bg-paper active:bg-grid-line/50 rounded-none",
        ghost:
          "bg-transparent text-carbon hover:bg-grid-line/60 font-mono text-xs uppercase rounded-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
