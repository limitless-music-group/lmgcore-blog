import { Data } from "effect";

export class ObservabilityError extends Data.TaggedError("ObservabilityError")<{
  cause?: unknown;
  message?: string;
}> {}
