import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Generic HMAC-SHA256 sign/verify pair for links that must only work for the
 * payload they were issued for (e.g. a public form link mailed to one
 * customer). Pure `node:crypto`, no framework imports, secret passed in by
 * the caller — safe to import from any runtime (a Next.js app, the
 * standalone workflow runner, etc).
 */

export const signPayload = (secret: string, payload: string): string =>
  createHmac("sha256", secret).update(payload).digest("hex");

export const verifyPayload = (
  secret: string,
  payload: string,
  token: string
): boolean => {
  const expected = Buffer.from(signPayload(secret, payload));
  const provided = Buffer.from(token);
  return (
    expected.length === provided.length && timingSafeEqual(expected, provided)
  );
};
