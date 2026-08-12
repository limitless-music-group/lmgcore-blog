# @/packages/analytics

PostHog (client + server) behind an Effect port/adapter, plus the raw
Vercel/Google-Analytics components mounted directly in app layouts.

## What it does

- Server-side event capture/identify/group (posthog-node) — `captureServerEvent`,
  `identifyServerUser`, `groupIdentifyServer`. Currently used for
  `user_signed_up` (`packages/workflows/functions/organizations/provision.tsx`)
  and `user_signed_in` (`apps/app/app/(auth)/router/route.ts`).
- Server-side feature-flag evaluation — `isFeatureEnabled(key, distinctId)`,
  via posthog-node's non-deprecated `evaluateFlags` (not the deprecated
  single-flag `isFeatureEnabled` client method, despite the matching name).
  Resolves to `undefined` — not a failure — on a missing client or a network
  error, so a PostHog outage falls back to the caller's own default rather
  than crashing. Used by `packages/feature-flags/lib/create-flag.ts` to let a
  Vercel Flags SDK flag delegate its `decide()` to a PostHog-side rollout.
- Client-side init/capture/identify (posthog-js) — `initClientAnalytics`,
  `captureClientEvent`, `identifyClient`. Only `initClientAnalytics` has a
  current caller (`instrumentation-client.ts`); the other two exist for
  parity with PostHog's API surface, per an explicit scope decision to build
  the full port even where nothing calls it yet.
- Mounts `<VercelAnalytics>`/`<SpeedInsights>`/`<GoogleAnalytics>`
  (`provider.tsx`) — not PostHog, untouched by this redesign.
- Every server op fails into `AnalyticsError`/`ConfigError.ConfigError`, not a
  bare `Error`. Every op carries an `Effect.withSpan` for tracing.

## Architecture

```txt
types.ts                          re-exports posthog-node's EventMessage/
                                   IdentifyMessage/GroupIdentifyMessage
env-vars.ts                       AnalyticsEnvVars — all three vars are
                                   NEXT_PUBLIC_*, no server/client secret split
errors/                           AnalyticsError + barrel

layer/analytics.layer.ts          THE PORT — captureServerEvent/
                                   identifyServerUser/groupIdentifyServer/
                                   isFeatureEnabled only (see "Two exceptions"
                                   below)

posthog/                          THE ADAPTER
  provider/posthog-client.provider.ts   resolves the posthog-js singleton
  provider/posthog-server.provider.ts   builds PostHog | undefined from env
  implementations/*.effect.ts           one file per op
  implementations/index.ts              barrel — server ops only, see below
  posthog-analytics.layer.ts            PostHogAnalyticsLayerLive

runtime.ts                        ManagedRuntime for the 4 server ops only
```

## Two exceptions to the standard shape

**Client ops bypass the port.** `captureClientEvent`, `identifyClient`, and
`initClientAnalytics` are NOT in the `Analytics` interface, and are not
barrelled in `posthog/implementations/index.ts`. They're called directly —
`instrumentation-client.ts` imports `initClientAnalytics` straight from
`posthog/implementations/init-client-analytics.effect`, never touching
`AnalyticsLayer`/`runtime.ts`.

Why: `posthog-server.provider.ts` imports `posthog-node`, which is Node-only
(uses `node:fs`). If the client ops routed through the same `Context.Tag`/
`Layer` object as the server ops (as `packages/README.md` prescribes by
default), `instrumentation-client.ts`'s browser bundle would transitively
import `posthog-node` just by importing the shared port/runtime — and fail to
build (`the chunking context does not support external modules (request:
node:fs)`). This is the exact bug `@/packages/observability` hit with
`initClientSentry`'s `Sentry.replayIntegration` leaking into edge/server
bundles via a shared `runtime.ts` — see that package's README/layer doc
comment for the fuller writeup. Same fix here: split the provider file in two
(`posthog-client.provider.ts` has zero `posthog-node` import) and call the
client ops directly from their one caller instead of through a shared Layer.

**Combined adapter, not one-per-backend.** `posthog-client.provider.ts` and
`posthog-server.provider.ts` live under one `posthog/` directory rather than
two separate backend directories, because every real caller today treats
client-init and server-capture as one product concept ("PostHog"), not
independently swappable backends — same reasoning as observability's combined
`sentry-logtail/` adapter.

**No-op when unconfigured.** `posthog-server.provider.ts` resolves to
`PostHog | undefined` rather than failing when `NEXT_PUBLIC_POSTHOG_KEY`/
`HOST` are unset — every server op checks for a defined client and resolves
to `Effect.void` when absent. PostHog is an optional integration (local dev,
blog previews may run without it), unlike Stripe/WorkOS which are hard
requirements the app can't function without.

## Using it

```ts
import { AnalyticsLayer } from "@/packages/analytics/layer/analytics.layer";
import { PostHogAnalyticsLayerLive } from "@/packages/analytics/posthog/posthog-analytics.layer";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  yield* AnalyticsLayer.captureServerEvent({
    distinctId: userId,
    event: "user_signed_up",
    properties: { organizationId },
  });
}).pipe(Effect.provide(PostHogAnalyticsLayerLive));

await Effect.runPromise(program);
```

For the client ops, import and call directly — no Layer to provide:

```ts
import { initClientAnalytics } from "@/packages/analytics/posthog/implementations/init-client-analytics.effect";
import { Effect } from "effect";

Effect.runSync(initClientAnalytics());
```

## Testing

`vitest.config.ts` merges root `vitest.shared.ts` with
`sequence.concurrent: false` (tests stub `process.env` and spy on
`globalThis.fetch`/the posthog-js singleton as shared mutable state).

- `test/env-vars.test.ts` — `loadAnalyticsEnv` against real `Config`
  resolution.
- `test/analytics-layer.test.ts` — the port's facade wiring against a fake
  `Analytics` layer (server ops only).
- `test/posthog-implementations.test.ts` — server ops exercised through the
  real `PostHogAnalyticsLayerLive` down to a faked `globalThis.fetch`
  (posthog-node batches over HTTP via `@posthog/core`); `capture`/`identify`/
  `groupIdentify` are fire-and-forget (enqueue-then-async-flush), so
  assertions poll with `vi.waitFor` rather than checking synchronously.
  Client ops are tested by spying the posthog-js singleton's own
  `init`/`capture`/`identify` methods directly (no port involved, per the
  exception above).

Run with `bun run test` (or `test:watch`) from this package, or `turbo test`
from the repo root.
