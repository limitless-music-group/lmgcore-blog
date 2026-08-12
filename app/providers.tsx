import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { AnalyticsProvider } from "@/packages/analytics/provider";
import { UiProvider } from "@/packages/ui";

export function Providers({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <UiProvider>
      <AnalyticsProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </AnalyticsProvider>
    </UiProvider>
  );
}
