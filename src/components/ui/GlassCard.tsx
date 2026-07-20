import clsx from "clsx";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export function GlassCard({ strong, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={clsx(strong ? "glass-panel-strong" : "glass-panel", "rounded-2xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}
