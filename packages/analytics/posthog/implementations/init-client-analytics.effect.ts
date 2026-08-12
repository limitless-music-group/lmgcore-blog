import { Effect, pipe } from "effect";
import { PostHogClientProvider } from "../provider/posthog-client.provider";
import { env } from "@/env";

export const initClientAnalytics = () =>
  pipe(
    PostHogClientProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        const { NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST } = env;

        if (!(NEXT_PUBLIC_POSTHOG_KEY && NEXT_PUBLIC_POSTHOG_HOST)) {
          return;
        }

        posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: NEXT_PUBLIC_POSTHOG_HOST,
          defaults: "2025-05-24",
        });
      })
    ),
    Effect.withSpan("init-client-analytics")
  );
