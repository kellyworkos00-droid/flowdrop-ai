"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Grid2x2, Inbox, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: Grid2x2 },
  { href: "/drops", label: "Drops", icon: Inbox },
  { href: "/team", label: "Team", icon: Users },
  { href: "/insights", label: "AI", icon: Sparkles },
  { href: "/files", label: "Files", icon: Folder },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-30 flex w-[calc(100%-20px)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/10 bg-[var(--color-surface-1)] px-3 py-2 shadow-[var(--shadow-md)] lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={cn("flex flex-col items-center px-2 py-1 text-[11px]", active ? "text-[var(--color-brand-primary)]" : "text-[var(--color-text-secondary)]")}>
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
