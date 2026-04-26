export type AppRole = "owner" | "manager" | "member" | "viewer";

export type PermissionAction =
  | "profile:update"
  | "workspace:update"
  | "invite:create"
  | "drop:create"
  | "insight:refresh"
  | "telemetry:write";

const PERMISSIONS: Record<AppRole, Set<PermissionAction>> = {
  owner: new Set([
    "profile:update",
    "workspace:update",
    "invite:create",
    "drop:create",
    "insight:refresh",
    "telemetry:write",
  ]),
  manager: new Set([
    "profile:update",
    "workspace:update",
    "invite:create",
    "drop:create",
    "insight:refresh",
    "telemetry:write",
  ]),
  member: new Set([
    "profile:update",
    "drop:create",
    "insight:refresh",
    "telemetry:write",
  ]),
  viewer: new Set(["telemetry:write"]),
};

export function normalizeRole(input: string | null | undefined): AppRole {
  if (!input) {
    return "member";
  }
  const value = input.toLowerCase();
  if (value === "owner" || value === "manager" || value === "member" || value === "viewer") {
    return value;
  }
  return "member";
}

export function canPerform(role: AppRole, action: PermissionAction): boolean {
  return PERMISSIONS[role].has(action);
}

export interface ActorContext {
  actorId: string;
  actorName: string;
  role: AppRole;
  workspaceId: string;
  correlationId: string;
}

export function getActorContext(request: Request): ActorContext {
  const headers = request.headers;
  return {
    actorId: headers.get("x-actor-id") ?? "anonymous",
    actorName: headers.get("x-actor-name") ?? "Unknown User",
    role: normalizeRole(headers.get("x-user-role")),
    workspaceId: headers.get("x-workspace-id") ?? "workspace-default",
    correlationId: headers.get("x-correlation-id") ?? crypto.randomUUID(),
  };
}
