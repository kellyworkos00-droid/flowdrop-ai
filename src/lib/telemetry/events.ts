export type TelemetryLevel = "info" | "warn" | "error";

export interface TelemetryEvent {
  id: string;
  name: string;
  level: TelemetryLevel;
  route?: string;
  durationMs?: number;
  meta?: Record<string, string | number | boolean | null>;
  timestamp: string;
}

const events: TelemetryEvent[] = [];

export function recordTelemetryEvent(event: Omit<TelemetryEvent, "id" | "timestamp">): TelemetryEvent {
  const next: TelemetryEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...event,
  };

  events.unshift(next);
  if (events.length > 500) {
    events.length = 500;
  }

  return next;
}

export function listTelemetryEvents(limit = 100): TelemetryEvent[] {
  return events.slice(0, limit);
}

export function getTelemetrySummary() {
  const errorCount = events.filter((event) => event.level === "error").length;
  const warnCount = events.filter((event) => event.level === "warn").length;
  const infoCount = events.filter((event) => event.level === "info").length;

  const perf = events.filter((event) => event.name === "web_vital" && typeof event.durationMs === "number");
  const avgPerfMs = perf.length
    ? Math.round(perf.reduce((sum, item) => sum + (item.durationMs ?? 0), 0) / perf.length)
    : 0;

  return {
    total: events.length,
    errorCount,
    warnCount,
    infoCount,
    avgPerfMs,
    latest: events[0] ?? null,
  };
}
