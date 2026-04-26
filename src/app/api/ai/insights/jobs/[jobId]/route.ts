import { NextResponse } from "next/server";
import { getInsightJob } from "@/lib/ai/insight-jobs";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { jobId } = await context.params;
  const job = getInsightJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Insight job not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}
