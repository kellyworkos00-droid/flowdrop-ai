import { mockDrops } from "@/lib/mocks/drops";
import { summarizeFlowNudge } from "@/lib/ai/client";

export type InsightJobStatus = "queued" | "running" | "completed" | "failed";

export interface InsightSnapshot {
  throughput: number;
  blockerRate: number;
  riskCount: number;
  generatedAt: string;
  summary: string;
}

export interface InsightJob {
  id: string;
  workspaceId: string;
  window: "7d" | "14d" | "30d";
  status: InsightJobStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  snapshot?: InsightSnapshot;
}

const jobStore = new Map<string, InsightJob>();
const orderedJobIds: string[] = [];
let latestSnapshot: InsightSnapshot | null = null;

function pushJob(job: InsightJob): void {
  jobStore.set(job.id, job);
  orderedJobIds.unshift(job.id);
  if (orderedJobIds.length > 50) {
    const removed = orderedJobIds.pop();
    if (removed) jobStore.delete(removed);
  }
}

async function buildSnapshot(window: "7d" | "14d" | "30d"): Promise<InsightSnapshot> {
  const total = mockDrops.length;
  const done = mockDrops.filter((drop) => drop.status === "done").length;
  const blocked = mockDrops.filter((drop) => drop.status === "blocked").length;
  const riskCount = mockDrops.filter((drop) => {
    if (drop.status === "blocked") return true;
    if (!drop.dueDate || drop.status === "done") return false;
    return drop.dueDate < new Date().toISOString().split("T")[0];
  }).length;

  const throughput = total > 0 ? Math.round((done / total) * 100) : 0;
  const blockerRate = total > 0 ? Math.round((blocked / total) * 100) : 0;

  const summaryInput = `Window ${window}. Throughput ${throughput}%. Blocker rate ${blockerRate}%. Risks ${riskCount}.`;

  let summary = "Workflow signal generated.";
  try {
    summary = await summarizeFlowNudge(summaryInput);
  } catch {
    summary = `Throughput ${throughput}% with blocker rate ${blockerRate}% across ${riskCount} active risk items.`;
  }

  return {
    throughput,
    blockerRate,
    riskCount,
    generatedAt: new Date().toISOString(),
    summary,
  };
}

async function processJob(jobId: string): Promise<void> {
  const existing = jobStore.get(jobId);
  if (!existing) return;

  existing.status = "running";
  existing.startedAt = new Date().toISOString();

  try {
    const snapshot = await buildSnapshot(existing.window);
    existing.snapshot = snapshot;
    existing.status = "completed";
    existing.completedAt = new Date().toISOString();
    latestSnapshot = snapshot;
  } catch (error) {
    existing.status = "failed";
    existing.error = error instanceof Error ? error.message : "Unknown insight job error";
    existing.completedAt = new Date().toISOString();
  }

  jobStore.set(jobId, existing);
}

export function enqueueInsightJob(workspaceId: string, window: "7d" | "14d" | "30d"): InsightJob {
  const job: InsightJob = {
    id: crypto.randomUUID(),
    workspaceId,
    window,
    status: "queued",
    createdAt: new Date().toISOString(),
  };

  pushJob(job);

  // Fire and forget processing to avoid blocking API response.
  queueMicrotask(() => {
    void processJob(job.id);
  });

  return job;
}

export function getInsightJob(jobId: string): InsightJob | null {
  return jobStore.get(jobId) ?? null;
}

export function listInsightJobs(): InsightJob[] {
  return orderedJobIds
    .map((id) => jobStore.get(id))
    .filter((job): job is InsightJob => Boolean(job));
}

export function getLatestInsightSnapshot(): InsightSnapshot | null {
  return latestSnapshot;
}
