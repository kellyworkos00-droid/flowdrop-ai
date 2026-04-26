import { NextResponse } from "next/server";
import { enqueueInsightJob, getLatestInsightSnapshot, listInsightJobs } from "@/lib/ai/insight-jobs";

export async function GET() {
  return NextResponse.json({
    latestSnapshot: getLatestInsightSnapshot(),
    jobs: listInsightJobs().slice(0, 15),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { workspaceId?: string; window?: "7d" | "14d" | "30d" };

  if (!body.workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  const window = body.window ?? "14d";
  const job = enqueueInsightJob(body.workspaceId, window);

  return NextResponse.json({ job }, { status: 202 });
}
