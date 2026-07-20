"use client";

import { ProductDetailModal } from "@/components/products/ProductDetailModal";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { formatCurrency } from "@/lib/format";
import { StockStatus, stockStatus } from "@/lib/types";
import { motion } from "framer-motion";
import { AlertTriangle, Package, PackageCheck, PackageX, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

const filters: (StockStatus | "All")[] = ["All", "In Stock", "Low Stock", "Out of Stock"];

const statusTone: Record<StockStatus, "success" | "warning" | "danger"> = {
  "In Stock": "success",
  "Low Stock": "warning",
  "Out of Stock": "danger",
};

const statusIcon = {
  "In Stock": PackageCheck,
  "Low Stock": AlertTriangle,
  "Out of Stock": PackageX,
};

export default function StockPage() {
  const { products, deals } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ready = useDelayedReady(400);

  const soldCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of deals) {
      if (d.productId && d.stage === "Won") map.set(d.productId, (map.get(d.productId) ?? 0) + 1);
    }
    return map;
  }, [deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const status = stockStatus(p);
      if (filter !== "All" && status !== filter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, query, filter]);

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-11 w-full rounded-xl" />
        <SkeletonRows count={6} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] pl-10 pr-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "glass-panel text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.9fr_1fr] gap-4 border-b border-[var(--color-border)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map((p, i) => {
            const status = stockStatus(p);
            const StatusIcon = statusIcon[status];
            const sold = soldCounts.get(p.id) ?? 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.03 }}
              >
                <button
                  onClick={() => setSelectedId(p.id)}
                  className="grid w-full grid-cols-1 gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1.4fr_1fr_0.8fr_0.9fr_1fr] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
                      <Package className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{p.name}</p>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                        {p.sku}
                        {sold > 0 ? ` · ${sold} sold` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="truncate text-sm text-[var(--color-muted-foreground)]">{p.category}</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">{formatCurrency(p.unitPrice)}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{p.stockQuantity} units</p>
                  <div>
                    <Badge tone={statusTone[status]}>
                      <StatusIcon className="h-3 w-3" /> {status}
                    </Badge>
                  </div>
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Package className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">No products match your search</p>
            </div>
          )}
        </div>
      </GlassCard>

      <ProductFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ProductDetailModal productId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
