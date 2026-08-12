import { ManagedRuntime } from "effect";
import { PostHogAnalyticsLayerLive } from "./posthog/posthog-analytics.layer";

/**
 * Same role as `@/packages/database`'s `withDb`/`withTx` — a ManagedRuntime
 * built once for the server-side ops (captureServerEvent/identifyServerUser/
 * groupIdentifyServer). `instrumentation-client.ts` deliberately does NOT use
 * this — see the doc comment on `Analytics` in layer/analytics.layer.ts.
 */
export const analyticsRuntime = ManagedRuntime.make(PostHogAnalyticsLayerLive);
