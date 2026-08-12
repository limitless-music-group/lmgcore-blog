import { createEnv } from "@t3-oss/env-nextjs";
import { Schema } from "effect";
import { strictUrl } from "@/packages/shared/utils/schema-utils";

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: {
    BETTER_STACK_API_KEY: process.env.BETTER_STACK_API_KEY,
    BETTER_STACK_TEAM_API_KEY: process.env.BETTER_STACK_TEAM_API_KEY,
    BETTER_STACK_UPTIME_TOKEN: process.env.BETTER_STACK_UPTIME_TOKEN,
    BETTER_STACK_URL: process.env.BETTER_STACK_URL,

    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    
    SANITY_STUDIO_APP_ID: process.env.SANITY_STUDIO_APP_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    
    NEXT_PUBLIC_BETTER_STACK_INGESTING_URL: process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL,
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,

    ANALYZE: process.env.ANALYZE,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
  server: {
    ANALYZE: Schema.toStandardSchemaV1(
        Schema.Union([Schema.String, Schema.Undefined])
      ),
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
    SANITY_STUDIO_APP_ID: Schema.toStandardSchemaV1(Schema.String),
    SANITY_STUDIO_DATASET: Schema.toStandardSchemaV1(Schema.String),
    SANITY_STUDIO_PROJECT_ID: Schema.toStandardSchemaV1(Schema.String),
  },

  client: {
    NEXT_PUBLIC_APP_URL: Schema.toStandardSchemaV1(strictUrl),
    NEXT_PUBLIC_BLOG_URL: Schema.toStandardSchemaV1(strictUrl),
    NEXT_PUBLIC_DOCS_URL: Schema.toStandardSchemaV1(strictUrl),
    NEXT_PUBLIC_WEB_URL: Schema.toStandardSchemaV1(strictUrl),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: Schema.toStandardSchemaV1(
      Schema.NonEmptyString
    ),
    NEXT_PUBLIC_POSTHOG_HOST: Schema.toStandardSchemaV1(
      Schema.NonEmptyString
    ),
    NEXT_PUBLIC_POSTHOG_KEY: Schema.toStandardSchemaV1(Schema.NonEmptyString),
    NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
    Schema.toStandardSchemaV1(strictUrl),
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: Schema.toStandardSchemaV1(
        Schema.NonEmptyString
    ),
    NEXT_PUBLIC_SENTRY_DSN: Schema.toStandardSchemaV1(strictUrl),
  },

});
