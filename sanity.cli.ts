import { defineCliConfig } from "sanity/cli";
import { sanityEnv } from "./sanity-env";

const {
  SANITY_STUDIO_APP_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} = sanityEnv;

export default defineCliConfig({
  api: {
    dataset: SANITY_STUDIO_DATASET,
    projectId: SANITY_STUDIO_PROJECT_ID,
  },
  deployment: {
    /**
     * Get the appId for a previously deployed Studio under the "Studio" tab for your project in sanity.io/manage
     * Note: this is required for fine-grained version selection
     * Accessible at https://www.sanity.io/organizations/ob2XkpX6o/project/7aprcnj5/studios
     */
    appId: SANITY_STUDIO_APP_ID,
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  reactStrictMode: true,
  typegen: {
    generates: "./packages/cms/sanity.types.ts",
    path: "./packages/cms/queries/**/*.{ts,tsx}",
    schema: "./schema.json",
  },
});
