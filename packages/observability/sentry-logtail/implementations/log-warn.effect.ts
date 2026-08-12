import { Effect } from "effect";
import { resolveLogger } from "./internal/resolve-logger";

export const logWarn = (message: string, meta?: Record<string, unknown>) =>
  Effect.sync(() => {
    resolveLogger().warn(message, meta);
  });
