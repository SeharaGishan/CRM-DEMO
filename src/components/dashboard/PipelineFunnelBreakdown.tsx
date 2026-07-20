"use client";

import { formatCurrency } from "@/lib/format";
import { DEAL_STAGES, Deal, DealStage } from "@/lib/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

const stageColors: Record<string, string> = {
  New: "#60a5fa",
  Contacted: "#3b82f6",
  Proposal: "#2563eb",
  Negotiation: "#1d4ed8",
  Won: "#059669",
};

const funnelStages: DealStage[] = DEAL_STAGES.filter((s) => s !== "Lost");

export function PipelineFunnelBreakdown({ deals }: { deals: Deal[] }) {
  const data = useMemo(() => {
    const openOrWon = deals.filter((d) => d.stage !== "Lost");
    return funnelStages.map((stage, i) => {
      // A deal further down the pipeline has already passed through every
      // earlier stage, so each row counts deals at or beyond it — keeps the
      // bars monotonically shrinking, matching how a real funnel behaves.
      const atOrBeyond = openOrWon.filter((d) => funnelStages.indexOf(d.stage) >= i);
      return {
        stage,
        count: atOrBeyond.length,
        value: atOrBeyond.reduce((sum, d) => sum + d.value, 0),
      };
    });
  }, [deals]);

  const maxCount = data[0]?.count || 1;

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((row, i) => {
        const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
        return (
          <div key={row.stage} className="rounded-xl border border-[var(--color-border)] px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: stageColors[row.stage] }} />
                {row.stage}
              </span>
              <span className="shrink-0 text-xs font-semibold text-[var(--color-muted-foreground)]">
                {row.count} deal{row.count === 1 ? "" : "s"} · {formatCurrency(row.value)}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: stageColors[row.stage] }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
