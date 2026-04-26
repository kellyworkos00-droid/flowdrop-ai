import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "focus-ring h-11 w-full appearance-none rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[15px] text-[var(--color-text-primary)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-smooth)] focus:border-[var(--color-brand-primary)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
    </div>
  );
}
