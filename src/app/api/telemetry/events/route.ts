import { NextResponse } from "next/server";
import { getTelemetrySummary, listTelemetryEvents, recordTelemetryEvent } from "@/lib/telemetry/events";

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
  const body = (await request.json()) as {
    name?: string;
    level?: "info" | "warn" | "error";
    route?: string;
    durationMs?: number;
    meta?: Record<string, string | number | boolean | null>;
  };

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
