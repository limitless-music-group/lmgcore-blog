import { withLogtail } from "@logtail/next";
import { Effect } from "effect";

export const loggingNextConfig = (sourceConfig: object) =>
  Effect.sync(() => withLogtail(sourceConfig));
