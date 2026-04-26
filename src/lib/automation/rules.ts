import type { DropItem, DropPriority } from "@/types/drop";

// ─── Helpers ────────────────────────────────────────────────────────────────

function hoursAgo(isoString: string): number {
  const then = new Date(isoString).getTime();
  const now = Date.now();
  return (now - then) / 1_000 / 60 / 60;
}

function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  return (due - now) / 1_000 / 60 / 60 / 24;
}

// ─── Rule Evaluation ────────────────────────────────────────────────────────

export interface AutomationSignal {
  dropId: string;
  rule: string;
  label: string;
  severity: "info" | "warning" | "critical";
  suggestion?: string;
}

/**
 * Evaluate all automation rules against the current drop list.
 * Returns an array of signals that the UI can display and act on.
 */
export function evaluateRules(drops: DropItem[]): AutomationSignal[] {
  const signals: AutomationSignal[] = [];

  for (const drop of drops) {
    if (drop.status === "done") {
      continue;
    }

    // Rule 1: Blocked > 24h → escalate
    if (drop.status === "blocked" && drop.blockedSince) {
      const hours = hoursAgo(drop.blockedSince);
      if (hours >= 24) {
        signals.push({
          dropId: drop.id,
          rule: "blocked_24h",
          label: `"${drop.title}" has been blocked for ${Math.round(hours)}h`,
          severity: "critical",
          suggestion: "Escalate to team lead or reassign to unblock.",
        });
      } else if (hours >= 4) {
        signals.push({
          dropId: drop.id,
          rule: "blocked_4h",
          label: `"${drop.title}" has been blocked for ${Math.round(hours)}h`,
          severity: "warning",
          suggestion: "Review the blocker and assign an owner to resolve it.",
        });
      }
    }

    // Rule 2: Due date is near → bump priority
    if (drop.dueDate) {
      const days = daysUntilDue(drop.dueDate);
      if (days < 0) {
        signals.push({
          dropId: drop.id,
          rule: "overdue",
          label: `"${drop.title}" is overdue by ${Math.round(Math.abs(days))} day${Math.abs(days) >= 2 ? "s" : ""}`,
          severity: "critical",
          suggestion: "Mark complete, reschedule, or reassign immediately.",
        });
      } else if (days <= 1 && drop.priority !== "urgent" && drop.priority !== "high") {
        signals.push({
          dropId: drop.id,
          rule: "due_soon",
          label: `"${drop.title}" is due within 24 hours`,
          severity: "warning",
          suggestion: "Bump priority and notify the assignee.",
        });
      }
    }

    // Rule 3: High-priority item sitting in todo without progress
    if (drop.priority === "urgent" && drop.status === "todo" && drop.createdAt) {
      const hours = hoursAgo(drop.createdAt);
      if (hours >= 8) {
        signals.push({
          dropId: drop.id,
          rule: "urgent_stalled",
          label: `Urgent item "${drop.title}" has not started after ${Math.round(hours)}h`,
          severity: "warning",
          suggestion: "Start work or reassign to an available team member.",
        });
      }
    }
  }

  return signals;
}

// ─── Priority Scoring ────────────────────────────────────────────────────────

const PRIORITY_RANK: Record<DropPriority, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

/**
 * Score a drop for Today ranking.
 * Higher score = more important to show first.
 */
export function scoreDropForToday(drop: DropItem, myName: string): number {
  let score = 0;

  // Own items rank higher
  const isMyDrop = drop.assigneeNames.some((n) => n.toLowerCase() === myName.toLowerCase());
  if (isMyDrop) {
    score += 20;
  }

  // Watching items rank higher than nothing
  const isWatcher = drop.watcherNames?.some((n) => n.toLowerCase() === myName.toLowerCase());
  if (isWatcher && !isMyDrop) {
    score += 5;
  }

  // Priority bump
  score += PRIORITY_RANK[drop.priority] * 6;

  // Status bump: blocked items are urgent to resolve
  if (drop.status === "blocked") {
    score += 15;
  } else if (drop.status === "in_progress") {
    score += 8;
  }

  // Due date urgency
  if (drop.dueDate) {
    const days = daysUntilDue(drop.dueDate);
    if (days < 0) {
      score += 25; // overdue
    } else if (days <= 1) {
      score += 18;
    } else if (days <= 3) {
      score += 10;
    }
  }

  return score;
}

/**
 * Build a ranked "Top N" list for Today's command center.
 */
export function rankDropsForToday(drops: DropItem[], myName: string, limit = 5): DropItem[] {
  return drops
    .filter((d) => d.status !== "done")
    .map((d) => ({ drop: d, score: scoreDropForToday(d, myName) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.drop);
}
