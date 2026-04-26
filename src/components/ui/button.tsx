"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-brand-primary)] text-white border border-transparent",
  secondary: "bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-white/10",
  ghost: "bg-transparent text-[var(--color-text-secondary)] border border-transparent hover:text-[var(--color-text-primary)]",
  danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)] border border-[var(--color-danger)]/40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-4 text-[15px]",
  lg: "h-12 px-5 text-[15px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "focus-ring flow-interactive inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
