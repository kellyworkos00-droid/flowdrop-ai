"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Archive, Download, Filter } from "lucide-react";

interface AuditItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  role: string;
  workspaceId: string;
  action: string;
  resource: string;
  outcome: "allowed" | "denied";
  reason?: string;
  correlationId: string;
}

export default function ArchivePage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "allowed" | "denied">("all");

  const query = useQuery({
    queryKey: ["audit-logs", actionFilter, outcomeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (actionFilter !== "all") {
        params.set("action", actionFilter);
      }
      if (outcomeFilter !== "all") {
        params.set("outcome", outcomeFilter);
      }
      params.set("limit", "200");

      const response = await fetch(`/api/audit/logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      return (await response.json()) as { items: AuditItem[]; total: number };
    },
    staleTime: 15_000,
  });

  const actions = useMemo(() => {
    const set = new Set<string>();
    query.data?.items.forEach((item) => set.add(item.action));
    return ["all", ...Array.from(set).sort()];
  }, [query.data?.items]);

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    if (actionFilter !== "all") {
      params.set("action", actionFilter);
    }
    if (outcomeFilter !== "all") {
      params.set("outcome", outcomeFilter);
    }
    params.set("export", "csv");
    return `/api/audit/logs?${params.toString()}`;
  }, [actionFilter, outcomeFilter]);

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="inline-flex items-center gap-2 font-[var(--font-display)] text-[22px] font-semibold">
              <Archive className="h-5 w-5 text-[var(--color-brand-primary)]" />
              Audit Trail
            </h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
              Append-only log of all mutation actions, permission outcomes, and actor trace context.
            </p>
          </div>
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </a>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[12px]">
            <Filter className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="h-full w-full bg-transparent text-[13px] outline-none"
            >
              {actions.map((action) => (
                <option key={action} value={action} className="bg-[var(--color-surface-2)]">
                  {action === "all" ? "All actions" : action}
                </option>
              ))}
            </select>
          </label>
          <label className="flex h-10 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[12px]">
            <Filter className="h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
            <select
              value={outcomeFilter}
              onChange={(event) => setOutcomeFilter(event.target.value as "all" | "allowed" | "denied")}
              className="h-full w-full bg-transparent text-[13px] outline-none"
            >
              <option value="all" className="bg-[var(--color-surface-2)]">All outcomes</option>
              <option value="allowed" className="bg-[var(--color-surface-2)]">Allowed</option>
              <option value="denied" className="bg-[var(--color-surface-2)]">Denied</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-3">
        {query.isLoading ? (
          <p className="p-3 text-[13px] text-[var(--color-text-secondary)]">Loading audit events...</p>
        ) : query.data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-white/10 text-[var(--color-text-tertiary)]">
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Actor</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Action</th>
                  <th className="px-2 py-2">Outcome</th>
                  <th className="px-2 py-2">Resource</th>
                  <th className="px-2 py-2">Correlation</th>
                </tr>
              </thead>
              <tbody>
                {query.data.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/6 last:border-b-0">
                    <td className="px-2 py-2 text-[var(--color-text-secondary)]">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="px-2 py-2">{item.actorName}</td>
                    <td className="px-2 py-2 text-[var(--color-text-secondary)]">{item.role}</td>
                    <td className="px-2 py-2">{item.action}</td>
                    <td className="px-2 py-2">
                      <span className={`rounded-full px-2 py-0.5 ${item.outcome === "denied" ? "bg-[rgba(255,77,109,0.15)] text-[var(--color-danger)]" : "bg-[rgba(0,196,140,0.15)] text-[var(--color-success)]"}`}>
                        {item.outcome}
                      </span>
                    </td>
                    <td className="max-w-[240px] truncate px-2 py-2 text-[var(--color-text-secondary)]">{item.resource}</td>
                    <td className="max-w-[260px] truncate px-2 py-2 text-[var(--color-text-tertiary)]">{item.correlationId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-3 text-[13px] text-[var(--color-text-secondary)]">No audit entries yet. Trigger a mutation to generate logs.</p>
        )}
      </div>
    </section>
  );
}
