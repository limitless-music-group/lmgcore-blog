import { createEnv } from "@t3-oss/env-core";
import { Schema } from "effect";

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: Schema.toStandardSchemaV1(
        Schema.NonEmptyString
      ),
      NEXT_PUBLIC_POSTHOG_HOST: Schema.toStandardSchemaV1(
        Schema.NonEmptyString
      ),
      NEXT_PUBLIC_POSTHOG_KEY: Schema.toStandardSchemaV1(Schema.NonEmptyString),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    },
  });
