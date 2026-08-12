// Subpath import, not the barrel — the barrel re-exports `WebSdk`, which
// requires the browser-only `@opentelemetry/sdk-trace-web` this package
// doesn't install, and crashes any Node/bun process at import time.
import { layer as nodeSdkLayer } from "@effect/opentelemetry/NodeSdk";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { tracesEndpoint } from "./traces-endpoint";
import { env } from "@/env";

/**
 * Exports every `Effect.withSpan` call in this codebase to Better Stack
 * Telemetry over OTLP/HTTP — see
 * https://betterstack.com/docs/logs/open-telemetry/
 * (`https://$INGESTING_HOST/v1/traces`, `Authorization: Bearer $SOURCE_TOKEN`).
 *
 * OTLP ingest authenticates with the telemetry *source token* against the
 * source's *ingesting host* — those live in
 * `NEXT_PUBLIC_BETTER_STACK_INGESTING_URL`/`NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`
 * (NEXT_PUBLIC because the browser logger ships them too; fine to read
 * server-side). `BETTER_STACK_URL`/`BETTER_STACK_API_KEY` are the status-page
 * URL + account API token — the ingest endpoint 401s the API token.
 *
 * This is infrastructure, not a `Observability` port operation — provide it
 * once at your process's outermost Layer (`Layer.provideMerge`/`Layer.launch`
 * for a long-running Effect process; a Next.js app's `instrumentation.ts`
 * `register()` hook is the framework's own recommended OTel bootstrap point)
 * rather than per-request.
 */
export const BetterStackTelemetryLayer = nodeSdkLayer(() => {
  return {
    resource: { serviceName: process.env.SERVICE_NAME ?? "lmgcore" },
    spanProcessor: new BatchSpanProcessor(
      new OTLPTraceExporter({
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN}`,
        },
        url: tracesEndpoint(env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL),
      })
    ),
  };
});
