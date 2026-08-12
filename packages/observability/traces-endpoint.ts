const trailingSlashes = /\/+$/;

/**
 * `BETTER_STACK_URL` isn't documented anywhere as bare-host vs. full-URL —
 * accept either so a stray `https://` in the env value doesn't double up.
 * Split out of telemetry.ts so it's testable without importing
 * `@effect/opentelemetry`'s barrel (which eagerly pulls in `WebSdk.js` →
 * `@opentelemetry/sdk-trace-web`, a browser-only package this Node package
 * doesn't install).
 */
export function tracesEndpoint(ingestingHost: string): string {
  const base = ingestingHost.startsWith("http")
    ? ingestingHost
    : `https://${ingestingHost}`;
  return `${base.replace(trailingSlashes, "")}/v1/traces`;
}
