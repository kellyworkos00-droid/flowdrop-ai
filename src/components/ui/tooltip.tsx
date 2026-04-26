"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  const show = () => {
    timerRef.current = window.setTimeout(() => setVisible(true), 200);
  };

  const hide = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  return (
    <span className={cn("relative inline-flex", className)} onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible ? (
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-[var(--radius-sm)] border border-white/12 bg-[var(--color-surface-2)] px-2 py-1 text-[11px] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          {content}
        </span>
      ) : null}
    </span>
  );
}
