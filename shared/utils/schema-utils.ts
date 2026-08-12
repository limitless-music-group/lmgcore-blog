import { Schema } from "effect";
import { isValidPhoneNumber } from "libphonenumber-js";

const URL_PATTERN = /^https?:\/\/.+/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The optional variants below are single filtered strings, NOT
 * `Schema.Union([strict, Schema.Literal("")])`: a failed union reports every
 * branch, so form errors read as the real message PLUS a noisy
 * `Expected "", actual "…"` from the empty-string branch. One filter with one
 * message keeps the form error human.
 */

/** Strict URL matcher (non-empty). Use `optionalUrl` for optional fields. */
export const strictUrl = Schema.String.pipe(
  Schema.check(
    Schema.isPattern(URL_PATTERN, {
      message: "Enter a valid URL (https://…)",
    })
  )
);

/**
 * Comma-separated list of URLs (non-empty), e.g. a CORS_ORIGIN env var
 * allowing multiple origins. Each segment is validated independently so one
 * malformed entry fails the whole value instead of silently no-op'ing.
 */
export const strictUrlList = Schema.String.pipe(
  Schema.check(
    Schema.makeFilter(
      (value) =>
        value.split(",").every((origin) => URL_PATTERN.test(origin.trim())),
      { message: "Enter a comma-separated list of valid URLs (https://…)" }
    )
  )
);

/** URL field that also accepts an empty string (untouched/optional field). */
export const optionalUrl = Schema.optional(
  Schema.String.pipe(
    Schema.check(
      Schema.makeFilter((value) => value === "" || URL_PATTERN.test(value), {
        message: "Enter a valid URL (https://…)",
      })
    )
  )
);

/** Strict email matcher (non-empty). Use `optionalEmail` for optional fields. */
export const strictEmail = Schema.String.pipe(
  Schema.check(
    Schema.isPattern(EMAIL_PATTERN, { message: "Enter a valid email" })
  )
);

/** Email field that also accepts an empty string (untouched/optional field). */
export const optionalEmail = Schema.optional(
  Schema.String.pipe(
    Schema.check(
      Schema.makeFilter((value) => value === "" || EMAIL_PATTERN.test(value), {
        message: "Enter a valid email",
      })
    )
  )
);

/**
 * Strict phone matcher (non-empty) — real libphonenumber validation of the
 * dial-code + national format `FormPhoneInput` emits ("+1 (555) 123-4567").
 * Normalize with `toE164` (utils/phone) before sending to external systems.
 */
export const strictPhone = Schema.String.pipe(
  Schema.check(
    Schema.makeFilter((value) => isValidPhoneNumber(value), {
      message: "Enter a valid phone number",
    })
  )
);

/** Phone field that also accepts an empty string (untouched/optional field). */
export const optionalPhone = Schema.String.pipe(
  Schema.check(
    Schema.makeFilter((value) => value === "" || isValidPhoneNumber(value), {
      message: "Enter a valid phone number",
    })
  )
);

export const NodeEnvSchema = Schema.Literals([
  "development",
  "production",
  "test",
]);
