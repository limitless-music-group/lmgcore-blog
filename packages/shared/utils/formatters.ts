export const formatDateString = (value?: string | null) => {
  if (!value) {
    return "Never";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Never";
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
};
const regex = /[_\-.]+/;
/**
 * Turn a Stripe entitlement feature lookup_key into a human label.
 * e.g. "advanced_analytics" → "Advanced Analytics",
 *      "feature:max_seats" → "Max Seats".
 */
export function formatFeature(feature: string): string {
  const slug = feature.includes(":")
    ? feature.slice(feature.indexOf(":") + 1)
    : feature;
  return slug
    .split(regex)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatOrgRole(role: string | null): string | null {
  const slug = role?.startsWith("org:") ? role.slice(4) : role;
  if (!slug) {
    return null;
  }
  return slug
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const LINE_SEP = String.fromCharCode(0x20_28);
const PARA_SEP = String.fromCharCode(0x20_29);

export function escapeJsonForHtml(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replaceAll(LINE_SEP, "\\u2028")
    .replaceAll(PARA_SEP, "\\u2029");
}

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(cents / 100);
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];
// Decimal (SI) units to match the labels above and how plan quotas are sold —
// a 5 TB (5e12-byte) cap must render as "5.0 TB", not the binary 4.5.
const BYTE_UNIT_FACTOR = 1000;

export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(BYTE_UNIT_FACTOR)),
    BYTE_UNITS.length - 1
  );
  const value = bytes / BYTE_UNIT_FACTOR ** exponent;
  const digits = exponent === 0 ? 0 : fractionDigits;
  return `${value.toFixed(digits)} ${BYTE_UNITS[exponent]}`;
}

const WHITESPACE = /\s+/;

/**
 * Up-to-two-letter initials for an avatar fallback. Prefers the person's name
 * (first + last initial, or the first two letters of a single name) and falls
 * back to the first two letters of the email's local part. The single source of
 * truth for member/owner/share-recipient avatars across the app.
 */
export function initials(name: string, email: string): string {
  const trimmed = name.trim();
  if (trimmed) {
    const parts = trimmed.split(WHITESPACE);
    if (parts.length >= 2) {
      return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
    }
    return (parts[0] ?? "").slice(0, 2).toUpperCase();
  }
  return (email.split("@")[0] ?? "").slice(0, 2).toUpperCase();
}

/**
 * Date-only formatter. Takes a Unix timestamp in **milliseconds** — the app's
 * native unit (Convex `_creationTime`/`updated_at`, `Date.now()`, `Date.parse`).
 * e.g. "June 15, 2026". Returns "-" for missing/invalid values.
 */
export function formatDate(unixMs: number) {
  if (!Number.isFinite(unixMs) || unixMs <= 0) {
    return "-";
  }
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(unixMs));
}
export function formatBlogDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Exact timestamp down to the second, rendered in the given IANA time zone
 * (e.g. the org's `timezone` column like "America/New_York"). Shows the zone
 * abbreviation so it's unambiguous, e.g. "Jun 15, 2026, 3:00:07 PM EST".
 * Falls back to the viewer's local zone when `timeZone` is unset/invalid.
 */
export function formatExactTime(unixSeconds: number, timeZone?: string | null) {
  if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) {
    return "-";
  }
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "short",
    second: "2-digit",
    timeZoneName: "short",
    year: "numeric",
  };
  const date = new Date(unixSeconds * 1000);
  try {
    return new Intl.DateTimeFormat("en-US", {
      ...options,
      timeZone: timeZone ?? undefined,
    }).format(date);
  } catch {
    // Invalid/unknown time zone → local time.
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "3:21" from a track's second count. Floors first — a raw `audio.duration`
 * read off the element is a float (e.g. `156.0000000210`), and an unfloored
 * `% 60` leaks those fractional digits straight into the seconds string. */
export function formatDuration(totalSec: number): string {
  const safeSec = Math.floor(totalSec);
  const minutes = Math.floor(safeSec / 60);
  const seconds = safeSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** "27 min" total runtime across a tracklist. Takes total seconds as a
 * plain number, not a track array keyed on `duration_sec` — that DB column
 * is always 0 (no server-side audio-duration extraction exists), so
 * callers must sum real, client-read durations themselves. */
export function formatRuntime(totalSec: number): string {
  return `${Math.round(totalSec / 60)} min`;
}

/** "12 songs, 45 minutes" / "12 songs, 1 hour 20 minutes" — the release
 * preview sheet's footer summary line. Takes the track count and total
 * seconds as plain numbers (not a track array keyed on `duration_sec`) —
 * that DB column is always 0 (no server-side audio-duration extraction
 * exists), so callers must sum real, client-read durations themselves and
 * pass the total in here. */
export function formatAlbumRuntime(
  trackCount: number,
  totalSec: number
): string {
  const totalMinutes = Math.round(totalSec / 60);
  const songLabel = trackCount === 1 ? "song" : "songs";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const minuteLabel = minutes === 1 ? "minute" : "minutes";

  if (hours === 0) {
    return `${trackCount} ${songLabel}, ${minutes} ${minuteLabel}`;
  }

  const hourLabel = hours === 1 ? "hour" : "hours";
  return minutes === 0
    ? `${trackCount} ${songLabel}, ${hours} ${hourLabel}`
    : `${trackCount} ${songLabel}, ${hours} ${hourLabel} ${minutes} ${minuteLabel}`;
}

export function formatName(user: {
  firstName: string | null;
  lastName: string | null;
}) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.lastName ?? user.firstName ?? "";
}

export function toIso(unixSeconds: number | null | undefined): string | null {
  return typeof unixSeconds === "number" && unixSeconds > 0
    ? new Date(unixSeconds * 1000).toISOString()
    : null;
}

export const slugify = (text: string) => {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Suffix keeps the seed slug unique (the org row's slug is unique); onboarding;
  // lets the owner pick the final workspace URL.
  //   const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "org"}`;
};

// AUDIT_META labels read as verb phrases ("updated metadata"); capitalize the
// first letter so they sit well as standalone filter options.
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
