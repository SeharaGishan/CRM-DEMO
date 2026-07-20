"use client";

import { revenueTrend } from "@/data/trend";
import { formatCurrency } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RevenueBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          tickFormatter={(v) => `$${v / 1000}k`}
          width={44}
        />
        <Tooltip
          cursor={{ fill: "var(--color-border)", opacity: 0.4 }}
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
        <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={36}>
          {revenueTrend.map((d, i) => {
            const prev = revenueTrend[i - 1];
            const grew = prev ? d.revenue > prev.revenue : false;
            return <Cell key={d.month} fill={grew ? "#22c55e" : "#3b82f6"} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
