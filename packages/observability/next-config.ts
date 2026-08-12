import { ObservabilityLayer } from "./layer/observability.layer";
import { observabilityRuntime } from "./runtime";

/** Thin bridge over ObservabilityLayer.sentryNextConfig — see log.ts. */
export const withSentry = (sourceConfig: object): object =>
  observabilityRuntime.runSync(
    ObservabilityLayer.sentryNextConfig(sourceConfig)
  );

/** Thin bridge over ObservabilityLayer.loggingNextConfig — see log.ts. */
export const withLogging = (config: object): object =>
  observabilityRuntime.runSync(ObservabilityLayer.loggingNextConfig(config));
