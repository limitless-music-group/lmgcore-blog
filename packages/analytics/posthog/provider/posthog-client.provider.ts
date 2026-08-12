import { Effect } from "effect";
import posthogJs from "posthog-js";

/**
 * posthog-js has no per-instance construction — it's a module-scope
 * singleton you call `.init()` on. The "provider" here just resolves it.
 *
 * Kept in its own file, separate from the server provider: importing
 * `posthog-node` (Node-only, uses `node:fs`) into this file — even unused —
 * would break bundling for `instrumentation-client.ts`'s browser chunk. Same
 * class of bug as observability's `init-client-sentry.effect.ts` pulling
 * client-only Sentry APIs into edge/server bundles.
 */
export const PostHogClientProvider = Effect.sync(() => posthogJs);
