"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { TaskPriority } from "@/lib/types";
import { useState } from "react";

export function TaskFormModal({
  open,
  onClose,
  contactId,
  dealId,
  defaultAssignee,
}: {
  open: boolean;
  onClose: () => void;
  contactId?: string;
  dealId?: string;
  defaultAssignee?: string;
}) {
  const { addTask, employees } = useAppData();
  const { showToast } = useToast();
  const activeEmployees = employees.filter((e) => e.status === "active");
  const initialAssignee =
    defaultAssignee && activeEmployees.some((e) => e.name === defaultAssignee)
      ? defaultAssignee
      : activeEmployees[0]?.name ?? "";
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("2026-07-20");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignee, setAssignee] = useState(initialAssignee);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTask({ title, dueDate, priority, assignee, status: "pending", contactId, dealId });
    showToast("Task created", "success");
    setTitle("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Task title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Due date</label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Assignee</label>
          <select
            required
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          >
            {activeEmployees.map((e) => (
              <option key={e.id} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Task</Button>
        </div>
      </form>
    </Modal>
  );
}
