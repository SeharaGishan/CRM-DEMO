"use client";

import { EmployeeDetailModal } from "@/components/employees/EmployeeDetailModal";
import { EmployeeFormModal } from "@/components/employees/EmployeeFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { EmployeeStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { Plus, Search, UserCog } from "lucide-react";
import { useMemo, useState } from "react";

const filters: (EmployeeStatus | "All")[] = ["All", "active", "inactive"];
const filterLabel: Record<(typeof filters)[number], string> = { All: "All", active: "Active", inactive: "Inactive" };

const departmentTone: Record<string, "primary" | "success" | "warning"> = {
  Sales: "primary",
  Support: "success",
  Management: "warning",
};

export default function EmployeesPage() {
  const { employees, deals, tasks } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ready = useDelayedReady(400);

  const workload = useMemo(() => {
    const map = new Map<string, { deals: number; tasks: number }>();
    for (const e of employees) {
      const openDeals = deals.filter((d) => d.owner === e.name && d.stage !== "Won" && d.stage !== "Lost").length;
      const pendingTasks = tasks.filter((t) => t.assignee === e.name && t.status === "pending").length;
      map.set(e.id, { deals: openDeals, tasks: pendingTasks });
    }
    return map;
  }, [employees, deals, tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((e) => {
      if (filter !== "All" && e.status !== filter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });
  }, [employees, query, filter]);

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-11 w-full rounded-xl" />
        <SkeletonRows count={6} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, department, or email..."
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] pl-10 pr-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "glass-panel text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 border-b border-[var(--color-border)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
          <span>Employee</span>
          <span>Role</span>
          <span>Contact</span>
          <span>Workload</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map((e, i) => {
            const load = workload.get(e.id) ?? { deals: 0, tasks: 0 };
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.03 }}
              >
                <button
                  onClick={() => setSelectedId(e.id)}
                  className="grid w-full grid-cols-1 gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={e.name} colorPair={e.avatarColor} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{e.name}</p>
                      <Badge tone={departmentTone[e.department] ?? "primary"}>{e.department}</Badge>
                    </div>
                  </div>
                  <p className="truncate text-sm text-[var(--color-muted-foreground)]">{e.role}</p>
                  <p className="truncate text-sm text-[var(--color-muted-foreground)]">{e.email}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {load.deals} deal{load.deals === 1 ? "" : "s"} · {load.tasks} task{load.tasks === 1 ? "" : "s"}
                  </p>
                  <div>
                    <Badge tone={e.status === "active" ? "success" : "neutral"}>
                      {e.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <UserCog className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">No employees match your search</p>
            </div>
          )}
        </div>
      </GlassCard>

      <EmployeeFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EmployeeDetailModal employeeId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
