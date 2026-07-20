"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setActive(true);
    const t = setTimeout(() => setActive(false), 650);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  return (
    <div className="fixed left-0 top-0 z-[200] h-[3px] w-full bg-transparent">
      <div className="route-progress-bar h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-400" />
    </div>
  );
}
