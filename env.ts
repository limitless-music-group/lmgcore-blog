import { Schema } from "effect";
import { strictUrl } from "./shared/utils/schema-utils";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    emptyStringAsUndefined: true,
    client: {
        NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
        Schema.toStandardSchemaV1(strictUrl),
      NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: Schema.toStandardSchemaV1(
        Schema.NonEmptyString
      ),
      NEXT_PUBLIC_SENTRY_DSN: Schema.toStandardSchemaV1(strictUrl),
    },
    runtimeEnv: {
        NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
        process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL,
      NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN:
        process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
      SANITY_STUDIO_APP_ID: process.env.SANITY_STUDIO_APP_ID,
      SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,

      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      BETTER_STACK_API_KEY: process.env.BETTER_STACK_API_KEY,
      BETTER_STACK_TEAM_API_KEY: process.env.BETTER_STACK_TEAM_API_KEY,
      BETTER_STACK_UPTIME_TOKEN: process.env.BETTER_STACK_UPTIME_TOKEN,
      BETTER_STACK_URL: process.env.BETTER_STACK_URL,
    },
    server: {
        BETTER_STACK_API_KEY: Schema.toStandardSchemaV1(Schema.NonEmptyString),
        BETTER_STACK_TEAM_API_KEY: Schema.toStandardSchemaV1(
          Schema.NonEmptyString
        ),
        BETTER_STACK_UPTIME_TOKEN: Schema.toStandardSchemaV1(
          Schema.NonEmptyString
        ),
        // Not `strictUrl` — traces-endpoint.ts's `tracesEndpoint()` deliberately
        // accepts either a bare host or a full URL for this var (its own doc
        // comment: "isn't documented anywhere as bare-host vs. full-URL —
        // accept either"), so requiring https:// here would reject a
        // legitimate, already-supported value shape.
        BETTER_STACK_URL: Schema.toStandardSchemaV1(Schema.NonEmptyString),
        SENTRY_ORG: Schema.toStandardSchemaV1(Schema.NonEmptyString),
        SENTRY_PROJECT: Schema.toStandardSchemaV1(Schema.NonEmptyString),
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
})