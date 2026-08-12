import { Effect, pipe } from "effect";
import { PostHogServerProvider } from "../provider/posthog-server.provider";

/**
 * Network failures resolve to `undefined` (same as the no-client case)
 * rather than failing the Effect — a PostHog outage should never break the
 * flag's own `decide()` call, only fall back to its `defaultValue`.
 */
export const isFeatureEnabled = (key: string, distinctId: string) =>
  pipe(
    PostHogServerProvider,
    Effect.flatMap((posthog) =>
      Effect.promise(async () => {
        if (!posthog) {
          return;
        }
        try {
          const flags = await posthog.evaluateFlags(distinctId, {
            flagKeys: [key],
          });
          return flags.isEnabled(key);
        } catch {
          // Swallow — falls back to the flag's own defaultValue, per the doc comment above.
        }
      })
    ),
    Effect.withSpan("is-feature-enabled", { attributes: { key } })
  );
