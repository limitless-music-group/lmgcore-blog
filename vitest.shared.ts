import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// A `.tsx` file whose nearest tsconfig sets `jsx: "preserve"` (Next.js's
// preset does, so its own SWC/webpack compiler does the transform instead)
// fails to parse under vitest's default oxc-based transform. The React
// plugin's own transform handles it regardless of what any package's
// tsconfig sets. Applied repo-wide rather than per-package, since any
// package's test can transitively load a `.tsx` file it doesn't own (e.g.
// packages/api's test suite loads packages/email's React Email templates
// via the full router aggregation).
export default defineConfig({
  oxc: {
    target: "es2020",
  },
  plugins: [react()],
  test: {
    exclude: ["node_modules/**", ".next/**"],
    include: ["__tests__/**/*.test.ts"],
    sequence: {
      concurrent: true,
    },
    setupFiles: [join(import.meta.dirname, "vitest.setup.ts")],
  },
});
