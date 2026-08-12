import { Effect } from "effect";
import { initEdgeSentry } from "./sentry-logtail/implementations/init-edge-sentry.effect";

/**
 * Called directly (not through ObservabilityLayer/runtime.ts) — see the doc
 * comment on `Observability` in layer/observability.layer.ts.
 */
export const initializeSentry = (): void => {
  Effect.runSync(initEdgeSentry());
};
