import { Effect, type Layer } from "effect";

type AnyEffectFn = (
  ...args: never[]
) => Effect.Effect<unknown, unknown, unknown>;

/**
 * `Record<keyof T, AnyEffectFn>`, not `Record<string, AnyEffectFn>` — a
 * homomorphic mapped-type constraint (checks each `T[K]` individually)
 * instead of a plain index signature. Since ADR-0014, `T` here is a
 * `<Capability>Layer` typed as the capability's bare `interface` (e.g.
 * `Auth`, via `makeTapLayerFacade<Auth>(...): Auth`) rather than an object
 * literal — interfaces don't get TypeScript's implicit-index-signature
 * inference the way object literals do, so a plain `Record<string, ...>`
 * constraint rejects them with "Index signature for type 'string' is
 * missing" even though every property individually satisfies it.
 */
type EffectRecord<T> = Record<keyof T, AnyEffectFn>;

type SuccessOf<E> =
  E extends Effect.Effect<infer A, unknown, unknown> ? A : never;

export type PromiseFacade<T extends EffectRecord<T>> = {
  [K in keyof T]: (
    ...args: Parameters<T[K]>
  ) => Promise<SuccessOf<ReturnType<T[K]>>>;
};

/**
 * makePromiseFacade — the `withDb`/`withTx` shape, generalized to any
 * `<Capability>Layer` facade object (Auth, Payments, Email, Storage). Binds
 * that capability's Live layer and the `Effect.runPromise` + `Effect.provide`
 * ceremony once, so every operation on it becomes a plain
 * `await capability.op(...)` from promise-based oRPC handlers — no
 * `Effect.provide(Live)` repeated at each call site, no `Effect` import
 * needed by the caller at all. `Effect.runPromise` already rejects with the
 * failure's squashed `Cause` (not a wrapper), so no unwrapping is needed.
 *
 * Behavior-preserving: each call still does its own `Effect.provide(live)`
 * per invocation (not a shared `ManagedRuntime`), exactly like the call
 * sites this replaces — matches `CloudflareR2StorageLayerLive`'s own doc
 * comment ("cheap to re-provide per call, unlike the Neon pool") for why
 * these capabilities don't need `withDb`'s persistent-runtime treatment.
 *
 * Built on a `Proxy`, not an `Object.keys` iteration over `facade` — since
 * ADR-0014, `AuthLayer`/`PaymentsLayer`/`EmailLayer`/`FileStorageLayer`
 * (this function's only callers, `packages/{auth,payments,email,storage}/
 * promise.ts`) are themselves `makeTapLayerFacade` Proxys with no own keys
 * to enumerate, so `Object.keys(facade)` would silently resolve to `[]` and
 * every promise-facade method would go missing at runtime. The
 * "missing operation" guard that used to fire at construction time now
 * fires per-call instead, inside the `get` trap.
 */
export function makePromiseFacade<T extends EffectRecord<T>, R>(
  facade: T,
  live: Layer.Layer<R>
): PromiseFacade<T> {
  return new Proxy({} as PromiseFacade<T>, {
    get(_target, property) {
      if (typeof property === "symbol" || property === "then") {
        return;
      }
      const operation = facade[property as keyof T];
      if (typeof operation !== "function") {
        throw new Error(
          `makePromiseFacade: missing operation "${String(property)}"`
        );
      }
      return (...args: Parameters<typeof operation>) =>
        Effect.runPromise(
          (operation(...args) as Effect.Effect<unknown, unknown, R>).pipe(
            Effect.provide(live)
          )
        );
    },
  }) as PromiseFacade<T>;
}
