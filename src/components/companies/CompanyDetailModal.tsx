"use client";

import { CompanyFormModal } from "@/components/companies/CompanyFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency } from "@/lib/format";
import { DealStage } from "@/lib/types";
import { Building2, Globe, Pencil, Users2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const stageTone: Record<DealStage, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  New: "neutral",
  Contacted: "primary",
  Proposal: "warning",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
};

export function CompanyDetailModal({ companyId, onClose }: { companyId: string | null; onClose: () => void }) {
  const { companies, contacts, deals } = useAppData();
  const [editOpen, setEditOpen] = useState(false);
  const company = companyId ? companies.find((c) => c.id === companyId) ?? null : null;

  const companyContacts = useMemo(
    () => (company ? contacts.filter((c) => c.companyId === company.id) : []),
    [contacts, company]
  );
  const companyDeals = useMemo(() => {
    if (!company) return [];
    const contactIds = new Set(companyContacts.map((c) => c.id));
    return deals.filter((d) => contactIds.has(d.contactId));
  }, [deals, company, companyContacts]);
  const openPipelineValue = useMemo(
    () => companyDeals.filter((d) => d.stage !== "Won" && d.stage !== "Lost").reduce((s, d) => s + d.value, 0),
    [companyDeals]
  );

  if (!company) return null;

  return (
    <>
      <Modal open onClose={onClose} title="Company Profile" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={company.name} colorPair={company.avatarColor} size={56} />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-extrabold text-[var(--color-foreground)]">{company.name}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{company.industry}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge tone="primary">{company.size} employees</Badge>
              </div>
            </div>
          </div>

          <div className="glass-panel grid grid-cols-1 gap-3 rounded-xl p-4 sm:grid-cols-2">
            <a
              href={`https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:underline"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">{company.website}</span>
            </a>
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
              <Users2 className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <span>
                {companyContacts.length} contact{companyContacts.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)] sm:col-span-2">
              <Building2 className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
              <span>Open pipeline value: {formatCurrency(openPipelineValue)}</span>
            </div>
          </div>

          <Button size="sm" variant="secondary" className="w-full" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit Company
          </Button>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Contacts
              </p>
              <Badge tone="neutral">{companyContacts.length}</Badge>
            </div>
            {companyContacts.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No contacts at this company yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {companyContacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <Avatar name={c.name} colorPair={c.avatarColor} size={30} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{c.name}</p>
                      <p className="truncate text-xs text-[var(--color-muted-foreground)]">{c.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Deals
              </p>
              <Badge tone="neutral">{companyDeals.length}</Badge>
            </div>
            {companyDeals.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No deals linked to this company yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {companyDeals.map((d) => (
                  <Link
                    key={d.id}
                    href="/pipeline"
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-foreground)]">{d.title}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-foreground)]">{formatCurrency(d.value)}</span>
                      <Badge tone={stageTone[d.stage]}>{d.stage}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <CompanyFormModal open={editOpen} onClose={() => setEditOpen(false)} existing={company} />
    </>
  );
}
