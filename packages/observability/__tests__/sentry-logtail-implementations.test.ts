import { afterEach, assert, beforeEach, describe, it } from "@effect/vitest";
import { Effect } from "effect";
// See packages/security/__tests__/secure.test.ts for why `vi` must come from
// "vitest" directly, not @effect/vitest — @vitest/mocker's hoisting
// transform needs the literal specifier to avoid a TDZ crash on
// vi.mock/vi.hoisted.
import { vi } from "vitest";
import type { Observability } from "../layer/observability.layer";
import { ObservabilityLayer } from "../layer/observability.layer";
import { SentryLogtailObservabilityLayerLive } from "../sentry-logtail/sentry-logtail.layer";
import { stubObservabilityEnv } from "./support/stub-observability-env";

// `@sentry/nextjs`'s real module pulls in browser/edge bundles
// (`@opentelemetry/sdk-trace-web`) that aren't installed in this Node test
// env, so `importOriginal` itself fails — this is a fully manual mock
// listing exactly the exports the observability package touches (confirmed
// via grep across sentry-logtail/implementations/ + the bridge modules), not
// a partial mock over the real module. `@sentry/nextjs`'s ESM exports also
// aren't configurable, so `vi.spyOn` on the namespace isn't an option either
// way ("Module namespace is not configurable in ESM").
const {
  init,
  captureException,
  captureRequestError,
  captureRouterTransitionStart,
  consoleLoggingIntegration,
  replayIntegration,
  withSentryConfig,
  withLogtail,
} = vi.hoisted(() => ({
  captureException: vi.fn(),
  captureRequestError: vi.fn(),
  captureRouterTransitionStart: vi.fn(),
  consoleLoggingIntegration: vi.fn(() => ({ name: "consoleLogging" })),
  init: vi.fn(),
  replayIntegration: vi.fn(() => ({ name: "replay" })),
  withLogtail: vi.fn((config: object) => ({ ...config, logtail: true })),
  withSentryConfig: vi.fn(
    (config: object, _sentryOptions?: { org?: string; project?: string }) =>
      config
  ),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException,
  captureRequestError,
  captureRouterTransitionStart,
  consoleLoggingIntegration,
  init,
  replayIntegration,
  withSentryConfig,
}));
// `resolveLogger()` falls back to `console` outside NODE_ENV=production, but
// `log` still needs to exist as a real export for the import binding.
vi.mock("@logtail/next", () => ({ log: console, withLogtail }));

const run = <A, E>(effect: Effect.Effect<A, E, Observability>) =>
  effect.pipe(Effect.provide(SentryLogtailObservabilityLayerLive));

