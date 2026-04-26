import { NextResponse } from "next/server";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as { emails?: string[]; workspaceId?: string };

  if (!canPerform(actor.role, "invite:create")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: body.workspaceId ?? actor.workspaceId,
      action: "invite:create",
      resource: "workspace-members",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { emailCount: body.emails?.length ?? 0 },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.workspaceId || !Array.isArray(body.emails)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  appendAuditEntry({
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
    workspaceId: body.workspaceId,
    action: "invite:create",
    resource: "workspace-members",
    outcome: "allowed",
    correlationId: actor.correlationId,
    oldValue: null,
    newValue: { emails: body.emails },
  });

  // TODO: replace with real API call
  return NextResponse.json({ sent: body.emails.length });
}
