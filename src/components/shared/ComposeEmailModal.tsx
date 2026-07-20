"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { Send } from "lucide-react";
import { useState } from "react";

export function ComposeEmailModal({
  open,
  onClose,
  contactId,
  contactEmail,
  dealId,
}: {
  open: boolean;
  onClose: () => void;
  contactId: string;
  contactEmail: string;
  dealId?: string;
}) {
  const { addActivity } = useAppData();
  const { showToast } = useToast();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      addActivity({ contactId, dealId, type: "email", title: subject, body });
      showToast(`Email sent to ${contactEmail}`, "success");
      setSending(false);
      setSubject("");
      setBody("");
      onClose();
    }, 500);
  }

  return (
    <Modal open={open} onClose={onClose} title="Compose Email">
      <form onSubmit={handleSend} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">To</label>
          <input
            disabled
            value={contactEmail}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.02] px-3 text-sm text-[var(--color-muted-foreground)] outline-none dark:bg-white/[0.02]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Subject</label>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Message</label>
          <textarea
            required
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Demo mode — this simulates sending; no real email is delivered.
        </p>
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={sending}>
            <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
