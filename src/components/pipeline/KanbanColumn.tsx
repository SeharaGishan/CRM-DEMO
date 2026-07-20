"use client";

import { DealCard } from "@/components/pipeline/DealCard";
import { formatCurrency } from "@/lib/format";
import { Deal, DealStage } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Inbox, Plus } from "lucide-react";

const stageAccent: Record<DealStage, string> = {
  New: "bg-slate-400",
  Contacted: "bg-blue-400",
  Proposal: "bg-blue-500",
  Negotiation: "bg-amber-500",
  Won: "bg-emerald-500",
  Lost: "bg-red-400",
};

export function KanbanColumn({
  stage,
  deals,
  onCardClick,
  onAddDeal,
}: {
  stage: DealStage;
  deals: Deal[];
  onCardClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const total = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex w-72 shrink-0 flex-col rounded-2xl border border-[var(--color-border)] bg-black/[0.035] p-3 transition-colors dark:bg-white/[0.05]",
        isOver && "bg-blue-500/10 ring-2 ring-blue-400"
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={clsx("h-2 w-2 rounded-full", stageAccent[stage])} />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">{stage}</h3>
          <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-xs font-semibold text-[var(--color-muted-foreground)] dark:bg-white/10">
            {deals.length}
          </span>
        </div>
      </div>
      <p className="mb-3 px-1 text-xs font-semibold text-[var(--color-muted-foreground)]">{formatCurrency(total)}</p>
      <div className="flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto scrollbar-thin pb-1">
        {deals.map((d) => (
          <DealCard key={d.id} deal={d} onClick={() => onCardClick(d)} />
        ))}
        {deals.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-border)] py-6 text-center">
            <Inbox className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <p className="px-2 text-xs text-[var(--color-muted-foreground)]">No deals here yet</p>
          </div>
        )}
      </div>
      <button
        onClick={() => onAddDeal(stage)}
        className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-border)] py-2 text-xs font-semibold text-[var(--color-muted-foreground)] transition-colors hover:border-blue-400 hover:text-blue-500"
      >
        <Plus className="h-3.5 w-3.5" /> Add deal
      </button>
    </div>
  );
}
