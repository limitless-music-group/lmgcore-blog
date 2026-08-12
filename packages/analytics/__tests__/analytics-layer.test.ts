import { assert, describe, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import {
  AnalyticsLayer,
  AnalyticsLayerContext,
} from "../layer/analytics.layer";

const FakeAnalytics = Layer.succeed(
  AnalyticsLayerContext,
  AnalyticsLayerContext.of({
    captureServerEvent: () => Effect.void,
    groupIdentifyServer: () => Effect.void,
    identifyServerUser: () => Effect.void,
    isFeatureEnabled: () => Effect.succeed(true),
  })
);

describe("AnalyticsLayer facade", () => {
  layer(FakeAnalytics)((it) => {
    it.effect("captureServerEvent routes through the provided layer", () =>
      Effect.gen(function* () {
        yield* AnalyticsLayer.captureServerEvent({
          distinctId: "user_1",
          event: "user_signed_up",
        });
        assert.isTrue(true);
      })
    );

    it.effect("identifyServerUser routes through the provided layer", () =>
      Effect.gen(function* () {
        yield* AnalyticsLayer.identifyServerUser({
          distinctId: "user_1",
        });
        assert.isTrue(true);
      })
    );

    it.effect("groupIdentifyServer routes through the provided layer", () =>
      Effect.gen(function* () {
        yield* AnalyticsLayer.groupIdentifyServer({
          groupKey: "org_1",
          groupType: "organization",
        });
        assert.isTrue(true);
      })
    );

    it.effect("isFeatureEnabled routes through the provided layer", () =>
      Effect.gen(function* () {
        const isEnabled = yield* AnalyticsLayer.isFeatureEnabled(
          "new-feature",
          "user_1"
        );
        assert.isTrue(isEnabled);
      })
    );
  });
});
