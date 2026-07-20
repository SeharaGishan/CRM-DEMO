import clsx from "clsx";
import React from "react";

type Tone = "neutral" | "primary" | "success" | "warning" | "warning-strong" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  primary: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  "warning-strong": "bg-orange-500/10 text-orange-600 dark:text-orange-300",
  danger: "bg-red-500/10 text-red-600 dark:text-red-300",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
