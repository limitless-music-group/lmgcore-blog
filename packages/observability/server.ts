import { Effect } from "effect";
import { initServerSentry } from "./sentry-logtail/implementations/init-sentry-server.effect";

/**
 * Called directly (not through ObservabilityLayer/runtime.ts) — see the doc
 * comment on `Observability` in layer/observability.layer.ts.
 */
export const initializeSentry = (): void => {
  Effect.runSync(initServerSentry());
};
