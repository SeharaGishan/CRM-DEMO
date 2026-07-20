"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { COMPANY_SIZES, Company } from "@/lib/types";
import { useState } from "react";

const colorOptions = ["#2563EB,#7C3AED", "#059669,#22C55E", "#EA580C,#F59E0B", "#DB2777,#EC4899", "#0891B2,#06B6D4", "#4F46E5,#818CF8"];

export function CompanyFormModal({
  open,
  onClose,
  existing,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Company;
  onCreated?: (company: Company) => void;
}) {
  const { addCompany, updateCompany } = useAppData();
  const [name, setName] = useState(existing?.name ?? "");
  const [industry, setIndustry] = useState(existing?.industry ?? "");
  const [size, setSize] = useState(existing?.size ?? COMPANY_SIZES[0]);
  const [website, setWebsite] = useState(existing?.website ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (existing) {
      updateCompany(existing.id, { name, industry, size, website });
    } else {
      const created = addCompany({
        name,
        industry,
        size,
        website,
        avatarColor: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      });
      onCreated?.(created);
      setName("");
      setIndustry("");
      setWebsite("");
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Company" : "Add Company"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Company name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Industry">
            <input required value={industry} onChange={(e) => setIndustry(e.target.value)} className="input" placeholder="e.g. Manufacturing" />
          </Field>
          <Field label="Company size">
            <select required value={size} onChange={(e) => setSize(e.target.value)} className="input">
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Website" hint="e.g. example.com">
          <input required value={website} onChange={(e) => setWebsite(e.target.value)} className="input" />
        </Field>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{existing ? "Save Changes" : "Add Company"}</Button>
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
