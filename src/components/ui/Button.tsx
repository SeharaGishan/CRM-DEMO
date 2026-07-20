import clsx from "clsx";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-blue-700 shadow-sm shadow-blue-900/10 focus-visible:ring-blue-400",
  secondary:
    "glass-panel text-[var(--color-foreground)] hover:bg-white/40 dark:hover:bg-white/10 focus-visible:ring-blue-300",
  ghost:
    "bg-transparent text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-blue-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex cursor-pointer items-center justify-center rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "active:scale-[0.97]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
