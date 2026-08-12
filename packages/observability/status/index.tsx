import { cacheLife } from "next/cache";
import { ExternalAPIError } from "@/packages/shared/errors/external-api.error";
import { keys } from "../keys";
import type { BetterStackResponse } from "./types";
/**
 * Server component only (secret API key + async) — never import from a
 * `"use client"` file. Render it in a server component and pass the element
 * down as a slot prop instead (see `AppSidebar` → `NavSecondary`).
 *
 * Must stay a `"use cache"` cache component: `loadObservabilityServerEnv`
 * runs `Effect.runSync`, whose fiber setup calls `Date.now()` — with
 * `cacheComponents` enabled that's a prerender error outside a cache scope,
 * and the static shell permanently bakes in the muted fallback.
 */
export const Status = async () => {
  "use cache";
  // Sidebar renders on every page — don't hit the uptime API each time.
  cacheLife("minutes");

  // Inside the component, not module scope: the loader throws when the env
  // is missing, and at module scope that crashes the whole importer at
  // bundle-evaluation time. Here it degrades to rendering nothing.
  let env: ReturnType<typeof keys>;
  try {
    env = keys();
  } catch {
    return null;
  }
  const { BETTER_STACK_TEAM_API_KEY: apiKey, BETTER_STACK_URL: url } = env;

  let statusColor = "bg-gray-300";
  let statusLabel = "Unable to fetch status";

  try {
    const response = await fetch(
      "https://uptime.betterstack.com/api/v2/monitors",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new ExternalAPIError({ message: "Failed to fetch status" });
    }

    const { data } = (await response.json()) as BetterStackResponse;

    const status =
      data.filter((monitor) => monitor.attributes.status === "up").length /
      data.length;

    if (status === 0) {
      statusColor = "bg-red-300";
      statusLabel = "Degraded performance";
    } else if (status < 1) {
      statusColor = "bg-yellow-300";
      statusLabel = "Partial outage";
    } else {
      statusColor = "bg-green-300";
      statusLabel = "All systems normal";
    }
  } catch {
    statusColor = "bg-gray-300";
    statusLabel = "Unable to fetch status";
  }

  return (
    <a
      className="mt-2 flex items-center gap-3 border p-2 font-medium text-xs transition-all hover:font-semibold"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <span className={`size-2 shrink-0 rounded-full ${statusColor}`} />
      <span className="text-muted-foreground">{statusLabel}</span>
    </a>
  );
};
