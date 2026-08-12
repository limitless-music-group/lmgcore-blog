import { createEnv } from "@t3-oss/env-core";
import { Schema } from "effect";
import { strictUrl } from "../shared/utils/schema-utils";

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_APP_URL: Schema.toStandardSchemaV1(strictUrl),
      NEXT_PUBLIC_BLOG_URL: Schema.toStandardSchemaV1(strictUrl),
      NEXT_PUBLIC_DOCS_URL: Schema.toStandardSchemaV1(strictUrl),
      NEXT_PUBLIC_WEB_URL: Schema.toStandardSchemaV1(strictUrl),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      ANALYZE: process.env.ANALYZE,

      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
      NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
      NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
      NEXT_RUNTIME: process.env.NEXT_RUNTIME,
      NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
        process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY,
      //   VERCEL: process.env.VERCEL,
      //   VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
      //   VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      //   VERCEL_REGION: process.env.VERCEL_REGION,
      //   VERCEL_URL: process.env.VERCEL_URL,
    },
    server: {
      ANALYZE: Schema.toStandardSchemaV1(
        Schema.Union([Schema.String, Schema.Undefined])
      ),
      NEXT_RUNTIME: Schema.toStandardSchemaV1(
        Schema.Literals(["bun", "edge", "nodejs"])
      ),
      NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: Schema.toStandardSchemaV1(
        Schema.Union([Schema.NonEmptyString, Schema.Undefined])
      ),
      //   VERCEL: Schema.toStandardSchemaV1(
      //     Schema.Union([Schema.String, Schema.Undefined])
      //   ),
      //   VERCEL_BRANCH_URL: Schema.toStandardSchemaV1(
      //     Schema.Union([Schema.String, Schema.Undefined])
      //   ),
      //   VERCEL_PROJECT_PRODUCTION_URL: Schema.toStandardSchemaV1(
      //     Schema.Union([Schema.String, Schema.Undefined])
      //   ),
      //   VERCEL_REGION: Schema.toStandardSchemaV1(
      //     Schema.Union([Schema.String, Schema.Undefined])
      //   ),
      //   VERCEL_URL: Schema.toStandardSchemaV1(
      //     Schema.Union([Schema.String, Schema.Undefined])
      //   ),
    },
  });
