"use client";

import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

type Tone = "blue" | "violet" | "emerald" | "amber" | "rose";

const chipTone: Record<Tone, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
  trend: { value: string; positive: boolean };
}) {
  return (
    <div className="surface-card card-hover-lift rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", chipTone[tone])}>
          <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <span className="truncate text-sm font-medium text-[var(--color-muted-foreground)]">{label}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="text-[1.6rem] font-extrabold leading-none tracking-tight text-[var(--color-foreground)]">
          {value}
        </span>
        <span
          className={clsx(
            "flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-bold",
            trend.positive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
          )}
        >
          {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend.value}
        </span>
      </div>
    </div>
  );
}
