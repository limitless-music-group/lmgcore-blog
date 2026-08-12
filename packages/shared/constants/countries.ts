import { allCountries } from "country-region-data";

/**
 * Countries + regions for address forms, derived from `country-region-data`
 * (full ISO-3166 set) instead of a hand-maintained list. Values are ISO-2
 * shortcodes — exactly what Stripe's `AddressParam.country` expects.
 */

export interface SelectOption {
  label: string;
  value: string;
}

/** Every ISO-3166 country as `{ label: name, value: ISO-2 }`, dataset order. */
export const COUNTRY_OPTIONS: SelectOption[] = allCountries.map(
  ([name, code]) => ({ label: name, value: code })
);

/** Country display name for an ISO-2 code; falls back to the code itself. */
export const countryLabelFor = (code: string): string =>
  COUNTRY_OPTIONS.find((option) => option.value === code)?.label ?? code;

/**
 * States/provinces/regions of a country as select options (empty when the
 * country is unknown). Values are the region shortcodes (e.g. "CA" for
 * California) so stored state values stay compact and Stripe-friendly.
 */
export const regionOptionsFor = (countryCode: string): SelectOption[] => {
  const country = allCountries.find(([, code]) => code === countryCode);
  if (!country) {
    return [];
  }
  const [, , regions] = country;
  return regions.map(([name, shortCode]) => ({
    label: name,
    value: shortCode || name,
  }));
};
