"use client";

import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppData } from "@/context/AppDataContext";
import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Briefcase, KanbanSquare, LogOut, Menu, Moon, Receipt as ReceiptIcon, RotateCcw, Search, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const mockNotifications = [
  { id: 1, text: "Payment link sent to Michael Da Silva is still pending", time: "2h ago" },
  { id: 2, text: "Follow-up task created for Orbit Telecom Enterprise CRM", time: "5h ago" },
  { id: 3, text: "Deal \"GreenField AgroTech Starter CRM\" marked Paid in Full", time: "1d ago" },
];

export function Topbar({ onOpenMobileNav, title }: { onOpenMobileNav: () => void; title: string }) {
  const { theme, toggleTheme } = useTheme();
  const { resetDemoData, contacts, deals, receipts } = useAppData();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      contacts: contacts.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 4),
      deals: deals.filter((d) => d.title.toLowerCase().includes(q)).slice(0, 4),
      receipts: receipts.filter((r) => r.receiptNumber.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [query, contacts, deals, receipts]);

  const hasResults =
    !!searchResults &&
    (searchResults.contacts.length > 0 || searchResults.deals.length > 0 || searchResults.receipts.length > 0);

  function goTo(path: string) {
    router.push(path);
    setQuery("");
  }

  return (
    <header className="glass-panel sticky top-0 z-30 mx-3 mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 md:mx-0">
      <button
        className="rounded-full p-2 text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="hidden text-lg font-bold text-[var(--color-foreground)] md:block">{title}</h1>

      <div className="relative flex max-w-sm flex-1 items-center md:ml-4">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--color-muted-foreground)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts, deals, receipts..."
          className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-black/[0.03] pl-9 pr-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
        />
        <AnimatePresence>
          {query.trim() && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setQuery("")} aria-hidden />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="glass-panel-strong absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto scrollbar-thin rounded-2xl p-2"
              >
                {!hasResults ? (
                  <p className="px-3 py-4 text-center text-sm text-[var(--color-muted-foreground)]">
                    No matches for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  <>
                    {searchResults!.contacts.length > 0 && (
                      <div className="mb-1">
                        <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                          Contacts
                        </p>
                        {searchResults!.contacts.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => goTo(`/contacts/${c.id}`)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <Briefcase className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
                            <span className="truncate">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults!.deals.length > 0 && (
                      <div className="mb-1">
                        <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                          Deals
                        </p>
                        {searchResults!.deals.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => goTo("/pipeline")}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <KanbanSquare className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
                            <span className="truncate">{d.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults!.receipts.length > 0 && (
                      <div>
                        <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                          Receipts
                        </p>
                        {searchResults!.receipts.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => goTo(`/receipt/${encodeURIComponent(r.receiptNumber)}`)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <ReceiptIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
                            <span className="truncate">{r.receiptNumber}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--color-muted-foreground)] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--color-muted-foreground)] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="glass-panel-strong absolute right-0 z-40 mt-2 w-72 rounded-2xl p-3"
              >
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                  Notifications
                </p>
                <div className="flex flex-col gap-1">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="rounded-xl px-2 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
                      <p className="text-[var(--color-foreground)]">{n.text}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-label="Profile menu"
            className="cursor-pointer rounded-full"
          >
            <Avatar name="Sharkonix Demo" colorPair="#2563EB,#7C3AED" size={38} />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="glass-panel-strong absolute right-0 z-40 mt-2 w-56 rounded-2xl p-2"
              >
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">Demo Presenter</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">presenter@sharkonix.lk</p>
                </div>
                <button
                  onClick={() => {
                    setResetConfirmOpen(true);
                    setProfileOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Demo Data
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Demo Data"
        description="Reset all demo data to its original state? This clears any changes made during this session."
        confirmLabel="Reset Data"
        danger
      />
    </header>
  );
}
