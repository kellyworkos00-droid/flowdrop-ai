import { NextResponse } from "next/server";
import { mockDrops } from "@/lib/mocks/drops";

export async function GET() {
  const now = Date.now();
  const today = new Date().toISOString().split("T")[0];

  const total = mockDrops.length;
  const todo = mockDrops.filter((drop) => drop.status === "todo").length;
  const inProgress = mockDrops.filter((drop) => drop.status === "in_progress").length;
  const blocked = mockDrops.filter((drop) => drop.status === "blocked").length;
  const done = mockDrops.filter((drop) => drop.status === "done").length;
  const overdue = mockDrops.filter((drop) => drop.dueDate && drop.dueDate < today && drop.status !== "done").length;

  const blockedHours = mockDrops
    .filter((drop) => drop.status === "blocked" && drop.blockedSince)
    .map((drop) => (now - new Date(drop.blockedSince!).getTime()) / (1000 * 60 * 60));
  const avgBlockedHours = blockedHours.length
    ? Math.round(blockedHours.reduce((sum, value) => sum + value, 0) / blockedHours.length)
    : 0;

  const body = {
    total,
    todo,
    inProgress,
    blocked,
    done,
    overdue,
    avgBlockedHours,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
