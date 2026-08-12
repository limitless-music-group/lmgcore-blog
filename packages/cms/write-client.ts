import { createClient } from "next-sanity";
import { keys } from "./keys";

const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_API_WRITE_TOKEN,
} = keys();

/**
 * Server-only, authenticated for writes. Only import from a `"use server"`
 * action or route handler — never from a client component, or the token
 * would ship in the browser bundle.
 */
export const writeClient = createClient({
  apiVersion: "2026-06-06",
  dataset: SANITY_STUDIO_DATASET,
  // "raw" (not the read client's "published") — a write client needs to see
  // draft documents too, e.g. reading back what it just created.
  perspective: "raw",
  projectId: SANITY_STUDIO_PROJECT_ID,
  token: SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
