"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command, CornerDownLeft, Pin, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useCommandPaletteStore } from "@/store/useCommandPaletteStore";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";
import type { DropStatus } from "@/types/drop";

type PaletteItemType = "command" | "drop";

interface PaletteItem {
  id: string;
  type: PaletteItemType;
  title: string;
  subtitle?: string;
  keywords: string;
  pinned?: boolean;
  execute: () => void;
}

const RECENTS_KEY = "flowdrop.palette.recents";
const PINS_KEY = "flowdrop.palette.pins";

function fuzzyScore(text: string, query: string): number {
  if (!query) return 1;
  const source = text.toLowerCase();
  const target = query.toLowerCase();
  if (source.startsWith(target)) return 100;
  if (source.includes(target)) return 60;

  // Lightweight fuzzy sequence score.
  let qi = 0;
  let score = 0;
  for (let i = 0; i < source.length && qi < target.length; i += 1) {
    if (source[i] === target[qi]) {
      qi += 1;
      score += 3;
    }
  }
  return qi === target.length ? score : 0;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  const { isOpen, setOpen, toggle } = useCommandPaletteStore();
  const {
    drops,
    selectedDropId,
    setNewDropModalOpen,
    selectDrop,
    updateStatus,
    reassignDrop,
  } = useDropsStore();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [pins, setPins] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(PINS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const persistRecents = (next: string[]) => {
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  };

  const persistPins = (next: string[]) => {
    setPins(next);
    localStorage.setItem(PINS_KEY, JSON.stringify(next));
  };

  const markRecent = (id: string) => {
    const next = [id, ...recents.filter((item) => item !== id)].slice(0, 8);
    persistRecents(next);
  };

  const moveSelectedDrop = useCallback((status: DropStatus) => {
    if (!selectedDropId) return;
    updateStatus(selectedDropId, status);
  }, [selectedDropId, updateStatus]);

  const assignSelectedToMe = useCallback(() => {
    if (!selectedDropId) return;
    reassignDrop(selectedDropId, user.id, user.name);
  }, [reassignDrop, selectedDropId, user.id, user.name]);

  const allItems = useMemo(() => {
    const baseCommands: PaletteItem[] = [
      {
        id: "cmd_create_item",
        type: "command",
        title: "Create item",
        subtitle: "Open New Drop modal",
        keywords: "new create add task drop",
        execute: () => setNewDropModalOpen(true),
      },
      {
        id: "cmd_search_drops",
        type: "command",
        title: "Search drops",
        subtitle: "Go to My Drops board",
        keywords: "search find list drops",
        execute: () => router.push("/drops"),
      },
      {
        id: "cmd_move_progress",
        type: "command",
        title: "Move selected to In Progress",
        subtitle: selectedDropId ? "Uses currently selected drop" : "Select a drop first",
        keywords: "move status in progress start",
        execute: () => moveSelectedDrop("in_progress"),
      },
      {
        id: "cmd_move_done",
        type: "command",
        title: "Move selected to Done",
        subtitle: selectedDropId ? "Uses currently selected drop" : "Select a drop first",
        keywords: "move status done complete",
        execute: () => moveSelectedDrop("done"),
      },
      {
        id: "cmd_assign_me",
        type: "command",
        title: "Assign selected to me",
        subtitle: selectedDropId ? user.name : "Select a drop first",
        keywords: "assign me owner",
        execute: assignSelectedToMe,
      },
      {
        id: "cmd_open_team",
        type: "command",
        title: "Open Team Flow",
        subtitle: "Go to workload and accountability view",
        keywords: "team workload manager",
        execute: () => router.push("/team"),
      },
      {
        id: "cmd_open_settings",
        type: "command",
        title: "Open Settings",
        subtitle: "Manage profile, workspace, and app controls",
        keywords: "settings preferences profile workspace",
        execute: () => router.push("/settings"),
      },
    ];

    const dropItems: PaletteItem[] = drops.slice(0, 30).map((drop) => ({
      id: `drop_${drop.id}`,
      type: "drop",
      title: drop.title,
      subtitle: `${drop.status.replace("_", " ")} · ${drop.assigneeNames.join(", ") || "Unassigned"}`,
      keywords: `${drop.title} ${drop.description ?? ""} ${drop.assigneeNames.join(" ")}`,
      execute: () => {
        selectDrop(drop.id);
        if (pathname !== "/drops") router.push("/drops");
      },
    }));

    const merged = [...baseCommands, ...dropItems];
    return merged.map((item) => ({ ...item, pinned: pins.includes(item.id) }));
  }, [assignSelectedToMe, drops, moveSelectedDrop, pathname, pins, router, selectDrop, selectedDropId, setNewDropModalOpen, user.name]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems
      .map((item) => ({ item, score: fuzzyScore(`${item.title} ${item.keywords}`, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => {
        if ((b.item.pinned ? 1 : 0) !== (a.item.pinned ? 1 : 0)) {
          return (b.item.pinned ? 1 : 0) - (a.item.pinned ? 1 : 0);
        }
        return b.score - a.score;
      })
      .map((entry) => entry.item)
      .slice(0, 14);
  }, [allItems, query]);

  const recentItems = allItems.filter((item) => recents.includes(item.id)).sort((a, b) => recents.indexOf(a.id) - recents.indexOf(b.id));

  const onExecute = (item: PaletteItem) => {
    item.execute();
    markRecent(item.id);
    setOpen(false);
    setQuery("");
  };

  const onTogglePin = (itemId: string) => {
    const next = pins.includes(itemId) ? pins.filter((id) => id !== itemId) : [...pins, itemId];
    persistPins(next);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((idx) => Math.min(idx + 1, visibleItems.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, 0));
      return;
    }
    if (event.key === "Enter" && visibleItems[activeIndex]) {
      event.preventDefault();
      onExecute(visibleItems[activeIndex]);
    }
  };

  return (
    <Modal open={isOpen} onClose={() => setOpen(false)} className="max-w-[720px] p-0" title="">
      <div className="border-b border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-white/12 bg-[var(--color-surface-2)] px-3">
          <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            autoFocus
            placeholder="Type a command or search drops..."
            className="h-11 w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          <span className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] text-[var(--color-text-tertiary)]">Esc</span>
        </div>
      </div>

      {!query && recentItems.length > 0 ? (
        <div className="border-b border-white/8 px-3 pb-2 pt-3">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-[var(--color-text-tertiary)]">Recent</p>
          <div className="flex flex-wrap gap-1.5">
            {recentItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onExecute(item)}
                className="rounded-full border border-white/10 bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="max-h-[420px] overflow-y-auto p-2">
        {visibleItems.length === 0 ? (
          <p className="rounded-[var(--radius-md)] border border-dashed border-white/12 bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-text-secondary)]">
            No commands matched.
          </p>
        ) : (
          visibleItems.map((item, index) => (
            <div
              key={item.id}
              className={`mb-1 flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 transition-colors ${
                index === activeIndex
                  ? "border-[var(--color-brand-primary)]/40 bg-[rgba(45,107,228,0.15)]"
                  : "border-transparent hover:border-white/10 hover:bg-[var(--color-surface-2)]"
              }`}
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]">
                {item.type === "command" ? <Command className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
              </span>
              <button type="button" onClick={() => onExecute(item)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[13px] font-medium">{item.title}</span>
                {item.subtitle ? (
                  <span className="block truncate text-[11px] text-[var(--color-text-secondary)]">{item.subtitle}</span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => onTogglePin(item.id)}
                className={`rounded p-1 ${item.pinned ? "text-[var(--color-brand-accent)]" : "text-[var(--color-text-tertiary)]"}`}
                aria-label="Pin command"
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 px-3 py-2 text-[11px] text-[var(--color-text-tertiary)]">
        <span className="inline-flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> to run</span>
        <span className="inline-flex items-center gap-1"><Command className="h-3 w-3" />K to open</span>
      </div>
    </Modal>
  );
}
