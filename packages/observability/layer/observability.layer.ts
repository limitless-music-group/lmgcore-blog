import type { Config, Effect } from "effect";
import { Context } from "effect";
import { makeTapLayerFacade } from "../../shared/effects/tap-layer-facade.effect";

/**
 * initClientSentry/initServerSentry/initEdgeSentry/initInstrumentation are
 * deliberately NOT part of this port. Each is a one-shot bootstrap Next.js
 * itself calls from a dedicated, bundler-isolated entry file
 * (instrumentation-client.ts / sentry.server.config.ts / sentry.edge.config.ts
 * / instrumentation.ts) specifically so its client-only, server-only, and
 * edge-only Sentry submodules never share a module graph. Routing all four
 * through one Context/Layer object (as this port does for everything else)
 * forces every consumer of that object into the SAME module graph — which
 * pulled `initClientSentry`'s client-only `Sentry.replayIntegration` into
 * edge/server bundles via `log.ts` and broke `next build`. They're still real
 * Effects (tagged errors, `Effect.withSpan`) — just called directly by their
 * one dedicated bridge file (client.ts/server.ts/edge.ts/instrumentation.ts)
 * instead of through `ObservabilityLayer`/`runtime.ts`. Same exception class
 * as `onRequestError`/`onRouterTransitionStart` below.
 */
export interface Observability {
  readonly captureException: (
    error: unknown
  ) => Effect.Effect<void, never, never>;

  readonly logError: (
    message: string,
    meta?: Record<string, unknown>
  ) => Effect.Effect<void, never, never>;

  readonly loggingNextConfig: (
    sourceConfig: object
  ) => Effect.Effect<object, never, never>;

  readonly logInfo: (
    message: string,
    meta?: Record<string, unknown>
  ) => Effect.Effect<void, never, never>;

  readonly logWarn: (
    message: string,
    meta?: Record<string, unknown>
  ) => Effect.Effect<void, never, never>;

  readonly parseError: (error: unknown) => Effect.Effect<string, never, never>;

  readonly sentryNextConfig: (
    sourceConfig: object
  ) => Effect.Effect<object, Config.ConfigError, never>;
}

export const ObservabilityLayerContext =
  Context.Service<Observability>("Observability");

export const ObservabilityLayer = makeTapLayerFacade(ObservabilityLayerContext);
