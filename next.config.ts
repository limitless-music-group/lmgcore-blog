import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import { env } from "@/env";
import { withLogging, withSentry } from "@/packages/observability/next-config";

const config: NextConfig = {
  cacheComponents: true,
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
      },
      {
        hostname: "images.shadcnspace.com",
        protocol: "https",
      },
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
