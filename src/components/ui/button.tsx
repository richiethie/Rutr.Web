import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--console-radius-sm)] text-[13px] font-semibold tracking-[-0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--console-accent-ring)] disabled:pointer-events-none disabled:opacity-55 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#d06830] to-[var(--console-accent)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[var(--console-accent)] hover:to-[var(--console-accent-hover)]",
        outline:
          "border border-[var(--console-border-strong)] bg-white text-[var(--console-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-[var(--console-row-hover)]",
        ghost:
          "text-[var(--console-muted)] hover:bg-[var(--console-row-hover)] hover:text-[var(--console-text)]",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-2.5 text-[12px]",
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
