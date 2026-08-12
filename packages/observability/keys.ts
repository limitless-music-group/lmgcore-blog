import { createEnv } from "@t3-oss/env-core";
import { Schema } from "effect";
import { strictUrl } from "../shared/utils/schema-utils";

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
        Schema.toStandardSchemaV1(strictUrl),
      NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: Schema.toStandardSchemaV1(
        Schema.NonEmptyString
      ),
      NEXT_PUBLIC_SENTRY_DSN: Schema.toStandardSchemaV1(strictUrl),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      BETTER_STACK_API_KEY: process.env.BETTER_STACK_API_KEY,
      BETTER_STACK_TEAM_API_KEY: process.env.BETTER_STACK_TEAM_API_KEY,
      BETTER_STACK_UPTIME_TOKEN: process.env.BETTER_STACK_UPTIME_TOKEN,
      BETTER_STACK_URL: process.env.BETTER_STACK_URL,

      NEXT_PUBLIC_BETTER_STACK_INGESTING_URL:
        process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL,
      NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN:
        process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
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
    },
  });
