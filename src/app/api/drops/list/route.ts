import { NextResponse } from "next/server";
import { mockDrops } from "@/lib/mocks/drops";

function parsePositiveInt(input: string | null, fallback: number): number {
  if (!input) return fallback;
  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const assignee = url.searchParams.get("assignee");
  const q = url.searchParams.get("q")?.trim().toLowerCase();
  const limit = parsePositiveInt(url.searchParams.get("limit"), 200);

  const filtered = mockDrops.filter((drop) => {
    if (status && status !== "all" && drop.status !== status) {
      return false;
    }

    if (assignee && assignee !== "all") {
      const hasAssignee = drop.assigneeNames.some((name) => name.toLowerCase() === assignee.toLowerCase());
      if (!hasAssignee) return false;
    }

    if (!q) return true;
    const bag = `${drop.title} ${drop.description ?? ""} ${drop.assigneeNames.join(" ")}`.toLowerCase();
    return bag.includes(q);
  });

  const body = {
    items: filtered.slice(0, limit),
    total: filtered.length,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
    },
  });
}
