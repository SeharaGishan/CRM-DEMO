import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} aria-hidden />;
}

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel rounded-2xl p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-7 w-28" />
          <Skeleton className="mt-3 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx("glass-panel rounded-2xl p-5", className)}>
      <Skeleton className="mb-4 h-4 w-40" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
