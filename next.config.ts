import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { env } from "./env";
import { withLogging, withSentry } from "@/packages/observability/next-config";

const config: NextConfig = {
  cacheComponents: true,
  // Not secrets — Sanity's own convention exposes these to the Studio's
  // client bundle (SANITY_STUDIO_* is Sanity's equivalent of NEXT_PUBLIC_*).
  // The embedded Studio route (app/studio) is a Client Component, so
  // sanity.config.ts's `process.env.SANITY_STUDIO_*` reads need inlining
  // into the browser bundle the same way the CLI/server side already gets
  // them from `.env`.
  env: {
    SANITY_STUDIO_APP_ID: env.SANITY_STUDIO_APP_ID,
    SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
  },
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        pathname: `/images/${env.SANITY_STUDIO_PROJECT_ID}/${env.SANITY_STUDIO_DATASET}/**`,
        protocol: "https",
      }
    ],
  },
  partialPrefetching: true,

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

const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);

let nextConfig: NextConfig = {
  ...withLogging(withSentry(config)),
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
