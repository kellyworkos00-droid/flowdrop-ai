"use client";

import * as React from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  kind?: "text" | "email" | "password" | "search";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, kind = "text", type, ...props },
  ref,
) {
  const [isVisible, setIsVisible] = React.useState(false);
  const resolvedType = kind === "password" ? (isVisible ? "text" : "password") : (type ?? kind);

  return (
    <div className="relative w-full">
      {kind === "search" ? (
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
      ) : null}
      <input
        ref={ref}
        type={resolvedType}
        className={cn(
          "focus-ring h-11 w-full rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-smooth)] focus:border-[var(--color-brand-primary)]",
          kind === "search" ? "pl-9" : "",
          kind === "password" ? "pr-10" : "",
          className,
        )}
        {...props}
      />
      {kind === "password" ? (
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );
});
