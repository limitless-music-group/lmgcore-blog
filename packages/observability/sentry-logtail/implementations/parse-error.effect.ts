import { Effect } from "effect";
import { captureSentryException } from "./capture-sentry-exception.effect";
import { logError } from "./log-error.effect";

function extractMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export const parseError = (error: unknown) =>
  Effect.gen(function* () {
    const message = extractMessage(error);
    yield* Effect.gen(function* () {
      yield* captureSentryException(error);
      yield* logError(`Parsing error: ${message}`);
    }).pipe(
      Effect.catch((newError) =>
        Effect.sync(() => {
          logError("Error parsing error:", newError);
        })
      )
    );
    return message;
  });
