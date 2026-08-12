import { createEnv } from "@t3-oss/env-core";
import { Schema } from "effect";

export const keys = () =>
  createEnv({
    emptyStringAsUndefined: true,
    isServer: true,
    runtimeEnv: {
      SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
      SANITY_STUDIO_APP_ID: process.env.SANITY_STUDIO_APP_ID,
      SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    },
    server: {
      /**
       * Editor-role (or minimally create-capable) token — lets server code
       * create draft documents. Optional: only `write-client.ts` (and
       * anything calling it) needs it — required there, but the Studio/CLI
       * tooling that also loads `keys()` (schema extract, typegen, dev,
       * deploy) has no business needing write access to run.
       */
      SANITY_API_WRITE_TOKEN: Schema.toStandardSchemaV1(
        Schema.UndefinedOr(Schema.NonEmptyString)
      ),
      SANITY_STUDIO_APP_ID: Schema.toStandardSchemaV1(Schema.String),
      SANITY_STUDIO_DATASET: Schema.toStandardSchemaV1(Schema.String),
      SANITY_STUDIO_PROJECT_ID: Schema.toStandardSchemaV1(Schema.String),
    },
  });
