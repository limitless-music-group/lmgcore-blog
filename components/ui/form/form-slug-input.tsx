"use client";

import {
  isReservedSlug,
  type SlugStatus,
} from "@packages/shared/constants/reserved-slugs";
import { joyful } from "joyful";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { AppIcons } from "../app-icons";
import { Button } from "../button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Spinner } from "../spinner";
import { FormBase, type FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

const DEBOUNCE_MS = 500;
const SLUG_MIN = 3;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LEADING_HYPHENS = /^-+/;
const INVALID_CHARS = /[^a-z0-9-]+/g;
const REPEATED_HYPHENS = /-{2,}/g;

/** Default candidate generator when the caller doesn't supply one — a
 * friendly three-word combo, e.g. "amber-fox-bar". */
function defaultGenerateCandidate(): string {
  return joyful({ segments: 3 });
}

/** Normalize typed input toward a valid slug without fighting the user. */
function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(INVALID_CHARS, "-")
    .replace(REPEATED_HYPHENS, "-")
    .replace(LEADING_HYPHENS, "");
}

function hasValidFormat(slug: string): boolean {
  return slug.length >= SLUG_MIN && SLUG_PATTERN.test(slug);
}

export type SlugAvailabilityStatus = SlugStatus | undefined;

/**
 * FormSlugInput — a slug input with live server-side availability. Normalizes
 * typed input to a valid slug, short-circuits obviously-reserved words
 * client-side (no round-trip needed), then debounces `checkAvailability` for
 * everything else. Format errors come from the form schema (handled by
 * `FormBase`); "taken"/"reserved" can only be known once checked, so they're
 * shown here and gate navigation via `onAvailabilityChange`. `checkAvailability`
 * is injected by the caller — this component has no opinion on what kind of
 * slug it is (org, project, ...) or where it's checked, beyond the shared
 * reserved-word list.
 *
 * A "Generate" button is always available, producing a random candidate (or
 * the caller's own `onGenerate`, e.g. derived from a name field already on
 * the form) and running it straight through the same normalize + availability
 * pipeline as typed input.
 */
export interface SlugCheckResult {
  status: SlugAvailabilityStatus;
  value: string;
}

export function FormSlugInput({
  placeholder,
  checkAvailability,
  onAvailabilityChange,
  onGenerate,
  cachedCheck,
  onCheck,
  availableMessage = "That value is available.",
  reservedMessage = "That value is reserved and can't be used.",
  takenMessage = "That value is already taken.",
  ...props
}: FormControlProps & {
  placeholder?: string;
  checkAvailability: (slug: string) => Promise<SlugAvailabilityStatus>;
  /** Reports current availability up so a caller (e.g. a wizard) can gate
   * navigation. Called with `null` while unknown/pending. */
  onAvailabilityChange?: (available: boolean | null) => void;
  /** Produces a candidate slug for the "Generate" button. Defaults to a
   * random adjective-noun-number combo when omitted. */
  onGenerate?: () => string;
  /** A previously-resolved check for this exact value, supplied by a caller
   * that wants the result to survive this component unmounting/remounting
   * (e.g. a multi-step wizard where each step is conditionally rendered, so
   * revisiting a step remounts it and would otherwise re-run the check for a
   * value that was already confirmed). Used only when `cachedCheck.value`
   * still matches the current field value. */
  cachedCheck?: SlugCheckResult;
  /** Reports every freshly-resolved check (not cache hits, and not the
   * client-side reserved-word short-circuit), so a caller can persist it for
   * `cachedCheck` on a future mount. */
  onCheck?: (result: SlugCheckResult) => void;
  availableMessage?: string;
  reservedMessage?: string;
  takenMessage?: string;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const { value } = field.state;

  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);

  const [status, setStatus] = useState<SlugAvailabilityStatus>(() =>
    cachedCheck?.value === value ? cachedCheck.status : undefined
  );
  const [checking, setChecking] = useState(false);

  // Only query once the format is plausible; otherwise the schema handles it.
  useEffect(() => {
    if (!hasValidFormat(debounced)) {
      setStatus(undefined);
      setChecking(false);
      return;
    }
    // Already know the answer for this exact value (e.g. this component just
    // remounted after a step switch, but nothing about the slug changed) —
    // skip the round-trip entirely instead of re-checking.
    if (cachedCheck?.value === debounced) {
      setStatus(cachedCheck.status);
      setChecking(false);
      return;
    }
    // Reserved words are known client-side (shared constant) — no need to
    // wait on a round-trip just to tell the user "admin" is taken by nobody.
    if (isReservedSlug(debounced)) {
      setStatus("reserved");
      setChecking(false);
      return;
    }
    let active = true;
    setChecking(true);
    checkAvailability(debounced)
      .then((result) => {
        if (!active) {
          return;
        }
        setStatus(result);
        setChecking(false);
        onCheck?.({ status: result, value: debounced });
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setStatus(undefined);
        setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [debounced, checkAvailability, cachedCheck, onCheck]);

  useEffect(() => {
    if (!onAvailabilityChange) {
      return;
    }
    if (!hasValidFormat(value)) {
      onAvailabilityChange(null);
      return;
    }
    if (value !== debounced || checking || status === undefined) {
      onAvailabilityChange(null);
      return;
    }
    onAvailabilityChange(status === "available");
  }, [value, debounced, checking, status, onAvailabilityChange]);

  const showReserved = status === "reserved" && !isInvalid;
  const showTaken = status === "taken" && !isInvalid;
  const showAvailable =
    status === "available" && !isInvalid && value === debounced;
  const statusMessage = showReserved ? reservedMessage : takenMessage;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      field.handleChange(toSlug(e.target.value)),
    [field]
  );

  const handleGenerate = useCallback(() => {
    const candidate = (onGenerate ?? defaultGenerateCandidate)();
    field.handleChange(toSlug(candidate));
  }, [field, onGenerate]);

  return (
    <FormBase {...props}>
      <InputGroup>
         <InputGroupAddon align="inline-start" className="border-r h-full pr-3 text-muted-foreground text-sm">
          {checking ? (
            <Spinner className="size-4 text-muted-foreground" />
          ) : null}
          {showAvailable ? (
            <AppIcons.Common.Check className="size-4 text-emerald-600" />
          ) : null}
        </InputGroupAddon>
        <InputGroupInput
          aria-invalid={isInvalid || showTaken || showReserved}
          className="border-0 shadow-none focus-visible:ring-0"
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          value={value}
        />
       
        <InputGroupAddon align="inline-end">
          <Button
            aria-label="Generate a suggestion"
            disabled={checking}
            onClick={handleGenerate}
            size="sm"
            type="button"
            variant="ghost"
          >
            <AppIcons.Common.Refresh className="size-3.5" />
            Generate Slug
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {(showTaken || showReserved) && !isInvalid ? (
        <p className="text-destructive text-sm">{statusMessage}</p>
      ) : null}
      {showAvailable ? (
        <p className="text-emerald-600 text-sm">{availableMessage}</p>
      ) : null}
    </FormBase>
  );
}
