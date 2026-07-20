"use client";

import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import { Task } from "@/lib/types";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";

const priorityIcon = { high: AlertCircle, medium: Clock, low: CheckSquare };

const priorityTone: Record<Task["priority"], string> = {
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  low: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

const priorityBadgeTone: Record<Task["priority"], "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

export function PendingTasksCard({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: string) => void }) {
  return (
    <div className="surface-card card-hover-lift flex h-full flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-foreground)]">Pending Tasks</h2>
        <Link href="/tasks" className="text-xs font-semibold text-blue-500 hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex flex-1 flex-col divide-y divide-[var(--color-border)]">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((t) => {
            const Icon = priorityIcon[t.priority];
            return (
              <motion.button
                key={t.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                onClick={() => onToggle(t.id)}
                title="Mark as done"
                className="group -mx-2 flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <span
                  className={clsx(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    priorityTone[t.priority]
                  )}
                >
                  <Icon className="h-4 w-4 transition-opacity duration-150 group-hover:opacity-0" strokeWidth={2.25} />
                  <CheckCircle2
                    className="absolute h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    strokeWidth={2.25}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{t.title}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Due {formatDate(t.dueDate)}</p>
                </div>
                <Badge tone={priorityBadgeTone[t.priority]}>{t.priority}</Badge>
              </motion.button>
            );
          })}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">No pending tasks 🎉</p>
        )}
      </div>
    </div>
  );
}
