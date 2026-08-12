import { env } from "@/env";
import { Effect } from "effect";
import { PostHog } from "posthog-node";

/**
 * PostHog is an optional integration (unlike Stripe/WorkOS), so missing/blank
 * keys resolve to `undefined` rather than failing — every server op checks
 * for a defined client and no-ops when absent, same as the pre-restructure
 * `server.ts`.
 */
export const PostHogServerProvider = Effect.sync(() => {
  const { NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST } = env;

  if (!(NEXT_PUBLIC_POSTHOG_KEY && NEXT_PUBLIC_POSTHOG_HOST)) {
    return;
  }

  return new PostHog(NEXT_PUBLIC_POSTHOG_KEY, {
    // Don't batch events and flush immediately — we're running in a
    // serverless environment.
    flushAt: 1,
    flushInterval: 0,
    host: NEXT_PUBLIC_POSTHOG_HOST,
  });
});
