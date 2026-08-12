import { defineConfig } from "vitest/config";

// `defineWorkspace`/vitest.workspace.ts's auto-discovery is gone as of
// vitest 4 — `test.projects` on a regular config is the replacement.
export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.ts", "packages/ai/*/vitest.config.ts"],
  },
});
