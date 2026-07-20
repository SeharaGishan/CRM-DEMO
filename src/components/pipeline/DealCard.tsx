"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency } from "@/lib/format";
import { Deal } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { Package, UserRound } from "lucide-react";

function daysInStage(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function CardBody({ deal }: { deal: Deal }) {
  const { getContact, getSaleInfo, getProduct } = useAppData();
  const contact = getContact(deal.contactId);
  const sale = getSaleInfo(deal.id);
  const product = deal.productId ? getProduct(deal.productId) : undefined;

  return (
    <>
      <p className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--color-foreground)]">{deal.title}</p>
      <div className="mb-2 flex items-center gap-2">
        <Avatar name={contact?.name ?? "?"} colorPair={contact?.avatarColor} size={22} />
        <span className="truncate text-xs text-[var(--color-muted-foreground)]">{contact?.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--color-foreground)]">{formatCurrency(deal.value)}</span>
        <span className="text-[11px] text-[var(--color-muted-foreground)]">{daysInStage(deal.stageChangedAt)}d in stage</span>
      </div>
      <div className="mt-2 flex items-center gap-1 border-t border-[var(--color-border)] pt-2 text-[11px] text-[var(--color-muted-foreground)]">
        <UserRound className="h-3 w-3 shrink-0" />
        <span className="truncate">{deal.owner}</span>
      </div>
      {product && (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-muted-foreground)]">
          <Package className="h-3 w-3 shrink-0" />
          <span className="truncate">{product.name}</span>
        </div>
      )}
      {sale.status !== "Unpaid" && (
        <div className="mt-2">
          <Badge tone={sale.status === "Paid in Full" ? "success" : "warning"}>{sale.status}</Badge>
        </div>
      )}
    </>
  );
}

// A floating, non-interactive clone rendered inside <DragOverlay>. Using an
// overlay (rather than transforming the original card in place) means the
// dragged card is portaled to the body and can visually cross column
// boundaries — the original card's list container scrolls both axes
// (overflow-y-auto forces overflow-x to "auto" too), which would otherwise
// clip a transformed card the moment it left its own column.
export function DealCardOverlay({ deal }: { deal: Deal }) {
  return (
    <div className="surface-card w-72 rotate-2 cursor-grabbing rounded-xl p-3.5 shadow-2xl">
      <CardBody deal={deal} />
    </div>
  );
}

export function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={clsx(
        "surface-card card-hover-lift cursor-grab touch-none rounded-xl p-3.5 active:cursor-grabbing",
        isDragging && "opacity-30"
      )}
    >
      <CardBody deal={deal} />
    </div>
  );
}
