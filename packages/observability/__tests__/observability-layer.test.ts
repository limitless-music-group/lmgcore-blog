import { assert, describe, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import {
  ObservabilityLayer,
  ObservabilityLayerContext,
} from "../layer/observability.layer";

const FakeObservability = Layer.succeed(
  ObservabilityLayerContext,
  ObservabilityLayerContext.of({
    captureException: () => Effect.succeed(undefined),
    logError: () => Effect.succeed(undefined),
    loggingNextConfig: (sourceConfig: object) =>
      Effect.succeed({ ...sourceConfig, fakeLogging: true }),
    logInfo: () => Effect.succeed(undefined),
    logWarn: () => Effect.succeed(undefined),
    parseError: () => Effect.succeed("fake message"),
    sentryNextConfig: (sourceConfig: object) =>
      Effect.succeed({ ...sourceConfig, fakeSentry: true }),
  })
);

describe("ObservabilityLayer facade", () => {
  layer(FakeObservability)((it) => {
    it.effect("logInfo routes through the provided Observability layer", () =>
      Effect.gen(function* () {
        yield* ObservabilityLayer.logInfo("hello", { a: 1 });
      })
    );

    it.effect(
      "parseError routes through the provided Observability layer",
      () =>
        Effect.gen(function* () {
          const message = yield* ObservabilityLayer.parseError(new Error("x"));
          assert.strictEqual(message, "fake message");
        })
    );

    it.effect(
      "sentryNextConfig routes through the provided Observability layer",
      () =>
        Effect.gen(function* () {
          const config = yield* ObservabilityLayer.sentryNextConfig({
            base: true,
          });
          assert.deepStrictEqual(config, { base: true, fakeSentry: true });
        })
    );

    it.effect(
      "loggingNextConfig routes through the provided Observability layer",
      () =>
        Effect.gen(function* () {
          const config = yield* ObservabilityLayer.loggingNextConfig({
            base: true,
          });
          assert.deepStrictEqual(config, { base: true, fakeLogging: true });
        })
    );
  });
});
