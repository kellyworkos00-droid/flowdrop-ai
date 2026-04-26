"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { TopBar } from "@/components/ui/top-bar";
import { NewDropModal } from "@/components/drops/new-drop-modal";
import { DropDetailDrawer } from "@/components/drops/drop-detail-drawer";
import { MobileNav } from "@/components/ui/mobile-nav";

const titleMap: Record<string, string> = {
  "/home": "Home",
  "/drops": "My Drops",
  "/team": "Team Flow",
  "/insights": "AI Insights",
  "/files": "Files",
  "/archive": "Archive",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWelcomeRoute = pathname.startsWith("/welcome");

  if (isWelcomeRoute) {
    return <>{children}</>;
  }

  const title = titleMap[pathname] ?? "FlowDrop";

  return (
    <div className="flow-shell flex h-dvh overflow-hidden">
      <Sidebar pathname={pathname} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <NewDropModal />
      <DropDetailDrawer />
      <MobileNav />
    </div>
  );
}
