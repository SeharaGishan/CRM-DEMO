"use client";

import { TaskFormModal } from "@/components/shared/TaskFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { formatDate } from "@/lib/format";
import { Task } from "@/lib/types";
import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";

function dayDiff(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export default function TasksPage() {
  const { tasks, toggleTask, getContact } = useAppData();
  const [addOpen, setAddOpen] = useState(false);
  const ready = useDelayedReady(400);

  const groups = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "pending").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const done = tasks.filter((t) => t.status === "done");
    return {
      overdue: pending.filter((t) => dayDiff(t.dueDate) < 0),
      today: pending.filter((t) => dayDiff(t.dueDate) === 0),
      week: pending.filter((t) => dayDiff(t.dueDate) > 0 && dayDiff(t.dueDate) <= 7),
      later: pending.filter((t) => dayDiff(t.dueDate) > 7),
      done,
    };
  }, [tasks]);

  const sections: { label: string; items: Task[]; tone: "danger" | "primary" | "neutral" }[] = [
    { label: "Overdue", items: groups.overdue, tone: "danger" },
    { label: "Today", items: groups.today, tone: "primary" },
    { label: "This Week", items: groups.week, tone: "neutral" },
    { label: "Later", items: groups.later, tone: "neutral" },
    { label: "Completed", items: groups.done, tone: "neutral" },
  ];

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {groups.overdue.length} overdue · {groups.today.length} due today
        </p>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <GlassCard key={section.label} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--color-foreground)]">{section.label}</h2>
                <Badge tone={section.tone}>{section.items.length}</Badge>
              </div>
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {section.items.map((t) => {
                  const contact = t.contactId ? getContact(t.contactId) : undefined;
                  return (
                    <div key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <button
                        onClick={() => toggleTask(t.id)}
                        aria-label={t.status === "done" ? "Mark as pending" : "Mark as done"}
                        className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors ${
                          t.status === "done"
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-[var(--color-border)] hover:border-blue-400"
                        }`}
                      >
                        {t.status === "done" && <Check className="h-3.5 w-3.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold ${
                            t.status === "done" ? "text-[var(--color-muted-foreground)] line-through" : "text-[var(--color-foreground)]"
                          }`}
                        >
                          {t.title}
                        </p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {contact ? `${contact.name} · ` : ""}Due {formatDate(t.dueDate)}
                        </p>
                      </div>
                      <Badge tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "neutral"}>
                        {t.priority}
                      </Badge>
                      <Avatar name={t.assignee} size={30} />
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )
      )}

      <TaskFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
