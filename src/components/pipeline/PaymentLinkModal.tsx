"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/format";
import { Deal, PaymentGateway, PaymentType } from "@/lib/types";
import { Copy, Link2 } from "lucide-react";
import { useState } from "react";

const gateways: PaymentGateway[] = ["PayHere", "Stripe", "PayPal"];

export function PaymentLinkModal({
  open,
  onClose,
  deal,
  remainingBalance,
}: {
  open: boolean;
  onClose: () => void;
  deal: Deal;
  remainingBalance: number;
}) {
  const { createPaymentLink } = useAppData();
  const { showToast } = useToast();
  const [type, setType] = useState<PaymentType>("advance");
  const [amount, setAmount] = useState(Math.round(remainingBalance * 0.3));
  const [gateway, setGateway] = useState<PaymentGateway>("PayHere");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const finalAmount = type === "full" ? remainingBalance : amount;
    const link = createPaymentLink(deal.id, type, finalAmount, gateway);
    setGeneratedUrl(link.url);
  }

  function handleClose() {
    setGeneratedUrl(null);
    setType("advance");
    onClose();
  }

  function copyLink() {
    if (generatedUrl) {
      navigator.clipboard?.writeText(generatedUrl).catch(() => {});
      showToast("Payment link copied to clipboard", "info");
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Send Payment Link">
      {generatedUrl ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Share this link with the customer to complete their {type === "advance" ? "advance" : "full"} payment of{" "}
            <span className="font-semibold text-[var(--color-foreground)]">
              {formatCurrency(type === "full" ? remainingBalance : amount)}
            </span>{" "}
            via {gateway}.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
            <Link2 className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
            <span className="truncate text-sm text-[var(--color-foreground)]">{generatedUrl}</span>
            <button
              onClick={copyLink}
              className="ml-auto cursor-pointer rounded-lg p-1.5 text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            Demo mode: no real gateway is connected. Use <strong>Simulate Payment Received</strong> on the deal to
            demonstrate what happens once the customer pays.
          </div>
          <div className="mt-1 flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Payment type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("advance")}
                className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  type === "advance"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300"
                    : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                Advance Payment
              </button>
              <button
                type="button"
                onClick={() => setType("full")}
                className={`flex-1 cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  type === "full"
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300"
                    : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                Full Payment
              </button>
            </div>
          </div>

          {type === "advance" ? (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">
                Advance amount (USD)
              </label>
              <input
                required
                type="number"
                min={1}
                max={remainingBalance}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
              />
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                Remaining balance: {formatCurrency(remainingBalance)}
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-blue-500/10 px-3 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-300">
              Full amount: {formatCurrency(remainingBalance)}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-foreground)]">Gateway</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value as PaymentGateway)}
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
            >
              {gateways.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-1 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Link2 className="h-4 w-4" /> Generate Link
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
