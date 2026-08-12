import type { Config, Effect } from "effect";
import { Context } from "effect";
import type {
  EventMessage,
  GroupIdentifyMessage,
  IdentifyMessage,
} from "posthog-node";
import { makeTapLayerFacade } from "@/packages/shared/effects/tap-layer-facade.effect";

/**
 * captureClientEvent/identifyClient/initClientAnalytics are deliberately NOT
 * part of this port. Each is a posthog-js (browser) op that must stay in a
 * module graph that never imports posthog-node — even an unused import of
 * posthog-node (Node-only, uses `node:fs`) breaks bundling for
 * `instrumentation-client.ts`'s browser chunk. Routing them through this
 * Context/Layer object (as the server ops below do) would force them into
 * the same module graph as `captureServerEvent`, which does import
 * posthog-node. They're still real Effects (`Effect.withSpan`) — just called
 * directly from `instrumentation-client.ts` instead of through
 * `AnalyticsLayer`/`runtime.ts`. Same exception class as observability's
 * init*Sentry ops (see layer/observability.layer.ts).
 */
export interface Analytics {
  readonly captureServerEvent: (
    input: EventMessage
  ) => Effect.Effect<void, Config.ConfigError, never>;

  readonly groupIdentifyServer: (
    input: GroupIdentifyMessage
  ) => Effect.Effect<void, Config.ConfigError, never>;

  readonly identifyServerUser: (
    input: IdentifyMessage
  ) => Effect.Effect<void, Config.ConfigError, never>;

  readonly isFeatureEnabled: (
    key: string,
    distinctId: string
  ) => Effect.Effect<boolean | undefined, Config.ConfigError, never>;
}

export const AnalyticsLayerContext = Context.Service<Analytics>("Analytics");

export const AnalyticsLayer = makeTapLayerFacade(AnalyticsLayerContext);
