import { NextResponse } from "next/server";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as { teamType?: string; workspaceId?: string };

  if (!canPerform(actor.role, "workspace:update")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: body.workspaceId ?? actor.workspaceId,
      action: "workspace:update",
      resource: "workspace",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { teamType: body.teamType ?? null },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.workspaceId || !body.teamType) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  appendAuditEntry({
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
    workspaceId: body.workspaceId,
    action: "workspace:update",
    resource: body.workspaceId,
    outcome: "allowed",
    correlationId: actor.correlationId,
    oldValue: null,
    newValue: { teamType: body.teamType },
  });

  // TODO: replace with real API call
  return NextResponse.json({ success: true });
}
