"use client";

import { CompanyFormModal } from "@/components/companies/CompanyFormModal";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { Contact } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";

const colorOptions = ["#2563EB,#7C3AED", "#059669,#22C55E", "#EA580C,#F59E0B", "#DB2777,#EC4899", "#0891B2,#06B6D4"];

export function ContactFormModal({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Contact;
}) {
  const { companies, addContact, updateContact } = useAppData();
  const { showToast } = useToast();
  const [name, setName] = useState(existing?.name ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [companyId, setCompanyId] = useState(existing?.companyId ?? companies[0]?.id ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [tags, setTags] = useState(existing?.tags.join(", ") ?? "");
  const [quickAddCompanyOpen, setQuickAddCompanyOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (existing) {
      updateContact(existing.id, { name, title, companyId, email, phone, tags: tagList });
      showToast(`Contact "${name}" updated`, "success");
    } else {
      addContact({
        name,
        title,
        companyId,
        email,
        phone,
        tags: tagList,
        avatarColor: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        source: "Manual entry",
      });
      showToast(`Contact "${name}" added`, "success");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Contact" : "Add Contact"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <Field label="Job title">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-semibold text-[var(--color-foreground)]">Company</label>
            <button
              type="button"
              onClick={() => setQuickAddCompanyOpen(true)}
              className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-500 hover:underline"
            >
              <Plus className="h-3 w-3" /> Add new company
            </button>
          </div>
          <select required value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input">
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </Field>
          <Field label="Phone">
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Tags" hint="Comma separated, e.g. Decision Maker, VIP">
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="input" />
        </Field>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{existing ? "Save Changes" : "Add Contact"}</Button>
        </div>
      </form>
      <style jsx global>{`
        .input {
          height: 2.75rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: rgba(0, 0, 0, 0.03);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
        }
        .input:focus-visible {
          box-shadow: 0 0 0 2px #60a5fa;
        }
      `}</style>
      <CompanyFormModal
        open={quickAddCompanyOpen}
        onClose={() => setQuickAddCompanyOpen(false)}
        onCreated={(company) => setCompanyId(company.id)}
      />
    </Modal>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{hint}</p>}
    </div>
  );
}
