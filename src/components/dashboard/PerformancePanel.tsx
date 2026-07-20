"use client";

import { PerformanceGauge } from "@/components/dashboard/PerformanceGauge";
import clsx from "clsx";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

interface ChecklistItem {
  label: string;
  current: number;
  target: number;
}

export function PerformancePanel({ winRate, items }: { winRate: number; items: ChecklistItem[] }) {
  return (
    <div className="surface-card card-hover-lift flex h-full flex-col rounded-2xl p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-foreground)]">Your Performance</h2>
        <Link href="/pipeline" className="text-xs font-semibold text-blue-500 hover:underline">
          View board →
        </Link>
      </div>

      <PerformanceGauge value={winRate} label="Win Rate" />

      <div className="mt-4 flex flex-1 flex-col gap-2">
        {items.map((item, i) => {
          const done = item.target > 0 && item.current >= item.target;
          const progress = item.target > 0 ? Math.min(100, (item.current / item.target) * 100) : 0;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] transition-colors hover:border-blue-400/40"
            >
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                )}
                <span
                  className={clsx(
                    "flex-1 truncate text-sm font-medium",
                    done ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
                  )}
                >
                  {item.label}
                </span>
                <span className="shrink-0 text-xs font-semibold text-[var(--color-muted-foreground)]">
                  {item.current}/{item.target}
                </span>
              </div>
              <div className="h-1 w-full bg-black/5 dark:bg-white/10">
                <motion.div
                  className={clsx("h-full rounded-r-full", done ? "bg-emerald-500" : "bg-blue-500")}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
