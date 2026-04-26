"use client";

import { ToastProvider } from "@/components/ui/toast";
import { TelemetryClient } from "@/components/system/telemetry-client";
import { QueryProvider } from "@/providers/query-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <TelemetryClient />
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
}
