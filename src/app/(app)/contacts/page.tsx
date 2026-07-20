"use client";

import { ContactFormModal } from "@/components/contacts/ContactFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { formatDate } from "@/lib/format";
import { motion } from "framer-motion";
import { Plus, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function ContactsPage() {
  const { contacts, companies, getContactActivities } = useAppData();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const ready = useDelayedReady(400);

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        companyName(c.companyId).toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, query, companies]);

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton h-11 w-full rounded-xl" />
        <SkeletonRows count={7} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, or tag..."
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] pl-10 pr-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-4 border-b border-[var(--color-border)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
          <span>Contact</span>
          <span>Company</span>
          <span>Tags</span>
          <span>Last Activity</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map((c, i) => {
            const lastActivity = getContactActivities(c.id)[0];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.03 }}
              >
                <Link
                  href={`/contacts/${c.id}`}
                  className="grid grid-cols-1 gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} colorPair={c.avatarColor} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{c.name}</p>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">{c.title}</p>
                    </div>
                  </div>
                  <p className="truncate text-sm text-[var(--color-muted-foreground)]">{companyName(c.companyId)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <Badge key={t} tone={t === "Decision Maker" || t === "VIP" ? "primary" : "neutral"}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {lastActivity ? formatDate(lastActivity.timestamp) : "No activity yet"}
                  </p>
                </Link>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <UserRound className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">No contacts match your search</p>
            </div>
          )}
        </div>
      </GlassCard>

      <ContactFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
