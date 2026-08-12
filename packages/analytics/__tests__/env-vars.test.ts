import { afterEach, assert, describe, it } from "@effect/vitest";
import { vi } from "vitest";
import { stubAnalyticsEnv } from "./support/stub-analytics-env";
import { env } from "@/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("loadAnalyticsServerEnv", () => {
  it("resolves every var, unwrapping the redacted values", () => {
    stubAnalyticsEnv();
    const appEnv = env;

    assert.strictEqual(appEnv.NEXT_PUBLIC_POSTHOG_KEY, "phc_test_123");
    assert.strictEqual(appEnv.NEXT_PUBLIC_POSTHOG_HOST, "https://posthog.test");
  });

  it("throws when a required var is missing", () => {
    // Explicit, not just "don't call stubAnalyticsEnv()" — a deployment that
    // actually configures these vars (any real PostHog-enabled app) would
    // otherwise leak them in ambient here and silently stop testing anything.
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", undefined);
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", undefined);
    assert.throws(() => env);
  });
});

// AnalyticsClientEnvVars snapshots `process.env.NEXT_PUBLIC_*` into literal
// member expressions at MODULE IMPORT time (see env-vars.ts's
// `clientEnvSnapshot` comment) so Next.js's bundler can statically inline
// them client-side. That means `vi.stubEnv` — which runs after the module has
// already been imported and the snapshot already taken — can never reach it.
// Each test here stubs env, then resets the module registry and dynamically
// re-imports `../env-vars` so the snapshot is taken AFTER the stub is set.
describe("loadAnalyticsClientEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("resolves every required public var", () => {
    stubAnalyticsEnv();
    vi.resetModules();
    const appEnv = env;

    assert.strictEqual(appEnv.NEXT_PUBLIC_POSTHOG_KEY, "phc_test_123");
    assert.strictEqual(appEnv.NEXT_PUBLIC_POSTHOG_HOST, "https://posthog.test");
    assert.strictEqual(appEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID, "G-TEST123");
  });

  it("throws when a required var is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", undefined);
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", undefined);
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", undefined);
    vi.resetModules();

    assert.throws(() => env);
  });
});
