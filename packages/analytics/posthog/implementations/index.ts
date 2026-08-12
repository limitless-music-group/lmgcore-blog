// capture-client-event.effect / identify-client.effect / init-client-analytics.effect
// are deliberately NOT barrelled here — see the doc comment on `Analytics` in
// ../../layer/analytics.layer.ts. Each is imported by direct path from
// instrumentation-client.ts so posthog-node (Node-only) never enters the
// browser bundle's module graph.
// biome-ignore lint/performance/noBarrelFile: curated server-only aggregation, not an indiscriminate re-export-everything barrel.
export * from "./capture-server-event.effect";
export * from "./group-identify-server.effect";
export * from "./identify-server-user.effect";
export * from "./is-feature-enabled.effect";
