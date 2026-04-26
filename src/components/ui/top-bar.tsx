"use client";

import { Bell, Command, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useCommandPaletteStore } from "@/store/useCommandPaletteStore";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";

interface TopBarProps {
  title: string;
  className?: string;
}

export function TopBar({ title, className }: TopBarProps) {
  const { user } = useUserStore();
  const { setNewDropModalOpen } = useDropsStore();
  const { setOpen } = useCommandPaletteStore();

  return (
    <header className={`sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/6 bg-[rgba(13,15,26,0.92)] px-4 backdrop-blur-md ${className ?? ""}`}>
      <h1 className="font-[var(--font-display)] text-[18px] font-semibold">{title}</h1>
      <div className="mx-auto w-full max-w-[400px]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring flex h-11 w-full items-center justify-between rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-surface-2)] px-3 text-[13px] text-[var(--color-text-secondary)]"
        >
          <span>Search drops, people, files...</span>
          <span className="inline-flex items-center gap-1 rounded border border-white/15 px-1.5 py-0.5 text-[11px]">
            <Command className="h-3 w-3" />K
          </span>
        </button>
      </div>
      <Button className="gap-1" onClick={() => setNewDropModalOpen(true)}>
        <Plus className="h-4 w-4" />
        New Drop
      </Button>
      <button type="button" className="focus-ring flow-interactive rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-white/8">
        <Bell className="h-4 w-4" />
      </button>
      <Avatar name={user.name} size="sm" />
    </header>
  );
}
