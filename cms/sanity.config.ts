import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { keys } from "./keys";
import { schemaTypes } from "./schemaTypes";

const { SANITY_STUDIO_DATASET, SANITY_STUDIO_PROJECT_ID } = keys();

export default defineConfig({
  dataset: SANITY_STUDIO_DATASET,
  name: "default",

  plugins: [structureTool(), visionTool()],

  projectId: SANITY_STUDIO_PROJECT_ID,

  schema: {
    types: schemaTypes,
  },
  title: "LMG Core Blog",
});
