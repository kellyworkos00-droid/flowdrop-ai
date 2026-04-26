"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendTelemetryEvent } from "@/lib/telemetry/client";

export function TelemetryClient() {
  const pathname = usePathname();

  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navEntry) {
      sendTelemetryEvent({
        name: "page_load",
        level: "info",
        route: pathname,
        durationMs: Math.round(navEntry.domComplete),
        meta: {
          ttfbMs: Math.round(navEntry.responseStart),
          transferSize: navEntry.transferSize,
        },
      });
    }

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "paint") {
          sendTelemetryEvent({
            name: "web_vital",
            level: "info",
            route: pathname,
            durationMs: Math.round(entry.startTime),
            meta: { metric: entry.name },
          });
        }
      });
    });

    try {
      observer.observe({ type: "paint", buffered: true });
    } catch {
      // Browser does not support paint observer.
    }

    const onError = (event: ErrorEvent) => {
      sendTelemetryEvent({
        name: "runtime_error",
        level: "error",
        route: pathname,
        meta: {
          message: event.message,
          source: event.filename ?? "unknown",
          line: event.lineno,
          column: event.colno,
        },
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      sendTelemetryEvent({
        name: "unhandled_rejection",
        level: "error",
        route: pathname,
        meta: {
          reason: String(event.reason),
        },
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      observer.disconnect();
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [pathname]);

  return null;
}
