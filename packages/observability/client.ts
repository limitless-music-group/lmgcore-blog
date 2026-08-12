import { captureRouterTransitionStart } from "@sentry/nextjs";
import { Effect } from "effect";
import { initClientSentry } from "./sentry-logtail/implementations/init-client-sentry.effect";

/**
 * Called directly (not through ObservabilityLayer/runtime.ts) — see the doc
 * comment on `Observability` in layer/observability.layer.ts. Keeps this
 * file's module graph to just @sentry/nextjs + init-client-sentry.effect, so
 * client-only Sentry APIs (replayIntegration) never reach server/edge bundles.
 */
export const initializeSentry = (): void => {
  Effect.runSync(initClientSentry());
};

// Next.js's client router-transition hook calls this directly with its own
// fixed signature — nothing in our code calls it, so it can't be `yield*`'d
// through the port. Same framework-callback exception as
// packages/security/server.ts's raw @arcjet/next re-export.
export const onRouterTransitionStart = captureRouterTransitionStart;
