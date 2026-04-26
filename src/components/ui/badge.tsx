import { cn } from "@/lib/utils";
import type { DropStatus } from "@/types/drop";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex rounded-[var(--radius-sm)] border border-white/12 px-2 py-1 text-[11px]", className)}>
      {children}
    </span>
  );
}

interface StatusPillProps {
  status: DropStatus;
  className?: string;
}

const statusStyles: Record<DropStatus, string> = {
  todo: "bg-white/8 text-[var(--color-text-secondary)] border-white/15",
  in_progress: "bg-[var(--color-brand-primary)]/18 text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/40",
  done: "bg-[var(--color-success)]/18 text-[var(--color-success)] border-[var(--color-success)]/40",
  blocked: "bg-[var(--color-danger)]/18 text-[var(--color-danger)] border-[var(--color-danger)]/40",
};

const labels: Record<DropStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  blocked: "Blocked",
};

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-1 text-[11px] font-medium",
        statusStyles[status],
        className,
      )}
    >
      {status === "in_progress" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden /> : null}
      {labels[status]}
    </span>
  );
}
