import { NextResponse } from "next/server";
import { getTelemetrySummary, listTelemetryEvents, recordTelemetryEvent } from "@/lib/telemetry/events";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitInput = url.searchParams.get("limit");
  const limit = limitInput ? Math.max(1, Math.min(300, Number.parseInt(limitInput, 10) || 100)) : 100;

  return NextResponse.json({
    summary: getTelemetrySummary(),
    events: listTelemetryEvents(limit),
  });
}

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as {
    name?: string;
    level?: "info" | "warn" | "error";
    route?: string;
    durationMs?: number;
    meta?: Record<string, string | number | boolean | null>;
  };

  if (!canPerform(actor.role, "telemetry:write")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: actor.workspaceId,
      action: "telemetry:write",
      resource: "telemetry-event",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { name: body.name ?? null },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.name || !body.level) {
    return NextResponse.json({ error: "name and level are required" }, { status: 400 });
  }

  const event = recordTelemetryEvent({
    name: body.name,
    level: body.level,
    route: body.route,
    durationMs: body.durationMs,
    meta: body.meta,
  });

  return NextResponse.json({ event }, { status: 201 });
}
