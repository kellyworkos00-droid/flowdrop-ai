"use client";

export type ClientTelemetryPayload = {
  name: string;
  level: "info" | "warn" | "error";
  route?: string;
  durationMs?: number;
  meta?: Record<string, string | number | boolean | null>;
};

export function sendTelemetryEvent(payload: ClientTelemetryPayload): void {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/telemetry/events", blob);
    return;
  }

  void fetch("/api/telemetry/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
