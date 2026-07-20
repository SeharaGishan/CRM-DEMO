import { PaymentLink, Receipt } from "@/lib/types";

export const receipts: Receipt[] = [
  { id: "rc-1", receiptNumber: "RCPT-2026-0001", dealId: "dl-5", amount: 61000, type: "full", gateway: "PayHere", customerName: "Chathura Gunawardena", date: "2026-06-30" },
  { id: "rc-2", receiptNumber: "RCPT-2026-0002", dealId: "dl-9", amount: 3000, type: "advance", gateway: "PayHere", customerName: "Nimal Rodrigo", date: "2026-06-26" },
  { id: "rc-3", receiptNumber: "RCPT-2026-0003", dealId: "dl-9", amount: 5900, type: "balance", gateway: "PayHere", customerName: "Nimal Rodrigo", date: "2026-07-01" },
  { id: "rc-4", receiptNumber: "RCPT-2026-0004", dealId: "dl-13", amount: 10000, type: "advance", gateway: "Stripe", customerName: "Isuru Madushanka", date: "2026-07-05" },
  { id: "rc-5", receiptNumber: "RCPT-2026-0005", dealId: "dl-8", amount: 25000, type: "advance", gateway: "PayHere", customerName: "Hasitha Karunaratne", date: "2026-07-11" },
];

export const paymentLinks: PaymentLink[] = [
  { id: "pl-1", dealId: "dl-2", type: "full", amount: 42000, gateway: "PayHere", url: "https://pay.sharkonix.lk/l/8f3ad1c2", status: "pending", createdAt: "2026-07-13" },
];
