import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * "+1 (555) 123-4567" → "+15551234567" — the E.164 form external systems
 * (Knock SMS, telephony providers) expect. The DB keeps the human-formatted
 * value `FormPhoneInput` produced; convert at the boundary. Returns undefined
 * when the input can't be parsed as a phone number.
 */
export const toE164 = (phone: string): string | undefined =>
  parsePhoneNumberFromString(phone)?.number;

/**
 * "+15551234567" → "+1 555 123 4567" — the human display format the DB keeps.
 * Falls back to the input when it can't be parsed.
 */
export const toDisplayPhone = (phone: string): string =>
  parsePhoneNumberFromString(phone)?.formatInternational() ?? phone;

/**
 * True when two human-formatted values denote different numbers. Compares in
 * E.164 so "+1 (555) 123-4567" and "+1 555 123 4567" read as the SAME number
 * — a raw string compare would falsely reset phone verification whenever a
 * form re-saves the number in a different display format. ""/null/undefined
 * all mean "no phone"; unparseable values fall back to a raw compare.
 */
export const phoneChanged = (
  a: string | null | undefined,
  b: string | null | undefined
): boolean => {
  const normalizedA = a ? (toE164(a) ?? a) : null;
  const normalizedB = b ? (toE164(b) ?? b) : null;
  return normalizedA !== normalizedB;
};
