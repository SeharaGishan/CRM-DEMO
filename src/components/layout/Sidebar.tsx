"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, LayoutDashboard, Receipt, Users, KanbanSquare, CheckSquare, Warehouse, Zap, UserCog, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/stock", label: "Stock", icon: Warehouse },
  { href: "/sales", label: "Sales & Payments", icon: Receipt },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/employees", label: "Employees", icon: UserCog },
];

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const pathname = usePathname();

  const content = (
    <GlassCard strong className="flex h-full flex-col rounded-none border-0 border-r p-4 md:rounded-2xl md:border">
      <div className="mb-8 flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold leading-none text-[var(--color-foreground)]">Sharkonix CRM</p>
            <p className="text-[11px] font-medium text-[var(--color-muted-foreground)]">Demo Workspace</p>
          </div>
        </div>
        <button
          className="rounded-full p-1.5 text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10 md:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {nav.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/25"
                  : "text-[var(--color-muted-foreground)] hover:bg-black/5 hover:text-[var(--color-foreground)] dark:hover:bg-white/[0.06]"
              )}
            >
              <item.icon className={clsx("h-[18px] w-[18px] transition-transform duration-200", !active && "group-hover:scale-110")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-[var(--color-border)] bg-black/[0.02] p-3 text-xs text-[var(--color-muted-foreground)] dark:bg-white/[0.03]">
        Property of <span className="font-semibold text-[var(--color-foreground)]">Sharkonix Technologies</span>
        <br />
        Sales demo build — not for redistribution
      </div>
    </GlassCard>
  );

  return (
    <>
      <div className="hidden h-full w-64 shrink-0 p-3 md:block">{content}</div>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={onCloseMobile}
              aria-hidden
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="relative h-full w-72"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
