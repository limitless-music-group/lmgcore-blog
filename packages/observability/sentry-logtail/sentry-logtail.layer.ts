import { Layer } from "effect";
import { ObservabilityLayerContext } from "../layer/observability.layer";
import { captureSentryException } from "./implementations/capture-sentry-exception.effect";
import { logError } from "./implementations/log-error.effect";
import { logInfo } from "./implementations/log-info.effect";
import { logWarn } from "./implementations/log-warn.effect";
import { loggingNextConfig } from "./implementations/logging-next-config.effect";
import { parseError } from "./implementations/parse-error.effect";
import { sentryNextConfig } from "./implementations/sentry-next-config.effect";

export const SentryLogtailObservabilityLayerLive = Layer.succeed(
  ObservabilityLayerContext,
  ObservabilityLayerContext.of({
    captureException: captureSentryException,
    logError,
    loggingNextConfig,
    logInfo,
    logWarn,
    parseError,
    sentryNextConfig,
  })
);
