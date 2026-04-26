import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  description: string;
  value?: string;
  trend?: string;
  tone?: "positive" | "neutral" | "warning";
  icon?: ReactNode;
  tag?: string;
  className?: string;
}

const toneStyles: Record<NonNullable<InsightCardProps["tone"]>, string> = {
  positive: "border-[rgba(0,196,140,0.3)]",
  neutral: "border-white/10",
  warning: "border-[rgba(255,77,109,0.35)]",
};

export function InsightCard({
  title,
  description,
  value,
  trend,
  tone = "neutral",
  icon,
  tag,
  className,
}: InsightCardProps) {
  return (
    <article
      className={cn(
        "flow-card rounded-[var(--radius-lg)] border bg-[var(--color-surface-1)] p-4",
        toneStyles[tone],
        className,
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="inline-flex items-center gap-2">
          {icon ? <span className="text-[var(--color-brand-accent)]">{icon}</span> : null}
          <h3 className="text-[15px] font-medium">{title}</h3>
        </div>
        {tag ? <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] text-[var(--color-text-tertiary)]">{tag}</span> : null}
      </div>

      <p className="text-[13px] text-[var(--color-text-secondary)]">{description}</p>

      <div className="mt-3 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
        <p className="text-[22px] font-semibold text-[var(--color-text-primary)]">{value ?? "Signal ready"}</p>
        <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{trend ?? "Monitoring team flow patterns"}</p>
      </div>
    </article>
  );
}
