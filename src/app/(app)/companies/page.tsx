"use client";

import { CompanyDetailModal } from "@/components/companies/CompanyDetailModal";
import { CompanyFormModal } from "@/components/companies/CompanyFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { formatCurrency } from "@/lib/format";
import { motion } from "framer-motion";
import { Building2, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function CompaniesPage() {
  const { companies, contacts, deals } = useAppData();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ready = useDelayedReady(400);

  const stats = useMemo(() => {
    const map = new Map<string, { contacts: number; pipelineValue: number }>();
    for (const co of companies) {
      const companyContacts = contacts.filter((c) => c.companyId === co.id);
      const contactIds = new Set(companyContacts.map((c) => c.id));
      const pipelineValue = deals
        .filter((d) => contactIds.has(d.contactId) && d.stage !== "Won" && d.stage !== "Lost")
        .reduce((s, d) => s + d.value, 0);
      map.set(co.id, { contacts: companyContacts.length, pipelineValue });
    }
    return map;
  }, [companies, contacts, deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.website.toLowerCase().includes(q)
    );
  }, [companies, query]);

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
            placeholder="Search by name, industry, or website..."
            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] pl-10 pr-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Company
        </Button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="hidden grid-cols-[1.3fr_1fr_0.8fr_1fr_1fr] gap-4 border-b border-[var(--color-border)] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] md:grid">
          <span>Company</span>
          <span>Industry</span>
          <span>Size</span>
          <span>Contacts</span>
          <span>Open Pipeline</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map((c, i) => {
            const stat = stats.get(c.id) ?? { contacts: 0, pipelineValue: 0 };
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i, 8) * 0.03 }}
              >
                <button
                  onClick={() => setSelectedId(c.id)}
                  className="grid w-full grid-cols-1 gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:grid-cols-[1.3fr_1fr_0.8fr_1fr_1fr] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} colorPair={c.avatarColor} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{c.name}</p>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">{c.website}</p>
                    </div>
                  </div>
                  <p className="truncate text-sm text-[var(--color-muted-foreground)]">{c.industry}</p>
                  <div>
                    <Badge tone="neutral">{c.size}</Badge>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {stat.contacts} contact{stat.contacts === 1 ? "" : "s"}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {formatCurrency(stat.pipelineValue)}
                  </p>
                </button>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Building2 className="h-8 w-8 text-[var(--color-muted-foreground)]" />
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">No companies match your search</p>
            </div>
          )}
        </div>
      </GlassCard>

      <CompanyFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      <CompanyDetailModal companyId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
