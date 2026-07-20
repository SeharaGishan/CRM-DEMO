"use client";

import { ActiveDealsTable } from "@/components/dashboard/ActiveDealsTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PendingTasksCard } from "@/components/dashboard/PendingTasksCard";
import { PerformancePanel } from "@/components/dashboard/PerformancePanel";
import { PeriodDropdown } from "@/components/dashboard/PeriodDropdown";
import { PipelineFunnelCard } from "@/components/dashboard/PipelineFunnelCard";
import { RevenueExpensesCard } from "@/components/dashboard/RevenueExpensesCard";
import { DealDetailModal } from "@/components/pipeline/DealDetailModal";
import { DealFormModal } from "@/components/pipeline/DealFormModal";
import { Button } from "@/components/ui/Button";
import { SkeletonCard, SkeletonStatCards } from "@/components/ui/Skeleton";
import { useAppData } from "@/context/AppDataContext";
import { useDelayedReady } from "@/lib/useDelayedReady";
import { Deal } from "@/lib/types";
import { DEALS_WON_TARGET, Period, isWithinPeriod, periodLabel } from "@/lib/period";
import { motion } from "framer-motion";
import { CheckCircle2, Percent, Plus, Send, Target, Users2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const { deals, tasks, contacts, receipts, allSales, toggleTask } = useAppData();
  const ready = useDelayedReady(500);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("This year");

  // Deals "created in" the selected period — the cohort every period-aware
  // metric below derives from. Current-state metrics (open deals, open
  // pipeline value, total contacts) intentionally stay unfiltered, since
  // "how much is open right now" isn't naturally scoped to when it was
  // created — only the "what happened" metrics respect the period filter.
  const periodDeals = useMemo(
    () => deals.filter((d) => isWithinPeriod(d.createdAt, period)),
    [deals, period]
  );
  const periodDealIds = useMemo(() => new Set(periodDeals.map((d) => d.id)), [periodDeals]);

  const stats = useMemo(() => {
    const open = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");
    const periodWon = periodDeals.filter((d) => d.stage === "Won");
    const periodLost = periodDeals.filter((d) => d.stage === "Lost");
    const proposalsSent = periodDeals.filter((d) =>
      ["Proposal", "Negotiation", "Won", "Lost"].includes(d.stage)
    ).length;
    const conversion =
      periodWon.length + periodLost.length > 0
        ? Math.round((periodWon.length / (periodWon.length + periodLost.length)) * 100)
        : 0;

    return {
      totalContacts: contacts.length,
      openDealsCount: open.length,
      openPipelineValue: open.reduce((s, d) => s + d.value, 0),
      proposalsSent,
      conversion,
      dealsWonCount: periodWon.length,
    };
  }, [deals, contacts, periodDeals]);

  const revenueCollected = useMemo(
    () => receipts.filter((r) => isWithinPeriod(r.date, period)).reduce((s, r) => s + r.amount, 0),
    [receipts, period]
  );
  const sales = useMemo(() => allSales(), [allSales]);
  const periodSales = useMemo(() => sales.filter((s) => periodDealIds.has(s.deal.id)), [sales, periodDealIds]);
  const fullyPaidCount = useMemo(() => periodSales.filter((s) => s.status === "Paid in Full").length, [periodSales]);

  const doneTasks = tasks.filter((t) => t.status === "done").length;

  const activeDeals = useMemo(
    () =>
      deals
        .filter((d) => d.stage !== "Won" && d.stage !== "Lost")
        .sort((a, b) => a.closeDate.localeCompare(b.closeDate))
        .slice(0, 6),
    [deals]
  );

  const pendingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status === "pending")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 5),
    [tasks]
  );

  const performanceItems = [
    { label: `Deals won ${periodLabel(period)}`, current: stats.dealsWonCount, target: DEALS_WON_TARGET[period] },
    { label: "Tasks completed", current: doneTasks, target: tasks.length },
    { label: "Payments fully collected", current: fullyPaidCount, target: periodSales.length },
  ];

  const metricCards = [
    { label: "Total Contacts", value: String(stats.totalContacts), icon: Users2, tone: "blue" as const, trend: { value: "+7.4%", positive: true } },
    { label: "Open Deals", value: String(stats.openDealsCount), icon: Target, tone: "violet" as const, trend: { value: "+2%", positive: true } },
    { label: "Proposals Sent", value: String(stats.proposalsSent), icon: Send, tone: "emerald" as const, trend: { value: "+3.6%", positive: true } },
    { label: "Conversion Rate", value: `${stats.conversion}%`, icon: Percent, tone: "amber" as const, trend: { value: "-3%", positive: false } },
    { label: "Deals Won", value: String(stats.dealsWonCount), icon: CheckCircle2, tone: "rose" as const, trend: { value: "-4.3%", positive: false } },
  ];

  const cardContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const cardItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!ready) {
    return (
      <div className="flex flex-col gap-5">
        <SkeletonStatCards count={5} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <SkeletonCard lines={6} className="xl:col-span-3" />
          <SkeletonCard lines={6} className="xl:col-span-2" />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <SkeletonCard lines={5} className="xl:col-span-3" />
          <SkeletonCard lines={5} className="xl:col-span-2" />
        </div>
        <SkeletonCard lines={5} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Overview of your sales pipeline and team performance.
        </p>
        <div className="flex items-center gap-2.5">
          <PeriodDropdown value={period} onChange={setPeriod} />
          <Button onClick={() => setAddDealOpen(true)}>
            <Plus className="h-4 w-4" /> New Deal
          </Button>
        </div>
      </div>

      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {metricCards.map((card) => (
          <motion.div key={card.label} variants={cardItemVariants}>
            <MetricCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* What needs attention right now — the most actionable content gets
          the top slot, right after the KPI strip. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18 }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-5"
      >
        <div className="xl:col-span-3">
          <ActiveDealsTable deals={activeDeals} onSelect={setSelectedDeal} />
        </div>
        <div className="xl:col-span-2">
          <PendingTasksCard tasks={pendingTasks} onToggle={toggleTask} />
        </div>
      </motion.div>

      {/* Financial summary and goal tracking — important, but reviewed less
          urgently than "what's due today". */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.24 }}
        className="grid grid-cols-1 gap-4 xl:grid-cols-5"
      >
        <div className="xl:col-span-3">
          <RevenueExpensesCard revenue={revenueCollected} pipelineValue={stats.openPipelineValue} />
        </div>
        <div className="xl:col-span-2">
          <PerformancePanel winRate={stats.conversion} items={performanceItems} />
        </div>
      </motion.div>

      {/* Pipeline shape — an analytical deep-dive, not a daily-glance item,
          so it sits last. */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
        <PipelineFunnelCard deals={periodDeals} />
      </motion.div>

      <p className="px-1 text-xs text-[var(--color-muted-foreground)]">
        {contacts.length} contacts tracked · demo data for presentation purposes only
      </p>

      <DealDetailModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      <DealFormModal open={addDealOpen} onClose={() => setAddDealOpen(false)} />
    </div>
  );
}
