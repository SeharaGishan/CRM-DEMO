"use client";

import { RevenueBarChart } from "@/components/charts/RevenueBarChart";
import { formatCurrency } from "@/lib/format";
import { ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import Link from "next/link";

export function RevenueExpensesCard({ revenue, pipelineValue }: { revenue: number; pipelineValue: number }) {
  return (
    <div className="surface-card card-hover-lift rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-foreground)]">Revenue &amp; Pipeline</h2>
        <Link href="/sales" className="text-xs font-semibold text-blue-500 hover:underline">
          View all →
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300">
              <DollarSign className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Revenue Collected</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-[var(--color-foreground)]">{formatCurrency(revenue)}</span>
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +5.2%
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300">
              <Wallet className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Open Pipeline Value</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-lg font-extrabold text-[var(--color-foreground)]">{formatCurrency(pipelineValue)}</span>
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +8.3%
            </span>
          </div>
        </div>
      </div>

      <RevenueBarChart />
    </div>
  );
}
