import { withSentryConfig } from "@sentry/nextjs";
import { Effect, pipe } from "effect";
import { ObservabilityServerConfig } from "../provider/sentry-logtail.provider";

export const sentryNextConfig = (sourceConfig: object) =>
  pipe(
    ObservabilityServerConfig,
    Effect.map((env) => {
      const configWithTranspile = {
        ...sourceConfig,
        transpilePackages: ["@sentry/nextjs"],
      };
      return withSentryConfig(configWithTranspile, {
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        // Only print logs for uploading source maps in CI
        silent: !process.env.CI,
        // Route browser requests through a Next rewrite to dodge ad-blockers
        tunnelRoute: "/monitoring",
        webpack: {
          automaticVercelMonitors: true,
          treeshake: { removeDebugLogging: true },
        },
        // Upload a larger set of source maps for prettier stack traces
        widenClientFileUpload: true,
      });
    }),
    Effect.withSpan("sentry-next-config")
  );
