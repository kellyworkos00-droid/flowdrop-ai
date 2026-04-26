import type { PermissionAction } from "@/lib/auth/permissions";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: string;
  workspaceId: string;
  action: PermissionAction | string;
  resource: string;
  outcome: "allowed" | "denied";
  reason?: string;
  correlationId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
}

const entries: AuditEntry[] = [];

export function appendAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">): AuditEntry {
  const next: AuditEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  entries.unshift(next);
  if (entries.length > 2000) {
    entries.length = 2000;
  }

  return next;
}

export function listAuditEntries(filters?: {
  action?: string;
  actorId?: string;
  outcome?: "allowed" | "denied";
  workspaceId?: string;
  limit?: number;
}): AuditEntry[] {
  const limit = filters?.limit ?? 200;
  return entries
    .filter((item) => {
      if (filters?.action && item.action !== filters.action) return false;
      if (filters?.actorId && item.actorId !== filters.actorId) return false;
      if (filters?.outcome && item.outcome !== filters.outcome) return false;
      if (filters?.workspaceId && item.workspaceId !== filters.workspaceId) return false;
      return true;
    })
    .slice(0, limit);
}

export function toCsv(items: AuditEntry[]): string {
  const header = [
    "id",
    "timestamp",
    "actorId",
    "actorName",
    "role",
    "workspaceId",
    "action",
    "resource",
    "outcome",
    "reason",
    "correlationId",
  ];

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const rows = items.map((item) =>
    [
      item.id,
      item.timestamp,
      item.actorId,
      item.actorName,
      item.role,
      item.workspaceId,
      item.action,
      item.resource,
      item.outcome,
      item.reason ?? "",
      item.correlationId,
    ]
      .map((value) => escape(String(value)))
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}
