"use client";

import { LogActivityModal } from "@/components/shared/LogActivityModal";
import { TaskFormModal } from "@/components/shared/TaskFormModal";
import { PaymentLinkModal } from "@/components/pipeline/PaymentLinkModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import { Deal, DealStage, stockStatus } from "@/lib/types";
import { CheckCircle2, Mail, MessageSquarePlus, Package, Phone, Receipt as ReceiptIcon, StickyNote, Users2, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const activityIcon = { call: Phone, email: Mail, meeting: Users2, note: StickyNote };
const stages: DealStage[] = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];
const stockStatusTone = { "In Stock": "success", "Low Stock": "warning", "Out of Stock": "danger" } as const;

export function DealDetailModal({ deal, onClose }: { deal: Deal | null; onClose: () => void }) {
  const { getContact, getDealActivities, tasks, moveDealStage, getSaleInfo, simulatePaymentReceived, getProduct } =
    useAppData();
  const [logOpen, setLogOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (!deal) return null;

  const contact = getContact(deal.contactId);
  const activityLog = getDealActivities(deal.id);
  const dealTasks = tasks.filter((t) => t.dealId === deal.id);
  const sale = getSaleInfo(deal.id);
  const remainingBalance = deal.value - sale.totalPaid;
  const product = deal.productId ? getProduct(deal.productId) : undefined;

  return (
    <>
      <Modal open onClose={onClose} title={deal.title} maxWidth="max-w-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            {contact && <Avatar name={contact.name} colorPair={contact.avatarColor} size={36} />}
            <div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">{contact?.name}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{contact?.title}</p>
            </div>
            <span className="ml-auto text-xl font-extrabold text-[var(--color-foreground)]">
              {formatCurrency(deal.value)}
            </span>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Stage
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stages.map((s) => (
                <button
                  key={s}
                  onClick={() => moveDealStage(deal.id, s)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    deal.stage === s
                      ? "bg-blue-600 text-white"
                      : "bg-black/5 text-[var(--color-muted-foreground)] hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {product && (
            <Link
              href="/stock"
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-3.5 py-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)]">
                <Package className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                {product.name}
              </span>
              <Badge tone={stockStatusTone[stockStatus(product)]}>{stockStatus(product)}</Badge>
            </Link>
          )}

          <div className="glass-panel rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--color-foreground)]">Payment Status</p>
              <Badge tone={sale.status === "Paid in Full" ? "success" : sale.status === "Advance Paid" ? "warning" : "neutral"}>
                {sale.status}
              </Badge>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Paid</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                {formatCurrency(sale.totalPaid)} / {formatCurrency(deal.value)}
              </span>
            </div>
            <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${Math.min(100, (sale.totalPaid / deal.value) * 100)}%` }}
              />
            </div>

            {sale.receipts.length > 0 && (
              <div className="mb-3 flex flex-col gap-1.5">
                {sale.receipts.map((r) => (
                  <Link
                    key={r.id}
                    href={`/receipt/${encodeURIComponent(r.receiptNumber)}`}
                    target="_blank"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-1.5 font-medium text-[var(--color-foreground)]">
                      <ReceiptIcon className="h-3.5 w-3.5" /> {r.receiptNumber}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">
                      {formatCurrency(r.amount)} · {r.type}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {sale.pendingLink ? (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Payment link pending ({sale.pendingLink.type}, {formatCurrency(sale.pendingLink.amount)})
                </span>
                <Button size="sm" onClick={() => simulatePaymentReceived(sale.pendingLink!.id)}>
                  <Zap className="h-3.5 w-3.5" /> Simulate Payment
                </Button>
              </div>
            ) : (
              remainingBalance > 0 && (
                <Button size="sm" variant="secondary" className="w-full" onClick={() => setPaymentOpen(true)}>
                  <ReceiptIcon className="h-3.5 w-3.5" /> Send Payment Link
                </Button>
              )
            )}
            {remainingBalance <= 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Fully paid
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" onClick={() => setLogOpen(true)}>
              <StickyNote className="h-3.5 w-3.5" /> Log Activity
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setTaskOpen(true)}>
              <MessageSquarePlus className="h-3.5 w-3.5" /> Add Task
            </Button>
          </div>

          {dealTasks.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Linked Tasks
              </p>
              <div className="flex flex-col gap-1.5">
                {dealTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/[0.04]">
                    <span className={t.status === "done" ? "text-[var(--color-muted-foreground)] line-through" : "text-[var(--color-foreground)]"}>
                      {t.title}
                    </span>
                    <span className="text-xs text-[var(--color-muted-foreground)]">{formatDate(t.dueDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Activity Log
            </p>
            {activityLog.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No activity logged yet.</p>
            ) : (
              <div className="flex max-h-56 flex-col gap-3 overflow-y-auto scrollbar-thin pr-1">
                {activityLog.map((a) => {
                  const Icon = activityIcon[a.type];
                  return (
                    <div key={a.id} className="flex gap-2.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--color-foreground)]">{a.title}</p>
                          <span className="shrink-0 text-xs text-[var(--color-muted-foreground)]">{timeAgo(a.timestamp)}</span>
                        </div>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{a.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <LogActivityModal open={logOpen} onClose={() => setLogOpen(false)} contactId={deal.contactId} dealId={deal.id} />
      <TaskFormModal open={taskOpen} onClose={() => setTaskOpen(false)} contactId={deal.contactId} dealId={deal.id} defaultAssignee={deal.owner} />
      <PaymentLinkModal open={paymentOpen} onClose={() => setPaymentOpen(false)} deal={deal} remainingBalance={remainingBalance} />
    </>
  );
}
