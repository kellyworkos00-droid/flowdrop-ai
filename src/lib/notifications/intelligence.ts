import type { DropItem } from "@/types/drop";

export type NotificationMode = "instant" | "digest" | "muted";

export interface NotificationPreference {
  blockers: NotificationMode;
  mentions: NotificationMode;
  dueRisk: NotificationMode;
}

export interface PrioritySignal {
  id: string;
  title: string;
  reason: string;
  priority: "high" | "normal";
  dropId?: string;
}

export interface DigestSummary {
  label: string;
  items: string[];
}

function isDueRisk(drop: DropItem): boolean {
  if (!drop.dueDate || drop.status === "done") {
    return false;
  }
  const now = new Date();
  const due = new Date(drop.dueDate);
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours <= 24;
}

export function buildNotificationIntelligence(drops: DropItem[], currentUserName: string): {
  highPriority: PrioritySignal[];
  morningDigest: DigestSummary;
  endOfDayDigest: DigestSummary;
} {
  const highPriority: PrioritySignal[] = [];

  drops.forEach((drop) => {
    if (drop.status === "blocked") {
      highPriority.push({
        id: `blocked_${drop.id}`,
        title: drop.title,
        reason: "Blocked item needs escalation",
        priority: "high",
        dropId: drop.id,
      });
      return;
    }

    const mention = drop.watcherNames?.some((name) => name.toLowerCase() === currentUserName.toLowerCase());
    if (mention) {
      highPriority.push({
        id: `mention_${drop.id}`,
        title: drop.title,
        reason: "You are watching this item",
        priority: "high",
        dropId: drop.id,
      });
      return;
    }

    if (isDueRisk(drop)) {
      highPriority.push({
        id: `due_${drop.id}`,
        title: drop.title,
        reason: "Due in under 24 hours",
        priority: "high",
        dropId: drop.id,
      });
    }
  });

  const todoCount = drops.filter((d) => d.status === "todo").length;
  const inProgressCount = drops.filter((d) => d.status === "in_progress").length;
  const doneCount = drops.filter((d) => d.status === "done").length;
  const blockedCount = drops.filter((d) => d.status === "blocked").length;

  const morningDigest: DigestSummary = {
    label: "Morning Summary",
    items: [
      `${todoCount} items queued for today`,
      `${inProgressCount} currently in progress`,
      `${blockedCount} blockers requiring fast follow-up`,
    ],
  };

  const endOfDayDigest: DigestSummary = {
    label: "End-of-Day Summary",
    items: [
      `${doneCount} completed today`,
      `${inProgressCount} still active`,
      `${blockedCount} unresolved blockers`,
    ],
  };

  return { highPriority, morningDigest, endOfDayDigest };
}
