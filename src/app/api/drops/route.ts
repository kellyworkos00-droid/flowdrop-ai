import { NextResponse } from "next/server";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as { content?: string; type?: string; workspaceId?: string };

  if (!canPerform(actor.role, "drop:create")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: body.workspaceId ?? actor.workspaceId,
      action: "drop:create",
      resource: "drop",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { type: body.type ?? null },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.workspaceId || !body.content || !body.type) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const response = {
    dropId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  appendAuditEntry({
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
    workspaceId: body.workspaceId,
    action: "drop:create",
    resource: response.dropId,
    outcome: "allowed",
    correlationId: actor.correlationId,
    oldValue: null,
    newValue: {
      type: body.type,
      content: body.content,
    },
  });

  // TODO: replace with real API call
  return NextResponse.json(response);
}
