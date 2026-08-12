import { Effect, pipe } from "effect";
import { PostHogClientProvider } from "../provider/posthog-client.provider";

export const identifyClient = (
  distinctId: string,
  properties?: Record<string, unknown>
) =>
  pipe(
    PostHogClientProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        posthog.identify(distinctId, properties);
      })
    ),
    Effect.withSpan("identify-client", { attributes: { distinctId } })
  );
