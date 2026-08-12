import { Data } from "effect";

export class AnalyticsError extends Data.TaggedError("AnalyticsError")<{
  cause?: unknown;
  message?: string;
}> {}
