/**
 * Slugs that cannot be used as org/tenant or other dynamic path segments.
 * Prevents conflicts with static routes, system paths, and reserved words.
 */
export const RESERVED_SLUGS_LIST = [
  // Infrastructure & system
  "www",
  "api",
  "app",
  "admin",
  "dashboard",
  "static",
  "assets",
  "media",
  "cdn",
  "mail",
  "email",
  "ftp",
  "dev",
  "staging",
  "test",
  "localhost",
  "root",
  "lmgcore",
  // Auth & account
  "auth",
  "login",
  "logout",
  "signin",
  "sign-up",
  "signup",
  "register",
  "account",
  "profile",
  "user",
  "users",
  "me",
  "signed-out",
  // Common app segments
  "org",
  "organization",
  "organizations",
  "settings",
  "help",
  "support",
  "about",
  "terms",
  "privacy",
  "legal",
  "blog",
  "docs",
  "documentation",
  "contact",
  "feedback",
  // Reserved words / CRUD
  "slug",
  "id",
  "new",
  "edit",
  "create",
  "delete",
  "index",
  "null",
  "undefined",
  // Next / framework
  "_next",
  "favicon.ico",
  "robots",
  "sitemap",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS_LIST)[number];

const RESERVED_SLUGS = new Set<string>(RESERVED_SLUGS_LIST);

/** Check if a slug is reserved and cannot be used. */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export type SlugStatus = "available" | "taken" | "reserved";
