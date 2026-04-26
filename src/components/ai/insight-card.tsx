import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  description: string;
  className?: string;
}

export function InsightCard({ title, description, className }: InsightCardProps) {
  return (
    <article className={cn("flow-card rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4", className)}>
      <h3 className="mb-2 text-[15px] font-medium">{title}</h3>
      <p className="text-[13px] text-[var(--color-text-secondary)]">{description}</p>
      <div className="mt-3 h-24 rounded-[var(--radius-md)] bg-[var(--color-surface-2)]" aria-hidden />
    </article>
  );
}
