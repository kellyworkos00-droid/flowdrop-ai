import { NextResponse } from "next/server";
import { enqueueInsightJob, getLatestInsightSnapshot, listInsightJobs } from "@/lib/ai/insight-jobs";
import { appendAuditEntry } from "@/lib/audit/log";
import { canPerform, getActorContext } from "@/lib/auth/permissions";

export async function GET() {
  return NextResponse.json({
    latestSnapshot: getLatestInsightSnapshot(),
    jobs: listInsightJobs().slice(0, 15),
  });
}

export async function POST(request: Request) {
  const actor = getActorContext(request);
  const body = (await request.json()) as { workspaceId?: string; window?: "7d" | "14d" | "30d" };

  if (!canPerform(actor.role, "insight:refresh")) {
    appendAuditEntry({
      actorId: actor.actorId,
      actorName: actor.actorName,
      role: actor.role,
      workspaceId: body.workspaceId ?? actor.workspaceId,
      action: "insight:refresh",
      resource: "insight-job",
      outcome: "denied",
      reason: "Insufficient role permissions",
      correlationId: actor.correlationId,
      oldValue: null,
      newValue: { window: body.window ?? "14d" },
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!body.workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  const window = body.window ?? "14d";
  const job = enqueueInsightJob(body.workspaceId, window);

  appendAuditEntry({
    actorId: actor.actorId,
    actorName: actor.actorName,
    role: actor.role,
    workspaceId: body.workspaceId,
    action: "insight:refresh",
    resource: job.id,
    outcome: "allowed",
    correlationId: actor.correlationId,
    oldValue: null,
    newValue: { window },
  });

  return NextResponse.json({ job }, { status: 202 });
}
