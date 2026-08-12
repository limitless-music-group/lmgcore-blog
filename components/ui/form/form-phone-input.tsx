"use client";

import {
  AsYouType,
  type CountryCode,
  getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

const COUNTRY_CODES: { code: string; label: string; country: CountryCode }[] = [
  { code: "+1", country: "US", label: "🇺🇸 +1" },
  { code: "+1", country: "CA", label: "🇨🇦 +1" },
  { code: "+44", country: "GB", label: "🇬🇧 +44" },
  { code: "+49", country: "DE", label: "🇩🇪 +49" },
  { code: "+33", country: "FR", label: "🇫🇷 +33" },
  { code: "+39", country: "IT", label: "🇮🇹 +39" },
  { code: "+34", country: "ES", label: "🇪🇸 +34" },
  { code: "+81", country: "JP", label: "🇯🇵 +81" },
  { code: "+82", country: "KR", label: "🇰🇷 +82" },
  { code: "+86", country: "CN", label: "🇨🇳 +86" },
  { code: "+91", country: "IN", label: "🇮🇳 +91" },
  { code: "+55", country: "BR", label: "🇧🇷 +55" },
  { code: "+52", country: "MX", label: "🇲🇽 +52" },
  { code: "+61", country: "AU", label: "🇦🇺 +61" },
  { code: "+27", country: "ZA", label: "🇿🇦 +27" },
  { code: "+234", country: "NG", label: "🇳🇬 +234" },
  { code: "+20", country: "EG", label: "🇪🇬 +20" },
  { code: "+971", country: "AE", label: "🇦🇪 +971" },
];

function getDialCode(country: CountryCode): string {
  return COUNTRY_CODES.find((c) => c.country === country)?.code ?? "+1";
}

function getExampleFormatted(country: CountryCode): string {
  try {
    return getExampleNumber(country, examples)?.formatNational() ?? "";
  } catch {
    return "";
  }
}

function getPlaceholder(country: CountryCode): string {
  return getExampleFormatted(country);
}

function getMaxLength(country: CountryCode): number {
  const formatted = getExampleFormatted(country);
  // Add a small buffer (+2) for countries where some numbers are slightly longer
  return formatted.length ? formatted.length + 2 : 20;
}

function formatAsYouType(country: CountryCode, input: string): string {
  return new AsYouType(country).input(input);
}

function splitPhone(full: string): { country: CountryCode; national: string } {
  for (const c of COUNTRY_CODES) {
    if (full.startsWith(c.code)) {
      return {
        country: c.country,
        national: full.slice(c.code.length).trim(),
      };
    }
  }
  return { country: "US", national: full };
}

export function FormPhoneInput(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const { country: initialCountry, national: initialNational } = splitPhone(
    field.state.value ?? ""
  );
  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [displayValue, setDisplayValue] = useState(initialNational);

  const handleCountryChange = useCallback(
    (next: string) => {
      const c = next as CountryCode;
      setCountry(c);
      // Re-format existing number for new country
      const digits = displayValue.replace(/\D/g, "");
      const formatted = digits ? formatAsYouType(c, digits) : "";
      setDisplayValue(formatted);
      field.handleChange(
        formatted ? `${getDialCode(c)} ${formatted}`.trim() : ""
      );
    },
    [displayValue, field]
  );

  const handleNumberChange = useCallback(
    (raw: string) => {
      const formatted = formatAsYouType(country, raw);
      setDisplayValue(formatted);
      field.handleChange(
        formatted ? `${getDialCode(country)} ${formatted}`.trim() : ""
      );
    },
    [country, field]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => handleNumberChange(e.target.value),
    [handleNumberChange]
  );

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupAddon align="inline-start" className="p-0">
          <Select onValueChange={handleCountryChange} value={country}>
            <SelectTrigger
              aria-invalid={isInvalid}
              className="h-full w-28 rounded-none rounded-l-md border-0 border-r shadow-none focus:ring-0"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((c) => (
                <SelectItem key={c.country} value={c.country}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputGroupAddon>
        <InputGroupInput
          aria-invalid={isInvalid}
          id={field.name}
          maxLength={getMaxLength(country)}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={handleInputChange}
          placeholder={getPlaceholder(country)}
          type="tel"
          value={displayValue}
        />
      </InputGroup>
    </FormBase>
  );
}
