/**
 * Tax options for org billing settings. Values mirror Stripe verbatim:
 * `TAX_EXEMPT_OPTIONS` → `Customer.tax_exempt`, `TAX_ID_TYPE_OPTIONS` →
 * `TaxIdCreateParams.Type`. The type list is a curated subset — Stripe's
 * full union is huge and grows; extend as customers need more.
 */

export const TAX_EXEMPT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Exempt", value: "exempt" },
  { label: "Reverse charge", value: "reverse" },
] as const;

export const TAX_ID_TYPE_OPTIONS = [
  { label: "Australia ABN", value: "au_abn" },
  { label: "Canada BN", value: "ca_bn" },
  { label: "Canada GST/HST", value: "ca_gst_hst" },
  { label: "EU VAT", value: "eu_vat" },
  { label: "India GST", value: "in_gst" },
  { label: "Japan Corporate Number", value: "jp_cn" },
  { label: "Mexico RFC", value: "mx_rfc" },
  { label: "New Zealand GST", value: "nz_gst" },
  { label: "Norway VAT", value: "no_vat" },
  { label: "Switzerland VAT", value: "ch_vat" },
  { label: "UK VAT", value: "gb_vat" },
  { label: "US EIN", value: "us_ein" },
] as const;
