import { assert, describe, it } from "@effect/vitest";
import { tracesEndpoint } from "../traces-endpoint";

describe("tracesEndpoint", () => {
  it("prefixes a bare host with https://", () => {
    assert.strictEqual(
      tracesEndpoint("in-otel.logs.betterstack.com"),
      "https://in-otel.logs.betterstack.com/v1/traces"
    );
  });

  it("doesn't double up a scheme already present", () => {
    assert.strictEqual(
      tracesEndpoint("https://in-otel.logs.betterstack.com"),
      "https://in-otel.logs.betterstack.com/v1/traces"
    );
  });

  it("strips a trailing slash before appending the path", () => {
    assert.strictEqual(
      tracesEndpoint("https://in-otel.logs.betterstack.com/"),
      "https://in-otel.logs.betterstack.com/v1/traces"
    );
  });
});
