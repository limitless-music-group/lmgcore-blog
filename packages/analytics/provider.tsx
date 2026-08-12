import { env } from "@/env";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { PropsWithChildren } from "react";

const { NEXT_PUBLIC_GA_MEASUREMENT_ID } = env;

export const AnalyticsProvider = ({ children }: PropsWithChildren) => (
  <>
    {children}
    <VercelAnalytics />
    <SpeedInsights />
    {NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    ) : null}
  </>
);
