"use client";

import { AiAssistant } from "@/components/assistant/AiAssistant";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { PageTransition } from "@/components/layout/PageTransition";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";
import { useState } from "react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contacts": "Contacts",
  "/companies": "Companies",
  "/pipeline": "Pipeline",
  "/stock": "Stock",
  "/sales": "Sales & Payments",
  "/tasks": "Tasks",
  "/employees": "Employees",
};

function titleFor(pathname: string) {
  const match = Object.keys(titles).find((k) => pathname.startsWith(k));
  return match ? titles[match] : "Sharkonix CRM";
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="mx-auto flex h-screen max-w-[1600px]">
      <NavigationProgress />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden pt-3 pr-3">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} title={titleFor(pathname ?? "")} />
        <main className="flex-1 overflow-y-auto scrollbar-thin pb-24 pl-3 pr-0 md:pb-6 md:pl-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <AiAssistant />
    </div>
  );
}
