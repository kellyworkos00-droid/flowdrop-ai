"use client";

import { cn } from "@/lib/utils";

interface TeamFocusGridProps {
  selected: string[];
  onToggle: (value: string) => void;
  className?: string;
}

const options = [
  "🛠 Product & Engineering",
  "🎨 Design & Creative",
  "📣 Marketing & Growth",
  "🤝 Client Services",
  "🚀 Startup / All-in-one",
  "✨ Something else",
];

export function TeamFocusGrid({ selected, onToggle, className }: TeamFocusGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={cn(
              "focus-ring flow-card rounded-[var(--radius-lg)] border bg-[var(--color-surface-1)] p-5 text-center text-[13px]",
              active
                ? "border-[var(--color-brand-primary)] bg-[rgba(45,107,228,0.12)] shadow-[var(--shadow-glow-blue)]"
                : "border-white/10 text-[var(--color-text-secondary)]",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
