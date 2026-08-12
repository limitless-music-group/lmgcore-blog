import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./packages/cms/schemaTypes";
import { sanityEnv } from "./sanity-env";

const { SANITY_STUDIO_DATASET, SANITY_STUDIO_PROJECT_ID } = sanityEnv;

export default defineConfig({
  basePath: "/studio",
  dataset: SANITY_STUDIO_DATASET,
  name: "default",

  plugins: [structureTool(), visionTool()],

  projectId: SANITY_STUDIO_PROJECT_ID,

  schema: {
    types: schemaTypes,
  },
  title: "LMG Core Blog",
});
