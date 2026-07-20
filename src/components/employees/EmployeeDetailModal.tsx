"use client";

import { EmployeeFormModal } from "@/components/employees/EmployeeFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import { DealStage } from "@/lib/types";
import { Briefcase, Mail, Pencil, Phone, ShieldCheck, ShieldOff } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const stageTone: Record<DealStage, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  New: "neutral",
  Contacted: "primary",
  Proposal: "warning",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
};

const departmentTone: Record<string, "primary" | "success" | "warning"> = {
  Sales: "primary",
  Support: "success",
  Management: "warning",
};

export function EmployeeDetailModal({ employeeId, onClose }: { employeeId: string | null; onClose: () => void }) {
  const { deals, tasks, employees, toggleEmployeeStatus } = useAppData();
  const [editOpen, setEditOpen] = useState(false);
  const employee = employeeId ? employees.find((e) => e.id === employeeId) ?? null : null;

  const employeeDeals = useMemo(
    () => (employee ? deals.filter((d) => d.owner === employee.name && d.stage !== "Won" && d.stage !== "Lost") : []),
    [deals, employee]
  );
  const employeeTasks = useMemo(
    () => (employee ? tasks.filter((t) => t.assignee === employee.name && t.status === "pending") : []),
    [tasks, employee]
  );

  if (!employee) return null;

  return (
    <>
      <Modal open onClose={onClose} title="Employee Profile" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={employee.name} colorPair={employee.avatarColor} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-[var(--color-foreground)]">{employee.name}</h3>
                <Badge tone={employee.status === "active" ? "success" : "neutral"}>
                  {employee.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">{employee.role}</p>
              <div className="mt-1.5">
                <Badge tone={departmentTone[employee.department] ?? "primary"}>{employee.department}</Badge>
              </div>
            </div>
          </div>

          <div className="glass-panel grid grid-cols-1 gap-3 rounded-xl p-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <span className="truncate">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)] sm:col-span-2">
              <Briefcase className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <span>Joined {formatDate(employee.joinedAt)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit Profile
            </Button>
            <Button
              size="sm"
              variant={employee.status === "active" ? "danger" : "secondary"}
              onClick={() => toggleEmployeeStatus(employee.id)}
            >
              {employee.status === "active" ? (
                <>
                  <ShieldOff className="h-3.5 w-3.5" /> Deactivate
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Reactivate
                </>
              )}
            </Button>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Open Deals
              </p>
              <Badge tone="neutral">{employeeDeals.length}</Badge>
            </div>
            {employeeDeals.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No open deals assigned.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {employeeDeals.map((d) => (
                  <Link
                    key={d.id}
                    href="/pipeline"
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-foreground)]">{d.title}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-foreground)]">{formatCurrency(d.value)}</span>
                      <Badge tone={stageTone[d.stage]}>{d.stage}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Pending Tasks
              </p>
              <Badge tone="neutral">{employeeTasks.length}</Badge>
            </div>
            {employeeTasks.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No pending tasks assigned.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {employeeTasks.map((t) => (
                  <Link
                    key={t.id}
                    href="/tasks"
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-foreground)]">{t.title}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-[var(--color-muted-foreground)]">Due {formatDate(t.dueDate)}</span>
                      <Badge tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "neutral"}>
                        {t.priority}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <EmployeeFormModal open={editOpen} onClose={() => setEditOpen(false)} existing={employee} />
    </>
  );
}
