"use client";

import { useState } from "react";
import { AlertTriangle, Info, X, Zap } from "lucide-react";
import type { AutomationSignal } from "@/lib/automation/rules";

interface AutomationAlertsProps {
  signals: AutomationSignal[];
  onDropClick?: (dropId: string) => void;
}

const severityConfig = {
  critical: {
    container: "border-[rgba(255,77,109,0.35)] bg-[rgba(255,77,109,0.08)]",
    icon: <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />,
    dot: "bg-[var(--color-danger)]",
    text: "text-[var(--color-danger)]",
  },
  warning: {
    container: "border-[rgba(245,166,35,0.35)] bg-[rgba(245,166,35,0.08)]",
    icon: <Zap className="h-4 w-4 text-[var(--color-warning)]" />,
    dot: "bg-[var(--color-warning)]",
    text: "text-[var(--color-warning)]",
  },
  info: {
    container: "border-white/12 bg-white/5",
    icon: <Info className="h-4 w-4 text-[var(--color-text-tertiary)]" />,
    dot: "bg-[var(--color-text-tertiary)]",
    text: "text-[var(--color-text-secondary)]",
  },
};

export function AutomationAlerts({ signals, onDropClick }: AutomationAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = signals.filter((s) => !dismissed.has(`${s.dropId}-${s.rule}`));

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visible.map((signal) => {
        const config = severityConfig[signal.severity];
        const key = `${signal.dropId}-${signal.rule}`;
        return (
          <div
            key={key}
            className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3 ${config.container}`}
          >
            <span className="mt-0.5 shrink-0">{config.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={`text-[13px] font-medium ${config.text}`}>{signal.label}</p>
              {signal.suggestion ? (
                <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{signal.suggestion}</p>
              ) : null}
              {onDropClick ? (
                <button
                  type="button"
                  onClick={() => onDropClick(signal.dropId)}
                  className="mt-1 text-[11px] text-[var(--color-brand-primary)] hover:underline"
                >
                  View item
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setDismissed((prev) => new Set(prev).add(key))}
              className="shrink-0 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
