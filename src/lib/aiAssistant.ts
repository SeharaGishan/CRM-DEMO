import { Activity, Company, Contact, Deal, Task } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface AssistantContext {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  getSaleInfo: (dealId: string) => { totalPaid: number; status: string };
}

function dayDiff(dueDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

export const suggestedPrompts = [
  "What's our total pipeline value?",
  "Which deals are overdue on payment?",
  "Show me overdue tasks",
  "Who are our hottest leads?",
];

export function generateAssistantReply(query: string, ctx: AssistantContext): string {
  const q = query.toLowerCase().trim();

  const openDeals = ctx.deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
  const wonDeals = ctx.deals.filter((d) => d.stage === "Won");
  const lostDeals = ctx.deals.filter((d) => d.stage === "Lost");

  if (/pipeline value|total pipeline|how much.*pipeline/.test(q)) {
    const total = openDeals.reduce((s, d) => s + d.value, 0);
    return `Your current open pipeline is worth ${formatCurrency(total)} across ${openDeals.length} active deals. Want a breakdown by stage?`;
  }

  if (/conversion|win rate/.test(q)) {
    const rate = wonDeals.length + lostDeals.length > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;
    return `Your conversion rate is ${rate}% — ${wonDeals.length} won vs ${lostDeals.length} lost so far.`;
  }

  if (/overdue.*payment|payment.*overdue|advance paid|unpaid/.test(q)) {
    const withPayments = ctx.deals.filter((d) => ctx.getSaleInfo(d.id).status !== "Unpaid");
    const partial = withPayments.filter((d) => ctx.getSaleInfo(d.id).status === "Advance Paid");
    if (partial.length === 0) return "No deals are currently sitting on a partial (advance) payment — nice, everything's either unpaid or fully settled.";
    const names = partial.map((d) => d.title).slice(0, 5).join(", ");
    return `${partial.length} deal(s) have an advance payment but aren't fully paid yet: ${names}. Want me to open the Sales page?`;
  }

  if (/overdue task|late task/.test(q)) {
    const overdue = ctx.tasks.filter((t) => t.status === "pending" && dayDiff(t.dueDate) < 0);
    if (overdue.length === 0) return "No overdue tasks right now — the team is caught up.";
    const names = overdue.map((t) => t.title).slice(0, 5).join("; ");
    return `You have ${overdue.length} overdue task(s): ${names}.`;
  }

  if (/hot lead|hottest lead|best lead/.test(q)) {
    const hot = ctx.contacts.filter((c) => c.tags.includes("Hot Lead"));
    if (hot.length === 0) return "No contacts are currently tagged as Hot Lead.";
    const names = hot.map((c) => c.name).join(", ");
    return `Your hottest leads right now: ${names}.`;
  }

  if (/task.*today|due today/.test(q)) {
    const today = ctx.tasks.filter((t) => t.status === "pending" && dayDiff(t.dueDate) === 0);
    if (today.length === 0) return "Nothing due today — you're clear.";
    return `${today.length} task(s) due today: ${today.map((t) => t.title).join("; ")}.`;
  }

  if (/won this month|deals won/.test(q)) {
    const thisMonth = wonDeals.filter((d) => d.closeDate.startsWith("2026-07"));
    const total = thisMonth.reduce((s, d) => s + d.value, 0);
    return `${thisMonth.length} deal(s) won this month, worth ${formatCurrency(total)} total.`;
  }

  const companyMatch = ctx.companies.find((c) => q.includes(c.name.toLowerCase()));
  if (companyMatch) {
    const relatedContacts = ctx.contacts.filter((c) => c.companyId === companyMatch.id);
    const relatedDeals = ctx.deals.filter((d) => relatedContacts.some((c) => c.id === d.contactId));
    const dealSummary = relatedDeals.length
      ? relatedDeals.map((d) => `${d.title} (${d.stage}, ${formatCurrency(d.value)})`).join("; ")
      : "no deals on record yet";
    return `${companyMatch.name}: ${relatedContacts.length} contact(s). Deals — ${dealSummary}.`;
  }

  const contactMatch = ctx.contacts.find((c) => q.includes(c.name.toLowerCase()));
  if (contactMatch) {
    const company = ctx.companies.find((c) => c.id === contactMatch.companyId);
    const relatedDeals = ctx.deals.filter((d) => d.contactId === contactMatch.id);
    const dealSummary = relatedDeals.length
      ? relatedDeals.map((d) => `${d.title} — ${d.stage}`).join("; ")
      : "no linked deals";
    return `${contactMatch.name} (${contactMatch.title} at ${company?.name ?? "—"}). Deals: ${dealSummary}.`;
  }

  if (/hello|hi there|^hi$|hey/.test(q)) {
    return "Hi! I can help you check pipeline value, overdue tasks, payment status, or look up a contact/company by name. What would you like to know?";
  }

  if (/help|what can you do/.test(q)) {
    return "Try asking things like \"What's our total pipeline value?\", \"Show overdue tasks\", \"Which deals are on advance payment?\", or mention a contact/company name directly.";
  }

  return "I don't have a specific answer for that yet in this demo, but in the full product I'd pull that straight from your live CRM data. Try asking about pipeline value, overdue tasks, payment status, or a specific contact/company.";
}
