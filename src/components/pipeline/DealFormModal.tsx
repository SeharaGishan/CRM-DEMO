"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { DealStage, DEAL_STAGES } from "@/lib/types";
import { useState } from "react";

export function DealFormModal({
  open,
  onClose,
  defaultStage,
}: {
  open: boolean;
  onClose: () => void;
  defaultStage?: DealStage;
}) {
  const { contacts, employees, products, addDeal } = useAppData();
  const { showToast } = useToast();
  const activeEmployees = employees.filter((e) => e.status === "active");
  const [title, setTitle] = useState("");
  const [contactId, setContactId] = useState(contacts[0]?.id ?? "");
  const [value, setValue] = useState(10000);
  const [stage, setStage] = useState<DealStage>(defaultStage ?? "New");
  const [owner, setOwner] = useState(activeEmployees[0]?.name ?? "");
  const [closeDate, setCloseDate] = useState("2026-08-30");
  const [productId, setProductId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addDeal({ title, contactId, value, stage, owner, closeDate, productId: productId || undefined });
    showToast(`Deal "${title}" created`, "success");
    setTitle("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Deal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Deal title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Contact</label>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          >
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Value (USD)</label>
            <input
              required
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            >
              {DEAL_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Owner</label>
            <select
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            >
              {activeEmployees.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Expected close</label>
            <input
              required
              type="date"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">
            Product <span className="font-normal text-[var(--color-muted-foreground)]">(optional)</span>
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          >
            <option value="">None</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.stockQuantity} in stock)
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Deal</Button>
        </div>
      </form>
    </Modal>
  );
}
