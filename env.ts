import { createEnv } from "@t3-oss/env-nextjs";
import { keys as analytics } from "@/packages/analytics/keys";
import { keys as cms } from "@/packages/cms/keys";
import { keys as core } from "@/packages/next-config/keys";
import { keys as observability } from "@/packages/observability/keys";

export const env = createEnv({
  client: {},
  emptyStringAsUndefined: true,
  extends: [core(), observability(), cms(), analytics()],
  runtimeEnv: {},
  server: {},
});
