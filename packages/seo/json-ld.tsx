import type { Thing, WithContext } from "schema-dts";
import { escapeJsonForHtml } from "@/packages/shared/utils/formatters";

interface JsonLdProps {
  code: WithContext<Thing>;
}

export const JsonLd = ({ code }: JsonLdProps) => (
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: needed
    dangerouslySetInnerHTML={{
      __html: escapeJsonForHtml(JSON.stringify(code)),
    }}
    type="application/ld+json"
  />
);

// biome-ignore lint/performance/noBarrelFile: single entry point re-exporting schema-dts's types for this package's consumers.
export * from "schema-dts";
