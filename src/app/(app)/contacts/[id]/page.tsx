"use client";

import { ComposeEmailModal } from "@/components/shared/ComposeEmailModal";
import { LogActivityModal } from "@/components/shared/LogActivityModal";
import { TaskFormModal } from "@/components/shared/TaskFormModal";
import { ContactFormModal } from "@/components/contacts/ContactFormModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppData } from "@/context/AppDataContext";
import { formatCurrency, formatDate, timeAgo } from "@/lib/format";
import {
  ArrowLeft,
  Building2,
  Mail,
  MessageSquarePlus,
  Pencil,
  Phone,
  PhoneCall,
  StickyNote,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const activityIcon = { call: PhoneCall, email: Mail, meeting: Users2, note: StickyNote };
const stageTone: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  New: "neutral",
  Contacted: "primary",
  Proposal: "primary",
  Negotiation: "warning",
  Won: "success",
  Lost: "danger",
};

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getContact, getCompany, getContactDeals, getContactActivities } = useAppData();
  const contact = getContact(params.id);

  const [logOpen, setLogOpen] = useState(false);
  const [logType, setLogType] = useState<"call" | "meeting" | "note">("call");
  const [emailOpen, setEmailOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!contact) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Contact not found.</p>
        <Button variant="secondary" onClick={() => router.push("/contacts")}>
          Back to Contacts
        </Button>
      </div>
    );
  }

  const company = getCompany(contact.companyId);
  const dealsForContact = getContactDeals(contact.id);
  const activityLog = getContactActivities(contact.id);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/contacts"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Contacts
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={contact.name} colorPair={contact.avatarColor} size={72} />
            <h1 className="mt-3 text-xl font-extrabold text-[var(--color-foreground)]">{contact.name}</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">{contact.title}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {contact.tags.map((t) => (
                <Badge key={t} tone="primary">
                  {t}
                </Badge>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit Contact
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-foreground)]">
              <Building2 className="h-4 w-4 text-[var(--color-muted-foreground)]" /> {company?.name ?? "—"}
            </div>
            <div className="flex items-center gap-2 text-[var(--color-foreground)]">
              <Mail className="h-4 w-4 text-[var(--color-muted-foreground)]" /> {contact.email}
            </div>
            <div className="flex items-center gap-2 text-[var(--color-foreground)]">
              <Phone className="h-4 w-4 text-[var(--color-muted-foreground)]" /> {contact.phone}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setLogType("call");
                setLogOpen(true);
              }}
            >
              <PhoneCall className="h-3.5 w-3.5" /> Log Call
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setLogType("meeting");
                setLogOpen(true);
              }}
            >
              <Users2 className="h-3.5 w-3.5" /> Log Meeting
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEmailOpen(true)}>
              <Mail className="h-3.5 w-3.5" /> Email
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setTaskOpen(true)}>
              <MessageSquarePlus className="h-3.5 w-3.5" /> Add Task
            </Button>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <GlassCard className="p-5">
            <h2 className="mb-3 text-base font-bold text-[var(--color-foreground)]">Linked Deals</h2>
            {dealsForContact.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No deals linked to this contact yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-[var(--color-border)]">
                {dealsForContact.map((d) => (
                  <Link
                    key={d.id}
                    href="/pipeline"
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">{d.title}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Closes {formatDate(d.closeDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-foreground)]">
                        {formatCurrency(d.value)}
                      </span>
                      <Badge tone={stageTone[d.stage]}>{d.stage}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="mb-3 text-base font-bold text-[var(--color-foreground)]">Activity Timeline</h2>
            {activityLog.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No activity logged yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {activityLog.map((a) => {
                  const Icon = activityIcon[a.type];
                  return (
                    <div key={a.id} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[var(--color-foreground)]">{a.title}</p>
                          <span className="shrink-0 text-xs text-[var(--color-muted-foreground)]">
                            {timeAgo(a.timestamp)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">{a.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <LogActivityModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        contactId={contact.id}
        initialType={logType}
      />
      <ComposeEmailModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        contactId={contact.id}
        contactEmail={contact.email}
      />
      <TaskFormModal open={taskOpen} onClose={() => setTaskOpen(false)} contactId={contact.id} />
      <ContactFormModal open={editOpen} onClose={() => setEditOpen(false)} existing={contact} />
    </div>
  );
}
