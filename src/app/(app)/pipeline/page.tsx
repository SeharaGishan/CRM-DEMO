"use client";

import { DealCardOverlay } from "@/components/pipeline/DealCard";
import { DealDetailModal } from "@/components/pipeline/DealDetailModal";
import { DealFormModal } from "@/components/pipeline/DealFormModal";
import { KanbanColumn } from "@/components/pipeline/KanbanColumn";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { DEAL_STAGES, Deal, DealStage } from "@/lib/types";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PipelinePage() {
  const { deals, moveDealStage } = useAppData();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addStage, setAddStage] = useState<DealStage | undefined>(undefined);
  const [addKey, setAddKey] = useState(0);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const ready = useDelayedReady(450);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  if (!ready) {
    return (
      <div className="flex h-full flex-col gap-4">
        <Skeleton className="h-5 w-64" />
        <div className="flex flex-1 gap-3 overflow-x-auto pb-3">
          {DEAL_STAGES.map((stage) => (
            <div key={stage} className="flex w-72 shrink-0 flex-col gap-2.5 rounded-2xl border border-[var(--color-border)] bg-black/[0.02] p-3 dark:bg-white/[0.02]">
              <Skeleton className="h-5 w-24" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as DealStage;
    if (DEAL_STAGES.includes(newStage)) {
      moveDealStage(active.id as string, newStage);
    }
  }

  function openAddDeal(stage?: DealStage) {
    setAddStage(stage);
    setAddKey((k) => k + 1);
    setAddOpen(true);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">Drag deals across stages to update the pipeline.</p>
        <Button onClick={() => openAddDeal(undefined)}>
          <Plus className="h-4 w-4" /> Add Deal
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 gap-3 overflow-x-auto scrollbar-thin pb-3"
        >
          {DEAL_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={deals.filter((d) => d.stage === stage)}
              onCardClick={setSelectedDeal}
              onAddDeal={openAddDeal}
            />
          ))}
        </motion.div>

        <DragOverlay>{activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}</DragOverlay>
      </DndContext>

      <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      <DealFormModal key={addKey} open={addOpen} onClose={() => setAddOpen(false)} defaultStage={addStage} />
    </div>
  );
}
