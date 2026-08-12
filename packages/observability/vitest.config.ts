import { defineConfig, mergeConfig } from "vitest/config";
import shared from "../../vitest.shared";

/**
 * Tests here stub process.env (Sentry/Logtail config) and spy on the
 * `@sentry/nextjs`/`@logtail/next` module namespaces as shared mutable state
 * for the whole file, so the root default of running tests concurrently
 * within a file isn't safe here.
 */
export default mergeConfig(
  shared,
  defineConfig({
    test: {
      environment: "node",
      name: "@/packages/observability",
      sequence: {
        concurrent: false,
      },
    },
  })
);
