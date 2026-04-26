export type DropType = "task" | "idea" | "file" | "link" | "blocker" | "note";

export type DropStatus = "todo" | "in_progress" | "done" | "blocked";

export type DropPriority = "low" | "normal" | "high" | "urgent";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface SnoozedUntil {
  until: string; // ISO date string
  reason?: string;
}

export interface DropItem {
  id: string;
  title: string;
  description?: string;
  type: DropType;
  status: DropStatus;
  priority: DropPriority;
  assignees: string[];
  assigneeNames: string[];
  watcherIds?: string[];
  watcherNames?: string[];
  timestamp: string;
  createdAt?: string;  // ISO date string
  updatedAt?: string;  // ISO date string
  dueDate?: string;    // ISO date YYYY-MM-DD
  blockedSince?: string; // ISO date string — when the item became blocked
  snoozedUntil?: SnoozedUntil;
  subtasks?: { id: string; label: string; done: boolean }[];
  attachments?: { id: string; name: string; url: string }[];
  activity?: ActivityItem[];
}
