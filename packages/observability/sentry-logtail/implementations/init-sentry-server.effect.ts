import { consoleLoggingIntegration, init } from "@sentry/nextjs";
import { Effect, pipe } from "effect";
import { ObservabilityError } from "../../errors/observability.error";
import { ObservabilityClientConfig } from "../provider/sentry-logtail.provider";

export const initServerSentry = () =>
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
            includeLocalVariables: true,
            integrations: [
              consoleLoggingIntegration({
                levels: ["log", "error", "warn"],
              }),
            ],
            tracesSampleRate: 1,
          });
        },
      })
    ),
    Effect.withSpan("init-server-sentry")
  );
