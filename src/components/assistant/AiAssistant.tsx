"use client";

import { useAppData } from "@/context/AppDataContext";
import { generateAssistantReply, suggestedPrompts } from "@/lib/aiAssistant";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

let idCounter = 0;

export function AiAssistant() {
  const appData = useAppData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: idCounter++, role: "assistant", text: "Hi, I'm the Sharkonix CRM Assistant. Ask me about your pipeline, tasks, payments, or any contact." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: idCounter++, role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const reply = generateAssistantReply(trimmed, appData);
      setMessages((prev) => [...prev, { id: idCounter++, role: "assistant", text: reply }]);
      setTyping(false);
    }, delay);
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/30 md:bottom-6 md:right-6"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-blue-500/40" style={{ animationDuration: "2.5s" }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="glass-panel-strong fixed inset-x-3 bottom-3 top-16 z-[89] flex flex-col overflow-hidden rounded-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:top-auto"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                <Bot className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--color-foreground)]">Sharkonix Assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="cursor-pointer rounded-full p-1.5 text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-blue-600 to-indigo-600 px-3.5 py-2.5 text-sm text-white"
                        : "surface-card max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-[var(--color-foreground)]"
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="surface-card flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="cursor-pointer rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about deals, tasks, payments..."
                className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-black/[0.03] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-white/[0.04]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
