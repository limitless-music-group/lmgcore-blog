import { afterEach, assert, describe, it, vi } from "@effect/vitest";
import { keys } from "../keys";
import { stubObservabilityEnv } from "./support/stub-observability-env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("loadObservabilityServerEnv", () => {
  it("resolves every required var, unwrapping the redacted key", () => {
    stubObservabilityEnv();
    const env = keys();

    assert.strictEqual(env.BETTER_STACK_API_KEY, "bts_test_123");
    assert.strictEqual(env.BETTER_STACK_URL, "in-otel.logs.betterstack.com");
    assert.strictEqual(env.SENTRY_ORG, "test-org");
    assert.strictEqual(env.SENTRY_PROJECT, "test-project");
  });

  it("throws when a required var is missing", () => {
    // Explicit, not just "don't call stubObservabilityEnv()" — a deployment
    // that actually configures these vars would otherwise leak them in
    // ambient here and silently stop testing anything.
    vi.stubEnv("BETTER_STACK_API_KEY", undefined);
    vi.stubEnv("BETTER_STACK_TEAM_API_KEY", undefined);
    vi.stubEnv("BETTER_STACK_UPTIME_TOKEN", undefined);
    vi.stubEnv("BETTER_STACK_URL", undefined);
    vi.stubEnv("SENTRY_ORG", undefined);
    vi.stubEnv("SENTRY_PROJECT", undefined);
    assert.throws(() => keys());
  });
});

// ObservabilityClientEnvVars snapshots `process.env.NEXT_PUBLIC_*` into
// literal member expressions at MODULE IMPORT time (see env-vars.ts's
// `clientEnvSnapshot` comment) so Next.js's bundler can statically inline
// them client-side. That means `vi.stubEnv` from a `beforeEach` — which runs
// after the module has already been imported and the snapshot already taken
// — can never reach it. Each test here stubs env, then resets the module
// registry and dynamically re-imports `../env-vars` so the snapshot is taken
// AFTER the stub is in place.
describe("loadObservabilityClientEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("resolves every required public var", () => {
    stubObservabilityEnv();
    vi.resetModules();

    const env = keys();

    assert.strictEqual(
      env.NEXT_PUBLIC_SENTRY_DSN,
      "https://public@sentry.example.com/1"
    );
    assert.strictEqual(
      env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
      "pk_test_123"
    );
    assert.strictEqual(
      env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL,
      "https://ingest.example.com"
    );
  });

  it("throws when a required var is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_BETTER_STACK_INGESTING_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN", undefined);
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", undefined);
    vi.resetModules();

    assert.throws(() => keys());
  });
});
