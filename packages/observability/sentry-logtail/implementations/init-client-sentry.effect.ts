import {
  consoleLoggingIntegration,
  init,
  replayIntegration,
} from "@sentry/nextjs";
import { Effect, pipe } from "effect";
import { ObservabilityError } from "../../errors/observability.error";
import { ObservabilityClientConfig } from "../provider/sentry-logtail.provider";

export const initClientSentry = () =>
  pipe(
    ObservabilityClientConfig,
    Effect.flatMap((env) =>
      Effect.try({
        catch: (cause) => new ObservabilityError({ cause }),
        try: () => {
          init({
            debug: false,
            dsn: env.NEXT_PUBLIC_SENTRY_DSN,
            enableLogs: true,
            integrations: [
              replayIntegration({
                blockAllMedia: true,
                maskAllText: true,
              }),
              consoleLoggingIntegration({
                levels: ["log", "error", "warn", "debug"],
              }),
            ],
            replaysOnErrorSampleRate: 1,
            replaysSessionSampleRate: 0.1,
            tracesSampleRate: 1,
          });
        },
      })
    ),
    Effect.withSpan("init-client-sentry")
  );
