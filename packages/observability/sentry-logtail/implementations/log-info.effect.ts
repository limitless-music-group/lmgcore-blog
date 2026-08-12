import { Effect } from "effect";
import { resolveLogger } from "./internal/resolve-logger";

export const logInfo = (message: string, meta?: Record<string, unknown>) =>
  Effect.sync(() => {
    resolveLogger().info(message, meta);
  });
