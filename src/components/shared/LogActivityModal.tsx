"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { ActivityType } from "@/lib/types";
import { useEffect, useState } from "react";

const types: { value: ActivityType; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
];

export function LogActivityModal({
  open,
  onClose,
  contactId,
  dealId,
  initialType = "call",
}: {
  open: boolean;
  onClose: () => void;
  contactId: string;
  dealId?: string;
  initialType?: ActivityType;
}) {
  const { addActivity } = useAppData();
  const { showToast } = useToast();
  const [type, setType] = useState<ActivityType>(initialType);

  useEffect(() => {
    if (open) setType(initialType);
  }, [open, initialType]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addActivity({ contactId, dealId, type, title, body });
    showToast("Activity logged", "success");
    setTitle("");
    setBody("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Activity">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Type</label>
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setType(t.value)}
                className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  type === t.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300"
                    : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Follow-up call"
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Notes</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Activity</Button>
        </div>
      </form>
    </Modal>
  );
}