beforeEach(() => {
  stubObservabilityEnv();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

// initClientSentry/initServerSentry/initEdgeSentry/initInstrumentation are
// NOT part of the Observability port (see the doc comment on `Observability`
// in layer/observability.layer.ts) — called directly, not through
// SentryLogtailObservabilityLayerLive. Each internally reads
// ObservabilityClientConfig/ObservabilityServerConfig, which snapshot
// `process.env.NEXT_PUBLIC_*` into literal member expressions at MODULE
// IMPORT time (see env-vars.ts) so Next.js can statically inline them
// client-side — so a static top-of-file import here would freeze the
// snapshot before `beforeEach`'s `stubObservabilityEnv()` ever runs. Each
// test below resets the module registry and dynamically re-imports after
// stubbing, same pattern as test/env-vars.test.ts.
describe("init*Sentry (called directly, not through the port)", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it.effect("initClientSentry binds through to Sentry.init", () =>
    Effect.gen(function* () {
      vi.resetModules();
      const { initClientSentry } = yield* Effect.promise(
        () =>
          import("../sentry-logtail/implementations/init-client-sentry.effect")
      );
      yield* initClientSentry();
      assert.strictEqual(init.mock.calls.length, 1);
      assert.strictEqual(
        init.mock.calls[0]?.[0]?.dsn,
        "https://public@sentry.example.com/1"
      );
    })
  );

  it.effect("initServerSentry sets includeLocalVariables", () =>
    Effect.gen(function* () {
      vi.resetModules();
      const { initServerSentry } = yield* Effect.promise(
        () =>
          import("../sentry-logtail/implementations/init-sentry-server.effect")
      );
      yield* initServerSentry();
      assert.isTrue(init.mock.calls[0]?.[0]?.includeLocalVariables);
    })
  );

  it.effect("initEdgeSentry omits includeLocalVariables/replay", () =>
    Effect.gen(function* () {
      vi.resetModules();
      const { initEdgeSentry } = yield* Effect.promise(
        () =>
          import("../sentry-logtail/implementations/init-edge-sentry.effect")
      );
      yield* initEdgeSentry();
      const options = init.mock.calls[0]?.[0];
      assert.isUndefined(options?.includeLocalVariables);
      assert.isUndefined(options?.replaysOnErrorSampleRate);
    })
  );

  it.effect(
    "initInstrumentation initializes the server SDK on the nodejs runtime",
    () =>
      Effect.gen(function* () {
        vi.stubEnv("NEXT_RUNTIME", "nodejs");
        vi.resetModules();
        const { initInstrumentation } = yield* Effect.promise(
          () =>
            import(
              "../sentry-logtail/implementations/init-instrumentation.effect"
            )
        );
        yield* initInstrumentation();
        assert.strictEqual(init.mock.calls.length, 1);
        assert.isTrue(init.mock.calls[0]?.[0]?.includeLocalVariables);
      })
  );

  it.effect(
    "initInstrumentation initializes the edge SDK on the edge runtime",
    () =>
      Effect.gen(function* () {
        vi.stubEnv("NEXT_RUNTIME", "edge");
        vi.resetModules();
        const { initInstrumentation } = yield* Effect.promise(
          () =>
            import(
              "../sentry-logtail/implementations/init-instrumentation.effect"
            )
        );
        yield* initInstrumentation();
        assert.strictEqual(init.mock.calls.length, 1);
        assert.isUndefined(init.mock.calls[0]?.[0]?.includeLocalVariables);
      })
  );
});

describe("SentryLogtailObservabilityLayerLive (adapter wiring)", () => {
  it.effect("logInfo/logWarn/logError reach the resolved logger", () =>
    Effect.gen(function* () {
      const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {
        // no-op
      });
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
        // no-op
      });
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // no-op
      });

      yield* run(ObservabilityLayer.logInfo("info message", { a: 1 }));
      yield* run(ObservabilityLayer.logWarn("warn message"));
      yield* run(ObservabilityLayer.logError("error message"));

      assert.deepStrictEqual(infoSpy.mock.calls[0], ["info message", { a: 1 }]);
      assert.strictEqual(warnSpy.mock.calls[0]?.[0], "warn message");
      assert.strictEqual(errorSpy.mock.calls[0]?.[0], "error message");
      infoSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    })
  );

  it.effect("captureException forwards to Sentry.captureException", () =>
    Effect.gen(function* () {
      const error = new Error("boom");
      yield* run(ObservabilityLayer.captureException(error));
      assert.strictEqual(captureException.mock.calls[0]?.[0], error);
    })
  );

  it.effect(
    "parseError captures the exception, logs it, and returns the message",
    () =>
      Effect.gen(function* () {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
          // no-op
        });

        const message = yield* run(
          ObservabilityLayer.parseError(new Error("bad request"))
        );

        assert.strictEqual(message, "bad request");
        assert.strictEqual(captureException.mock.calls.length, 1);
        assert.strictEqual(
          errorSpy.mock.calls[0]?.[0],
          "Parsing error: bad request"
        );
        errorSpy.mockRestore();
      })
  );

  it.effect("parseError falls back to String() for a non-Error value", () =>
    Effect.gen(function* () {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // no-op
      });
      const message = yield* run(ObservabilityLayer.parseError("oops"));
      assert.strictEqual(message, "oops");
      errorSpy.mockRestore();
    })
  );

  it.effect("loggingNextConfig binds through to withLogtail", () =>
    Effect.gen(function* () {
      const config = yield* run(
        ObservabilityLayer.loggingNextConfig({ base: true })
      );
      assert.deepStrictEqual(config, { base: true, logtail: true });
      assert.deepStrictEqual(withLogtail.mock.calls[0]?.[0], { base: true });
    })
  );

  it.effect("sentryNextConfig reads SENTRY_ORG/SENTRY_PROJECT from env", () =>
    Effect.gen(function* () {
      yield* run(ObservabilityLayer.sentryNextConfig({ base: true }));

      const [, sentryOptions] = withSentryConfig.mock.calls[0] ?? [];
      assert.strictEqual(sentryOptions?.org, "test-org");
      assert.strictEqual(sentryOptions?.project, "test-project");
    })
  );
});
