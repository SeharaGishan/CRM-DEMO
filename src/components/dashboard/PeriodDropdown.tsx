"use client";

import { Period, PERIODS } from "@/lib/period";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function PeriodDropdown({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="glass-panel flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      >
        {value}
        <ChevronDown className={`h-3.5 w-3.5 text-[var(--color-muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="glass-panel-strong absolute right-0 z-40 mt-2 w-40 rounded-xl p-1.5"
            >
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onChange(p);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    p === value
                      ? "bg-blue-600 text-white"
                      : "text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
