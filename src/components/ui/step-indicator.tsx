import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  total: number;
  current: number;
  className?: string;
}

export function StepIndicator({ total, current, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index === current;
        return (
          <span
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-[var(--duration-base)] ease-[var(--ease-smooth)]",
              active ? "w-6 bg-[var(--color-brand-primary)]" : "w-2 bg-[var(--color-surface-3)]",
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
