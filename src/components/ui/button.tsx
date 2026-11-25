import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--console-accent)] disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default: "bg-[var(--console-accent)] text-white hover:bg-[var(--console-accent-hover)]",
        outline:
          "border border-[var(--console-border-strong)] bg-white text-[var(--console-text)] hover:bg-[var(--console-row-hover)]",
        ghost: "text-[var(--console-muted)] hover:bg-[var(--console-row-hover)] hover:text-[var(--console-text)]",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2.5 text-[12px]",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";
