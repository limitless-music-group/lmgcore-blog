import { Effect, pipe } from "effect";
import type { EventMessage } from "posthog-node";
import { PostHogServerProvider } from "../provider/posthog-server.provider";

export const captureServerEvent = (input: EventMessage) =>
  pipe(
    PostHogServerProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        posthog?.capture(input);
      })
    ),
    Effect.withSpan("capture-server-event", {
      attributes: { event: input.event },
    })
  );
