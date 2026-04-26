import { mockDrops } from "@/lib/mocks/drops";
import type { DropItem } from "@/types/drop";

export interface DropsListResponse {
  items: DropItem[];
  total: number;
  generatedAt: string;
}

export interface DropsMetricsResponse {
  total: number;
  todo: number;
  inProgress: number;
  blocked: number;
  done: number;
  overdue: number;
  avgBlockedHours: number;
  generatedAt: string;
}

export async function getDrops(): Promise<DropItem[]> {
  try {
    const response = await fetch("/api/drops/list?limit=300", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch drops: ${response.status}`);
    }

    const payload = (await response.json()) as DropsListResponse;
    return payload.items;
  } catch {
    // Keep the app responsive when API endpoints are unavailable.
    return Promise.resolve(mockDrops);
  }
}

export async function getDropById(id: string): Promise<DropItem | undefined> {
  const drops = await getDrops();
  return drops.find((drop) => drop.id === id);
}

export async function getDropsMetrics(): Promise<DropsMetricsResponse> {
  try {
    const response = await fetch("/api/drops/metrics", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.status}`);
    }

    return (await response.json()) as DropsMetricsResponse;
  } catch {
    const today = new Date().toISOString().split("T")[0];
    const total = mockDrops.length;
    const todo = mockDrops.filter((drop) => drop.status === "todo").length;
    const inProgress = mockDrops.filter((drop) => drop.status === "in_progress").length;
    const blocked = mockDrops.filter((drop) => drop.status === "blocked").length;
    const done = mockDrops.filter((drop) => drop.status === "done").length;
    const overdue = mockDrops.filter((drop) => drop.dueDate && drop.dueDate < today && drop.status !== "done").length;
    return {
      total,
      todo,
      inProgress,
      blocked,
      done,
      overdue,
      avgBlockedHours: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
