"use client";

import { ProductFormModal } from "@/components/products/ProductFormModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency } from "@/lib/format";
import { DealStage, stockStatus } from "@/lib/types";
import { AlertTriangle, Package, PackageCheck, PackageX, Pencil, Plus, Tag } from "lucide-react";
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

const statusTone = {
  "In Stock": "success" as const,
  "Low Stock": "warning" as const,
  "Out of Stock": "danger" as const,
};

const statusIcon = {
  "In Stock": PackageCheck,
  "Low Stock": AlertTriangle,
  "Out of Stock": PackageX,
};

export function ProductDetailModal({ productId, onClose }: { productId: string | null; onClose: () => void }) {
  const { products, deals, adjustStock } = useAppData();
  const [editOpen, setEditOpen] = useState(false);
  const [restockAmount, setRestockAmount] = useState(10);
  const product = productId ? products.find((p) => p.id === productId) ?? null : null;

  const linkedDeals = useMemo(
    () => (product ? deals.filter((d) => d.productId === product.id) : []),
    [deals, product]
  );

  if (!product) return null;

  const status = stockStatus(product);
  const StatusIcon = statusIcon[status];

  return (
    <>
      <Modal open onClose={onClose} title="Product Profile" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
              <Package className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-[var(--color-foreground)]">{product.name}</h3>
                <Badge tone={statusTone[status]}>
                  <StatusIcon className="h-3 w-3" /> {status}
                </Badge>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                <Tag className="h-3.5 w-3.5" /> {product.sku} · {product.category}
              </p>
            </div>
          </div>

          <div className="glass-panel grid grid-cols-2 gap-3 rounded-xl p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">Unit Price</p>
              <p className="text-lg font-extrabold text-[var(--color-foreground)]">{formatCurrency(product.unitPrice)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">In Stock</p>
              <p className="text-lg font-extrabold text-[var(--color-foreground)]">{product.stockQuantity}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-muted-foreground)]">Reorder Level</p>
              <p className="text-lg font-extrabold text-[var(--color-foreground)]">{product.reorderLevel}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-foreground)]">Restock quantity</label>
              <input
                type="number"
                min={1}
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
              />
            </div>
            <Button size="sm" onClick={() => adjustStock(product.id, Math.max(1, restockAmount))}>
              <Plus className="h-3.5 w-3.5" /> Restock
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Linked Deals
              </p>
              <Badge tone="neutral">{linkedDeals.length}</Badge>
            </div>
            {linkedDeals.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No deals are selling this product yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {linkedDeals.map((d) => (
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
        </div>
      </Modal>

      <ProductFormModal open={editOpen} onClose={() => setEditOpen(false)} existing={product} />
    </>
  );
}
