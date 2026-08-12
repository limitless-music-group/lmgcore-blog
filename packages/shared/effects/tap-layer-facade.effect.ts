import type { Context, Effect } from "effect";
import { tapLayer } from "./tap-layer.effect";

type AnyEffectMethod = (
  ...args: never[]
) => Effect.Effect<unknown, unknown, unknown>;

/**
 * makeTapLayerFacade — generalizes the hand-written `<Capability>Layer`
 * object every capability package (Auth, Payments, Email, Storage, Security,
 * Observability, Notifications, Analytics) used to hand-roll: a flat object
 * with one entry per method, each entry a pure
 * `tapLayer(tag, (impl) => impl.method(...args))` forward — up to ~350 lines
 * for a single file (see ADR-0014).
 *
 * Built on a `Proxy`, not an `Object.keys` iteration (`makePromiseFacade`'s
 * approach, `./promise-facade.effect.ts`) — the thing being wrapped here is
 * a TypeScript `interface` (`Auth`, `Payments`, ...), which has no runtime
 * representation to enumerate keys from. Any property access returns a
 * function that forwards its arguments through `tapLayer` to the method of
 * the same name on whatever implementation the capability's Live layer
 * eventually provides — mechanically identical to the hand-written forwards
 * it replaces, for every method the interface declares, including ones
 * added after this call is written.
 */
export function makeTapLayerFacade<I extends object>(
  tag: Context.Key<I, I>
): I {
  return new Proxy({} as I, {
    get(_target, property, _receiver) {
      if (typeof property === "symbol" || property === "then") {
        return;
      }
      return (...args: unknown[]) =>
        tapLayer(tag, (impl) => {
          const method = impl[property as keyof I];
          if (typeof method !== "function") {
            throw new Error(
              `makeTapLayerFacade: "${property}" is not a method on this capability's Live layer`
            );
          }
          return (method as AnyEffectMethod)(...(args as never[]));
        });
    },
  }) as I;
}
