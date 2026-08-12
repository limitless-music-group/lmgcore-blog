import { Schema } from "effect";
import { isReservedSlug } from "../constants/reserved-slugs";
import { isValidPostalCode } from "../utils/postal";
import {
  optionalEmail,
  optionalPhone,
  optionalUrl,
} from "../utils/schema-utils";

/**
 * Onboarding wizard schemas.
 *
 * Field names match the `organizations`/`users` table columns
 * (`packages/database/tables/schemas/*.schema.ts`) exactly, but the
 * validation rules here are hand-specified rather than derived from those
 * tables via `createInsertSchema`'s `refine`: every column below is
 * nullable in Postgres (rows predate the columns), and `@handfish/
 * drizzle-effect`'s refine *intersects* a refine value with the
 * auto-generated (nullable) column type instead of replacing it, so it
 * can't make a nullable column required at the type level — confirmed via
 * tsc, not a style choice. `organization-settings.schema.ts` reuses these
 * exact sub-schemas via `.fields` spreads instead of re-declaring them, so
 * the two features still share one definition per field.
 *
 * `slug` uniqueness is checked live (see `checkSlug`) and re-checked
 * authoritatively on final submit — this schema only validates format.
 */

/** Wizard step count, for `@/packages/api`'s saveOnboardingStep to clamp an
 * autosave step index without depending on apps/app's UI-only step array
 * (titles/descriptions) — keep in sync with apps/app's `ONBOARDING_STEPS`. */
export const ONBOARDING_STEP_COUNT = 6;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Org slug: trimmed, length-bounded, lowercase/kebab format, and checked
 * against the reserved-word list. DB uniqueness is verified elsewhere.
 */
const slugSchema = Schema.Trim.pipe(
  Schema.check(Schema.isMinLength(3, { message: "At least 3 characters" })),
  Schema.check(
    Schema.isMaxLength(32, { message: "Keep it under 32 characters" })
  ),
  Schema.check(
    Schema.isPattern(SLUG_PATTERN, {
      message: "Use lowercase letters, numbers and hyphens",
    })
  ),
  Schema.check(
    Schema.makeFilter((value) => !isReservedSlug(value), {
      message: "This slug is reserved",
    })
  )
);

export const organizationDetailsSchema = Schema.Struct({
  contact_email: optionalEmail,
  industry: Schema.String.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Select an industry" }))
  ),
  slug: slugSchema,
  timezone: Schema.String.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Select a timezone" }))
  ),
  website: optionalUrl,
});

/**
 * Cross-field postal check, shared by the step schema and the merged form
 * schema (a single flat `Schema.Struct` can't apply a filter until it's
 * fully composed). Path-scoped so the error lands on the postal field.
 */
const postalMatchesCountry = (value: {
  readonly address_postal_code: string;
  readonly country: string;
}) =>
  isValidPostalCode(value.address_postal_code, value.country)
    ? undefined
    : {
        issue: "Enter a valid postal code for the selected country",
        path: ["addressPostalCode"] as const,
      };

/**
 * The org's registered business address (+ org phone). line1/city/postal/
 * country are required — they feed Stripe invoicing; line2/state are optional.
 * `country` lives here (not in `organizationDetailsSchema`) since it's the
 * address country — one value, never two diverging ones.
 */
export const businessAddressFields = Schema.Struct({
  address_city: Schema.Trim.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Enter a city" })),
    Schema.check(Schema.isMaxLength(100))
  ),
  address_line1: Schema.Trim.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Enter a street address" })),
    Schema.check(Schema.isMaxLength(200))
  ),
  address_line2: Schema.String.pipe(Schema.check(Schema.isMaxLength(200))),
  address_postal_code: Schema.Trim.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Enter a postal code" })),
    Schema.check(Schema.isMaxLength(20))
  ),
  address_state: Schema.String.pipe(Schema.check(Schema.isMaxLength(100))),
  country: Schema.String.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Select a country" }))
  ),
  // Optional — the organization's phone (distinct from the user's own).
  phone: optionalPhone,
});

export const businessAddressSchema = businessAddressFields.pipe(
  Schema.check(Schema.makeFilter(postalMatchesCountry))
);

export const brandingSchema = Schema.Struct({
  logo_url: optionalUrl,
  primary_color: Schema.String.pipe(
    Schema.check(
      Schema.isPattern(/^#[0-9a-fA-F]{6}$/, {
        message: "Use a 6-digit hex color, e.g. #4F46E5",
      })
    )
  ),
});

/**
 * The signed-in user's own profile, collected first so the rest of the app
 * has a name, locale, and avatar to render. Postgres is the source of truth
 * for all five fields (`users` table) — `updateProfile`/`save` write them
 * straight to the DB; WorkOS is no longer written to for name.
 */
export const profileSchema = Schema.Struct({
  avatar_url: optionalUrl,
  first_name: Schema.Trim.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Enter your first name" })),
    Schema.check(Schema.isMaxLength(100))
  ),
  last_name: Schema.Trim.pipe(
    Schema.check(Schema.isMinLength(1, { message: "Enter your last name" })),
    Schema.check(Schema.isMaxLength(100))
  ),
  locale: Schema.String.pipe(
    Schema.check(Schema.isMinLength(2, { message: "Select a language" }))
  ),
  // Optional — powers SMS notification channels when provided.
  phone_number: optionalPhone,
});

/**
 * One teammate-invite row in the onboarding "Invite your team" step. An empty
 * email is allowed (a blank/extra row the user didn't fill in) and dropped on
 * submit; a non-empty value must be a valid email. The seat cap is enforced by
 * limiting how many rows can be added, plus an authoritative server check.
 * Not a table — WorkOS invitations have no DB row.
 */
const inviteRowSchema = Schema.Struct({
  email: optionalEmail,
  role: Schema.String.pipe(Schema.check(Schema.isMinLength(1))),
});
export type InviteRow = Schema.Schema.Type<typeof inviteSchema>;

export const inviteSchema = Schema.Struct({
  invites: Schema.mutable(Schema.Array(inviteRowSchema)),
});

// A flat `Schema.Struct` built from every sub-schema's `.fields` (rather
// than nesting `Schema.extend` several levels deep) — the nested form blows
// past TypeScript's inference depth and silently widens every field to
// `unknown` at every consumer.
export const onboardingSchema = Schema.Struct({
  ...organizationDetailsSchema.fields,
  ...businessAddressFields.fields,
  ...brandingSchema.fields,
  ...profileSchema.fields,
  ...inviteSchema.fields,
}).pipe(Schema.check(Schema.makeFilter(postalMatchesCountry)));

export type OrganizationDetailsValues = Schema.Schema.Type<
  typeof organizationDetailsSchema
>;
export type BusinessAddressValues = Schema.Schema.Type<
  typeof businessAddressSchema
>;
export type BrandingValues = Schema.Schema.Type<typeof brandingSchema>;
export type ProfileValues = Schema.Schema.Type<typeof profileSchema>;
export type InviteRowValues = Schema.Schema.Type<typeof inviteRowSchema>;
export type OnboardingValues = Schema.Schema.Type<typeof onboardingSchema>;
