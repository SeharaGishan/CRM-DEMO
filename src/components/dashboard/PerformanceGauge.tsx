"use client";

import { useEffect, useState } from "react";

export function PerformanceGauge({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplay(clamped), 150);
    return () => clearTimeout(t);
  }, [clamped]);

  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative mx-auto h-[100px] w-[180px]">
      <svg width={180} height={100} viewBox="0 0 180 100" className="overflow-visible">
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke="url(#performanceGaugeGradient)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <defs>
          <linearGradient id="performanceGaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-2xl font-extrabold leading-none text-[var(--color-foreground)]">{clamped}%</span>
        <span className="mt-1 text-xs font-semibold text-[var(--color-muted-foreground)]">{label}</span>
      </div>
    </div>
  );
}
