"use client";

import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useDropsStore } from "@/store/useDropsStore";
import { useUserStore } from "@/store/useUserStore";

interface TopBarProps {
  title: string;
  className?: string;
}

export function TopBar({ title, className }: TopBarProps) {
  const { user } = useUserStore();
  const { setNewDropModalOpen } = useDropsStore();

  return (
    <header className={`flex h-14 items-center gap-3 border-b border-white/6 bg-[var(--color-surface-0)] px-4 ${className ?? ""}`}>
      <h1 className="font-[var(--font-display)] text-[18px] font-semibold">{title}</h1>
      <div className="mx-auto w-full max-w-[400px]">
        <Input kind="search" placeholder="Search drops, people, files..." />
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
