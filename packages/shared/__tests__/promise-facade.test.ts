import { assert, describe, it } from "@effect/vitest";
import { Context, Data, Effect, Layer } from "effect";
import { makePromiseFacade } from "../effects/promise-facade.effect";
import { makeTapLayerFacade } from "../effects/tap-layer-facade.effect";

class FakeError extends Data.TaggedError("FakeError")<{
  message: string;
}> {}

interface FakeService {
  readonly greeting: string;
}
const FakeServiceTag = Context.Service<FakeService>("FakeService");
const FakeServiceLive = Layer.succeed(FakeServiceTag, { greeting: "hi" });

/** Mirrors the shape every real `<Capability>Layer` (Auth, Payments, Email,
 * Storage) has: plain functions returning an Effect that requires a service
 * only the Live layer supplies. */
const fakeFacade = {
  fail: (message: string) =>
    Effect.gen(function* () {
      // Still resolves the service on the failing path — proves `provide`
      // ran even when the operation itself fails.
      yield* FakeServiceTag;
      return yield* Effect.fail(new FakeError({ message }));
    }),
  greet: (name: string) =>
    Effect.gen(function* () {
      const { greeting } = yield* FakeServiceTag;
      return `${greeting}, ${name}`;
    }),
};

/**
 * `makePromiseFacade` is what every `packages/<capability>/promise.ts`
 * (auth, payments, email, storage) is built from — one implementation
 * covers all four, so testing it directly here covers the seam every real
 * router call site now depends on, without needing real WorkOS/Stripe/
 * Resend/R2 credentials.
 */
describe("makePromiseFacade", () => {
  const facade = makePromiseFacade(fakeFacade, FakeServiceLive);

  it("resolves the plain success value, with the live layer provided", async () => {
    const result = await facade.greet("Erick");
    assert.strictEqual(result, "hi, Erick");
  });

  it("rejects with the plain typed error, not a FiberFailure wrapper", async () => {
    const error = await facade.fail("boom").catch((caught: unknown) => caught);
    assert.instanceOf(error, FakeError);
    assert.strictEqual((error as FakeError).message, "boom");
  });
});

/**
 * Every real `<Capability>Layer` (ADR-0014) is now a `makeTapLayerFacade`
 * Proxy, not an object literal — and it's exactly that Proxy that
 * `packages/{auth,payments,email,storage}/promise.ts` pass into
 * `makePromiseFacade`. An `Object.keys`-based `makePromiseFacade` would
 * enumerate zero keys off a Proxy with no own properties and silently
 * produce an empty facade; this test composes the two factories the same
 * way those four `promise.ts` files do, so a regression back to
 * `Object.keys` iteration fails here instead of at runtime in production.
 */
describe("makePromiseFacade over a makeTapLayerFacade Proxy", () => {
  interface FakeCapability {
    readonly greet: (name: string) => Effect.Effect<string, never, never>;
  }
  const FakeCapabilityTag = Context.Service<FakeCapability>("FakeCapability");
  const FakeCapabilityLive = Layer.succeed(FakeCapabilityTag, {
    greet: (name: string) => Effect.succeed(`hi, ${name}`),
  });

  it("resolves a method reachable only through the Proxy's get trap", async () => {
    const tapFacade = makeTapLayerFacade(FakeCapabilityTag);
    const promised = makePromiseFacade(tapFacade, FakeCapabilityLive);

    const result = await promised.greet("Erick");
    assert.strictEqual(result, "hi, Erick");
  });
});
