import { NextResponse } from "next/server";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as { name?: string; role?: string; company?: string };

  if (!canPerform(actor.role, "profile:update")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: actor.workspaceId,
      action: "profile:update",
      resource: "profile",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { name: body.name ?? null },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.name || !body.role || !body.company) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const response = {
    userId: crypto.randomUUID(),
    workspaceId: crypto.randomUUID(),
  };

  appendAuditEntry({
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
    workspaceId: response.workspaceId,
    action: "profile:update",
    resource: response.userId,
    outcome: "allowed",
    correlationId: actor.correlationId,
    oldValue: null,
    newValue: { name: body.name, role: body.role, company: body.company },
  });

  // TODO: replace with real API call
  return NextResponse.json(response);
}
