import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

export const config: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Next spawns one page-generation worker per CPU; each worker holds a
    // full live module graph, so on a multi-core box the peak memory is
    // roughly (workers × per-worker heap), not just the heaviest single
    // page. Serialize to 1 off-Vercel, where the build runs on a
    // resource-capped CI runner/VPS rather than Vercel's own build
    // infra — trades wall-clock for a much lower peak, which is what
    // actually OOM'd apps/app and apps/web's Docker builds in CI.
    // ...(process.env.VERCEL ? {} : { cpus: 1 }),
    cpus: 1,
    useTypeScriptCli: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // TODO: This is for development purposes and will be removed and replaced with our imagekit instance.
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
      // TODO: This is for development purposes and will be removed
      {
        hostname: "images.shadcnspace.com",
        protocol: "https",
      },
      {
        hostname: "cdn.lmgcore.com",
        protocol: "https",
      },
      // TODO: This is for development purposes and will be removed
      {
        hostname: "unsplash.com",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },

      {
        hostname: "i.pravatar.cc",
        protocol: "https",
      },
      {
        hostname: "cdn.sanity.io",
        pathname: "/images/7aprcnj5/**",
        protocol: "https",
      },
    ],
  },
  // Self-hosted (Docker on VPS) builds need a standalone server.js bundle;
  // Vercel's own builder handles output mode itself, so only set this
  // off-Vercel.
  output: "standalone",
  //   partialPrefetching: true,

  // biome-ignore lint/suspicious/useAwait: Rewrites is async
  async rewrites() {
    return [
      {
        destination: "https://us-assets.i.posthog.com/static/:path*",
        source: "/ingest/static/:path*",
      },
      {
        destination: "https://us.i.posthog.com/:path*",
        source: "/ingest/:path*",
      },
      {
        destination: "https://us.i.posthog.com/decide",
        source: "/ingest/decide",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
