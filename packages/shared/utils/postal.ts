import {
  postcodeValidator,
  postcodeValidatorExistsForCountry,
} from "postcode-validator";

/**
 * Validate a postal code against a country's known format. Countries the
 * dataset doesn't cover (or an empty country) pass — gaps in the validator
 * must never block a real address.
 */
export const isValidPostalCode = (code: string, country: string): boolean => {
  if (!(country && postcodeValidatorExistsForCountry(country))) {
    return true;
  }
  return postcodeValidator(code, country);
};
