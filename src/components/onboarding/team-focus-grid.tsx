"use client";

import { Handshake, Hammer, Megaphone, Palette, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamFocusGridProps {
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
}

const options: { label: string; icon: LucideIcon }[] = [
  { label: "Product & Engineering", icon: Hammer },
  { label: "Design & Creative", icon: Palette },
  { label: "Marketing & Growth", icon: Megaphone },
  { label: "Client Services", icon: Handshake },
  { label: "Startup / All-in-one", icon: Rocket },
  { label: "Something else", icon: Sparkles },
];

export function TeamFocusGrid({ selected, onToggle, className }: TeamFocusGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = selected.includes(option.label);
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onToggle(option.label)}
            className={cn(
              "focus-ring flow-card rounded-[var(--radius-lg)] border bg-[var(--color-surface-1)] p-5 text-center text-[13px]",
              active
                ? "border-[var(--color-brand-primary)] bg-[rgba(45,107,228,0.12)] shadow-[var(--shadow-glow-blue)]"
                : "border-white/10 text-[var(--color-text-secondary)]",
            )}
          >
            <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-surface-2)] text-[var(--color-brand-primary)]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="block">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
