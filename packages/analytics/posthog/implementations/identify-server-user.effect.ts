import { Effect, pipe } from "effect";
import type { IdentifyMessage } from "posthog-node";
import { PostHogServerProvider } from "../provider/posthog-server.provider";

export const identifyServerUser = (input: IdentifyMessage) =>
  pipe(
    PostHogServerProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        posthog?.identify(input);
      })
    ),
    Effect.withSpan("identify-server-user", {
      attributes: { distinctId: input.distinctId },
    })
  );
