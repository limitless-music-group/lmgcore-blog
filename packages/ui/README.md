# @/packages/ui

Shared UI components, hooks, providers, stores, and the Tailwind entry stylesheet (`styles/globals.css`) imported by `apps/app`, `apps/web`, and `apps/blog`.

## ⚠️ Tailwind `@source` rules — read before touching `styles/globals.css`

In July 2026 two `@source` glob lines in this package made `next dev` consume unbounded memory (~30 MB/s during `Compiling / ...`) until the machine crashed. Do not reintroduce that pattern.

### The rule

**Never point `@source` at a glob or directory that can reach a `node_modules`.** Only list concrete source directories or files:

```css
/* ✅ Safe — concrete source dirs, no node_modules inside */
@source "../components";
@source "../hooks";
@source "../lib";
@source "../providers";
@source "../stores";
@source "../index.tsx";

/* ❌ Never — matches apps/*/node_modules and this package's node_modules */
@source "../../../apps/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";
```

### Why the broad globs are fatal

1. **Explicit `@source` bypasses Tailwind v4's default filtering.** Automatic source detection skips `.gitignore`d paths and `node_modules`; explicit `@source` entries do not — that's by design, so you can opt libraries in. A glob like `apps/**` therefore descends into every `node_modules` under `apps/`.
2. **Bun workspace symlinks form cycles.** `apps/app/node_modules/@/packages/ui → packages/ui`, whose `node_modules/@/packages/* → packages/*`, whose `node_modules` links back again. The scanner follows symlinks, so the walk never terminates and memory grows until OOM.
3. **It gets worse silently.** Every new `workspace:*` cross-dependency between packages adds cycle paths. The bad globs sat harmless-looking for weeks; adding `@/packages/ui` as a dependency of `@/packages/observability` is what tipped the walk into machine-killing territory. A green `next dev` today does not prove a broad glob is safe tomorrow.

### Adding new scan sources

- New source directory in this package → add a scoped line: `@source "../<dir>";`
- App-local classes not being picked up → add scoped `@source` lines **in that app's own `globals.css`** (e.g. `@source "../components";` relative to that file), never a repo-wide glob here. Apps' own files are normally covered by Tailwind auto-detection (CWD-based, respects `.gitignore`), so first confirm the class is really missing from the built CSS.
- Need classes from a third-party package → point at that one package explicitly, e.g. `@source "../node_modules/<pkg>/dist";` — never a wildcard across `node_modules`.

### Debugging gotchas

- You **cannot** comment out an `@source` glob with a CSS block comment: the glob text `**/*` contains `*/`, which terminates the comment and produces `CssSyntaxError: Invalid declaration: 'ts,tsx'`. Delete the line instead.
- Turbopack caches PostCSS errors. After fixing this file, `rm -rf apps/<app>/.next` if the dev server keeps reporting a stale error.
- Symptom signature of a scanner walk: `next dev` starts fine (low memory), then the first page request hangs in `Compiling ...` while `next-server` RSS climbs without bound.
