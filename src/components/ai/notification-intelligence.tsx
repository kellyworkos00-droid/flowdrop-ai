"use client";

import { useMemo, useState } from "react";
import { BellRing, Filter, Inbox, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { buildNotificationIntelligence, type NotificationMode, type NotificationPreference } from "@/lib/notifications/intelligence";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";

const defaultPref: NotificationPreference = {
  blockers: "instant",
  mentions: "instant",
  dueRisk: "digest",
};

export function NotificationIntelligence() {
  const { drops, selectDrop } = useDropsStore();
  const { user } = useUserStore();
  const [pref, setPref] = useState<NotificationPreference>(defaultPref);
  const [showOnlyHigh, setShowOnlyHigh] = useState(true);

  const intelligence = useMemo(() => buildNotificationIntelligence(drops, user.name), [drops, user.name]);

  const visibleSignals = useMemo(() => {
    if (showOnlyHigh) {
      return intelligence.highPriority.filter((item) => item.priority === "high");
    }
    return intelligence.highPriority;
  }, [intelligence.highPriority, showOnlyHigh]);

  const updatePref = (key: keyof NotificationPreference, value: NotificationMode) => {
    setPref((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <article className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-[15px] font-semibold">
          <BellRing className="h-4 w-4 text-[var(--color-brand-accent)]" />
          Notification Intelligence
        </h3>
        <button
          type="button"
          onClick={() => setShowOnlyHigh((prev) => !prev)}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[var(--color-surface-2)] px-3 py-1 text-[11px] text-[var(--color-text-secondary)]"
        >
          <Filter className="h-3.5 w-3.5" /> {showOnlyHigh ? "High priority" : "All priorities"}
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-[11px] text-[var(--color-text-tertiary)]">Blockers</span>
          <Select value={pref.blockers} onChange={(event) => updatePref("blockers", event.target.value as NotificationMode)}>
            <option value="instant">Instant</option>
            <option value="digest">Digest</option>
            <option value="muted">Muted</option>
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-[11px] text-[var(--color-text-tertiary)]">Mentions</span>
          <Select value={pref.mentions} onChange={(event) => updatePref("mentions", event.target.value as NotificationMode)}>
            <option value="instant">Instant</option>
            <option value="digest">Digest</option>
            <option value="muted">Muted</option>
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-[11px] text-[var(--color-text-tertiary)]">Due Risk</span>
          <Select value={pref.dueRisk} onChange={(event) => updatePref("dueRisk", event.target.value as NotificationMode)}>
            <option value="instant">Instant</option>
            <option value="digest">Digest</option>
            <option value="muted">Muted</option>
          </Select>
        </label>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-2">
          <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">Priority Inbox</p>
          {visibleSignals.length === 0 ? (
            <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
              No priority alerts right now.
            </p>
          ) : (
            visibleSignals.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => item.dropId && selectDrop(item.dropId)}
                className="w-full rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3 text-left hover:border-[var(--color-brand-primary)]/35"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-[13px] font-medium">{item.title}</p>
                  <Badge className="border-[rgba(255,77,109,0.35)] text-[var(--color-danger)]">High</Badge>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">{item.reason}</p>
              </button>
            ))
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">Digest Preview</p>
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 inline-flex items-center gap-1 text-[12px] font-medium"><Inbox className="h-3.5 w-3.5" /> {intelligence.morningDigest.label}</p>
            <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)]">
              {intelligence.morningDigest.items.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
            <p className="mb-1 inline-flex items-center gap-1 text-[12px] font-medium"><TriangleAlert className="h-3.5 w-3.5" /> {intelligence.endOfDayDigest.label}</p>
            <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)]">
              {intelligence.endOfDayDigest.items.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
