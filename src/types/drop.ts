export type DropType = "task" | "idea" | "file" | "link" | "blocker" | "note";

export type DropStatus = "todo" | "in_progress" | "done" | "blocked";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface DropItem {
  id: string;
  title: string;
  description?: string;
  type: DropType;
  status: DropStatus;
  assignees: string[];
  assigneeNames: string[];
  timestamp: string;
  dueDate?: string;
  subtasks?: { id: string; label: string; done: boolean }[];
  attachments?: { id: string; name: string; url: string }[];
  activity?: ActivityItem[];
}
