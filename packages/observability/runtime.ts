import { ManagedRuntime } from "effect";
import { SentryLogtailObservabilityLayerLive } from "./sentry-logtail/sentry-logtail.layer";

/**
 * Same role as `@/packages/database`'s `withDb`/`withTx` — a ManagedRuntime
 * built once, so the plain (non-Effect) call sites bridged by `log.ts`,
 * `error.ts`, and `next-config.ts` don't rebuild the layer graph on every
 * call. `client.ts`/`server.ts`/`edge.ts`/`instrumentation.ts` deliberately
 * do NOT go through this runtime — see the doc comment on `Observability` in
 * `layer/observability.layer.ts` for why. Every op in this package's adapter
 * is synchronous (Sentry/Logtail calls are sync or fire-and-forget), so
 * `runSync` is always safe here — nothing suspends on an async boundary.
 */
export const observabilityRuntime = ManagedRuntime.make(
  SentryLogtailObservabilityLayerLive
);
