import { Effect } from "effect";
import { initEdgeSentry } from "./init-edge-sentry.effect";
import { initServerSentry } from "./init-sentry-server.effect";

export const initInstrumentation = () =>
  Effect.gen(function* () {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      yield* initServerSentry();
    }
    if (process.env.NEXT_RUNTIME === "edge") {
      yield* initEdgeSentry();
    }
  }).pipe(Effect.withSpan("init-instrumentation"));
