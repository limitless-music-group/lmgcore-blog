import { Effect, pipe } from "effect";
import type { GroupIdentifyMessage } from "posthog-node";
import { PostHogServerProvider } from "../provider/posthog-server.provider";

export const groupIdentifyServer = (input: GroupIdentifyMessage) =>
  pipe(
    PostHogServerProvider,
    Effect.flatMap((posthog) =>
      Effect.sync(() => {
        posthog?.groupIdentify(input);
      })
    ),
    Effect.withSpan("group-identify-server", {
      attributes: { groupKey: input.groupKey, groupType: input.groupType },
    })
  );
