import { Schema, Struct } from "effect";
import { isValidPostalCode } from "../utils/postal";
import {
  brandingSchema,
  businessAddressFields,
  organizationDetailsSchema,
} from "./onboarding.schema";

/**
 * Editable organization settings. `name` and `slug` are permanent (set at
 * creation/onboarding) and deliberately excluded.
 *
 * The business address, org details (minus slug), and branding portions are
 * the exact same hand-typed sub-schemas `onboarding.schema.ts` composes its
 * own wizard schema from — one definition per field, reused by both
 * features via `.fields` spreads, not re-declared. Shipping + tax are
 * settings-only fields, hand-typed here; `shipping_same_as_address` is the
 * one settings-only field that isn't a DB column at all (`shipping_line1 IS
 * NULL` in the DB means "same as business address" — this flag is how the
 * form expresses that before it's saved).
 */

const shippingFields = Schema.Struct({
  shipping_city: Schema.String.pipe(Schema.check(Schema.isMaxLength(100))),
  shipping_country: Schema.String,
  shipping_line1: Schema.String.pipe(Schema.check(Schema.isMaxLength(200))),
  shipping_line2: Schema.String.pipe(Schema.check(Schema.isMaxLength(200))),
  shipping_name: Schema.String.pipe(Schema.check(Schema.isMaxLength(150))),
  shipping_postal_code: Schema.String.pipe(
    Schema.check(Schema.isMaxLength(20))
  ),
  shipping_state: Schema.String.pipe(Schema.check(Schema.isMaxLength(100))),
});

const taxFields = Schema.Struct({
  tax_exempt: Schema.Literals(["none", "exempt", "reverse"]),
  tax_id: Schema.String.pipe(Schema.check(Schema.isMaxLength(50))),
  tax_id_type: Schema.String,
});

const shippingSameAsAddressField = Schema.Struct({
  shipping_same_as_address: Schema.Boolean,
});

interface CrossFieldShape {
  readonly address_postal_code: string;
  readonly country: string;
  readonly shipping_city: string;
  readonly shipping_country: string;
  readonly shipping_line1: string;
  readonly shipping_postal_code: string;
  readonly shipping_same_as_address: boolean;
  readonly tax_id: string;
  readonly tax_id_type: string;
}

interface SchemaIssue {
  readonly issue: string;
  readonly path: readonly [string];
}

/** Cross-field checks, each reported on the field it belongs to. Can't live
 * in the table's `refine` map — these span columns, and one of them isn't a
 * column at all. */
const crossFieldIssues = (value: CrossFieldShape) => {
  const issues: SchemaIssue[] = [];
  if (!isValidPostalCode(value.address_postal_code, value.country)) {
    issues.push({
      issue: "Enter a valid postal code for the selected country",
      path: ["address_postal_code"],
    });
  }
  if (!value.shipping_same_as_address) {
    if (!value.shipping_line1.trim()) {
      issues.push({
        issue: "Enter a street address",
        path: ["shipping_line1"],
      });
    }
    if (!value.shipping_city.trim()) {
      issues.push({ issue: "Enter a city", path: ["shipping_city"] });
    }
    if (!value.shipping_postal_code.trim()) {
      issues.push({
        issue: "Enter a postal code",
        path: ["shipping_postal_code"],
      });
    } else if (
      !isValidPostalCode(value.shipping_postal_code, value.shipping_country)
    ) {
      issues.push({
        issue: "Enter a valid postal code for the selected country",
        path: ["shipping_postal_code"],
      });
    }
    if (!value.shipping_country) {
      issues.push({
        issue: "Select a country",
        path: ["shipping_country"],
      });
    }
  }
  if (value.tax_id.trim() && !value.tax_id_type) {
    issues.push({ issue: "Select a tax ID type", path: ["tax_id_type"] });
  }
  if (value.tax_id_type && !value.tax_id.trim()) {
    issues.push({ issue: "Enter the tax ID", path: ["tax_id"] });
  }
  return issues.length === 0 ? undefined : issues;
};

// A flat `Schema.Struct` built from every sub-schema's `.fields` (rather than
// nesting `Schema.extend` 5 levels deep) — the nested form blows past
// TypeScript's inference depth and silently widens every field to `unknown`
// at every consumer. See `onboarding.schema.ts`'s `onboardingSchema` for the
// same fix.
export const orgSettingsSchema = Schema.Struct({
  ...organizationDetailsSchema.mapFields(Struct.omit(["slug"])).fields,
  //   ...organizationDetailsSchema.omit("slug").fields,
  ...businessAddressFields.fields,
  ...brandingSchema.fields,
  ...shippingFields.fields,
  ...taxFields.fields,
  ...shippingSameAsAddressField.fields,
}).pipe(Schema.check(Schema.makeFilter(crossFieldIssues)));

export type OrgSettingsValues = Schema.Schema.Type<typeof orgSettingsSchema>;
