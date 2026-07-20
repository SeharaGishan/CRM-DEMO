"use client";

import { DealDetailModal } from "@/components/pipeline/DealDetailModal";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { formatCurrency } from "@/lib/format";
import { Deal, SalePaymentStatus } from "@/lib/types";
import { Receipt, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const filters: (SalePaymentStatus | "All")[] = ["All", "Unpaid", "Advance Paid", "Paid in Full"];

const statusTone: Record<SalePaymentStatus, "neutral" | "warning" | "success"> = {
  Unpaid: "neutral",
  "Advance Paid": "warning",
  "Paid in Full": "success",
};

export default function SalesPage() {
  const { findByReceiptNumber, getContact, getCompany } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const ready = useDelayedReady(400);

  const results = useMemo(() => {
    const base = findByReceiptNumber(query);
    if (filter === "All") return base;
    return base.filter((s) => s.status === filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter]);

  const totalCollected = results.reduce((sum, s) => sum + s.totalPaid, 0);

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-11 w-full rounded-xl" />
        <SkeletonRows count={5} />
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
            placeholder="Search by receipt number, customer, or deal..."
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
      </div>

      <GlassCard className="p-4">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Total collected across {results.length} sale{results.length === 1 ? "" : "s"}:{" "}
          <span className="font-bold text-[var(--color-foreground)]">{formatCurrency(totalCollected)}</span>
        </p>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 border-b border-[var(--color-border)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
          <span>Deal</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Paid / Total</span>
          <span>Latest Receipt</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {results.map((s) => {
            const contact = getContact(s.deal.contactId);
            const company = contact ? getCompany(contact.companyId) : undefined;
            const latestReceipt = s.receipts[s.receipts.length - 1];
            return (
              <button
                key={s.deal.id}
                onClick={() => setSelectedDeal(s.deal)}
                className="grid w-full grid-cols-1 gap-2 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{s.deal.title}</p>
                  <p className="truncate text-xs text-[var(--color-muted-foreground)]">{company?.name}</p>
                </div>
                <p className="truncate text-sm text-[var(--color-muted-foreground)]">{contact?.name}</p>
                <div>
                  <Badge tone={statusTone[s.status]}>{s.status}</Badge>
                </div>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {formatCurrency(s.totalPaid)} / {formatCurrency(s.deal.value)}
                </p>
                {latestReceipt ? (
                  <Link
                    href={`/receipt/${encodeURIComponent(latestReceipt.receiptNumber)}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    <Receipt className="h-3.5 w-3.5" /> {latestReceipt.receiptNumber}
                  </Link>
                ) : (
                  <span className="text-sm text-[var(--color-muted-foreground)]">—</span>
                )}
              </button>
            );
          })}
          {results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Receipt className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">No sales match your search</p>
            </div>
          )}
        </div>
      </GlassCard>

      <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </div>
  );
}
