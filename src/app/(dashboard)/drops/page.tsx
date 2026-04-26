"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownWideNarrow, Bookmark, Filter, ListFilter, Search, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropCard } from "@/components/ui/drop-card";
import { getDrops } from "@/lib/drops";
import { useUserStore } from "@/store/useUserStore";
import { useDropsStore } from "@/store/useDropsStore";
import type { DropItem, DropStatus, DropType } from "@/types/drop";

type StatusFilter = DropStatus | "all";
type TypeFilter = DropType | "all";
type SortMode = "newest" | "title_asc" | "title_desc";

interface SavedView {
  id: string;
  label: string;
  status: StatusFilter;
  type: TypeFilter;
  assignedToMe: boolean;
  sort: SortMode;
}

const SAVED_VIEWS: SavedView[] = [
  { id: "my_blockers", label: "My Blockers", status: "blocked", type: "all", assignedToMe: true, sort: "newest" },
  { id: "due_week", label: "Due This Week", status: "all", type: "all", assignedToMe: false, sort: "newest" },
  { id: "in_progress", label: "In Progress", status: "in_progress", type: "all", assignedToMe: false, sort: "newest" },
  { id: "unassigned", label: "Unassigned", status: "todo", type: "all", assignedToMe: false, sort: "newest" },
];

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Blocked", value: "blocked" },
  { label: "Done", value: "done" },
];

const typeOptions: { label: string; value: TypeFilter }[] = [
  { label: "All Types", value: "all" },
  { label: "Task", value: "task" },
  { label: "Idea", value: "idea" },
  { label: "File", value: "file" },
  { label: "Link", value: "link" },
  { label: "Blocker", value: "blocker" },
  { label: "Note", value: "note" },
];

function sortDrops(items: DropItem[], sortMode: SortMode): DropItem[] {
  const sorted = [...items];
  switch (sortMode) {
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
    default:
      return sorted;
  }
}

export default function DropsPage() {
  const { user } = useUserStore();
  const { drops, selectDrop, setDrops } = useDropsStore();
  const query = useQuery({ queryKey: ["drops"], queryFn: getDrops });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [assignedToMeOnly, setAssignedToMeOnly] = useState(false);
  const [activeView, setActiveView] = useState<string | null>(null);

  function applyView(view: SavedView) {
    setActiveView(view.id);
    setStatusFilter(view.status);
    setTypeFilter(view.type);
    setAssignedToMeOnly(view.assignedToMe);
    setSortMode(view.sort);
    setSearch("");
  }

  function clearView() {
    setActiveView(null);
  }

  useEffect(() => {
    if (query.data) {
      setDrops(query.data);
    }
  }, [query.data, setDrops]);

  const filteredDrops = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const base = drops.filter((drop) => {
      if (statusFilter !== "all" && drop.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== "all" && drop.type !== typeFilter) {
        return false;
      }

      if (assignedToMeOnly && !drop.assigneeNames.some((assignee) => assignee.toLowerCase() === user.name.toLowerCase())) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = `${drop.title} ${drop.description ?? ""} ${drop.assigneeNames.join(" ")}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });

    return sortDrops(base, sortMode);
  }, [assignedToMeOnly, drops, search, sortMode, statusFilter, typeFilter, user.name]);

  const counts = useMemo(
    () => ({
      all: filteredDrops.length,
      todo: filteredDrops.filter((drop) => drop.status === "todo").length,
      in_progress: filteredDrops.filter((drop) => drop.status === "in_progress").length,
      blocked: filteredDrops.filter((drop) => drop.status === "blocked").length,
      done: filteredDrops.filter((drop) => drop.status === "done").length,
    }),
    [filteredDrops],
  );

  const lanes = useMemo(
    () => [
      { key: "todo" as const, title: "To Do", description: "Backlog and upcoming" },
      { key: "in_progress" as const, title: "In Progress", description: "Actively moving" },
      { key: "blocked" as const, title: "Blocked", description: "Needs attention" },
      { key: "done" as const, title: "Done", description: "Recently completed" },
    ],
    [],
  );

  return (
    <section className="space-y-4">
      <div className="rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-surface-1)] p-5 shadow-[var(--shadow-md)]">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-[var(--font-display)] text-[22px] font-semibold">My Drops</h2>
            <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">Track what matters, focus your workflow, and move blockers fast.</p>
          </div>
          <Button className="gap-1.5" onClick={() => { setAssignedToMeOnly((prev) => !prev); setActiveView(null); }} variant={assignedToMeOnly ? "primary" : "secondary"}>
            <Users className="h-3.5 w-3.5" />
            {assignedToMeOnly ? "Assigned to me" : "Show my work"}
          </Button>
        </div>

        {/* Saved views */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-tertiary)]">
            <Bookmark className="h-3.5 w-3.5" /> Views:
          </span>
          {SAVED_VIEWS.map((view) => (
            <button
              key={view.id}
              onClick={() => (activeView === view.id ? clearView() : applyView(view))}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                activeView === view.id
                  ? "border-[var(--color-brand-accent)] bg-[rgba(0,229,195,0.12)] text-[var(--color-brand-accent)]"
                  : "border-white/10 bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:border-white/20 hover:text-[var(--color-text-primary)]"
              }`}
            >
              {view.label}
            </button>
          ))}
          {activeView && (
            <button
              onClick={clearView}
              className="text-[11px] text-[var(--color-text-tertiary)] underline hover:text-[var(--color-text-secondary)]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
          <label className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3">
            <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, assignee, or details"
              className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
          </label>

          <label className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[13px] text-[var(--color-text-secondary)]">
            <Filter className="h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-full w-full bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[var(--color-surface-2)]">
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[13px] text-[var(--color-text-secondary)]">
            <ListFilter className="h-4 w-4" />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              className="h-full w-full bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[var(--color-surface-2)]">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" />
            {filteredDrops.length} drop{filteredDrops.length === 1 ? "" : "s"} in this view
          </div>
          <label className="inline-flex h-8 items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-2.5 text-[12px]">
            <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="bg-transparent text-[12px] text-[var(--color-text-primary)] outline-none"
            >
              <option value="newest" className="bg-[var(--color-surface-2)]">Newest first</option>
              <option value="title_asc" className="bg-[var(--color-surface-2)]">Title A-Z</option>
              <option value="title_desc" className="bg-[var(--color-surface-2)]">Title Z-A</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {lanes.map((lane) => {
          const laneDrops = filteredDrops.filter((drop) => drop.status === lane.key);
          return (
            <article key={lane.key} className="rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-3">
              <div className="mb-3 border-b border-white/8 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold">{lane.title}</h3>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
                    {counts[lane.key]}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{lane.description}</p>
              </div>

              {laneDrops.length === 0 ? (
                <div className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-4 text-center text-[12px] text-[var(--color-text-tertiary)]">
                  Nothing here yet
                </div>
              ) : (
                laneDrops.map((drop) => (
                  <DropCard key={drop.id} drop={drop} onClick={() => selectDrop(drop.id)} className="mb-2" />
                ))
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
