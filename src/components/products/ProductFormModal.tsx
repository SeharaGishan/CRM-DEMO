"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { PRODUCT_CATEGORIES, Product, ProductCategory } from "@/lib/types";
import { useState } from "react";

export function ProductFormModal({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Product;
}) {
  const { addProduct, updateProduct } = useAppData();
  const [name, setName] = useState(existing?.name ?? "");
  const [sku, setSku] = useState(existing?.sku ?? "");
  const [category, setCategory] = useState<ProductCategory>(existing?.category ?? PRODUCT_CATEGORIES[0]);
  const [unitPrice, setUnitPrice] = useState(existing?.unitPrice ?? 1000);
  const [stockQuantity, setStockQuantity] = useState(existing?.stockQuantity ?? 10);
  const [reorderLevel, setReorderLevel] = useState(existing?.reorderLevel ?? 5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (existing) {
      updateProduct(existing.id, { name, sku, category, unitPrice, stockQuantity, reorderLevel });
    } else {
      addProduct({ name, sku, category, unitPrice, stockQuantity, reorderLevel });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={existing ? "Edit Product" : "Add Product"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Product name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="SKU">
            <input required value={sku} onChange={(e) => setSku(e.target.value)} className="input" placeholder="e.g. SHX-CRM-PRO" />
          </Field>
          <Field label="Category">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="input"
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Unit price (USD)">
            <input
              required
              type="number"
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Stock quantity">
            <input
              required
              type="number"
              min={0}
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Reorder level" hint="Low-stock threshold">
            <input
              required
              type="number"
              min={0}
              value={reorderLevel}
              onChange={(e) => setReorderLevel(Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{existing ? "Save Changes" : "Add Product"}</Button>
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
