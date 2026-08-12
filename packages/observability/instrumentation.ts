import { captureRequestError } from "@sentry/nextjs";
import { Effect } from "effect";
import { initInstrumentation } from "./sentry-logtail/implementations/init-instrumentation.effect";

// Next.js's instrumentation hook calls this directly with its own fixed
// signature — same framework-callback exception as client.ts's
// onRouterTransitionStart.
export const onRequestError = captureRequestError;

/**
 * Called directly (not through ObservabilityLayer/runtime.ts) — see the doc
 * comment on `Observability` in layer/observability.layer.ts.
 */
export const initializeSentry = (): void => {
  Effect.runSync(initInstrumentation());
};
