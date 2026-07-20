"use client";

import { useAppData } from "@/context/AppDataContext";
import { formatCurrency, formatDate } from "@/lib/format";
import { ArrowLeft, Printer, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const typeLabel: Record<string, string> = {
  advance: "Advance Payment",
  full: "Full Payment",
  balance: "Balance Payment",
};

export default function ReceiptPage() {
  const params = useParams<{ receiptNumber: string }>();
  const { receipts, getDeal, getContact, getCompany } = useAppData();

  const receipt = receipts.find((r) => r.receiptNumber === decodeURIComponent(params.receiptNumber));

  if (!receipt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-center">
        <p className="text-sm font-medium text-slate-500">Receipt not found.</p>
        <Link href="/sales" className="text-sm font-semibold text-blue-600 hover:underline">
          Back to Sales
        </Link>
      </div>
    );
  }

  const deal = getDeal(receipt.dealId);
  const contact = deal ? getContact(deal.contactId) : undefined;
  const company = contact ? getCompany(contact.companyId) : undefined;

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-xl items-center justify-between px-4 no-print">
        <Link href="/sales" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to Sales
        </Link>
        <button
          onClick={() => window.print()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Printer className="h-4 w-4" /> Print Receipt
        </button>
      </div>

      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900">Sharkonix CRM</p>
              <p className="text-xs text-slate-500">Sharkonix Technologies (Pvt) Ltd</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">Receipt</p>
            <p className="text-sm font-bold text-slate-900">{receipt.receiptNumber}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Billed To</p>
            <p className="font-semibold text-slate-900">{receipt.customerName}</p>
            <p className="text-slate-500">{company?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">Date</p>
            <p className="font-semibold text-slate-900">{formatDate(receipt.date)}</p>
          </div>
        </div>

        <table className="mb-6 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-3">
                <p className="font-semibold text-slate-900">{deal?.title ?? "CRM Services"}</p>
                <p className="text-xs text-slate-500">{typeLabel[receipt.type]} · via {receipt.gateway}</p>
              </td>
              <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(receipt.amount)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 text-right font-bold text-slate-900">Total Paid</td>
              <td className="pt-3 text-right text-lg font-extrabold text-slate-900">
                {formatCurrency(receipt.amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          {`This receipt confirms the ${typeLabel[receipt.type].toLowerCase()} recorded against deal "${deal?.title}". Generated automatically by Sharkonix CRM — demo document for presentation purposes.`}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Sharkonix Technologies (Pvt) Ltd · This is a property of Sharkonix Technologies Private Limited
        </p>
      </div>
    </div>
  );
}
