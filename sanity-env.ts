import { createEnv } from "@t3-oss/env-core";
import { Schema } from "effect";

/**
 * Sanity CLI/Studio config (sanity.cli.ts, sanity.config.ts) loads outside
 * the Next.js runtime, in Sanity's own Vite worker — @/env's env-nextjs
 * isServer auto-detection misreads that context as "client" and throws.
 * isServer: true here skips detection entirely since this file only ever
 * runs in Node.
 */
export const sanityEnv = createEnv({
  emptyStringAsUndefined: true,
  isServer: true,
  runtimeEnv: {
    SANITY_STUDIO_APP_ID: process.env.SANITY_STUDIO_APP_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
  },
  server: {
    SANITY_STUDIO_APP_ID: Schema.toStandardSchemaV1(Schema.String),
    SANITY_STUDIO_DATASET: Schema.toStandardSchemaV1(Schema.String),
    SANITY_STUDIO_PROJECT_ID: Schema.toStandardSchemaV1(Schema.String),
  },
});
