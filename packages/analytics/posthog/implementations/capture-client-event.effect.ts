import { Effect, pipe } from "effect";
import { PostHogClientProvider } from "../provider/posthog-client.provider";

export const captureClientEvent = (
  event: string,
  properties?: Record<string, unknown>
) =>
  pipe(
    PostHogClientProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        posthog.capture(event, properties);
      })
    ),
    Effect.withSpan("capture-client-event", { attributes: { event } })
  );
