"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BellRing,
  Bot,
  CheckCircle2,
  Download,
  Lock,
  Paintbrush,
  Save,
  Shield,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useUserStore } from "@/store/useUserStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

type Density = "comfortable" | "compact";
type Theme = "midnight" | "ocean" | "sunset";

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-3">
      <div>
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-[11px] text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition-all ${
          enabled ? "bg-[var(--color-brand-primary)]" : "bg-white/20"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser } = useUserStore();
  const { workspace, setWorkspace } = useWorkspaceStore();
  const { pushToast } = useToast();

  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileBio, setProfileBio] = useState("Designing calmer execution systems for teams.");
  const [timezone, setTimezone] = useState("America/New_York");
  const [weekStart, setWeekStart] = useState("monday");
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [density, setDensity] = useState<Density>("comfortable");
  const [theme, setTheme] = useState<Theme>("midnight");

  const [notifications, setNotifications] = useState<ToggleSetting[]>([
    { id: "critical", label: "Critical alerts", description: "Immediate pings for blockers and SLA breaches", enabled: true },
    { id: "digest", label: "Daily digest", description: "Morning + end-of-day summaries", enabled: true },
    { id: "mentions", label: "Mentions and watchers", description: "Notify when you are tagged or watching", enabled: true },
    { id: "noise", label: "Low-priority noise filter", description: "Suppress low-impact updates", enabled: true },
  ]);

  const [automation, setAutomation] = useState<ToggleSetting[]>([
    { id: "auto_escalate", label: "Escalate blocked >24h", description: "Auto-create attention signals for long blockers", enabled: true },
    { id: "auto_priority", label: "Auto-bump due-soon tasks", description: "Increase urgency when due date is near", enabled: true },
    { id: "smart_handoff", label: "Suggest handoffs", description: "Prompt reassignment when owners are overloaded", enabled: false },
  ]);

  const telemetryQuery = useQuery({
    queryKey: ["settings-telemetry"],
    staleTime: 30_000,
    queryFn: async () => {
      const response = await fetch("/api/telemetry/events?limit=100", { headers: { Accept: "application/json" } });
      if (!response.ok) {
        throw new Error("Failed to load telemetry");
      }
      return (await response.json()) as {
        summary: {
          total: number;
          errorCount: number;
          warnCount: number;
          infoCount: number;
          avgPerfMs: number;
        };
      };
    },
  });

  const auditQuery = useQuery({
    queryKey: ["settings-audit"],
    staleTime: 30_000,
    queryFn: async () => {
      const response = await fetch("/api/audit/logs?limit=1", { headers: { Accept: "application/json" } });
      if (!response.ok) {
        throw new Error("Failed to load audit logs");
      }
      return (await response.json()) as { total: number };
    },
  });

  const permissionsMatrix = useMemo(
    () => [
      { role: "Owner", can: "All actions, security, integrations, exports" },
      { role: "Manager", can: "Workflow control, invites, automation tuning" },
      { role: "Member", can: "Create/update assigned work, insight refresh" },
      { role: "Viewer", can: "Read dashboards and reports only" },
    ],
    [],
  );

  function saveProfile() {
    setUser({ ...user, name: profileName, email: profileEmail });
    pushToast("Profile settings saved", "success");
  }

  function saveWorkspace() {
    setWorkspace({ ...workspace, name: workspaceName });
    pushToast("Workspace settings saved", "success");
  }

  function saveNotificationSettings() {
    pushToast("Notification preferences updated", "success");
  }

  function saveAutomationSettings() {
    pushToast("Automation rules updated", "success");
  }

  function exportAuditCsv() {
    window.open("/api/audit/logs?export=csv", "_blank");
    pushToast("Audit export started", "info");
  }

  function saveExperienceSettings() {
    pushToast("Appearance and interaction settings saved", "success");
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-md)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-display)] text-[22px] font-semibold">Settings Center</h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
              Control every part of your workspace: identity, notifications, automation, permissions, and operations.
            </p>
          </div>
          <Button className="gap-1.5" onClick={() => pushToast("All setting groups saved", "success")}>
            <Save className="h-3.5 w-3.5" /> Save All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <UserRound className="h-4 w-4 text-[var(--color-brand-primary)]" /> Profile
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Display name</span>
                <Input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Email</span>
                <Input kind="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Bio</span>
                <Textarea value={profileBio} onChange={(event) => setProfileBio(event.target.value)} rows={2} />
              </label>
            </div>
            <Button size="sm" className="mt-3" onClick={saveProfile}>Save profile</Button>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <Wrench className="h-4 w-4 text-[var(--color-warning)]" /> Workspace
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1 md:col-span-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Workspace name</span>
                <Input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
              </label>
              <label className="space-y-1 md:col-span-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Timezone</span>
                <Select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </Select>
              </label>
              <label className="space-y-1 md:col-span-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Week starts</span>
                <Select value={weekStart} onChange={(event) => setWeekStart(event.target.value)}>
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                </Select>
              </label>
            </div>
            <Button size="sm" className="mt-3" onClick={saveWorkspace}>Save workspace</Button>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <BellRing className="h-4 w-4 text-[var(--color-brand-accent)]" /> Notifications
            </h3>
            <div className="space-y-2">
              {notifications.map((item) => (
                <ToggleRow
                  key={item.id}
                  label={item.label}
                  description={item.description}
                  enabled={item.enabled}
                  onToggle={() =>
                    setNotifications((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, enabled: !entry.enabled } : entry)))
                  }
                />
              ))}
            </div>
            <Button size="sm" className="mt-3" onClick={saveNotificationSettings}>Save notifications</Button>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <Bot className="h-4 w-4 text-[var(--color-brand-primary)]" /> Automation Controls
            </h3>
            <div className="space-y-2">
              {automation.map((item) => (
                <ToggleRow
                  key={item.id}
                  label={item.label}
                  description={item.description}
                  enabled={item.enabled}
                  onToggle={() =>
                    setAutomation((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, enabled: !entry.enabled } : entry)))
                  }
                />
              ))}
            </div>
            <Button size="sm" className="mt-3" onClick={saveAutomationSettings}>Save automation</Button>
          </article>
        </div>

        <div className="space-y-4">
          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <Shield className="h-4 w-4 text-[var(--color-success)]" /> Permissions Matrix
            </h3>
            <div className="space-y-2">
              {permissionsMatrix.map((item) => (
                <div key={item.role} className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] p-2.5">
                  <p className="text-[13px] font-medium">{item.role}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">{item.can}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <Paintbrush className="h-4 w-4 text-[var(--color-warning)]" /> Experience
            </h3>
            <div className="space-y-3">
              <label className="space-y-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Interface density</span>
                <Select value={density} onChange={(event) => setDensity(event.target.value as Density)}>
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </Select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Color theme</span>
                <Select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
                  <option value="midnight">Midnight</option>
                  <option value="ocean">Ocean</option>
                  <option value="sunset">Sunset</option>
                </Select>
              </label>
            </div>
            <Button size="sm" className="mt-3" onClick={saveExperienceSettings}>Save experience</Button>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <h3 className="mb-3 inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-[var(--color-brand-primary)]" /> Operations
            </h3>
            <div className="space-y-2 text-[12px] text-[var(--color-text-secondary)]">
              <p className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Telemetry events: {telemetryQuery.data?.summary.total ?? 0}</p>
              <p>Error count: {telemetryQuery.data?.summary.errorCount ?? 0}</p>
              <p>Avg interaction metric: {telemetryQuery.data?.summary.avgPerfMs ?? 0}ms</p>
              <p>Audit log rows: {auditQuery.data?.total ?? 0}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={exportAuditCsv}>
                <Download className="h-3.5 w-3.5" /> Export audit CSV
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                onClick={() => {
                  localStorage.removeItem("flowdrop.palette.recents");
                  localStorage.removeItem("flowdrop.palette.pins");
                  pushToast("Local cache reset", "info");
                }}
              >
                <Lock className="h-3.5 w-3.5" /> Reset local cache
              </Button>
            </div>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-[rgba(255,77,109,0.3)] bg-[rgba(255,77,109,0.06)] p-4">
            <h3 className="mb-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--color-danger)]">
              <Lock className="h-4 w-4" /> Danger Zone
            </h3>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Sensitive operations should require explicit owner approval in production.</p>
            <Button size="sm" variant="danger" className="mt-3 gap-1.5" onClick={() => pushToast("Destructive actions are disabled in this build", "error")}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Disable workspace (mock)
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
