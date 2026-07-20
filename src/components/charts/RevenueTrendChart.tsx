"use client";

import { revenueTrend } from "@/data/trend";
import { formatCurrency } from "@/lib/format";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={revenueTrend} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          padding={{ left: 8, right: 8 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          tickFormatter={(v) => `$${v / 1000}k`}
          width={48}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
          contentStyle={{
            background: "var(--color-surface-strong)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            backdropFilter: "blur(12px)",
            fontSize: 13,
          }}
          labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="url(#revenueStroke)"
          strokeWidth={2.75}
          fill="url(#revenueFill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--color-background)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
