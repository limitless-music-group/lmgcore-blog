import { Effect } from "effect";
import { initClientAnalytics } from "./posthog/implementations/init-client-analytics.effect";

/**
 * Called directly (not through AnalyticsLayer/runtime.ts) — see the doc
 * comment on `Analytics` in layer/analytics.layer.ts. Keeps this file's
 * module graph to just posthog-js + init-client-analytics.effect, so
 * posthog-node never reaches the browser bundle.
 */
export const initializeAnalytics = (): void => {
  Effect.runSync(initClientAnalytics());
};
