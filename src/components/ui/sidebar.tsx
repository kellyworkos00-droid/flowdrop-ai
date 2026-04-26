"use client";

import Link from "next/link";
import { Archive, Folder, Grid2x2, Inbox, Settings, Sparkles, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

interface SidebarProps {
  className?: string;
  pathname: string;
}

const navItems = [
  { href: "/home", label: "Home", icon: Grid2x2 },
  { href: "/drops", label: "My Drops", icon: Inbox },
  { href: "/team", label: "Team Flow", icon: Users },
  { href: "/insights", label: "AI Insights", icon: Sparkles },
  { href: "/files", label: "Files", icon: Folder },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className, pathname }: SidebarProps) {
  const { user } = useUserStore();
  const { workspace } = useWorkspaceStore();

  return (
    <aside className={cn("hidden h-dvh shrink-0 border-r border-white/8 bg-[linear-gradient(180deg,rgba(20,23,38,0.98)_0%,rgba(15,18,31,0.98)_100%)] p-3 lg:flex lg:w-16 lg:flex-col xl:w-64", className)}>
      <div className="mb-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 px-3 py-3">
        <p className="font-[var(--font-display)] text-[20px] font-semibold xl:text-[20px] lg:text-[14px]">FlowDrop<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-brand-accent)]" /></p>
        <p className="hidden text-[12px] text-[var(--color-text-secondary)] xl:block">{workspace.name}</p>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-10 items-center gap-2 rounded-[var(--radius-md)] border-l-2 px-3 text-[13px] text-[var(--color-text-secondary)] transition-all duration-[var(--duration-base)] xl:justify-start lg:justify-center",
                active
                  ? "border-l-[var(--color-brand-primary)] bg-[rgba(45,107,228,0.14)] text-[var(--color-text-primary)] shadow-[0_0_0_1px_rgba(45,107,228,0.2)]"
                  : "border-l-transparent hover:bg-white/5 hover:text-[var(--color-text-primary)]",
              )}
            >
              <Icon className={cn("h-4 w-4", item.label === "AI Insights" ? "text-[var(--color-brand-accent)]" : "group-hover:text-[var(--color-text-primary)]")} />
              <span className="hidden xl:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-3 h-px bg-white/8" />
      <div className="hidden flex-1 space-y-2 overflow-y-auto pr-1 xl:block">
        {workspace.members.map((member) => (
          <div key={member.id} className="flex items-center gap-2 rounded-[var(--radius-md)] border border-white/6 bg-white/4 p-2 text-[12px]">
            <Avatar name={member.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate">{member.name}</p>
              <p className="truncate text-[var(--color-text-tertiary)]">{member.role}</p>
            </div>
            <span
              className={cn("ml-auto h-2 w-2 rounded-full", member.online ? "bg-[var(--color-success)]" : "bg-[var(--color-text-tertiary)]")}
              aria-label={member.online ? "Online" : "Offline"}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-white/5 p-2 xl:flex-row lg:flex-col">
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-[13px] xl:inline">{user.name}</span>
        <Link href="/settings" className="focus-ring ml-auto rounded-full p-1.5 text-[var(--color-text-secondary)] hover:bg-white/8" aria-label="Open settings">
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
