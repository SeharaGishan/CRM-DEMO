"use client";

import { PipelineFunnelBreakdown } from "@/components/dashboard/PipelineFunnelBreakdown";
import { Deal } from "@/lib/types";
import Link from "next/link";

export function PipelineFunnelCard({ deals }: { deals: Deal[] }) {
  return (
    <div className="surface-card card-hover-lift rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-foreground)]">Pipeline Funnel</h2>
        <Link href="/pipeline" className="text-xs font-semibold text-blue-500 hover:underline">
          View board →
        </Link>
      </div>
      <PipelineFunnelBreakdown deals={deals} />
    </div>
  );
}
