"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import { Deal, DealStage } from "@/lib/types";
import Link from "next/link";

const stageTone: Record<DealStage, "primary" | "warning" | "success" | "danger"> = {
  New: "primary",
  Contacted: "primary",
  Proposal: "warning",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
};

export function ActiveDealsTable({ deals, onSelect }: { deals: Deal[]; onSelect: (deal: Deal) => void }) {
  const { getContact } = useAppData();

  return (
    <div className="surface-card card-hover-lift overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-base font-bold text-[var(--color-foreground)]">Active Deals</h2>
        <Link href="/pipeline" className="text-xs font-semibold text-blue-500 hover:underline">
          View all →
        </Link>
      </div>
      <div className="hidden grid-cols-[1.6fr_1fr_0.9fr_0.9fr_auto] gap-4 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
        <span>Client</span>
        <span>Deal</span>
        <span>Close Date</span>
        <span>Value</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {deals.map((deal) => {
          const contact = getContact(deal.contactId);
          return (
            <button
              key={deal.id}
              onClick={() => onSelect(deal)}
              className="grid w-full cursor-pointer grid-cols-1 gap-2 px-5 py-3 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1.6fr_1fr_0.9fr_0.9fr_auto] md:items-center md:gap-4"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {contact && <Avatar name={contact.name} colorPair={contact.avatarColor} size={30} />}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{contact?.name}</p>
                  <p className="truncate text-xs text-[var(--color-muted-foreground)]">{contact?.email}</p>
                </div>
              </div>
              <p className="truncate text-sm text-[var(--color-muted-foreground)]">{deal.title}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{formatDate(deal.closeDate)}</p>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">{formatCurrency(deal.value)}</p>
              <div>
                <Badge tone={stageTone[deal.stage]}>{deal.stage}</Badge>
              </div>
            </button>
          );
        })}
        {deals.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[var(--color-muted-foreground)]">No active deals yet.</div>
        )}
      </div>
    </div>
  );
}
