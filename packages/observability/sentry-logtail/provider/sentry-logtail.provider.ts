import { env } from "../../../../env";
import { Effect } from "effect";

/**
 * Unlike storage's R2 provider, there's no SDK client instance to construct
 * here — Sentry and Logtail are both imported as static modules. This
 * "provider" resolves the env config bundle implementations read instead.
 *
 * Both configs wrap the same `keys()` call — `@t3-oss/env-core` already
 * does the client/server split the old hand-rolled version needed: its
 * `isServer` check (`typeof window === "undefined"`) skips validating
 * server-only fields entirely when actually running in a browser, and
 * throws only if browser code tries to *read* a server field. So `keys()`
 * is safe to call from any of the runtimes below (Node, edge, browser) —
 * keeping two names just preserves each call site's existing import.
 */
export const ObservabilityServerConfig = Effect.sync(() => env);

export const ObservabilityClientConfig = Effect.sync(() => env);
