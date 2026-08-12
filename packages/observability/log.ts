import { ObservabilityLayer } from "./layer/observability.layer";
import { observabilityRuntime } from "./runtime";

/**
 * Thin, behavior-preserving entry point over the Observability port/adapter
 * (see layer/observability.layer.ts + sentry-logtail/) — same shape as
 * packages/security/index.ts. Every existing `import { log } from
 * "@/packages/observability/log"` call site keeps working unchanged.
 */
export const log = {
  error: (message: string, meta?: Record<string, unknown>) =>
    observabilityRuntime.runSync(ObservabilityLayer.logError(message, meta)),
  info: (message: string, meta?: Record<string, unknown>) =>
    observabilityRuntime.runSync(ObservabilityLayer.logInfo(message, meta)),
  warn: (message: string, meta?: Record<string, unknown>) =>
    observabilityRuntime.runSync(ObservabilityLayer.logWarn(message, meta)),
};
