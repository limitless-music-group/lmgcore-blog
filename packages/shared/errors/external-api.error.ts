import { Data } from "effect";

export class ExternalAPIError extends Data.TaggedError("ExternalAPIError")<{
  readonly message: string;
  readonly cause?: unknown;
  readonly meta?: Record<string, unknown>;
}> {
  constructor(args: {
    message: string;
    cause?: unknown;
    meta?: Record<string, unknown>;
  }) {
    super({
      cause: args.cause,
      message: args.message,
      meta: args.meta,
    });
  }
}
