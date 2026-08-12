import { vi } from "@effect/vitest";

export const stubAnalyticsEnv = () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test_123");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://posthog.test");
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
};
