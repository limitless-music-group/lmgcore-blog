//packages/shared/config/paths.ts
import { createBaseUrl, createPathBuilder } from "./path-builder";

const baseAppUrl = createBaseUrl({
  development: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  production: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.lmgcore.com",
});

const appTree = {
  /**
   * WorkOS/AuthKit handshake routes (/sign-in, /sign-up, /router,
   * /signed-out; /callback is only the redirect-URI target, referenced via
   * env + the WorkOS dashboard). Every auth gate (packages/dal/nextjs.ts,
   * @apps/web's sign-in buttons) sends unauthenticated users here.
   */
  auth: {
    router: () => "/router",
    sign_in: () => "/sign-in",
    sign_up: () => "/sign-up",
    signed_out: () => "/signed-out",
  },
  /**
   * Dashboard routes for navigation throughout the platform
   */
  dashboard: {
    geniviv: {
      artists: {
        detail: (slug: string, artistId: string) =>
          `/dashboard/${slug}/geniviv/artists/${artistId}`,
        new: (slug: string) => `/dashboard/${slug}/geniviv/artists/new`,
        root: (slug: string) => `/dashboard/${slug}/geniviv/artists`,
      },
      files: {
        // A folder lives at its name path; nested folders extend it. `[]` → root.
        folder: (slug: string, segments: string[]) =>
          `/dashboard/${slug}/geniviv/files${
            segments.length
              ? `/${segments.map(encodeURIComponent).join("/")}`
              : ""
          }`,
        new: (slug: string) => `/dashboard/${slug}/geniviv/files/new`,
        // A file opens as a `?preview=name.ext` overlay on its folder's page.
        preview: (slug: string, segments: string[], name: string) =>
          `/dashboard/${slug}/geniviv/files${
            segments.length
              ? `/${segments.map(encodeURIComponent).join("/")}`
              : ""
          }?preview=${encodeURIComponent(name)}`,
        root: (slug: string) => `/dashboard/${slug}/geniviv/files`,
      },

      labels: {
        detail: (slug: string, labelId: string) =>
          `/dashboard/${slug}/geniviv/labels/${labelId}`,
        new: (slug: string) => `/dashboard/${slug}/geniviv/labels/new`,
        root: (slug: string) => `/dashboard/${slug}/geniviv/labels`,
      },

      playlists: {
        detail: (slug: string, playlistId: string) =>
          `/dashboard/${slug}/geniviv/playlists/${playlistId}`,
        new: (slug: string) => `/dashboard/${slug}/geniviv/playlists/new`,
        root: (slug: string) => `/dashboard/${slug}/geniviv/playlists`,
      },
      root: (slug: string) => `/dashboard/${slug}/geniviv`,
    },
    /**
     * Org-agnostic entry. Resolves the caller's active org and redirects into
     * it. Use for links/redirects that don't know an org id yet (sign-in,
     * checkout, plan gates).
     */
    index: () => "/dashboard",
    // All other dashboard routes are scoped to the active organization by its
    // slug (the [slug] route segment). org_id remains the security boundary.
    root: (slug: string) => `/dashboard/${slug}`,

    titan: {
      deliveries: {
        detail: (slug: string, deliveryId: string) =>
          `/dashboard/${slug}/titan/deliveries/${deliveryId}`,
        root: (slug: string) => `/dashboard/${slug}/titan/deliveries`,
      },

      distributions: {
        detail: (slug: string, distributionId: string) =>
          `/dashboard/${slug}/titan/distributions/${distributionId}`,
        new: (slug: string) => `/dashboard/${slug}/titan/distributions/new`,
        root: (slug: string) => `/dashboard/${slug}/titan/distributions`,
      },

      partners: {
        detail: (slug: string, partnerId: string) =>
          `/dashboard/${slug}/titan/partners/${partnerId}`,
        root: (slug: string) => `/dashboard/${slug}/titan/partners`,
      },

      releases: {
        detail: (slug: string, releaseId: string) =>
          `/dashboard/${slug}/titan/releases/${releaseId}`,
        new: (slug: string) => `/dashboard/${slug}/titan/releases/new`,
        root: (slug: string) => `/dashboard/${slug}/titan/releases`,
      },
      root: (slug: string) => `/dashboard/${slug}/titan`,
    },
    user_settings: (slug: string) => `/dashboard/${slug}/user-settings`,
  },
  /** Onboarding routes for both new users and new organizations */
  onboarding: () => "/onboarding",
  /**
   * Routes that are distinctly for `admin` and `owner` roles.
   */
  organization: {
    account_settings: () => "/organization/account-settings",
    users: () => "/organization/users",
  },
  /**
   * The artist portal, served under /portal: `/portal` resolves the
   * caller's active org and bounces into `/portal/{slug}`, the artist's own
   * profile. Artist-role accounts are redirected here from the staff
   * dashboard's (org-layout) gate and post-login /router; non-artists who
   * land here bounce back to /dashboard.
   */
  portal: {
    index: () => "/portal",
    root: (slug: string) => `/portal/${slug}`,
  },
} as const;

export const appPaths = createPathBuilder(appTree, baseAppUrl);

// Marketing is served by @apps/web (extracted out of @apps/app).
const baseMarketingUrl = createBaseUrl({
  development: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3005",
  production: process.env.NEXT_PUBLIC_WEB_URL ?? "https://lmgcore.com",
});

const marketingTree = {
  about: () => "/about",
  changelog: () => "/changelog",
  contact: () => "/contact",
  features: {
    geniviv: () => "/features/geniviv",
    royalty_maze: () => "/features/royalty-maze",
    titan: () => "/features/titan",
  },
  home: () => "/",
  pricing: () => "/pricing",
  privacyPolicy: () => "/privacy-policy",
  roadmap: () => "/roadmap",
  termsOfService: () => "/terms-of-service",
  testimonial: {
    submit: () => "/testimonial/submit",
  },
} as const;
export const marketingPaths = createPathBuilder(
  marketingTree,
  baseMarketingUrl
);

const baseBlogUrl = createBaseUrl({
  development: process.env.NEXT_PUBLIC_BLOG_URL ?? "http://localhost:3002",
  production: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.lmgcore.com",
});
/**
 * Routes for the public blog frontend (@apps/blog-frontend).
 */
const blogTree = {
  authors: {
    detail: (slug: string) => `/authors/${slug}`,
    root: () => "/authors",
  },
  home: () => "/",
  post: (slug: string) => `/${slug}`,
  tags: {
    detail: (slug: string) => `/tags/${slug}`,
    root: () => "/tags",
  },
} as const;
export const blogPaths = createPathBuilder(blogTree, baseBlogUrl);

export const externalPaths = {
  blog: { getUrl: () => process.env.NEXT_PUBLIC_BLOG_URL as string },
  docs: { getUrl: () => process.env.NEXT_PUBLIC_DOCS_URL as string },
  limitless_music_group: { getHref: () => "https://limitlessmusic.com" },
} as const;
