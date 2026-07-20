"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { EMPLOYEE_DEPARTMENTS, Employee, EmployeeDepartment } from "@/lib/types";
import { useState } from "react";

const colorOptions = ["#2563EB,#7C3AED", "#059669,#22C55E", "#EA580C,#F59E0B", "#DB2777,#EC4899", "#0891B2,#06B6D4", "#4F46E5,#818CF8"];

export function EmployeeFormModal({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Employee;
}) {
  const { addEmployee, updateEmployee } = useAppData();
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState(existing?.role ?? "");
  const [department, setDepartment] = useState<EmployeeDepartment>(existing?.department ?? "Sales");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (existing) {
      updateEmployee(existing.id, { name, role, department, email, phone });
    } else {
      addEmployee({
        name,
        role,
        department,
        email,
        phone,
        avatarColor: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Employee" : "Add Employee"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Job title">
            <input required value={role} onChange={(e) => setRole(e.target.value)} className="input" />
          </Field>
          <Field label="Department">
            <select
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value as EmployeeDepartment)}
              className="input"
            >
              {EMPLOYEE_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </Field>
          <Field label="Phone">
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
          </Field>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{existing ? "Save Changes" : "Add Employee"}</Button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">{label}</label>
      {children}
    </div>
  );
}
