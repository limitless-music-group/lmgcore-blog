import { type Context, Effect, pipe } from "effect";

/** Flattens a Context.Key into the effect it resolves — the plumbing behind every `<Name>Layer` facade object (see packages/README.md). */
export const tapLayer = <L, R, E, A>(
  context: Context.Key<L, L>,
  effect: (layer: L) => Effect.Effect<R, E, A>
) => pipe(context, Effect.flatMap(effect));
