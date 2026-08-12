import { ObservabilityLayer } from "./layer/observability.layer";
import { observabilityRuntime } from "./runtime";

/** Thin bridge over ObservabilityLayer.parseError — see log.ts. */
export const parseError = (error: unknown): string =>
  observabilityRuntime.runSync(ObservabilityLayer.parseError(error));
