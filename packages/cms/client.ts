import { createClient } from "next-sanity";
import { keys } from "./keys";

const { SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET } = keys();

export const client = createClient({
  apiVersion: "2026-06-06",
  dataset: SANITY_STUDIO_DATASET,
  perspective: "published",
  projectId: SANITY_STUDIO_PROJECT_ID,
  useCdn: false,
});
