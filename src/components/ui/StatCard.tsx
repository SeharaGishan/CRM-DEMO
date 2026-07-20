import { GlassCard } from "@/components/ui/GlassCard";
import clsx from "clsx";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  tone = "primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  tone?: "primary" | "accent" | "warning" | "danger";
}) {
  const toneMap: Record<string, string> = {
    primary: "from-blue-500 to-indigo-500",
    accent: "from-emerald-500 to-teal-500",
    warning: "from-amber-500 to-orange-500",
    danger: "from-rose-500 to-red-500",
  };

  const glowMap: Record<string, string> = {
    primary: "shadow-blue-600/40",
    accent: "shadow-emerald-600/40",
    warning: "shadow-orange-600/40",
    danger: "shadow-rose-600/40",
  };

  return (
    <GlassCard className="card-hover-lift p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{label}</p>
          <p className="mt-2 text-[1.7rem] font-extrabold leading-none tracking-tight text-[var(--color-foreground)]">{value}</p>
        </div>
        <div
          className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
            toneMap[tone],
            glowMap[tone]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
          {trend.positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={trend.positive ? "text-emerald-500" : "text-red-500"}>{trend.value}</span>
          <span className="text-[var(--color-muted-foreground)]">vs last month</span>
        </div>
      )}
    </GlassCard>
  );
}
