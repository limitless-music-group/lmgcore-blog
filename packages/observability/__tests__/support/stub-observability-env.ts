import { vi } from "@effect/vitest";

export const stubObservabilityEnv = () => {
  vi.stubEnv("BETTER_STACK_API_KEY", "bts_test_123");
  vi.stubEnv("BETTER_STACK_TEAM_API_KEY", "bts_team_test_123");
  vi.stubEnv("BETTER_STACK_UPTIME_TOKEN", "bts_uptime_test_123");
  vi.stubEnv("BETTER_STACK_URL", "in-otel.logs.betterstack.com");
  vi.stubEnv("SENTRY_ORG", "test-org");
  vi.stubEnv("SENTRY_PROJECT", "test-project");
  vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://public@sentry.example.com/1");
  vi.stubEnv("NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN", "pk_test_123");
  vi.stubEnv(
    "NEXT_PUBLIC_BETTER_STACK_INGESTING_URL",
    "https://ingest.example.com"
  );
};
