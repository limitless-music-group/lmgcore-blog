// apps/app/next.config.ts

import { config, withAnalyzer } from "@packages/next-config";
import { withLogging, withSentry } from "@packages/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

let nextConfig: NextConfig = {
  ...withLogging(withSentry(config)),
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
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
