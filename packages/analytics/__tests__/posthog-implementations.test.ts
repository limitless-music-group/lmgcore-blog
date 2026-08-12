import {
  afterEach,
  assert,
  beforeEach,
  describe,
  it,
  vi,
} from "@effect/vitest";
import { Effect } from "effect";
import posthogJs from "posthog-js";
import { AnalyticsLayer } from "../layer/analytics.layer";
import { captureClientEvent } from "../posthog/implementations/capture-client-event.effect";
import { identifyClient } from "../posthog/implementations/identify-client.effect";
import { PostHogAnalyticsLayerLive } from "../posthog/posthog-analytics.layer";
import { stubAnalyticsEnv } from "./support/stub-analytics-env";

describe("PostHogAnalyticsLayerLive — server ops (real PostHog node client, faked fetch)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  // `capture`/`identify`/`groupIdentify` are fire-and-forget: they enqueue and
  // return before the `flushAt: 1` auto-flush's fetch call actually fires, so
  // assertions need to wait for it rather than checking synchronously.
  const waitForFetchCall = () =>
    Effect.promise(() =>
      vi.waitFor(
        () => {
          if (fetchSpy.mock.calls.length === 0) {
            throw new Error("expected a fetch call");
          }
        },
        { interval: 10, timeout: 1000 }
      )
    );

  beforeEach(() => {
    stubAnalyticsEnv();
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ status: 1 }), { status: 200 })
      );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.effect("captureServerEvent posts through the (faked) network", () =>
    Effect.gen(function* () {
      yield* AnalyticsLayer.captureServerEvent({
        distinctId: "user_1",
        event: "user_signed_up",
        properties: { organizationId: "org_1" },
      }).pipe(Effect.provide(PostHogAnalyticsLayerLive));

      yield* waitForFetchCall();
      assert.isTrue(fetchSpy.mock.calls.length >= 1);
      const [url] = fetchSpy.mock.calls[0] as [string];
      assert.isTrue(url.includes("posthog.test"));
    })
  );

  it.effect("identifyServerUser posts through the (faked) network", () =>
    Effect.gen(function* () {
      yield* AnalyticsLayer.identifyServerUser({
        distinctId: "user_1",
        properties: { plan: "pro" },
      }).pipe(Effect.provide(PostHogAnalyticsLayerLive));

      yield* waitForFetchCall();
      assert.isTrue(fetchSpy.mock.calls.length >= 1);
    })
  );

  it.effect("groupIdentifyServer posts through the (faked) network", () =>
    Effect.gen(function* () {
      yield* AnalyticsLayer.groupIdentifyServer({
        groupKey: "org_1",
        groupType: "organization",
        properties: { name: "Acme" },
      }).pipe(Effect.provide(PostHogAnalyticsLayerLive));

      yield* waitForFetchCall();
      assert.isTrue(fetchSpy.mock.calls.length >= 1);
    })
  );

  it.effect(
    "no-ops (no network call) when PostHog keys are un-configured",
    () =>
      Effect.gen(function* () {
        vi.unstubAllEnvs();
        vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
        vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");
        vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");

        yield* AnalyticsLayer.captureServerEvent({
          distinctId: "user_1",
          event: "user_signed_up",
        }).pipe(Effect.provide(PostHogAnalyticsLayerLive));

        assert.strictEqual(fetchSpy.mock.calls.length, 0);
      })
  );
});

// captureClientEvent/identifyClient/initClientAnalytics are NOT part of the
// Analytics port (see the doc comment on `Analytics` in
// layer/analytics.layer.ts) — called directly, not through
// PostHogAnalyticsLayerLive.
describe("init/capture/identifyClient (called directly, not through the port)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // AnalyticsClientEnvVars snapshots `process.env.NEXT_PUBLIC_*` into literal
  // member expressions at MODULE IMPORT time (see env-vars.ts's
  // `clientEnvSnapshot` comment), so `vi.stubEnv` from inside this test can't
  // reach it via the file's static `initClientAnalytics` import — that
  // snapshot was already taken when the file loaded. Reset the module
  // registry and dynamically re-import both `init-client-analytics` and
  // `posthog-js` (so the spy targets the same instance the fresh module
  // calls) after stubbing env.
  it.effect("initClientAnalytics calls posthog-js's init", () =>
    Effect.gen(function* () {
      stubAnalyticsEnv();
      vi.resetModules();
      const [{ initClientAnalytics }, { default: freshPosthogJs }] =
        yield* Effect.promise(() =>
          Promise.all([
            import("../posthog/implementations/init-client-analytics.effect"),
            import("posthog-js"),
          ])
        );
      const initSpy = vi
        .spyOn(freshPosthogJs, "init")
        .mockImplementation(() => freshPosthogJs);

      yield* initClientAnalytics();

      assert.strictEqual(initSpy.mock.calls.length, 1);
      const [key, options] = initSpy.mock.calls[0] as [
        string,
        { api_host: string },
      ];
      assert.strictEqual(key, "phc_test_123");
      assert.strictEqual(options.api_host, "https://posthog.test");
      vi.unstubAllEnvs();
      vi.resetModules();
    })
  );

  it.effect("captureClientEvent calls posthog-js's capture", () =>
    Effect.gen(function* () {
      const captureSpy = vi
        .spyOn(posthogJs, "capture")
        .mockImplementation(() => undefined);

      yield* captureClientEvent("cta_clicked", { cta: "pricing" });

      assert.strictEqual(captureSpy.mock.calls.length, 1);
      assert.deepStrictEqual(captureSpy.mock.calls[0], [
        "cta_clicked",
        { cta: "pricing" },
      ]);
    })
  );

  it.effect("identifyClient calls posthog-js's identify", () =>
    Effect.gen(function* () {
      const identifySpy = vi
        .spyOn(posthogJs, "identify")
        .mockImplementation(() => undefined);

      yield* identifyClient("user_1", { plan: "pro" });

      assert.strictEqual(identifySpy.mock.calls.length, 1);
      assert.deepStrictEqual(identifySpy.mock.calls[0], [
        "user_1",
        { plan: "pro" },
      ]);
    })
  );
});
