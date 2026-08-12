import { captureException } from "@sentry/nextjs";
import { Effect } from "effect";

export const captureSentryException = (error: unknown) =>
  Effect.sync(() => {
    captureException(error);
  });
