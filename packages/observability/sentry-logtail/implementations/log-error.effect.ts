import { Effect } from "effect";
import { resolveLogger } from "./internal/resolve-logger";

export const logError = (message: string, meta?: Record<string, unknown>) =>
  Effect.sync(() => {
    resolveLogger().error(message, meta);
  });
